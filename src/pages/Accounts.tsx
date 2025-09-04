import React, { useEffect, useMemo, useState } from 'react';
import type { Department } from '../types';

type Role = '管理者' | '一般';
type EmploymentType = '正社員' | '契約社員' | '派遣' | 'アルバイト' | '業務委託';
type AppUser = {
  id: string;
  name: string;
  email: string;
  departmentId?: string;
  joinedDate?: string; // YYYY-MM-DD
  role: Role;
  employmentType: EmploymentType;
};

export const Accounts: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [draft, setDraft] = useState<Partial<AppUser>>({ role: '一般', employmentType: '正社員' });

  const [editing, setEditing] = useState<AppUser | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<AppUser> | null>(null);

  useEffect(() => {
    try { setUsers(JSON.parse(localStorage.getItem('drj-users') || '[]')); } catch {}
    try { setDepartments(JSON.parse(localStorage.getItem('drj-company-depts') || '[]')); } catch {}
  }, []);

  const saveAll = (next: AppUser[]) => {
    setUsers(next);
    localStorage.setItem('drj-users', JSON.stringify(next));
  };

  const deptName = (id?: string) => departments.find(d => d.id === id)?.name || '-';

  const create = () => {
    if (!draft.name?.trim() || !draft.email?.trim()) return;
    const u: AppUser = {
      id: Math.random().toString(36).slice(2),
      name: draft.name!.trim(),
      email: draft.email!.trim(),
      departmentId: draft.departmentId || undefined,
      joinedDate: draft.joinedDate || undefined,
      role: (draft.role as Role) || '一般',
      employmentType: (draft.employmentType as EmploymentType) || '正社員',
    };
    const next = [u, ...users];
    saveAll(next);
    setShowCreate(false);
    setDraft({ role: '一般', employmentType: '正社員' });
  };

  const remove = (id: string) => {
    const target = users.find(u => u.id === id);
    const name = target?.name || 'このユーザー';
    if (!confirm(`${name}を削除しますか？`)) return;
    saveAll(users.filter(u => u.id !== id));
  };

  const startEdit = (u: AppUser) => { setEditing(u); setEditDraft({ ...u }); };
  const applyEdit = () => {
    if (!editing || !editDraft) return;
    if (!(editDraft.name as string)?.trim() || !(editDraft.email as string)?.trim()) return;
    const next = users.map(u => u.id === editing.id ? { ...editing, ...editDraft } as AppUser : u);
    saveAll(next);
    setEditing(null);
    setEditDraft(null);
  };

  const roleOptions: Role[] = ['一般', '管理者'];
  const empOptions: EmploymentType[] = ['正社員', '契約社員', '派遣', 'アルバイト', '業務委託'];

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <span>ユーザー一覧</span>
          <button className="btn-primary px-3 py-1" onClick={() => setShowCreate(true)}>ユーザー登録</button>
        </div>
        <div className="card-body overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="text-left text-text/70">
                <th className="py-2">名前</th>
                <th>メールアドレス</th>
                <th>部署</th>
                <th>入社日</th>
                <th>権限</th>
                <th>雇用形態</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{deptName(u.departmentId)}</td>
                  <td>{u.joinedDate || '-'}</td>
                  <td>{u.role}</td>
                  <td>{u.employmentType}</td>
                  <td className="space-x-2">
                    <button className="px-2 py-1 rounded border border-border" onClick={() => startEdit(u)}>編集</button>
                    <button className="px-2 py-1 rounded border border-border" onClick={() => remove(u.id)}>削除</button>
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
            <div className="font-medium">ユーザー登録</div>
            <div className="grid md:grid-cols-2 gap-2">
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">名前</span>
                <input className="rounded border border-border px-3 py-2" value={draft.name || ''} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">メールアドレス</span>
                <input type="email" className="rounded border border-border px-3 py-2" value={draft.email || ''} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">部署</span>
                <select className="rounded border border-border px-3 py-2" value={draft.departmentId || ''} onChange={(e) => setDraft({ ...draft, departmentId: e.target.value })}>
                  <option value="">未選択</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm">入社日</span>
                <input type="date" className="rounded border border-border px-3 py-2" value={draft.joinedDate || ''} onChange={(e) => setDraft({ ...draft, joinedDate: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">権限</span>
                <select className="rounded border border-border px-3 py-2" value={draft.role as Role} onChange={(e) => setDraft({ ...draft, role: e.target.value as Role })}>
                  {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm">雇用形態</span>
                <select className="rounded border border-border px-3 py-2" value={draft.employmentType as EmploymentType} onChange={(e) => setDraft({ ...draft, employmentType: e.target.value as EmploymentType })}>
                  {empOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
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
            <div className="font-medium">ユーザー編集</div>
            <div className="grid md:grid-cols-2 gap-2">
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">名前</span>
                <input className="rounded border border-border px-3 py-2" value={editDraft.name as string} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} />
              </label>
              <label className="grid gap-1 md:col-span-2">
                <span className="text-sm">メールアドレス</span>
                <input type="email" className="rounded border border-border px-3 py-2" value={editDraft.email as string} onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">部署</span>
                <select className="rounded border border-border px-3 py-2" value={(editDraft.departmentId as string) || ''} onChange={(e) => setEditDraft({ ...editDraft, departmentId: e.target.value })}>
                  <option value="">未選択</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm">入社日</span>
                <input type="date" className="rounded border border-border px-3 py-2" value={(editDraft.joinedDate as string) || ''} onChange={(e) => setEditDraft({ ...editDraft, joinedDate: e.target.value })} />
              </label>
              <label className="grid gap-1">
                <span className="text-sm">権限</span>
                <select className="rounded border border-border px-3 py-2" value={editDraft.role as Role} onChange={(e) => setEditDraft({ ...editDraft, role: e.target.value as Role })}>
                  {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
              <label className="grid gap-1">
                <span className="text-sm">雇用形態</span>
                <select className="rounded border border-border px-3 py-2" value={editDraft.employmentType as EmploymentType} onChange={(e) => setEditDraft({ ...editDraft, employmentType: e.target.value as EmploymentType })}>
                  {empOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
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


