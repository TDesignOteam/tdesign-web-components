import 'tdesign-icons-web-components';

import { Component, tag } from 'omi';

import classname from '../_util/classname';
import { StyledProps } from '../common';
import { TdFileCardProps } from './type';

export interface FileCardProps extends TdFileCardProps, StyledProps {}
@tag('t-filecard')
export default class FileCard extends Component<FileCardProps> {
  // 常量定义
  EMPTY = '\u00A0';

  DEFAULT_ICON_COLOR = '#8c8c8c';

  IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];

  PRESET_FILE_ICONS = [
    {
      icon: <t-icon name="file-excel" size="24px" />,
      color: '#22b35e',
      ext: ['xlsx', 'xls'],
    },
    {
      icon: <t-icon name="file-image" size="24px" />,
      color: this.DEFAULT_ICON_COLOR,
      ext: this.IMG_EXTS,
    },

    {
      icon: <t-icon name="file-code-1" size="24px" />,
      color: this.DEFAULT_ICON_COLOR,
      ext: ['md', 'mdx'],
    },
    {
      icon: <t-icon name="file-pdf" size="24px" />,
      color: '#ff4d4f',
      ext: ['pdf'],
    },
    {
      icon: <t-icon name="file-powerpoint" size="24px" />,
      color: '#ff6e31',
      ext: ['ppt', 'pptx'],
    },
    {
      icon: <t-icon name="file-word" size="24px" />,
      color: '#1677ff',
      ext: ['doc', 'docx'],
    },
    {
      icon: <t-icon name="file-zip" size="24px" />,
      color: '#fab714',
      ext: ['zip', 'rar', '7z', 'tar', 'gz'],
    },
    {
      icon: <t-icon name="video" size="24px" />,
      color: '#ff4d4f',
      ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
    },
    {
      icon: <t-icon name="file-music" size="24px" />,
      color: '#8c8c8c',
      ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
    },
  ];

  state = {
    previewImg: '',
    namePrefix: '',
    nameSuffix: '',
    isImg: false,
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
    this.state.isImg = this.IMG_EXTS.includes(nameSuffix.toLowerCase().replace('.', ''));
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
    const { item, disabled, class: className } = props;
    const { status = 'done' } = item;
    const { desc, icon, iconColor, namePrefix, nameSuffix } = this.state;

    return (
      <div
        class={classname(className, 'file-card-type-overview', {
          'file-card-status-uploading': status === 'progress',
          'file-card-status-error': status === 'fail',
        })}
      >
        {this.renderFileOverview(namePrefix, nameSuffix, icon, iconColor, desc)}

        {!disabled && this.props.onRemove && (
          <button
            class="file-card-remove"
            onClick={(e: Event) => {
              e.stopPropagation();
              this.fire('remove', { detail: item });
            }}
          >
            <t-icon name="close-circle-filled" />
          </button>
        )}
      </div>
    );
  }

  private renderFileOverview(namePrefix: string, nameSuffix: string, icon: any, iconColor: string, desc: string) {
    return (
      <>
        <div class="file-card-icon" style={{ color: iconColor }}>
          {icon}
        </div>
        <div class="file-card-content">
          <div class="file-card-name">
            <span class="file-card-name-prefix">{namePrefix || this.EMPTY}</span>
            <span class="file-card-name-suffix">{nameSuffix}</span>
          </div>
          <div class="file-card-desc">{desc}</div>
        </div>
      </>
    );
  }
}
