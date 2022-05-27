import { Card } from "isaac-typescript-definitions";

// cspell:ignore hiero

/** Maps card names to card sub-types. */
export const CARD_MAP: ReadonlyMap<string, Card> = new Map([
  ["fool", Card.FOOL], // 1
  ["magician", Card.MAGICIAN], // 2
  ["mag", Card.MAGICIAN], // 2 - Needed since we have "mag?"
  ["highPriestess", Card.HIGH_PRIESTESS], // 3
  ["priestess", Card.HIGH_PRIESTESS], // 3
  ["priest", Card.HIGH_PRIESTESS], // 3 - Needed since we have "priest?"
  ["hp", Card.HIGH_PRIESTESS], // 3
  ["empress", Card.EMPRESS], // 4
  ["emperor", Card.EMPEROR], // 5
  ["emp", Card.EMPEROR], // 5 - Needed since we have "hemp?"
  ["hierophant", Card.HIEROPHANT], // 6
  ["hi", Card.HIEROPHANT], // 6 - Needed since we have "hiero?"
  ["lovers", Card.LOVERS], // 7
  ["chariot", Card.CHARIOT], // 8
  ["justice", Card.JUSTICE], // 9
  ["hermit", Card.HERMIT], // 10
  ["wheelOfFortune", Card.WHEEL_OF_FORTUNE], // 11
  ["wheel", Card.WHEEL_OF_FORTUNE], // 11 - Needed since we have "wheel?"
  ["fortune", Card.WHEEL_OF_FORTUNE], // 11
  ["strength", Card.STRENGTH], // 12
  ["str", Card.STRENGTH], // 12 - Needed since we have "str?"
  ["hangedMan", Card.HANGED_MAN], // 13
  ["hanged", Card.HANGED_MAN], // 13
  ["death", Card.DEATH], // 14
  ["temperance", Card.TEMPERANCE], // 15
  ["devil", Card.DEVIL], // 16
  ["tower", Card.TOWER], // 17
  ["stars", Card.STARS], // 18
  ["moon", Card.MOON], // 19
  ["sun", Card.SUN], // 20
  ["judgement", Card.JUDGEMENT], // 21
  ["judge", Card.JUDGEMENT], // 21 - Needed since we have "judge?"
  ["world", Card.WORLD], // 22
  ["2OfClubs", Card.CLUBS_2], // 23
  ["2Clubs", Card.CLUBS_2], // 23
  ["2OfDiamonds", Card.DIAMONDS_2], // 24
  ["2Diamonds", Card.DIAMONDS_2], // 24
  ["2OfSpades", Card.SPADES_2], // 25
  ["2Spades", Card.SPADES_2], // 25
  ["2OfHearts", Card.HEARTS_2], // 26
  ["2Hearts", Card.HEARTS_2], // 26
  ["aceOfClubs", Card.ACE_OF_CLUBS], // 27
  ["aceClubs", Card.ACE_OF_CLUBS], // 27
  ["aceOfDiamonds", Card.ACE_OF_DIAMONDS], // 28
  ["aceDiamonds", Card.ACE_OF_DIAMONDS], // 28
  ["aceOfSpades", Card.ACE_OF_SPADES], // 29
  ["aceSpades", Card.ACE_OF_SPADES], // 29
  ["aceOfHearts", Card.ACE_OF_HEARTS], // 30
  ["aceHearts", Card.ACE_OF_HEARTS], // 30
  ["joker", Card.JOKER], // 31
  ["hagalaz", Card.RUNE_HAGALAZ], // 32
  ["destruction", Card.RUNE_HAGALAZ], // 32
  ["jera", Card.RUNE_JERA], // 33
  ["abundance", Card.RUNE_JERA], // 33
  ["ehwaz", Card.RUNE_EHWAZ], // 34
  ["passage", Card.RUNE_EHWAZ], // 34
  ["dagaz", Card.RUNE_DAGAZ], // 35
  ["purity", Card.RUNE_DAGAZ], // 35
  ["ansuz", Card.RUNE_ANSUZ], // 36
  ["vision", Card.RUNE_ANSUZ], // 36
  ["perthro", Card.RUNE_PERTHRO], // 37
  ["change", Card.RUNE_PERTHRO], // 37
  ["berkano", Card.RUNE_BERKANO], // 38
  ["companionship", Card.RUNE_BERKANO], // 38
  ["algiz", Card.RUNE_ALGIZ], // 39
  ["resistance", Card.RUNE_ALGIZ], // 39
  ["shield", Card.RUNE_ALGIZ], // 39
  ["blank", Card.RUNE_BLANK], // 40
  ["black", Card.RUNE_BLACK], // 41
  ["chaos", Card.CHAOS], // 42
  ["credit", Card.CREDIT], // 43
  ["rules", Card.RULES], // 44
  ["againstHumanity", Card.AGAINST_HUMANITY], // 45
  ["humanity", Card.AGAINST_HUMANITY], // 45
  ["suicideKing", Card.SUICIDE_KING], // 46
  ["suicide", Card.SUICIDE_KING], // 46
  ["getOutOfJailFree", Card.GET_OUT_OF_JAIL_FREE], // 47
  ["jail", Card.GET_OUT_OF_JAIL_FREE], // 47
  ["?", Card.QUESTION_MARK], // 48
  ["diceShard", Card.DICE_SHARD], // 49
  ["shard", Card.DICE_SHARD], // 49
  ["emergencyContact", Card.EMERGENCY_CONTACT], // 50
  ["contact", Card.EMERGENCY_CONTACT], // 50
  ["holy", Card.HOLY], // 51
  ["hugeGrowth", Card.HUGE_GROWTH], // 52
  ["growth", Card.HUGE_GROWTH], // 52
  ["ancientRecall", Card.ANCIENT_RECALL], // 53
  ["recall", Card.ANCIENT_RECALL], // 53
  ["eraWalk", Card.ERA_WALK], // 54
  ["walk", Card.ERA_WALK], // 54
  ["runeShard", Card.RUNE_SHARD], // 55
  ["shard", Card.RUNE_SHARD], // 55
  ["fool?", Card.REVERSE_FOOL], // 56
  ["magician?", Card.REVERSE_MAGICIAN], // 57
  ["magi?", Card.REVERSE_MAGICIAN], // 57
  ["mag?", Card.REVERSE_MAGICIAN], // 57
  ["highPriestess?", Card.REVERSE_HIGH_PRIESTESS], // 58
  ["high?", Card.REVERSE_HIGH_PRIESTESS], // 58
  ["hi?", Card.REVERSE_HIGH_PRIESTESS], // 58
  ["priestess?", Card.REVERSE_HIGH_PRIESTESS], // 58
  ["priest?", Card.REVERSE_HIGH_PRIESTESS], // 58
  ["hp?", Card.REVERSE_HIGH_PRIESTESS], // 58
  ["empress?", Card.REVERSE_EMPRESS], // 59
  ["emperor?", Card.REVERSE_EMPEROR], // 60
  ["emp?", Card.REVERSE_EMPEROR], // 60
  ["hierophant?", Card.REVERSE_HIEROPHANT], // 61
  ["hiero?", Card.REVERSE_HIEROPHANT], // 61
  ["lovers?", Card.REVERSE_LOVERS], // 62
  ["chariot?", Card.REVERSE_CHARIOT], // 63
  ["justice?", Card.REVERSE_JUSTICE], // 64
  ["hermit?", Card.REVERSE_HERMIT], // 65
  ["wheelOfFortune?", Card.REVERSE_WHEEL_OF_FORTUNE], // 66
  ["wheel?", Card.REVERSE_WHEEL_OF_FORTUNE], // 66
  ["fortune?", Card.REVERSE_WHEEL_OF_FORTUNE], // 66
  ["strength?", Card.REVERSE_STRENGTH], // 67
  ["str?", Card.REVERSE_STRENGTH], // 67
  ["hangedMan?", Card.REVERSE_HANGED_MAN], // 68
  ["hanged?", Card.REVERSE_HANGED_MAN], // 68
  ["death?", Card.REVERSE_DEATH], // 6
  ["temperance?", Card.REVERSE_TEMPERANCE], // 70
  ["devil?", Card.REVERSE_DEVIL], // 71
  ["tower?", Card.REVERSE_TOWER], // 72
  ["stars?", Card.REVERSE_STARS], // 73
  ["moon?", Card.REVERSE_MOON], // 74
  ["sun?", Card.REVERSE_SUN], // 75
  ["judgement?", Card.REVERSE_JUDGEMENT], // 76
  ["judge?", Card.REVERSE_JUDGEMENT], // 76
  ["world?", Card.REVERSE_WORLD], // 77
  ["crackedKey", Card.CRACKED_KEY], // 78
  ["key", Card.CRACKED_KEY], // 78
  ["queenOfHearts", Card.QUEEN_OF_HEARTS], // 79
  ["queenHearts", Card.QUEEN_OF_HEARTS], // 79
  ["wildcard", Card.WILD], // 80
  ["soulOfIsaac", Card.SOUL_ISAAC], // 81
  ["soulIsaac", Card.SOUL_ISAAC], // 81
  ["isaac", Card.SOUL_ISAAC], // 81
  ["soulOfMagdalene", Card.SOUL_MAGDALENE], // 82
  ["soulMagdalene", Card.SOUL_MAGDALENE], // 82
  ["magdalene", Card.SOUL_MAGDALENE], // 82
  ["soulOfCain", Card.SOUL_CAIN], // 83
  ["soulCain", Card.SOUL_CAIN], // 83
  ["cain", Card.SOUL_CAIN], // 83
  ["soulOfJudas", Card.SOUL_JUDAS], // 84
  ["soulJudas", Card.SOUL_JUDAS], // 84
  ["judas", Card.SOUL_JUDAS], // 84
  ["soulOf???", Card.SOUL_BLUE_BABY], // 85
  ["soul???", Card.SOUL_BLUE_BABY], // 85
  ["???", Card.SOUL_BLUE_BABY], // 85
  ["soulOfBlueBaby", Card.SOUL_BLUE_BABY], // 85
  ["soulBlueBaby", Card.SOUL_BLUE_BABY], // 85
  ["blueBaby", Card.SOUL_BLUE_BABY], // 85
  ["soulOfEve", Card.SOUL_EVE], // 86
  ["soulEve", Card.SOUL_EVE], // 86
  ["eve", Card.SOUL_EVE], // 86
  ["soulOfSamson", Card.SOUL_SAMSON], // 87
  ["soulSamson", Card.SOUL_SAMSON], // 87
  ["samson", Card.SOUL_SAMSON], // 87
  ["soulOfAzazel", Card.SOUL_AZAZEL], // 88
  ["soulAzazel", Card.SOUL_AZAZEL], // 88
  ["azazel", Card.SOUL_AZAZEL], // 88
  ["soulOfLazarus", Card.SOUL_LAZARUS], // 89
  ["soulLazarus", Card.SOUL_LAZARUS], // 89
  ["lazarus", Card.SOUL_LAZARUS], // 89
  ["soulOfEden", Card.SOUL_EDEN], // 90
  ["soulEden", Card.SOUL_EDEN], // 90
  ["eden", Card.SOUL_EDEN], // 90
  ["soulOfTheLost", Card.SOUL_LOST], // 91
  ["soulTheLost", Card.SOUL_LOST], // 91
  ["theLost", Card.SOUL_LOST], // 91
  ["soulOfLost", Card.SOUL_LOST], // 91
  ["soulLost", Card.SOUL_LOST], // 91
  ["lost", Card.SOUL_LOST], // 91
  ["soulOfLilith", Card.SOUL_LILITH], // 92
  ["soulLilith", Card.SOUL_LILITH], // 92
  ["lilith", Card.SOUL_LILITH], // 92
  ["soulOfTheKeeper", Card.SOUL_KEEPER], // 93
  ["soulTheKeeper", Card.SOUL_KEEPER], // 93
  ["theKeeper", Card.SOUL_KEEPER], // 93
  ["soulOfKeeper", Card.SOUL_KEEPER], // 93
  ["soulKeeper", Card.SOUL_KEEPER], // 93
  ["keeper", Card.SOUL_KEEPER], // 93
  ["soulOfApollyon", Card.SOUL_APOLLYON], // 94
  ["soulApollyon", Card.SOUL_APOLLYON], // 94
  ["apollyon", Card.SOUL_APOLLYON], // 94
  ["soulOfTheForgotten", Card.SOUL_FORGOTTEN], // 95
  ["soulTheForgotten", Card.SOUL_FORGOTTEN], // 95
  ["theForgotten", Card.SOUL_FORGOTTEN], // 95
  ["soulOfForgotten", Card.SOUL_FORGOTTEN], // 95
  ["soulForgotten", Card.SOUL_FORGOTTEN], // 95
  ["forgotten", Card.SOUL_FORGOTTEN], // 95
  ["soulOfBethany", Card.SOUL_BETHANY], // 96
  ["soulBethany", Card.SOUL_BETHANY], // 96
  ["bethany", Card.SOUL_BETHANY], // 96
  ["soulOfJacobAndEsau", Card.SOUL_JACOB], // 97
  ["soulJacobAndEsau", Card.SOUL_JACOB], // 97
  ["jacobAndEsau", Card.SOUL_JACOB], // 97
  ["soulOfJacob&Esau", Card.SOUL_JACOB], // 97
  ["soulJacob&Esau", Card.SOUL_JACOB], // 97
  ["jacob&Esau", Card.SOUL_JACOB], // 97
  ["soulOfJacob", Card.SOUL_JACOB], // 97
  ["soulJacob", Card.SOUL_JACOB], // 97
  ["jacob", Card.SOUL_JACOB], // 97
]);
