import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { AdviceMessage } from '../types';
import { Image as ImageIcon, Video } from 'lucide-react';

export const Advice: React.FC = () => {
  const [messages, setMessages] = useState<AdviceMessage[]>(() => {
    const now = Date.now();
    return [
      { id: uuid(), role: 'user', content: '社内Wi‑Fiが頻繁に切断されます。原因調査をお願いできますか？', createdAt: new Date(now - 58 * 60 * 1000).toISOString() },
      { id: uuid(), role: 'assistant', content: '発生端末・フロア・時間帯に傾向はありますか？他の方にも再現していますか？', createdAt: new Date(now - 57 * 60 * 1000).toISOString() },
      { id: uuid(), role: 'user', content: '3Fで10〜12時が多いです。数名のPCで発生しています。', createdAt: new Date(now - 56 * 60 * 1000).toISOString() },
      { id: uuid(), role: 'assistant', content: 'APのチャンネル干渉と台数上限を確認します。AP名や設置位置が分かれば共有ください。', createdAt: new Date(now - 55 * 60 * 1000).toISOString() },
      { id: uuid(), role: 'user', content: 'APは AP-3F-East / AP-3F-West です。ログも取得しました。', createdAt: new Date(now - 54 * 60 * 1000).toISOString() },
      { id: uuid(), role: 'assistant', content: 'ありがとうございます。まずは5GHz優先設定とチャンネル固定、送信出力の最適化を提案します。昼休みに適用でもよろしいですか？', createdAt: new Date(now - 52 * 60 * 1000).toISOString() },
      { id: uuid(), role: 'user', content: '問題ありません。適用をお願いします。', createdAt: new Date(now - 51 * 60 * 1000).toISOString() },
      { id: uuid(), role: 'assistant', content: '受付しました。担当が設定変更と検証を実施します。', createdAt: new Date(now - 50 * 60 * 1000).toISOString() },
    ];
  });
  const [input, setInput] = useState('');

  const send = () => {
    const content = input.trim();
    if (!content) return;
    const userMsg: AdviceMessage = { id: uuid(), role: 'user', content, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: uuid(), role: 'assistant', content: '受付しました。担当が確認します。', createdAt: new Date().toISOString() }]);
    }, 400);
  };

  const attachImage = (file: File) => {
    const name = file.name;
    const url = URL.createObjectURL(file);
    const userMsg: AdviceMessage = {
      id: uuid(),
      role: 'user',
      content: `[画像添付] ${name}`,
      createdAt: new Date().toISOString(),
      imageUrl: url,
      imageName: name,
    };
    setMessages((prev) => [...prev, userMsg]);
  };

  const issueZoomId = () => {
    const zoomId = Math.floor(100000000 + Math.random() * 900000000).toString();
    const msg: AdviceMessage = { id: uuid(), role: 'assistant', content: `ZoomミーティングIDを発行しました：${zoomId}`, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="grid grid-rows-[1fr_auto] h-[calc(100vh-7rem)] gap-3">
      <div className="card overflow-hidden">
        <div className="card-header">相談履歴</div>
        <div className="card-body space-y-2 max-h-[60vh] overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] ${m.role === 'user' ? 'ml-auto text-right' : ''}`}>
              <div className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-accent/60' : 'bg-sub2'}`}>
                <div>{m.content}</div>
                {m.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={m.imageUrl}
                      alt={m.imageName || 'attached image'}
                      className="max-h-64 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-body flex gap-2">
          <input className="flex-1 rounded-md border border-border px-3 py-2" placeholder="相談内容を入力..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
          <button className="btn-primary" onClick={send}>送信</button>
          <label className="px-3 py-2 rounded-md border border-border cursor-pointer" title="画像添付">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) attachImage(f); }} />
            <ImageIcon size={18} />
          </label>
          <button className="px-3 py-2 rounded-md border border-border" title="ZoomID発行" onClick={issueZoomId}><Video size={18} /></button>
        </div>
      </div>
      {/* FAQは専用ページへ移動 */}
    </div>
  );
};


