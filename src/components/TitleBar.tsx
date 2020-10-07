import React from 'react';
import { RaceDistance } from '../defy/models';
import styled from 'styled-components';
import { humanizeDuration } from '../defy/models'

interface Props {
    distance: RaceDistance,
    time: number,
}

const H2 = styled.h2`
    width: 100%;
    text-align: center;
`

const TitleBar: React.FC<Props> = ({ distance, time }) => {
    return (
        <H2>{distance.name} in {humanizeDuration(time, { leadingZeroes: false, padHours: false, padMinutes: true, padSeconds: true })}</H2>
    )
}

export default TitleBar