import React, { useState, useRef } from "react";
import type { Units, RaceDistance } from "./pc/models";
import { distances } from "./pc/models";
import { Interval } from "./components/Interval";
import type { Intervals } from "./pc/pacecalc";
import { buildIntervals, keepLocksThatFit, locksFit } from "./pc/pacecalc";
import DistanceTimeSplits from "./components/DistanceTimeSplits";
import ExportShare from "./components/ExportShare";
import history from "./pc/history";
import {
  useQueryParams,
  NumberParam,
  StringParam,
  NumericObjectParam,
} from "use-query-params";

function getInitialIntervals(
  distance: RaceDistance,
  totalTime: number,
  units: Units,
  fixed: Map<number, number>,
): Intervals {
  return buildIntervals(distance, totalTime, units, fixed);
}

const App = () => {
  const paramsFromIntervals = (intervals: Intervals) => {
    const fixed: { [key: string]: number } = {};
    intervals.fixed.forEach(
      (value: number, key: number) => (fixed[key] = value),
    );
    return {
      d: intervals.distance.name,
      t: intervals.totalTime,
      u: intervals.units,
      f: fixed,
    };
  };
  const [{ u, d, t, f }, setq] = useQueryParams({
    u: StringParam,
    d: StringParam,
    t: NumberParam,
    f: NumericObjectParam,
  });

  const [units, setUnits] = useState<Units>(
    u === "mi" || u === "km" ? u : "mi",
  );
  const [distance, setDistance] = useState(
    d && distances[d] ? distances[d] : distances["Marathon"],
  );
  const [totalTime, setTotalTime] = useState<number>(
    t && t > 0 ? t : distance.defaultTime,
  ); // seconds
  const [intervals, setIntervals] = useState(() => {
    const fixed = null !== f && undefined !== f ? f : {};
    const map = new Map(
      Object.keys(fixed).map((k) => [Number(k), fixed[k] as number]),
    );
    // a link can ask for locks that cannot be run in the goal time: drop those
    return getInitialIntervals(
      distance,
      totalTime,
      units,
      keepLocksThatFit(distance, totalTime, units, map),
    );
  });
  React.useEffect(() => {
    // put the starting splits in the URL
    setq(paramsFromIntervals(intervals));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const intervalsRef = useRef(intervals);

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    // listen for changes to the URL and force the app to re-render
    history.listen(() => {
      forceUpdate();
    });
  }, []);

  const intervalUnlock = (num: number): void => {
    const newFixedIntervals = new Map(intervals.fixed);
    newFixedIntervals.delete(num);
    const newIntervals = buildIntervals(
      distance,
      totalTime,
      units,
      newFixedIntervals,
    );
    setq(paramsFromIntervals(newIntervals));
    setIntervals(newIntervals);
  };

  // Lock a split one second faster or slower. Called repeatedly during a long press.
  const nudge = (iNum: number, seconds: number) => {
    setIntervals((intervals) => {
      const t = intervals.intervals[iNum].time;
      const newFixedIntervals = new Map(intervals.fixed);
      newFixedIntervals.set(iNum, Number((t + seconds).toFixed(0)));
      // at the limit of what the other splits can absorb, the press has no further effect
      if (!locksFit(distance, totalTime, units, newFixedIntervals)) {
        return intervals;
      }
      const newIntervals = buildIntervals(
        distance,
        totalTime,
        units,
        newFixedIntervals,
      );
      intervalsRef.current = newIntervals;
      return newIntervals;
    });
  };
  const faster = (iNum: number) => nudge(iNum, -1);
  const slower = (iNum: number) => nudge(iNum, 1);

  const done = (): void => {
    setq(paramsFromIntervals(intervals));
  };

  const onUnitsChanged = (u: Units): void => {
    if (u === units) {
      return;
    }
    setUnits(u);
    const newIntervals = buildIntervals(distance, totalTime, u, new Map());
    setq(paramsFromIntervals(newIntervals));
    setIntervals(newIntervals);
  };

  const onDistanceChanged = (d: RaceDistance): void => {
    if (d === distance) {
      return;
    }
    setDistance(d);
    setTotalTime(d.defaultTime);
    const newIntervals = buildIntervals(d, d.defaultTime, units, new Map());
    setq(paramsFromIntervals(newIntervals));
    setIntervals(newIntervals);
  };

  const onTimeChanged = (t: number): void => {
    if (t === totalTime) {
      return;
    }
    setTotalTime(t);
    const newIntervals = buildIntervals(distance, t, units, new Map());
    setq(paramsFromIntervals(newIntervals));
    setIntervals(newIntervals);
  };

  return (
    <>
      <DistanceTimeSplits
        units={units}
        unitsChangeHandler={onUnitsChanged}
        distance={distance}
        intervals={intervals}
        timeChangeHandler={onTimeChanged}
        distanceChangeHandler={onDistanceChanged}
      />
      <ExportShare units={units} intervals={intervals}></ExportShare>
      <div className="intervals-view">
        {intervals.intervals.map((i) => (
          <Interval
            key={i.num}
            num={i.num}
            time={i.time}
            cumulativeTime={i.cumulativeTime}
            cumulativeDistance={i.cumulativeDistance}
            distance={i.distance}
            slowestInterval={intervals.slowest.time}
            locked={i.locked}
            faster={faster}
            slower={slower}
            done={done}
            unlock={intervalUnlock}
            units={units}
          />
        ))}
      </div>
    </>
  );
};

export default App;
