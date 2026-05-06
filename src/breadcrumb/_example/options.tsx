import 'tdesign-web-components/breadcrumb';

export default function Breadcrumb() {
  const options = [{ content: '页面1' }, { content: '页面2' }, { content: '页面3', href: 'https://github.com/' }];
  return <t-breadcrumb max-item-width={'150'} options={options}></t-breadcrumb>;
}
