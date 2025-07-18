/**
 * AG-UI标准前端交互示例
 * 使用CUSTOM事件实现前端交互功能
 */

import { v4 as uuidv4 } from 'uuid';

class AGUIFrontendInteractionExamples {
  constructor() {
    this.runId = uuidv4();
    this.threadId = uuidv4();
  }

  // 1. 页面导航场景 - 使用CUSTOM事件
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
      // 使用CUSTOM事件触发前端导航
      {
        type: 'CUSTOM',
        name: 'frontend_navigation',
        value: {
          action: 'navigate',
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

  // 2. 表单操作场景 - 使用CUSTOM事件
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
      // 使用CUSTOM事件触发前端表单操作
      {
        type: 'CUSTOM',
        name: 'frontend_form_action',
        value: {
          action: 'fill_form',
          fields: [
            { selector: '#username', value: 'john_doe', action: 'focus_and_fill' },
            { selector: '#email', value: 'john@example.com', action: 'focus_and_fill' },
          ],
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

  // 3. DOM上下文获取场景 - 使用CUSTOM事件
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
      // 使用CUSTOM事件请求前端提供DOM上下文
      {
        type: 'CUSTOM',
        name: 'request_dom_context',
        value: {
          requestId: uuidv4(),
          context: {
            includeTitle: true,
            includeUrl: true,
            includeForms: true,
            includeFocusedElement: true,
          },
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

  // 4. 标准工具调用示例 - 后端API调用
  generateStandardToolCallExample() {
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
        delta: '正在查询天气信息...\n\n',
      },
      // 标准工具调用流程
      {
        type: 'TOOL_CALL_START',
        toolCallId: uuidv4(),
        toolCallName: 'get_weather',
        parentMessageId: this.messageId,
        timestamp: Date.now(),
      },
      {
        type: 'TOOL_CALL_ARGS',
        toolCallId: this.toolCallId,
        delta: '{"city":"北京"',
        timestamp: Date.now(),
      },
      {
        type: 'TOOL_CALL_ARGS',
        toolCallId: this.toolCallId,
        delta: ',"days":3}',
        timestamp: Date.now(),
      },
      {
        type: 'TOOL_CALL_END',
        toolCallId: this.toolCallId,
        timestamp: Date.now(),
      },
      {
        type: 'TOOL_CALL_RESULT',
        toolCallId: this.toolCallId,
        content: '{"temperature":"25°C","condition":"晴天"}',
        role: 'tool',
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '天气查询完成！\n\n',
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
        result: { weatherQueried: true },
        timestamp: Date.now(),
      },
    ];
  }

  // 5. 混合场景 - 工具调用 + 前端交互
  generateMixedInteractionExample() {
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
        delta: '正在处理您的请求...\n\n',
      },
      // 1. 先调用后端API获取数据
      {
        type: 'TOOL_CALL_START',
        toolCallId: uuidv4(),
        toolCallName: 'get_user_data',
        parentMessageId: this.messageId,
        timestamp: Date.now(),
      },
      {
        type: 'TOOL_CALL_ARGS',
        toolCallId: this.toolCallId,
        delta: '{"userId":"12345"}',
        timestamp: Date.now(),
      },
      {
        type: 'TOOL_CALL_END',
        toolCallId: this.toolCallId,
        timestamp: Date.now(),
      },
      {
        type: 'TOOL_CALL_RESULT',
        toolCallId: this.toolCallId,
        content: '{"name":"John","email":"john@example.com"}',
        role: 'tool',
        timestamp: Date.now(),
      },
      // 2. 然后触发前端操作
      {
        type: 'CUSTOM',
        name: 'frontend_form_action',
        value: {
          action: 'fill_form_with_data',
          data: {
            name: 'John',
            email: 'john@example.com',
          },
          fields: [
            { selector: '#name', value: 'John' },
            { selector: '#email', value: 'john@example.com' },
          ],
        },
        timestamp: Date.now(),
      },
      {
        type: 'TEXT_MESSAGE_CHUNK',
        messageId: this.messageId,
        role: 'assistant',
        delta: '数据已填充到表单中！\n\n',
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
        result: { dataProcessed: true },
        timestamp: Date.now(),
      },
    ];
  }
}

// 前端CUSTOM事件处理器
class AGUIFrontendEventHandler {
  constructor() {
    this.eventHandlers = new Map();
    this.registerDefaultHandlers();
  }

  // 注册默认事件处理器
  registerDefaultHandlers() {
    // 前端导航处理器
    this.registerHandler('frontend_navigation', (value) => {
      const { action, url, replace = false, scrollToTop = true } = value;

      if (action === 'navigate') {
        if (replace) {
          window.history.replaceState(null, '', url);
        } else {
          window.history.pushState(null, '', url);
        }

        if (scrollToTop) {
          window.scrollTo(0, 0);
        }

        return { success: true, newUrl: url };
      }

      return { success: false, error: 'Unknown navigation action' };
    });

    // 前端表单操作处理器
    this.registerHandler('frontend_form_action', (value) => {
      const { action, fields, data } = value;

      if (action === 'fill_form' || action === 'fill_form_with_data') {
        const results = [];

        fields.forEach((field) => {
          const element = document.querySelector(field.selector);
          if (element) {
            if (field.action === 'focus_and_fill') {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus();
            }

            element.value = field.value;

            // 触发change和input事件
            const changeEvent = new Event('change', { bubbles: true });
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(changeEvent);
            element.dispatchEvent(inputEvent);

            results.push({ selector: field.selector, success: true });
          } else {
            results.push({ selector: field.selector, success: false, error: 'Element not found' });
          }
        });

        return { success: true, results };
      }

      return { success: false, error: 'Unknown form action' };
    });

    // DOM上下文请求处理器
    this.registerHandler('request_dom_context', (value) => {
      const { requestId, context } = value;
      const domInfo = {};

      if (context.includeTitle) {
        domInfo.title = document.title;
      }

      if (context.includeUrl) {
        domInfo.url = window.location.href;
        domInfo.pathname = window.location.pathname;
      }

      if (context.includeForms) {
        const forms = document.querySelectorAll('form');
        domInfo.forms = Array.from(forms).map((form, index) => ({
          index,
          action: form.action,
          method: form.method,
          fields: Array.from(form.querySelectorAll('input, select, textarea')).map((input) => ({
            name: input.name,
            type: input.type,
            id: input.id,
            value: input.value,
            required: input.required,
          })),
        }));
      }

      if (context.includeFocusedElement) {
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement !== document.body) {
          domInfo.focusedElement = {
            tagName: focusedElement.tagName,
            id: focusedElement.id,
            className: focusedElement.className,
            name: focusedElement.name,
            type: focusedElement.type,
            value: focusedElement.value,
          };
        }
      }

      // 发送DOM上下文回后端
      this.sendDOMContextToBackend(requestId, domInfo);

      return { success: true, requestId };
    });
  }

  // 注册自定义处理器
  registerHandler(eventName, handler) {
    this.eventHandlers.set(eventName, handler);
  }

  // 处理CUSTOM事件
  async handleCustomEvent(event) {
    const { name, value } = event;
    const handler = this.eventHandlers.get(name);

    if (handler) {
      try {
        const result = await handler(value);
        console.log(`✅ CUSTOM事件 ${name} 处理成功:`, result);
        return result;
      } catch (error) {
        console.error(`❌ CUSTOM事件 ${name} 处理失败:`, error);
        return { success: false, error: error.message };
      }
    } else {
      console.warn(`⚠️ 未找到CUSTOM事件处理器: ${name}`);
      return { success: false, error: 'Handler not found' };
    }
  }

  // 发送DOM上下文到后端
  sendDOMContextToBackend(requestId, domInfo) {
    // 这里应该通过SSE或其他方式发送回后端
    console.log('📤 发送DOM上下文到后端:', { requestId, domInfo });

    // 示例：通过fetch发送
    fetch('/api/dom-context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, domInfo }),
    }).catch((error) => {
      console.error('发送DOM上下文失败:', error);
    });
  }
}

// 导出
export { AGUIFrontendInteractionExamples, AGUIFrontendEventHandler };
