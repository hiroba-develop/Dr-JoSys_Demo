import React from 'react';
import { Folder } from 'lucide-react';
import { ChatProvider } from '../contexts/ChatContext';
import FolderIntegration from '../components/Chat/FolderIntegration';

const Files: React.FC = () => {
  return (
    <ChatProvider>
      <div className="h-full flex flex-col" style={{ backgroundColor: '#EEEEEE' }}>
        {/* ページヘッダー */}
        <div className="flex-shrink-0 p-6 border-b" style={{ backgroundColor: 'white', borderColor: '#393E46' }}>
          <div className="flex items-center space-x-3">
            <Folder className="w-6 h-6" style={{ color: '#00ADB5' }} />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#222831' }}>ファイル共有</h1>
              <p className="text-sm mt-1" style={{ color: '#393E46' }}>
                外部フォルダと連携してファイルを共有・管理
              </p>
            </div>
          </div>
        </div>

        {/* ファイル管理エリア */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full rounded-lg border overflow-hidden" style={{ backgroundColor: 'white', borderColor: '#393E46' }}>
            <FolderIntegration className="h-full" />
          </div>
        </div>

        {/* 使い方ガイド（下部固定） */}
        <div className="flex-shrink-0 p-6 border-t" style={{ backgroundColor: 'white', borderColor: '#393E46' }}>
          <div className="rounded-lg p-4 border" style={{ backgroundColor: '#EEEEEE', borderColor: '#393E46' }}>
            <h2 className="text-base font-semibold mb-3" style={{ color: '#222831' }}>
              📋 ファイル共有の使い方
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 rounded-md border" style={{ backgroundColor: 'white', borderColor: '#00ADB5' }}>
                <h3 className="text-sm font-semibold mb-2 flex items-center" style={{ color: '#00ADB5' }}>
                  <span className="mr-2">🔗</span>
                  1. フォルダを接続
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#222831' }}>
                  Google Drive、Dropbox、OneDrive、ローカルフォルダから選択
                </p>
              </div>
              <div className="p-3 rounded-md border" style={{ backgroundColor: 'white', borderColor: '#00ADB5' }}>
                <h3 className="text-sm font-semibold mb-2 flex items-center" style={{ color: '#00ADB5' }}>
                  <span className="mr-2">📁</span>
                  2. ファイルを管理
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#222831' }}>
                  ダウンロードや外部アプリでの編集が可能
                </p>
              </div>
              <div className="p-3 rounded-md border" style={{ backgroundColor: 'white', borderColor: '#00ADB5' }}>
                <h3 className="text-sm font-semibold mb-2 flex items-center" style={{ color: '#00ADB5' }}>
                  <span className="mr-2">🔄</span>
                  3. 自動同期
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#222831' }}>
                  最新のファイル状況が自動的に反映
                </p>
              </div>
              <div className="p-3 rounded-md border" style={{ backgroundColor: 'white', borderColor: '#00ADB5' }}>
                <h3 className="text-sm font-semibold mb-2 flex items-center" style={{ color: '#00ADB5' }}>
                  <span className="mr-2">🔒</span>
                  4. セキュリティ
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#222831' }}>
                  すべてのアクセスは暗号化されて安全
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default Files;