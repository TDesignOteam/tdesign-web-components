import { classNames, Component, createRef, OmiProps, tag } from 'omi';

import classname, { getClassPrefix } from '../_util/classname';
// import inputSyle from './style'
import { TdInputGroupProps } from './type';

const classPrefix = getClassPrefix();

export type InputGroupProps = TdInputGroupProps;

@tag('t-input-group')
export default class InputGruop extends Component<InputGroupProps> {
  S;

  static addStyle = `.t-input-group--separate t-input{
    margin-left: var(--td-comp-margin-xxxl);
  }`;

  divRef = createRef();

  // static css = inputSyle + InputGruop.addStyle

  install(): void {
    console.log(this.props);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(props: OmiProps<InputGroupProps>, _store: any) {
    const { separate, children, ...wrapperProps } = props;
    // const addStyle = `

    // t-input{
    //   margin-left: var(--td-comp-margin-xxxl) !important;
    // }`;

    // (()=>{
    //   for(let i = 1; i < children.length; i++){
    //     if(children[i].nodeName == children[i - 1].nodeName){
    //       children[i].attributes.css = addStyle
    //       console.log(children[i])
    //     }
    //   }
    // })();
    // const groupChildren = this.children
    // function renderChildren() {
    //   return props.children.map((item, index) => {
    //     if(index>=1 && props.children[index-1].nodeName == props.children[index].nodeName){

    //       // if (!item.attributes.css) {
    //       //   item.attributes.css = ''
    //       // }
    //       // item.attributes.css += addStyle
    //       if(!item.attributes.style){
    //         item.attributes.style = {}
    //       }
    //       // console.log(item.attributes.style)
    //       item.attributes.style['marginLeft'] = 32
    //     }
    //     return (
    //       item
    //     )
    //   })
    // }

    return (
      <div
        ref={this.divRef}
        // style={{overflow:'hidden'}}
        style={{ width: '100%' }}
        class={classNames(`${classPrefix}-input-group`, classname, {
          [`${classPrefix}-input-group--separate`]: !!separate,
        })}
        {...wrapperProps}
      >
        <t-space>{children}</t-space>
      </div>
    );
  }
}
