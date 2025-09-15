import 'tdesign-web-components/chatbot';

import { Component, signal } from 'omi';
import { ChatStatus } from 'tdesign-web-components/chat-engine';

// 用户消息数据
const userMsgData = {
  role: 'user' as const,
  content: [
    {
      type: 'text' as const,
      data: '这是用来展示提问的测试内容',
    },
  ],
  status: 'complete' as const,
};

// AI消息数据
const aiMsgData = {
  role: 'assistant' as const,
  status: 'complete' as const,
  content: [
    {
      type: 'text' as const,
      data: '这是用来展示回答的测试内容',
    },
  ],
};

export default class BasicExample extends Component {
  inputValue = signal('输入内容');

  status = signal<ChatStatus>('idle');

  render() {
    return (
      <>
        {/* 用户消息 */}
        <t-chat-item
          variant="base"
          name="张三"
          placement="right"
          role={userMsgData.role}
          content={userMsgData.content}
          status={userMsgData.status}
        ></t-chat-item>

        {/* AI消息 */}
        <t-chat-item
          variant="text"
          animation="circle"
          placement="left"
          name="DeepSeek"
          role={aiMsgData.role}
          content={aiMsgData.content}
          status={aiMsgData.status}
        ></t-chat-item>

        {/* 系统消息 */}
        <t-chat-item
          role="system"
          content={[{ type: 'text', data: '这是系统消息' }]}
          status="complete"
          id="system-msg-1"
        ></t-chat-item>

        {/* 带头像的用户消息 */}
        <t-chat-item
          variant="base"
          avatar="https://tdesign.gtimg.com/site/avatar.jpg"
          name="张三"
          placement="right"
          role={userMsgData.role}
          content={userMsgData.content}
          status={userMsgData.status}
        ></t-chat-item>

        {/* 带头像的AI消息 */}
        <t-chat-item
          variant="outline"
          placement="left"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          role={aiMsgData.role}
          content={aiMsgData.content}
          status={aiMsgData.status}
        ></t-chat-item>

        {/* 加载中状态的AI消息 */}
        <t-chat-item
          variant="outline"
          placement="left"
          animation="skeleton"
          avatar="https://tdesign.gtimg.com/site/chat-avatar.png"
          name="DeepSeek"
          role="assistant"
          content={[]}
          status="pending"
          id="loading-msg"
        ></t-chat-item>
      </>
    );
  }
}
