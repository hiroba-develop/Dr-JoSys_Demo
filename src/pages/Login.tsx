import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    login(name.trim());
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] grid place-items-center">
      <form onSubmit={submit} className="card w-full max-w-md">
        <div className="card-header">ログイン</div>
        <div className="card-body space-y-3">
          <label className="grid gap-1">
            <span className="text-sm">お名前</span>
            <input className="rounded border border-border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="例) 田中 太郎" />
          </label>
          <button className="btn-primary w-full justify-center" type="submit">ログイン</button>
        </div>
      </form>
    </div>
  );
};


