import { classNames, Component, OmiProps, tag } from 'omi';

import { getClassPrefix } from '../_util/classname';
import { ListItemMetaProps } from './types';

const ListItemMetaClassNamePrefix = (className: string) => `${getClassPrefix()}-list-item__meta${className}`;

@tag('t-list-item-meta')
export default class ListItemMeta extends Component<ListItemMetaProps> {
  static css = [];

  static defaultProps = {};

  static propTypes = {
    description: String,
    image: String,
    title: String,
  };

  renderImage = (image: any) => (
    <div class={classNames(ListItemMetaClassNamePrefix('-avatar'))}>
      <img src={image} alt="" />
    </div>
  );

  render(props: OmiProps<ListItemMetaProps>) {
    const { description, image, title } = props;
    return (
      <>
        <div class={classNames(ListItemMetaClassNamePrefix(''))}>
          {image && this.renderImage(image)}
          <div>
            <h3 class={classNames(ListItemMetaClassNamePrefix('-title'))}>{title}</h3>
            {typeof description === 'string' ? (
              <p class={classNames(ListItemMetaClassNamePrefix('-description'))}>{description}</p>
            ) : (
              description
            )}
          </div>
        </div>
      </>
    );
  }
}
