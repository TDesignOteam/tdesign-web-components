import 'tdesign-web-components/textarea';

export default function Textarea() {

  const value=''
  
  const onBlur = (value,{ e }) =>{
    console.log('onBlur: ', value, e);
  }

  const onFocus = (value,{ e }) =>{
    console.log('onFocus: ', value, e);
  }

  const onKeyup = (value,{ e }) =>{
    console.log('onKeyup', value, e)
  }

  const onKeypress = (value,{ e }) =>{
    console.log('onKeypress', value, e)
  }

  const onKeydown = (value,{ e }) =>{
    console.log('onKeydown', value, e)
  }

    return (
        <t-textarea
          placeholder="请输入"
          value={value}
          onBlur={onBlur}
          onFocus={onFocus}
          onKeypress={onKeypress}
          onKeydown={onKeydown}
          onKeyup={onKeyup}
        ></t-textarea>
    )
  }

