
export const QUESTIONS_PER_LEVEL: { [key: number]: number } = {
  1: 30,
  2: 40,
  3: 50, // This will be added to previous levels
};

export const TOTAL_QUESTIONS_TARGET = 150;

export const ANSWER_OPTIONS = [
  { label: 'کاملاً مخالفم', value: -2 },
  { label: 'مخالفم', value: -1 },
  { label: 'بی‌تفاوت / مطمئن نیستم', value: 0 },
  { label: 'موافقم', value: 1 },
  { label: 'کاملاً موافقم', value: 2 },
];
