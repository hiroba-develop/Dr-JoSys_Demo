import React, { useEffect, useState } from 'react';
import type { CompanyInfo, Department } from '../types';

const INDUSTRIES = ['IT・通信', '製造', '卸売・小売', '建設', '運輸・物流', '医療・福祉', '教育', '金融', '不動産', 'サービス', '公務'];

export const Company: React.FC = () => {
  const [info, setInfo] = useState<CompanyInfo>({ companyName: '', companyNameKana: '', address: '', industry: '', contactPerson: '' });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showDeptCreate, setShowDeptCreate] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [editDeptName, setEditDeptName] = useState('');

  useEffect(() => {
    const rawInfo = localStorage.getItem('drj-company-info');
    const rawDepts = localStorage.getItem('drj-company-depts');
    if (rawInfo) setInfo(JSON.parse(rawInfo));
    if (rawDepts) setDepartments(JSON.parse(rawDepts));
  }, []);

  const saveInfo = () => {
    localStorage.setItem('drj-company-info', JSON.stringify(info));
    alert('会社情報を保存しました');
  };

  const saveDepts = (next: Department[]) => {
    setDepartments(next);
    localStorage.setItem('drj-company-depts', JSON.stringify(next));
  };

  const addDept = () => {
    if (!deptName.trim()) return;
    const next = [{ id: Math.random().toString(36).slice(2), name: deptName.trim() }, ...departments];
    saveDepts(next);
    setDeptName('');
    setShowDeptCreate(false);
  };

  const removeDept = (id: string) => {
    if (!confirm('削除してよろしいですか？')) return;
    saveDepts(departments.filter(d => d.id !== id));
  };

  const startEditDept = (d: Department) => { setEditingDept(d); setEditDeptName(d.name); };
  const applyEditDept = () => {
    if (!editingDept) return;
    const next = departments.map(d => d.id === editingDept.id ? { ...d, name: editDeptName } : d);
    saveDepts(next);
    setEditingDept(null);
    setEditDeptName('');
  };

  return (
    <div className="space-y-2 max-w-6xl mx-auto">
      <div className="card w-full">
        <div className="card-header py-2">会社情報</div>
        <div className="card-body grid md:grid-cols-2 gap-2 py-3">
          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm">会社名</span>
            <input className="rounded border border-border px-3 py-2" value={info.companyName} onChange={(e) => setInfo({ ...info, companyName: e.target.value })} />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm">会社名(カナ)</span>
            <input className="rounded border border-border px-3 py-2" value={info.companyNameKana} onChange={(e) => setInfo({ ...info, companyNameKana: e.target.value })} />
          </label>
          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm">住所</span>
            <input className="rounded border border-border px-3 py-2" value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">業界</span>
            <select className="rounded border border-border px-3 py-2" value={info.industry} onChange={(e) => setInfo({ ...info, industry: e.target.value })}>
              <option value="">選択してください</option>
              {INDUSTRIES.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-sm">担当者</span>
            <input className="rounded border border-border px-3 py-2" value={info.contactPerson} onChange={(e) => setInfo({ ...info, contactPerson: e.target.value })} />
          </label>
          <div className="md:col-span-2">
            <button className="btn-primary" onClick={saveInfo}>保存</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between py-2">
          <span>部署一覧</span>
          <button className="btn-primary px-3 py-1" onClick={() => setShowDeptCreate(true)}>部署登録</button>
        </div>
        <div className="card-body py-3">
          {departments.length === 0 ? (
            <div className="text-sm text-text/70">部署は登録されていません。</div>
          ) : (
            <ul className="divide-y divide-border">
              {departments.map((d) => (
                <li key={d.id} className="py-1.5 flex items-center justify-between">
                  <span>{d.name}</span>
                  <span className="space-x-2">
                    <button className="px-2 py-1 rounded border border-border" onClick={() => startEditDept(d)}>編集</button>
                    <button className="px-2 py-1 rounded border border-border" onClick={() => removeDept(d.id)}>削除</button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showDeptCreate && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center" onClick={() => setShowDeptCreate(false)}>
          <div className="bg-white rounded-md border border-border p-3 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="font-medium">部署登録</div>
            <label className="grid gap-1">
              <span className="text-sm">部署名</span>
              <input className="rounded border border-border px-3 py-2" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded border border-border" onClick={() => setShowDeptCreate(false)}>キャンセル</button>
              <button className="btn-primary px-3 py-1" onClick={addDept}>登録</button>
            </div>
          </div>
        </div>
      )}

      {editingDept && (
        <div className="fixed inset-0 bg-black/20 grid place-items-center" onClick={() => setEditingDept(null)}>
          <div className="bg-white rounded-md border border-border p-3 w-full max-w-md space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="font-medium">部署編集</div>
            <label className="grid gap-1">
              <span className="text-sm">部署名</span>
              <input className="rounded border border-border px-3 py-2" value={editDeptName} onChange={(e) => setEditDeptName(e.target.value)} />
            </label>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded border border-border" onClick={() => setEditingDept(null)}>キャンセル</button>
              <button className="btn-primary px-3 py-1" onClick={applyEditDept}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


