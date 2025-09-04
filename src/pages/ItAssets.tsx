import React, { useEffect, useMemo, useState } from 'react';
import type { ItAsset, ItAssetStatus, ItAssetType } from '../types';

export const ItAssets: React.FC = () => {
  const [items, setItems] = useState<ItAsset[]>([]);
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<ItAssetType | ''>('');
  const [status, setStatus] = useState<ItAssetStatus | ''>('');
  const [user, setUser] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const [editing, setEditing] = useState<ItAsset | null>(null);
  const [editDraft, setEditDraft] = useState<ItAsset | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<Partial<ItAsset>>({ type: 'PC', status: '新品' });

  useEffect(() => {
    const prev: ItAsset[] = JSON.parse(localStorage.getItem('drj-it-assets') || '[]');
    setItems(prev);
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (keyword && !(`${i.user} ${i.type}`.includes(keyword))) return false;
      if (type && i.type !== type) return false;
      if (status && i.status !== status) return false;
      if (user && !i.user.includes(user)) return false;
      if (from && i.purchaseDate < from) return false;
      if (to && i.purchaseDate > to) return false;
      return true;
    });
  }, [items, keyword, type, status, user, from, to]);

  const saveAll = (next: ItAsset[]) => {
    setItems(next);
    localStorage.setItem('drj-it-assets', JSON.stringify(next));
  };

  const remove = (id: string) => {
    if (!confirm('削除してよろしいですか？')) return;
    const next = items.filter((x) => x.id !== id);
    saveAll(next);
  };

  const startEdit = (item: ItAsset) => {
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
    if (!draft.user?.trim() || !draft.purchaseDate || draft.price === undefined) return;
    const item: ItAsset = {
      id: Math.random().toString(36).slice(2),
      type: (draft.type as ItAssetType) || 'PC',
      status: (draft.status as ItAssetStatus) || '新品',
      user: draft.user!,
      purchaseDate: draft.purchaseDate!,
      price: Number(draft.price) || 0,
    };
    const next = [item, ...items];
    saveAll(next);
    setShowCreate(false);
    setDraft({ type: 'PC', status: '新品' });
  };

  return (
    <div className="space-y-3">
      <div className="card">
        <div className="card-header">検索条件</div>
        <div className="card-body grid md:grid-cols-6 gap-2">
          <input className="rounded border border-border px-3 py-2 md:col-span-2" placeholder="キーワード" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <select className="rounded border border-border px-3 py-2" value={type} onChange={(e) => setType(e.target.value as ItAssetType | '')}>
            <option value="">種別(全て)</option>
            <option value="PC">PC</option>
            <option value="携帯">携帯</option>
            <option value="プリンター">プリンター</option>
            <option value="その他">その他</option>
          </select>
          <select className="rounded border border-border px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as ItAssetStatus | '')}>
            <option value="">状態(全て)</option>
            <option value="新品">新品</option>
            <option value="使用中">使用中</option>
            <option value="故障中">故障中</option>
          </select>
          <input className="rounded border border-border px-3 py-2" placeholder="使用者" value={user} onChange={(e) => setUser(e.target.value)} />
          <input type="date" className="rounded border border-border px-3 py-2" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" className="rounded border border-border px-3 py-2" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>一覧</span>
          <button className="btn-primary px-3 py-1" onClick={() => setShowCreate(true)}>機器登録</button>
        </div>
        <div className="card-body overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text左 text-text/70">
                <th className="py-2">種別</th>
                <th>状態</th>
                <th>使用者</th>
                <th>購入日</th>
                <th>金額</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="py-2">{i.type}</td>
                  <td>{i.status}</td>
                  <td>{i.user}</td>
                  <td>{i.purchaseDate}</td>
                  <td>{i.price.toLocaleString()}</td>
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
            <div className="font-medium">機器登録</div>
            <div className="grid md:grid-cols-2 gap-2">
              <label className="grid gap-1">
                <span className="text-sm">種別</span>
                <select className="rounded border border-border px-3 py-2" value={draft.type as ItAssetType} onChange={(e) => setDraft({ ...draft, type: e.target.value as ItAssetType })}>
                  <option value="PC">PC</option>
                  <option value="携帯">携帯</option>
                  <option value="プリンター">プリンター</option>
                  <option value="その他">その他</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm">状態</span>
                <select className="rounded border border-border px-3 py-2" value={draft.status as ItAssetStatus} onChange={(e) => setDraft({ ...draft, status: e.target.value as ItAssetStatus })}>
                  <option value="新品">新品</option>
                  <option value="使用中">使用中</option>
                  <option value="故障中">故障中</option>
                </select>
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">使用者</span>
                <input className="rounded border border-border px-3 py-2" value={draft.user || ''} onChange={(e) => setDraft({ ...draft, user: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">購入日</span>
                <input type="date" className="rounded border border-border px-3 py-2" value={draft.purchaseDate || ''} onChange={(e) => setDraft({ ...draft, purchaseDate: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">金額</span>
                <input type="number" className="rounded border border-border px-3 py-2" value={(draft.price as number) || 0} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) || 0 })} />
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
              <label className="grid gap-1">
                <span className="text-sm">種別</span>
                <select className="rounded border border-border px-3 py-2" value={editDraft.type} onChange={(e) => setEditDraft({ ...editDraft, type: e.target.value as ItAssetType })}>
                  <option value="PC">PC</option>
                  <option value="携帯">携帯</option>
                  <option value="プリンター">プリンター</option>
                  <option value="その他">その他</option>
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm">状態</span>
                <select className="rounded border border-border px-3 py-2" value={editDraft.status} onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value as ItAssetStatus })}>
                  <option value="新品">新品</option>
                  <option value="使用中">使用中</option>
                  <option value="故障中">故障中</option>
                </select>
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">使用者</span>
                <input className="rounded border border-border px-3 py-2" value={editDraft.user} onChange={(e) => setEditDraft({ ...editDraft, user: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">購入日</span>
                <input type="date" className="rounded border border-border px-3 py-2" value={editDraft.purchaseDate} onChange={(e) => setEditDraft({ ...editDraft, purchaseDate: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">金額</span>
                <input type="number" className="rounded border border-border px-3 py-2" value={editDraft.price} onChange={(e) => setEditDraft({ ...editDraft, price: Number(e.target.value) || 0 })} />
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


