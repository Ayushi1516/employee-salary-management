import { CompactUsdPipe } from './compact-usd.pipe';
import { CountryNamePipe } from './country-name.pipe';
import { FullNamePipe } from './full-name.pipe';
import { MoneyPipe } from './money.pipe';

describe('pipes', () => {
  it('money formats in the given currency and never prints NaN', () => {
    const pipe = new MoneyPipe();
    expect(pipe.transform(50000, 'USD')).toBe('$50,000');
    expect(pipe.transform(null)).toBe('--');
    expect(pipe.transform(undefined)).toBe('--');
  });

  it('compactUsd shortens large numbers', () => {
    expect(new CompactUsdPipe().transform(1_250_000)).toBe('$1.25M');
  });

  it('countryName maps codes and keeps unknown ones', () => {
    const pipe = new CountryNamePipe();
    expect(pipe.transform('IN')).toBe('India');
    expect(pipe.transform('ZZ')).toBe('ZZ');
    expect(pipe.transform(null)).toBe('--');
  });

  it('fullName joins first and last name', () => {
    expect(new FullNamePipe().transform({ firstName: 'Ayushi', lastName: 'Solanki' })).toBe('Ayushi Solanki');
    expect(new FullNamePipe().transform(null)).toBe('');
  });
});
