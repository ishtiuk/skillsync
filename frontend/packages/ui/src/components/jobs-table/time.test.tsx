import { calculateActivityString } from './JobRow';
import { describe, it, expect, afterEach } from 'vitest';

describe('calculateActivityString', () => {
  const activityDate = new Date('September 2, 2024 10:30:00');
  it('will return minutes ago', () => {
    const now = new Date('September 2, 2024 10:36:00');
    const result = calculateActivityString(
      activityDate.getTime(),
      now.getTime()
    );
    expect(result).toEqual('6 mins ago');
  });
  it('will return a minute ago', () => {
    const now = new Date('September 2, 2024 10:31:00');
    const result = calculateActivityString(
      activityDate.getTime(),
      now.getTime()
    );
    expect(result).toEqual('1 min ago');
  });
  it('will return an hour ago', () => {
    const now = new Date('September 2, 2024 11:35:00');
    const result = calculateActivityString(
      activityDate.getTime(),
      now.getTime()
    );
    expect(result).toEqual('An hour ago');
  });
  it('will return hours ago', () => {
    const now = new Date('September 2, 2024 20:35:00');
    const result = calculateActivityString(
      activityDate.getTime(),
      now.getTime()
    );
    expect(result).toEqual('10 hours ago');
  });
  it('will return yesterday', () => {
    const now = new Date('September 3, 2024 00:35:00');
    const result = calculateActivityString(
      activityDate.getTime(),
      now.getTime()
    );
    expect(result).toEqual('Yesterday');
  });
  it('will return this week', () => {
    const now = new Date('September 7, 2024 00:35:00');
    const result = calculateActivityString(
      activityDate.getTime(),
      now.getTime()
    );
    expect(result).toEqual('This week');
  });
  it('will return last week', () => {
    const now = new Date('September 9, 2024 00:35:00');
    const result = calculateActivityString(
      activityDate.getTime(),
      now.getTime()
    );
    expect(result).toEqual('Last week');
  });
  it('will return the date', () => {
    const now = new Date('October 9, 2024 00:35:00');
    const result = calculateActivityString(
      activityDate.getTime(),
      now.getTime()
    );
    expect(result).toEqual('9/2/2024');
  });
});
