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

  it('includes the year only when it differs from the current year', () => {
    const today = new Date(2026, 9, 1);
    expect(formatDateKey('2026-12-25', today)).not.toMatch(/2026/);
    expect(formatDateKey('2027-01-05', today)).toMatch(/2027/);
  });
});
