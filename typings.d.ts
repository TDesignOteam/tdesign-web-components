declare module '*.less';
declare module '*.css';
declare module '*.md?raw' {
  const content: string;
  export default content;
}

import 'dayjs';

declare module 'dayjs' {
  function localeData(): {
    weekdaysMin(): string[];
    firstDayOfWeek(): number;
    monthsShort(): string[];
    months(): string[];
  };
}
