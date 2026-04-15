import 'tdesign-web-components/space';
import 'tdesign-web-components/button';

const size5 = 5;
const size15 = 15;
const size30 = 30;
export default function SpaceSize() {
  return (
    <div>
      {/* TODO: remain: add slider? */}
      size = 5 ：
      <t-space size={size5}>
        <t-button>Button</t-button>
        <t-button>Button</t-button>
        <t-button>Button</t-button>
      </t-space>
      <br />
      <br />
      size = 15：
      <t-space size={size15}>
        <t-button>Button</t-button>
        <t-button>Button</t-button>
        <t-button>Button</t-button>
      </t-space>
      <br />
      <br />
      size = 30：
      <t-space size={size30}>
        <t-button>Button</t-button>
        <t-button>Button</t-button>
        <t-button>Button</t-button>
      </t-space>
      <br />
    </div>
  );
}
