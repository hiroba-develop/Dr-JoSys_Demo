import React from 'react';
import { MessageSquare, Users, Clock, ChevronRight } from 'lucide-react';
import type { ChatThread } from '../../types';
import { useChatContext } from '../../contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface ThreadListProps {
  className?: string;
}

const ThreadList: React.FC<ThreadListProps> = ({ className = '' }) => {
  const { threads, currentGroup, currentThread, setCurrentThread, messages } = useChatContext();

  // Filter threads for current group
  const groupThreads = threads.filter(thread => 
    currentGroup && thread.groupId === currentGroup.id
  );

  const getParentMessage = (parentMessageId: string) => {
    return messages.find(msg => msg.id === parentMessageId);
  };

  const getThreadPreview = (threadId: string) => {
    const threadMessages = messages.filter(msg => msg.threadId === threadId);
    const lastMessage = threadMessages[threadMessages.length - 1];
    return lastMessage?.content.slice(0, 50) + (lastMessage?.content.length > 50 ? '...' : '') || '';
  };

  if (!currentGroup) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
        <div className="p-4 text-center text-gray-500">
          グループを選択してください
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          スレッド
        </h2>
        {currentThread && (
          <button
            onClick={() => setCurrentThread(null)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
            メインチャットに戻る
          </button>
        )}
      </div>

      <div className="p-4">
        {groupThreads.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              まだスレッドがありません
            </p>
            <p className="text-xs text-gray-400 mt-1">
              メッセージの「スレッド作成」から作成できます
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {groupThreads.map((thread) => {
              const parentMessage = getParentMessage(thread.parentMessageId);
              const preview = getThreadPreview(thread.id);
              const isActive = currentThread?.id === thread.id;

              return (
                <div
                  key={thread.id}
                  onClick={() => setCurrentThread(thread)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-sm font-medium text-gray-900 flex-1">
                        {thread.title || `返信: ${parentMessage?.content.slice(0, 30)}...`}
                      </h3>
                      <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex-shrink-0">
                        {thread.messageCount}
                      </span>
                    </div>

                    {parentMessage && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        <span className="font-medium">{parentMessage.authorName}:</span>{' '}
                        {parentMessage.content.slice(0, 80)}
                        {parentMessage.content.length > 80 && '...'}
                      </div>
                    )}

                    {preview && (
                      <p className="text-xs text-gray-600">
                        最新: {preview}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(thread.lastMessageAt, { 
                          addSuffix: true, 
                          locale: ja 
                        })}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {thread.messageCount}件の返信
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadList;
