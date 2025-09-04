import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PasswordReRegister: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const validate = (): string | null => {
    if (password.length < 9 || !/^([0-9a-zA-Z]+)$/.test(password)) {
      return 'パスワードは英数字9文字以上で入力してください';
    }
    if (password !== confirm) {
      return 'パスワードが一致しません';
    }
    return null;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      alert(err);
      return;
    }
    alert('パスワードは変更されました');
    navigate('/login');
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] grid place-items-center">
      <form onSubmit={submit} className="card w-full max-w-md">
        <div className="card-header">パスワード再登録</div>
        <div className="card-body space-y-3">
          <label className="grid gap-1">
            <span className="text-sm">新しいパスワード</span>
            <input type="password" className="rounded border border-border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="英数字9文字以上" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">新しいパスワード（再入力）</span>
            <input type="password" className="rounded border border-border px-3 py-2" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="もう一度入力" />
          </label>
          <button className="btn-primary w-full justify-center" type="submit">変更</button>
        </div>
      </form>
    </div>
  );
};


