import 'tdesign-icons-web-components';
import 'tdesign-icons-web-components/esm/components/close-circle-filled';

import { Component, tag } from 'omi';

import classname from '../_util/classname';
import { getClassPrefix } from '../_util/classname';
import { StyledProps } from '../common';
import { TdFileCardProps } from './type';

import styles from './style/filecard.less';

export interface FileCardProps extends TdFileCardProps, StyledProps {}
const className = `${getClassPrefix()}-filecard`;
@tag('t-filecard')
export default class FileCard extends Component<FileCardProps> {
  static css = [styles];

  // 常量定义
  EMPTY = '\u00A0';

  DEFAULT_ICON_COLOR = '#8c8c8c';

  IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];

  PRESET_FILE_ICONS = [
    {
      icon: <t-icon name="file-excel-filled" size="24px" />,
      color: '#2BA471',
      ext: ['xlsx', 'xls'],
    },
    {
      icon: <t-icon name="file-image-filled" size="24px" />,
      color: this.DEFAULT_ICON_COLOR,
      ext: this.IMG_EXTS,
    },

    {
      icon: <t-icon name="file-code-1-filled" size="24px" />,
      color: this.DEFAULT_ICON_COLOR,
      ext: ['md', 'mdx'],
    },
    {
      icon: <t-icon name="file-pdf-filled" size="24px" />,
      color: '#D54941',
      ext: ['pdf'],
    },
    {
      icon: <t-icon name="file-powerpoint-filled" size="24px" />,
      color: '#E37318',
      ext: ['ppt', 'pptx'],
    },
    {
      icon: <t-icon name="file-word-filled" size="24px" />,
      color: '#0052D9',
      ext: ['doc', 'docx'],
    },
    {
      icon: <t-icon name="file-zip-filled" size="24px" />,
      color: '#E37318',
      ext: ['zip', 'rar', '7z', 'tar', 'gz'],
    },
    {
      icon: <t-icon name="video-filled" size="24px" />,
      color: '#D54941',
      ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
    },
    {
      icon: <t-icon name="file-music-filled" size="24px" />,
      color: '#D54941',
      ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
    },
  ];

  state = {
    namePrefix: '',
    nameSuffix: '',
    desc: '',
    icon: null,
    iconColor: '#8c8c8c',
  };

  installed() {
    this.processFileName();
    this.processDescription();
    this.processIcon();
  }

  processFileName() {
    const { name = '' } = this.props.item;
    const match = name.match(/^(.*)\.[^.]+$/);
    const [namePrefix, nameSuffix] = match ? [match[1], name.slice(match[1].length)] : [name, ''];

    this.state.namePrefix = namePrefix;
    this.state.nameSuffix = nameSuffix;
    this.update();
  }

  processDescription() {
    const { item } = this.props;
    const { status = 'done', description, size, percent } = item;

    let desc = description;
    if (!desc) {
      if (status === 'progress') {
        desc = `上传中...${percent || 0}%`;
      } else if (status === 'fail') {
        desc = item.response || this.EMPTY;
      } else {
        desc = size ? this.getSize(size) : this.EMPTY;
      }
    }

    this.state.desc = desc;
    this.update();
  }

  getSize(size: number) {
    let retSize = size;
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    let unitIndex = 0;

    while (retSize >= 1024 && unitIndex < units.length - 1) {
      retSize /= 1024;
      unitIndex += 1;
    }

    return `${retSize.toFixed(0)} ${units[unitIndex]}`;
  }

  processIcon() {
    const { item } = this.props;
    const { nameSuffix } = this.state;
    const { status = 'done' } = item;
    if (status === 'progress') {
      this.state.icon = <t-icon name="loading" size="24px" />;
      this.state.iconColor = '#0052D9';
      this.update();
      return;
    }
    for (const { ext, icon, color } of this.PRESET_FILE_ICONS) {
      if (this.matchExt(nameSuffix, ext)) {
        this.state.icon = icon;
        this.state.iconColor = color;
        this.update();
        return;
      }
    }
    this.state.icon = <t-icon name="file" size="24px" />;
    this.state.iconColor = this.DEFAULT_ICON_COLOR;
    this.update();
  }

  matchExt(suffix: string, ext: string[]) {
    return ext.some((e) => suffix.toLowerCase() === `.${e}`);
  }

  render(props: FileCardProps) {
    const { item, disabled, class: classNames } = props;
    const { status = 'done' } = item;
    const { desc, icon, iconColor, namePrefix, nameSuffix } = this.state;

    return (
      <div
        class={classname(classNames, `${className}-overview`, {
          [`${className}-status-uploading`]: status === 'progress',
          [`${className}-status-error`]: status === 'fail',
        })}
      >
        {this.renderFileOverview(namePrefix, nameSuffix, icon, iconColor, desc)}

        {!disabled && this.props.onRemove && (
          <div
            class={`${className}-remove`}
            onClick={(e: Event) => {
              e.stopPropagation();
              this.fire('remove', item);
            }}
          >
            <t-icon name="close-circle-filled" size="15px" />
          </div>
        )}
      </div>
    );
  }

  private renderFileOverview(namePrefix: string, nameSuffix: string, icon: any, iconColor: string, desc: string) {
    return (
      <>
        <div class={`${className}-icon`} style={{ color: iconColor }}>
          {icon}
        </div>
        <div class={`${className}-content`}>
          <div class={`${className}-name`}>
            <span class={`${className}-name-prefix`}>{namePrefix || this.EMPTY}</span>
            <span class={`${className}-name-suffix`}>{nameSuffix}</span>
          </div>
          <div class={`${className}-desc`}>{desc}</div>
        </div>
      </>
    );
  }
}
