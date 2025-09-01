import React, { useState, useRef } from 'react';
import { Send, Plus, Camera, Image, Video } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';
import { useDropzone } from 'react-dropzone';

interface MessageInputProps {
  onZoomButtonClick: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onZoomButtonClick }) => {
  const { currentGroup, sendMessage, uploadFile } = useChatContext();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || !currentGroup) return;
    
    setIsUploading(true);
    try {
      for (const file of acceptedFiles) {
        await uploadFile(file, currentGroup.id);
      }
    } catch (error) {
      console.error('Failed to upload files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentGroup || isLoading) return;

    const messageToSend = message.trim();
    
    // 楽観的UI更新: 即座に入力欄をクリアしてUIを更新
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px'; // 最小高さにリセット
      textareaRef.current.style.borderRadius = '24px'; // 角丸を維持
    }

    setIsLoading(true);
    try {
      await sendMessage(currentGroup.id, messageToSend);
    } catch (error) {
      console.error('Failed to send message:', error);
      // エラー時は入力内容を復元
      setMessage(messageToSend);
      // エラー通知を表示（実際のアプリではtoastなどを使用）
      alert('メッセージの送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // 自動リサイズ（最小・最大高さを考慮）
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 48; // min-h-[48px]と同じ
      const maxHeight = 128; // max-h-32と同じ
      
      const newHeight = Math.max(minHeight, Math.min(maxHeight, scrollHeight));
      textareaRef.current.style.height = `${newHeight}px`;
      
      // 角丸を維持
      textareaRef.current.style.borderRadius = '24px';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleZoomMenuClick = () => {
    setShowAttachMenu(false);
    onZoomButtonClick();
  };

  const triggerFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*,video/*,.pdf,.doc,.docx,.txt';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onDrop(Array.from(files));
      }
    };
    input.click();
    setShowAttachMenu(false);
  };

  if (!currentGroup) {
    return (
      <div className="p-4 border-t" style={{ backgroundColor: 'white', borderColor: '#393E46' }}>
        <p className="text-center text-sm" style={{ color: '#393E46' }}>
          グループを選択してください
        </p>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className="relative">
      <input {...getInputProps()} />
      
      {/* ドラッグオーバーレイ */}
      {isDragActive && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <Camera className="w-12 h-12 mx-auto mb-3" style={{ color: '#00ADB5' }} />
            <p className="font-medium" style={{ color: '#222831' }}>
              ファイルをドロップしてください
            </p>
          </div>
        </div>
      )}

      {/* 添付メニュー */}
      {showAttachMenu && (
        <div className="absolute bottom-16 left-4 bg-white rounded-lg shadow-lg border p-2"
          style={{ borderColor: '#393E46' }}
        >
          <button
            onClick={triggerFileUpload}
            className="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Image className="w-5 h-5" style={{ color: '#00ADB5' }} />
            <span className="text-sm" style={{ color: '#222831' }}>写真・ファイル</span>
          </button>
          <button
            onClick={handleZoomMenuClick}
            className="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Video className="w-5 h-5" style={{ color: '#00ADB5' }} />
            <span className="text-sm" style={{ color: '#222831' }}>Zoom会議</span>
          </button>
        </div>
      )}

      {/* 入力エリア */}
      <div className="p-4 border-t" style={{ backgroundColor: 'white', borderColor: '#393E46' }}>
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          {/* 添付ボタン */}
          <button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 rounded-full hover:opacity-80 transition-all flex-shrink-0"
            style={{ backgroundColor: '#393E46' }}
            disabled={isUploading}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>

          {/* テキスト入力 */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyPress={handleKeyPress}
              placeholder="メッセージを入力..."
              className="w-full pl-4 pr-16 py-3 border resize-none focus:outline-none focus:ring-2 min-h-[48px] max-h-32 overflow-y-auto"
              style={{
                borderColor: '#393E46',
                backgroundColor: '#EEEEEE',
                color: '#222831',
                borderRadius: '24px', // 固定の角丸
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#00ADB5';
                e.target.style.boxShadow = '0 0 0 2px rgba(0, 173, 181, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#393E46';
                e.target.style.boxShadow = 'none';
              }}
              rows={1}
              disabled={isLoading || isUploading}
            />

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={!message.trim() || isLoading || isUploading}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2.5 rounded-full hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              style={{ 
                backgroundColor: '#00ADB5',
                width: '40px',
                height: '40px',
              }}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </form>

        {/* ローディング表示 */}
        {(isLoading || isUploading) && (
          <div className="mt-3 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm" style={{ color: '#393E46' }}>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: '#00ADB5' }}></div>
              <span>
                {isUploading ? 'ファイルをアップロード中...' : '送信中...'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;