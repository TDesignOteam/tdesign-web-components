import 'tdesign-web-components/button';
import 'tdesign-web-components/popup';

const styles = {
  container: {
    margin: '20px auto',
    width: '500px',
    height: '260px',
    position: 'relative',
  },
  placementTop: {
    position: 'absolute',
    top: '0',
    left: '42%',
  },
  placementTopLeft: {
    position: 'absolute',
    top: '0',
    left: '70px',
  },
  placementTopRight: {
    position: 'absolute',
    top: '0',
    right: '70px',
  },
  placementBottom: {
    position: 'absolute',
    bottom: '0',
    left: '42%',
  },
  placementBottomLeft: {
    position: 'absolute',
    bottom: '0',
    left: '70px',
    width: '120px',
  },
  placementBottomRight: {
    position: 'absolute',
    bottom: '0',
    right: '70px',
  },
  placementLeft: {
    position: 'absolute',
    left: '0',
    top: '42%',
  },
  placementLeftTop: {
    position: 'absolute',
    left: '0',
    top: '50px',
  },
  placementLeftBottom: {
    position: 'absolute',
    left: '0',
    bottom: '50px',
  },
  placementRight: {
    position: 'absolute',
    right: '0',
    top: '42%',
  },
  placementRightTop: {
    position: 'absolute',
    right: '0',
    top: '50px',
  },
  placementRightBottom: {
    position: 'absolute',
    right: '0',
    bottom: '50px',
  },
};

export default function Placement() {
  return (
    <div style={styles.container}>
      <t-popup content="这是Popup内容" placement="top" showArrow destroyOnClose>
        <t-button innerStyle={styles.placementTop}>top</t-button>
      </t-popup>
      <t-popup content="这是Popup内容 top-left" placement="top-left" showArrow destroyOnClose>
        <t-button innerStyle={styles.placementTopLeft}>top-left</t-button>
      </t-popup>
      <t-popup content="这是Popup内容top-right" placement="top-right" showArrow destroyOnClose>
        <t-button innerStyle={styles.placementTopRight}>top-right</t-button>
      </t-popup>
      <t-popup content="这是Popup内容" placement="bottom" showArrow destroyOnClose>
        <t-button innerStyle={styles.placementBottom}>bottom</t-button>
      </t-popup>
      <t-popup content="这是Popup内容 bottom-left" placement="bottom-left" showArrow destroyOnClose>
        <t-button innerStyle={styles.placementBottomLeft}>bottom-left</t-button>
      </t-popup>
      <t-popup content="这是Popup内容 bottom-right" placement="bottom-right" showArrow destroyOnClose>
        <t-button innerStyle={styles.placementBottomRight}>bottom-right</t-button>
      </t-popup>
      <t-popup content="这是Popup内容" placement="left" showArrow destroyOnClose>
        <t-button innerStyle={styles.placementLeft}>left</t-button>
      </t-popup>
      <t-popup
        content="这是Popup内容   left-top"
        placement="left-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
      >
        <t-button innerStyle={styles.placementLeftTop}>left-top</t-button>
      </t-popup>
      <t-popup
        content="这是Popup内容 left-bottom"
        placement="left-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
      >
        <t-button innerStyle={styles.placementLeftBottom}>left-bottom</t-button>
      </t-popup>
      <t-popup content="这是Popup内容" placement="right" showArrow destroyOnClose>
        <t-button innerStyle={styles.placementRight}>right</t-button>
      </t-popup>
      <t-popup
        content="这是Popup内容 right-top"
        placement="right-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
      >
        <t-button innerStyle={styles.placementRightTop}>right-top</t-button>
      </t-popup>
      <t-popup
        content="这是Popup内容 right-bottom"
        placement="right-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
      >
        <t-button innerStyle={styles.placementRightBottom}>right-bottom</t-button>
      </t-popup>
    </div>
  );
}
