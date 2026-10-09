import type { Units, RaceDistance } from "./models";
import { rate, time, metersPerMile } from "./models";

interface Interval {
  num: number;
  maxDistance: number;
  distance: number;
  rate: number;
  time: number;
  cumulativeTime: number;
  cumulativeDistance: number;
  locked: boolean;
}

export class Intervals {
  private _totalTime: number;
  private _distance: RaceDistance;
  private _units: Units;
  private _intervals: Interval[];
  private _slowestInterval: Interval;
  private _fixed: Map<number, number>;
  constructor(
    totalTime: number,
    distance: RaceDistance,
    units: Units,
    intervals: Interval[],
    fixed: Map<number, number>,
  ) {
    this._totalTime = totalTime;
    this._distance = distance;
    this._units = units;
    this._intervals = intervals;
    // Select slowest interval
    let slowest = this.intervals[0];
    for (let i = 1; i < this._intervals.length; i++) {
      if (this._intervals[i].time > slowest.time) {
        slowest = this._intervals[i];
      }
    }
    this._slowestInterval = slowest;
    this._fixed = fixed;
  }
  get distance(): RaceDistance {
    return this._distance;
  }
  get totalTime(): number {
    return this._totalTime;
  }
  get units(): Units {
    return this._units;
  }
  get intervals(): Interval[] {
    return this._intervals;
  }
  get slowest(): Interval {
    return this._slowestInterval;
  }
  get fixed(): Map<number, number> {
    return this._fixed;
  }
}

function getIntervalDistances(totalDistance: number, units: Units): number[] {
  const fullIntervalDist = units === "mi" ? metersPerMile : 1000;
  let distanceRemaining = totalDistance;
  const res: number[] = [];
  let num = 0;
  while (distanceRemaining > 0) {
    if (distanceRemaining > fullIntervalDist) {
      res[num] = fullIntervalDist;
      distanceRemaining -= fullIntervalDist;
    } else {
      res[num] = distanceRemaining;
      distanceRemaining = 0;
    }
    num += 1;
  }
  return res;
}

function getTotalFreeDistance(
  intervalDistances: number[],
  fixedIntervals: Map<number, number>,
): number {
  let result = 0;
  for (let i = 0; i < intervalDistances.length; i++) {
    if (!fixedIntervals.has(i)) {
      result += intervalDistances[i];
    }
  }
  return result;
}

// How much faster than the goal's average pace a single split may be.
const MAX_SPEED_UP = 2;

// The fastest any split may be, in seconds per metre. It is relative to the goal,
// so there is always room to adjust whatever goal is chosen.
function fastestPace(distance: RaceDistance, totalTime: number): number {
  return totalTime / distance.distance / MAX_SPEED_UP;
}

export function locksFit(
  distance: RaceDistance,
  totalTime: number,
  units: Units,
  fixedIntervals: Map<number, number>,
): boolean {
  const intervalDistances = getIntervalDistances(distance.distance, units);
  const limit = fastestPace(distance, totalTime);
  // locks are whole seconds, so compare with a little slack for rounding
  const tooFast = (time: number, metres: number) =>
    time < metres * limit - 1e-6;

  let lockedTime = 0;
  for (const [num, time] of fixedIntervals) {
    if (!Number.isInteger(num) || num < 0 || num >= intervalDistances.length) {
      return false;
    }
    if (!Number.isFinite(time) || tooFast(time, intervalDistances[num])) {
      return false;
    }
    lockedTime += time;
  }

  const freeDistance = getTotalFreeDistance(intervalDistances, fixedIntervals);
  // less than a metre is the rounding left over in distances such as 5M, not a split
  if (freeDistance < 1) {
    return false;
  }
  return !tooFast(totalTime - lockedTime, freeDistance);
}

export function keepLocksThatFit(
  distance: RaceDistance,
  totalTime: number,
  units: Units,
  fixedIntervals: Map<number, number>,
): Map<number, number> {
  const kept = new Map<number, number>();
  const inOrder = Array.from(fixedIntervals).sort((l, r) => l[0] - r[0]);
  for (const [num, time] of inOrder) {
    kept.set(num, time);
    if (!locksFit(distance, totalTime, units, kept)) {
      kept.delete(num);
    }
  }
  return kept;
}

export function buildIntervals(
  distance: RaceDistance,
  totalTime: number,
  units: Units,
  fixedIntervals: Map<number, number>,
): Intervals {
  const intervalDistances = getIntervalDistances(distance.distance, units);
  const totalFreeDistance = getTotalFreeDistance(
    intervalDistances,
    fixedIntervals,
  );

  // Make sure the keys make sense, remove any bad ones.
  fixedIntervals.forEach((_, k) => {
    if (k >= intervalDistances.length) {
      fixedIntervals.delete(k);
    }
  });
  const totalFixedTime = Array.from(fixedIntervals.values()).reduce(
    (l, r) => l + r,
    0,
  );
  const totalFreeTime = totalTime - totalFixedTime;
  const freeRate = rate(totalFreeDistance, totalFreeTime);

  // calculate interval distances
  const fullIntervalDist = units === "km" ? 1000 : metersPerMile;

  let num = 0;
  const intervals: Interval[] = [];
  let timeRemaining = totalTime;
  let cumulativeTime = 0;
  let cumulativeDistance = 0;
  while (timeRemaining >= 1 && num < intervalDistances.length) {
    let locked = false;
    let intervalTime;
    const intervalDistance = intervalDistances[num];
    if (fixedIntervals.has(num)) {
      // this interval is locked
      locked = true;
      intervalTime = fixedIntervals.get(num) as number;
    } else {
      // this interval is free
      intervalTime = time(intervalDistance, freeRate);
    }
    const intervalRate = rate(intervalDistance, intervalTime);
    cumulativeTime += intervalTime;
    cumulativeDistance += intervalDistance;
    timeRemaining = timeRemaining - intervalTime;
    intervals.push({
      num: num,
      maxDistance: fullIntervalDist,
      distance: Number(intervalDistance.toFixed(1)),
      rate: Number(intervalRate.toFixed(1)),
      time: Number(intervalTime.toFixed(1)),
      cumulativeTime: Number(cumulativeTime.toFixed(1)),
      cumulativeDistance: Number(cumulativeDistance.toFixed(1)),
      locked: locked,
    });
    num++;
  }
  return new Intervals(totalTime, distance, units, intervals, fixedIntervals);
}
