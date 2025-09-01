import React, { useState } from 'react';
import { Video } from 'lucide-react';
import { useChatContext } from '../../contexts/ChatContext';

interface ZoomModalProps {
  onClose: () => void;
}

const ZoomModal: React.FC<ZoomModalProps> = ({ onClose }) => {
  const { currentGroup, createZoomMeeting } = useChatContext();
  const [zoomTitle, setZoomTitle] = useState('');
  const [zoomDescription, setZoomDescription] = useState('');
  const [zoomDuration, setZoomDuration] = useState(60);
  const [isCreatingZoom, setIsCreatingZoom] = useState(false);

  const handleCreateZoom = async () => {
    if (!currentGroup || !zoomTitle.trim()) return;
    
    setIsCreatingZoom(true);
    try {
      await createZoomMeeting(zoomTitle.trim(), zoomDuration, currentGroup.id, undefined, zoomDescription.trim());
      onClose();
    } catch (error) {
      console.error('Failed to create Zoom meeting:', error);
      alert('Zoomミーティングの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsCreatingZoom(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg p-6 m-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
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
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#222831' }}>
              ミーティング時間
            </label>
            <select
              value={zoomDuration}
              onChange={(e) => setZoomDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white"
              style={{
                borderColor: '#393E46',
                color: '#222831'
              }}
            >
              <option value={15}>15分</option>
              <option value={30}>30分</option>
              <option value={45}>45分</option>
              <option value={60}>60分</option>
            </select>
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
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export default ZoomModal;
