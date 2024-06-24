import 'tdesign-web-components/image';

export default function ImageAvif() {
  return (
    <t-image
      src="https://tdesign.gtimg.com/img/tdesign-image.avif"
      srcset={{
        'image/avif': 'https://tdesign.gtimg.com/img/tdesign-image.avif',
        'image/webp': 'https://tdesign.gtimg.com/img/tdesign-image.webp',
      }}
      shape="square"
      style={{ maxWidth: '100%' }}
      fit="scale-down"
    ></t-image>
  );
}
