import { Component } from 'omi';

import { StyledProps } from '../common';
import { TdAlertProps } from './type.ts';

export interface AlertProps extends TdAlertProps, StyledProps {}

export default class Alert extends Component<AlertProps> {
  static css = [];

  static defaultProps = {
    close: false,
    maxLine: 0,
    theme: 'info',
  };
}
