import { humanizeDuration, humanizeDistance } from '../pc/models'
import { Units } from '../pc/models'
import LongPressButton from './LongPressButton'
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

export const Interval = ({ num, time, cumulativeTime, cumulativeDistance, slowestInterval, locked, faster, slower, unlock, done, units } : Props) => { // console.log(`${num} => ${time}`);

    const renderOpts = { leadingZeroes: false, padHours: false, padMinutes: true, padSeconds: true };
    return (
        <div className="interval">
            <LongPressButton activeCb={() => faster(num)} doneCb={done} type="minus" />
            <div className="interval-title">
                <h2>{humanizeDistance(cumulativeDistance, units)} in {humanizeDuration(cumulativeTime, renderOpts)}</h2>
            </div>
            <div className="interval-title">
                <h2>{humanizeDuration(time, { leadingZeroes: false, padHours: false, padMinutes: false, padSeconds: true })}</h2>
            </div>
            {locked && <LockButton unlockCb={() => unlock(num)} />}
            {!locked && <p></p>}
            <LongPressButton activeCb={() => slower(num)} doneCb={done} type="plus" />
            <div className="speed-meter" style={{ width: ((time / slowestInterval) * 100).toFixed(2) + '%'  }} />
        </div>
    )
}