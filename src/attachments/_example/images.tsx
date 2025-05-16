import 'tdesign-web-components/attachments';
import 'tdesign-web-components/space';

import { Component } from 'omi';

export default class Button extends Component {
  filesList = [
    {
      uid: '1',
      name: 'image-file.png',
      size: 111,
      url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
    },
    {
      uid: '2',
      name: 'image-file.png',
      size: 222,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '3',
      name: 'image-file.png',
      size: 333333,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '4',
      name: 'image-file.png',
      size: 111,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '5',
      name: 'image-file.png',
      size: 222,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '6',
      name: 'image-file.png',
      size: 333333,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '7',
      name: 'image-file.png',
      size: 111,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '8',
      name: 'image-file.png',
      size: 222,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '9',
      name: 'image-file.png',
      size: 333333,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '10',
      name: 'image-file.png',
      size: 111,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '11',
      name: 'image-file.png',
      size: 222,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '12',
      name: 'image-file.png',
      size: 333333,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '13',
      name: 'image-file.png',
      size: 111,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '14',
      name: 'image-file.png',
      size: 222,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    },
    {
      uid: '15',
      name: 'image-file.png',
      size: 333333,
      url: 'https://tdesign.gtimg.com/site/avatar.jpg',
    }
  ];

  render() {
    return (
      <>
        <t-space>
          <div style={{ width: '785px', height: '50px' }}>
            <t-attachments
              items={this.filesList}
              overflow="scrollX"
              onRemove={(item) => {
                console.log('remove', item);
                this.filesList = this.filesList.filter((a) => a.uid !== item.detail.uid);
                this.update();
              }}
            ></t-attachments>
          </div>
        </t-space>
      </>
    );
  }
}
