import React from 'react';
import Select from '../defy/components/Select'
import styled from 'styled-components'

interface Props {
    selectedTime: number, // seconds
    changeHandler: (t: number) => void,
}

const Root = styled.div`
    display: flex;
    display: inline;
    & > select {
        display: inline;
    }
`

const TimePicker: React.FC<Props> = ({ selectedTime, changeHandler }) => {
    let _hours = Math.floor(selectedTime / (60 * 60));
    let _minutes = Math.floor((selectedTime - _hours * 60 * 60) / 60);
    let _seconds = selectedTime % 60;

    //console.log(`initialHours: ${_hours}, initialMinutes: ${_minutes}, initialSeconds: ${_seconds}`)

    const handleChange = (hours: number, minutes: number, seconds: number) => {
        changeHandler(hours * 60 * 60 + minutes * 60 + seconds);
    }

    const optionsHour = Array.from(Array(15).keys()).map(d => (
        <option key={d} value={d}>{d + 'h'}</option>
    ));
    const optionsMinute = Array.from(Array(60).keys()).map(d => (
        <option key={d} value={d}>{d + 'm'}</option>
    ));
    const optionsSeconds = Array.from(Array(60).keys()).map(d => (
        <option key={d} value={d}>{d + 's'}</option>
    ));

    return (
        <Root>
            <Select className={"select-css"} value={_hours} onChange={(v) => { _hours = (Number(v.target.value)); handleChange(_hours, _minutes, _seconds); }}>
                {optionsHour}
            </Select>
            <Select className={"select-css"} value={_minutes} onChange={(v) => { _minutes = (Number(v.target.value)); handleChange(_hours, _minutes, _seconds); }}>
                {optionsMinute}
            </Select>
            <Select className={"select-css"} value={_seconds} onChange={(v) => { _seconds = (Number(v.target.value)); handleChange(_hours, _minutes, _seconds); }}>
                {optionsSeconds}
            </Select>
        </Root>
    )
}

export default TimePicker;