import 'tdesign-web-components/button';
import 'tdesign-web-components/tooltip';

const styles = {
  container: {
    margin: '0 auto',
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

export default function Placements() {
  return (
    <div style={styles.container}>
      <t-tooltip
        content="这是Tooltip内容"
        placement="top"
        showArrow
        destroyOnClose
        style={styles.placementTop}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">top</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容 top-left"
        placement="top-left"
        showArrow
        destroyOnClose
        style={styles.placementTopLeft}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">top-left</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容top-right"
        placement="top-right"
        showArrow
        destroyOnClose
        style={styles.placementTopRight}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">top-right</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容"
        placement="bottom"
        showArrow
        destroyOnClose
        style={styles.placementBottom}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">bottom</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容 bottom-left"
        placement="bottom-left"
        showArrow
        destroyOnClose
        style={styles.placementBottomLeft}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">bottom-left</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容 bottom-right"
        placement="bottom-right"
        showArrow
        destroyOnClose
        style={styles.placementBottomRight}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">bottom-right</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容"
        placement="left"
        showArrow
        destroyOnClose
        style={styles.placementLeft}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">left</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容   left-top"
        placement="left-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
        style={styles.placementLeftTop}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">left-top</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容 left-bottom"
        placement="left-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
        style={styles.placementLeftBottom}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">left-bottom</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容"
        placement="right"
        showArrow
        destroyOnClose
        style={styles.placementRight}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">right</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容 right-top"
        placement="right-top"
        overlayStyle={{ width: '140px' }}
        style={styles.placementRightTop}
        showArrow
        destroyOnClose
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">right-top</t-button>
      </t-tooltip>
      <t-tooltip
        content="这是Tooltip内容 right-bottom"
        placement="right-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
        style={styles.placementRightBottom}
        ignoreAttributes={['style']}
      >
        <t-button variant="outline">right-bottom</t-button>
      </t-tooltip>
    </div>
  );
}
