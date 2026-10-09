import { toCsv } from './csvservice';
import { buildIntervals } from './pacecalc';
import { distances } from './models';

describe('toCsv', () => {
    test('has a header and one row per split', () => {
        const csv = toCsv(buildIntervals(distances['5K'], 1200, 'km', new Map()), 'km');

        expect(csv.split('\n')).toEqual([
            'Distance,Time,Split Pace',
            '1km,04:00,4:00',
            '2km,08:00,4:00',
            '3km,12:00,4:00',
            '4km,16:00,4:00',
            '5km,20:00,4:00',
        ]);
    });

    test('shows a locked split at its own pace', () => {
        const csv = toCsv(buildIntervals(distances['5K'], 1200, 'km', new Map([[0, 300]])), 'km');

        expect(csv.split('\n').slice(1, 3)).toEqual([
            '1km,05:00,5:00',
            '2km,08:45,3:45',
        ]);
    });

    test('reports distances in miles, with a partial last split', () => {
        const rows = toCsv(buildIntervals(distances['5K'], 1200, 'mi', new Map()), 'mi').split('\n');

        expect(rows).toHaveLength(5);
        expect(rows[1].split(',')[0]).toBe('1mi');
        expect(rows[4].split(',')[0]).toBe('3.1mi');
        expect(rows[4].split(',')[1]).toBe('20:00');
    });
});
