import '../range-input';
import './panel/RangePanel';
import 'tdesign-icons-web-components/esm/components/calendar';

import dayjs from 'dayjs';
import { classNames, Component, OmiProps, signal, tag } from 'omi';

import { formatDate, getDefaultFormat, isValidDate, parseToDayjs } from '../_common/js/date-picker/format';
import { addMonth, subtractMonth } from '../_common/js/date-picker/utils';
import { getClassPrefix } from '../_util/classname';
import { setExportparts } from '../_util/dom';
import useControlled from '../_util/useControlled';
import { StyledProps } from '../common';
import { dateRangePickerDefaultProps } from './defaultProps';
import { DateRangeValue, DateValue, PresetRange, TdDateRangePickerProps } from './type';

export interface DateRangePickerProps extends Omit<TdDateRangePickerProps, 'style'>, Omit<StyledProps, 'style'> {
  style?: TdDateRangePickerProps['style'];
}

@tag('t-date-range-picker')
export default class DateRangePicker extends Component<DateRangePickerProps> {
  static defaultProps = dateRangePickerDefaultProps;

  static propTypes = {
    value: Array,
    defaultValue: Array,
    popupVisible: Boolean,
    defaultPopupVisible: Boolean,
    format: String,
    mode: String,
    disabled: Boolean,
    presets: Object,
    presetsPlacement: String,
    placeholder: [String, Array],
    tips: [String, Object, Function],
    status: String,
    clearable: Boolean,
    cancelRangeSelectLimit: Boolean,
    panelPreselection: Boolean,
    separator: [String, Object, Function],
    onChange: Function,
    onPick: Function,
    onClear: Function,
    onVisibleChange: Function,
    onPresetClick: Function,
  };

  private classPrefix = getClassPrefix();

  private formatInfo = getDefaultFormat({ mode: 'date' });

  private valueState: DateRangeValue = [];

  private setValueState: (value: DateRangeValue, context?: any) => void;

  private popupVisibleState = false;

  private setPopupVisibleState: (visible: boolean, context?: any) => void;

  private inputValueSignal = signal<string[]>(['', '']);

  private cacheValueSignal = signal<string[]>(['', '']);

  private placeholderSignal = signal<string[]>(['', '']);

  private yearSignal = signal<number[]>([dayjs().year(), dayjs().year()]);

  private monthSignal = signal<number[]>([dayjs().month(), dayjs().month() + 1 > 11 ? 0 : dayjs().month() + 1]);

  private activeIndexSignal = signal(0);

  private isHoverCellSignal = signal(false);

  private isFirstValueSelectedSignal = signal(false);

  private hoverValueSignal = signal<string[]>(['', '']);

  install() {
    this.initializeControlled(this.props as DateRangePickerProps);
  }

  ready() {
    setExportparts(this);
  }

  receiveProps(nextProps: OmiProps<DateRangePickerProps, any>) {
    this.initializeControlled(nextProps as DateRangePickerProps);
  }

  /**
   * 初始化受控状态，设置值和弹窗的受控逻辑
   */
  private initializeControlled(props: DateRangePickerProps) {
    this.setupValueControl(props);
    this.setupPopupControl(props);
    this.formatInfo = getDefaultFormat({
      mode: props.mode,
      format: props.format,
      valueType: props.valueType,
      enableTimePicker: false,
    });
    this.syncDerivedState(this.valueState);
  }

  /**
   * 设置值的受控逻辑
   */
  private setupValueControl(props: DateRangePickerProps) {
    const [value, setValue] = useControlled(
      props,
      'value',
      (val, context) => this.fire('change', { value: val, ...context }),
      {
        defaultValue: props.defaultValue,
        activeComponent: this,
      },
    );
    this.valueState = (value as DateRangeValue) || [];
    this.setValueState = (nextValue, context) => {
      setValue(nextValue, context);
      this.valueState = nextValue;
      this.syncDerivedState(nextValue);
    };
  }

  /**
   * 设置弹窗的受控逻辑
   */
  private setupPopupControl(props: DateRangePickerProps) {
    const [visible, setVisible] = useControlled(
      props,
      'popupVisible',
      (val, context) => this.fire('visible-change', { visible: val, ...context }),
      {
        defaultPopupVisible: props.defaultPopupVisible,
        activeComponent: this,
      },
    );
    this.popupVisibleState = Boolean(visible);
    this.setPopupVisibleState = (nextVisible, context) => {
      setVisible(nextVisible, context);
      this.popupVisibleState = nextVisible;
    };
  }

  /**
   * 同步派生状态
   * 根据当前值更新输入框、缓存值、年月面板
   */
  private syncDerivedState(value: DateRangeValue | undefined) {
    const { format } = this.formatInfo;
    const formatted = formatDate(value || [], { format }) as string[];

    this.inputValueSignal.value = formatted;
    this.cacheValueSignal.value = formatted;

    if (formatted.length === 2 && formatted[0] && formatted[1]) {
      const startDate = parseToDayjs(formatted[0], format);
      const endDate = parseToDayjs(formatted[1], format);
      if (startDate?.isValid?.() && endDate?.isValid?.()) {
        const startYear = startDate.year();
        let startMonth = startDate.month();
        let endYear = endDate.year();
        let endMonth = endDate.month();

        // 两个面板显示不同月份
        if (startYear === endYear && startMonth === endMonth) {
          if (startMonth === 11) {
            startMonth -= 1;
          } else {
            endMonth += 1;
            if (endMonth > 11) {
              endMonth = 0;
              endYear += 1;
            }
          }
        }

        this.yearSignal.value = [startYear, endYear];
        this.monthSignal.value = [startMonth, endMonth];
      }
    } else {
      // 空值时设置默认的年月
      const now = dayjs();
      let endMonth = now.month() + 1;
      let endYear = now.year();
      if (endMonth > 11) {
        endMonth = 0;
        endYear += 1;
      }
      this.yearSignal.value = [now.year(), endYear];
      this.monthSignal.value = [now.month(), endMonth];
    }
  }

  /**
   * 处理弹窗显隐变化
   * 打开时重置选择状态，关闭时恢复缓存值并清空placeholder
   */
  private handlePopupVisibleChange = (visible: boolean, context: any) => {
    if (!this.setPopupVisibleState) return;
    this.setPopupVisibleState(visible, context);

    if (visible) {
      // 面板展开时重置状态
      this.activeIndexSignal.value = 0;
      this.isHoverCellSignal.value = false;
      this.isFirstValueSelectedSignal.value = false;
      this.syncDerivedState(this.valueState);
    } else {
      // 面板关闭时恢复缓存值并清空预览
      this.inputValueSignal.value = this.cacheValueSignal.value;
      this.hoverValueSignal.value = ['', ''];
      this.placeholderSignal.value = ['', ''];
    }
  };

  /**
   * 处理清空按钮点击
   * 清空所有值并关闭弹窗
   */
  private handleClear = (context?: { e?: any }) => {
    const detail = context ?? {};
    this.cacheValueSignal.value = ['', ''];
    this.inputValueSignal.value = ['', ''];
    this.hoverValueSignal.value = ['', ''];
    this.setValueState?.([], { trigger: 'clear', dayjsValue: [dayjs(), dayjs()] });
    this.setPopupVisibleState?.(false, { trigger: 'clear', ...detail });
    this.fire('clear', detail);
  };

  /**
   * 日期范围选择逻辑
   * 首次点击：设置一端日期，清空另一端，切换到另一端的选择
   * 第二次点击：设置另一端日期，自动交换顺序
   */
  private handleCellClick = (date: Date, { partial }: { e: MouseEvent; partial: 'start' | 'end' }) => {
    const { format, valueType } = this.formatInfo;
    const activeIndex = this.activeIndexSignal.value;
    const isFirstClick = !this.isFirstValueSelectedSignal.value;

    this.isHoverCellSignal.value = false;

    const nextValue = [...this.inputValueSignal.value];
    nextValue[activeIndex] = formatDate(date, { format }) || '';

    // 如果是popup打开后的第一次点击，清空另一端的值，开始新的选择流程
    if (isFirstClick) {
      nextValue[activeIndex ? 0 : 1] = '';
    }

    this.cacheValueSignal.value = nextValue;
    this.inputValueSignal.value = nextValue;
    this.hoverValueSignal.value = ['', ''];

    // 检查是否都是有效值
    const notValidIndex = nextValue.findIndex((v) => !v || !isValidDate(v, format));

    // 当两端都有有效值时更改value只有在第二次点击后才会满足）
    if (notValidIndex === -1 && nextValue.length === 2) {
      // 检查是否需要交换顺序
      if (parseToDayjs(nextValue[0], format).isAfter(parseToDayjs(nextValue[1], format))) {
        const formattedValue = formatDate([nextValue[1], nextValue[0]], { format, targetFormat: valueType });
        this.setValueState?.(formattedValue as DateRangeValue, {
          dayjsValue: [parseToDayjs(nextValue[1], format), parseToDayjs(nextValue[0], format)],
          trigger: 'pick',
        });
      } else {
        const formattedValue = formatDate(nextValue, { format, targetFormat: valueType });
        this.setValueState?.(formattedValue as DateRangeValue, {
          dayjsValue: nextValue.map((v) => parseToDayjs(v, format)),
          trigger: 'pick',
        });
      }
    }

    const dayjsValue = parseToDayjs(date, format);
    this.fire('pick', { value: date, dayjsValue, trigger: 'pick', partial });

    // 首次点击不关闭，第二次点击（两端都有值）后关闭
    if (isFirstClick) {
      // 第一次点击：切换到另一端，标记为已选择第一个值
      this.activeIndexSignal.value = activeIndex ? 0 : 1;
      this.isFirstValueSelectedSignal.value = true;
    } else if (notValidIndex === -1) {
      // 第二次点击且两端都有值则关闭
      this.setPopupVisibleState?.(false, { trigger: 'pick' });
    }

    this.update();
  };

  /**
   * 日期单元格mouse enter
   * 更新placeholder
   */
  private handleCellMouseEnter = (date: Date) => {
    const { format } = this.formatInfo;
    this.isHoverCellSignal.value = true;

    const nextValue = [...this.placeholderSignal.value];
    nextValue[this.activeIndexSignal.value] = formatDate(date, { format }) || '';
    this.placeholderSignal.value = nextValue;

    // 面板高亮
    const hoverValue = [...this.inputValueSignal.value];
    hoverValue[this.activeIndexSignal.value] = formatDate(date, { format }) || '';
    this.hoverValueSignal.value = hoverValue;
  };

  /**
   * 日期单元格鼠标mouse leave
   * 清空placeholder
   */
  private handleCellMouseLeave = () => {
    this.isHoverCellSignal.value = false;
    this.hoverValueSignal.value = ['', ''];
    this.placeholderSignal.value = ['', ''];
  };

  /**
   * 确保左侧面板的年月不大于右侧面板
   */
  private dateCorrection(partialIndex: number, nextYear: number[], nextMonth: number[], onlyYearSelect: boolean) {
    if (nextYear[0] > nextYear[1]) {
      if (partialIndex === 0) {
        [nextYear[1]] = [nextYear[0]];
      } else {
        [nextYear[0]] = [nextYear[1]];
      }
    }

    if (onlyYearSelect) {
      return { nextYear, nextMonth };
    }

    if (nextYear[0] === nextYear[1] && nextMonth[0] >= nextMonth[1]) {
      if (partialIndex === 0) {
        nextMonth[1] = nextMonth[0] + 1;
        if (nextMonth[1] > 11) {
          nextMonth[1] = 0;
          nextYear[1] += 1;
        }
      } else {
        nextMonth[0] = nextMonth[1] - 1;
        if (nextMonth[0] < 0) {
          nextMonth[0] = 11;
          nextYear[0] -= 1;
        }
      }
    }

    return { nextYear, nextMonth };
  }

  /**
   * 处理年月面板快速切换（上一页/下一页/今天）
   * 根据mode计算跳转月数，进行日期纠正
   */
  private handlePanelJumperClick = ({
    trigger,
    partial,
  }: {
    trigger: 'prev' | 'next' | 'current';
    partial: 'start' | 'end';
  }) => {
    const { mode = 'date' } = (this.props as DateRangePickerProps) ?? {};
    const partialIndex = partial === 'start' ? 0 : 1;
    const monthCountMap: Record<string, number> = {
      date: 1,
      week: 1,
      month: 12,
      quarter: 12,
      year: 120,
    };
    const monthCount = monthCountMap[mode] ?? 0;

    const current = new Date(this.yearSignal.value[partialIndex], this.monthSignal.value[partialIndex]);
    let target = current;

    if (trigger === 'prev') {
      target = subtractMonth(current, monthCount);
    } else if (trigger === 'next') {
      target = addMonth(current, monthCount);
    } else if (trigger === 'current') {
      target = new Date();
    }

    const nextYear = [...this.yearSignal.value];
    const nextMonth = [...this.monthSignal.value];
    nextYear[partialIndex] = target.getFullYear();
    nextMonth[partialIndex] = target.getMonth();

    const onlyYearSelect = ['year', 'quarter', 'month'].includes(mode);
    const corrected = this.dateCorrection(partialIndex, nextYear, nextMonth, onlyYearSelect);

    this.yearSignal.value = corrected.nextYear;
    this.monthSignal.value = corrected.nextMonth;
    this.update();
  };

  /** 处理月份选择器变化，进行日期纠正 */
  private handlePanelMonthChange = (month: number, { partial }: { partial: 'start' | 'end' }) => {
    const partialIndex = partial === 'start' ? 0 : 1;
    const nextMonth = [...this.monthSignal.value];
    nextMonth[partialIndex] = month;

    // 保证左侧时间不大于右侧
    if (this.yearSignal.value[0] === this.yearSignal.value[1]) {
      if (partialIndex === 0 && nextMonth[1] <= nextMonth[0]) {
        nextMonth[1] = nextMonth[0] + 1;
        if (nextMonth[1] > 11) {
          nextMonth[1] = 0;
          this.yearSignal.value = [this.yearSignal.value[0], this.yearSignal.value[1] + 1];
        }
      }
      if (partialIndex === 1 && nextMonth[0] >= nextMonth[1]) {
        nextMonth[0] = nextMonth[1] - 1;
        if (nextMonth[0] < 0) {
          nextMonth[0] = 11;
          this.yearSignal.value = [this.yearSignal.value[0] - 1, this.yearSignal.value[1]];
        }
      }
    }

    this.monthSignal.value = nextMonth;
    this.update();
  };

  /** 处理年份选择器变化，进行日期纠正 */
  private handlePanelYearChange = (year: number, { partial }: { partial: 'start' | 'end' }) => {
    const { mode = 'date' } = (this.props as DateRangePickerProps) ?? {};
    const partialIndex = partial === 'start' ? 0 : 1;
    const nextYear = [...this.yearSignal.value];
    const nextMonth = [...this.monthSignal.value];
    nextYear[partialIndex] = year;

    const onlyYearSelect = ['year', 'quarter', 'month'].includes(mode);
    const corrected = this.dateCorrection(partialIndex, nextYear, nextMonth, onlyYearSelect);

    this.yearSignal.value = corrected.nextYear;
    if (!onlyYearSelect) {
      this.monthSignal.value = corrected.nextMonth;
    }
    this.update();
  };

  /**
   * 处理预设按钮点击
   * 解析预设值数组，更新选中值和面板状态
   */
  private handlePresetClick = (
    preset: DateValue[] | (() => DateValue[]),
    context: { preset: PresetRange; e: MouseEvent },
  ) => {
    const { format, valueType } = this.formatInfo;
    let presetValue = preset;
    if (typeof preset === 'function') {
      presetValue = preset();
    }

    if (!Array.isArray(presetValue)) {
      console.error('DateRangePicker', `preset: ${preset} must be Array!`);
      return;
    }

    const formattedPreset = formatDate(presetValue, { format, targetFormat: valueType }) as string[];
    this.inputValueSignal.value = formattedPreset;
    this.cacheValueSignal.value = formattedPreset;

    this.isFirstValueSelectedSignal.value = true;

    // 同步面板
    if (formattedPreset.length === 2 && formattedPreset[0] && formattedPreset[1]) {
      const nextMonth = formattedPreset.map((v: string) => parseToDayjs(v, format).month());
      const nextYear = formattedPreset.map((v: string) => parseToDayjs(v, format).year());
      if (nextYear[0] === nextYear[1] && nextMonth[0] === nextMonth[1]) {
        nextMonth[0] === 11 ? (nextMonth[0] -= 1) : (nextMonth[1] += 1);
      }
      this.monthSignal.value = nextMonth;
      this.yearSignal.value = nextYear;
    }

    this.setPopupVisibleState?.(false, { trigger: 'preset' });
    this.setValueState?.(formattedPreset as DateRangeValue, {
      dayjsValue: formattedPreset.map((p) => parseToDayjs(p, format)),
      trigger: 'preset',
    });
    this.fire('preset-click', context);
  };

  /** 处理范围输入框变化，检测清空操作 */
  private handleRangeInputChange = (nextValue: string[], context?: { trigger?: string }) => {
    // 检测清空操作
    if (context?.trigger === 'clear') {
      this.handleClear({ e: context });
      return;
    }
    if (Array.isArray(nextValue)) {
      this.inputValueSignal.value = nextValue;
    }
  };

  private renderPanel(props: DateRangePickerProps) {
    const { format } = this.formatInfo;
    const isHoverCell = this.isHoverCellSignal.value;

    return (
      <t-date-range-picker-panel
        mode={props.mode}
        format={format}
        value={this.cacheValueSignal.value}
        hoverValue={isHoverCell ? this.hoverValueSignal.value : []}
        year={this.yearSignal.value}
        month={this.monthSignal.value}
        activeIndex={this.activeIndexSignal.value}
        firstDayOfWeek={props.firstDayOfWeek}
        disableDate={props.disableDate}
        presets={props.presets}
        presetsPlacement={props.presetsPlacement}
        panelPreselection={props.panelPreselection}
        cancelRangeSelectLimit={props.cancelRangeSelectLimit}
        isFirstValueSelected={this.isFirstValueSelectedSignal.value}
        onCellClick={this.handleCellClick}
        onCellMouseEnter={this.handleCellMouseEnter}
        onCellMouseLeave={this.handleCellMouseLeave}
        onJumperClick={this.handlePanelJumperClick}
        onMonthChange={this.handlePanelMonthChange}
        onYearChange={this.handlePanelYearChange}
        onPresetClick={this.handlePresetClick}
      />
    );
  }

  render(props: OmiProps<DateRangePickerProps, any>) {
    const {
      disabled,
      status,
      tips,
      label,
      clearable,
      placeholder,
      separator,
      popupProps,
      rangeInputProps,
      prefixIcon,
      suffixIcon,
    } = props;

    const cls = classNames(`${this.classPrefix}-date-range-picker`);
    const visible = props.popupVisible ?? this.popupVisibleState;
    const panelVNode = this.renderPanel(props as DateRangePickerProps);

    const suffixIconNode = suffixIcon ?? <t-icon-calendar className="t-icon t-icon-calendar" />;

    const placeholderArr = Array.isArray(placeholder)
      ? placeholder
      : [placeholder || '开始日期', placeholder || '结束日期'];

    const displayPlaceholder = [
      this.placeholderSignal.value[0] || placeholderArr[0],
      this.placeholderSignal.value[1] || placeholderArr[1],
    ];

    return (
      <div class={cls} part={cls}>
        <t-range-input-popup
          disabled={disabled}
          status={status}
          tips={tips}
          inputValue={this.inputValueSignal.value}
          popupVisible={visible}
          autoWidth={true}
          panel={panelVNode}
          popupProps={{
            ...popupProps,
            onVisibleChange: this.handlePopupVisibleChange,
          }}
          rangeInputProps={{
            label,
            clearable,
            separator: separator || '-',
            placeholder: displayPlaceholder,
            prefixIcon,
            suffixIcon: suffixIconNode,
            ...rangeInputProps,
          }}
          onInputChange={this.handleRangeInputChange}
        />
      </div>
    );
  }
}
