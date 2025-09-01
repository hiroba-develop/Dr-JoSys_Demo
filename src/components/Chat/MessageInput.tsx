import React, { useState, useRef } from 'react';
import { Send, Plus, Camera, Image, Video } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';
import { useDropzone } from 'react-dropzone';

const MessageInput: React.FC = () => {
  const { currentGroup, sendMessage, createZoomMeeting, uploadFile } = useChatContext();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [zoomTitle, setZoomTitle] = useState('');
  const [zoomDescription, setZoomDescription] = useState('');
  const [isCreatingZoom, setIsCreatingZoom] = useState(false);
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

  const handleCreateZoom = async () => {
    if (!currentGroup || !zoomTitle.trim()) return;
    
    setIsCreatingZoom(true);
    try {
      await createZoomMeeting(zoomTitle.trim(), 60, currentGroup.id, undefined, zoomDescription.trim());
      setShowZoomModal(false);
      setShowAttachMenu(false);
      setZoomTitle('');
      setZoomDescription('');
    } catch (error) {
      console.error('Failed to create Zoom meeting:', error);
      alert('Zoomミーティングの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsCreatingZoom(false);
    }
  };

  const handleZoomMenuClick = () => {
    setShowAttachMenu(false);
    setShowZoomModal(true);
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

      {/* Zoomミーティング作成モーダル */}
      {showZoomModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#222831' }}>
              📹 Zoomミーティングを作成
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateZoom(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#222831' }}>
                  ミーティングタイトル <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例: 財務相談ミーティング"
                  value={zoomTitle}
                  onChange={(e) => setZoomTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ 
                    borderColor: '#393E46',
                    backgroundColor: 'white',
                    color: '#222831'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00ADB5';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 173, 181, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#393E46';
                    e.target.style.boxShadow = 'none';
                  }}
                  autoFocus
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#222831' }}>
                  相談概要（任意）
                </label>
                <textarea
                  placeholder="相談内容や議題を入力してください"
                  value={zoomDescription}
                  onChange={(e) => setZoomDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 resize-none"
                  style={{ 
                    borderColor: '#393E46',
                    backgroundColor: 'white',
                    color: '#222831'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#00ADB5';
                    e.target.style.boxShadow = '0 0 0 2px rgba(0, 173, 181, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#393E46';
                    e.target.style.boxShadow = 'none';
                  }}
                  rows={3}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3" style={{ backgroundColor: '#EEEEEE' }}>
                <p className="text-sm" style={{ color: '#393E46' }}>
                  💡 <strong>ミーティング設定:</strong>
                </p>
                <ul className="text-sm mt-1 space-y-1" style={{ color: '#393E46' }}>
                  <li>• 時間: 60分（デフォルト）</li>
                  <li>• 参加者: グループメンバー全員</li>
                  <li>• 録画: 利用可能</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowZoomModal(false);
                    setZoomTitle('');
                    setZoomDescription('');
                  }}
                  className="px-4 py-2 text-sm rounded-md hover:opacity-80 transition-all"
                  style={{ backgroundColor: '#393E46', color: 'white' }}
                  disabled={isCreatingZoom}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm text-white font-semibold rounded-md hover:opacity-80 transition-all disabled:opacity-50 flex items-center"
                  style={{ backgroundColor: '#00ADB5' }}
                  disabled={!zoomTitle.trim() || isCreatingZoom}
                >
                  {isCreatingZoom ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      作成中...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      発行する
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
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