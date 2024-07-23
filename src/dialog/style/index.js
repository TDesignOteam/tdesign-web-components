import { css, globalCSS } from 'omi';

// 为了做主题切换
import styles from '../../_common/style/web/components/dialog/_index.less';

export const styleSheet = css`
  ${styles}

.t-dialog {
  transition: all var(--td-anim-time-fn-easing, cubic-bezier(.38, 0, .24, 1)) .3s;
  transform: scale(0.01);
  opacity: 0;
}

.t-dialog__mask {
  transition: all .3s;
  opacity: 0;
}

.t-dialog__ctx .t-dialog__mask.t-dialog__mask-web-zoom-enter-from,
.t-dialog__ctx .t-dialog__mask.t-dialog__mask-web-zoom-leave-active, 
.t-dialog__ctx .t-dialog__mask.t-dialog__mask-web-zoom-leave-to {
  opacity: 0;
}

.t-dialog__ctx .t-dialog__mask.t-dialog__mask-web-zoom-enter-active,
.t-dialog__ctx .t-dialog__mask.t-dialog__mask-web-zoom-enter-to, 
.t-dialog__ctx .t-dialog__mask.t-dialog__mask-web-zoom-leave-from {
  opacity: 1;
}

.t-dialog.t-dialog-web-zoom-enter-from, 
.t-dialog.t-dialog-web-zoom-leave-active, 
.t-dialog.t-dialog-web-zoom-leave-to {
  transform: scale(0.01);
  opacity: 0;
}
  
.t-dialog.t-dialog-web-zoom-enter-to,
.t-dialog.t-dialog-web-zoom-enter-active,
.t-dialog.t-dialog-web-zoom-leave-from {
  transform: scale(1);
  opacity: 1;
}
`;

globalCSS(styleSheet);
