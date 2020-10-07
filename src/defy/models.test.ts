import { humanizeDuration, renderOpts } from './models';

const zeroAndPad: renderOpts = { leadingZeroes: true, padHours: true, padMinutes: true, padSeconds: true }
const zeroNoPad: renderOpts = { leadingZeroes: true, padHours: false, padMinutes: false, padSeconds: false }

const noZeroWithPad: renderOpts = { leadingZeroes: false, padHours: true, padMinutes: true, padSeconds: true }
const noZeroNoPad: renderOpts = { leadingZeroes: false, padHours: false, padMinutes: false, padSeconds: false }

const noZeroNoHoursPad: renderOpts = { leadingZeroes: false, padHours: false, padMinutes: true, padSeconds: true }
const noZeroNoMinutesPad: renderOpts = { leadingZeroes: false, padHours: true, padMinutes: false, padSeconds: true }

test('humanize duration test 01', () => {
    expect(humanizeDuration(6179.7, zeroAndPad)).toEqual("01:42:59");
});

test('humanize duration test 02', () => {
    expect(humanizeDuration(410, zeroAndPad)).toEqual("00:06:50");
    expect(humanizeDuration(410, noZeroWithPad)).toEqual("06:50");
    expect(humanizeDuration(410, noZeroNoPad)).toEqual("6:50");

    expect(humanizeDuration(0, noZeroNoPad)).toEqual("");
    expect(humanizeDuration(0, zeroAndPad)).toEqual("00:00:00");
    expect(humanizeDuration(0, zeroNoPad)).toEqual("0:0:0");

    expect(humanizeDuration(9, noZeroNoPad)).toEqual("9");
    expect(humanizeDuration(9, noZeroWithPad)).toEqual("09");
    expect(humanizeDuration(9, zeroAndPad)).toEqual("00:00:09");

    expect(humanizeDuration(62, noZeroNoMinutesPad)).toEqual("1:02");
    expect(humanizeDuration(62, noZeroWithPad)).toEqual("01:02");

    expect(humanizeDuration(60, noZeroWithPad)).toEqual("01:00");

    expect(humanizeDuration(60 * 60 + 2, zeroAndPad)).toEqual("01:00:02")
    expect(humanizeDuration(60 * 60 + 2, noZeroWithPad)).toEqual("01:00:02")
    expect(humanizeDuration(60 * 60 + 2, noZeroNoHoursPad)).toEqual("1:00:02")
    expect(humanizeDuration(60 * 60 + 2, noZeroNoPad)).toEqual("1:0:2")
});
