import React, { useState } from 'react';
import { Plus, Hash, MessageCircle } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

const GroupList: React.FC = () => {
  const { groups, currentGroup, setCurrentGroup, createGroup } = useChatContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const group = await createGroup(newGroupName);
      setCurrentGroup(group);
      setIsCreating(false);
      setNewGroupName('');
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#EEEEEE' }}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: 'white', borderColor: '#393E46' }}>
        <h1 className="text-lg font-semibold" style={{ color: '#222831' }}>
          トーク
        </h1>
        <button
          onClick={() => setIsCreating(true)}
          className="p-2 rounded-full hover:opacity-80 transition-all"
          style={{ backgroundColor: '#00ADB5' }}
          title="新しいグループを作成"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* グループ作成モーダル */}
      {isCreating && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#222831' }}>
              新しいグループ
            </h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <input
                type="text"
                placeholder="グループ名を入力"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
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
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewGroupName('');
                  }}
                  className="px-4 py-2 text-sm rounded-md hover:opacity-80"
                  style={{ backgroundColor: '#393E46', color: 'white' }}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white rounded-md hover:opacity-80"
                  style={{ backgroundColor: '#00ADB5' }}
                >
                  作成
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* トーク一覧 */}
      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <MessageCircle className="w-16 h-16 mb-4" style={{ color: '#393E46', opacity: 0.6 }} />
            <p className="text-center mb-2" style={{ color: '#222831' }}>
              まだトークがありません
            </p>
            <p className="text-sm text-center mb-6" style={{ color: '#393E46' }}>
              新しいグループを作成してみましょう
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 text-white rounded-md font-medium hover:opacity-80"
              style={{ backgroundColor: '#00ADB5' }}
            >
              グループを作成
            </button>
          </div>
        ) : (
          <div>
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => setCurrentGroup(group)}
                className="flex items-center p-4 border-b cursor-pointer transition-all hover:opacity-80"
                style={{ 
                  backgroundColor: currentGroup?.id === group.id ? '#00ADB5' : 'white',
                  borderColor: '#393E46'
                }}
              >
                {/* グループアイコン */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                  style={{ 
                    backgroundColor: currentGroup?.id === group.id ? 'rgba(255,255,255,0.2)' : '#00ADB5'
                  }}
                >
                    <Hash className="w-6 h-6 text-white" />
                </div>

                {/* グループ情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate" 
                      style={{ 
                        color: currentGroup?.id === group.id ? 'white' : '#222831' 
                      }}
                    >
                      {group.name}
                    </h3>
                    {group.lastMessageAt && (
                      <span className="text-xs ml-2" 
                        style={{ 
                          color: currentGroup?.id === group.id ? 'rgba(255,255,255,0.8)' : '#393E46' 
                        }}
                      >
                        {formatDistanceToNow(group.lastMessageAt, { 
                          addSuffix: false, 
                          locale: ja 
                        })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm truncate" 
                      style={{ 
                        color: currentGroup?.id === group.id ? 'rgba(255,255,255,0.8)' : '#393E46' 
                      }}
                    >
                      {group.members.length}人が参加中
                    </p>
                    {group.unreadCount && group.unreadCount > 0 && (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center ml-2">
                        <span className="text-xs text-white font-bold">
                          {group.unreadCount > 9 ? '9+' : group.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;