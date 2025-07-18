/**
 * 测试使用 TravelAgentComplete 类的 SSE 端点
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testTravelAgentComplete() {
  console.log('🚀 测试 TravelAgentComplete SSE 端点...\n');

  try {
    // 测试完整的旅游规划流程
    console.log('📋 测试场景 1: 完整旅游规划流程');
    const response1 = await fetch(`${BASE_URL}/sse/travel-agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scenario: 'complete',
        userRequest: {
          destination: '上海',
          duration: 2,
          budget: 'high',
          interests: ['现代都市', '美食', '购物'],
        },
      }),
    });

    if (response1.ok) {
      console.log('✅ 请求成功，开始接收事件流...');

      const reader = response1.body;
      let eventCount = 0;

      for await (const chunk of reader) {
        const text = chunk.toString();
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6));
              eventCount += 1;

              console.log(`📤 事件 ${eventCount}: ${eventData.type}`);

              // 如果是用户交互事件，测试继续处理
              if (eventData.type === 'CUSTOM' && eventData.name === 'input_request') {
                console.log('🔄 检测到用户交互请求，测试继续处理...');
                // eslint-disable-next-line no-await-in-loop
                await testContinueProcessing(eventData.value.requestId, '确认并预订');
                break;
              }

              // 如果收到完成事件，结束测试
              if (eventData.type === 'RUN_FINISHED') {
                console.log('✅ 旅游规划流程完成');
                break;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } else {
      console.error('❌ 请求失败:', response1.status, response1.statusText);
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

async function testContinueProcessing(requestId, userInput) {
  console.log(`🔄 继续处理用户输入: ${userInput}`);

  try {
    const response = await fetch(`${BASE_URL}/sse/travel-agent/continue`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId,
        userInput,
      }),
    });

    if (response.ok) {
      console.log('✅ 继续处理请求成功');

      const reader = response.body;
      let eventCount = 0;

      for await (const chunk of reader) {
        const text = chunk.toString();
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6));
              eventCount += 1;

              console.log(`📤 继续事件 ${eventCount}: ${eventData.type}`);

              if (eventData.type === 'RUN_FINISHED') {
                console.log('✅ 继续处理完成');
                break;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } else {
      console.error('❌ 继续处理请求失败:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ 继续处理失败:', error.message);
  }
}

async function testDifferentScenarios() {
  console.log('\n📋 测试场景 2: 不同场景模式');

  const scenarios = [
    { name: '错误场景', scenario: 'error' },
    { name: '网络中断场景', scenario: 'network' },
    { name: '交互场景', scenario: 'interaction' },
    { name: '默认场景', scenario: 'default' },
  ];

  for (const { name, scenario } of scenarios) {
    console.log(`\n🔍 测试 ${name}...`);

    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(`${BASE_URL}/sse/travel-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenario }),
      });

      if (response.ok) {
        console.log(`✅ ${name} 请求成功`);

        // 简单读取几个事件
        const reader = response.body;
        let eventCount = 0;

        for await (const chunk of reader) {
          const text = chunk.toString();
          const lines = text.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.slice(6));
                eventCount += 1;

                if (eventCount <= 3) {
                  console.log(`  📤 事件 ${eventCount}: ${eventData.type}`);
                }

                if (eventCount >= 5) break;
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      } else {
        console.error(`❌ ${name} 请求失败:`, response.status);
      }
    } catch (error) {
      console.error(`❌ ${name} 测试失败:`, error.message);
    }
  }
}

// 运行测试
async function runTests() {
  console.log('🧪 开始 TravelAgentComplete SSE 端点测试\n');

  await testTravelAgentComplete();
  await testDifferentScenarios();

  console.log('\n🎉 测试完成！');
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { testTravelAgentComplete, testContinueProcessing, testDifferentScenarios };
