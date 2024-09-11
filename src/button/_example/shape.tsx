import 'tdesign-web-components/button';
import 'tdesign-web-components/space';
import 'tdesign-icons-web-components/esm/components/calendar';

export default function Button() {
  return (
    <t-space direction="vertical">
      <t-space>
        <t-button shape="rectangle" variant="base">
          填充按钮
        </t-button>
        <t-button shape="square" variant="base">
          <t-icon-calendar />
        </t-button>
        <t-button shape="round" variant="base">
          填充按钮
        </t-button>
        <t-button shape="circle" variant="base">
          <t-icon-calendar />
        </t-button>
      </t-space>
      <t-space>
        <t-button shape="rectangle" variant="outline">
          描边按钮
        </t-button>
        <t-button shape="square" variant="outline">
          <t-icon-calendar />
        </t-button>
        <t-button shape="round" variant="outline">
          描边按钮
        </t-button>
        <t-button shape="circle" variant="outline">
          <t-icon-calendar />
        </t-button>
      </t-space>
      <t-space>
        <t-button shape="rectangle" variant="dashed">
          虚框按钮
        </t-button>
        <t-button shape="square" variant="dashed">
          <t-icon-calendar />
        </t-button>
        <t-button shape="round" variant="dashed">
          虚框按钮
        </t-button>
        <t-button shape="circle" variant="dashed">
          <t-icon-calendar />
        </t-button>
      </t-space>
      <t-space>
        <t-button shape="rectangle" variant="text">
          文字按钮
        </t-button>
        <t-button shape="square" variant="text">
          <t-icon-calendar />
        </t-button>
        <t-button shape="round" variant="text">
          文字按钮
        </t-button>
        <t-button shape="circle" variant="text">
          <t-icon-calendar />
        </t-button>
      </t-space>
    </t-space>
  );
}
