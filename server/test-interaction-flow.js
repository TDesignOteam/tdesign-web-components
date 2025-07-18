/**
 * 测试真实的用户交互流程
 * 演示AG-UI协议中的用户交互处理
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testUserInteractionFlow() {
  console.log('🚀 开始测试用户交互流程...\n');

  try {
    // 第一阶段：启动交互流程
    console.log('📡 第一阶段：启动交互流程');
    console.log('POST /sse/travel-agent (scenario: interaction)');

    const response1 = await fetch(`${BASE_URL}/sse/travel-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario: 'interaction',
      }),
    });

    if (!response1.ok) {
      throw new Error(`第一阶段请求失败: ${response1.status}`);
    }

    // 读取SSE响应
    const reader = response1.body.getReader();
    const decoder = new TextDecoder();
    let requestId = null;
    const events = [];

    console.log('📥 接收事件流...\n');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event = JSON.parse(line.slice(6));
            events.push(event);

            console.log(`📨 事件: ${event.type}`);

            // 提取requestId用于后续请求
            if (event.type === 'CUSTOM' && event.name === 'input_request') {
              requestId = event.value.requestId;
              console.log(`🔑 获取到requestId: ${requestId}`);
            }

            // 检查是否到达暂停点
            if (event.type === 'CUSTOM' && event.name === 'stream_pause') {
              console.log('⏸️  流已暂停，等待用户输入...\n');
              break;
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    console.log(`📊 第一阶段完成，共接收 ${events.length} 个事件`);
    console.log(`🔑 requestId: ${requestId}\n`);

    // 模拟用户思考时间
    console.log('⏳ 模拟用户思考时间...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 第二阶段：用户输入后继续
    console.log('📡 第二阶段：用户输入后继续');
    console.log('POST /sse/travel-agent/continue');

    const userInput = '商务酒店'; // 模拟用户选择
    console.log(`👤 用户选择: ${userInput}\n`);

    const response2 = await fetch(`${BASE_URL}/sse/travel-agent/continue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId,
        userInput,
      }),
    });

    if (!response2.ok) {
      throw new Error(`第二阶段请求失败: ${response2.status}`);
    }

    // 读取继续的事件流
    const reader2 = response2.body.getReader();
    const decoder2 = new TextDecoder();
    const continueEvents = [];

    console.log('📥 接收继续事件流...\n');

    while (true) {
      const { done, value } = await reader2.read();
      if (done) break;

      const chunk = decoder2.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const event = JSON.parse(line.slice(6));
            continueEvents.push(event);

            console.log(`📨 事件: ${event.type}`);

            // 检查是否完成
            if (event.type === 'RUN_FINISHED') {
              console.log('✅ 流程完成！');
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    console.log(`📊 第二阶段完成，共接收 ${continueEvents.length} 个事件`);
    console.log(`📈 总计事件数: ${events.length + continueEvents.length}\n`);

    // 打印事件摘要
    console.log('📋 事件摘要:');
    const allEvents = [...events, ...continueEvents];
    const eventCounts = {};

    allEvents.forEach((event) => {
      eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    });

    Object.entries(eventCounts).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} 次`);
    });

    console.log('\n🎉 用户交互流程测试完成！');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testUserInteractionFlow();
