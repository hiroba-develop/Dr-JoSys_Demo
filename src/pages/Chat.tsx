import React, { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { ChatProvider, useChatContext } from '../contexts/ChatContext';
import GroupList from '../components/Chat/GroupList';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import ZoomModal from '../components/Chat/ZoomModal';

const ChatContent: React.FC = () => {
  const { currentGroup, setCurrentGroup } = useChatContext();
  const [showGroupList, setShowGroupList] = useState(!currentGroup);
  const [showZoomModal, setShowZoomModal] = useState(false);

  // グループが選択されたらチャット画面に移行
  React.useEffect(() => {
    if (currentGroup) {
      setShowGroupList(false);
    }
  }, [currentGroup]);

  const handleBackToGroups = () => {
    setCurrentGroup(null);
    setShowGroupList(true);
  };

  const handleInviteMember = () => {
    // TODO: Implement member invitation logic
    console.log(`Inviting member to group: ${currentGroup?.name}`);
    alert(`${currentGroup?.name}にメンバーを招待します。（実装保留）`);
  };

  if (showGroupList) {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#EEEEEE' }}>
        <GroupList />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative" style={{ backgroundColor: '#EEEEEE' }}>
      {/* チャットヘッダー */}
      <div className="flex items-center p-3 border-b" style={{ backgroundColor: 'white', borderColor: '#393E46' }}>
        <button
          onClick={handleBackToGroups}
          className="p-2 mr-3 rounded-full hover:opacity-80 transition-all"
          style={{ backgroundColor: '#EEEEEE' }}
        >
          <ArrowLeft className="w-5 h-5" style={{ color: '#393E46' }} />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-base" style={{ color: '#222831' }}>
            {currentGroup?.name || 'チャット'}
          </h1>
          <p className="text-sm" style={{ color: '#393E46' }}>
            {currentGroup?.members.length}人
          </p>
        </div>
        
        {/* メンバー招待ボタン */}
        <button
          onClick={handleInviteMember}
          className="p-2 rounded-full hover:opacity-80 transition-all"
          style={{ backgroundColor: '#EEEEEE' }}
          title="メンバーを招待"
        >
          <UserPlus className="w-5 h-5" style={{ color: '#393E46' }} />
        </button>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-hidden">
        <MessageList />
      </div>

      {/* メッセージ入力エリア */}
      <MessageInput onZoomButtonClick={() => setShowZoomModal(true)} />

      {/* Zoom Modal */}
      {showZoomModal && <ZoomModal onClose={() => setShowZoomModal(false)} />}
    </div>
  );
};

const Chat: React.FC = () => {
  return (
    <ChatProvider>
      <ChatContent />
    </ChatProvider>
  );
};

export default Chat;