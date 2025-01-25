import React from 'react'
import { RaceDistance } from '../pc/models'

interface Props {
    availableDistances: Array<RaceDistance>,
    selectedDistance: RaceDistance,
    changeHandler: (p: RaceDistance) => void,
}

const DistancePicker = ({ availableDistances, selectedDistance, changeHandler }: Props) => {

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newSelection = availableDistances.find(p => p.name === event.target.value as string);
        if (newSelection) {
            changeHandler(newSelection);
        } else {
            throw new Error("Invalid selection: " + event.target.value);
        }
    }

    const options = availableDistances.map(d => (
        <option key={d.name} value={d.name}>{d.name}</option>
    ));

    return (
        <select value={selectedDistance.name} onChange={handleChange}>
            {options}
        </select>
    )
}

export default DistancePicker;