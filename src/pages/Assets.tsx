import React, { useMemo, useState } from 'react';

type Asset = { id: string; name: string; owner: string; licenseUntil?: string };

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(() => [
    { id: 'a1', name: 'ノートPC-001', owner: '営業A', licenseUntil: '2025-12-31' },
  ]);
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [licenseUntil, setLicenseUntil] = useState('');

  const add = () => {
    if (!name.trim()) return;
    setAssets((prev) => [{ id: Math.random().toString(36).slice(2), name, owner, licenseUntil: licenseUntil || undefined }, ...prev]);
    setName('');
    setOwner('');
    setLicenseUntil('');
  };

  const remove = (id: string) => setAssets((prev) => prev.filter((a) => a.id !== id));

  const expiring = useMemo(() => assets.filter((a) => a.licenseUntil && new Date(a.licenseUntil) < new Date(Date.now() + 1000*60*60*24*60)), [assets]);

  const exportCsv = () => {
    const header = ['id','name','owner','licenseUntil'];
    const rows = assets.map((a) => [a.id, a.name, a.owner, a.licenseUntil ?? '']);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/\"/g,'""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assets.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">資産登録</div>
        <div className="card-body grid md:grid-cols-4 gap-3 items-end">
          <input className="rounded border border-border px-3 py-2" placeholder="資産名" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded border border-border px-3 py-2" placeholder="所有者" value={owner} onChange={(e) => setOwner(e.target.value)} />
          <input type="date" className="rounded border border-border px-3 py-2" value={licenseUntil} onChange={(e) => setLicenseUntil(e.target.value)} />
          <button className="btn-primary" onClick={add}>登録</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between"><span>資産台帳</span><button className="btn-accent px-3 py-1" onClick={exportCsv}>CSV出力</button></div>
        <div className="card-body overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text/70">
                <th className="py-2">資産名</th>
                <th>所有者</th>
                <th>ライセンス期限</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="py-2">{a.name}</td>
                  <td>{a.owner || '-'}</td>
                  <td>{a.licenseUntil || '-'}</td>
                  <td>
                    <button className="px-2 py-1 rounded border border-border" onClick={() => remove(a.id)}>削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-header">更新期限アラート</div>
        <div className="card-body text-sm">
          {expiring.length === 0 ? '60日以内に期限切れのライセンスはありません。' : (
            <ul className="list-disc pl-5">
              {expiring.map((a) => <li key={a.id}>{a.name} - {a.licenseUntil}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};


