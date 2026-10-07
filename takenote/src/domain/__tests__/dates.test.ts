/**
 * @jest-environment node
 */
import { formatDateKey, fromDateKey, toDateKey } from '../dates';

describe('date keys', () => {
  it('round-trips a local calendar date', () => {
    expect(toDateKey(fromDateKey('2026-10-09'))).toBe('2026-10-09');
    expect(toDateKey(fromDateKey('2027-01-01'))).toBe('2027-01-01');
  });

  it('uses local day, not UTC day', () => {
    const lateEvening = new Date(2026, 9, 9, 23, 30);
    expect(toDateKey(lateEvening)).toBe('2026-10-09');
  });

  it('labels today and tomorrow, including across a month boundary', () => {
    const today = new Date(2026, 9, 31, 12);
    expect(formatDateKey('2026-10-31', today)).toBe('Today');
    expect(formatDateKey('2026-11-01', today)).toBe('Tomorrow');
  });

  it('labels tomorrow across a year boundary', () => {
    const newYearsEve = new Date(2026, 11, 31, 23, 59);
    expect(formatDateKey('2027-01-01', newYearsEve)).toBe('Tomorrow');
  });

  it('parses a key to local midnight', () => {
    const d = fromDateKey('2026-03-05');
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2026, 2, 5, 0]);
  });

  it('zero-pads single-digit months and days', () => {
    expect(toDateKey(new Date(2026, 0, 7))).toBe('2026-01-07');
  });

  it('includes the year only when it differs from the current year', () => {
    const today = new Date(2026, 9, 1);
    expect(formatDateKey('2026-12-25', today)).not.toMatch(/2026/);
    expect(formatDateKey('2027-01-05', today)).toMatch(/2027/);
  });
});
