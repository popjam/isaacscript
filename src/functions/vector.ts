import { SerializationBrand } from "../enums/private/SerializationBrand";
import { SerializationType } from "../enums/SerializationType";
import { DIRECTION_TO_VECTOR } from "../objects/directionToVector";
import { copyValuesToTable, getNumbersFromTable, tableHasKeys } from "./table";
import { ensureAllCases, isUserdataObject } from "./utils";

type SerializedVector = LuaTable<string, string | number>;

interface CopyVectorReturn {
  [SerializationType.NONE]: Vector;
  [SerializationType.SERIALIZE]: SerializedVector;
  [SerializationType.DESERIALIZE]: Vector;
}

const KEYS = ["X", "Y"];
const OBJECT_NAME = "Vector";

/**
 * Helper function to copy a `Vector` object.
 *
 * @param vector The vector to copy. In the case of deserialization, this will actually be a Lua
 * table instead of an instantiated Vector class.
 * @param serializationType Default is `SerializationType.NONE`.
 */
export function copyVector<
  V extends Vector | SerializedVector,
  S extends SerializationType,
>(vector: V, serializationType: S): CopyVectorReturn[S];
export function copyVector<V extends Vector | SerializedVector>(
  vector: V,
): CopyVectorReturn[SerializationType.NONE];
export function copyVector(
  vector: Vector | SerializedVector,
  serializationType = SerializationType.NONE,
): CopyVectorReturn[keyof CopyVectorReturn] {
  switch (serializationType) {
    case SerializationType.NONE: {
      if (!isVector(vector)) {
        error(
          `Failed to copy a ${OBJECT_NAME} object since the provided object was not a userdata ${OBJECT_NAME} class.`,
        );
      }

      return Vector(vector.X, vector.Y);
    }

    case SerializationType.SERIALIZE: {
      if (!isVector(vector)) {
        error(
          `Failed to serialize a ${OBJECT_NAME} object since the provided object was not a userdata ${OBJECT_NAME} class.`,
        );
      }

      const vectorTable = new LuaTable<string, string | number>();
      copyValuesToTable(vector, KEYS, vectorTable);
      vectorTable.set(SerializationBrand.VECTOR, "");
      return vectorTable;
    }

    case SerializationType.DESERIALIZE: {
      const vectorType = type(vector);
      if (isVector(vector) || vectorType !== "table") {
        error(
          `Failed to deserialize a ${OBJECT_NAME} object since the provided object was not a Lua table.`,
        );
      }

      const [x, y] = getNumbersFromTable(vector, OBJECT_NAME, ...KEYS);
      return Vector(x, y);
    }

    default: {
      return ensureAllCases(serializationType);
    }
  }
}

export function directionToVector(direction: Direction): Vector {
  return DIRECTION_TO_VECTOR[direction];
}

/**
 * Helper function to get a new vector of length 1. Using this is safer than using the `Vector.One`
 * variable because the variable can be overwritten or modified.
 */
export function getOneVector(): Vector {
  return Vector(1, 1);
}

/**
 * Helper function to get a new vector of length 0. Using this is safer than using the `Vector.Zero`
 * variable because the variable can be overwritten or modified.
 */
export function getZeroVector(): Vector {
  return Vector(0, 0);
}

/**
 * Used to determine is the given table is a serialized Vector created by the save data manager
 * and/or the `deepCopy` function.
 */
export function isSerializedVector(
  object: unknown,
): object is SerializedVector {
  const objectType = type(object);
  if (objectType !== "table") {
    return false;
  }

  const table = object as LuaTable;
  return tableHasKeys(table, ...KEYS) && table.has(SerializationBrand.VECTOR);
}

/** Helper function to check if something is an instantiated Vector object. */
export function isVector(object: unknown): object is Vector {
  return isUserdataObject(object, OBJECT_NAME);
}

/** Helper function for finding out which way a vector is pointing. */
export function vectorToDirection(vector: Vector): Direction {
  const degrees = vector.GetAngleDegrees();

  if (degrees > -45 && degrees < 45) {
    return Direction.RIGHT;
  }

  if (degrees >= 45 && degrees <= 135) {
    return Direction.DOWN;
  }

  if (degrees <= -45 && degrees >= -135) {
    return Direction.UP;
  }

  if (degrees > 135 || degrees < -135) {
    return Direction.LEFT;
  }

  return Direction.NO_DIRECTION;
}
