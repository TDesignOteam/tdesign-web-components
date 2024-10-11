import { tag } from 'omi';
import { getClassPrefix } from 'tdesign-web-components/_util/classname';
import { Input } from 'tdesign-web-components/input';

@tag('t-range-input-inner')
export default class RangeInput extends Input {
  static css = [
    `
    .${getClassPrefix()}-range-input__inner-left,
    .${getClassPrefix()}-range-input__inner-right {
      width: 100%;
      height: 100%;
      border-radius: var(--td-radius-small);
    }

    .${getClassPrefix()}-input {
      padding: 0 var(--td-comp-paddingLR-xs);
      height: 100%;
      border: 0;
      box-shadow: none;
      font-size: inherit;
      border-radius: var(--td-radius-small);
    }

    .${getClassPrefix()}-input:hover {
      background: var(--td-bg-color-container-hover);
    }
    
    .${getClassPrefix()}-is-focused.${getClassPrefix()}-input,
    .${getClassPrefix()}-range-input__inner-left.${getClassPrefix()}-is-focused .${getClassPrefix()}-input,
    .${getClassPrefix()}-range-input__inner-right.${getClassPrefix()}-is-focused .${getClassPrefix()}-input {
      background: var(--td-bg-color-component);
    }

    .${getClassPrefix()}-size-l .${getClassPrefix()}-input {
      padding: 0 var(--td-comp-margin-s);
    }
  `,
  ];
}
