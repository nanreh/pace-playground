import { Units } from '../pc/models'
import { Intervals } from '../pc/pacecalc';
import ShareButton from './ShareButton';
import ExportButton from './ExportButton';

interface Props {
    intervals: Intervals,
    units: Units,
}

const ExportShare = ({ units, intervals }: Props) => {
    return (
        <>
            <div className="distance-time-splits">
                <ShareButton /> 
                <ExportButton intervals={intervals} units={units} />
            </div>
        </>
    )
}

export default ExportShare;