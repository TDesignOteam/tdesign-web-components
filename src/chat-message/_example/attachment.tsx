import '../content/attachment-content';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class BasicExample extends Component {
  render() {
    return (
      <t-space direction="vertical">
        <t-chat-attachment-content
          content={[
            {
              fileType: 'image',
              name: 'avatar.jpg',
              size: 234234,
              url: 'https://tdesign.gtimg.com/site/avatar.jpg',
            },
          ]}
        ></t-chat-attachment-content>
        <t-chat-attachment-content
          content={[
            {
              fileType: 'doc',
              name: 'demo.docx',
              url: 'https://tdesign.gtimg.com/site/demo.docx',
              size: 12312,
            },
            {
              fileType: 'pdf',
              name: 'demo2.pdf',
              url: 'https://tdesign.gtimg.com/site/demo.pdf',
              size: 34333,
            },
          ]}
          onFileClick={(e) => {
            console.log('fileclick', e.detail);
          }}
        ></t-chat-attachment-content>
      </t-space>
    );
  }
}
