import { Units, RaceDistance, rate, time, metersPerMile } from '../defy/models'

interface Interval {
    num: number,
    maxDistance: number,
    distance: number,
    rate: number,
    time: number,
    cumulativeTime: number,
    cumulativeDistance: number,
    locked: boolean,
}

export class Intervals {
    private _totalTime: number;
    private _distance: RaceDistance;
    private _units: Units;
    private _intervals: Interval[];
    private _slowestInterval: Interval;
    private _fixed: Map<number, number>;
    constructor(totalTime: number, distance: RaceDistance, units: Units, intervals: Interval[], fixed: Map<number, number>) {
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
    const fullIntervalDist = units === 'mi' ? metersPerMile : 1000;
    let distanceRemaining = totalDistance;
    const res: number[] = [];
    let num = 0;
    while (distanceRemaining > 0) {
        if (distanceRemaining > fullIntervalDist) {
            res[num] = fullIntervalDist;
            distanceRemaining -= fullIntervalDist;
        } else {
            res[num] = distanceRemaining
            distanceRemaining = 0;
        }
        num += 1
    }
    return res;
}

function getTotalFreeDistance(intervalDistances: number[], fixedIntervals: Map<number, number>): number {
    let result = 0;
    for (let i = 0; i < intervalDistances.length; i++) {
        if (!fixedIntervals.has(i)) {
            result += intervalDistances[i]
        }
    }
    return result;
}

export function buildIntervals(distance: RaceDistance, totalTime: number, units: Units, fixedIntervals: Map<number, number>): Intervals {
    const intervalDistances = getIntervalDistances(distance.distance, units);
    const totalFreeDistance = getTotalFreeDistance(intervalDistances, fixedIntervals);

    // Make sure the keys make sense, remove any bad ones.
    fixedIntervals.forEach((v, k) => {
        if (k >= intervalDistances.length) {
            console.log("REMOVING BAD KEY: " + k);
            fixedIntervals.delete(k);
        }
    });
    const totalFixedTime = Array.from(fixedIntervals.values()).reduce((l, r) => l + r, 0);
    const totalFreeTime = totalTime - totalFixedTime;
    const freeRate = rate(totalFreeDistance, totalFreeTime);

    // calculate interval distances
    const fullIntervalDist = units === 'km' ? 1000 : metersPerMile;

    let num = 0;
    const intervals: Interval[] = [];
    let timeRemaining = totalTime;
    let cumulativeTime = 0;
    let cumulativeDistance = 0;
    while (timeRemaining >= 1) {
        let locked = false;
        let intervalTime;
        let intervalRate;
        const intervalDistance = intervalDistances[num];
        if (undefined === intervalDistance) {
            console.log(`UNDEFINED interval distance ${num} ${intervalDistances.length}`)
        }
        if (fixedIntervals.has(num)) {
            // this interval is locked
            locked = true;
            intervalTime = fixedIntervals.get(num) as number;
        } else {
            // this interval is free
            intervalTime = time(intervalDistance, freeRate);
        }
        intervalRate = rate(intervalDistance, intervalTime);
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
        })
        num++;
    }
    return new Intervals(totalTime, distance, units, intervals, fixedIntervals);
}
