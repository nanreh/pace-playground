import React from 'react';
import UnitsButtons from '../defy/components/UnitsButtons'
import styled from 'styled-components'
import DistancePicker from './DistancePicker';
import TimePicker from './TimePicker';
import { Units, RaceDistance, distances } from '../defy/models'
import { Intervals } from '../pc/pacecalc';

interface Props {
    intervals: Intervals,
    units: Units,
    unitsChangeHandler: (u: Units) => void,
    distance: RaceDistance,
    timeChangeHandler: (t: number) => void,
    distanceChangeHandler: (p: RaceDistance) => void,
}

const Title = styled.h3`
    display: inline;
    margin: 0 .4em;
`

const Root = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 1em 0 5px 0;
    color: ${(props) => props.theme.colors.controlsTitle};
    @media (max-width: ${(props) => props.theme.screenSizes.lg}) {
        flex-direction: column;
      }
`

const DistanceTimeSplits: React.FC<Props> = ({ units, unitsChangeHandler, distance, intervals, timeChangeHandler, distanceChangeHandler }) => {
    return (
        <>
            <Root>
                <DistancePicker availableDistances={Object.values(distances)} selectedDistance={distance} changeHandler={distanceChangeHandler} />
                <Title>in</Title>
                <TimePicker selectedTime={intervals.totalTime} changeHandler={timeChangeHandler} />
                <Title>with splits in</Title>
                <UnitsButtons units={units} unitsChangeHandler={unitsChangeHandler} />
            </Root>
        </>
    )
}

export default DistanceTimeSplits;