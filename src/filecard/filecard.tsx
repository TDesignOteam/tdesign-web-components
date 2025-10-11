import 'tdesign-icons-web-components/esm/components/file-excel-filled';
import 'tdesign-icons-web-components/esm/components/file-image-filled';
import 'tdesign-icons-web-components/esm/components/file-code-1-filled';
import 'tdesign-icons-web-components/esm/components/file-pdf-filled';
import 'tdesign-icons-web-components/esm/components/file-powerpoint-filled';
import 'tdesign-icons-web-components/esm/components/file-word-filled';
import 'tdesign-icons-web-components/esm/components/file-zip-filled';
import 'tdesign-icons-web-components/esm/components/video-filled';
import 'tdesign-icons-web-components/esm/components/file-music-filled';
import 'tdesign-icons-web-components/esm/components/loading';
import 'tdesign-icons-web-components/esm/components/file';
import 'tdesign-icons-web-components/esm/components/close-circle-filled';
import '../image';
import '../loading';

import { Component, tag } from 'omi';

import classname from '../_util/classname';
import { getClassPrefix } from '../_util/classname';
import { TdFileCardProps } from './type';

import styles from './style/filecard.less';

const className = `${getClassPrefix()}-filecard`;
@tag('t-filecard')
export default class FileCard extends Component<TdFileCardProps> {
  static css = [styles];

  static propTypes = {
    item: Object,
    disabled: Boolean,
    onRemove: Function,
    removable: Boolean,
    onFileClick: Function,
    imageViewer: Boolean,
    cardType: String,
  };

  static defaultProps: Partial<TdFileCardProps> = {
    removable: true,
    imageViewer: true,
    disabled: false,
    cardType: 'file',
  };

  // 预览状态
  previewVisible = false;

  private togglePreview = () => {
    // 切换预览状态
    const { item, imageViewer = true } = this.props;
    if (!imageViewer) return;
    const ext = item.extension || this.state.nameSuffix;
    if (this.IMG_EXTS.some((e) => ext.toLowerCase().includes(e))) {
      this.previewVisible = !this.previewVisible;
      this.update();
    }
  };

  // 关闭预览
  private closePreview = (e: Event) => {
    e.stopPropagation();
    this.previewVisible = false;
    this.update();
  };

  // 常量定义
  EMPTY = '\u00A0';

  DEFAULT_ICON_COLOR = '#8c8c8c';

  IMG_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg'];

  PRESET_FILE_ICONS = [
    {
      icon: <t-icon-file-excel-filled size="24px" />,
      color: '#2BA471',
      ext: ['xlsx', 'xls'],
    },
    {
      icon: <t-icon-file-image-filled size="24px" />,
      // color: this.DEFAULT_ICON_COLOR,
      ext: this.IMG_EXTS,
    },

    {
      icon: <t-icon-file-code-1-filled size="24px" />,
      // color: this.DEFAULT_ICON_COLOR,
      ext: ['md', 'mdx'],
    },
    {
      icon: <t-icon-file-pdf-filled size="24px" />,
      color: '#D54941',
      ext: ['pdf'],
    },
    {
      icon: <t-icon-file-powerpoint-filled size="24px" />,
      color: '#E37318',
      ext: ['ppt', 'pptx'],
    },
    {
      icon: <t-icon-file-word-filled size="24px" />,
      color: '#0052D9',
      ext: ['doc', 'docx'],
    },
    {
      icon: <t-icon-file-zip-filled size="24px" />,
      color: '#E37318',
      ext: ['zip', 'rar', '7z', 'tar', 'gz'],
    },
    {
      icon: <t-icon-video-filled size="24px" />,
      color: '#D54941',
      ext: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'],
    },
    {
      icon: <t-icon-file-music-filled size="24px" />,
      color: '#D54941',
      ext: ['mp3', 'wav', 'flac', 'ape', 'aac', 'ogg'],
    },
  ];

  state = {
    namePrefix: '',
    nameSuffix: '',
    desc: '',
    icon: null,
    iconColor: null,
  };

  ready() {
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
        desc = typeof item?.response === 'string' ? item.response : this.EMPTY;
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
    const { status = 'done', extension } = item;
    if (status === 'progress') {
      this.state.icon = <t-loading size="24px" />;
      this.update();
      return;
    }
    for (const { ext, icon, color } of this.PRESET_FILE_ICONS) {
      if (this.matchExt(extension || nameSuffix, ext)) {
        this.state.icon = icon;
        this.state.iconColor = color;
        this.update();
        return;
      }
    }
    this.state.icon = <t-icon-file size="24px" />;
    this.update();
  }

  matchExt(suffix: string, ext: string[]) {
    return ext.some((e) => suffix.toLowerCase() === `.${e}`);
  }

  render() {
    const { item, disabled, removable, cardType = 'file' } = this.props;
    if (!item) return;
    const { status = 'done' } = item;
    const { desc, icon, iconColor, namePrefix, nameSuffix } = this.state;
    return (
      <div
        className={classname(`${className}-overview`, {
          [`${className}-overview-image`]: cardType === 'image',
          [`${className}-status-uploading`]: status === 'progress',
          [`${className}-status-error`]: status === 'fail',
        })}
        onClick={(e: Event) => {
          e.stopPropagation();
          this.fire('fileClick', item, {
            composed: true,
          });
          this.togglePreview();
        }}
      >
        {/* 图片预览蒙层 */}
        {this.previewVisible && (
          <div className={`${className}-preview`}>
            <div className={`${className}-preview-mask`}></div>
            <div className={`${className}-preview-content`}>
              <img src={item.url} alt={item.name} />
              <t-icon-close-circle-filled
                className={`${className}-preview-close`}
                size="24px"
                onClick={this.closePreview}
              />
            </div>
          </div>
        )}
        {this.renderFileOverview(namePrefix, nameSuffix, icon, iconColor, desc)}
        {!disabled && removable && (
          <div
            className={`${className}-remove`}
            onClick={(e: Event) => {
              e.stopPropagation();
              this.fire('remove', item, {
                composed: true,
              });
            }}
          >
            <t-icon-close-circle-filled size="15px" />
          </div>
        )}
      </div>
    );
  }

  private renderFileOverview(namePrefix: string, nameSuffix: string, icon: any, iconColor: string, desc: string) {
    const { cardType = 'file', item, style = {} } = this.props;
    if (cardType === 'image') {
      const newstyle = {
        ...{
          width: 'var(--td-attachment-image-width, 52px)',
          height: 'var(--td-attachment-image-height, 52px)',
        },
        ...style,
      };
      return item.url ? (
        <t-image src={item.url} shape="round" fit="cover" className={`${className}-image`} style={newstyle}></t-image>
      ) : (
        <div className={`${className}-icon ${className}-icon__progress`} style={{ flex: 1, ...newstyle }}>
          <t-icon-loading size="24px" />
        </div>
      );
    }
    return (
      <>
        <div className={`${className}-icon ${className}-icon__${item.status}`} style={{ color: iconColor }}>
          {icon}
        </div>
        <div className={`${className}-content`}>
          <div className={`${className}-name`}>
            <span className={`${className}-name-prefix`}>{namePrefix || this.EMPTY}</span>
            <span className={`${className}-name-suffix`}>{nameSuffix}</span>
          </div>
          <div className={`${className}-desc`}>{desc}</div>
        </div>
      </>
    );
  }
}
