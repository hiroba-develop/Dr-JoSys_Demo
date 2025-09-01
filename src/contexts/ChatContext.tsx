import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  type ChatMessage, 
  type ChatThread, 
  type ChatGroup, 
  type ChatAttachment,
  type ZoomMeeting,
  type ExternalFolder,
  type FolderItem
} from '../types';
import { useAuth } from './AuthContext';

interface ChatContextType {
  // Groups
  groups: ChatGroup[];
  currentGroup: ChatGroup | null;
  setCurrentGroup: (group: ChatGroup | null) => void;
  createGroup: (name: string, description?: string, isPrivate?: boolean) => Promise<ChatGroup>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  
  // Messages
  messages: ChatMessage[];
  sendMessage: (content: string, groupId: string, threadId?: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  
  // Threads
  threads: ChatThread[];
  currentThread: ChatThread | null;
  setCurrentThread: (thread: ChatThread | null) => void;
  createThread: (parentMessageId: string, groupId: string, title?: string) => Promise<ChatThread>;
  
  // Attachments
  uploadFile: (file: File, groupId: string, threadId?: string) => Promise<ChatAttachment>;
  
  // Zoom Integration
  createZoomMeeting: (topic: string, duration: number, groupId: string, scheduledFor?: Date, description?: string) => Promise<ZoomMeeting>;
  
  // External Folders
  folders: ExternalFolder[];
  connectFolder: (type: ExternalFolder['type'], name: string, path: string) => Promise<ExternalFolder>;
  getFolderItems: (folderId: string, parentFolderId?: string) => Promise<FolderItem[]>;
  
  // Loading states
  isLoading: boolean;
  isConnecting: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<ChatGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState<ChatGroup | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [currentThread, setCurrentThread] = useState<ChatThread | null>(null);
  const [folders, setFolders] = useState<ExternalFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize demo data
  useEffect(() => {
    if (user) {
      initializeDemoData();
    }
  }, [user]);

  const initializeDemoData = useCallback(() => {
    if (!user) return;

    // Demo groups
    const demoGroups: ChatGroup[] = [
      {
        id: 'group-1',
        name: '一般相談',
        description: '一般的な相談や質問はこちら',
        createdBy: user.id,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        members: [
          {
            userId: user.id,
            userName: user.name,
            userPicture: user.picture,
            role: 'admin',
            joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            lastReadAt: new Date()
          },
          {
            userId: 'advisor-1',
            userName: 'アドバイザー田中',
            role: 'member',
            joinedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            lastReadAt: new Date(Date.now() - 10 * 60 * 1000)
          }
        ],
        isPrivate: false,
        lastMessageAt: new Date(Date.now() - 30 * 60 * 1000),
        unreadCount: 2
      },
      {
        id: 'group-2',
        name: '財務相談',
        description: '財務・会計に関する専門相談',
        createdBy: 'advisor-2',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        members: [
          {
            userId: user.id,
            userName: user.name,
            userPicture: user.picture,
            role: 'member',
            joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            lastReadAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
          },
          {
            userId: 'advisor-2',
            userName: 'CFO佐藤',
            role: 'admin',
            joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            lastReadAt: new Date()
          }
        ],
        isPrivate: true,
        lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unreadCount: 0
      }
    ];

    // Demo messages
    const demoMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        content: 'こんにちは！新しい事業計画について相談したいのですが、どのような資料を準備すればよいでしょうか？',
        authorId: user.id,
        authorName: user.name,
        authorPicture: user.picture,
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        groupId: 'group-1'
      },
      {
        id: 'msg-2',
        content: 'こんにちは！事業計画書の作成でしたら、以下の資料をご準備いただけますでしょうか：\n\n1. 市場分析資料\n2. 競合分析\n3. 財務予測（3年分）\n4. リスク分析\n\n詳しくはZoomでお話ししましょう。',
        authorId: 'advisor-1',
        authorName: 'アドバイザー田中',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        groupId: 'group-1'
      },
      {
        id: 'msg-3',
        content: '財務予測について質問があります。売上の成長率はどのように算出すればよいでしょうか？',
        authorId: user.id,
        authorName: user.name,
        authorPicture: user.picture,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        groupId: 'group-2'
      }
    ];

    setGroups(demoGroups);
    setMessages(demoMessages);
    setCurrentGroup(demoGroups[0]);
  }, [user]);

  const createGroup = useCallback(async (name: string, description?: string, isPrivate = false): Promise<ChatGroup> => {
    if (!user) throw new Error('User not authenticated');

    const newGroup: ChatGroup = {
      id: uuidv4(),
      name,
      description,
      createdBy: user.id,
      createdAt: new Date(),
      members: [{
        userId: user.id,
        userName: user.name,
        userPicture: user.picture,
        role: 'admin',
        joinedAt: new Date(),
        lastReadAt: new Date()
      }],
      isPrivate,
      unreadCount: 0
    };

    setGroups(prev => [...prev, newGroup]);
    return newGroup;
  }, [user]);

  const joinGroup = useCallback(async (groupId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const isAlreadyMember = group.members.some(member => member.userId === user.id);
        if (!isAlreadyMember) {
          return {
            ...group,
            members: [...group.members, {
              userId: user.id,
              userName: user.name,
              userPicture: user.picture,
              role: 'member',
              joinedAt: new Date(),
              lastReadAt: new Date()
            }]
          };
        }
      }
      return group;
    }));
  }, [user]);

  const leaveGroup = useCallback(async (groupId: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          members: group.members.filter(member => member.userId !== user.id)
        };
      }
      return group;
    }));

    if (currentGroup?.id === groupId) {
      setCurrentGroup(null);
    }
  }, [user, currentGroup]);

  const sendMessage = useCallback(async (groupId: string, content: string, threadId?: string): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    const tempId = `temp-${Date.now()}`;
    const newMessage: ChatMessage = {
      id: tempId,
      content,
      authorId: user.id,
      authorName: user.name,
      authorPicture: user.picture,
      timestamp: new Date(),
      groupId,
      threadId,
      isOptimistic: true // 楽観的更新フラグ
    };

    // 楽観的UI更新: 即座にメッセージを表示
    setMessages(prev => [...prev, newMessage]);

    // Update group's last message time
    setGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          lastMessageAt: new Date()
        };
      }
      return group;
    }));

    // Update thread's last message time
    if (threadId) {
      setThreads(prev => prev.map(thread => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessageAt: new Date(),
            messageCount: thread.messageCount + 1
          };
        }
        return thread;
      }));
    }

    try {
      // サーバーに送信をシミュレート
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 成功時: 楽観的メッセージを実際のメッセージに置き換え
      const actualMessage: ChatMessage = {
        ...newMessage,
        id: uuidv4(), // 実際のサーバーからのID
        isOptimistic: false
      };

      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? actualMessage : msg
      ));

    } catch (error) {
      // 失敗時: 楽観的メッセージを削除
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      // グループの最終メッセージ時間をロールバック
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          const lastMessage = messages
            .filter(msg => msg.groupId === groupId && msg.id !== tempId)
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
          return {
            ...group,
            lastMessageAt: lastMessage?.timestamp
          };
        }
        return group;
      }));

      throw error;
    }
  }, [user, messages]);

  const editMessage = useCallback(async (messageId: string, newContent: string): Promise<void> => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          content: newContent,
          edited: true,
          editedAt: new Date()
        };
      }
      return message;
    }));
  }, []);

  const deleteMessage = useCallback(async (messageId: string): Promise<void> => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  }, []);

  const createThread = useCallback(async (parentMessageId: string, groupId: string, title?: string): Promise<ChatThread> => {
    const newThread: ChatThread = {
      id: uuidv4(),
      parentMessageId,
      groupId,
      title,
      createdAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0
    };

    setThreads(prev => [...prev, newThread]);
    return newThread;
  }, []);

  const uploadFile = useCallback(async (file: File, groupId: string, threadId?: string): Promise<ChatAttachment> => {
    setIsLoading(true);
    
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      const attachment: ChatAttachment = {
        id: uuidv4(),
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date()
      };

      // Create message with attachment
      const newMessage: ChatMessage = {
        id: uuidv4(),
        content: `ファイルをアップロードしました: ${file.name}`,
        authorId: user!.id,
        authorName: user!.name,
        authorPicture: user!.picture,
        timestamp: new Date(),
        groupId,
        threadId,
        attachments: [attachment]
      };

      setMessages(prev => [...prev, newMessage]);
      return attachment;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const createZoomMeeting = useCallback(async (topic: string, duration: number, groupId: string, scheduledFor?: Date, description?: string): Promise<ZoomMeeting> => {
    if (!user) throw new Error('User not authenticated');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const meetingId = Math.random().toString().slice(2, 12);
    const password = Math.random().toString(36).slice(2, 8).toUpperCase();
    
    const meeting: ZoomMeeting = {
      id: uuidv4(),
      meetingId,
      password,
      joinUrl: `https://zoom.us/j/${meetingId}?pwd=${password}`,
      startUrl: `https://zoom.us/s/${meetingId}?pwd=${password}`,
      createdBy: user.id,
      createdAt: new Date(),
      topic,
      duration,
      scheduledFor
    };

    // Create formatted message with Zoom details
    let messageContent = `📹 Zoomミーティングを作成しました\n\n`;
    messageContent += `🏷️ **タイトル:** ${topic}\n`;
    if (description && description.trim()) {
      messageContent += `📝 **概要:** ${description.trim()}\n`;
    }
    messageContent += `⏰ **時間:** ${duration}分\n\n`;
    messageContent += `🔗 **参加情報:**\n`;
    messageContent += `・ミーティングID: ${meetingId}\n`;
    messageContent += `・パスワード: ${password}\n`;
    messageContent += `・参加URL: ${meeting.joinUrl}\n\n`;
    messageContent += `💡 上記の「Zoomミーティングに参加」ボタンからワンクリックで参加できます`;

    const newMessage: ChatMessage = {
      id: uuidv4(),
      content: messageContent,
      authorId: user.id,
      authorName: user.name,
      authorPicture: user.picture,
      timestamp: new Date(),
      groupId,
      zoomMeetingUrl: meeting.joinUrl
    };

    setMessages(prev => [...prev, newMessage]);
    return meeting;
  }, [user]);

  const connectFolder = useCallback(async (type: ExternalFolder['type'], name: string, path: string): Promise<ExternalFolder> => {
    if (!user) throw new Error('User not authenticated');

    setIsConnecting(true);
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 3000));

      const folder: ExternalFolder = {
        id: uuidv4(),
        name,
        path,
        type,
        connectedBy: user.id,
        connectedAt: new Date(),
        lastSyncAt: new Date()
      };

      setFolders(prev => [...prev, folder]);
      return folder;
    } finally {
      setIsConnecting(false);
    }
  }, [user]);

  const getFolderItems = useCallback(async (parentFolderId?: string): Promise<FolderItem[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Demo folder items
    const demoItems: FolderItem[] = [
      {
        id: uuidv4(),
        name: 'プレゼンテーション資料.pptx',
        type: 'file',
        size: 2048576,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        modifiedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        parentFolderId
      },
      {
        id: uuidv4(),
        name: '財務データ',
        type: 'folder',
        modifiedAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        parentFolderId
      },
      {
        id: uuidv4(),
        name: '会議議事録.docx',
        type: 'file',
        size: 512000,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        modifiedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
        parentFolderId
      }
    ];

    return demoItems;
  }, []);

  const value: ChatContextType = {
    groups,
    currentGroup,
    setCurrentGroup,
    createGroup,
    joinGroup,
    leaveGroup,
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    threads,
    currentThread,
    setCurrentThread,
    createThread,
    uploadFile,
    createZoomMeeting,
    folders,
    connectFolder,
    getFolderItems,
    isLoading,
    isConnecting
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
