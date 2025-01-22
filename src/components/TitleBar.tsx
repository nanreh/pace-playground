import React from 'react';
import { RaceDistance } from '../defy/models';
import { humanizeDuration } from '../defy/models'

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