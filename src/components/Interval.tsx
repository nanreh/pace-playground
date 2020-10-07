import React from 'react';
import styled from 'styled-components'
import { humanizeDuration, humanizeDistance } from '../defy/models'
import { Units } from '../defy/models'
import LongPressButton from '../defy/components/LongPressButton'
import LockButton from './LockButton'

interface Props {
    num: number,
    time: number,
    cumulativeTime: number,
    cumulativeDistance: number,
    distance: number,
    slowestInterval: number,
    locked: boolean,
    faster: (num: number) => void,
    slower: (num: number) => void,
    unlock: (num: number) => void,
    done: () => void,
    units: Units,
}

interface SpeedMeterProps {
    time: number,
    slowestInterval: number,
}

const Root = styled.div<Props>`
    display: grid;
    grid-template-columns: 3em auto 4em 3em 3em;
    justify-items: center;
    align-items: center;
    background-color: ${(props) => props.theme.colors.intervalBg};
    width: 100%;
    min-width: 30%;
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
`

const Title = styled.div`
    color: ${(props) => props.theme.colors.onyx};
    font-size: 1em;
    & > button { display: inline }
    & > h2 {
        color: ${(props) => props.theme.colors.controlsTitle};
        display: inline
    }
    @media (max-width: ${(props) => props.theme.screenSizes.md}) {
        & > h2 { font-size: 1.1em; }
    }
`

const SpeedMeter = styled.div<SpeedMeterProps>`
    grid-column-start: 1;
    grid-column-end: 6;
    justify-self: start;
    align-self: end;
    background-color: ${(props) => props.theme.colors.speedBarBg};
    min-height: .75em;
    width: ${(props) => ((props.time / props.slowestInterval) * 100).toFixed(2) + '%'};
    margin: 4px 0 0 0
`

export const Interval: React.FC<Props> = ({ num, time, cumulativeTime, cumulativeDistance, distance, slowestInterval, locked, faster, slower, unlock, done, units }) => {
    // console.log(`${num} => ${time}`);

    const renderOpts = { leadingZeroes: false, padHours: false, padMinutes: true, padSeconds: true };
    return (
        <Root num={num} time={time} cumulativeTime={cumulativeTime} cumulativeDistance={cumulativeDistance} distance={distance} slowestInterval={slowestInterval} locked={locked} faster={faster} slower={slower} done={done} unlock={unlock} units={units}>
            <LongPressButton activeCb={() => faster(num)} doneCb={done} type="minus" />
            <Title>
                <h2>{humanizeDistance(cumulativeDistance, units)} in {humanizeDuration(cumulativeTime, renderOpts)}</h2>
            </Title>
            <Title>
                <h2>{humanizeDuration(time, { leadingZeroes: false, padHours: false, padMinutes: false, padSeconds: true })}</h2>
            </Title>
            {locked && <LockButton unlockCb={() => unlock(num)} />}
            {!locked && <p></p>}
            <LongPressButton activeCb={() => slower(num)} doneCb={done} type="plus" />
            <SpeedMeter time={time} slowestInterval={slowestInterval} />
        </Root>
    )
}