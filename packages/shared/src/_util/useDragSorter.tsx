interface DragSortProps<T> {
  sortOnDraggable: boolean;
  onDragSort?: (context: DragSortContext<T>) => void;
  onDragOverCheck?: {
    x?: boolean;
    targetClassNameRegExp?: RegExp;
  };
}

type DragFnType = (e?: DragEvent, index?: number, record?: any) => void;
interface DragSortInnerData {
  dragging?: boolean;
  draggable?: boolean;
  onDragStart?: DragFnType;
  onDragOver?: DragFnType;
  onDrop?: DragFnType;
  onDragEnd?: DragFnType;
}

export interface DragSortInnerProps extends DragSortInnerData {
  getDragProps?: (index?: number, record?: any) => DragSortInnerData;
}

export interface DragSortContext<T> {
  currentIndex: number;
  current: T;
  targetIndex: number;
  target: T;
}

class useDragSorter<T> implements DragSortInnerProps {
  props: DragSortProps<T>;

  draggingIndex = -1;

  dragStartData = null;

  isDropped = null;

  startInfo = { nodeX: 0, nodeWidth: 0, mouseX: 0 };

  constructor(props: DragSortProps<T>) {
    this.props = props;
  }

  onDragOver = (e, index, record) => {
    e.preventDefault();
    if (this.draggingIndex === index || this.draggingIndex === -1) return;
    if (
      this.props.onDragOverCheck?.targetClassNameRegExp &&
      !this.props.onDragOverCheck?.targetClassNameRegExp.test(e.target?.className)
    ) {
      return;
    }
    if (this.props.onDragOverCheck?.x) {
      if (!this.startInfo.nodeWidth) return;

      const { x, width } = e.target.getBoundingClientRect();
      const targetNodeMiddleX = x + width / 2;
      const clientX = e.clientX || 0;
      const draggingNodeLeft = clientX - (this.startInfo.mouseX - this.startInfo.nodeX);
      const draggingNodeRight = draggingNodeLeft + this.startInfo.nodeWidth;

      let overlap = false;
      if (draggingNodeLeft > x && draggingNodeLeft < x + width) {
        overlap = draggingNodeLeft < targetNodeMiddleX;
      } else {
        overlap = draggingNodeRight > targetNodeMiddleX;
      }
      if (!overlap) return;
    }
    this.props.onDragSort?.({
      currentIndex: this.draggingIndex,
      current: this.dragStartData,
      target: record,
      targetIndex: index,
    });
    this.draggingIndex = index;
  };

  onDragStart = (e, index, record: T) => {
    this.draggingIndex = index;
    this.dragStartData = record;
    if (this.props.onDragOverCheck) {
      const { x, width } = e.target.getBoundingClientRect();
      this.startInfo = {
        nodeX: x,
        nodeWidth: width,
        mouseX: e.clientX || 0,
      };
    }
  };

  onDrop = () => {
    this.isDropped = true;
    // setIsDropped(true);
  };

  onDragEnd = () => {
    if (!this.isDropped) {
      // 取消排序，待扩展 api，输出 dragStartData
    }
    this.isDropped = false;
    this.draggingIndex = -1;
    this.dragStartData = null;
  };

  getDragProps = (index, record: T) => {
    if (this.props.sortOnDraggable) {
      return {
        draggable: true,
        onDragStart: (e) => {
          this.onDragStart(e, index, record);
        },
        onDragOver: (e) => {
          this.onDragOver(e, index, record);
        },
        onDrop: () => {
          this.onDrop();
        },
        onDragEnd: () => {
          this.onDragEnd();
        },
      };
    }
    return {};
  };
}

export default useDragSorter;
