import { Component, signal, tag } from 'omi';

import { classname, getClassPrefix } from '../utils';
import { loadLink } from './utils';

export interface IconProps {
  name: string;
  size?: string;
  color?: string;
  className?: string;
}

const CDN_ICONFONT_URL = 'https://tdesign.gtimg.com/icon/0.2.0/fonts/index.css';

const styles = signal('');

fetch(CDN_ICONFONT_URL).then((res) => {
  res.text().then((text) => {
    styles.value = text;
  });
});

const iconStyleString = `@keyframes t-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.t-icon {
  display: inline-block;
  vertical-align: middle;
  width: 1em;
  height: 1em;
}
.t-icon::before {
  font-family: unset;
}
.t-icon-loading {
  animation: t-spin 1s linear infinite;
}
.t-icon {
  fill: currentColor;
}
.t-icon.t-size-s,
i.t-size-s {
  font-size: 14px;
}
.t-icon.t-size-m,
i.t-size-m {
  font-size: 16px;
}
.t-icon.t-size-l,
i.t-size-l {
  font-size: 18px;
}
`;

@tag('t-icon')
export class Icon extends Component<IconProps> {
  static css?: string | CSSStyleSheet | (string | CSSStyleSheet)[] | undefined = [iconStyleString];

  install(): void {
    const classPrefix = getClassPrefix();
    loadLink(CDN_ICONFONT_URL, `${classPrefix}-iconfont-stylesheet--unique-class`);
  }

  render({ name, size, className }: IconProps) {
    const classPrefix = getClassPrefix();

    const SIZE = {
      default: '',
      xs: `${classPrefix}-size-xs`,
      small: `${classPrefix}-size-s`,
      medium: `${classPrefix}-size-m`,
      large: `${classPrefix}-size-l`,
      xl: `${classPrefix}-size-xl`,
      block: `${classPrefix}-size-full-width`,
    };

    return (
      <>
        <style>{styles.value}</style>
        <i
          class={classname(
            className,
            {
              [name]: true,
              [`${classPrefix}-icon`]: true,
              [`${classPrefix}-icon-${name}`]: true,
            },
            size ? (SIZE as any)[size] : '',
          )}
        ></i>
      </>
    );
  }
}
