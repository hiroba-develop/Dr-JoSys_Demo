import React, { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { Ticket, TicketStatus } from '../types';
import { Trash2 } from 'lucide-react';

export const Tasks: React.FC = () => {
  const initial = useMemo<Ticket[]>(() => {
    const saved = localStorage.getItem('drj-tasks');
    if (saved) return JSON.parse(saved);
    return [];
  }, []);
  const [tickets, setTickets] = useState<Ticket[]>(initial);
  const [filterDept, setFilterDept] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<Partial<Ticket>>({ priority: '中' });
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Ticket> | null>(null);

  const persist = (next: Ticket[]) => {
    setTickets(next);
    localStorage.setItem('drj-tasks', JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      if (filterDept && t.department !== filterDept) return false;
      if (filterAssignee && t.assignee !== filterAssignee) return false;
      if (filterQuery && !(t.title.includes(filterQuery) || t.description.includes(filterQuery))) return false;
      return true;
    });
  }, [tickets, filterDept, filterAssignee, filterQuery]);

  const create = () => {
    if (!draft.title?.trim()) return;
    const t: Ticket = {
      id: uuid(),
      title: draft.title!,
      description: draft.description || '',
      department: draft.department || '',
      assignee: draft.assignee || '',
      startDate: draft.startDate || '',
      dueDate: draft.dueDate || '',
      status: '未着手',
      priority: (draft.priority as any) || '中',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const next = [t, ...tickets];
    persist(next);
    setShowCreate(false);
    setDraft({ priority: '中' });
  };

  const update = () => {
    if (!editing || !editDraft) return;
    const next = tickets.map((t) => t.id === editing.id ? { ...editing, ...editDraft, updatedAt: new Date().toISOString() } : t);
    persist(next);
    setEditing(null);
    setEditDraft(null);
  };

  const remove = (id: string) => {
    const target = tickets.find(t => t.id === id);
    const title = target?.title || 'このタスク';
    if (!confirm(`${title}を削除しますか？`)) return;
    persist(tickets.filter(t => t.id !== id));
  };

  const setStatus = (id: string, status: TicketStatus) => persist(tickets.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));

  const onDropTo = (lane: TicketStatus, e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) setStatus(id, lane);
  };

  const Card: React.FC<{ t: Ticket }> = ({ t }) => (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', t.id)}
      onDoubleClick={() => { setEditing(t); setEditDraft({ ...t }); }}
      className="bg-white border border-border rounded p-2 shadow-sm relative"
    >
      <button
        className="absolute bottom-1 right-1 p-1 rounded hover:bg-sub2"
        title="削除"
        onClick={(e) => { e.stopPropagation(); remove(t.id); }}
      >
        <Trash2 size={16} />
      </button>
      <div className="font-medium">{t.title}</div>
      <div className="text-xs text-text/70">担当: {t.assignee || '-'} / 期限: {t.dueDate || '-'}</div>
    </div>
  );

  const Lane: React.FC<{ title: TicketStatus; items: Ticket[] }> = ({ title, items }) => (
    <div className="bg-sub2/40 rounded-md p-2 border border-border min-h-[300px]" onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDropTo(title, e)}>
      <div className="font-medium mb-2">{title}</div>
      <div className="space-y-2">
        {items.map((t) => <Card key={t.id} t={t} />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="card">
        <div className="card-header">表示条件</div>
        <div className="card-body grid md:grid-cols-4 gap-2">
          <input className="rounded border border-border px-3 py-2" placeholder="部署" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} />
          <input className="rounded border border-border px-3 py-2" placeholder="担当者" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)} />
          <input className="rounded border border-border px-3 py-2 md:col-span-2" placeholder="キーワード(タイトル/内容)" value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>ITタスク（かんばん）</span>
          <button className="btn-primary px-3 py-1" onClick={() => setShowCreate(true)}>タスクを登録</button>
        </div>
        <div className="card-body overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 min-w-[900px]">
            {(['未着手','作業中','確認待ち','完了'] as TicketStatus[]).map((lane) => (
              <Lane key={lane} title={lane} items={filtered.filter(t => t.status === lane)} />
            ))}
          </div>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-md border border-border p-4 w-full max-w-lg space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="font-medium">タスク登録</div>
            <div className="grid md:grid-cols-2 gap-2">
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">タイトル</span>
                <input className="rounded border border-border px-3 py-2" value={draft.title || ''} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">内容</span>
                <textarea className="rounded border border-border px-3 py-2" value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">部署</span>
                <input className="rounded border border-border px-3 py-2" value={draft.department || ''} onChange={(e) => setDraft({ ...draft, department: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">担当者</span>
                <input className="rounded border border-border px-3 py-2" value={draft.assignee || ''} onChange={(e) => setDraft({ ...draft, assignee: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">開始日</span>
                <input type="date" className="rounded border border-border px-3 py-2" value={draft.startDate || ''} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">期限日</span>
                <input type="date" className="rounded border border-border px-3 py-2" value={draft.dueDate || ''} onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })} />
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
        <div className="fixed inset-0 bg-black/20 grid place-items-center" onClick={() => { setEditing(null); setEditDraft(null); }}>
          <div className="bg-white rounded-md border border-border p-4 w-full max-w-lg space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="font-medium">タスク編集</div>
            <div className="grid md:grid-cols-2 gap-2">
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">タイトル</span>
                <input className="rounded border border-border px-3 py-2" value={editDraft.title as string} onChange={(e) => setEditDraft({ ...editDraft, title: e.target.value })} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">内容</span>
                <textarea className="rounded border border-border px-3 py-2" value={editDraft.description as string} onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">部署</span>
                <input className="rounded border border-border px-3 py-2" value={editDraft.department as string} onChange={(e) => setEditDraft({ ...editDraft, department: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">担当者</span>
                <input className="rounded border border-border px-3 py-2" value={editDraft.assignee as string} onChange={(e) => setEditDraft({ ...editDraft, assignee: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">開始日</span>
                <input type="date" className="rounded border border-border px-3 py-2" value={editDraft.startDate as string} onChange={(e) => setEditDraft({ ...editDraft, startDate: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">期限日</span>
                <input type="date" className="rounded border border-border px-3 py-2" value={editDraft.dueDate as string} onChange={(e) => setEditDraft({ ...editDraft, dueDate: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">ステータス</span>
                <select className="rounded border border-border px-3 py-2" value={editDraft.status as TicketStatus} onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value as TicketStatus })}>
                  <option value="未着手">未着手</option>
                  <option value="作業中">作業中</option>
                  <option value="確認待ち">確認待ち</option>
                  <option value="完了">完了</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded border border-border" onClick={() => { setEditing(null); setEditDraft(null); }}>キャンセル</button>
              <button className="btn-primary px-3 py-1" onClick={update}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


