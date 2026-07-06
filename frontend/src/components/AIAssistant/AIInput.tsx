// AIInput：底部输入框 + 发送按钮

import { useState, type KeyboardEvent } from 'react';
import { useI18n } from '../../i18n';

interface AIInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  streaming?: boolean;
  onStop?: () => void;
}

export function AIInput({ onSend, disabled, streaming, onStop }: AIInputProps) {
  const { t } = useI18n();
  const [value, setValue] = useState('');

  function submit() {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Enter 发送，Shift+Enter 换行
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="ai-input">
      <textarea
        className="ai-input-textarea"
        placeholder={t('ai.placeholder')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        aria-label={t('ai.placeholder')}
        disabled={disabled && !streaming}
      />
      {streaming ? (
        <button type="button" className="btn btn-ghost ai-input-stop" onClick={onStop}>
          {t('ai.close')}
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary ai-input-send"
          onClick={submit}
          disabled={disabled || !value.trim()}
        >
          {t('ai.send')}
        </button>
      )}
    </div>
  );
}
