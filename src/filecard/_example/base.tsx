import 'tdesign-web-components/filecard';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class Button extends Component {
  filesList = [
    {
      uid: '1',
      name: 'excel-file.xlsx',
      size: 111111,
    },
    {
      uid: '2',
      name: 'word-file.docx',
      size: 222222,
    },
    {
      uid: '3',
      name: 'image-file.png',
      size: 333333,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '4',
      name: 'pdf-file.pdf',
      size: 444444,
    },
    {
      uid: '5',
      name: 'pdf-file.pdf',
      size: 444444,
      extension: '.docx',
      description: 'Custom extension',
    },
    {
      uid: '6',
      name: 'ppt-file.pptx',
      size: 555555,
    },
    {
      uid: '7',
      name: 'video-file.mp4',
      size: 666666,
    },
    {
      uid: '8',
      name: 'audio-file.mp3',
      size: 777777,
    },
    {
      uid: '9',
      name: 'zip-file.zip',
      size: 888888,
    },
    {
      uid: '10',
      name: 'markdown-file.md',
      size: 999999,
      description: 'Custom description',
    },
    {
      uid: '11',
      name: 'word-markdown-file.doc',
      size: 99899,
      status: 'progress',
      percent: '50',
    },
    {
      uid: '12',
      name: 'image-file.png',
      status: 'progress',
      size: 333333,
    },
  ];

  render() {
    return (
      <>
        <t-space breakLine>
          {this.filesList.map((file, index) => (
            <t-filecard
              key={index}
              item={file}
              onFileClick={(e) => {
                console.log('fileclick', e.detail);
              }}
            ></t-filecard>
          ))}
        </t-space>
      </>
    );
  }
}
