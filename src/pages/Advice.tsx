import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { AdviceMessage } from '../types';
import { Paperclip, Image as ImageIcon, Video } from 'lucide-react';

export const Advice: React.FC = () => {
  const [messages, setMessages] = useState<AdviceMessage[]>(() => {
    return [
      { id: uuid(), role: 'assistant', content: 'どのようなIT課題でお困りですか？', createdAt: new Date().toISOString() },
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

  const attachFile = (file: File) => {
    const name = file.name;
    const userMsg: AdviceMessage = { id: uuid(), role: 'user', content: `[ファイル添付] ${name}`, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
  };

  const attachImage = (file: File) => {
    const name = file.name;
    const userMsg: AdviceMessage = { id: uuid(), role: 'user', content: `[画像添付] ${name}`, createdAt: new Date().toISOString() };
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
              <div className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-accent' : 'bg-sub2'}`}>{m.content}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-body flex gap-2">
          <input className="flex-1 rounded-md border border-border px-3 py-2" placeholder="相談内容を入力..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} />
          <button className="btn-primary" onClick={send}>送信</button>
          <label className="px-3 py-2 rounded-md border border-border cursor-pointer" title="ファイル添付">
            <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) attachFile(f); }} />
            <Paperclip size={18} />
          </label>
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


