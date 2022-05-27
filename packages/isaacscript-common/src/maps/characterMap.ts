import { PlayerType } from "isaac-typescript-definitions";

/** Maps character names to character sub-types. */
export const CHARACTER_MAP = new Map<string, PlayerType>([
  ["isaac", 0],
  ["magdalene", 1],
  ["maggy", 1],
  ["cain", 2],
  ["judas", 3],
  ["blueBaby", 4],
  ["bb", 4],
  ["eve", 5],
  ["samson", 6],
  ["azazel", 7],
  ["lazarus", 8],
  ["laz", 8], // Needed so that "laz2" does not take precedence over "lazarus"
  ["eden", 9],
  ["theLost", 10],
  ["lost", 10],
  ["lazarus2", 11],
  ["laz2", 11],
  ["darkJudas", 12],
  ["dJudas", 12],
  ["blackJudas", 12],
  ["bJudas", 12],
  ["lilith", 13],
  ["keeper", 14],
  ["apollyon", 15],
  ["theForgotten", 16],
  ["forgotten", 16],
  ["theSoul", 17],
  ["soul", 17],
  ["bethany", 18],
  ["jacob", 19],
  ["esau", 20],
  ["taintedIsaac", 21],
  ["tIsaac", 21],
  ["taintedMagdalene", 22],
  ["tMagdalene", 22],
  ["taintedMaggy", 22],
  ["tMaggy", 22],
  ["taintedCain", 23],
  ["tCain", 23],
  ["taintedJudas", 24],
  ["tJudas", 24],
  ["taintedBlueBaby", 25],
  ["tBlueBaby", 25],
  ["tbb", 25],
  ["taintedEve", 26],
  ["tEve", 26],
  ["taintedSamson", 27],
  ["tSamson", 27],
  ["taintedAzazel", 28],
  ["tAzazel", 28],
  ["taintedLazarus", 29],
  ["tLazarus", 29],
  ["taintedLaz", 29],
  ["tLaz", 29],
  ["taintedEden", 30],
  ["tEden", 30],
  ["taintedLost", 31],
  ["tLost", 31],
  ["taintedLilith", 32],
  ["tLilith", 32],
  ["taintedKeeper", 33],
  ["tKeeper", 33],
  ["taintedApollyon", 34],
  ["tApollyon", 34],
  ["taintedForgotten", 34],
  ["tForgotten", 35],
  ["taintedBethany", 36],
  ["tBethany", 36],
  ["taintedJacob", 37],
  ["tJacob", 37],
  ["taintedLazarusDead", 38],
  ["tLazarusDead", 38],
  ["taintedLazDead", 38],
  ["tLazDead", 38],
  ["deadTaintedLazarus", 38],
  ["deadTLazarus", 38],
  ["deadTaintedLaz", 38],
  ["deadTLaz", 38],
  ["taintedJacobGhost", 39],
  ["tJacobGhost", 39],
  ["taintedSoul", 40],
  ["tSoul", 40],
]);
