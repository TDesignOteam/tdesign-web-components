import 'tdesign-web-components/image';
import 'tdesign-web-components/space';

export default function ImageShape() {
  return (
    <t-space>
      <t-space direction="vertical" align="center">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          shape="square"
          style={{ width: 160, height: 160 }}
          fit="cover"
        />
        square
      </t-space>
      <t-space direction="vertical" align="center">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          style={{ width: 160, height: 160 }}
          fit="cover"
          shape="round"
        />
        round
      </t-space>
      <t-space direction="vertical" align="center">
        <t-image
          src="https://tdesign.gtimg.com/demo/demo-image-1.png"
          style={{ width: 160, height: 160 }}
          shape="circle"
          fit="cover"
        />
        circle
      </t-space>
    </t-space>
  );
}
