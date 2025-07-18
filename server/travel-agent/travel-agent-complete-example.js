/**
 * 完整的TravelAgent示例 - 包含所有AG-UI事件类型的最佳实践
 */

import { v4 as uuidv4 } from 'uuid';

class TravelAgentComplete {
  constructor() {
    this.runId = uuidv4();
    this.threadId = uuidv4();
    this.messageId = uuidv4();
    this.state = {
      userPreferences: {},
      currentItinerary: {},
      completedSteps: [],
      currentStep: null,
      pendingUserInput: false,
      requirements: null,
      attractions: null,
      weather: null,
      budget: null,
    };
  }

  // 发射事件的方法
  emit(eventType, data) {
    const event = {
      type: eventType,
      timestamp: Date.now(),
      ...data,
    };

    // 在实际应用中，这里会发送到SSE流
    console.log(`📤 发送事件: ${eventType}`, event);
    return event;
  }

  // 完整的旅游规划流程
  async planTrip(userRequest) {
    try {
      // 1. 生命周期事件 - 开始运行
      this.emit('RUN_STARTED', {
        threadId: this.threadId,
        runId: this.runId,
      });

      // 2. 初始状态快照
      this.emit('STATE_SNAPSHOT', {
        snapshot: { ...this.state },
      });

      // 3. 需求分析步骤
      await this.executeStep('需求分析', async () => {
        // 文本消息开始
        this.emit('TEXT_MESSAGE_START', {
          messageId: this.messageId,
          role: 'assistant',
        });

        // 流式文本内容
        const analysisText = '我正在分析您的旅游需求...\n\n';
        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: analysisText,
        });

        // 需求分析逻辑
        const requirements = await this.analyzeRequirements(userRequest);
        this.updateState({ requirements });

        // 文本消息结束
        this.emit('TEXT_MESSAGE_END', {
          messageId: this.messageId,
        });
      });

      // 4. 景点查询步骤（包含工具调用）
      await this.executeStep('景点查询', async () => {
        // 文本消息开始
        this.emit('TEXT_MESSAGE_START', {
          messageId: uuidv4(),
          role: 'assistant',
        });

        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: '正在查询景点信息...\n\n',
        });

        // 工具调用 - 查询景点
        const attractions = await this.executeToolCall('get_attractions', {
          city: this.state.requirements.city,
          category: this.state.requirements.interests,
          limit: 10,
          budget: this.state.requirements.budget,
        });

        this.updateState({ attractions });

        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: `找到 ${attractions.length} 个景点\n\n`,
        });

        this.emit('TEXT_MESSAGE_END', {
          messageId: this.messageId,
        });
      });

      // 5. 天气查询步骤（工具调用）
      await this.executeStep('天气查询', async () => {
        const weather = await this.executeToolCall('get_weather', {
          city: this.state.requirements.city,
          days: this.state.requirements.duration,
        });

        this.updateState({ weather });
      });

      // 6. 路线规划步骤
      await this.executeStep('路线规划', async () => {
        // 文本消息开始
        this.emit('TEXT_MESSAGE_START', {
          messageId: uuidv4(),
          role: 'assistant',
        });

        // 流式输出行程规划
        const itinerary = this.planRoute();
        this.updateState({ currentItinerary: itinerary });

        // 分块发送行程内容
        for (const [day, activities] of Object.entries(itinerary)) {
          this.emit('TEXT_MESSAGE_CHUNK', {
            messageId: this.messageId,
            role: 'assistant',
            delta: `**第${day}天行程：**\n`,
          });

          for (const activity of activities) {
            this.emit('TEXT_MESSAGE_CHUNK', {
              messageId: this.messageId,
              role: 'assistant',
              delta: `- ${activity}\n`,
            });
          }

          this.emit('TEXT_MESSAGE_CHUNK', {
            messageId: this.messageId,
            role: 'assistant',
            delta: '\n',
          });
        }

        this.emit('TEXT_MESSAGE_END', {
          messageId: this.messageId,
        });
      });

      // 7. 预算计算步骤（工具调用）
      await this.executeStep('预算计算', async () => {
        const budget = await this.executeToolCall('calculate_budget', {
          attractions: this.state.attractions,
          accommodation: this.state.requirements.accommodation,
          duration: this.state.requirements.duration,
          transportation: this.state.requirements.transportation,
        });

        this.updateState({ budget });
      });

      // 8. 用户交互检查（如果需要）
      if (this.needsUserConfirmation()) {
        await this.handleUserInteraction();
        return; // 暂停等待用户输入
      }

      // 9. 最终总结步骤
      await this.executeStep('行程总结', async () => {
        // 文本消息开始
        this.emit('TEXT_MESSAGE_START', {
          messageId: uuidv4(),
          role: 'assistant',
        });

        // 发送预算总结
        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: '**预算总结：**\n',
        });

        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: `- 景点门票：${this.state.budget.attractions}元\n`,
        });

        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: `- 住宿费用：${this.state.budget.accommodation}元\n`,
        });

        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: `- 餐饮费用：${this.state.budget.meals}元\n`,
        });

        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: `- 交通费用：${this.state.budget.transportation}元\n`,
        });

        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: `- **总计：${this.state.budget.total}元**\n\n`,
        });

        // 发送温馨提示
        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: '**温馨提示：**\n',
        });

        const tips = this.generateTips();
        for (const tip of tips) {
          this.emit('TEXT_MESSAGE_CHUNK', {
            messageId: this.messageId,
            role: 'assistant',
            delta: `${tip}\n`,
          });
        }

        this.emit('TEXT_MESSAGE_END', {
          messageId: this.messageId,
        });
      });

      // 10. 消息快照
      this.emit('MESSAGES_SNAPSHOT', {
        messages: this.generateMessageSnapshot(),
      });

      // 11. 生命周期事件 - 完成运行
      this.emit('RUN_FINISHED', {
        threadId: this.threadId,
        runId: this.runId,
        result: {
          totalSteps: this.state.completedSteps.length,
          generatedItinerary: true,
          totalCost: this.state.budget?.total,
          duration: this.state.requirements?.duration,
        },
      });
    } catch (error) {
      // 错误处理
      this.emit('RUN_ERROR', {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
      });
    }
  }

  // 执行步骤的通用方法
  async executeStep(stepName, stepHandler) {
    try {
      this.emit('STEP_STARTED', { stepName });

      const startTime = Date.now();
      await stepHandler();
      const duration = Date.now() - startTime;

      this.emit('STEP_FINISHED', { stepName });

      // 更新状态
      this.updateState({
        completedSteps: [...this.state.completedSteps, stepName],
        currentStep: null,
      });

      // 记录性能指标
      this.recordMetrics(stepName, duration);
    } catch (error) {
      this.emit('RUN_ERROR', {
        message: `步骤 ${stepName} 执行失败: ${error.message}`,
        code: 'STEP_FAILED',
      });
      throw error;
    }
  }

  // 执行工具调用的通用方法
  async executeToolCall(toolName, args) {
    const toolCallId = uuidv4();

    try {
      // 工具调用开始
      this.emit('TOOL_CALL_START', {
        toolCallId,
        toolCallName: toolName,
        parentMessageId: this.messageId,
      });

      // 发送参数（可选，用于调试）
      this.emit('TOOL_CALL_ARGS', {
        toolCallId,
        delta: JSON.stringify(args),
      });

      // 执行实际调用
      const result = await this.callExternalAPI(toolName, args);

      // 工具调用结束
      this.emit('TOOL_CALL_END', {
        toolCallId,
      });

      // 发送结果
      this.emit('TOOL_CALL_RESULT', {
        messageId: uuidv4(),
        toolCallId,
        content: JSON.stringify(result),
        role: 'tool',
      });

      return result;
    } catch (error) {
      // 错误处理
      this.emit('TOOL_CALL_END', {
        toolCallId,
      });

      this.emit('TOOL_CALL_RESULT', {
        messageId: uuidv4(),
        toolCallId,
        content: JSON.stringify({ error: error.message }),
        role: 'tool',
      });

      throw error;
    }
  }

  // 处理用户交互
  async handleUserInteraction() {
    const requestId = this.runId;

    // 请求用户输入
    this.emit('CUSTOM', {
      name: 'input_request',
      value: {
        requestId,
        prompt: '请确认您的行程安排：',
        options: ['确认并预订', '修改行程', '取消'],
        type: 'select',
        required: true,
        timeout: 300000,
      },
    });

    // 状态更新
    this.updateState({ pendingUserInput: true });

    // 流暂停信号
    this.emit('CUSTOM', {
      name: 'stream_pause',
      value: {
        reason: 'waiting_for_user_input',
        requestId,
        resumeEndpoint: '/sse/travel-agent/continue',
      },
    });
  }

  // 用户输入后继续处理
  async continueWithUserInput(userInput) {
    // 继续运行信号
    this.emit('CUSTOM', {
      name: 'stream_resume',
      value: {
        reason: 'user_input_received',
        requestId: this.runId,
        userInput,
      },
    });

    // 更新状态
    this.updateState({ pendingUserInput: false });

    // 根据用户输入继续处理
    if (userInput === '确认并预订') {
      await this.executeStep('预订确认', async () => {
        // 执行预订逻辑
        const booking = await this.executeToolCall('create_booking', {
          itinerary: this.state.currentItinerary,
          userPreferences: this.state.userPreferences,
        });

        this.emit('TEXT_MESSAGE_START', {
          messageId: uuidv4(),
          role: 'assistant',
        });

        this.emit('TEXT_MESSAGE_CHUNK', {
          messageId: this.messageId,
          role: 'assistant',
          delta: '预订成功！您的行程已确认。\n',
        });

        this.emit('TEXT_MESSAGE_END', {
          messageId: this.messageId,
        });
      });
    } else if (userInput === '修改行程') {
      // 处理修改逻辑
      this.emit('CUSTOM', {
        name: 'system_notification',
        value: {
          level: 'info',
          message: '即将进入行程修改模式...',
          duration: 3000,
        },
      });
    }
  }

  // 状态管理方法
  updateState(updates) {
    const delta = [];

    for (const [path, value] of Object.entries(updates)) {
      delta.push({
        op: 'replace',
        path: `/${path}`,
        value,
      });
    }

    // 更新本地状态
    Object.assign(this.state, updates);

    // 发送增量更新
    this.emit('STATE_DELTA', { delta });
  }

  // 生成消息快照
  generateMessageSnapshot() {
    return [
      {
        id: uuidv4(),
        role: 'user',
        content: '帮我规划一个3天的北京旅游行程',
      },
      {
        id: this.messageId,
        role: 'assistant',
        content: '完整的3天北京旅游行程规划...',
        toolCalls: [
          {
            id: uuidv4(),
            type: 'function',
            function: {
              name: 'get_attractions',
              arguments: JSON.stringify({ city: '北京' }),
            },
          },
        ],
      },
    ];
  }

  // 辅助方法
  async analyzeRequirements(userRequest) {
    // 模拟需求分析
    return {
      city: '北京',
      duration: 3,
      budget: 'medium',
      interests: ['历史文化', '美食'],
      accommodation: '商务酒店',
      transportation: '地铁+公交',
    };
  }

  planRoute() {
    return {
      day1: ['故宫博物院', '天安门广场', '王府井步行街'],
      day2: ['八达岭长城', '颐和园', '什刹海酒吧街'],
      day3: ['天坛公园', '南锣鼓巷', '后海'],
    };
  }

  generateTips() {
    return [
      '1. 建议提前在网上预订故宫门票',
      '2. 长城建议选择八达岭或慕田峪',
      '3. 准备舒适的步行鞋，每天步行量较大',
      '4. 注意查看天气预报，合理安排室内外景点',
    ];
  }

  needsUserConfirmation() {
    // 根据业务逻辑判断是否需要用户确认
    return this.state.budget?.total > 2000;
  }

  async callExternalAPI(toolName, args) {
    // 模拟外部API调用
    const delays = {
      get_attractions: 1000,
      get_weather: 500,
      calculate_budget: 800,
      create_booking: 1500,
    };

    await new Promise((resolve) => setTimeout(resolve, delays[toolName] || 1000));

    // 模拟返回数据
    const mockData = {
      get_attractions: [
        { name: '故宫', rating: 4.8, price: 60 },
        { name: '长城', rating: 4.9, price: 120 },
        { name: '天坛', rating: 4.7, price: 35 },
      ],
      get_weather: {
        day1: { condition: '晴天', temp: '15-25°C' },
        day2: { condition: '多云', temp: '12-22°C' },
        day3: { condition: '小雨', temp: '10-18°C' },
      },
      calculate_budget: {
        attractions: 275,
        accommodation: 600,
        meals: 300,
        transportation: 75,
        total: 1250,
      },
      create_booking: {
        bookingId: `BK${Date.now()}`,
        status: 'confirmed',
        totalAmount: 1250,
      },
    };

    return mockData[toolName] || {};
  }

  recordMetrics(stepName, duration) {
    // 记录性能指标
    console.log(`📊 步骤 ${stepName} 耗时: ${duration}ms`);
  }
}

// 使用示例
async function runCompleteExample() {
  const agent = new TravelAgentComplete();

  console.log('🚀 开始完整的旅游规划流程...\n');

  await agent.planTrip({
    destination: '北京',
    duration: 3,
    budget: 'medium',
    interests: ['历史文化', '美食'],
  });
}

// 导出
export { TravelAgentComplete, runCompleteExample };
