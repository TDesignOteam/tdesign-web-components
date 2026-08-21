/** DatePicker 单面板与范围面板共享的内部单元格结构。 */
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
