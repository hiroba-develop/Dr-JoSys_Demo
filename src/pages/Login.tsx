import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    login(email, password);
    navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] grid place-items-center">
      <form onSubmit={submit} className="card w-full max-w-md">
        <div className="card-header">
          <img src={`${import.meta.env.BASE_URL}Dr-JoSys_icon.png`} alt="Dr.情シス" className="w-full h-auto object-contain" />
          <div className="mt-2 text-center">ログイン</div>
        </div>
        <div className="card-body space-y-3">
          <label className="grid gap-1">
            <span className="text-sm">メールアドレス</span>
            <input type="email" className="rounded border border-border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">パスワード</span>
            <input type="password" className="rounded border border-border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          <button className="btn-primary w-full justify-center" type="submit">ログイン</button>
          <div className="text-right">
            <Link to="/password/reset" className="text-sm text-primary hover:underline">パスワードを忘れた方はこちら</Link>
          </div>
        </div>
      </form>
    </div>
  );
};


