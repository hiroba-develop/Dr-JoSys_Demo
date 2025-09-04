import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    navigate('/password/re-register');
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] grid place-items-center">
      <form onSubmit={submit} className="card w-full max-w-md">
        <div className="card-header">パスワード再設定</div>
        <div className="card-body space-y-3">
          <label className="grid gap-1">
            <span className="text-sm">メールアドレス</span>
            <input type="email" className="rounded border border-border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <button className="btn-primary w-full justify-center" type="submit">送信</button>
        </div>
      </form>
    </div>
  );
};


