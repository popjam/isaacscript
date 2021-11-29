import { saveDataManager } from "../features/saveDataManager/exports";
import { getRoomIndex, getRoomVisitedCount } from "../functions/rooms";
import {
  postTearInitLateFire,
  postTearInitLateHasSubscriptions,
} from "./subscriptions/postTearInitLate";

const v = {
  run: {
    firedSet: new Set<PtrHash>(),
    currentRoomIndex: null as int | null,
    currentRoomVisitedCount: null as int | null,
  },
};

export function postTearInitLateCallbackInit(mod: Mod): void {
  saveDataManager("postTearInitLate", v, hasSubscriptions);

  mod.AddCallback(ModCallbacks.MC_POST_TEAR_UPDATE, postTearUpdate); // 40
}

function hasSubscriptions() {
  return postTearInitLateHasSubscriptions();
}

// ModCallbacks.MC_POST_TEAR_UPDATE (40)
function postTearUpdate(tear: EntityTear) {
  if (!hasSubscriptions()) {
    return;
  }

  const roomIndex = getRoomIndex();
  const roomVisitedCount = getRoomVisitedCount();
  if (
    roomIndex !== v.run.currentRoomIndex ||
    roomVisitedCount !== v.run.currentRoomVisitedCount
  ) {
    v.run.currentRoomIndex = roomIndex;
    v.run.currentRoomVisitedCount = roomVisitedCount;
    v.run.firedSet.clear();
  }

  const index = GetPtrHash(tear);
  if (!v.run.firedSet.has(index)) {
    v.run.firedSet.add(index);
    postTearInitLateFire(tear);
  }
}
