import { MESBGProfiles } from '../data/MESBGProfiles';
import { MESBGArmySlot } from '../types';
import type { ListBody, ListGroup, ListMember } from '../types/api/ListBody';
import type { MESBGProfileStats, RemainingMESBGProfileStats } from '../types/MESBGProfileStats';
import type { Profile } from '../types/Profile';

export const getMESBGStats = (profile: Profile): MESBGProfileStats => {
  const [
    movement,
    fightValue,
    savingThrow,
    strength,
    defense,
    attacks,
    wounds,
    courage,
    intelligence,
    might,
    will,
    fate,
  ] = profile.stats;

  return {
    movement,
    fightValue,
    shootValue: savingThrow,
    strength,
    defense,
    attacks,
    wounds,
    courage,
    intelligence,
    might,
    will,
    fate,
  };
};

export const getRemainingMESBGStats = (
  stats: MESBGProfileStats,
  member: ListMember
): RemainingMESBGProfileStats => {
  const [might, will, fate, wounds] = member.remainingStats ?? [
    Number(stats.might),
    Number(stats.will),
    Number(stats.fate),
    Number(stats.wounds),
  ];

  return { might, will, fate, wounds };
};

export const toRemainingMESBGStatsFlat = (stats: RemainingMESBGProfileStats): number[] => {
  return [stats.might, stats.will, stats.fate, stats.wounds];
};

export const maxWarbandForLeader = (slot: MESBGArmySlot): number => {
  switch (slot) {
    case MESBGArmySlot.Legend:
      return 18;
    case MESBGArmySlot.Valour:
      return 15;
    case MESBGArmySlot.Fortitude:
      return 12;
    default:
      return 6;
  }
};

export const getMemberPointsTotal = (member: ListMember): number => {
  let total = 0;
  total += member.points;

  for (const equipment of member.equipment) {
    total += equipment.points;
  }

  return total * (member.amount ?? 1);
};

export const getGroupPointsTotal = (group: ListGroup): number => {
  let total = 0;
  const members = [group.leader, ...group.members];

  for (const member of members) {
    total += getMemberPointsTotal(member);
  }
  return total;
};

export const getPointsTotal = (list: ListBody): number => {
  let total = 0;

  for (const group of list.groups) {
    total += getGroupPointsTotal(group);
  }

  return total;
};

export const getListUniqueLeaders = (list: ListBody): string[] => {
  const leaders = new Set<string>();

  for (const group of list.groups) {
    const leaderProfile = MESBGProfiles.find((x) => x.name === group.leader.name);

    if (leaderProfile?.unique) {
      leaders.add(group.leader.name);
    }

    for (const member of group.members) {
      const memberProfile = MESBGProfiles.find((x) => x.name === member.name);

      if (memberProfile?.unique) {
        leaders.add(member.name);
      }
    }
  }

  return [...leaders];
};
