import { Component, tag } from 'omi';

@tag('t-tag')
export class Tag extends Component {
  static defaultProps = {
    closable: false,
    default: null,
    disabled: false,
    icon: undefined,
    maxWidth: null,
    shape: 'square',
    size: 'medium', // small, medium, large
    theme: 'default',
    variant: 'dark',
  };

  onClose = (e: MouseEvent) => {
    e.stopPropagation();
    this.fire('close');
  };

  // TODO：需要cva模块实现，暂时处理下eslint问题
  getThemeClasses(theme: string) {
    switch (theme) {
      case 'default':
        return 'bg-zinc-200';
      case 'primary':
        return 'bg-blue-600';
      case 'warning':
        return 'bg-yellow-400';
      case 'danger':
        return 'bg-red-600';
      default:
        return 'bg-green-500';
    }
  }

  // TODO：需要cva模块实现，暂时处理下eslint问题
  getVariantClasses(variant: string, themeClasses: string) {
    switch (variant) {
      case 'dark':
        return 'text-zinc-700';
      case 'light':
        return 'text-zinc-700';
      case 'outline':
        return `border ${themeClasses}`;
      default:
        return `border ${themeClasses} bg-white`;
    }
  }

  // TODO：需要cva模块实现，暂时处理下eslint问题
  getSizeClasses(size: string) {
    if (size === 'small') {
      return 'px-1 text-xs h-5';
    }
    if (size === 'medium') {
      return 'px-3 text-xs h-6';
    }
    return 'px-4 text-sm h-8';
  }

  // TODO：需要cva模块实现，暂时处理下eslint问题
  getShapeClasses(shape: string) {
    if (shape === 'square') {
      return '';
    }
    if (shape === 'round') {
      return 'rounded';
    }
    return 'rounded-full';
  }

  render() {
    // @ts-ignore
    const { closable, disabled, icon, maxWidth, shape, size, theme, variant } = this.props;

    const baseClasses =
      'inline-flex items-center justify-center border border-transparent text-base font-medium rounded-sm focus:outline-none transition duration-150 ease-in-out whitespace-nowrap';
    const sizeClasses = this.getSizeClasses(size);
    const shapeClasses = this.getShapeClasses(shape);
    const themeClasses = this.getThemeClasses(theme);
    const variantClasses = this.getVariantClasses(variant, themeClasses);
    const disabledClasses = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

    const cls = `${baseClasses} ${sizeClasses} ${shapeClasses} ${themeClasses} ${variantClasses} ${disabledClasses}`;

    return (
      <div className={cls} style={{ maxWidth }}>
        {icon && <span className="mr-2">{typeof icon === 'function' ? icon() : icon}</span>}
        <slot></slot>
        {closable && <i class="t-icon t-icon-close"></i>}
      </div>
    );
  }
}
