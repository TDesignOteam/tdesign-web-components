import 'tdesign-web-components/image';
import 'tdesign-web-components/tag';

export default function ImageGalleryCover() {
  const label = (
    <t-tag
      theme="primary"
      variant="light-outline"
      style={{
        margin: 8,
      }}
    >
      标签一
    </t-tag>
  );

  return (
    <t-image
      src="https://tdesign.gtimg.com/demo/demo-image-1.png"
      style={{ width: 284, height: 160 }}
      gallery
      overlayContent={label}
    />
  );
}
