import 'tdesign-web-components/affix';
import 'tdesign-web-components/button';

import { bind, Component, createRef, signal } from 'omi';

export default class Container extends Component {
  container = signal(null);

  affixRef = createRef<any>();

  affixed = signal(false);

  @bind
  handleFixedChange(affixed, { top }) {
    console.log('top', top);
    this.affixed.value = affixed;
  }

  uninstall(): void {
    if (this.affixRef.current) {
      const { handleScroll } = this.affixRef.current;
      window.removeEventListener('resize', handleScroll);
    }
  }

  install(): void {
    if (this.affixRef.current) {
      const { handleScroll } = this.affixRef.current;
      window.addEventListener('resize', handleScroll);
    }
  }

  backgroundStyle = {
    height: '1500px',
    paddingTop: '700px',
    backgroundColor: '#eee',
    backgroundImage:
      'linear-gradient(45deg,#bbb 25%,transparent 0),linear-gradient(45deg,transparent 75%,#bbb 0),linear-gradient(45deg,#bbb 25%,transparent 0),linear-gradient(45deg,transparent 75%,#bbb 0)',
    backgroundSize: '30px 30px',
    backgroundPosition: '0 0,15px 15px,15px 15px,0 0',
  };

  render() {
    return (
      <div
        style={{
          border: '1px solid var(--component-stroke)',
          borderRadius: '3px',
          height: '400px',
          overflowX: 'hidden',
          overflowY: 'auto',
          overscrollBehavior: 'none',
        }}
        ref={(ref) => (this.container.value = ref)}
      >
        <div style={this.backgroundStyle}>
          <t-affix
            offsetTop={50}
            offsetBottom={50}
            container={() => this.container.value}
            zIndex={5}
            onFixedChange={this.handleFixedChange}
            ref={this.affixRef}
          >
            <t-button>affixed: {`${this.affixed.value}`}</t-button>
          </t-affix>
        </div>
      </div>
    );
  }
}
