import React, { useEffect, useMemo, useState } from 'react';
import type { ServiceAsset } from '../types';

export const ServiceAssets: React.FC = () => {
  const [items, setItems] = useState<ServiceAsset[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [department, setDepartment] = useState('');
  const [owner, setOwner] = useState('');
  const [reason, setReason] = useState('');

  const [editing, setEditing] = useState<ServiceAsset | null>(null);
  const [editDraft, setEditDraft] = useState<ServiceAsset | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<Partial<ServiceAsset>>({});

  useEffect(() => {
    const prev: ServiceAsset[] = JSON.parse(localStorage.getItem('drj-service-assets') || '[]');
    setItems(prev);
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (serviceName && !i.serviceName.includes(serviceName)) return false;
      if (department && !i.department.includes(department)) return false;
      if (owner && !i.owner.includes(owner)) return false;
      if (reason && !i.reason.includes(reason)) return false;
      return true;
    });
  }, [items, serviceName, department, owner, reason]);

  const saveAll = (next: ServiceAsset[]) => {
    setItems(next);
    localStorage.setItem('drj-service-assets', JSON.stringify(next));
  };

  const remove = (id: string) => {
    if (!confirm('削除してよろしいですか？')) return;
    const next = items.filter((x) => x.id !== id);
    saveAll(next);
  };

  const startEdit = (item: ServiceAsset) => {
    setEditing(item);
    setEditDraft({ ...item });
  };

  const applyEdit = () => {
    if (!editDraft) return;
    const next = items.map((x) => (x.id === editDraft.id ? editDraft : x));
    saveAll(next);
    setEditing(null);
    setEditDraft(null);
  };

  const create = () => {
    if (!draft.serviceName?.trim()) return;
    const item: ServiceAsset = {
      id: Math.random().toString(36).slice(2),
      serviceName: draft.serviceName!,
      department: draft.department || '',
      owner: draft.owner || '',
      reason: draft.reason || '',
    };
    const next = [item, ...items];
    saveAll(next);
    setShowCreate(false);
    setDraft({});
  };

  return (
    <div className="space-y-3">
      <div className="card">
        <div className="card-header">検索条件</div>
        <div className="card-body grid md:grid-cols-4 gap-2">
          <input className="rounded border border-border px-3 py-2" placeholder="サービス名" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
          <input className="rounded border border-border px-3 py-2" placeholder="利用部署" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <input className="rounded border border-border px-3 py-2" placeholder="責任者" value={owner} onChange={(e) => setOwner(e.target.value)} />
          <input className="rounded border border-border px-3 py-2" placeholder="加入理由" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>一覧</span>
          <button className="btn-primary px-3 py-1" onClick={() => setShowCreate(true)}>サービス登録</button>
        </div>
        <div className="card-body overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text-left text-text/70">
                <th className="py-2">サービス名</th>
                <th>利用部署</th>
                <th>責任者</th>
                <th>加入理由</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="py-2">{i.serviceName}</td>
                  <td>{i.department}</td>
                  <td>{i.owner}</td>
                  <td className="max-w-[300px] truncate" title={i.reason}>{i.reason}</td>
                  <td className="space-x-2">
                    <button className="px-2 py-1 rounded border border-border" onClick={() => startEdit(i)}>編集</button>
                    <button className="px-2 py-1 rounded border border-border" onClick={() => remove(i.id)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-md border border-border p-4 w-full max-w-lg space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="font-medium">サービス登録</div>
            <div className="grid md:grid-cols-2 gap-2">
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">サービス名</span>
                <input className="rounded border border-border px-3 py-2" value={draft.serviceName || ''} onChange={(e) => setDraft({ ...draft, serviceName: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">利用部署</span>
                <input className="rounded border border-border px-3 py-2" value={draft.department || ''} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">責任者</span>
                <input className="rounded border border-border px-3 py-2" value={draft.owner || ''} onChange={(e) => setDraft({ ...draft, owner: e.target.value })} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">加入理由</span>
                <textarea className="rounded border border-border px-3 py-2" value={draft.reason || ''} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded border border-border" onClick={() => setShowCreate(false)}>キャンセル</button>
              <button className="btn-primary px-3 py-1" onClick={create}>登録</button>
            </div>
          </div>
        </div>
      )}

      {editing && editDraft && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center">
          <div className="bg-white rounded-md border border-border p-4 w-full max-w-lg space-y-3">
            <div className="font-medium">編集</div>
            <div className="grid md:grid-cols-2 gap-2">
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">サービス名</span>
                <input className="rounded border border-border px-3 py-2" value={editDraft.serviceName} onChange={(e) => setEditDraft({ ...editDraft, serviceName: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">利用部署</span>
                <input className="rounded border border-border px-3 py-2" value={editDraft.department} onChange={(e) => setEditDraft({ ...editDraft, department: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">責任者</span>
                <input className="rounded border border-border px-3 py-2" value={editDraft.owner} onChange={(e) => setEditDraft({ ...editDraft, owner: e.target.value })} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">加入理由</span>
                <textarea className="rounded border border-border px-3 py-2" value={editDraft.reason} onChange={(e) => setEditDraft({ ...editDraft, reason: e.target.value })} />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded border border-border" onClick={() => { setEditing(null); setEditDraft(null); }}>キャンセル</button>
              <button className="btn-primary px-3 py-1" onClick={applyEdit}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


