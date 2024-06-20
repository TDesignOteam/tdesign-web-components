import { Component, tag } from 'omi';
// 临时t-space
@tag('t-space')
export default class Space extends Component {
  render(props) {
    const { direction = 'row' } = props;
    return (
      <div style={{ gap: 16, display: 'inline-flex', flexDirection: direction === 'vertical' ? 'column' : 'row' }}>
        <slot />
      </div>
    );
  }
}
