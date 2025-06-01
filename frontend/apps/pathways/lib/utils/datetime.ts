import { monthNames } from '../constants/dateConstants';

export const convertNumberToMonthName = (month: number) => {
  return monthNames[month - 1];
};

export const convertMonthNameToNumber = (month: string) => {
  return monthNames.indexOf(month) + 1;
};
