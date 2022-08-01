/**
 * The standard library has the feature to deploy a new room on-the-fly with the `deployJSONRoom`
 * helper function. It requires a `JSONRoomsFile` as an argument, which is simply an XML file
 * converted to JSON. (You create XML room files using the Basement Renovator program.)
 *
 * You can convert your XML files using the following command:
 *
 * ```sh
 * npx convert-xml-to-json foo.xml foo.json
 * ```
 *
 * Note that the custom stages feature of the standard library uses real XML/STB files, not JSON
 * rooms, so you would only need to do this if you are using the `deployJSONRoom` command
 * specifically.
 */
export interface JSONRoomsFile {
  rooms: JSONRooms;
}

export interface JSONRooms {
  room: JSONRoom[];
}

/** Part of `JSONRooms`. */
export interface JSONRoom {
  $: {
    /** Needs to be converted to an `int`. */
    difficulty: string;

    /** Needs to be converted to an `int`. */
    height: string;

    name: string;

    /** Needs to be converted to an `int`. */
    shape: string;

    /** Needs to be converted to an `int`. */
    subtype: string;

    /** Needs to be converted to an `int`. */
    type: string;

    /** Needs to be converted to an `int`. */
    variant: string;

    /** Needs to be converted to a `float`. */
    weight: string;

    /** Needs to be converted to an `int`. */
    width: string;
  };

  door: JSONDoor[];
  spawn: JSONSpawn[];
}

/** Part of `JSONRooms`. */
export interface JSONDoor {
  $: {
    /** Equal to "True" or "False". Needs to be converted to an `boolean`. */
    exists: string;

    /** Needs to be converted to an `int`. */
    x: string;

    /** Needs to be converted to an `int`. */
    y: string;
  };
}

/** Part of `JSONRooms`. */
export interface JSONSpawn {
  $: {
    /** Needs to be converted to an `int`. */
    x: string;

    /** Needs to be converted to an `int`. */
    y: string;
  };

  entity: JSONEntity[];
}

/** Part of `JSONRooms`. */
export interface JSONEntity {
  $: {
    /** Needs to be converted to an `int`. */
    type: string;

    /** Needs to be converted to an `int`. */
    variant: string;

    /** Needs to be converted to an `int`. */
    subtype: string;

    /** Needs to be converted to a `float`. */
    weight: string;
  };
}
