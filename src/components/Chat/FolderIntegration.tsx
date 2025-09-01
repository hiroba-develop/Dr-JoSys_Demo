import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  Plus, 
  Cloud, 
  HardDrive, 
  Droplets, 
  RefreshCw,
  File,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  FolderOpen
} from 'lucide-react';
import type { ExternalFolder, FolderItem } from '../../types';
import { useChatContext } from '../../contexts/ChatContext';
import { formatDistanceToNow, format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface FolderIntegrationProps {
  className?: string;
}

const FolderIntegration: React.FC<FolderIntegrationProps> = ({ className = '' }) => {
  const { folders, connectFolder, getFolderItems, isConnecting } = useChatContext();
  const [isConnectingNew, setIsConnectingNew] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<ExternalFolder | null>(null);
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  const getFolderTypeIcon = (type: ExternalFolder['type']) => {
    switch (type) {
      case 'google_drive':
        return Cloud;
      case 'dropbox':
        return Droplets;
      case 'onedrive':
        return Cloud;
      case 'local':
        return HardDrive;
      default:
        return Folder;
    }
  };

  const getFolderTypeName = (type: ExternalFolder['type']) => {
    switch (type) {
      case 'google_drive':
        return 'Google Drive';
      case 'dropbox':
        return 'Dropbox';
      case 'onedrive':
        return 'OneDrive';
      case 'local':
        return 'ローカルフォルダ';
      default:
        return 'フォルダ';
    }
  };

  const handleConnectFolder = async (type: ExternalFolder['type']) => {
    const name = prompt(`${getFolderTypeName(type)}の名前を入力してください:`);
    if (!name) return;

    const path = prompt('フォルダパスを入力してください (デモ用):');
    if (!path) return;

    try {
      await connectFolder(type, name, path);
    } catch (error) {
      console.error('Failed to connect folder:', error);
    }
  };

  const loadFolderItems = async (folder: ExternalFolder, parentFolderId?: string) => {
    setIsLoadingItems(true);
    try {
      const items = await getFolderItems(folder.id, parentFolderId);
      setFolderItems(items);
    } catch (error) {
      console.error('Failed to load folder items:', error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const toggleFolderExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    if (selectedFolder) {
      loadFolderItems(selectedFolder);
    }
  }, [selectedFolder]);

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className} flex flex-col`}>
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Folder className="w-5 h-5 mr-2" />
            外部フォルダ連携
          </h2>
          <button
            onClick={() => setIsConnectingNew(true)}
            disabled={isConnecting}
            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
            title="新しいフォルダを接続"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isConnectingNew && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">フォルダを接続</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  handleConnectFolder('google_drive');
                  setIsConnectingNew(false);
                }}
                className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Cloud className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Google Drive</span>
              </button>
              <button
                onClick={() => {
                  handleConnectFolder('dropbox');
                  setIsConnectingNew(false);
                }}
                className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Droplets className="w-5 h-5 text-blue-600" />
                <span className="text-sm">Dropbox</span>
              </button>
              <button
                onClick={() => {
                  handleConnectFolder('onedrive');
                  setIsConnectingNew(false);
                }}
                className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Cloud className="w-5 h-5 text-green-500" />
                <span className="text-sm">OneDrive</span>
              </button>
              <button
                onClick={() => {
                  handleConnectFolder('local');
                  setIsConnectingNew(false);
                }}
                className="flex items-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <HardDrive className="w-5 h-5 text-gray-600" />
                <span className="text-sm">ローカル</span>
              </button>
            </div>
            <button
              onClick={() => setIsConnectingNew(false)}
              className="mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              キャンセル
            </button>
          </div>
        )}

        {isConnecting && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-700">フォルダを接続中...</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Folder List */}
          <div className="space-y-2">
            {folders.map((folder) => {
              const Icon = getFolderTypeIcon(folder.type);
              const isSelected = selectedFolder?.id === folder.id;
              const isExpanded = expandedFolders.has(folder.id);

              return (
                <div key={folder.id} className="border border-gray-200 rounded-lg">
                  <div
                    onClick={() => {
                      setSelectedFolder(isSelected ? null : folder);
                      toggleFolderExpanded(folder.id);
                    }}
                    className={`p-3 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {folder.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {getFolderTypeName(folder.type)} • {folder.path}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {folder.lastSyncAt && (
                          <span>
                            {formatDistanceToNow(folder.lastSyncAt, { 
                              addSuffix: true, 
                              locale: ja 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Folder Items */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {isLoadingItems ? (
                        <div className="p-4 text-center">
                          <RefreshCw className="w-5 h-5 text-gray-400 animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-500">読み込み中...</p>
                        </div>
                      ) : (
                        <div className="p-3 space-y-1">
                          {folderItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-2 rounded hover:bg-white transition-colors"
                            >
                              <div className="flex items-center space-x-2 flex-1 min-w-0">
                                {item.type === 'folder' ? (
                                  <FolderOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <File className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 truncate">
                                    {item.name}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    {item.size && (
                                      <span>{formatFileSize(item.size)}</span>
                                    )}
                                    <span>
                                      {format(item.modifiedAt, 'M月d日', { locale: ja })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {item.downloadUrl && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(item.downloadUrl, '_blank');
                                    }}
                                    className="p-1 text-gray-500 hover:text-blue-600"
                                    title="ダウンロード"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Open in external app
                                  }}
                                  className="p-1 text-gray-500 hover:text-blue-600"
                                  title="外部アプリで開く"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          {folderItems.length === 0 && (
                            <p className="text-center text-sm text-gray-500 py-4">
                              フォルダが空です
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {folders.length === 0 && !isConnectingNew && !isConnecting && (
            <div className="text-center py-8">
              <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">
                まだフォルダが接続されていません
              </p>
              <button
                onClick={() => setIsConnectingNew(true)}
                className="mt-2 text-blue-600 text-sm hover:text-blue-700"
              >
                最初のフォルダを接続する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderIntegration;
