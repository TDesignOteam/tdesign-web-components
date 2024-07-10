// 临时row

import { Component, tag } from 'omi';

@tag('t-row')
export default class Input extends Component {
  render(props) {
    const { ignoreAttributes } = props;
    if (ignoreAttributes?.length > 0) {
      ignoreAttributes.forEach((attr) => {
        this.removeAttribute(attr);
      });
    }
    return <div {...props}></div>;
  }
}
