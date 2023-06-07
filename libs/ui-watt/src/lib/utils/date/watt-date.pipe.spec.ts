import { WattDatePipe } from './watt-date.pipe';

describe(WattDatePipe, () => {
  const pipe = new WattDatePipe();

  it('transforms "2021-12-31T23:00:00Z" to "01-01-2022"', () => {
    expect(pipe.transform('2021-12-31T23:00:00Z')).toBe('01-01-2022');
  });

  it('transforms "2021-06-30T22:00:00Z" to "01-07-2021"', () => {
    expect(pipe.transform('2021-06-30T22:00:00Z')).toBe('01-07-2021');
  });

  it('transforms "2015-01-24T03:14:15Z" to "24-01-2015 04:14"', () => {
    expect(pipe.transform('2015-01-24T03:14:15Z', 'long')).toBe('24-01-2015 04:14');
  });

  it('transforms "2015-09-21T03:14:15Z" to "21-09-2015 05:14"', () => {
    expect(pipe.transform('2015-09-21T03:14:15Z', 'long')).toBe('21-09-2015 05:14');
  });

  it('transforms date range in short format', () => {
    const range = { start: '2019-03-25T22:00:00Z', end: '2019-03-27T21:59:59Z' };
    expect(pipe.transform(range)).toBe('25-03-2019 ― 27-03-2019');
  });

  it('transforms date range in long format', () => {
    const range = { start: '2023-01-01T22:00:00Z', end: '2023-02-01T21:59:59Z' };
    expect(pipe.transform(range, 'long')).toBe('01-01-2023 23:00 ― 01-02-2023 22:59');
  });

  it('transforms invalid values to null', () => {
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform(undefined)).toBe(null);
    expect(pipe.transform('')).toBe(null);
    expect(pipe.transform(null, 'long')).toBe(null);
    expect(pipe.transform(undefined, 'long')).toBe(null);
    expect(pipe.transform('', 'long')).toBe(null);
  });
});
