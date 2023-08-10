import React, { useState, useRef } from 'react';
import { Units, RaceDistance, distances } from './defy/models'
import { Interval } from './components/Interval';
import { Intervals, buildIntervals } from './pc/pacecalc';
import styled, { ThemeProvider } from 'styled-components';
import Toolbar from './defy/components/Toolbar';
import DistanceTimeSplits from './components/DistanceTimeSplits'
import history from './defy/history';
import { useQueryParams, NumberParam, StringParam, NumericObjectParam } from 'use-query-params';

const theme = {
  colors: {
    bodyBg: '#61c9a8', // green
    controlsBg: '#ada8b6', // silver
    controlsTitle: '#424242', // onyx
    buttonBg: '#424242', // onyx
    buttonIcons: '#fed766', // yellow
    buttonTxt: '#fed766', // yellow
    buttonSelectedBorder: '#FF101F', // red
    speedBarBg: '#fed766', // yellow
    intervalBg: '#ada8b6', // silver
    intervalsBg: '#61c9a8', // green
  },
  fonts: ["sans-serif", "Roboto"],
  fontSizes: {
    small: "1em",
    medium: "2em",
    large: "3em"
  },
  screenSizes: {
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
  }
}

const IntervalsView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.colors.intervalsBg};
  padding: 5px;
`

function getInitialIntervals(distance: RaceDistance, totalTime: number, units: Units, fixed: Map<number, number>): Intervals {
  return buildIntervals(distance, totalTime, units, fixed);
}

const App: React.FC = () => {
  const paramsFromIntervals = (intervals: Intervals) => {
    let fixed: { [key: string]: number } = {}
    intervals.fixed.forEach((value: number, key: number) => fixed[key] = value);
    return {
      d: intervals.distance.name,
      t: intervals.totalTime,
      u: intervals.units,
      f: fixed,
    }
  }
  const [{ u, d, t, f }, setq] = useQueryParams({ u: StringParam, d: StringParam, t: NumberParam, f: NumericObjectParam });

  const [units, setUnits] = useState<Units>((u === 'mi' || u === 'km') ? u : 'mi')
  const [distance, setDistance] = useState((d && distances[d]) ? distances[d] : distances['Marathon'])
  const [totalTime, setTotalTime] = useState<number>((t && t > 0 ? t : distance.defaultTime)) // seconds
  const [intervals, setIntervals] = useState(() => {
    let fixed = undefined !== f ? f : {};
    let map = new Map(Object.keys(fixed).map(k => [Number(k), fixed[k] as number]));
    let intervals = getInitialIntervals(distance, totalTime, units, map);
    setq(paramsFromIntervals(intervals));
    return intervals;
  });
  const intervalsRef = useRef(intervals);

  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    // listen for changes to the URL and force the app to re-render
    history.listen(() => {
      forceUpdate();
    });
  }, []);

  const intervalUnlock = (num: number): void => {
    //console.log(`UNLOCK: ${num} `);
    let newFixedIntervals = new Map(intervals.fixed);
    newFixedIntervals.delete(num);
    const newIntervals = buildIntervals(distance, totalTime, units, newFixedIntervals);
    setq(paramsFromIntervals(newIntervals));
    setIntervals(newIntervals);
  }

  // this is called anynchronously during long press
  const faster = (iNum: number) => {
    //console.log(`LOCK: ${num} -> ${time} `);
    setIntervals(intervals => {
      let t = intervals.intervals[iNum].time;
      let newFixedIntervals = new Map(intervals.fixed);
      newFixedIntervals.set(iNum, Number((t - 1).toFixed(0)));
      const newIntervals = buildIntervals(distance, totalTime, units, newFixedIntervals);
      intervalsRef.current = newIntervals;
      return newIntervals;
    })
  };
  // this is called anynchronously during long press
  const slower = (iNum: number) => {
    //console.log(`LOCK: ${num} -> ${time} `);
    setIntervals(intervals => {
      let t = intervals.intervals[iNum].time;
      let newFixedIntervals = new Map(intervals.fixed);
      newFixedIntervals.set(iNum, Number((t + 1).toFixed(0)));
      const newIntervals = buildIntervals(distance, totalTime, units, newFixedIntervals);
      intervalsRef.current = newIntervals;
      return newIntervals;
    })
  };

  const done = (): void => {
    setq(paramsFromIntervals(intervals));
  }

  const onUnitsChanged = (u: Units): void => {
    if (u === units) {
      return;
    }
    setUnits(u);
    const newIntervals = buildIntervals(distance, totalTime, u, new Map());
    setq(paramsFromIntervals(newIntervals));
    setIntervals(newIntervals);
  }

  const onDistanceChanged = (d: RaceDistance): void => {
    if (d === distance) { return; }
    setDistance(d);
    setTotalTime(d.defaultTime);
    const newIntervals = buildIntervals(d, d.defaultTime, units, new Map());
    setq(paramsFromIntervals(newIntervals));
    setIntervals(newIntervals);
  }

  const onTimeChanged = (t: number): void => {
    if (t === totalTime) { return; }
    setTotalTime(t);
    const newIntervals = buildIntervals(distance, t, units, new Map());
    setq(paramsFromIntervals(newIntervals));
    setIntervals(newIntervals);
  }

  return (
    <ThemeProvider theme={theme}>
      <Toolbar units={units} intervals={intervals} />
      <DistanceTimeSplits units={units} unitsChangeHandler={onUnitsChanged} distance={distance} intervals={intervals} timeChangeHandler={onTimeChanged} distanceChangeHandler={onDistanceChanged} />
      <IntervalsView>
        {intervals.intervals.map(i =>
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
          />)}
      </IntervalsView>
    </ThemeProvider>
  );
}

export default App;
