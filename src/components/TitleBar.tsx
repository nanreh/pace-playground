import { RaceDistance } from '../pc/models';
import { humanizeDuration } from '../pc/models'

interface Props {
    distance: RaceDistance,
    time: number,
}

const TitleBar = ({ distance, time }: Props) => {
    return (
        <h2 className="titlebar">{distance.name} in {humanizeDuration(time, { leadingZeroes: false, padHours: false, padMinutes: true, padSeconds: true })}</h2>
    )
}

export default TitleBar