import { IconContext } from 'react-icons'
import { Radio } from './Radios';
import { Units } from '../pc/models'

interface Props {
    units: Units,
    unitsChangeHandler: (u: Units) => void,
}

const UnitsButtons = ({ units, unitsChangeHandler }: Props) => {

    const changeCb = (event: React.FormEvent<HTMLInputElement>) => {
        const newSelection = "mi" === event.currentTarget.value ? 'mi' : 'km';
        unitsChangeHandler(newSelection);
    }

    return (
        <IconContext.Provider value={{ color: "#fed766" }}>
            <div className="unit-buttons-panel">
                <Radio
                    id="radio-mi"
                    name="radio-units"
                    value="mi"
                    labelTxt="Mi"
                    changeCb={changeCb}
                    currentValue={units}
                />
                <Radio
                    id="radio-km"
                    name="radio-units"
                    value="km"
                    labelTxt="Km"
                    changeCb={changeCb}
                    currentValue={units}
                />
            </div>
        </IconContext.Provider>
    )
}

export default UnitsButtons;