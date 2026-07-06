// MessageBubble：消息项
// 用户右侧、助手左侧，纯文本 + 头像 + 时间（不用气泡卡片）

import type { ChatMessage } from '../../api/types';

interface MessageBubbleProps {
  message: ChatMessage;
  streaming?: boolean; // 当前是否正在流式接收（仅助手最后一条）
}

export function MessageBubble({ message, streaming }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`msg ${isUser ? 'msg-user' : 'msg-assistant'}`}>
      <div className="msg-avatar" aria-hidden="true">
        {isUser ? <UserAvatar /> : <AIAvatar />}
      </div>
      <div className="msg-body">
        <div className="msg-meta">
          <span className="msg-role">{isUser ? 'You' : 'AI'}</span>
          <span className="msg-time">{time}</span>
        </div>
        <div className="msg-content">
          {message.content || (streaming ? <span className="msg-cursor" aria-label="thinking" /> : null)}
        </div>
      </div>
    </div>
  );
}

function UserAvatar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function AIAvatar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15l-1.6-4.2L6 9.2l4.4-1.6L12 3z" />
    </svg>
  );
}
