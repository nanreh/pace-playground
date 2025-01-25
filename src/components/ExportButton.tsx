import { Units } from '../pc/models'
import { Intervals } from '../pc/pacecalc'
import { toCsv, download } from "../pc/csvservice";

interface Props {
    intervals: Intervals,
    units: Units,
}

const ExportButton = ({ intervals, units }: Props) => {

    const exportCsv = (): void => {
        const csvData = toCsv(intervals, units);
        download(csvData, 'intervals', 'csv');
    }

    return (
        <button className="app-button" onClick={exportCsv}>Download CSV</button>
    )
}

export default ExportButton;