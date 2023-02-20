import {
  ControllerIndex,
  DoorSlotFlag,
  GridEntityType,
  LevelCurse,
  LevelStage,
  ModCallback,
  RoomShape,
  RoomType,
  StageType,
} from "isaac-typescript-definitions";
import { game, musicManager } from "../../../core/cachedClasses";
import * as metadataJSON from "../../../customStageMetadata.json"; // This will correspond to "customStageMetadata.lua" at run-time.
import { Exported } from "../../../decorators";
import { ISCFeature } from "../../../enums/ISCFeature";
import { ModCallbackCustom } from "../../../enums/ModCallbackCustom";
import { UIStreakAnimation } from "../../../enums/private/UIStreakAnimation";
import { isArray } from "../../../functions/array";
import {
  doorSlotsToDoorSlotFlags,
  getDoorSlotsForRoomShape,
} from "../../../functions/doors";
import { hasFlag, removeFlag } from "../../../functions/flag";
import { logError } from "../../../functions/logMisc";
import { newRNG } from "../../../functions/rng";
import { removeUrnRewards } from "../../../functions/rockAlt";
import {
  getRoomDataForTypeVariant,
  getRoomsInsideGrid,
} from "../../../functions/rooms";
import { getMusicForStage } from "../../../functions/sound";
import { setStage } from "../../../functions/stage";
import { asNumber } from "../../../functions/types";
import {
  CustomStageLua,
  CustomStageRoomMetadata,
} from "../../../interfaces/CustomStageTSConfig";
import {
  CustomStage,
  RoomTypeMap,
} from "../../../interfaces/private/CustomStage";
import { Feature } from "../../private/Feature";
import { CustomGridEntities } from "../callbackLogic/CustomGridEntities";
import { GameReorderedCallbacks } from "../callbackLogic/GameReorderedCallbacks";
import { setCustomStageBackdrop } from "./customStages/backdrop";
import {
  CUSTOM_FLOOR_STAGE,
  CUSTOM_FLOOR_STAGE_TYPE,
  DEFAULT_BASE_STAGE,
  DEFAULT_BASE_STAGE_TYPE,
} from "./customStages/constants";
import {
  convertVanillaTrapdoors,
  setCustomDecorationGraphics,
  setCustomDoorGraphics,
  setCustomPitGraphics,
  setCustomRockGraphics,
} from "./customStages/gridEntities";
import { setShadows } from "./customStages/shadows";
import {
  streakTextGetShaderParams,
  streakTextPostRender,
  topStreakTextStart,
} from "./customStages/streakText";
import {
  getRandomBossRoomFromPool,
  getRandomCustomStageRoom,
} from "./customStages/utils";
import {
  playVersusScreenAnimation,
  versusScreenPostRender,
} from "./customStages/versusScreen";
import { CustomTrapdoors } from "./CustomTrapdoors";
import { DisableAllSound } from "./DisableAllSound";
import { Pause } from "./Pause";
import { RunInNFrames } from "./RunInNFrames";

/**
 * 60 does not work correctly (the music kicking in from stage -1 will mute it), so we use 70 to be
 * safe.
 */
const MUSIC_DELAY_RENDER_FRAMES = 70;

const v = {
  run: {
    currentCustomStage: null as CustomStage | null,

    /** Whether we are on e.g. Caves 1 or Caves 2. */
    firstFloor: true,

    showingBossVersusScreen: false,

    /** Values are the render frame that the controller first pressed the map button. */
    controllerIndexPushingMapRenderFrame: new Map<ControllerIndex, int>(),

    topStreakTextStartedRenderFrame: null as int | null,

    topStreakText: {
      animation: UIStreakAnimation.NONE,
      frame: 0,
      pauseFrame: false,
    },

    bottomStreakText: {
      animation: UIStreakAnimation.NONE,
      frame: 0,
      pauseFrame: false,
    },
  },
};

export class CustomStages extends Feature {
  /** @internal */
  public override v = v;

  /** Indexed by custom stage name. */
  private customStagesMap = new Map<string, CustomStage>();

  /** Indexed by room variant. */
  private customStageCachedRoomData = new Map<int, RoomConfig>();

  private customGridEntities: CustomGridEntities;
  private customTrapdoors: CustomTrapdoors;
  private disableAllSound: DisableAllSound;
  private gameReorderedCallbacks: GameReorderedCallbacks;
  private pause: Pause;
  private runInNFrames: RunInNFrames;

  /** @internal */
  constructor(
    customGridEntities: CustomGridEntities,
    customTrapdoors: CustomTrapdoors,
    disableAllSound: DisableAllSound,
    gameReorderedCallbacks: GameReorderedCallbacks,
    pause: Pause,
    runInNFrames: RunInNFrames,
  ) {
    super();

    this.featuresUsed = [
      ISCFeature.CUSTOM_GRID_ENTITIES,
      ISCFeature.CUSTOM_TRAPDOORS,
      ISCFeature.DISABLE_ALL_SOUND,
      ISCFeature.GAME_REORDERED_CALLBACKS,
      ISCFeature.PAUSE,
      ISCFeature.RUN_IN_N_FRAMES,
    ];

    this.callbacksUsed = [
      // 2
      [ModCallback.POST_RENDER, this.postRender],

      // 12
      [ModCallback.POST_CURSE_EVAL, this.postCurseEval],

      // 21
      [ModCallback.GET_SHADER_PARAMS, this.getShaderParams],
    ];

    this.customCallbacksUsed = [
      [
        ModCallbackCustom.POST_GRID_ENTITY_BROKEN,
        this.postGridEntityBrokenRockAlt,
        [GridEntityType.ROCK_ALT],
      ],
      [ModCallbackCustom.POST_GRID_ENTITY_INIT, this.postGridEntityInit],
      [ModCallbackCustom.POST_NEW_ROOM_REORDERED, this.postNewRoomReordered],
    ];

    this.customGridEntities = customGridEntities;
    this.customTrapdoors = customTrapdoors;
    this.disableAllSound = disableAllSound;
    this.gameReorderedCallbacks = gameReorderedCallbacks;
    this.pause = pause;
    this.runInNFrames = runInNFrames;

    this.initCustomStageMetadata();
  }

  private initCustomStageMetadata() {
    if (!isArray(metadataJSON)) {
      error(
        'The IsaacScript standard library attempted to read the custom stage metadata from the "customStageMetadata.lua" file, but it was not an array.',
      );
    }
    const customStagesLua = metadataJSON as CustomStageLua[];

    for (const customStageLua of customStagesLua) {
      this.initRoomTypeMap(customStageLua);
      this.initCustomTrapdoorDestination(customStageLua);
    }
  }

  private initRoomTypeMap(customStageLua: CustomStageLua) {
    const roomTypeMap = getRoomTypeMap(customStageLua);
    const customStage: CustomStage = {
      ...customStageLua,
      roomTypeMap,
    };
    this.customStagesMap.set(customStage.name, customStage);
  }

  private initCustomTrapdoorDestination(customStageLua: CustomStageLua) {
    this.customTrapdoors.registerCustomTrapdoorDestination(
      customStageLua.name,
      this.goToCustomStage,
    );
  }

  private goToCustomStage = (
    destinationName: string | undefined,
    destinationStage: LevelStage,
    _destinationStageType: StageType,
  ) => {
    if (destinationName === undefined) {
      error(
        "Failed to go to a custom stage since the custom trapdoors feature did not pass a destination name to the logic function.",
      );
    }

    const firstFloor = destinationStage === LevelStage.BASEMENT_1;
    this.setCustomStage(destinationName, firstFloor);
  };

  // ModCallback.POST_RENDER (2)
  private postRender = () => {
    const customStage = v.run.currentCustomStage;
    if (customStage === null) {
      return;
    }

    streakTextPostRender(this.v);
    versusScreenPostRender(this.v, this.pause, this.disableAllSound);
  };

  // ModCallback.POST_CURSE_EVAL (12)
  private postCurseEval = (
    curses: BitFlags<LevelCurse>,
  ): BitFlags<LevelCurse> | undefined => {
    const customStage = v.run.currentCustomStage;
    if (customStage === null) {
      return undefined;
    }

    // Prevent XL floors on custom stages, since the streak text will not work properly.
    if (hasFlag(curses, LevelCurse.LABYRINTH)) {
      return removeFlag(curses, LevelCurse.LABYRINTH);
    }

    return undefined;
  };

  // ModCallback.GET_SHADER_PARAMS (22)
  private getShaderParams = (
    shaderName: string,
  ): Record<string, unknown> | undefined => {
    const customStage = v.run.currentCustomStage;
    if (customStage === null) {
      return;
    }

    streakTextGetShaderParams(this.v, customStage, shaderName);
    return undefined;
  };

  // ModCallbackCustom.POST_GRID_ENTITY_BROKEN
  // GridEntityType.ROCK_ALT
  private postGridEntityBrokenRockAlt = (gridEntity: GridEntity) => {
    const customStage = v.run.currentCustomStage;
    if (customStage === null) {
      return;
    }

    // Assume that if the end-user does not have custom rock graphics specified, they want to keep
    // the vanilla urn reward functionality.
    if (customStage.rocksPNGPath === undefined) {
      return;
    }

    // On the bugged stage of -1, only urns will spawn, so we do not have to handle the case of
    // mushroom rewards, skull rewards, and so on.
    removeUrnRewards(gridEntity);
  };

  // ModCallbackCustom.POST_GRID_ENTITY_INIT
  private postGridEntityInit = (gridEntity: GridEntity) => {
    const customStage = v.run.currentCustomStage;
    if (customStage === null) {
      return;
    }

    // We only want to modify vanilla grid entities.
    if (this.customGridEntities.isCustomGridEntity(gridEntity)) {
      return;
    }

    setCustomDecorationGraphics(customStage, gridEntity);
    setCustomRockGraphics(customStage, gridEntity);
    setCustomPitGraphics(customStage, gridEntity);
    setCustomDoorGraphics(customStage, gridEntity);
    convertVanillaTrapdoors(
      customStage,
      gridEntity,
      v.run.firstFloor,
      this.customTrapdoors,
    );
  };

  // ModCallbackCustom.POST_NEW_ROOM_REORDERED
  private postNewRoomReordered = () => {
    const customStage = v.run.currentCustomStage;
    if (customStage === null) {
      return;
    }

    setCustomStageBackdrop(customStage);
    setShadows(customStage);
    playVersusScreenAnimation(
      this.v,
      customStage,
      this.disableAllSound,
      this.pause,
      this.runInNFrames,
    );
  };

  /** Pick a custom room for each vanilla room. */
  private setStageRoomsData(
    customStage: CustomStage,
    rng: RNG,
    verbose: boolean,
  ) {
    const level = game.GetLevel();
    const startingRoomGridIndex = level.GetStartingRoomIndex();

    for (const room of getRoomsInsideGrid()) {
      // The starting floor of each room should stay empty.
      if (room.SafeGridIndex === startingRoomGridIndex) {
        continue;
      }

      if (room.Data === undefined) {
        continue;
      }

      const roomType = room.Data.Type;
      const roomShapeMap = customStage.roomTypeMap.get(roomType);
      if (roomShapeMap === undefined) {
        // Only show errors for non-default room types. (We do not require that end-users provide
        // custom rooms for shops and other special rooms inside of their XML file.)
        if (roomType === RoomType.DEFAULT) {
          logError(
            `Failed to find any custom rooms for RoomType.${RoomType[roomType]} (${roomType}) for custom stage: ${customStage.name}`,
          );
        }
        continue;
      }

      const roomShape = room.Data.Shape;
      const roomDoorSlotFlagMap = roomShapeMap.get(roomShape);
      if (roomDoorSlotFlagMap === undefined) {
        logError(
          `Failed to find any custom rooms for RoomType.${RoomType[roomType]} (${roomType}) + RoomShape.${RoomShape[roomShape]} (${roomShape}) for custom stage: ${customStage.name}`,
        );
        continue;
      }

      const doorSlotFlags = room.Data.Doors;
      let roomsMetadata = roomDoorSlotFlagMap.get(doorSlotFlags);
      if (roomsMetadata === undefined) {
        // The custom stage does not have any rooms for the specific room type + room shape + door
        // slot combination. As a fallback, check to see if the custom stage has one or more rooms
        // for this specific room type + room shape + all doors.
        const allDoorSlots = getDoorSlotsForRoomShape(roomShape);
        const allDoorSlotFlags = doorSlotsToDoorSlotFlags(allDoorSlots);
        roomsMetadata = roomDoorSlotFlagMap.get(allDoorSlotFlags);
        if (roomsMetadata === undefined) {
          logError(
            `Failed to find any custom rooms for RoomType.${RoomType[roomType]} (${roomType}) + RoomShape.${RoomShape[roomShape]} (${roomShape}) + all doors enabled for custom stage: ${customStage.name}`,
          );
          continue;
        }
      }

      let randomRoom: CustomStageRoomMetadata;
      if (roomType === RoomType.BOSS) {
        if (customStage.bossPool === undefined) {
          continue;
        }

        randomRoom = getRandomBossRoomFromPool(
          roomsMetadata,
          customStage.bossPool,
          rng,
          verbose,
        );
      } else {
        randomRoom = getRandomCustomStageRoom(roomsMetadata, rng, verbose);
      }

      let newRoomData = this.customStageCachedRoomData.get(randomRoom.variant);
      if (newRoomData === undefined) {
        // We do not already have the room data for this room cached.
        newRoomData = getRoomDataForTypeVariant(
          roomType,
          randomRoom.variant,
          false, // Since we are going to multiple rooms, we cancel the transition.
          true, // The custom stage rooms are loaded inside of the "00.special rooms.stb" file.
        );
        if (newRoomData === undefined) {
          logError(
            `Failed to get the room data for room variant ${randomRoom.variant} for custom stage: ${customStage.name}`,
          );
          continue;
        }

        this.customStageCachedRoomData.set(randomRoom.variant, newRoomData);
      }

      room.Data = newRoomData;
    }
  }

  /**
   * Helper function to warp to a custom stage/level.
   *
   * Custom stages/levels must first be defined in the "tsconfig.json" file. See the documentation
   * for more details: https://isaacscript.github.io/main/custom-stages/
   *
   * In order to use this function, you must upgrade your mod with `ISCFeature.CUSTOM_STAGES`.
   *
   * @param name The name of the custom stage, corresponding to what is in the "tsconfig.json" file.
   * @param firstFloor Optional. Whether to go to the first floor or the second floor. For example,
   *                   if you have a custom stage emulating Caves, then the first floor would be
   *                   Caves 1, and the second floor would be Caves 2. Default is true.
   * @param streakText Optional. Whether to show the streak text at the top of the screen that
   *                   announces the name of the level. Default is true.
   * @param verbose Optional. Whether to log additional information about the rooms that are chosen.
   *                Default is false.
   */
  @Exported
  public setCustomStage(
    name: string,
    firstFloor = true,
    streakText = true,
    verbose = false,
  ): void {
    const customStage = this.customStagesMap.get(name);
    if (customStage === undefined) {
      error(
        `Failed to set the custom stage of "${name}" because it was not found in the custom stages map. (Try restarting IsaacScript / recompiling the mod / restarting the game, and try again. If that does not work, you probably forgot to define it in your "tsconfig.json" file.) See the website for more details on how to set up custom stages.`,
      );
    }

    const level = game.GetLevel();
    const stage = level.GetStage();
    const seeds = game.GetSeeds();
    const startSeed = seeds.GetStartSeed();
    const rng = newRNG(startSeed);

    v.run.currentCustomStage = customStage;
    v.run.firstFloor = firstFloor;

    // Before changing the stage, we have to revert the bugged stage, if necessary. This prevents
    // the bug where the backdrop will not spawn.
    if (stage === CUSTOM_FLOOR_STAGE) {
      level.SetStage(LevelStage.BASEMENT_1, StageType.ORIGINAL);
    }

    let baseStage: LevelStage =
      customStage.baseStage === undefined
        ? DEFAULT_BASE_STAGE
        : (customStage.baseStage as LevelStage);
    if (!firstFloor) {
      baseStage++; // eslint-disable-line isaacscript/strict-enums
    }

    const baseStageType: StageType =
      customStage.baseStageType === undefined
        ? DEFAULT_BASE_STAGE_TYPE
        : (customStage.baseStageType as StageType);

    // eslint-disable-next-line isaacscript/strict-enums
    const reseed = asNumber(stage) >= baseStage;

    setStage(baseStage, baseStageType, reseed);

    // As soon as we warp to the base stage, the base stage music will begin to play. Thus, we
    // temporarily mute all music.
    musicManager.Disable();

    this.setStageRoomsData(customStage, rng, verbose);

    // Set the stage to an invalid value, which will prevent the walls and floors from loading.
    const targetStage = CUSTOM_FLOOR_STAGE;
    const targetStageType = CUSTOM_FLOOR_STAGE_TYPE;
    level.SetStage(targetStage, targetStageType);
    this.gameReorderedCallbacks.reorderedCallbacksSetStage(
      targetStage,
      targetStageType,
    );

    // In vanilla, the streak text appears about when the pixelation has faded and while Isaac is
    // still laying on the ground. Unfortunately, we cannot exactly replicate the vanilla timing,
    // because the level text will bug out and smear the background if we play it from a
    // `POST_RENDER` callback. Thus, we run it on the next game frame as a workaround.
    if (streakText) {
      this.runInNFrames.runNextGameFrame(() => {
        topStreakTextStart(this.v);
      });
    }

    // The bugged stage will not have any music associated with it, so we must manually start to
    // play a track.
    const music =
      customStage.music === undefined
        ? getMusicForStage(baseStage, baseStageType)
        : Isaac.GetMusicIdByName(customStage.music);

    this.runInNFrames.runInNRenderFrames(() => {
      // By default, the `MusicManager.Play` method will play the music at max volume (1.0), which
      // is around twice as loud as the vanilla music plays.
      musicManager.Enable();
      musicManager.Crossfade(music);
    }, MUSIC_DELAY_RENDER_FRAMES);

    // We must reload the current room in order for the `Level.SetStage` method to take effect.
    // Furthermore, we need to cancel the queued warp to the `GridRoom.DEBUG` room. We can
    // accomplish both of these things by initiating a room transition to an arbitrary room.
    // However, we rely on the parent function to do this, since for normal purposes, we need to
    // initiate a room transition for the pixelation effect.
  }

  /**
   * Helper function to disable the custom stage. This is typically called before taking the player
   * to a vanilla floor.
   *
   * In order to use this function, you must upgrade your mod with `ISCFeature.CUSTOM_STAGES`.
   */
  @Exported
  public disableCustomStage(): void {
    v.run.currentCustomStage = null;
  }
}

function getRoomTypeMap(customStageLua: CustomStageLua): RoomTypeMap {
  const roomTypeMap = new Map<
    RoomType,
    Map<RoomShape, Map<DoorSlotFlag, CustomStageRoomMetadata[]>>
  >();

  for (const roomMetadata of customStageLua.roomsMetadata) {
    const roomType = roomMetadata.type as RoomType;

    let roomShapeMap = roomTypeMap.get(roomType);
    if (roomShapeMap === undefined) {
      roomShapeMap = new Map<
        RoomShape,
        Map<DoorSlotFlag, CustomStageRoomMetadata[]>
      >();
      roomTypeMap.set(roomType, roomShapeMap);
    }

    const roomShape = roomMetadata.shape as RoomShape;

    let roomDoorSlotFlagMap = roomShapeMap.get(roomShape);
    if (roomDoorSlotFlagMap === undefined) {
      roomDoorSlotFlagMap = new Map<
        BitFlags<DoorSlotFlag>,
        CustomStageRoomMetadata[]
      >();
      roomShapeMap.set(roomShape, roomDoorSlotFlagMap);
    }

    const doorSlotFlags = roomMetadata.doorSlotFlags as BitFlags<DoorSlotFlag>;
    let rooms = roomDoorSlotFlagMap.get(doorSlotFlags);
    if (rooms === undefined) {
      rooms = [];
      roomDoorSlotFlagMap.set(doorSlotFlags, rooms);
    }

    rooms.push(roomMetadata);
  }

  return roomTypeMap;
}
