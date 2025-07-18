/**
 * 测试旅游行程规划Agent SSE端点
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

// 测试不同的场景
const scenarios = [
  { name: '正常行程规划', scenario: 'normal' },
  { name: '错误场景', scenario: 'error' },
  { name: '网络中断', scenario: 'network' },
  { name: '用户交互', scenario: 'interaction' },
];

async function testTravelAgent(scenario) {
  console.log(`\n🧪 测试场景: ${scenario.name}`);
  console.log('='.repeat(50));

  try {
    const response = await fetch(`${BASE_URL}/sse/travel-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scenario: scenario.scenario }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`✅ 连接成功，开始接收事件流...\n`);

    const reader = response.body;
    let eventCount = 0;
    const startTime = Date.now();

    for await (const chunk of reader) {
      const lines = chunk.toString().split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData = JSON.parse(line.slice(6));
            eventCount += 1;

            const timestamp = new Date(eventData.timestamp).toLocaleTimeString();
            console.log(`📡 [${timestamp}] ${eventData.type}: ${getEventSummary(eventData)}`);

            // 特殊事件的高亮显示
            if (eventData.type === 'RUN_ERROR') {
              console.log(`   ❌ 错误: ${eventData.data.error}`);
            } else if (eventData.type === 'RUN_FINISHED') {
              console.log(`   ✅ 完成: ${eventData.data.reason}`);
            } else if (eventData.type === 'TOOL_CALL_END') {
              console.log(`   🔧 工具调用完成: ${eventData.data.toolName}`);
            }
          } catch (parseError) {
            console.log(`⚠️  解析事件失败: ${line}`);
          }
        }
      }
    }

    const duration = Date.now() - startTime;
    console.log(`\n📊 统计信息:`);
    console.log(`   - 总事件数: ${eventCount}`);
    console.log(`   - 总耗时: ${duration}ms`);
    console.log(`   - 平均间隔: ${Math.round(duration / eventCount)}ms/事件`);
  } catch (error) {
    console.error(`❌ 测试失败: ${error.message}`);
  }
}

// 获取事件摘要
function getEventSummary(event) {
  switch (event.type) {
    case 'RUN_STARTED':
      return `开始运行 - ${event.data.prompt?.substring(0, 30)}...`;

    case 'STEP_STARTED':
      return `开始步骤 - ${event.data.stepName}`;

    case 'STEP_FINISHED':
      return `完成步骤 - ${event.data.stepName}`;

    case 'TEXT_MESSAGE_START':
      return `开始文本消息 - ${event.data.messageId}`;

    case 'TEXT_MESSAGE_CHUNK':
      return `文本块 - ${event.data.content?.substring(0, 50)}...`;

    case 'TEXT_MESSAGE_END':
      return `结束文本消息 - ${event.data.totalTokens} tokens`;

    case 'TOOL_CALL_START':
      return `开始工具调用 - ${event.data.toolName}`;

    case 'TOOL_CALL_CHUNK':
      return `工具参数 - ${JSON.stringify(event.data.input).substring(0, 50)}...`;

    case 'TOOL_CALL_END':
      return `结束工具调用 - ${event.data.toolName} (${event.data.success ? '成功' : '失败'})`;

    case 'STATE_SNAPSHOT':
      return `状态快照 - 版本 ${event.data.version}`;

    case 'STATE_DELTA':
      return `状态增量 - ${event.data.delta?.length || 0} 个操作`;

    case 'MESSAGES_SNAPSHOT':
      return `消息快照 - ${event.data.messages?.length || 0} 条消息`;

    case 'RAW':
      return `原始事件 - ${event.data.source}`;

    case 'CUSTOM':
      return `自定义事件 - ${event.data.name}`;

    case 'RUN_FINISHED':
      return `运行完成 - ${event.data.reason}`;

    case 'RUN_ERROR':
      return `运行错误 - ${event.data.error}`;

    default:
      return `未知事件类型`;
  }
}

// 主测试函数
async function runAllTests() {
  console.log('🚀 开始测试旅游行程规划Agent SSE端点');
  console.log(`📍 目标服务器: ${BASE_URL}`);
  console.log(`⏰ 开始时间: ${new Date().toLocaleString()}\n`);

  // eslint-disable-next-line no-await-in-loop
  for (const scenario of scenarios) {
    await testTravelAgent(scenario);

    // 场景间延迟
    if (scenario !== scenarios[scenarios.length - 1]) {
      console.log('\n⏳ 等待3秒后测试下一个场景...\n');
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
    }
  }

  console.log('\n🎉 所有测试完成！');
  console.log(`⏰ 结束时间: ${new Date().toLocaleString()}`);
}

// 运行测试
runAllTests().catch(console.error);
