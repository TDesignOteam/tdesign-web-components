/**
 * copy from https://github.com/Tencent/tdesign/blob/main/packages/components/src/components/td-doc-header/index.js#L78
 * tdesign 官网的吸顶效果
 */
export default (wrapper: HTMLElement | undefined | null, tabs: HTMLElement | undefined | null) => {
  if (!wrapper) return;
  const { scrollTop } = document.documentElement;
  const shadowRoot = wrapper?.shadowRoot;
  // 吸顶效果
  const background = (shadowRoot?.querySelector('.TDesign-doc-header__background') || { style: {} }) as HTMLElement;
  const title = (shadowRoot?.querySelector('.TDesign-doc-header__info-title') || { style: {} }) as HTMLElement;
  const describe = (shadowRoot?.querySelector('.TDesign-doc-header__info-describe') || { style: {} }) as HTMLElement;
  const thumb = (shadowRoot?.querySelector('.TDesign-doc-header__thumb') || { style: {} }) as HTMLElement;
  const issue = (shadowRoot?.querySelector('td-doc-issue') || { style: {} }) as HTMLElement;
  // 适配移动端
  const isMobileResponse = window.innerWidth < 1200;
  const asideWidth = isMobileResponse ? 0 : '260px';

  if (scrollTop >= 228) {
    if (title.style.position !== 'fixed') {
      Object.assign(title.style, {
        position: 'fixed',
        top: tabs ? '16px' : '28px',
        fontSize: '24px',
        lineHeight: '32px',
        opacity: 1,
        visibility: 'visible',
      });
      Object.assign(background.style, { position: 'fixed', top: '0', left: asideWidth });
      tabs &&
        Object.assign(tabs.style, {
          position: 'fixed',
          top: '64px',
          zIndex: 500,
        });
      Object.assign(issue.style, { position: 'fixed', top: '24px', right: '24px' });
    }
  } else if (scrollTop > 192 && scrollTop < 228) {
    if (title.style.visibility !== 'hidden') {
      Object.assign(title.style, { opacity: 0, visibility: 'hidden' });
      Object.assign(thumb.style, { opacity: 0, visibility: 'hidden' });
      Object.assign(describe.style, { opacity: 0, visibility: 'hidden' });

      Object.assign(background.style, { position: 'absolute', top: 'unset', left: '0' });
      tabs && Object.assign(tabs.style, { position: 'absolute', top: '228px' });
      Object.assign(issue.style, { position: 'absolute', top: 'calc(100% - 48px - 12px)' });
    }
  } else if (title.style.position === 'fixed' || title.style.visibility === 'hidden') {
    Object.assign(title.style, {
      position: 'unset',
      fontSize: '48px',
      lineHeight: '56px',
      opacity: 1,
      visibility: 'visible',
    });
    Object.assign(describe.style, { opacity: 1, visibility: 'visible' });
    Object.assign(background.style, { position: 'absolute', top: 'unset', left: '0' });
    tabs && Object.assign(tabs.style, { position: 'absolute', top: '228px' });
    Object.assign(issue.style, { position: 'absolute', top: 'calc(100% - 48px - 12px)' });
    Object.assign(thumb.style, { opacity: 1, visibility: 'visible' });
  }
};
