import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ItAsset, ServiceAsset, CompanyInfo, Department } from '../types';

type Task = {
  id: string;
  title: string;
  description: string;
  department?: string;
  assignee?: string;
  startDate?: string;
  dueDate?: string;
  status: '未着手' | '作業中' | '確認待ち' | '完了';
  priority: '低' | '中' | '高';
  createdAt: string;
  updatedAt: string;
};

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [itAssets, setItAssets] = useState<ItAsset[]>([]);
  const [serviceAssets, setServiceAssets] = useState<ServiceAsset[]>([]);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    try { setTasks(JSON.parse(localStorage.getItem('drj-tasks') || '[]')); } catch {}
    try { setItAssets(JSON.parse(localStorage.getItem('drj-it-assets') || '[]')); } catch {}
    try { setServiceAssets(JSON.parse(localStorage.getItem('drj-service-assets') || '[]')); } catch {}
    try { const info = localStorage.getItem('drj-company-info'); if (info) setCompany(JSON.parse(info)); } catch {}
    try { setDepartments(JSON.parse(localStorage.getItem('drj-company-depts') || '[]')); } catch {}
  }, []);

  const taskCounts = useMemo(() => {
    const map: Record<string, number> = { 未着手: 0, 作業中: 0, 確認待ち: 0, 完了: 0 };
    tasks.forEach(t => { map[t.status] = (map[t.status] || 0) + 1; });
    return map as { 未着手: number; 作業中: number; 確認待ち: number; 完了: number };
  }, [tasks]);

  const dueSoonCount = useMemo(() => {
    const now = new Date();
    const in7 = 7 * 24 * 60 * 60 * 1000;
    return tasks.filter(t => t.dueDate && t.status !== '完了' && (() => {
      const d = new Date(`${t.dueDate}T00:00:00`);
      return d.getTime() - now.getTime() <= in7 && d.getTime() >= now.getTime();
    })()).length;
  }, [tasks]);

  const itTypeCounts = useMemo(() => {
    const map: Record<string, number> = {};
    itAssets.forEach(a => { map[a.type] = (map[a.type] || 0) + 1; });
    return map;
  }, [itAssets]);

  const latestTasks = useMemo(() => tasks.slice(0, 5), [tasks]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="card">
          <div className="card-header">ITタスク 概況</div>
          <div className="card-body text-sm text-text/80 space-y-2">
            <div>未着手 {taskCounts.未着手} / 作業中 {taskCounts.作業中} / 確認待ち {taskCounts.確認待ち} / 完了 {taskCounts.完了}</div>
            <div>期限接近（7日以内）: {dueSoonCount} 件</div>
            <div className="pt-1">
              <Link to="/tasks" className="btn-primary inline-flex items-center px-3 py-1">ITタスクへ</Link>
            </div>
          </div>
        </section>
        <section className="card">
          <div className="card-header">IT機器資産 概況</div>
          <div className="card-body text-sm text-text/80 space-y-2">
            <div>登録台数: {itAssets.length}</div>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(itTypeCounts).map(([k, v]) => (
                <span key={k}>{k}: {v}</span>
              ))}
            </div>
            <div className="pt-1">
              <Link to="/it-assets" className="btn-primary inline-flex items-center px-3 py-1">IT機器資産へ</Link>
            </div>
          </div>
        </section>
        <section className="card">
          <div className="card-header">サービス資産 概況</div>
          <div className="card-body text-sm text-text/80 space-y-2">
            <div>登録サービス数: {serviceAssets.length}</div>
            <div className="pt-1">
              <Link to="/service-assets" className="btn-primary inline-flex items-center px-3 py-1">サービス資産へ</Link>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="card">
          <div className="card-header">最新のタスク</div>
          <div className="card-body text-sm text-text/80 space-y-2">
            {latestTasks.length === 0 ? (
              <div>タスクは登録されていません。</div>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {latestTasks.map(t => (
                  <li key={t.id}>
                    {t.title}（{t.status} / 担当: {t.assignee || '-'} / 期限: {t.dueDate || '-'}）
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <section className="card">
          <div className="card-header">会社情報</div>
          <div className="card-body text-sm text-text/80 space-y-2">
            <div>会社名: {company?.companyName || '未設定'}</div>
            <div>業界: {company?.industry || '-'}</div>
            <div>担当者: {company?.contactPerson || '-'}</div>
            <div>部署数: {departments.length}</div>
            <div className="pt-1">
              <Link to="/company" className="btn-primary inline-flex items-center px-3 py-1">会社情報へ</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};


