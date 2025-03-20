import { css, globalCSS } from 'omi';

// 为了做主题切换
import vars from './_var.less';

export const varSheet = css`
  ${vars}
`;

globalCSS(varSheet);
