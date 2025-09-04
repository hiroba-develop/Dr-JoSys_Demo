import React, { useState } from 'react';

type Incident = { id: string; title: string; severity: '低' | '中' | '高'; status: '受付' | 'エスカレーション' | '対応中' | '完了' };

export const Ops: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [title, setTitle] = useState('');

  const add = () => {
    if (!title.trim()) return;
    setIncidents((prev) => [{ id: Math.random().toString(36).slice(2), title, severity: '中', status: '受付' }, ...prev]);
    setTitle('');
  };

  const setStatus = (id: string, status: Incident['status']) => setIncidents((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));

  const exportReport = () => {
    const lines = ['障害対応レポート'];
    incidents.forEach((i) => lines.push(`${i.id},${i.title},${i.severity},${i.status}`));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ops_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">障害受付</div>
        <div className="card-body flex gap-2">
          <input className="flex-1 rounded border border-border px-3 py-2" placeholder="障害内容" value={title} onChange={(e) => setTitle(e.target.value)} />
          <button className="btn-primary" onClick={add}>登録</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between"><span>対応状況</span><button className="btn-accent px-3 py-1" onClick={exportReport}>レポート出力</button></div>
        <div className="card-body space-y-2">
          {incidents.map((i) => (
            <div key={i.id} className="p-2 border border-border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-text/70">{i.status}</div>
              </div>
              <div className="space-x-2">
                <button className="btn-accent px-2 py-1" onClick={() => setStatus(i.id, 'エスカレーション')}>エスカレ</button>
                <button className="btn-primary px-2 py-1" onClick={() => setStatus(i.id, '対応中')}>対応中</button>
                <button className="px-2 py-1 rounded border border-border" onClick={() => setStatus(i.id, '完了')}>完了</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


