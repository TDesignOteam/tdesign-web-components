import 'tdesign-web-components/button';

export default function Button() {
  return (
    <div class="max-w-[800px] mx-auto text-left px-4 py-10">
      <h1 class="text-3xl font-bold mb-6">Button 按钮</h1>
      <p>按钮用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。</p>

      <h2 class="text-2xl font-bold my-6">按钮 Variant 和 Theme</h2>

      <div>
        <div class="flex gap-3 mb-2">
          <t-button theme="default">填充按钮</t-button>
          <t-button variant="outline" theme="default">
            描边按钮
          </t-button>
          <t-button variant="dashed" theme="default">
            虚框按钮
          </t-button>
          <t-button variant="text" theme="default">
            文字按钮
          </t-button>
        </div>
        <div class="flex gap-3 mb-2">
          <t-button theme="primary">填充按钮</t-button>
          <t-button variant="outline" theme="primary">
            描边按钮
          </t-button>
          <t-button variant="dashed" theme="primary">
            虚框按钮
          </t-button>
          <t-button variant="text" theme="primary">
            文字按钮
          </t-button>
        </div>
        <div class="flex gap-3 mb-2">
          <t-button theme="danger">填充按钮</t-button>
          <t-button variant="outline" theme="danger">
            描边按钮
          </t-button>
          <t-button variant="dashed" theme="danger">
            虚框按钮
          </t-button>
          <t-button variant="text" theme="danger">
            文字按钮
          </t-button>
        </div>
        <div class="flex gap-3 mb-2">
          <t-button theme="warning">填充按钮</t-button>
          <t-button variant="outline" theme="warning">
            描边按钮
          </t-button>
          <t-button variant="dashed" theme="warning">
            虚框按钮
          </t-button>
          <t-button variant="text" theme="warning">
            文字按钮
          </t-button>
        </div>
        <div class="flex gap-3 mb-2">
          <t-button theme="success">填充按钮</t-button>
          <t-button variant="outline" theme="success">
            描边按钮
          </t-button>
          <t-button variant="dashed" theme="success">
            虚框按钮
          </t-button>
          <t-button variant="text" theme="success">
            文字按钮
          </t-button>
        </div>
      </div>

      <h2 class="text-2xl font-bold my-6">图标按钮</h2>

      <div>
        <div class="flex gap-3 mb-2">
          <t-button theme="primary">
            <i class="t-icon t-icon-add text-base"></i>
            新建
          </t-button>
          <t-button variant="outline" icon="cloud-upload">
            上传文件
          </t-button>
          <t-button shape="circle" icon="discount" theme="primary"></t-button>
          <t-button shape="circle" icon="cloud-download" theme="primary"></t-button>
          <t-button variant="outline" icon="search">
            搜索
          </t-button>
        </div>
      </div>

      <h2 class="text-2xl font-bold my-6">不同状态的按钮</h2>

      <div>
        <div class="flex gap-3 mb-2">
          <t-button theme="primary" disabled>
            禁用的按钮
          </t-button>
          <t-button theme="primary" loading>
            加载中
          </t-button>
        </div>
      </div>

      <h2 class="text-2xl font-bold my-6">不同大小的按钮</h2>

      <div>
        <div class="flex gap-3 mb-2">
          <t-button theme="primary" size="large" shape="circle">
            大按钮
          </t-button>
        </div>
      </div>
    </div>
  );
}
