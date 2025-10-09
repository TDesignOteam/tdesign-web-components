import { VNode } from 'omi';

import { CommonDisplayFileProps } from './interface';

export interface CustomFileProps extends CommonDisplayFileProps {
  // dragEvents: UploadDragEvents;
  // draggable?: boolean;
  // 拖拽区域
  // dragContent?: TdUploadProps['dragContent'];
  // trigger?: TdUploadProps['trigger'];
  triggerUpload?: () => void;
  // 非拖拽场景，是触发元素；拖拽场景是拖拽区域
  childrenNode?: VNode;
}

export function renderCustomFile(props: CustomFileProps) {
  const { classPrefix } = props;

  return (
    <div className={`${classPrefix}-upload__trigger`} onClick={props.triggerUpload}>
      <slot></slot>
    </div>
  );
}

export default renderCustomFile;
