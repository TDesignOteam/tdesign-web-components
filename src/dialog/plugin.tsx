import { createRef, render } from 'omi';

import Dialog from './dialog';
import { DialogAlertMethod, DialogConfirmMethod, DialogMethod, DialogOptions, TdDialogProps } from './type';

function createContainer(attach?: TdDialogProps['attach']) {
  if (typeof attach === 'string') return document.querySelector(attach);
  if (typeof attach === 'function') return attach();
  return document.body;
}

export type DialogPluginMethod = DialogMethod & {
  confirm: DialogConfirmMethod;
  alert: DialogAlertMethod;
};

export const DialogPlugin: DialogPluginMethod = (options) => {
  const dialogRef = createRef<{
    updateState: (options: TdDialogProps, shouldUpdate?: boolean) => void;
  }>();
  const props = { ...options };
  const { attach } = props;
  const container = createContainer(attach);
  const div = document.createElement('div');

  const defaultProps = {
    visible: true,
    attach: null as TdDialogProps['attach'],
    showOverlay: !!attach,
  };

  render(<Dialog ref={dialogRef} {...defaultProps} {...props} attach={null}></Dialog>, div);

  container.appendChild(div);

  return {
    hide: () => {
      dialogRef.current.updateState(
        {
          visible: false,
        },
        true,
      );
    },
    show: () => {
      dialogRef.current.updateState(
        {
          visible: true,
        },
        true,
      );
    },
    update: (props) => {
      dialogRef.current.updateState(
        {
          ...props,
        },
        true,
      );
    },
    setConfirmLoading: (loading) => {
      dialogRef.current.updateState(
        {
          confirmLoading: loading,
        },
        true,
      );
    },
    destroy: () => {
      dialogRef.current.updateState(
        {
          visible: false,
        },
        true,
      );
      setTimeout(() => {
        div.remove();
      }, 300);
    },
  };
};

DialogPlugin.confirm = (options?: DialogOptions) => DialogPlugin(options);

DialogPlugin.alert = (props?: Omit<DialogOptions, 'cancelBtn'>) => {
  const options: DialogOptions = { ...props };
  options.cancelBtn = null;
  return DialogPlugin(options);
};
