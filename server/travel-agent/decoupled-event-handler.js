/**
 * 解耦的AG-UI事件处理器
 * 解决state和messages之间的耦合问题
 */

// 消息模板定义
const MESSAGE_TEMPLATES = {
  itinerary_summary: {
    type: 'itinerary_summary',
    structure: {
      title: 'string',
      days: 'array',
      budget: 'object',
      tips: 'array',
    },
    render: (state) => ({
      title: `您的${state.requirements?.duration || 0}天${state.requirements?.city || ''}旅游行程`,
      days: Object.entries(state.currentItinerary || {}).map(([day, activities]) => ({
        day,
        activities,
      })),
      budget: state.budget,
      tips: generateTips(state),
    }),
  },

  weather_report: {
    type: 'weather_report',
    structure: {
      city: 'string',
      forecast: 'array',
      recommendations: 'array',
    },
    render: (state) => ({
      city: state.requirements?.city,
      forecast: Object.entries(state.weather || {}).map(([day, info]) => ({
        day,
        ...info,
      })),
      recommendations: generateWeatherRecommendations(state.weather),
    }),
  },

  budget_breakdown: {
    type: 'budget_breakdown',
    structure: {
      total: 'number',
      categories: 'array',
      currency: 'string',
    },
    render: (state) => ({
      total: state.budget?.total || 0,
      categories: [
        { name: '景点门票', amount: state.budget?.attractions || 0 },
        { name: '住宿费用', amount: state.budget?.accommodation || 0 },
        { name: '餐饮费用', amount: state.budget?.meals || 0 },
        { name: '交通费用', amount: state.budget?.transportation || 0 },
      ],
      currency: 'CNY',
    }),
  },

  attraction_list: {
    type: 'attraction_list',
    structure: {
      city: 'string',
      attractions: 'array',
      totalCount: 'number',
    },
    render: (state) => ({
      city: state.requirements?.city,
      attractions: state.attractions || [],
      totalCount: (state.attractions || []).length,
    }),
  },
};

// 辅助函数
function generateTips(state) {
  const tips = [];

  if (state.requirements?.duration > 3) {
    tips.push('建议提前在网上预订热门景点门票');
  }

  if (state.weather) {
    const hasRain = Object.values(state.weather).some(
      (day) => day.condition?.includes('雨') || day.condition?.includes('雪'),
    );
    if (hasRain) {
      tips.push('注意查看天气预报，准备雨具');
    }
  }

  if (state.budget?.total > 2000) {
    tips.push('预算较高，建议提前规划消费');
  }

  return tips.length > 0 ? tips : ['建议提前在网上预订故宫门票', '准备舒适的步行鞋'];
}

function generateWeatherRecommendations(weather) {
  const recommendations = [];

  if (!weather) return recommendations;

  Object.entries(weather).forEach(([day, info]) => {
    if (info.condition?.includes('雨')) {
      recommendations.push(`${day}有雨，建议安排室内景点`);
    } else if (info.condition?.includes('雪')) {
      recommendations.push(`${day}有雪，注意保暖，建议选择室内活动`);
    } else if (info.condition?.includes('晴')) {
      recommendations.push(`${day}天气晴朗，适合户外活动`);
    }
  });

  return recommendations;
}

// 状态观察者
class StateObserver {
  constructor(eventHandler) {
    this.eventHandler = eventHandler;
    this.subscriptions = new Map();
  }

  subscribe(path, callback) {
    if (!this.subscriptions.has(path)) {
      this.subscriptions.set(path, []);
    }
    this.subscriptions.get(path).push(callback);
  }

  onStateChange(path, oldValue, newValue) {
    const callbacks = this.subscriptions.get(path) || [];
    callbacks.forEach((callback) => {
      callback(oldValue, newValue, this.eventHandler.state);
    });
  }
}

// 消息生成器
class MessageGenerator {
  constructor(eventHandler) {
    this.eventHandler = eventHandler;
    this.observer = new StateObserver(eventHandler);
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    // 当行程数据更新时，生成行程消息
    this.observer.subscribe('currentItinerary', (oldValue, newValue, state) => {
      if (newValue && Object.keys(newValue).length > 0) {
        this.generateItineraryMessage(state);
      }
    });

    // 当预算数据更新时，生成预算消息
    this.observer.subscribe('budget', (oldValue, newValue, state) => {
      if (newValue && newValue.total) {
        this.generateBudgetMessage(state);
      }
    });

    // 当天气数据更新时，生成天气消息
    this.observer.subscribe('weather', (oldValue, newValue, state) => {
      if (newValue && Object.keys(newValue).length > 0) {
        this.generateWeatherMessage(state);
      }
    });

    // 当景点数据更新时，生成景点消息
    this.observer.subscribe('attractions', (oldValue, newValue, state) => {
      if (newValue && newValue.length > 0) {
        this.generateAttractionMessage(state);
      }
    });
  }

  generateItineraryMessage(state) {
    const messageId = `itinerary_${Date.now()}`;
    this.eventHandler.createTemplatedMessage('itinerary_summary', messageId);
  }

  generateBudgetMessage(state) {
    const messageId = `budget_${Date.now()}`;
    this.eventHandler.createTemplatedMessage('budget_breakdown', messageId);
  }

  generateWeatherMessage(state) {
    const messageId = `weather_${Date.now()}`;
    this.eventHandler.createTemplatedMessage('weather_report', messageId);
  }

  generateAttractionMessage(state) {
    const messageId = `attractions_${Date.now()}`;
    this.eventHandler.createTemplatedMessage('attraction_list', messageId);
  }
}

// 解耦的事件处理器
class DecoupledAGUIEventHandler {
  constructor() {
    // 应用状态 - 存储业务数据
    this.state = {
      // 会话信息
      runId: null,
      threadId: null,
      isRunning: false,
      currentStep: null,

      // 业务数据
      userPreferences: {},
      currentItinerary: {},
      completedSteps: [],
      pendingUserInput: false,
      requirements: null,
      attractions: null,
      weather: null,
      budget: null,

      // 历史会话信息
      sessionHistory: [],
      lastMessageId: null,
    };

    // 消息存储 - 存储对话消息
    this.messages = new Map();

    // 工具调用存储
    this.toolCalls = new Map();

    // 待处理输入
    this.pendingInputs = new Map();

    // UI组件引用
    this.ui = {
      messageContainer: null,
      progressBar: null,
      inputDialog: null,
      notificationContainer: null,
      statusIndicator: null,
      historyContainer: null,
    };

    // 消息模板
    this.messageTemplates = MESSAGE_TEMPLATES;

    // 状态观察者和消息生成器
    this.stateObserver = new StateObserver(this);
    this.messageGenerator = new MessageGenerator(this);
  }

  // 主要事件处理方法
  handleEvent(event) {
    console.log(`📨 处理事件: ${event.type}`, event);

    switch (event.type) {
      // 生命周期事件
      case 'RUN_STARTED':
        this.handleRunStarted(event);
        break;
      case 'RUN_FINISHED':
        this.handleRunFinished(event);
        break;
      case 'RUN_ERROR':
        this.handleRunError(event);
        break;

      // 步骤事件
      case 'STEP_STARTED':
        this.handleStepStarted(event);
        break;
      case 'STEP_FINISHED':
        this.handleStepFinished(event);
        break;

      // 文本消息事件
      case 'TEXT_MESSAGE_START':
        this.handleTextMessageStart(event);
        break;
      case 'TEXT_MESSAGE_CHUNK':
        this.handleTextMessageChunk(event);
        break;
      case 'TEXT_MESSAGE_END':
        this.handleTextMessageEnd(event);
        break;

      // 工具调用事件
      case 'TOOL_CALL_START':
        this.handleToolCallStart(event);
        break;
      case 'TOOL_CALL_ARGS':
        this.handleToolCallArgs(event);
        break;
      case 'TOOL_CALL_END':
        this.handleToolCallEnd(event);
        break;
      case 'TOOL_CALL_RESULT':
        this.handleToolCallResult(event);
        break;

      // 状态事件
      case 'STATE_SNAPSHOT':
        this.handleStateSnapshot(event);
        break;
      case 'STATE_DELTA':
        this.handleStateDelta(event);
        break;

      // 消息快照事件
      case 'MESSAGES_SNAPSHOT':
        this.handleMessagesSnapshot(event);
        break;

      // 自定义事件
      case 'CUSTOM':
        this.handleCustomEvent(event);
        break;

      default:
        console.warn(`⚠️ 未知事件类型: ${event.type}`);
    }
  }

  // 生命周期事件处理
  handleRunStarted(event) {
    this.state.isRunning = true;
    this.state.runId = event.runId;
    this.state.threadId = event.threadId;

    this.updateStatusIndicator('running', '正在处理...');
    this.showNotification('info', '开始处理您的请求');

    this.recordSessionEvent('session_started', {
      runId: event.runId,
      threadId: event.threadId,
      timestamp: Date.now(),
    });
  }

  handleRunFinished(event) {
    this.state.isRunning = false;

    this.updateStatusIndicator('completed', '处理完成');
    this.updateProgressBar(100);

    if (event.result) {
      this.showNotification('success', `处理完成！${this.formatResult(event.result)}`);
    }

    this.recordSessionEvent('session_finished', {
      result: event.result,
      timestamp: Date.now(),
    });
  }

  handleRunError(event) {
    this.state.isRunning = false;

    this.updateStatusIndicator('error', '处理失败');
    this.showNotification('error', `处理失败: ${event.message}`);

    this.addErrorMessage(event.message, event.code);

    this.recordSessionEvent('session_error', {
      error: event.message,
      code: event.code,
      timestamp: Date.now(),
    });
  }

  // 步骤事件处理
  handleStepStarted(event) {
    this.state.currentStep = event.stepName;
    this.updateStatusIndicator('running', `正在${event.stepName}...`);

    const stepProgress = this.calculateStepProgress(event.stepName);
    this.updateProgressBar(stepProgress);

    this.addStepIndicator(event.stepName, 'started');
  }

  handleStepFinished(event) {
    this.addStepIndicator(event.stepName, 'finished');

    if (!this.state.completedSteps) {
      this.state.completedSteps = [];
    }
    this.state.completedSteps.push(event.stepName);
  }

  // 文本消息事件处理
  handleTextMessageStart(event) {
    const { messageId } = event;

    const message = {
      id: messageId,
      role: event.role,
      content: '',
      timestamp: Date.now(),
      completed: false,
      toolCalls: [],
    };

    this.messages.set(messageId, message);
    this.state.lastMessageId = messageId;

    this.createMessageContainer(messageId, event.role);
  }

  handleTextMessageChunk(event) {
    const { messageId } = event;
    const message = this.messages.get(messageId);

    if (message) {
      message.content += event.delta;
      this.updateMessageContent(messageId, message.content);
    }
  }

  handleTextMessageEnd(event) {
    const { messageId } = event;
    const message = this.messages.get(messageId);

    if (message) {
      message.completed = true;
      this.finalizeMessage(messageId);

      this.recordSessionEvent('message_completed', {
        messageId,
        role: message.role,
        contentLength: message.content.length,
        timestamp: Date.now(),
      });
    }
  }

  // 工具调用事件处理
  handleToolCallStart(event) {
    const { toolCallId } = event;
    const toolCall = {
      id: toolCallId,
      name: event.toolCallName,
      status: 'running',
      startTime: Date.now(),
      parentMessageId: event.parentMessageId,
    };

    this.toolCalls.set(toolCallId, toolCall);

    if (event.parentMessageId) {
      const parentMessage = this.messages.get(event.parentMessageId);
      if (parentMessage) {
        parentMessage.toolCalls.push(toolCallId);
      }
    }

    this.addToolCallIndicator(toolCallId, event.toolCallName, 'started');
  }

  handleToolCallArgs(event) {
    const toolCall = this.toolCalls.get(event.toolCallId);
    if (toolCall) {
      toolCall.args = event.delta;
    }
  }

  handleToolCallEnd(event) {
    const toolCall = this.toolCalls.get(event.toolCallId);
    if (toolCall) {
      toolCall.status = 'completed';
      toolCall.endTime = Date.now();
      toolCall.duration = toolCall.endTime - toolCall.startTime;
    }

    this.updateToolCallIndicator(event.toolCallId, 'completed');
  }

  handleToolCallResult(event) {
    const toolCall = this.toolCalls.get(event.toolCallId);
    if (toolCall) {
      toolCall.result = event.content;
      toolCall.resultRole = event.role;
    }

    this.addToolCallResult(event.toolCallId, event.content);
  }

  // 状态事件处理
  handleStateSnapshot(event) {
    this.state = { ...this.state, ...event.snapshot };
    this.updateStateDisplay();
  }

  handleStateDelta(event) {
    event.delta.forEach((patch) => {
      const oldValue = this.getStateValue(patch.path);
      this.applyPatch(patch);
      const newValue = this.getStateValue(patch.path);

      // 通知观察者
      this.stateObserver.onStateChange(patch.path, oldValue, newValue);
    });

    this.updateStateDisplay();
  }

  handleMessagesSnapshot(event) {
    this.messages.clear();

    event.messages.forEach((msg) => {
      this.messages.set(msg.id, {
        ...msg,
        toolCalls: [],
      });
    });

    this.refreshMessageDisplay();
  }

  // 自定义事件处理
  handleCustomEvent(event) {
    switch (event.name) {
      case 'input_request':
        this.handleInputRequest(event.value);
        break;
      case 'stream_pause':
        this.handleStreamPause(event.value);
        break;
      case 'stream_resume':
        this.handleStreamResume(event.value);
        break;
      case 'system_notification':
        this.handleSystemNotification(event.value);
        break;
      case 'debug_info':
        this.handleDebugInfo(event.value);
        break;
      case 'generate_message':
        this.generateMessageFromTemplate(event.template, event.messageId);
        break;
      case 'update_message':
        this.updateMessageFromState(event.messageId, event.template);
        break;
      default:
        console.log(`📋 自定义事件: ${event.name}`, event.value);
    }
  }

  // 自定义事件的具体处理
  handleInputRequest(value) {
    const { requestId, prompt, options, type, required, timeout } = value;

    this.pendingInputs.set(requestId, {
      prompt,
      options,
      type,
      required,
      timeout,
      timestamp: Date.now(),
    });

    this.state.pendingUserInput = true;
    this.showInputDialog(requestId, prompt, options, type);
  }

  handleStreamPause() {
    this.updateStatusIndicator('paused', '等待用户输入...');
    this.showNotification('info', '请提供所需信息以继续');
  }

  handleStreamResume() {
    this.updateStatusIndicator('running', '继续处理...');
    this.showNotification('info', '已收到您的输入，继续处理中...');
    this.state.pendingUserInput = false;
  }

  handleSystemNotification(value) {
    this.showNotification(value.level, value.message, value.duration);
  }

  handleDebugInfo(value) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 调试信息 [${value.component}.${value.method}]:`, value.data);
    }
  }

  // 模板消息处理
  createTemplatedMessage(templateName, messageId) {
    const template = this.messageTemplates[templateName];
    if (!template) {
      console.error(`未知消息模板: ${templateName}`);
      return;
    }

    const content = template.render(this.state);

    const message = {
      id: messageId,
      role: 'assistant',
      content: this.renderTemplateContent(templateName, content),
      timestamp: Date.now(),
      completed: true,
      template: templateName,
      templateData: content,
      toolCalls: [],
    };

    this.messages.set(messageId, message);
    this.createMessageContainer(messageId, 'assistant');
    this.updateMessageContent(messageId, message.content);
  }

  generateMessageFromTemplate(templateName, messageId) {
    this.createTemplatedMessage(templateName, messageId);
  }

  updateMessageFromState(messageId, templateName) {
    const message = this.messages.get(messageId);
    if (!message || !message.template) return;

    const template = this.messageTemplates[templateName];
    if (!template) return;

    const content = template.render(this.state);
    message.content = this.renderTemplateContent(templateName, content);
    message.templateData = content;

    this.updateMessageContent(messageId, message.content);
  }

  renderTemplateContent(templateName, data) {
    switch (templateName) {
      case 'itinerary_summary':
        return this.renderItinerarySummary(data);
      case 'weather_report':
        return this.renderWeatherReport(data);
      case 'budget_breakdown':
        return this.renderBudgetBreakdown(data);
      case 'attraction_list':
        return this.renderAttractionList(data);
      default:
        return JSON.stringify(data);
    }
  }

  renderItinerarySummary(data) {
    let content = `**${data.title}**\n\n`;

    data.days.forEach(({ day, activities }) => {
      content += `**${day}行程：**\n`;
      activities.forEach((activity) => {
        content += `- ${activity}\n`;
      });
      content += '\n';
    });

    if (data.budget) {
      content += `**预算：${data.budget.total}元**\n\n`;
    }

    if (data.tips) {
      content += '**温馨提示：**\n';
      data.tips.forEach((tip) => {
        content += `${tip}\n`;
      });
    }

    return content;
  }

  renderWeatherReport(data) {
    let content = `**${data.city}天气预报：**\n\n`;

    data.forecast.forEach(({ day, condition, temp }) => {
      content += `**${day}：**${condition}，${temp}\n`;
    });

    if (data.recommendations) {
      content += '\n**出行建议：**\n';
      data.recommendations.forEach((rec) => {
        content += `- ${rec}\n`;
      });
    }

    return content;
  }

  renderBudgetBreakdown(data) {
    let content = `**预算明细：**\n\n`;

    data.categories.forEach((cat) => {
      content += `- ${cat.name}：${cat.amount}元\n`;
    });

    content += `\n**总计：${data.total}元**`;

    return content;
  }

  renderAttractionList(data) {
    let content = `**${data.city}景点推荐（共${data.totalCount}个）：**\n\n`;

    data.attractions.forEach((attraction, index) => {
      content += `**${index + 1}. ${attraction.name}**\n`;
      if (attraction.rating) {
        content += `   评分：${attraction.rating}⭐\n`;
      }
      if (attraction.price) {
        content += `   门票：${attraction.price}元\n`;
      }
      content += '\n';
    });

    return content;
  }

  // 辅助方法
  getStateValue(path) {
    const pathParts = path.substring(1).split('/');
    let current = this.state;

    for (const part of pathParts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  recordSessionEvent(eventType, data) {
    this.state.sessionHistory.push({
      type: eventType,
      data,
      timestamp: Date.now(),
    });
  }

  getMessageHistory() {
    return Array.from(this.messages.values())
      .filter((msg) => msg.completed)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  displayMessageHistory() {
    if (!this.ui.historyContainer) return;

    const history = this.getMessageHistory();

    this.ui.historyContainer.innerHTML = '';

    history.forEach((message) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `history-message ${message.role}`;
      messageDiv.innerHTML = `
        <div class="message-header">
          <span class="message-role">${this.formatRole(message.role)}</span>
          <span class="message-time">${this.formatTime(message.timestamp)}</span>
          ${message.template ? `<span class="message-template">[${message.template}]</span>` : ''}
        </div>
        <div class="message-content">${this.formatMessageContent(message.content)}</div>
        ${this.renderToolCalls(message.toolCalls)}
      `;

      this.ui.historyContainer.appendChild(messageDiv);
    });
  }

  renderToolCalls(toolCallIds) {
    if (!toolCallIds || toolCallIds.length === 0) return '';

    return toolCallIds
      .map((toolCallId) => {
        const toolCall = this.toolCalls.get(toolCallId);
        if (!toolCall) return '';

        return `
        <div class="tool-call-history">
          <div class="tool-name">🔧 ${toolCall.name}</div>
          ${toolCall.result ? `<div class="tool-result">${this.formatToolResult(toolCall.result)}</div>` : ''}
        </div>
      `;
      })
      .join('');
  }

  formatRole(role) {
    const roleMap = {
      user: '👤 用户',
      assistant: '🤖 助手',
      tool: '🔧 工具',
      system: '⚙️ 系统',
    };
    return roleMap[role] || role;
  }

  formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
  }

  // UI更新方法
  updateStatusIndicator(status, message) {
    if (this.ui.statusIndicator) {
      this.ui.statusIndicator.className = `status-indicator ${status}`;
      this.ui.statusIndicator.textContent = message;
    }
  }

  updateProgressBar(percentage) {
    if (this.ui.progressBar) {
      this.ui.progressBar.style.width = `${percentage}%`;
      this.ui.progressBar.setAttribute('aria-valuenow', percentage);
    }
  }

  showNotification(level, message, duration = 5000) {
    if (this.ui.notificationContainer) {
      const notification = document.createElement('div');
      notification.className = `notification ${level}`;
      notification.textContent = message;

      this.ui.notificationContainer.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, duration);
    }
  }

  createMessageContainer(messageId, role) {
    if (this.ui.messageContainer) {
      const messageDiv = document.createElement('div');
      messageDiv.id = `message-${messageId}`;
      messageDiv.className = `message ${role}`;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.id = `content-${messageId}`;

      messageDiv.appendChild(contentDiv);
      this.ui.messageContainer.appendChild(messageDiv);
    }
  }

  updateMessageContent(messageId, content) {
    const contentDiv = document.getElementById(`content-${messageId}`);
    if (contentDiv) {
      contentDiv.innerHTML = this.formatMessageContent(content);
    }
  }

  addStepIndicator(stepName, status) {
    if (this.ui.progressBar) {
      const stepDiv = document.createElement('div');
      stepDiv.className = `step-indicator ${status}`;
      stepDiv.textContent = stepName;
      this.ui.progressBar.appendChild(stepDiv);
    }
  }

  addToolCallIndicator(toolCallId, toolName, status) {
    if (this.ui.messageContainer) {
      const toolDiv = document.createElement('div');
      toolDiv.id = `tool-${toolCallId}`;
      toolDiv.className = `tool-call ${status}`;
      toolDiv.innerHTML = `
        <div class="tool-name">🔧 ${toolName}</div>
        <div class="tool-status">${status === 'started' ? '执行中...' : '已完成'}</div>
      `;
      this.ui.messageContainer.appendChild(toolDiv);
    }
  }

  updateToolCallIndicator(toolCallId, status) {
    const toolDiv = document.getElementById(`tool-${toolCallId}`);
    if (toolDiv) {
      toolDiv.className = `tool-call ${status}`;
      const statusDiv = toolDiv.querySelector('.tool-status');
      if (statusDiv) {
        statusDiv.textContent = status === 'completed' ? '已完成' : '执行中...';
      }
    }
  }

  addToolCallResult(toolCallId, content) {
    const toolDiv = document.getElementById(`tool-${toolCallId}`);
    if (toolDiv) {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'tool-result';
      resultDiv.innerHTML = `
        <div class="result-label">结果:</div>
        <div class="result-content">${this.formatToolResult(content)}</div>
      `;
      toolDiv.appendChild(resultDiv);
    }
  }

  showInputDialog(requestId, prompt, options, type) {
    if (this.ui.inputDialog) {
      this.ui.inputDialog.innerHTML = `
        <div class="dialog-content">
          <h3>${prompt}</h3>
          ${this.generateInputOptions(options, type)}
          <div class="dialog-actions">
            <button onclick="handleUserInput('${requestId}', 'cancel')">取消</button>
            <button onclick="handleUserInput('${requestId}', 'confirm')">确认</button>
          </div>
        </div>
      `;
      this.ui.inputDialog.style.display = 'block';
    }
  }

  calculateStepProgress(stepName) {
    const stepOrder = ['需求分析', '景点查询', '天气查询', '路线规划', '预算计算', '行程总结'];
    const stepIndex = stepOrder.indexOf(stepName);
    return stepIndex >= 0 ? ((stepIndex + 1) / stepOrder.length) * 100 : 0;
  }

  applyPatch(patch) {
    const path = patch.path.substring(1);
    const pathParts = path.split('/');
    let current = this.state;

    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }

    const lastPart = pathParts[pathParts.length - 1];

    switch (patch.op) {
      case 'add':
        current[lastPart] = patch.value;
        break;
      case 'replace':
        current[lastPart] = patch.value;
        break;
      case 'remove':
        delete current[lastPart];
        break;
    }
  }

  formatMessageContent(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  formatToolResult(content) {
    try {
      const data = JSON.parse(content);
      return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch {
      return content;
    }
  }

  formatResult(result) {
    if (result.totalSteps) {
      return `共完成 ${result.totalSteps} 个步骤`;
    }
    return '处理完成';
  }

  generateInputOptions(options, type) {
    if (type === 'select') {
      return `
        <select id="user-input-select">
          ${options.map((option) => `<option value="${option}">${option}</option>`).join('')}
        </select>
      `;
    }
    return `<input type="text" id="user-input-text" placeholder="请输入...">`;
  }

  updateStateDisplay() {
    console.log('📊 状态更新:', this.state);
  }

  refreshMessageDisplay() {
    console.log('💬 消息刷新:', this.messages);
    this.displayMessageHistory();
  }

  addErrorMessage(message, code) {
    if (this.ui.messageContainer) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'message error';
      errorDiv.innerHTML = `
        <div class="error-content">
          <div class="error-icon">❌</div>
          <div class="error-message">${message}</div>
          ${code ? `<div class="error-code">错误代码: ${code}</div>` : ''}
        </div>
      `;
      this.ui.messageContainer.appendChild(errorDiv);
    }
  }

  finalizeMessage(messageId) {
    const messageDiv = document.getElementById(`message-${messageId}`);
    if (messageDiv) {
      messageDiv.classList.add('completed');
    }
  }

  getStateSnapshot() {
    return {
      ...this.state,
      messages: this.getMessageHistory(),
      toolCalls: Array.from(this.toolCalls.values()),
    };
  }

  exportSessionData() {
    return {
      state: this.state,
      messages: this.getMessageHistory(),
      toolCalls: Array.from(this.toolCalls.values()),
      sessionHistory: this.state.sessionHistory,
      exportTime: Date.now(),
    };
  }
}

// 用户输入处理函数
window.handleUserInput = function (requestId, action) {
  const handler = window.aguiHandler;

  if (action === 'cancel') {
    handler.showNotification('warning', '操作已取消');
    handler.ui.inputDialog.style.display = 'none';
    return;
  }

  const selectElement = document.getElementById('user-input-select');
  const textElement = document.getElementById('user-input-text');

  let userInput;
  if (selectElement) {
    userInput = selectElement.value;
  } else if (textElement) {
    userInput = textElement.value;
  }

  if (!userInput) {
    handler.showNotification('error', '请输入有效信息');
    return;
  }

  handler.ui.inputDialog.style.display = 'none';
  handler.sendUserInput(requestId, userInput);
};

// 导出
export { DecoupledAGUIEventHandler, MESSAGE_TEMPLATES };
