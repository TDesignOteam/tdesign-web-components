import 'tdesign-web-components/chat-message';

import { Component } from 'omi';

import type { AIMessageContent, ChatMessagesData } from '../../chat-engine/type';

export default class ReasoningExample extends Component {
  // 模拟 AGUI 协议中的推理内容数据
  mockReasoningContent: AIMessageContent[] = [
    {
      type: 'text',
      data: '我需要为用户规划北京5日游行程，首先让我分析一下需要考虑的因素。',
    },
    {
      type: 'toolcall',
      data: {
        toolCallId: 'tool_weather_001',
        toolCallName: 'get_weather_forecast',
        args: '{"location": "北京", "days": 5}',
        result:
          '{"forecast": [{"date": "2024-01-15", "weather": "晴", "temp": "5-15°C"}, {"date": "2024-01-16", "weather": "多云", "temp": "3-12°C"}]}',
      },
      status: 'complete',
    },
    {
      type: 'text',
      data: '根据天气预报，接下来几天天气不错，适合户外活动。让我查询一下热门景点信息。',
    },
    {
      type: 'search',
      data: {
        title: '北京热门旅游景点推荐',
        references: [
          {
            title: '故宫博物院',
            url: 'https://example.com/gugong',
            content: '明清两代的皇家宫殿，世界文化遗产',
          },
          {
            title: '天安门广场',
            url: 'https://example.com/tiananmen',
            content: '世界最大的城市广场之一',
          },
          {
            title: '长城',
            url: 'https://example.com/changcheng',
            content: '万里长城，中华民族的象征',
          },
        ],
      },
      status: 'complete',
    },
    {
      type: 'text',
      data: '基于天气情况和景点信息，我来制定一个详细的5日游行程计划。',
    },
    {
      type: 'toolcall',
      data: {
        toolCallId: 'tool_itinerary_001',
        toolCallName: 'generate_itinerary',
        args: '{"destination": "北京", "days": 5, "interests": ["历史文化", "美食"], "weather": "晴好"}',
        result:
          '{"itinerary": {"day1": "故宫 + 天安门广场", "day2": "长城一日游", "day3": "颐和园 + 圆明园", "day4": "胡同游 + 美食街", "day5": "天坛 + 购物"}}',
      },
      status: 'complete',
    },
  ];

  mockMessages: ChatMessagesData[] = [
    {
      id: 'user-1',
      role: 'user',
      content: [
        {
          type: 'text',
          data: '请为我规划一个北京5日游行程',
        },
      ],
    },
    {
      id: 'assistant-1',
      role: 'assistant',
      status: 'complete',
      content: [
        {
          type: 'reasoning',
          data: this.mockReasoningContent,
          status: 'complete',
        },
        {
          type: 'markdown',
          data: `# 北京5日游行程规划

## 第一天：皇城文化之旅
- **上午**：故宫博物院（3小时）
- **下午**：天安门广场（1小时）
- **晚上**：王府井步行街

## 第二天：长城壮美之旅  
- **全天**：八达岭长城
- **建议**：早上7点出发，避开人流高峰

## 第三天：皇家园林之旅
- **上午**：颐和园（3小时）
- **下午**：圆明园遗址公园（2小时）

## 第四天：胡同文化之旅
- **上午**：南锣鼓巷胡同游
- **下午**：簋街美食体验
- **晚上**：什刹海夜景

## 第五天：祈福购物之旅
- **上午**：天坛公园（2小时）
- **下午**：前门大街购物

**温馨提示**：根据天气预报，未来几天天气晴好，适合户外活动，记得带好防晒用品！`,
        },
      ],
    },
  ];

  // 渲染工具调用的自定义插槽
  renderToolCallSlot = (toolCall: any, index: number) => {
    const isWeatherTool = toolCall.data.toolCallName === 'get_weather_forecast';
    const isItineraryTool = toolCall.data.toolCallName === 'generate_itinerary';

    if (isWeatherTool) {
      return (
        <div
          slot={`reasoning-toolcall-${index}`}
          style={{
            margin: '8px 0',
            padding: '12px',
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px', marginRight: '8px' }}>🌤️</span>
            <strong style={{ color: '#0ea5e9' }}>天气查询工具</strong>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            <strong>函数：</strong>
            {toolCall.data.toolCallName}
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            <strong>参数：</strong>
            <code
              style={{
                background: '#e2e8f0',
                padding: '2px 6px',
                borderRadius: '4px',
                marginLeft: '4px',
              }}
            >
              {toolCall.data.args}
            </code>
          </div>
          <div style={{ fontSize: '14px' }}>
            <strong style={{ color: '#059669' }}>结果：</strong>
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #22c55e',
                borderRadius: '4px',
                padding: '8px',
                marginTop: '4px',
                fontSize: '13px',
              }}
            >
              未来5天天气：晴天 5-15°C，多云 3-12°C，适合出行
            </div>
          </div>
        </div>
      );
    }

    if (isItineraryTool) {
      const result = JSON.parse(toolCall.data.result);
      return (
        <div
          slot={`reasoning-toolcall-${index}`}
          style={{
            margin: '8px 0',
            padding: '12px',
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            borderRadius: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px', marginRight: '8px' }}>📋</span>
            <strong style={{ color: '#f59e0b' }}>行程规划工具</strong>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            <strong>函数：</strong>
            {toolCall.data.toolCallName}
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
            <strong>参数：</strong>
            <code
              style={{
                background: '#e2e8f0',
                padding: '2px 6px',
                borderRadius: '4px',
                marginLeft: '4px',
              }}
            >
              {toolCall.data.args}
            </code>
          </div>
          <div style={{ fontSize: '14px' }}>
            <strong style={{ color: '#059669' }}>生成结果：</strong>
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #22c55e',
                borderRadius: '4px',
                padding: '8px',
                marginTop: '4px',
                fontSize: '13px',
              }}
            >
              {Object.entries(result.itinerary).map(([day, activity]) => (
                <div key={day}>
                  📅 {day.replace('day', '第').replace(/(\d+)/, '$1天')}：{activity}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // 渲染搜索结果的自定义插槽
  renderSearchSlot = (searchContent: any, index: number) => (
    <div
      slot={`reasoning-search-${index}`}
      style={{
        margin: '8px 0',
        padding: '12px',
        background: '#f3e8ff',
        border: '1px solid #a855f7',
        borderRadius: '6px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '16px', marginRight: '8px' }}>🔍</span>
        <strong style={{ color: '#a855f7' }}>搜索结果</strong>
      </div>
      <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
        <strong>搜索主题：</strong>
        {searchContent.data.title}
      </div>
      <div style={{ fontSize: '14px' }}>
        <strong>找到 {searchContent.data.references.length} 个相关结果：</strong>
        <div style={{ marginTop: '8px' }}>
          {searchContent.data.references.map((ref: any, refIndex: number) => (
            <div
              key={refIndex}
              style={{
                background: '#faf5ff',
                border: '1px solid #c084fc',
                borderRadius: '4px',
                padding: '6px 8px',
                marginBottom: '4px',
                fontSize: '13px',
              }}
            >
              <div style={{ fontWeight: 'bold', color: '#7c3aed' }}>{ref.title}</div>
              <div style={{ color: '#64748b', marginTop: '2px' }}>{ref.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  render() {
    return (
      <div style={{ padding: '20px', maxWidth: '800px' }}>
        <div style={{ marginTop: '20px' }}>
          {this.mockMessages.map((message) => (
            <t-chat-item
              key={message.id}
              message={message}
              name={message.role === 'user' ? '用户' : 'AI助手'}
              datetime="刚刚"
              chatContentProps={{
                reasoning: {
                  maxHeight: 400,
                  defaultCollapsed: false,
                },
              }}
            >
              {/* 动态渲染自定义插槽 */}
              {this.mockReasoningContent.map((content, index) => {
                if (content.type === 'toolcall') {
                  return this.renderToolCallSlot(content, index);
                }
                if (content.type === 'search') {
                  return this.renderSearchSlot(content, index);
                }
                return null;
              })}
            </t-chat-item>
          ))}
        </div>
      </div>
    );
  }
}
