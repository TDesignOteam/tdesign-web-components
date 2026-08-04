// 组件包内声明 dayjs 插件类型，确保增强解析到 components 使用的 dayjs 版本。
import 'dayjs/plugin/isoWeek';
import 'dayjs/plugin/localeData';

declare module 'dayjs' {
  interface Dayjs {
    isoWeekYear(): number;
    isoWeek(): number;
  }
}
