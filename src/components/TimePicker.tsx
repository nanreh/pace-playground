
interface Props {
    selectedTime: number, // seconds
    changeHandler: (t: number) => void,
}

const TimePicker = ({ selectedTime, changeHandler } : Props) => {
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
        <div className="time-picker">
            <select className={"select-css"} value={_hours} onChange={(v) => { _hours = (Number(v.target.value)); handleChange(_hours, _minutes, _seconds); }}>
                {optionsHour}
            </select>
            <select className={"select-css"} value={_minutes} onChange={(v) => { _minutes = (Number(v.target.value)); handleChange(_hours, _minutes, _seconds); }}>
                {optionsMinute}
            </select>
            <select className={"select-css"} value={_seconds} onChange={(v) => { _seconds = (Number(v.target.value)); handleChange(_hours, _minutes, _seconds); }}>
                {optionsSeconds}
            </select>
        </div>
    )
}

export default TimePicker;