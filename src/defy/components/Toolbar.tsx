import React from 'react';
import ShareButton from './ShareButton'
import ExportButton from '../../components/ExportButton'
import HomeButton from './HomeButton'
import AboutButton from './AboutButton'
import { Units } from '../models'
import { Intervals } from '../../pc/pacecalc';
import GitHubButton from './GitHubButton';

interface Props {
    intervals: Intervals,
    units: Units,
}

const Toolbar = ({ intervals, units }: Props) => {
    return (
        <>
            <div className="tools">
                <div className="tools-start">
                    <HomeButton />
                    <AboutButton />
                    <GitHubButton />
                </div>
                <div className="tools-middle">
                    <h1>Pace Playground</h1>
                </div>
                <div className="tools-end">
                    <ShareButton />
                    <ExportButton intervals={intervals} units={units} />
                </div>
            </div>
        </>
    )
}

export default Toolbar;