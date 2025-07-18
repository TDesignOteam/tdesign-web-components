/**
 * 前端函数调用示例
 * 展示AG-UI协议中的前端函数调用场景
 */

class FrontendFunctionCallExamples {
  constructor() {
    this.runId = uuidv4();
    this.threadId = uuidv4();
  }

  // 1. 页面导航场景
  generateNavigationExample() {
    return [
      {
        type: 'RUN_STARTED',
        threadId: this.threadId,
        runId: this.runId,
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_START',
        messageId: uuidv4(),
        role: 'assistant',
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '正在为您导航到用户设置页面...\n\n',
      },
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'navigateToPage',
        arguments: {
          url: '/user/settings',
          replace: false,
          scrollToTop: true,
        },
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_END',
        messageId: this.messageId,
        timestamp: Date.now(),
      },
      {
        type: 'RUN_FINISHED',
        threadId: this.threadId,
        runId: this.runId,
        result: { navigated: true },
        timestamp: Date.now(),
      },
    ];
  }

  // 2. 表单操作场景
  generateFormOperationExample() {
    return [
      {
        type: 'RUN_STARTED',
        threadId: this.threadId,
        runId: this.runId,
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_START',
        messageId: uuidv4(),
        role: 'assistant',
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '正在为您填写表单...\n\n',
      },
      // 聚焦到用户名输入框
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'focusElement',
        arguments: {
          selector: '#username',
          scrollIntoView: true,
        },
        timestamp: Date.now(),
      },
      // 填写用户名
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'setInputValue',
        arguments: {
          selector: '#username',
          value: 'john_doe',
          triggerChange: true,
        },
        timestamp: Date.now(),
      },
      // 聚焦到邮箱输入框
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'focusElement',
        arguments: {
          selector: '#email',
          scrollIntoView: true,
        },
        timestamp: Date.now(),
      },
      // 填写邮箱
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'setInputValue',
        arguments: {
          selector: '#email',
          value: 'john@example.com',
          triggerChange: true,
        },
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '表单填写完成！\n\n',
      },
      {
        type: 'TEXT_MESSAGE_END',
        messageId: this.messageId,
        timestamp: Date.now(),
      },
      {
        type: 'RUN_FINISHED',
        threadId: this.threadId,
        runId: this.runId,
        result: { formFilled: true },
        timestamp: Date.now(),
      },
    ];
  }

  // 3. DOM上下文获取场景
  generateDOMContextExample() {
    return [
      {
        type: 'RUN_STARTED',
        threadId: this.threadId,
        runId: this.runId,
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_START',
        messageId: uuidv4(),
        role: 'assistant',
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '正在分析页面内容...\n\n',
      },
      // 获取页面标题
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'getPageInfo',
        arguments: {
          includeTitle: true,
          includeUrl: true,
          includeMeta: true,
        },
        timestamp: Date.now(),
      },
      // 获取表单字段信息
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'getFormFields',
        arguments: {
          selector: 'form',
          includeValues: true,
          includeValidation: true,
        },
        timestamp: Date.now(),
      },
      // 获取当前焦点元素
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'getFocusedElement',
        arguments: {
          includeContext: true,
          includePosition: true,
        },
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '页面分析完成！\n\n',
      },
      {
        type: 'TEXT_MESSAGE_END',
        messageId: this.messageId,
        timestamp: Date.now(),
      },
      {
        type: 'RUN_FINISHED',
        threadId: this.threadId,
        runId: this.runId,
        result: { contextAnalyzed: true },
        timestamp: Date.now(),
      },
    ];
  }

  // 4. 文件操作场景
  generateFileOperationExample() {
    return [
      {
        type: 'RUN_STARTED',
        threadId: this.threadId,
        runId: this.runId,
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_START',
        messageId: uuidv4(),
        role: 'assistant',
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '正在处理文件...\n\n',
      },
      // 选择文件
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'selectFile',
        arguments: {
          accept: '.pdf,.doc,.docx',
          multiple: false,
          capture: null,
        },
        timestamp: Date.now(),
      },
      // 读取文件内容
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'readFileAsText',
        arguments: {
          encoding: 'utf-8',
          maxSize: 1024 * 1024, // 1MB
        },
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '文件处理完成！\n\n',
      },
      {
        type: 'TEXT_MESSAGE_END',
        messageId: this.messageId,
        timestamp: Date.now(),
      },
      {
        type: 'RUN_FINISHED',
        threadId: this.threadId,
        runId: this.runId,
        result: { fileProcessed: true },
        timestamp: Date.now(),
      },
    ];
  }

  // 5. UI状态更新场景
  generateUIStateExample() {
    return [
      {
        type: 'RUN_STARTED',
        threadId: this.threadId,
        runId: this.runId,
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_START',
        messageId: uuidv4(),
        role: 'assistant',
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '正在更新界面状态...\n\n',
      },
      // 显示加载状态
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'showLoading',
        arguments: {
          message: '正在处理数据...',
          overlay: true,
        },
        timestamp: Date.now(),
      },
      // 更新侧边栏
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'updateSidebar',
        arguments: {
          items: [
            { id: 'dashboard', label: '仪表板', icon: 'dashboard' },
            { id: 'settings', label: '设置', icon: 'settings' },
            { id: 'profile', label: '个人资料', icon: 'person' },
          ],
          activeItem: 'dashboard',
        },
        timestamp: Date.now(),
      },
      // 隐藏加载状态
      {
        type: 'FRONTEND_FUNCTION_CALL',
        functionName: 'hideLoading',
        arguments: {},
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '界面更新完成！\n\n',
      },
      {
        type: 'TEXT_MESSAGE_END',
        messageId: this.messageId,
        timestamp: Date.now(),
      },
      {
        type: 'RUN_FINISHED',
        threadId: this.threadId,
        runId: this.runId,
        result: { uiUpdated: true },
        timestamp: Date.now(),
      },
    ];
  }
}

// 前端函数处理示例
class FrontendFunctionHandler {
  constructor() {
    this.registeredFunctions = new Map();
    this.registerDefaultFunctions();
  }

  // 注册默认函数
  registerDefaultFunctions() {
    // 页面导航
    this.registerFunction('navigateToPage', async (args) => {
      const { url, replace = false, scrollToTop = true } = args;

      if (replace) {
        window.history.replaceState(null, '', url);
      } else {
        window.history.pushState(null, '', url);
      }

      if (scrollToTop) {
        window.scrollTo(0, 0);
      }

      return { success: true, newUrl: url };
    });

    // 元素聚焦
    this.registerFunction('focusElement', async (args) => {
      const { selector, scrollIntoView = true } = args;
      const element = document.querySelector(selector);

      if (element) {
        if (scrollIntoView) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        element.focus();
        return { success: true, element: selector };
      }
      return { success: false, error: 'Element not found' };
    });

    // 设置输入值
    this.registerFunction('setInputValue', async (args) => {
      const { selector, value, triggerChange = true } = args;
      const element = document.querySelector(selector);

      if (element) {
        element.value = value;

        if (triggerChange) {
          // 触发change事件
          const event = new Event('change', { bubbles: true });
          element.dispatchEvent(event);

          // 触发input事件
          const inputEvent = new Event('input', { bubbles: true });
          element.dispatchEvent(inputEvent);
        }

        return { success: true, element: selector, value };
      }
      return { success: false, error: 'Element not found' };
    });

    // 获取页面信息
    this.registerFunction('getPageInfo', async (args) => {
      const { includeTitle = true, includeUrl = true, includeMeta = true } = args;
      const info = {};

      if (includeTitle) {
        info.title = document.title;
      }

      if (includeUrl) {
        info.url = window.location.href;
        info.pathname = window.location.pathname;
      }

      if (includeMeta) {
        const metaTags = document.querySelectorAll('meta');
        info.meta = {};
        metaTags.forEach((meta) => {
          if (meta.name) {
            info.meta[meta.name] = meta.content;
          }
        });
      }

      return { success: true, info };
    });

    // 获取表单字段
    this.registerFunction('getFormFields', async (args) => {
      const { selector = 'form', includeValues = true, includeValidation = true } = args;
      const forms = document.querySelectorAll(selector);
      const formData = [];

      forms.forEach((form, index) => {
        const fields = [];
        const inputs = form.querySelectorAll('input, select, textarea');

        inputs.forEach((input) => {
          const field = {
            name: input.name,
            type: input.type,
            id: input.id,
            required: input.required,
            placeholder: input.placeholder,
          };

          if (includeValues) {
            field.value = input.value;
          }

          if (includeValidation) {
            field.valid = input.checkValidity();
            field.validationMessage = input.validationMessage;
          }

          fields.push(field);
        });

        formData.push({
          formIndex: index,
          action: form.action,
          method: form.method,
          fields,
        });
      });

      return { success: true, forms: formData };
    });

    // 获取焦点元素
    this.registerFunction('getFocusedElement', async (args) => {
      const { includeContext = true, includePosition = true } = args;
      const focusedElement = document.activeElement;

      if (focusedElement && focusedElement !== document.body) {
        const info = {
          tagName: focusedElement.tagName,
          id: focusedElement.id,
          className: focusedElement.className,
          name: focusedElement.name,
          type: focusedElement.type,
          value: focusedElement.value,
        };

        if (includeContext) {
          // 获取周围上下文
          const parent = focusedElement.parentElement;
          info.context = {
            parentTag: parent?.tagName,
            parentId: parent?.id,
            parentClass: parent?.className,
          };
        }

        if (includePosition) {
          const rect = focusedElement.getBoundingClientRect();
          info.position = {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
          };
        }

        return { success: true, element: info };
      }
      return { success: false, error: 'No focused element' };
    });

    // 文件选择
    this.registerFunction('selectFile', async (args) => {
      const { accept, multiple = false, capture = null } = args;

      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        if (capture) input.capture = capture;

        input.onchange = (event) => {
          const files = Array.from(event.target.files);
          resolve({ success: true, files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })) });
        };

        input.oncancel = () => {
          resolve({ success: false, error: 'File selection cancelled' });
        };

        input.click();
      });
    });

    // 读取文件
    this.registerFunction('readFileAsText', async (args) => {
      const { encoding = 'utf-8', maxSize = 1024 * 1024 } = args;

      // 这里需要配合文件选择使用
      // 实际实现中需要从之前的文件选择结果中获取文件
      return { success: false, error: 'No file selected' };
    });

    // 显示加载状态
    this.registerFunction('showLoading', async (args) => {
      const { message = '加载中...', overlay = false } = args;

      // 创建加载指示器
      const loading = document.createElement('div');
      loading.id = 'agui-loading';
      loading.className = `loading ${overlay ? 'overlay' : ''}`;
      loading.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-message">${message}</div>
      `;

      document.body.appendChild(loading);

      return { success: true };
    });

    // 隐藏加载状态
    this.registerFunction('hideLoading', async (args) => {
      const loading = document.getElementById('agui-loading');
      if (loading) {
        loading.remove();
      }

      return { success: true };
    });

    // 更新侧边栏
    this.registerFunction('updateSidebar', async (args) => {
      const { items, activeItem } = args;

      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.innerHTML = items
          .map(
            (item) => `
          <div class="sidebar-item ${item.id === activeItem ? 'active' : ''}" data-id="${item.id}">
            <i class="icon-${item.icon}"></i>
            <span>${item.label}</span>
          </div>
        `,
          )
          .join('');
      }

      return { success: true };
    });
  }

  // 注册自定义函数
  registerFunction(name, handler) {
    this.registeredFunctions.set(name, handler);
  }

  // 执行前端函数
  async executeFunction(functionName, arguments) {
    const handler = this.registeredFunctions.get(functionName);

    if (handler) {
      try {
        const result = await handler(arguments);
        return {
          type: 'FRONTEND_FUNCTION_RESULT',
          functionName,
          result,
          timestamp: Date.now(),
        };
      } catch (error) {
        return {
          type: 'FRONTEND_FUNCTION_RESULT',
          functionName,
          result: { success: false, error: error.message },
          timestamp: Date.now(),
        };
      }
    } else {
      return {
        type: 'FRONTEND_FUNCTION_RESULT',
        functionName,
        result: { success: false, error: 'Function not found' },
        timestamp: Date.now(),
      };
    }
  }
}

// 导出
export { FrontendFunctionCallExamples, FrontendFunctionHandler };
