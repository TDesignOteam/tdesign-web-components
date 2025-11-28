import '../select-input';
import './panel/SinglePanel';
import 'tdesign-icons-web-components/esm/components/calendar';

import dayjs from 'dayjs';
import { classNames, Component, OmiProps, signal, tag } from 'omi';

import { formatDate, getDefaultFormat, isValidDate, parseToDayjs } from '../_common/js/date-picker/format';
import { addMonth, covertToDate, subtractMonth } from '../_common/js/date-picker/utils';
import { getClassPrefix } from '../_util/classname';
import { setExportparts } from '../_util/dom';
import useControlled from '../_util/useControlled';
import { StyledProps } from '../common';
import { datePickerDefaultProps } from './defaultProps';
import { DateValue, PresetDate, TdDatePickerProps } from './type';

export interface DatePickerProps extends Omit<TdDatePickerProps, 'style'>, Omit<StyledProps, 'style'> {
  style?: TdDatePickerProps['style'];
}

@tag('t-date-picker')
export default class DatePicker extends Component<DatePickerProps> {
  static defaultProps = datePickerDefaultProps;

  static propTypes = {
    value: [String, Number, Object, Array],
    defaultValue: [String, Number, Object, Array],
    popupVisible: Boolean,
    defaultPopupVisible: Boolean,
    format: String,
    mode: String,
    enableTimePicker: Boolean,
    disabled: Boolean,
    presets: Object,
    presetsPlacement: String,
    placeholder: String,
    tips: [String, Object, Function],
    status: String,
    borderless: Boolean,
    onChange: Function,
    onPick: Function,
    onClear: Function,
    onVisibleChange: Function,
    onPresetClick: Function,
  };

  private classPrefix = getClassPrefix();

  private formatInfo = getDefaultFormat({ mode: 'date' });

  private valueState: DateValue;

  private setValueState: (value: DateValue, context?: any) => void;

  private popupVisibleState = false;

  private setPopupVisibleState: (visible: boolean, context?: any) => void;

  private inputValueSignal = signal('');

  private cacheValueSignal = signal('');

  private placeholderSignal = signal('');

  private yearSignal = signal(dayjs().year());

  private monthSignal = signal(dayjs().month());

  install() {
    this.initializeControlled(this.props as DatePickerProps);
  }

  ready() {
    setExportparts(this);
  }

  receiveProps(nextProps: OmiProps<DatePickerProps, any>) {
    this.initializeControlled(nextProps as DatePickerProps);
  }

  /**
   * 初始化受控状态
   * 设置值和弹窗的受控逻辑，同步派生状态
   */
  private initializeControlled(props: DatePickerProps) {
    this.setupValueControl(props);
    this.setupPopupControl(props);
    this.formatInfo = getDefaultFormat({
      mode: props.mode,
      format: props.format,
      valueType: props.valueType,
      enableTimePicker: false,
    });
    this.syncDerivedState(this.valueState, props);
  }

  /**
   * 管理value的受控/非受控状态
   */
  private setupValueControl(props: DatePickerProps) {
    const [value, setValue] = useControlled(props, 'value', (val, context) => props.onChange?.(val, context), {
      defaultValue: props.defaultValue,
      activeComponent: this,
    });
    this.valueState = value as DateValue;
    this.setValueState = (nextValue, context) => {
      setValue(nextValue, context);
      this.valueState = nextValue;
      this.syncDerivedState(nextValue, this.props as DatePickerProps);
    };
  }

  /**
   * 管理popupVisible的受控/非受控状态
   */
  private setupPopupControl(props: DatePickerProps) {
    const [visible, setVisible] = useControlled(
      props,
      'popupVisible',
      (val, context) => props.onVisibleChange?.(val, context),
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
   * 将不同类型的日期值标准化为Date对象
   */
  private normalizeValue(value: DateValue | undefined, props: DatePickerProps) {
    if (!value) return value;
    if (value instanceof Date) return value;
    const { valueType, format } = this.formatInfo;
    if (['week', 'quarter'].includes(props.mode)) {
      if (valueType === 'time-stamp') {
        return new Date(Number(value));
      }
      if (valueType === 'Date') {
        return value;
      }
      const dayjsValue = parseToDayjs(value as DateValue, valueType || format);
      if (dayjsValue?.isValid?.()) {
        return dayjsValue.toDate();
      }
      return value;
    }
    return covertToDate(value as string, valueType);
  }

  /**
   * 同步派生状态
   * 根据当前值更新输入框显示值、缓存值、年月信号
   */
  private syncDerivedState(value: DateValue | undefined, props: DatePickerProps) {
    const { format } = this.formatInfo;
    const normalized = this.normalizeValue(value, props);
    const formatted = formatDate(normalized, { format }) || '';

    this.inputValueSignal.value = formatted;
    this.cacheValueSignal.value = formatted;

    const baseDate =
      (normalized && parseToDayjs(normalized, format)) || (formatted && parseToDayjs(formatted, format)) || dayjs();
    if (baseDate?.isValid?.()) {
      this.yearSignal.value = baseDate.year();
      this.monthSignal.value = baseDate.month();
    }
  }

  /**
   * 处理弹窗visible change
   * 弹窗打开时同步状态，关闭时根据输入的值是否有效来决定值的更新
   */
  private handlePopupVisibleChange = (visible: boolean, context: any) => {
    if (!this.setPopupVisibleState) return;
    this.setPopupVisibleState(visible, context);
    if (!visible) {
      this.triggerConfirmOnClose();
    } else {
      this.syncDerivedState(this.valueState, this.props as DatePickerProps);
    }
  };

  /**
   * 弹窗关闭时确认是否存在有效的输入更新
   * 如果输入值有效且与当前值不同，则更新值
   */
  private triggerConfirmOnClose = () => {
    const { format, valueType } = this.formatInfo;
    const inputValue = this.inputValueSignal.value;

    if (inputValue && isValidDate(inputValue, format)) {
      const currentValue = formatDate(this.valueState, { format }) || '';
      if (currentValue !== inputValue) {
        const nextValue = formatDate(inputValue, { format, targetFormat: valueType }) as DateValue;
        this.setValueState?.(nextValue, {
          dayjsValue: parseToDayjs(inputValue, format),
          trigger: 'confirm',
        });
        return;
      }
    }

    this.inputValueSignal.value = this.cacheValueSignal.value;
  };

  /**
   * 清空值并关闭弹窗
   */
  private handleClear = (context: CustomEvent) => {
    const detail = context?.detail ?? {};
    this.cacheValueSignal.value = '';
    this.inputValueSignal.value = '';
    this.setValueState?.(undefined, { trigger: 'clear', dayjsValue: dayjs() });
    this.setPopupVisibleState?.(false, { trigger: 'clear', ...detail });
    this.props.onClear?.(detail);
  };

  /**
   * 处理日期单元格点击
   * 更新选中值、同步年月面板、触发回调并关闭弹窗
   */
  private handleCellClick = (date: Date) => {
    const { format, valueType } = this.formatInfo;
    const mode = (this.props as DatePickerProps)?.mode ?? 'date';
    const formatted = formatDate(date, { format }) || '';
    const nextValue = formatDate(date, { format, targetFormat: valueType }) as DateValue;

    this.cacheValueSignal.value = formatted;
    this.inputValueSignal.value = formatted;

    if (mode === 'month') {
      this.yearSignal.value = date.getFullYear();
      this.monthSignal.value = date.getMonth();
    } else if (mode === 'quarter') {
      this.yearSignal.value = date.getFullYear();
      this.monthSignal.value = date.getMonth();
    } else if (mode === 'year') {
      this.yearSignal.value = date.getFullYear();
    } else if (mode === 'week' || mode === 'date') {
      this.yearSignal.value = date.getFullYear();
      this.monthSignal.value = date.getMonth();
    }

    const dayjsValue = parseToDayjs(date, format);
    this.setValueState?.(nextValue, {
      dayjsValue,
      trigger: 'pick',
    });
    this.props.onPick?.(date, { dayjsValue, trigger: 'pick' });
    this.setPopupVisibleState?.(false, { trigger: 'pick' });
  };

  /**
   * 日期单元格mouse enter
   * 更新placeholder
   */
  private handleCellMouseEnter = (date: Date) => {
    const { format } = this.formatInfo;
    this.placeholderSignal.value = formatDate(date, { format }) || '';
  };

  /**
   * 日期单元格mouse leave
   * placeholder
   */
  private handleCellMouseLeave = () => {
    this.placeholderSignal.value = '';
  };

  /**
   * 处理输入框内容变化
   * 验证输入格式，有效时同步更新值和年月面板
   */
  private handleInputChange = (value: string) => {
    this.inputValueSignal.value = value;

    const { format } = this.formatInfo;

    if (!isValidDate(value, format)) return;

    this.cacheValueSignal.value = value;
    const parsed = parseToDayjs(value, format);
    const newMonth = parsed.month();
    const newYear = parsed.year();
    if (!Number.isNaN(newYear)) {
      this.yearSignal.value = newYear;
    }
    if (!Number.isNaN(newMonth)) {
      this.monthSignal.value = newMonth;
    }
  };

  /**
   * 处理year, month面板快速切换
   * 根据mode计算跳转的月数，更新year, month signal
   */
  private handlePanelJumperClick = ({ trigger }: { trigger: 'prev' | 'next' | 'current' }) => {
    const { mode = 'date' } = (this.props as DatePickerProps) ?? {};
    const monthCountMap: Record<string, number> = {
      date: 1,
      week: 1,
      month: 12,
      quarter: 12,
      year: 120,
    };
    const monthCount = monthCountMap[mode] ?? 0;

    const current = new Date(this.yearSignal.value, this.monthSignal.value);
    let target = current;

    if (trigger === 'prev') {
      target = subtractMonth(current, monthCount);
    } else if (trigger === 'next') {
      target = addMonth(current, monthCount);
    } else if (trigger === 'current') {
      target = new Date();
    }

    this.yearSignal.value = target.getFullYear();
    this.monthSignal.value = target.getMonth();
  };

  private handlePanelMonthChange = (month: number) => {
    this.monthSignal.value = month;
  };

  private handlePanelYearChange = (year: number) => {
    this.yearSignal.value = year;
  };

  /**
   * 处理预设按钮点击
   * 解析预设值，更新选中值和面板状态
   */
  private handlePresetClick = (
    preset: DateValue | (() => DateValue),
    context: { preset: PresetDate; e: MouseEvent },
  ) => {
    const { format, valueType } = this.formatInfo;
    const presetValue: DateValue = typeof preset === 'function' ? preset() : preset;

    const formattedPreset = formatDate(presetValue, { format, targetFormat: valueType }) as DateValue;
    const formattedInput = formatDate(presetValue, { format }) || '';

    this.inputValueSignal.value = formattedInput;
    this.cacheValueSignal.value = formattedInput;

    const dayjsValue = parseToDayjs(presetValue, format);
    if (dayjsValue?.isValid?.()) {
      this.yearSignal.value = dayjsValue.year();
      this.monthSignal.value = dayjsValue.month();
    }

    this.setPopupVisibleState?.(false, { trigger: 'preset' });
    this.setValueState?.(formattedPreset, {
      dayjsValue,
      trigger: 'preset',
    });
    this.props.onPresetClick?.(context);
  };

  private renderPanel(props: DatePickerProps) {
    const { format } = this.formatInfo;
    return (
      <t-date-picker-panel
        mode={props.mode}
        format={format}
        value={this.valueState}
        formattedValue={this.cacheValueSignal.value}
        year={this.yearSignal.value}
        month={this.monthSignal.value}
        firstDayOfWeek={props.firstDayOfWeek}
        disableDate={props.disableDate}
        minDate={props.minDate}
        maxDate={props.maxDate}
        presets={props.presets}
        presetsPlacement={props.presetsPlacement}
        onCellClick={(value: Date) => this.handleCellClick(value)}
        onCellMouseEnter={this.handleCellMouseEnter}
        onCellMouseLeave={this.handleCellMouseLeave}
        onJumperClick={this.handlePanelJumperClick}
        onMonthChange={this.handlePanelMonthChange}
        onYearChange={this.handlePanelYearChange}
        onPresetClick={this.handlePresetClick}
      />
    );
  }

  render(props: OmiProps<DatePickerProps, any>) {
    const {
      disabled,
      status,
      tips,
      borderless,
      label,
      clearable,
      placeholder,
      allowInput,
      popupProps,
      inputProps,
      tagInputProps,
      prefixIcon,
      suffixIcon,
    } = props;

    const cls = classNames(`${this.classPrefix}-date-picker`);
    const visible = props.popupVisible ?? this.popupVisibleState;
    const panelVNode = this.renderPanel(props as DatePickerProps);

    const prefixIconNode = prefixIcon;
    const suffixIconNode = suffixIcon ?? <t-icon-calendar className="t-icon t-icon-calendar" />;

    const displayPlaceholder = this.placeholderSignal.value || placeholder;

    return (
      <div class={cls} part={cls}>
        <t-select-input
          disabled={disabled}
          value={this.inputValueSignal.value}
          inputValue={this.inputValueSignal.value}
          status={status}
          tips={tips}
          borderless={borderless}
          label={label}
          clearable={clearable}
          allowInput={allowInput}
          placeholder={displayPlaceholder}
          popupProps={popupProps}
          inputProps={inputProps}
          tagInputProps={tagInputProps}
          popupVisible={visible}
          panel={panelVNode}
          multiple={false}
          onClear={this.handleClear}
          onPopupVisibleChange={this.handlePopupVisibleChange}
          onInputChange={this.handleInputChange}
          prefixIcon={prefixIconNode}
          suffixIcon={suffixIconNode}
          popupMatchWidth={false}
        />
      </div>
    );
  }
}
