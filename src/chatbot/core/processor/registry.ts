/* eslint-disable */
import type { AIContentHandler, BaseContent, ContentRenderer } from '../type';

// 渲染器管理中心
class RenderRegistry {
  private renderers = new Map<string, ContentRenderer<any>>();
  private defaultRenderers = new Map<string, ContentRenderer<any>>();

  registerRenderer<T extends string>(type: T, renderer: ContentRenderer<BaseContent<T, any>>) {
    this.renderers.set(type, renderer);
  }

  getRenderer<T extends BaseContent<any, any>>(type: string): ContentRenderer<T> | undefined {
    return this.renderers.get(type) ?? this.defaultRenderers.get(type);
  }

  registerDefaultRenderer(type: string, renderer: ContentRenderer<any>) {
    this.defaultRenderers.set(type, renderer);
  }
}

// 使用示例: 初始化注册
// const registry = new ContentRegistry();

// // 覆盖默认文本处理器
// registry.registerType({
//   type: 'text',
//   handler: (chunk, existing) => ({
//     ...chunk,
//     data: `MODIFIED: ${existing?.data || ''}${chunk.data}`
//   })
// });

// // 获取时会优先使用自定义处理器
// const handler = registry.processor.getHandler('text'); // 返回自定义版本

// // 恢复默认处理器
// registry.processor.registerHandler('text', originalHandler, true);

export default class ContentRegistry {
  private processor = new ContentProcessor();
  private renderRegistry = new RenderRegistry();
  private typeDefinitions = new Map<string, any>();

  constructor() {
    // 注册默认处理器（标记为默认）
    this.processor.registerHandler(
      'text',
      (chunk, existing) => ({
        ...chunk,
        data: (existing?.data || '') + chunk.data,
      }),
      true, // 标记为默认
    );
  }

  registerType<T extends string, D = any>(definition: {
    type: T;
    handler?: AIContentHandler<BaseContent<T, D>>;
    renderer?: ContentRenderer<BaseContent<T, D>>;
  }) {
    if (!definition.handler && !definition.renderer) {
      throw new Error('Must provide at least handler or renderer');
    }

    // 合并处理器
    if (definition.handler) {
      this.processor.registerHandler(definition.type, definition.handler);
    }

    // 合并渲染器
    if (definition.renderer) {
      this.renderRegistry.registerRenderer(definition.type, definition.renderer);
    }

    this.typeDefinitions.set(definition.type, definition);
  }
}

// 处理器管理中心
class ContentProcessor {
  // 合并为统一的处理器存储
  private handlers = new Map<string, AIContentHandler<any>>();

  /**
   * 统一注册方法（覆盖默认）
   * @param type 内容类型
   * @param handler 处理器函数
   * @param isDefault 是否设为该类型的默认处理器
   */
  registerHandler<T extends string>(type: T, handler: AIContentHandler<BaseContent<T, any>>, isDefault = false) {
    // 默认处理器需要特殊存储逻辑
    if (isDefault) {
      this.handlers.set(`default:${type}`, handler);
    } else {
      this.handlers.set(type, handler);
    }
  }

  /**
   * 智能获取处理器（优先自定义，后默认）
   */
  getHandler<T extends BaseContent<any, any>>(type: string): AIContentHandler<T> | undefined {
    // 优先返回自定义处理器
    return this.handlers.get(type) ?? this.handlers.get(`default:${type}`);
  }
}

// 类型注册示例（不同框架的使用方式）
// const textDefinition: ContentTypeDefinition<'text', string> = {
//   type: 'text',
//   renderer: (content) => {
//     // React 使用方式
//     // return <div>{content.data}</div>;

//     // Vue 使用方式
//     // return h('div', content.data);

//     // 原生 DOM 使用方式
//     const div = document.createElement('div');
//     div.textContent = content.data;
//     return div;
//   }
// };

// const chartDefinition: ContentTypeDefinition<'chart', { config: object }> = {
//   type: 'chart',
//   handler: (chunk, existing) => ({
//     ...chunk,
//     data: mergeChartConfig(existing?.data, chunk.data)
//   }),
//   renderer: (content, { container, update }) => {
//     // 动态更新示例
//     let chart: Chart;
//     if (container) {
//       chart = renderChart(container, content.data.config);
//     }

//     return {
//       update(newConfig) {
//         chart?.update(newConfig);
//       },
//       destroy() {
//         chart?.destroy();
//       }
//     };
//   }
// };

// registerContentType({
//   type: 'wc-button',
//   renderer: (content) => `
//     <my-button
//       variant="${content.data.variant}"
//       @click="${content.data.onClick}"
//     >
//       ${content.data.text}
//     </my-button>
//   `
// });

// 用户扩展时自动合并类型
// declare module './types' {
//   interface ContentTypeRegistry {
//     // 覆盖内置类型示例
//     text: ContentTypeDefinition<'text', string>; // ✅ 必须匹配原始类型
//     // 新增类型示例
//     customChart: ContentTypeDefinition<'customChart', { data: number[] }>;
//   }
// }

// 框架适配示例：
// React 适配层
// function createReactRenderer<T>(def: ContentTypeDefinition<T>) {
//   return (props: { content: BaseContent<T> }) => {
//     const ref = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//       const cleanup = def.renderer?.(props.content, {
//         container: ref.current,
//         update: (data) => {
//           // 触发React重新渲染
//         }
//       });

//       return () => cleanup?.();
//     }, [props.content]);

//     return <div ref={ref} />;
//   };
// }

// // Vue 适配层
// const createVueComponent = (def: ContentTypeDefinition) => ({
//   props: ['content'],
//   setup(props) {
//     const container = ref(null);

//     onMounted(() => {
//       def.renderer?.(props.content, {
//         container: container.value
//       });
//     });

//     return () => h('div', { ref: container });
//   }
// });
