import React from 'react';
import { FaFileCsv } from 'react-icons/fa';
import { IconContext } from 'react-icons'
import { Units } from '../defy/models'
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
        <IconContext.Provider value={{ color: "#fed766" }}>
            <div className="export-button-panel" onClick={exportCsv}>
                <FaFileCsv style={{ verticalAlign: 'middle' }} />
            </div>
        </IconContext.Provider >
    )
}

export default ExportButton;