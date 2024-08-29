import 'tdesign-web-components/button';
import '../../button';

import { Component } from 'omi';
import { DialogPlugin } from 'tdesign-web-components';

const buttonStyle = { marginRight: 16 };

export default class LoadingService extends Component {
  showDialog = () => {
    const myDialog = DialogPlugin({
      header: 'Dialog-Plugin',
      body: 'Hi, darling! Do you want to be my lover?',
      onConfirm: ({ e }) => {
        console.log('confirm clicked', e);
        myDialog.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        myDialog.hide();
      },
      onCloseBtnClick: ({ e }) => {
        console.log('close btn: ', e);
      },
    });
  };

  handleDN = () => {
    const dialogNode = DialogPlugin({
      header: 'Dialog-Plugin',
      body: 'Hi, darling! Do you want to be my lover?',
    });
    dialogNode.update({
      header: 'Updated-Dialog-Plugin',
      cancelBtn: null,
      onConfirm: ({ e }) => {
        console.log('confirm button has been clicked!');
        console.log('e: ', e);
        dialogNode.hide();
        dialogNode.destroy();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        dialogNode.hide();
      },
    });
  };

  onConfirm = () => {
    const confirmDia = DialogPlugin.confirm({
      header: 'Dialog-Confirm-Plugin',
      body: 'Are you sure to delete it?',
      confirmBtn: 'ok',
      cancelBtn: 'cancel',
      onConfirm: ({ e }) => {
        console.log('confirm button has been clicked!');
        console.log('e: ', e);
        confirmDia.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        confirmDia.hide();
      },
    });
  };

  onAlert = () => {
    const alertDia = DialogPlugin.alert({
      header: 'Dialog-Alert-Plugin',
      body: 'Notice: Your balance is going to be empty.',
      confirmBtn: {
        content: 'Got it!',
        variant: 'base',
        theme: 'danger',
      },
      onConfirm: ({ e }) => {
        console.log('confirm e: ', e);
        alertDia.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('close e: ', e);
        console.log('trigger: ', trigger);
        alertDia.hide();
      },
    });
  };

  onDialogPluginConfirm = () => {
    const confirmDia = DialogPlugin.confirm({
      header: 'Dialog-Confirm-Plugin',
      body: 'Are you sure to delete it?',
      confirmBtn: 'ok',
      cancelBtn: 'cancel',
      onConfirm: ({ e }) => {
        console.log('confirm button has been clicked!');
        console.log('e: ', e);
        confirmDia.hide();
      },
      onClose: ({ e, trigger }) => {
        console.log('e: ', e);
        console.log('trigger: ', trigger);
        confirmDia.hide();
      },
    });
  };

  render() {
    return (
      <div>
        <t-button onClick={this.showDialog} style={buttonStyle}>
          dialog
        </t-button>
        <t-button onClick={this.handleDN} style={buttonStyle}>
          handleDialogNode
        </t-button>
        <t-button onClick={this.onConfirm} style={buttonStyle}>
          confirm
        </t-button>
        <t-button onClick={this.onAlert} style={buttonStyle}>
          alert
        </t-button>
        <t-button onClick={this.onDialogPluginConfirm} style={buttonStyle}>
          DialogPlugin.confirm
        </t-button>
      </div>
    );
  }
}
