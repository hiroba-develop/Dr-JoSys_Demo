import React, { useState } from 'react';

type User = { id: string; name: string; role: '管理者' | '一般'; twoFactor: boolean };

export const Accounts: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: '管理者 太郎', role: '管理者', twoFactor: true },
  ]);
  const [name, setName] = useState('');
  const [role, setRole] = useState<User['role']>('一般');

  const add = () => {
    if (!name.trim()) return;
    setUsers((prev) => [{ id: Math.random().toString(36).slice(2), name, role, twoFactor: false }, ...prev]);
    setName('');
    setRole('一般');
  };

  const toggle2FA = (id: string) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, twoFactor: !u.twoFactor } : u));

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">ユーザー登録・権限管理</div>
        <div className="card-body grid md:grid-cols-3 gap-3 items-end">
          <input className="rounded border border-border px-3 py-2" placeholder="氏名" value={name} onChange={(e) => setName(e.target.value)} />
          <select className="rounded border border-border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as User['role'])}>
            <option value="一般">一般</option>
            <option value="管理者">管理者</option>
          </select>
          <button className="btn-primary" onClick={add}>追加</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">ユーザー一覧 / 二要素認証</div>
        <div className="card-body overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text/70">
                <th className="py-2">氏名</th>
                <th>権限</th>
                <th>2FA</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="py-2">{u.name}</td>
                  <td>{u.role}</td>
                  <td>{u.twoFactor ? '有効' : '無効'}</td>
                  <td>
                    <button className="px-2 py-1 rounded border border-border" onClick={() => toggle2FA(u.id)}>{u.twoFactor ? '無効化' : '有効化'}</button>
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


