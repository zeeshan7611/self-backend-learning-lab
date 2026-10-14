import { DayLesson } from '../types';
import { DAYS_1_TO_5 } from './days1to5';
import { DAYS_6_TO_10 } from './days6to10';
import { DAYS_11_TO_16 } from './days11to16';
import { DAYS_17_TO_21 } from './days17to21';
import { DAYS_22_TO_25 } from './days22to25';

export const ALL_LESSONS: DayLesson[] = [
  ...DAYS_1_TO_5,
  ...DAYS_6_TO_10,
  ...DAYS_11_TO_16,
  ...DAYS_17_TO_21,
  ...DAYS_22_TO_25
];

export const getLessonByDay = (day: number): DayLesson | undefined => {
  return ALL_LESSONS.find(l => l.day === day);
};
