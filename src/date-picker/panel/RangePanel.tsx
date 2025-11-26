import 'tdesign-icons-web-components/esm/components/chevron-down';
import 'tdesign-icons-web-components/esm/components/chevron-left';
import 'tdesign-icons-web-components/esm/components/chevron-right';
import 'tdesign-web-components/select-input';
import 'dayjs/locale/zh-cn';

import classNames from 'classnames';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Component, createRef, OmiProps, tag } from 'omi';

import { parseToDayjs } from '../../_common/js/date-picker/format';
import {
  extractTimeObj,
  flagActive,
  getMonths,
  getQuarters,
  getWeeks,
  getYears,
  isSame,
} from '../../_common/js/date-picker/utils';
import { getClassPrefix } from '../../_util/classname';
import { PaginationMini } from '../../pagination/PaginationMini';
import { TdPaginationMiniProps } from '../../pagination/type';
import { DateValue, DisableDate, PresetRange, TdDateRangePickerProps } from '../type';

dayjs.locale('zh-cn');
dayjs.extend(isoWeek);

const SELECT_WIDTH = '80px';
const LONG_SELECT_WIDTH = '130px';

interface YearOption {
  label: string;
  value: number;
}

type ScrollAnchor = 'default' | 'top' | 'bottom';

interface WeekInfo {
  year: number;
  week: number;
}

export interface DatePickerTableCell {
  text: string | number;
  value: Date;
  time?: string;
  active?: boolean;
  highlight?: boolean;
  hoverHighlight?: boolean;
  disabled?: boolean;
  additional?: boolean;
  now?: boolean;
  firstDayOfMonth?: boolean;
  lastDayOfMonth?: boolean;
  weekOfYear?: boolean;
  startOfRange?: boolean;
  endOfRange?: boolean;
  hoverStartOfRange?: boolean;
  hoverEndOfRange?: boolean;
  dayjsObj?: any;
}

export interface RangePanelProps
  extends Pick<
    TdDateRangePickerProps,
    'mode' | 'firstDayOfWeek' | 'disableDate' | 'presets' | 'presetsPlacement' | 'panelPreselection'
  > {
  format: string;
  value?: string[];
  hoverValue?: string[];
  year: number[];
  month: number[];
  activeIndex?: number;
  isFirstValueSelected?: boolean;
  cancelRangeSelectLimit?: boolean;
  onCellClick?: (value: Date, context: { e: MouseEvent; partial: 'start' | 'end' }) => void;
  onCellMouseEnter?: (value: Date, context: { partial: 'start' | 'end' }) => void;
  onCellMouseLeave?: (context: { e: MouseEvent }) => void;
  onJumperClick?: (context: { trigger: 'prev' | 'next' | 'current'; partial: 'start' | 'end' }) => void;
  onMonthChange?: (month: number, context: { partial: 'start' | 'end' }) => void;
  onYearChange?: (year: number, context: { partial: 'start' | 'end' }) => void;
  onPresetClick?: (preset: DateValue[] | (() => DateValue[]), context: { preset: PresetRange; e: MouseEvent }) => void;
  class?: string;
  style?: Record<string, any> | string;
}

@tag('t-date-range-picker-panel')
export default class RangePanel extends Component<RangePanelProps> {
  static defaultProps: Partial<RangePanelProps> = {
    mode: 'date',
    firstDayOfWeek: 1,
    panelPreselection: true,
    presetsPlacement: 'bottom',
  };

  private classPrefix = getClassPrefix();

  private startMonthPopupVisible = false;

  private startYearPopupVisible = false;

  private endMonthPopupVisible = false;

  private endYearPopupVisible = false;

  private startYearOptions: YearOption[] = [];

  private endYearOptions: YearOption[] = [];

  private scrollAnchor: ScrollAnchor = 'default';

  private startYearPanelRef = createRef<HTMLDivElement>();

  private endYearPanelRef = createRef<HTMLDivElement>();

  private cachedPopupAttach: HTMLElement | null = null;

  install() {
    const { year = [dayjs().year(), dayjs().year()], mode = 'date' } = this.props;
    this.startYearOptions = this.initYearOptions(year[0], mode);
    this.endYearOptions = this.initYearOptions(year[1], mode);
  }

  receiveProps(nextProps: RangePanelProps, oldProps: RangePanelProps): void {
    const nextYear = nextProps.year ?? [dayjs().year(), dayjs().year()];
    const prevYear = oldProps?.year ?? [dayjs().year(), dayjs().year()];
    if (nextYear[0] !== prevYear[0] || nextProps.mode !== oldProps.mode) {
      this.startYearOptions = this.initYearOptions(nextYear[0], nextProps.mode ?? 'date');
    }
    if (nextYear[1] !== prevYear[1] || nextProps.mode !== oldProps.mode) {
      this.endYearOptions = this.initYearOptions(nextYear[1], nextProps.mode ?? 'date');
    }
  }

  private convertToDate(value?: DateValue, format?: string) {
    if (value === null || value === undefined || value === '') return null;
    if (value instanceof Date) return value;
    const parsed = parseToDayjs(value, format);
    if (!parsed || !parsed.isValid()) return null;
    return parsed.toDate();
  }

  private resolveDisableDate(disableDate: DisableDate | undefined, format: string, mode: string) {
    if (!disableDate) return undefined;
    if (typeof disableDate === 'function') {
      return (date: Date) => (disableDate as (d: DateValue) => boolean)(date);
    }
    if (Array.isArray(disableDate)) {
      const cached = disableDate.map((item) => this.convertToDate(item, format)).filter(Boolean) as Date[];
      return (date: Date) => cached.some((item) => isSame(item, date, mode));
    }
    const { before, after, from, to } = disableDate;
    const beforeDate = this.convertToDate(before, format);
    const afterDate = this.convertToDate(after, format);
    const fromDate = this.convertToDate(from, format);
    const toDate = this.convertToDate(to, format);

    return (date: Date) => {
      if (beforeDate && dayjs(date).isBefore(beforeDate, 'day')) return true;
      if (afterDate && dayjs(date).isAfter(afterDate, 'day')) return true;
      if (fromDate && dayjs(date).isBefore(fromDate, 'day')) return true;
      if (toDate && dayjs(date).isAfter(toDate, 'day')) return true;
      return false;
    };
  }

  private buildWeekdays(mode: RangePanelProps['mode'], firstDayOfWeek: number) {
    if (mode !== 'date' && mode !== 'week') return [];
    const localeData = dayjs.localeData();
    const weekdays = localeData.weekdaysMin();
    const start = ((firstDayOfWeek % 7) + 7) % 7;
    const result: string[] = [];
    let index = start;
    for (let i = 0; i < 7; i += 1) {
      result.push(weekdays[index]);
      index = (index + 1) % 7;
    }
    if (mode === 'week') {
      const locale = dayjs.locale() || 'zh-cn';
      const weekLabel = locale.startsWith('zh') ? '周' : 'Week';
      result.unshift(weekLabel);
    }
    return result;
  }

  private getQuarterLabels(): string[] {
    const locale = dayjs.locale();
    if (locale && locale.startsWith('zh')) {
      return ['一季度', '二季度', '三季度', '四季度'];
    }
    return ['Q1', 'Q2', 'Q3', 'Q4'];
  }

  /**
   * 根据mode生成对应的日期/周/月/季度/年数据，并标记选中、悬浮高亮、范围等状态
   */
  private buildTableData(
    props: RangePanelProps,
    year: number,
    month: number,
    partial: 'start' | 'end',
  ): DatePickerTableCell[][] {
    const {
      format,
      mode = 'date',
      firstDayOfWeek = 1,
      disableDate,
      value = [],
      hoverValue = [],
      panelPreselection,
      cancelRangeSelectLimit,
    } = props;

    const disableHandler = this.resolveDisableDate(disableDate, format, mode) || (() => false);

    const dayjsLocale = dayjs.locale();
    const localeData = dayjs.localeData();
    const monthLocal = (localeData.monthsShort && localeData.monthsShort()) || localeData.months();
    const quarterLocal = this.getQuarterLabels();

    const options = {
      firstDayOfWeek,
      disableDate: disableHandler,
      // 一个日期对象相对于该纪元，最多可以表示±8,640,000,000,000毫秒
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
      minDate: new Date(-8.64e15),
      maxDate: new Date(8.64e15),
      monthLocal,
      quarterLocal,
      dayjsLocale,
      cancelRangeSelectLimit: Boolean(cancelRangeSelectLimit),
      showWeekOfYear: mode === 'week',
    };

    let tableSource: any[][] = [];

    if (mode === 'date' || mode === 'week') {
      tableSource = getWeeks({ year, month }, options);
    } else if (mode === 'month') {
      tableSource = getMonths(year, options);
    } else if (mode === 'quarter') {
      tableSource = getQuarters(year, options);
    } else if (mode === 'year') {
      const displayYear = partial === 'end' && props.year[1] - props.year[0] <= 9 ? year + 9 : year;
      tableSource = getYears(displayYear, options);
    }

    const startDate = value[0] ? this.convertToDate(value[0], format) : undefined;
    const endDate = value[1] ? this.convertToDate(value[1], format) : undefined;

    const hidePreselection = !panelPreselection && value.length === 2;
    const hoverStart = !hidePreselection && hoverValue[0] ? this.convertToDate(hoverValue[0], format) : undefined;
    const hoverEnd = !hidePreselection && hoverValue[1] ? this.convertToDate(hoverValue[1], format) : undefined;

    const flagged = flagActive(tableSource, {
      start: startDate ?? undefined,
      end: endDate ?? undefined,
      hoverStart: hoverStart ?? undefined,
      hoverEnd: hoverEnd ?? undefined,
      type: mode,
      isRange: true,
      value,
      multiple: false,
    });

    return flagged.map((row) =>
      row.map((cell, cellIndex) => {
        const isWeekMode = mode === 'week';
        return {
          text: cell.text,
          value: cell.value,
          time: cell.time,
          disabled: cell.disabled,
          now: cell.now,
          additional: cell.additional,
          firstDayOfMonth: cell.firstDayOfMonth,
          lastDayOfMonth: cell.lastDayOfMonth,
          weekOfYear: isWeekMode && cellIndex === 0,
          active: cell.active,
          highlight: cell.highlight,
          hoverHighlight: cell.hoverHighlight,
          startOfRange: cell.startOfRange,
          endOfRange: cell.endOfRange,
          hoverStartOfRange: cell.hoverStartOfRange,
          hoverEndOfRange: cell.hoverEndOfRange,
          dayjsObj: cell.dayjsObj,
        } as DatePickerTableCell;
      }),
    );
  }

  private getMonthOptions() {
    return Array.from({ length: 12 }, (_, index) => ({ label: `${index + 1} 月`, value: index }));
  }

  private initYearOptions(year: number, mode: RangePanelProps['mode'] = 'date'): YearOption[] {
    const options: YearOption[] = [];
    if (mode === 'year') {
      const extraYear = year % 10;
      const minYear = year - extraYear - 100;
      const maxYear = year - extraYear + 100;
      for (let i = minYear; i <= maxYear; i += 10) {
        options.push({ label: `${i} - ${i + 9}`, value: i + 9 });
      }
      return options;
    }

    for (let i = 3; i >= 1; i -= 1) {
      options.push({ label: `${year - i}`, value: year - i });
    }
    options.push({ label: `${year}`, value: year });
    options.push({ label: `${year + 1}`, value: year + 1 });
    return options;
  }

  private loadMoreYear(year: number, type: 'add' | 'reduce', mode: RangePanelProps['mode'] = 'date'): YearOption[] {
    const options: YearOption[] = [];

    if (mode === 'year') {
      const extraYear = year % 10;
      if (type === 'add') {
        for (let i = year - extraYear + 10; i <= year - extraYear + 50; i += 10) {
          options.push({ label: `${i} - ${i + 9}`, value: i });
        }
      } else {
        for (let i = year - extraYear - 1; i > year - extraYear - 50; i -= 10) {
          options.unshift({ label: `${i - 9} - ${i}`, value: i });
        }
      }
      return options;
    }

    if (type === 'add') {
      for (let i = year + 1; i <= year + 5; i += 1) {
        options.push({ label: `${i}`, value: i });
      }
      return options;
    }

    for (let i = year - 1; i >= year - 5; i -= 1) {
      options.unshift({ label: `${i}`, value: i });
    }
    return options;
  }

  private adjustYearScrollPosition(container: HTMLElement | null) {
    if (!container) return;
    this.updateScrollPosition(container);
    this.scrollAnchor = 'default';
  }

  private handleMonthPopupVisibleChange(visible: boolean, partial: 'start' | 'end') {
    if (partial === 'start') {
      if (this.startMonthPopupVisible === visible) return;
      this.startMonthPopupVisible = visible;
    } else {
      if (this.endMonthPopupVisible === visible) return;
      this.endMonthPopupVisible = visible;
    }
    this.update();
  }

  private handleYearPopupVisibleChange(visible: boolean, partial: 'start' | 'end') {
    if (partial === 'start') {
      if (this.startYearPopupVisible === visible) return;
      this.startYearPopupVisible = visible;
      if (!visible) {
        this.scrollAnchor = 'default';
      }
      this.update();
      if (visible) {
        setTimeout(() => this.adjustYearScrollPosition(this.startYearPanelRef.current?.parentElement as HTMLElement));
      }
    } else {
      if (this.endYearPopupVisible === visible) return;
      this.endYearPopupVisible = visible;
      if (!visible) {
        this.scrollAnchor = 'default';
      }
      this.update();
      if (visible) {
        setTimeout(() => this.adjustYearScrollPosition(this.endYearPanelRef.current?.parentElement as HTMLElement));
      }
    }
  }

  private handleMonthOptionClick(value: number, partial: 'start' | 'end') {
    this.props.onMonthChange?.(value, { partial });
    if (partial === 'start') {
      this.startMonthPopupVisible = false;
    } else {
      this.endMonthPopupVisible = false;
    }
    this.update();
  }

  private handleYearOptionClick(value: number, partial: 'start' | 'end') {
    this.props.onYearChange?.(value, { partial });
    if (partial === 'start') {
      this.startYearPopupVisible = false;
    } else {
      this.endYearPopupVisible = false;
    }
    this.update();
  }

  private handlePanelTopClick(partial: 'start' | 'end', e?: MouseEvent) {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    const yearOptions = partial === 'start' ? this.startYearOptions : this.endYearOptions;
    if (!yearOptions.length) return;
    const options = this.loadMoreYear(yearOptions[0].value, 'reduce', this.props.mode);
    if (!options.length) return;
    if (partial === 'start') {
      this.startYearOptions = [...options, ...this.startYearOptions];
    } else {
      this.endYearOptions = [...options, ...this.endYearOptions];
    }
    this.scrollAnchor = 'top';
    this.update();
    setTimeout(() => {
      const panelRef = partial === 'start' ? this.startYearPanelRef : this.endYearPanelRef;
      this.adjustYearScrollPosition(panelRef.current?.parentElement as HTMLElement);
    });
  }

  private handlePanelBottomClick(partial: 'start' | 'end', e?: MouseEvent) {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    const yearOptions = partial === 'start' ? this.startYearOptions : this.endYearOptions;
    if (!yearOptions.length) return;
    const options = this.loadMoreYear(yearOptions.slice(-1)[0].value, 'add', this.props.mode);
    if (!options.length) return;
    if (partial === 'start') {
      this.startYearOptions = [...this.startYearOptions, ...options];
    } else {
      this.endYearOptions = [...this.endYearOptions, ...options];
    }
    this.scrollAnchor = 'bottom';
    this.update();
    setTimeout(() => {
      const panelRef = partial === 'start' ? this.startYearPanelRef : this.endYearPanelRef;
      this.adjustYearScrollPosition(panelRef.current?.parentElement as HTMLElement);
    });
  }

  private handleYearPanelScroll =
    (partial: 'start' | 'end') =>
    ({ e }: { e: WheelEvent }) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (target.scrollTop === 0) {
        this.handlePanelTopClick(partial);
        this.scrollAnchor = 'top';
      } else if (Math.ceil(target.scrollTop + target.clientHeight) >= target.scrollHeight) {
        this.handlePanelBottomClick(partial);
        this.scrollAnchor = 'bottom';
      }
    };

  private handlePaginationChange =
    (partial: 'start' | 'end'): NonNullable<TdPaginationMiniProps['onChange']> =>
    ({ trigger }) => {
      this.props.onJumperClick?.({ trigger, partial });
    };

  private getMonthLabel(month: number | undefined): string {
    if (typeof month !== 'number') return '';
    const options = this.getMonthOptions();
    return options.find((item) => item.value === month)?.label ?? `${month + 1}`;
  }

  private getNearestYearValue(year: number, yearOptions: YearOption[], mode: RangePanelProps['mode'] = 'date'): number {
    if (mode !== 'year') return year;
    const matched = yearOptions.find((option) => option.value - year <= 9 && option.value - year >= 0);
    return matched?.value ?? year;
  }

  private getYearLabel(year: number, yearOptions: YearOption[], mode: RangePanelProps['mode'] = 'date'): string {
    if (mode === 'year') {
      const option = yearOptions.find((item) => item.value === year);
      if (option) return option.label;
      const decadeStart = year - (year % 10);
      return `${decadeStart} - ${decadeStart + 9}`;
    }
    return `${year}`;
  }

  private getPaginationTips(mode: RangePanelProps['mode']) {
    const tipsMap: Record<string, { prev: string; current: string; next: string }> = {
      year: { prev: '上一年代', current: '当前', next: '下一年代' },
      month: { prev: '上一年', current: '当前', next: '下一年' },
      date: { prev: '上一月', current: '今天', next: '下一月' },
    };
    if (!mode) return undefined;
    return tipsMap[mode];
  }

  private handleUpdateScrollTop = (content: HTMLElement) => {
    this.updateScrollPosition(content);
  };

  private updateScrollPosition(container: HTMLElement) {
    if (this.scrollAnchor === 'top') {
      container.scrollTop = 30 * 10;
      return;
    }
    if (this.scrollAnchor === 'bottom') {
      container.scrollTop = container.scrollHeight - 30 * 10;
      return;
    }
    const selectedNode = container.querySelector(`.${this.classPrefix}-is-selected`);
    if (selectedNode instanceof HTMLElement) {
      const { offsetTop, clientHeight } = selectedNode;
      const offset = offsetTop - (container.clientHeight - clientHeight) / 2;
      container.scrollTop = offset < 0 ? 0 : offset;
    }
  }

  private findPopupContainer(triggerElement?: HTMLElement | null): HTMLElement | null {
    if (!triggerElement) return null;

    const popupContentClass = `${this.classPrefix}-popup__content`;
    const popupWrapperClass = `${this.classPrefix}-popup`;

    let current: Node | null = triggerElement;
    const visited = new Set<Node>();

    while (current && !visited.has(current)) {
      visited.add(current);

      if (current instanceof HTMLElement) {
        if (current.classList.contains(popupContentClass) || current.classList.contains(popupWrapperClass)) {
          return current;
        }

        if (current.parentElement) {
          current = current.parentElement;
          continue;
        }
      }

      const rootNode = (current as Element | ShadowRoot)?.getRootNode?.();
      if (rootNode instanceof ShadowRoot) {
        current = rootNode.host;
        continue;
      }

      current = null;
    }

    return null;
  }

  private resolvePopupAttach(triggerElement?: HTMLElement | null): HTMLElement {
    const popupClass = `${this.classPrefix}-popup`;
    const popupContentClass = `${this.classPrefix}-popup__content`;

    const normalizeContainer = (container: HTMLElement | null) => {
      if (!container) return null;
      if (!document.contains(container)) return null;
      if (container.classList.contains(popupContentClass)) {
        const wrapper = container.parentElement;
        if (wrapper instanceof HTMLElement && wrapper.classList.contains(popupClass)) {
          return wrapper;
        }
      }
      return container;
    };

    if (this.cachedPopupAttach && document.contains(this.cachedPopupAttach)) {
      return this.cachedPopupAttach;
    }

    let popupContainer = this.findPopupContainer(triggerElement);
    if (!popupContainer && this.rootElement instanceof HTMLElement) {
      popupContainer = this.findPopupContainer(this.rootElement);
    }

    const normalized = normalizeContainer(popupContainer);
    if (normalized) {
      this.cachedPopupAttach = normalized;
      return normalized;
    }

    if (this.rootElement instanceof HTMLElement && document.contains(this.rootElement)) {
      this.cachedPopupAttach = this.rootElement;
      return this.rootElement;
    }

    const parentElement = triggerElement?.parentElement;
    if (parentElement && !(parentElement instanceof HTMLButtonElement)) {
      this.cachedPopupAttach = parentElement;
      return parentElement;
    }

    const rootNode = triggerElement?.getRootNode?.();
    if (rootNode instanceof ShadowRoot && rootNode.host instanceof HTMLElement) {
      this.cachedPopupAttach = rootNode.host;
      return rootNode.host;
    }

    return document.body;
  }

  private getCellValueWithTime(cell: DatePickerTableCell) {
    if (!cell.time) return cell.value;
    const next = new Date(cell.value);
    const { hours, minutes, seconds, milliseconds, meridiem } = extractTimeObj(cell.time);
    let nextHours = hours;
    if (/am/i.test(meridiem) && nextHours === 12) nextHours -= 12;
    if (/pm/i.test(meridiem) && nextHours < 12) nextHours += 12;
    next.setHours(nextHours);
    next.setMinutes(minutes);
    next.setSeconds(seconds);
    next.setMilliseconds(milliseconds);
    return next;
  }

  private renderTableCell(
    cell: DatePickerTableCell,
    cellIndex: number,
    partial: 'start' | 'end',
    onCellClick?: (value: Date, context: { e: MouseEvent; partial: 'start' | 'end' }) => void,
    onCellMouseEnter?: (value: Date, context: { partial: 'start' | 'end' }) => void,
  ) {
    const cellClass = classNames(`${this.classPrefix}-date-picker__cell`, {
      [`${this.classPrefix}-date-picker__cell--now`]: cell.now,
      [`${this.classPrefix}-date-picker__cell--active`]: cell.active,
      [`${this.classPrefix}-date-picker__cell--disabled`]: cell.disabled,
      [`${this.classPrefix}-date-picker__cell--highlight`]: cell.highlight,
      [`${this.classPrefix}-date-picker__cell--hover-highlight`]: cell.hoverHighlight,
      [`${this.classPrefix}-date-picker__cell--active-start`]: cell.startOfRange,
      [`${this.classPrefix}-date-picker__cell--active-end`]: cell.endOfRange,
      [`${this.classPrefix}-date-picker__cell--hover-start`]: cell.hoverStartOfRange,
      [`${this.classPrefix}-date-picker__cell--hover-end`]: cell.hoverEndOfRange,
      [`${this.classPrefix}-date-picker__cell--additional`]: cell.additional,
      [`${this.classPrefix}-date-picker__cell--first-day-of-month`]: cell.firstDayOfMonth,
      [`${this.classPrefix}-date-picker__cell--last-day-of-month`]: cell.lastDayOfMonth,
      [`${this.classPrefix}-date-picker__cell--week-of-year`]: cell.weekOfYear,
    });

    const handleClick = (e: MouseEvent) => {
      if (cell.disabled) return;
      onCellClick?.(this.getCellValueWithTime(cell), { e, partial });
    };

    const handleMouseEnter = () => {
      if (cell.disabled) return;
      onCellMouseEnter?.(this.getCellValueWithTime(cell), { partial });
    };

    return (
      <td className={cellClass} key={cellIndex} onClick={handleClick} onMouseEnter={handleMouseEnter}>
        <div className={`${this.classPrefix}-date-picker__cell-inner`}>{cell.text}</div>
      </td>
    );
  }

  private renderTable(
    data: DatePickerTableCell[][],
    weekdays: string[],
    partial: 'start' | 'end',
    props: RangePanelProps,
  ) {
    const {
      mode = 'date',
      onCellClick,
      onCellMouseEnter,
      onCellMouseLeave,
      value,
      hoverValue,
      format,
      panelPreselection,
    } = props;
    const showThead = mode === 'date' || mode === 'week';

    const getWeekInfo = (val?: string): WeekInfo | null => {
      if (!val || !format) return null;
      const parsed = parseToDayjs(val, format);
      if (!parsed || !parsed.isValid()) return null;
      const localized = parsed.locale(dayjs.locale());
      return { year: localized.isoWeekYear(), week: localized.isoWeek() };
    };

    const getRowWeekInfo = (row: DatePickerTableCell[]): WeekInfo | null => {
      const targetCell = row.find((cell) => !cell.weekOfYear) ?? row[0];
      if (!targetCell) return null;
      const targetDayjs = targetCell.dayjsObj ? dayjs(targetCell.dayjsObj) : dayjs(targetCell.value);
      if (!targetDayjs?.isValid?.()) return null;
      return { year: targetDayjs.isoWeekYear(), week: targetDayjs.isoWeek() };
    };

    const isSameWeek = (a: WeekInfo | null | undefined, b: WeekInfo | null | undefined) =>
      Boolean(a && b && a.year === b.year && a.week === b.week);

    const toComparable = (info: WeekInfo | null | undefined) => (info ? info.year * 100 + info.week : Number.NaN);

    const isBetweenWeeks = (target: WeekInfo | null, start: WeekInfo | null, end: WeekInfo | null) => {
      if (!target || !start || !end) return false;
      const targetKey = toComparable(target);
      const startKey = toComparable(start);
      const endKey = toComparable(end);
      if (Number.isNaN(targetKey) || Number.isNaN(startKey) || Number.isNaN(endKey)) return false;
      const min = Math.min(startKey, endKey);
      const max = Math.max(startKey, endKey);
      return targetKey > min && targetKey < max;
    };

    const hidePreselection = !panelPreselection && (value?.length ?? 0) === 2;
    const valueWeekInfos = (value || []).map((item) => getWeekInfo(item)).filter(Boolean) as WeekInfo[];
    const hoverWeekInfos = hidePreselection
      ? []
      : ((hoverValue || []).map((item) => getWeekInfo(item)).filter(Boolean) as WeekInfo[]);

    const buildWeekRowClass = (row: DatePickerTableCell[]) => {
      if (mode !== 'week') return undefined;
      const baseClass = `${this.classPrefix}-date-picker__table-${mode}-row`;
      const targetInfo = getRowWeekInfo(row);
      if (!targetInfo) return undefined;

      const valueStart = valueWeekInfos[0] ?? null;
      const valueEnd = valueWeekInfos[1] ?? null;
      const hoverStart = hoverWeekInfos[0] ?? null;
      const hoverEnd = hoverWeekInfos[1] ?? null;
      const hasValueRange = Boolean(valueStart && valueEnd);

      const isValueActive = valueWeekInfos.some((info) => isSameWeek(info, targetInfo));
      const isValueRange = isBetweenWeeks(targetInfo, valueStart, valueEnd);

      const isHoverActive = hoverWeekInfos.some((info) => isSameWeek(info, targetInfo));
      const isHoverRange = isBetweenWeeks(targetInfo, hoverStart, hoverEnd);

      return {
        [`${baseClass}--active`]: isValueActive || (!hasValueRange && !isValueRange && isHoverActive),
        [`${baseClass}--range`]: isValueRange || (!hasValueRange && isHoverRange),
      };
    };

    return (
      <div className={`${this.classPrefix}-date-picker__table`} onMouseLeave={(e) => onCellMouseLeave?.({ e })}>
        <table>
          {showThead && (
            <thead>
              <tr>
                {weekdays.map((label, index) => (
                  <th key={index}>{label}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={classNames(`${this.classPrefix}-date-picker__table-${mode}-row`, buildWeekRowClass(row))}
              >
                {row.map((cell, cellIndex) =>
                  this.renderTableCell(cell, cellIndex, partial, onCellClick, onCellMouseEnter),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  private renderMonthPanel(month: number | undefined, partial: 'start' | 'end') {
    const optionClass = `${this.classPrefix}-select-option`;
    const selectedClass = `${this.classPrefix}-is-selected`;

    return (
      <ul className={classNames(`${this.classPrefix}-select__list`, 't-date-picker-header__panel-list')}>
        {this.getMonthOptions().map((item) => (
          <li
            key={item.value}
            className={classNames(optionClass, 't-date-picker-header__panel-item', {
              [selectedClass]: item.value === month,
            })}
            onClick={() => this.handleMonthOptionClick(item.value, partial)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    );
  }

  private renderYearPanel(headerClassName: string, value: number, partial: 'start' | 'end') {
    const optionClass = `${this.classPrefix}-select-option`;
    const selectedClass = `${this.classPrefix}-is-selected`;
    const yearOptions = partial === 'start' ? this.startYearOptions : this.endYearOptions;
    const yearPanelRef = partial === 'start' ? this.startYearPanelRef : this.endYearPanelRef;

    return (
      <div className={`${headerClassName}-controller-year-panel`} ref={yearPanelRef as any}>
        <div
          className={classNames(optionClass, 't-date-picker-header__panel-item')}
          onClick={(e) => this.handlePanelTopClick(partial, e)}
        >
          ...
        </div>
        <ul className={classNames(`${this.classPrefix}-select__list`, 't-date-picker-header__panel-list')}>
          {yearOptions.map((item) => (
            <li
              key={`${item.label}-${item.value}`}
              className={classNames(optionClass, 't-date-picker-header__panel-item', {
                [selectedClass]: item.value === value,
              })}
              onClick={() => this.handleYearOptionClick(item.value, partial)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <div
          className={classNames(optionClass, 't-date-picker-header__panel-item')}
          onClick={(e) => this.handlePanelBottomClick(partial, e)}
        >
          ...
        </div>
      </div>
    );
  }

  private renderPanelContent(
    props: RangePanelProps,
    partial: 'start' | 'end',
    year: number,
    month: number,
    yearOptions: YearOption[],
    monthPopupVisible: boolean,
    yearPopupVisible: boolean,
  ) {
    const { mode = 'date', firstDayOfWeek = 1 } = props;

    const tableData = this.buildTableData(props, year, month, partial);
    const weekdays = this.buildWeekdays(mode, firstDayOfWeek);
    const panelName = `${this.classPrefix}-date-picker__panel`;
    const headerClassName = `${this.classPrefix}-date-picker__header`;
    const showMonthPicker = mode === 'date' || mode === 'week';
    const monthLabel = this.getMonthLabel(month);
    const currentYearValue = this.getNearestYearValue(year, yearOptions, mode);
    const yearLabel = this.getYearLabel(currentYearValue, yearOptions, mode);
    const monthSelectWidth = SELECT_WIDTH;
    const yearSelectWidth = mode === 'year' ? LONG_SELECT_WIDTH : SELECT_WIDTH;

    return (
      <div className={`${panelName}-content`}>
        <div className={`${panelName}-${mode}`}>
          <div className={headerClassName}>
            <div className={`${headerClassName}-controller`}>
              {showMonthPicker && (
                <t-select-input
                  className={`${headerClassName}-controller-month`}
                  value={month}
                  popupVisible={monthPopupVisible}
                  innerStyle={{ width: monthSelectWidth }}
                  suffixIcon={<t-icon-chevron-down />}
                  valueDisplay={<span>{monthLabel}</span>}
                  panel={this.renderMonthPanel(month, partial)}
                  popupProps={{
                    trigger: 'click',
                    attach: (triggerElement: HTMLElement) => this.resolvePopupAttach(triggerElement),
                    overlayClassName: `${headerClassName}-controller-month-popup`,
                    overlayInnerStyle: { width: monthSelectWidth },
                  }}
                  onPopupVisibleChange={(visible: boolean) => this.handleMonthPopupVisibleChange(visible, partial)}
                />
              )}
              <t-select-input
                className={`${headerClassName}-controller-year`}
                value={currentYearValue}
                popupVisible={yearPopupVisible}
                innerStyle={{ width: yearSelectWidth }}
                suffixIcon={<t-icon-chevron-down />}
                valueDisplay={<span>{yearLabel}</span>}
                panel={this.renderYearPanel(headerClassName, currentYearValue, partial)}
                popupProps={{
                  trigger: 'click',
                  attach: (triggerElement: HTMLElement) => this.resolvePopupAttach(triggerElement),
                  overlayClassName: `${headerClassName}-controller-year-popup`,
                  onScroll: this.handleYearPanelScroll(partial),
                  updateScrollTop: this.handleUpdateScrollTop,
                  overlayInnerStyle: { width: yearSelectWidth },
                }}
                onPopupVisibleChange={(visible: boolean) => this.handleYearPopupVisibleChange(visible, partial)}
              />
            </div>
            <PaginationMini
              tips={this.getPaginationTips(mode)}
              size="small"
              onChange={this.handlePaginationChange(partial)}
            />
          </div>
          {this.renderTable(tableData, weekdays, partial, props)}
        </div>
      </div>
    );
  }

  /**
   * 根据presetsPlacement决定预设区域是垂直或水平布局
   */
  private renderPresets(presets: PresetRange | undefined, presetsPlacement: string) {
    if (!presets || Object.keys(presets).length === 0) return null;

    const isVertical = ['left', 'right'].includes(presetsPlacement);

    return (
      <div
        className={classNames(`${this.classPrefix}-date-range-picker__presets`, {
          [`${this.classPrefix}-date-range-picker__presets--vertical`]: isVertical,
        })}
      >
        {Object.entries(presets).map(([name, preset]) => (
          <div
            key={name}
            className={`${this.classPrefix}-date-range-picker__presets-item`}
            onClick={(e) => {
              this.props.onPresetClick?.(preset as DateValue[] | (() => DateValue[]), {
                preset: presets,
                e: e as unknown as MouseEvent,
              });
            }}
          >
            {name}
          </div>
        ))}
      </div>
    );
  }

  render(props: OmiProps<RangePanelProps, any>) {
    const { year = [dayjs().year(), dayjs().year()], month = [dayjs().month(), dayjs().month()] } = props;
    const [startYear, endYear] = year;
    const [startMonth, endMonth] = month;

    const panelName = `${this.classPrefix}-date-range-picker__panel`;
    const panelClass = classNames(panelName, props.class, {
      [`${panelName}--direction-row`]: ['left', 'right'].includes(props.presetsPlacement || 'bottom'),
    });

    const presetsTop = ['top', 'left'].includes(props.presetsPlacement || 'bottom');
    const presetsBottom = ['bottom', 'right'].includes(props.presetsPlacement || 'bottom');

    return (
      <div className={panelClass} style={props.style}>
        {presetsTop && this.renderPresets(props.presets, props.presetsPlacement || 'bottom')}
        <div className={`${panelName}-content-wrapper`}>
          {this.renderPanelContent(
            props,
            'start',
            startYear,
            startMonth,
            this.startYearOptions,
            this.startMonthPopupVisible,
            this.startYearPopupVisible,
          )}
          {this.renderPanelContent(
            props,
            'end',
            endYear,
            endMonth,
            this.endYearOptions,
            this.endMonthPopupVisible,
            this.endYearPopupVisible,
          )}
        </div>
        {presetsBottom && this.renderPresets(props.presets, props.presetsPlacement || 'bottom')}
      </div>
    );
  }
}
