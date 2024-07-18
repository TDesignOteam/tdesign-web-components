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

const CustomFile = (props: CustomFileProps) => {
  const { classPrefix } = props;
  // const drag = useDrag({ ...props.dragEvents, accept });
  // const { dragActive } = drag;

  // const dragEvents = draggable
  //   ? {
  //       onDrop: drag.handleDrop,
  //       onDragEnter: drag.handleDragenter,
  //       onDragOver: drag.handleDragover,
  //       onDragLeave: drag.handleDragleave,
  //     }
  //   : {};

  // const renderDragContent = () => {
  //   const childrenContent = parseTNode(props.childrenNode, { dragActive, files: displayFiles });
  //   const triggerContent = parseTNode(props.trigger, { dragActive, files: displayFiles });
  //   return (
  //     <div
  //       className={`${classPrefix}-upload__dragger ${classPrefix}-upload__dragger-center`}
  //       {...dragEvents}
  //       onClick={props.triggerUpload}
  //     >
  //       <div className={`${classPrefix}-upload__trigger`}>
  //         {parseTNode(props.dragContent, { dragActive, files: displayFiles }) || triggerContent || childrenContent}
  //       </div>
  //     </div>
  //   );
  // };

  return (
    <>
      {/* {draggable ? (
        renderDragContent()
      ) :  */}
      <div className={`${classPrefix}-upload__trigger`} onClick={props.triggerUpload}>
        <slot></slot>
      </div>
    </>
  );
};

CustomFile.displayName = 'CustomFile';

export default CustomFile;
