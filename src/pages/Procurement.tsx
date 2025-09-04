import React, { useState } from 'react';

type Request = {
  id: string;
  model: string;
  quantity: number;
  deadline: string;
  status: '受付中' | '見積中' | '進捗中' | '納品済';
};

export const Procurement: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [model, setModel] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [deadline, setDeadline] = useState('');

  const add = () => {
    if (!model.trim() || !deadline) return;
    setRequests((prev) => [{ id: Math.random().toString(36).slice(2), model, quantity, deadline, status: '受付中' }, ...prev]);
    setModel('');
    setQuantity(5);
    setDeadline('');
  };

  const setStatus = (id: string, status: Request['status']) => setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">調達申請</div>
        <div className="card-body grid md:grid-cols-4 gap-3 items-end">
          <label className="grid gap-1">
            <span className="text-sm">機種/仕様</span>
            <input className="rounded border border-border px-3 py-2" value={model} onChange={(e) => setModel(e.target.value)} placeholder="例) ノートPC i5/16GB/512GB" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">数量</span>
            <input type="number" className="rounded border border-border px-3 py-2" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">希望納期</span>
            <input type="date" className="rounded border border-border px-3 py-2" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </label>
          <button className="btn-primary" onClick={add}>申請</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">進捗・納期管理</div>
        <div className="card-body overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text/70">
                <th className="py-2">機種/仕様</th>
                <th>数量</th>
                <th>希望納期</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2">{r.model}</td>
                  <td>{r.quantity}</td>
                  <td>{r.deadline}</td>
                  <td>{r.status}</td>
                  <td className="space-x-2">
                    <button className="btn-accent px-2 py-1" onClick={() => setStatus(r.id, '見積中')}>見積中</button>
                    <button className="btn-primary px-2 py-1" onClick={() => setStatus(r.id, '進捗中')}>進捗中</button>
                    <button className="px-2 py-1 rounded border border-border" onClick={() => setStatus(r.id, '納品済')}>納品済</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


