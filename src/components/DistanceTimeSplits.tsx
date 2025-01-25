import UnitsButtons from './UnitsButtons'
import DistancePicker from './DistancePicker';
import TimePicker from './TimePicker';
import { Units, RaceDistance, distances } from '../pc/models'
import { Intervals } from '../pc/pacecalc';

interface Props {
    intervals: Intervals,
    units: Units,
    unitsChangeHandler: (u: Units) => void,
    distance: RaceDistance,
    timeChangeHandler: (t: number) => void,
    distanceChangeHandler: (p: RaceDistance) => void,
}

const DistanceTimeSplits = ({ units, unitsChangeHandler, distance, intervals, timeChangeHandler, distanceChangeHandler }: Props) => {
    return (
        <>
            <div className="distance-time-splits">
                <DistancePicker availableDistances={Object.values(distances)} selectedDistance={distance} changeHandler={distanceChangeHandler} />
                <h3>in</h3>
                <TimePicker selectedTime={intervals.totalTime} changeHandler={timeChangeHandler} />
                <h3>with splits in</h3>
                <UnitsButtons units={units} unitsChangeHandler={unitsChangeHandler} />
            </div>
        </>
    )
}

export default DistanceTimeSplits;