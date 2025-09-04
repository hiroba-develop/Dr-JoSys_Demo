import React, { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { Ticket, TicketStatus } from '../types';

export const Helpdesk: React.FC = () => {
  const initial = useMemo<Ticket[]>(() => [
    { id: uuid(), title: 'VPNが切断される', description: '在宅勤務でVPNが不安定', status: '作業中', priority: '高', slaHours: 8, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: uuid(), title: 'プリンタ追加', description: '営業部にプリンタ追加', status: '未着手', priority: '中', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ], []);
  const [tickets, setTickets] = useState<Ticket[]>(initial);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'低' | '中' | '高'>('中');
  const [assignee, setAssignee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const createTicket = () => {
    if (!title.trim()) return;
    const t: Ticket = {
      id: uuid(),
      title,
      description,
      status: '未着手',
      priority,
      assignee: assignee || undefined,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTickets((prev) => [t, ...prev]);
    setTitle('');
    setDescription('');
    setAssignee('');
    setStartDate('');
    setDueDate('');
  };

  const setStatus = (id: string, status: TicketStatus) => setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t));

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>チケット作成</span>
          <button className="btn-primary px-3 py-1" onClick={createTicket}>作成</button>
        </div>
        <div className="card-body grid gap-2 md:grid-cols-6">
          <input className="rounded border border-border px-3 py-2 md:col-span-2" placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="rounded border border-border px-3 py-2 md:col-span-4" placeholder="内容" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="rounded border border-border px-3 py-2 md:col-span-2" placeholder="担当者" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
          <input type="date" className="rounded border border-border px-3 py-2 md:col-span-2" placeholder="開始日" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" className="rounded border border-border px-3 py-2 md:col-span-1" placeholder="期限日" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <select className="rounded border border-border px-3 py-2 md:col-span-1" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            <option value="低">低</option>
            <option value="中">中</option>
            <option value="高">高</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-header">チケット（カンバン）</div>
        <div className="card-body overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 min-w-[900px]">
            {(['未着手','作業中','確認待ち','完了'] as TicketStatus[]).map((lane) => (
              <KanbanLane key={lane} title={lane} tickets={tickets.filter(t => t.status === lane)} onDrop={(id) => setStatus(id, lane)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type LaneProps = { title: TicketStatus; tickets: Ticket[]; onDrop: (id: string) => void };
const KanbanLane: React.FC<LaneProps> = ({ title, tickets, onDrop }) => {
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onDrop(id);
  };

  return (
    <div className="bg-sub2/40 rounded-md p-2 border border-border min-h-[300px]" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="font-medium mb-2">{title}</div>
      <div className="space-y-2">
        {tickets.map((t) => (
          <KanbanCard key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  );
};

const KanbanCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', ticket.id);
  };
  return (
    <div draggable onDragStart={handleDragStart} className="bg-white border border-border rounded p-2 shadow-sm cursor-grab active:cursor-grabbing">
      <div className="font-medium">{ticket.title}</div>
      <div className="text-xs text-text/70">優先度: {ticket.priority} / 担当: {ticket.assignee || '-'} / 期間: {ticket.startDate || '-'} ~ {ticket.dueDate || '-'}</div>
      {ticket.description && <div className="text-sm mt-1 text-text/80">{ticket.description}</div>}
    </div>
  );
};


