// AG-UI 路由测试脚本
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAguiEndpoint() {
  console.log('🧪 测试AG-UI端点...');

  try {
    // 测试完整版AG-UI事件流
    console.log('\n📡 测试完整版AG-UI事件流...');
    const response1 = await fetch(`${BASE_URL}/sse/agui`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '请帮我规划一次家庭聚会',
        simple: false,
      }),
    });

    if (response1.ok) {
      console.log('✅ 完整版AG-UI端点响应正常');

      // 读取流式响应
      const reader = response1.body;
      let eventCount = 0;

      for await (const chunk of reader) {
        const text = chunk.toString();
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              eventCount += 1;
              console.log(`📋 事件 ${eventCount}: ${data.type}`);

              // 只显示前5个事件
              if (eventCount >= 5) {
                console.log('... (更多事件省略)');
                break;
              }
            } catch (e) {
              // 忽略非JSON数据
            }
          }
        }

        if (eventCount >= 5) break;
      }
    } else {
      console.log('❌ 完整版AG-UI端点响应失败:', response1.status);
    }

    // 测试简化版AG-UI事件流
    console.log('\n📡 测试简化版AG-UI事件流...');
    const response2 = await fetch(`${BASE_URL}/sse/agui`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: '你好，请介绍一下AG-UI协议',
        simple: true,
      }),
    });

    if (response2.ok) {
      console.log('✅ 简化版AG-UI端点响应正常');

      // 读取流式响应
      const reader = response2.body;
      let eventCount = 0;

      for await (const chunk of reader) {
        const text = chunk.toString();
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              eventCount += 1;
              console.log(`📋 事件 ${eventCount}: ${data.type}`);
            } catch (e) {
              // 忽略非JSON数据
            }
          }
        }
      }

      console.log(`📊 总共接收到 ${eventCount} 个AG-UI事件`);
    } else {
      console.log('❌ 简化版AG-UI端点响应失败:', response2.status);
    }
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  testAguiEndpoint();
}

export { testAguiEndpoint };
