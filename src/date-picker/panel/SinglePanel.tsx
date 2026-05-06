import 'tdesign-icons-web-components/esm/components/chevron-down';
import 'tdesign-icons-web-components/esm/components/chevron-left';
import 'tdesign-icons-web-components/esm/components/chevron-right';
import '../../select-input';
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
import { DateValue, DisableDate, PresetDate, TdDatePickerProps } from '../type';

dayjs.locale('zh-cn');
dayjs.extend(isoWeek);

const SELECT_WIDTH = '80px';
const LONG_SELECT_WIDTH = '130px';

interface YearOption {
  label: string;
  value: number;
}

type ScrollAnchor = 'default' | 'top' | 'bottom';

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

export interface SinglePanelProps
  extends Pick<TdDatePickerProps, 'mode' | 'firstDayOfWeek' | 'disableDate' | 'minDate' | 'maxDate'> {
  format: string;
  value?: DateValue | DateValue[];
  formattedValue?: string;
  year: number;
  month: number;
  multiple?: boolean;
  presets?: PresetDate;
  presetsPlacement?: 'left' | 'top' | 'right' | 'bottom';
  onCellClick?: (value: Date, context: { e: MouseEvent }) => void;
  onCellMouseEnter?: (value: Date) => void;
  onCellMouseLeave?: (context: { e: MouseEvent }) => void;
  onJumperClick?: (context: { trigger: 'prev' | 'next' | 'current' }) => void;
  onMonthChange?: (month: number) => void;
  onYearChange?: (year: number) => void;
  onPresetClick?: (preset: DateValue | (() => DateValue), context: { preset: PresetDate; e: MouseEvent }) => void;
  class?: string;
  style?: Record<string, any> | string;
}

@tag('t-date-picker-panel')
export default class DatePickerPanel extends Component<SinglePanelProps> {
  static defaultProps: Partial<SinglePanelProps> = {
    mode: 'date',
    firstDayOfWeek: 1,
  };

  private classPrefix = getClassPrefix();

  private monthPopupVisible = false;

  private yearPopupVisible = false;

  private yearOptions: YearOption[] = [];

  private scrollAnchor: ScrollAnchor = 'default';

  private yearPanelRef = createRef<HTMLDivElement>();

  private cachedPopupAttach: HTMLElement | null = null;

  install() {
    const { year = dayjs().year(), mode = 'date' } = this.props;
    this.yearOptions = this.initYearOptions(year, mode);
  }

  receiveProps(nextProps: SinglePanelProps, oldProps: SinglePanelProps): void {
    const nextYear = nextProps.year ?? dayjs().year();
    const prevYear = oldProps?.year ?? dayjs().year();
    if (nextYear !== prevYear || nextProps.mode !== oldProps.mode) {
      this.yearOptions = this.initYearOptions(nextYear, nextProps.mode ?? 'date');
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

  /**
   * 根据firstDayOfWeek调整星期顺序，week mode额外添加"周"列
   */
  private buildWeekdays(mode: SinglePanelProps['mode'], firstDayOfWeek: number) {
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
   * 根据mode生成对应的日期/周/月/季度/年数据，并标记选中、禁用等状态
   */
  private buildTableData(props: SinglePanelProps): DatePickerTableCell[][] {
    const { format, mode = 'date', firstDayOfWeek = 1, disableDate, minDate, maxDate } = props;
    const selectedValue =
      this.convertToDate(props.formattedValue, format) || this.convertToDate(props.value as DateValue, props.format);
    const disableHandler = this.resolveDisableDate(disableDate, format, mode) || (() => false);

    const minBoundary = this.convertToDate(minDate, format) || new Date(-8.64e15);
    const maxBoundary = this.convertToDate(maxDate, format) || new Date(8.64e15);

    const dayjsLocale = dayjs.locale();
    const localeData = dayjs.localeData();
    const monthLocal = (localeData.monthsShort && localeData.monthsShort()) || localeData.months();
    const quarterLocal = this.getQuarterLabels();

    const options = {
      firstDayOfWeek,
      disableDate: disableHandler,
      minDate: minBoundary,
      maxDate: maxBoundary,
      monthLocal,
      quarterLocal,
      dayjsLocale,
      cancelRangeSelectLimit: true,
      showWeekOfYear: mode === 'week',
    };

    let tableSource: any[][] = [];

    if (mode === 'date' || mode === 'week') {
      tableSource = getWeeks({ year: props.year, month: props.month }, options);
    } else if (mode === 'month') {
      tableSource = getMonths(props.year, options);
    } else if (mode === 'quarter') {
      tableSource = getQuarters(props.year, options);
    } else if (mode === 'year') {
      tableSource = getYears(props.year, options);
    }

    const flagged = flagActive(tableSource, {
      start: selectedValue ?? undefined,
      end: undefined,
      hoverStart: undefined,
      hoverEnd: undefined,
      type: mode,
      isRange: false,
      value: props.value,
      multiple: Boolean(props.multiple),
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

  private initYearOptions(year: number, mode: SinglePanelProps['mode'] = 'date'): YearOption[] {
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

  private loadMoreYear(year: number, type: 'add' | 'reduce'): YearOption[] {
    const { mode = 'date' } = this.props;
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

  private adjustYearScrollPosition() {
    const container = this.getYearScrollContainer();
    if (!container) return;

    this.updateScrollPosition(container);
    this.scrollAnchor = 'default';
  }

  private getYearScrollContainer(): HTMLElement | null {
    const panel = this.yearPanelRef.current;
    if (!panel) return null;
    return panel.parentElement as HTMLElement;
  }

  private handleMonthPopupVisibleChange(visible: boolean) {
    if (this.monthPopupVisible === visible) return;
    this.monthPopupVisible = visible;
    this.update();
  }

  private handleYearPopupVisibleChange(visible: boolean) {
    if (this.yearPopupVisible === visible) return;
    this.yearPopupVisible = visible;
    if (!visible) {
      this.scrollAnchor = 'default';
    }
    this.update();
    if (visible) {
      setTimeout(() => this.adjustYearScrollPosition());
    }
  }

  private handleMonthOptionClick(value: number) {
    this.props.onMonthChange?.(value);
    this.monthPopupVisible = false;
    this.update();
  }

  private handleYearOptionClick(value: number) {
    this.props.onYearChange?.(value);
    this.yearPopupVisible = false;
    this.update();
  }

  private handlePanelTopClick(e?: MouseEvent) {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    if (!this.yearOptions.length) return;
    const options = this.loadMoreYear(this.yearOptions[0].value, 'reduce');
    if (!options.length) return;
    this.yearOptions = [...options, ...this.yearOptions];
    this.scrollAnchor = 'top';
    this.update();
    setTimeout(() => this.adjustYearScrollPosition());
  }

  private handlePanelBottomClick(e?: MouseEvent) {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    if (!this.yearOptions.length) return;
    const options = this.loadMoreYear(this.yearOptions.slice(-1)[0].value, 'add');
    if (!options.length) return;
    this.yearOptions = [...this.yearOptions, ...options];
    this.scrollAnchor = 'bottom';
    this.update();
    setTimeout(() => this.adjustYearScrollPosition());
  }

  private handleYearPanelScroll = ({ e }: { e: WheelEvent }) => {
    const target = e.target as HTMLElement;
    if (!target) return;
    if (target.scrollTop === 0) {
      this.handlePanelTopClick();
      this.scrollAnchor = 'top';
    } else if (Math.ceil(target.scrollTop + target.clientHeight) >= target.scrollHeight) {
      this.handlePanelBottomClick();
      this.scrollAnchor = 'bottom';
    }
  };

  private handlePaginationChange: NonNullable<TdPaginationMiniProps['onChange']> = ({ trigger }) => {
    this.props.onJumperClick?.({ trigger });
  };

  private getMonthLabel(month: number | undefined): string {
    if (typeof month !== 'number') return '';
    const options = this.getMonthOptions();
    return options.find((item) => item.value === month)?.label ?? `${month + 1}`;
  }

  private getNearestYearValue(year: number, mode: SinglePanelProps['mode'] = 'date'): number {
    if (mode !== 'year') return year;
    const { ...rest } = this.props;
    const { partial, internalYear = [] } = (rest as { partial?: 'start' | 'end'; internalYear?: number[] }) || {};
    const extraYear = partial === 'end' && internalYear.length > 1 && internalYear[1] - internalYear[0] <= 9 ? 9 : 0;
    const targetYear = year + extraYear;
    const matched = this.yearOptions.find((option) => option.value - targetYear <= 9 && option.value - targetYear >= 0);
    return matched?.value ?? targetYear;
  }

  private getYearLabel(year: number, mode: SinglePanelProps['mode'] = 'date'): string {
    if (mode === 'year') {
      const option = this.yearOptions.find((item) => item.value === year);
      if (option) return option.label;
      const decadeStart = year - (year % 10);
      return `${decadeStart} - ${decadeStart + 9}`;
    }
    return `${year}`;
  }

  private renderMonthPanel(month: number | undefined) {
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
            onClick={() => this.handleMonthOptionClick(item.value)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    );
  }

  private renderYearPanel(headerClassName: string, value: number) {
    const optionClass = `${this.classPrefix}-select-option`;
    const selectedClass = `${this.classPrefix}-is-selected`;

    return (
      <div className={`${headerClassName}-controller-year-panel`} ref={this.yearPanelRef as any}>
        <div
          className={classNames(optionClass, 't-date-picker-header__panel-item')}
          onClick={(e) => this.handlePanelTopClick(e)}
        >
          ...
        </div>
        <ul className={classNames(`${this.classPrefix}-select__list`, 't-date-picker-header__panel-list')}>
          {this.yearOptions.map((item) => (
            <li
              key={`${item.label}-${item.value}`}
              className={classNames(optionClass, 't-date-picker-header__panel-item', {
                [selectedClass]: item.value === value,
              })}
              onClick={() => this.handleYearOptionClick(item.value)}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <div
          className={classNames(optionClass, 't-date-picker-header__panel-item')}
          onClick={(e) => this.handlePanelBottomClick(e)}
        >
          ...
        </div>
      </div>
    );
  }

  private getPaginationTips(mode: SinglePanelProps['mode']) {
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
    onCellClick?: (value: Date, context: { e: MouseEvent }) => void,
    onCellMouseEnter?: (value: Date) => void,
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
      onCellClick?.(this.getCellValueWithTime(cell), { e });
    };

    const handleMouseEnter = () => {
      if (cell.disabled) return;
      onCellMouseEnter?.(this.getCellValueWithTime(cell));
    };

    return (
      <td className={cellClass} key={cellIndex} onClick={handleClick} onMouseEnter={handleMouseEnter}>
        <div className={`${this.classPrefix}-date-picker__cell-inner`}>{cell.text}</div>
      </td>
    );
  }

  private renderTable(props: OmiProps<SinglePanelProps, any>, data: DatePickerTableCell[][], weekdays: string[]) {
    const { mode = 'date', onCellClick, onCellMouseEnter, onCellMouseLeave, value, format, multiple } = props;
    const showThead = mode === 'date' || mode === 'week';

    const getWeekInfo = (val: DateValue | undefined) => {
      if (!val) return null;
      const parsed = parseToDayjs(val, format);
      if (!parsed || !parsed.isValid()) return null;
      const local = parsed.locale(dayjs.locale());
      return { year: local.isoWeekYear(), week: local.isoWeek() };
    };

    const multipleWeekSet =
      mode === 'week' && multiple && Array.isArray(value)
        ? new Set(
            value
              .map((item) => {
                const info = getWeekInfo(item);
                if (!info) return '';
                return `${info.year}-${info.week}`;
              })
              .filter(Boolean),
          )
        : null;

    const rangeWeekInfo =
      mode === 'week' && !multiple && Array.isArray(value) && value.length
        ? value.map((item) => getWeekInfo(item))
        : [];

    const singleWeekInfo = mode === 'week' && value && !Array.isArray(value) ? getWeekInfo(value) : null;

    const buildWeekRowClass = (row: DatePickerTableCell[]) => {
      if (mode !== 'week' || !value) return {};
      const baseClass = `${this.classPrefix}-date-picker__table-${mode}-row`;
      const targetCell = row.find((cell) => !cell.weekOfYear) ?? row[0];
      const targetDayjs = targetCell?.dayjsObj ? dayjs(targetCell.dayjsObj) : dayjs(targetCell?.value);
      if (!targetDayjs.isValid()) return {};

      const targetYear = targetDayjs.isoWeekYear();
      const targetWeek = targetDayjs.isoWeek();

      if (multipleWeekSet) {
        const key = `${targetYear}-${targetWeek}`;
        return {
          [`${baseClass}--active`]: multipleWeekSet.has(key),
        };
      }

      if (Array.isArray(rangeWeekInfo) && rangeWeekInfo.length) {
        const [start, end] = rangeWeekInfo;
        if (!start) return {};

        const isActive =
          (start && start.year === targetYear && start.week === targetWeek) ||
          (end && end.year === targetYear && end.week === targetWeek);

        const isRange = Boolean(
          start &&
            end &&
            (targetYear > start.year || (targetYear === start.year && targetWeek > start.week)) &&
            (targetYear < end.year || (targetYear === end.year && targetWeek < end.week)),
        );

        return {
          [`${baseClass}--active`]: isActive,
          [`${baseClass}--range`]: isRange,
        };
      }

      if (singleWeekInfo) {
        return {
          [`${baseClass}--active`]: singleWeekInfo.year === targetYear && singleWeekInfo.week === targetWeek,
        };
      }

      return {};
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
                {row.map((cell, cellIndex) => this.renderTableCell(cell, cellIndex, onCellClick, onCellMouseEnter))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /**
   * 根据presetsPlacement决定预设区域的位置样式
   */
  private renderPresets(presets: PresetDate | undefined, presetsPlacement: string) {
    if (!presets || Object.keys(presets).length === 0) return null;

    return (
      <div
        className={classNames(`${this.classPrefix}-date-picker__footer`, {
          [`${this.classPrefix}-date-picker__footer--${presetsPlacement}`]: presetsPlacement,
        })}
      >
        <div className={`${this.classPrefix}-date-picker__presets`}>
          {Object.entries(presets).map(([name, preset]) => (
            <div
              key={name}
              className={`${this.classPrefix}-date-picker__presets-item`}
              onClick={(e) => {
                this.props.onPresetClick?.(preset as DateValue | (() => DateValue), {
                  preset: presets,
                  e: e as unknown as MouseEvent,
                });
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  render(props: OmiProps<SinglePanelProps, any>) {
    const {
      year,
      month,
      firstDayOfWeek = 1,
      presets,
      presetsPlacement = 'bottom',
      onCellClick,
      onCellMouseEnter,
      onCellMouseLeave,
      onJumperClick,
      onMonthChange,
      onYearChange,
    } = props;

    const panelName = `${this.classPrefix}-date-picker__panel`;
    const panelClass = classNames(panelName, props.class, {
      [`${panelName}--direction-row`]: ['left', 'right'].includes(presetsPlacement),
    });
    const tableData = this.buildTableData(props);
    const weekdays = this.buildWeekdays(props.mode, firstDayOfWeek);
    const mode = props.mode ?? 'date';

    const headerClassName = `${this.classPrefix}-date-picker__header`;
    const showMonthPicker = mode === 'date' || mode === 'week';
    const monthLabel = this.getMonthLabel(month);
    const currentYearValue = this.getNearestYearValue(year, mode);
    const yearLabel = this.getYearLabel(currentYearValue, mode);
    const monthSelectWidth = SELECT_WIDTH;
    const yearSelectWidth = mode === 'year' ? LONG_SELECT_WIDTH : SELECT_WIDTH;

    const presetsTop = ['top', 'left'].includes(presetsPlacement);
    const presetsBottom = ['bottom', 'right'].includes(presetsPlacement);

    return (
      <div className={panelClass} style={props.style}>
        {presetsTop && this.renderPresets(presets, presetsPlacement)}
        <div className={`${panelName}-content`}>
          <div className={`${panelName}-${mode}`}>
            <div className={headerClassName}>
              <div className={`${headerClassName}-controller`}>
                {showMonthPicker && (
                  <t-select-input
                    className={`${headerClassName}-controller-month`}
                    value={month}
                    popupVisible={this.monthPopupVisible}
                    innerStyle={{ width: monthSelectWidth }}
                    suffixIcon={<t-icon-chevron-down />}
                    valueDisplay={<span>{monthLabel}</span>}
                    panel={this.renderMonthPanel(month)}
                    popupProps={{
                      trigger: 'click',
                      attach: (triggerElement: HTMLElement) => this.resolvePopupAttach(triggerElement),
                      overlayClassName: `${headerClassName}-controller-month-popup`,
                      overlayInnerStyle: { width: monthSelectWidth },
                    }}
                    popupMatchWidth={false}
                    onPopupVisibleChange={(visible: boolean) => this.handleMonthPopupVisibleChange(visible)}
                  />
                )}
                <t-select-input
                  className={`${headerClassName}-controller-year`}
                  value={currentYearValue}
                  popupVisible={this.yearPopupVisible}
                  innerStyle={{ width: yearSelectWidth }}
                  suffixIcon={<t-icon-chevron-down />}
                  valueDisplay={<span>{yearLabel}</span>}
                  panel={this.renderYearPanel(headerClassName, currentYearValue)}
                  popupProps={{
                    trigger: 'click',
                    attach: (triggerElement: HTMLElement) => this.resolvePopupAttach(triggerElement),
                    overlayClassName: `${headerClassName}-controller-year-popup`,
                    onScroll: this.handleYearPanelScroll,
                    updateScrollTop: this.handleUpdateScrollTop,
                    overlayInnerStyle: { width: yearSelectWidth },
                  }}
                  popupMatchWidth={false}
                  onPopupVisibleChange={(visible: boolean) => this.handleYearPopupVisibleChange(visible)}
                />
              </div>
              <PaginationMini tips={this.getPaginationTips(mode)} size="small" onChange={this.handlePaginationChange} />
            </div>
            {this.renderTable(
              {
                ...props,
                onCellClick,
                onCellMouseEnter,
                onCellMouseLeave,
                onJumperClick,
                onMonthChange,
                onYearChange,
              } as OmiProps<SinglePanelProps, any>,
              tableData,
              weekdays,
            )}
          </div>
        </div>
        {presetsBottom && this.renderPresets(presets, presetsPlacement)}
      </div>
    );
  }
}
