import './Notification';

import { noop } from 'lodash';
import { Component, createRef, OmiProps, render, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { convertToLightDomNode } from '../_util/lightDom';
import { Styles } from '../common';
import {
  NotificationInfoOptions,
  NotificationInstance,
  NotificationPlacementList,
  NotificationThemeList,
  TdNotificationProps,
} from './type';

interface NotificationListInstance extends TdNotificationProps {
  push: (theme: NotificationThemeList, options: NotificationInfoOptions) => Promise<NotificationInstance>;
  remove: (key: string) => void;
  removeAll: () => void;
}

interface NotificationListOpenOption extends NotificationInfoOptions {
  id: string;
  key: string;
  theme: NotificationThemeList;
  style: Styles;
  ref: Partial<Record<'current', NotificationInstance>>;
}

interface NotificationListProps {
  attach: HTMLElement;
  zIndex: number;
  placement: NotificationPlacementList;
  renderCallback: Function;
}

let seed = 0;

export const listMap: Map<NotificationPlacementList, NotificationListInstance> = new Map();

export const NotificationRemoveStore = {
  remove: noop,
};

@tag('t-notification-list')
export default class NotificationList extends Component<NotificationListProps> {
  static propTypes = {
    attach: HTMLElement,
    zIndex: Number,
    placement: String,
    renderCallback: Function,
  };

  className = `${getClassPrefix()}-notification`;

  listRef = createRef();

  list: NotificationListOpenOption[] = [];

  provide = {
    remove: this.remove,
  };

  setList(
    val: NotificationListOpenOption[] | ((old: NotificationListOpenOption[]) => NotificationListOpenOption[]),
  ): void {
    if (typeof val === 'function') {
      this.list = val(this.list);
    } else {
      this.list = val;
    }
    this.update();
  }

  removeItem = (key: string) => {
    this.setList((oldList) => {
      const index = oldList.findIndex((item) => item.key === key);
      if (index !== -1) {
        const tempList = [...oldList];
        tempList.splice(index, 1);
        return [...tempList];
      }
      return oldList;
    });
  };

  calOffset = (offset: string | number) => (isNaN(Number(offset)) ? offset : `${offset}px`);

  push = (theme: NotificationThemeList, options: NotificationInfoOptions): Promise<NotificationInstance> => {
    const key = String((seed += 1));
    const [horizontal, vertical] = [...options.offset];
    const horizontalOffset = this.calOffset(horizontal);
    const verticalOffset = this.calOffset(vertical);

    const style: Styles = {
      top: verticalOffset,
      left: horizontalOffset,
      marginBottom: 16,
      position: 'relative',
    };
    const ref = createRef<NotificationInstance>();
    this.setList((oldList) => [
      ...oldList,
      {
        ...options,
        key,
        theme,
        style,
        ref,
        id: key,
      },
    ]);

    return new Promise((resolve) => {
      // setTimeout replace requestAnimationFrame
      // 在useEffect启动关闭Notification时，requestAnimationFrame可能会过早执行，导致ref.current为undefined
      setTimeout(() => {
        resolve(ref.current);
      }, 1000 / 60);
    });
  };

  removeAll = () => this.setList([]);

  installed(): void {
    this.listRef.current = {
      push: this.push,
      remove: this.removeItem,
      removeAll: this.removeAll,
    };

    this.props.renderCallback?.({
      push: this.push,
      remove: this.removeItem,
      removeAll: this.removeAll,
    });
  }

  render(props: OmiProps<NotificationListProps>) {
    const { placement, zIndex } = props;

    return (
      <div className={`${this.className}__show--${placement}`} style={{ zIndex }}>
        {this.list.map((props) => {
          const { onDurationEnd = noop, onCloseBtnClick = noop } = props;
          return convertToLightDomNode(
            <t-notification
              ref={props.ref}
              key={props.key}
              {...props}
              onDurationEnd={() => {
                this.removeItem(props.key);
                onDurationEnd();
              }}
              onCloseBtnClick={(e) => {
                this.removeItem(props.key);
                onCloseBtnClick(e);
              }}
            />,
          );
        })}
      </div>
    );
  }
}

// 判断多个Notification同时执行
let renderNotification = false;

export const fetchListInstance = (
  placement: NotificationPlacementList,
  attach: HTMLElement,
  zIndex: number,
): Promise<NotificationListInstance> =>
  new Promise((resolve) => {
    // Fix the bug of Notification triggered for the first time in React 18 concurrent mode
    function idle() {
      if (listMap.has(placement)) {
        resolve(listMap.get(placement));
        return;
      }
      if (!renderNotification) {
        renderNotification = true;
        render(
          <t-notification-list
            attach={attach}
            placement={placement}
            zIndex={Number(zIndex)}
            renderCallback={(instance) => {
              renderNotification = false;
              listMap.set(placement, instance);
              resolve(instance);
            }}
          />,
          attach,
        );
        return;
      } // 循环执行，直到NotificationList的回调执行
      setTimeout(idle, 1000 / 60);
    }
    idle();
  });
