import React from 'react'
import { RaceDistance } from '../defy/models'
import Select from '../defy/components/Select'

interface Props {
    availableDistances: Array<RaceDistance>,
    selectedDistance: RaceDistance,
    changeHandler: (p: RaceDistance) => void,
}

const DistancePicker: React.FC<Props> = ({ availableDistances, selectedDistance, changeHandler }) => {

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
        <Select value={selectedDistance.name} onChange={handleChange}>
            {options}
        </Select>
    )
}

export default DistancePicker;