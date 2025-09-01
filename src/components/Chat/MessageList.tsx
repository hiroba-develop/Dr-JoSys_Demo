import React, { useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const MessageList: React.FC = () => {
  const { messages, currentGroup } = useChatContext();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredMessages = messages.filter(
    (message) => message.groupId === currentGroup?.id
  );

  if (!currentGroup) {
    return (
      <div className="flex items-center justify-center h-full" style={{ backgroundColor: '#EEEEEE' }}>
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#393E46', opacity: 0.6 }} />
          <p className="text-lg font-medium" style={{ color: '#222831' }}>
            グループを選択してください
          </p>
          <p className="text-sm mt-2" style={{ color: '#393E46' }}>
            左上のボタンからグループ一覧に戻れます
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#EEEEEE' }}>
      <div className="flex-1 overflow-y-auto p-4">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#393E46', opacity: 0.6 }} />
              <p className="text-lg font-medium" style={{ color: '#222831' }}>
                まだメッセージがありません
              </p>
              <p className="text-sm mt-2" style={{ color: '#393E46' }}>
                最初のメッセージを送ってみましょう
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message, index) => {
              const isOwnMessage = message.authorId === user?.id;
              const showDate = index === 0 || 
                format(message.timestamp, 'yyyy-MM-dd') !== 
                format(filteredMessages[index - 1].timestamp, 'yyyy-MM-dd');

              return (
                <div key={message.id}>
                  {/* 日付表示 */}
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="px-3 py-1 rounded-full text-xs"
                        style={{ backgroundColor: 'white', color: '#393E46', border: '1px solid #393E46' }}
                      >
                        {format(message.timestamp, 'M月d日(E)', { locale: ja })}
                      </span>
                    </div>
                  )}

                  {/* メッセージ */}
                  <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {/* 送信者名（自分以外） */}
                      {!isOwnMessage && (
                        <p className="text-xs mb-1 ml-2" style={{ color: '#393E46' }}>
                          {message.authorName}
                        </p>
                      )}

                      {/* メッセージバブル */}
                      <div className={`relative px-4 py-3 rounded-2xl ${
                        isOwnMessage 
                          ? 'rounded-br-md' 
                          : 'rounded-bl-md'
                      } ${message.isOptimistic ? 'opacity-70' : 'opacity-100'}`}
                        style={{
                          backgroundColor: isOwnMessage ? '#00ADB5' : 'white',
                          color: isOwnMessage ? 'white' : '#222831',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                          transition: 'opacity 0.3s ease'
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
                            {message.content}
                          </p>
                          {message.isOptimistic && (
                            <div className="ml-2 flex-shrink-0">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2"
                                style={{ borderColor: isOwnMessage ? 'white' : '#00ADB5' }}
                              ></div>
                            </div>
                          )}
                        </div>

                        {/* Zoomミーティングリンク */}
                        {message.zoomMeetingUrl && (
                          <div className="mt-3 pt-3 border-t border-opacity-20"
                            style={{ borderColor: isOwnMessage ? 'white' : '#393E46' }}
                          >
                            <button
                              onClick={() => window.open(message.zoomMeetingUrl, '_blank')}
                              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-all"
                              style={{ 
                                backgroundColor: isOwnMessage ? 'rgba(255,255,255,0.2)' : '#00ADB5',
                                color: isOwnMessage ? 'white' : 'white'
                              }}
                            >
                              <span>📹</span>
                              <span>Zoomミーティングに参加</span>
                            </button>
                          </div>
                        )}

                        {/* 添付ファイル */}
                        {message.attachments?.map((attachment, attachIndex) => (
                          <div key={attachIndex} className="mt-3 pt-3 border-t border-opacity-20"
                            style={{ borderColor: isOwnMessage ? 'white' : '#393E46' }}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">📎</span>
                              <span className="text-sm">{attachment.fileName}</span>
                            </div>
                          </div>
                        ))}

                        {/* 編集済み表示 */}
                        {message.edited && (
                          <p className={`text-xs mt-1 ${isOwnMessage ? 'opacity-80' : 'opacity-70'}`}>
                            (編集済み)
                          </p>
                        )}
                      </div>

                      {/* 時刻表示 */}
                      <p className={`text-xs mt-1 ${isOwnMessage ? 'text-right mr-2' : 'text-left ml-2'}`}
                        style={{ color: '#393E46' }}
                      >
                        {format(message.timestamp, 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;