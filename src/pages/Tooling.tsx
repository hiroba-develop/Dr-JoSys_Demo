import React, { useState } from 'react';

type ToolPlan = { id: string; toolName: string; goal: string; progress: number; effectNote?: string };

export const Tooling: React.FC = () => {
  const [plans, setPlans] = useState<ToolPlan[]>([]);
  const [toolName, setToolName] = useState('');
  const [goal, setGoal] = useState('');

  const add = () => {
    if (!toolName.trim() || !goal.trim()) return;
    setPlans((prev) => [{ id: Math.random().toString(36).slice(2), toolName, goal, progress: 0 }, ...prev]);
    setToolName('');
    setGoal('');
  };

  const setProgress = (id: string, progress: number) => setPlans((prev) => prev.map((p) => p.id === id ? { ...p, progress } : p));

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">ツール選定・導入計画</div>
        <div className="card-body grid md:grid-cols-3 gap-3 items-end">
          <input className="rounded border border-border px-3 py-2" placeholder="ツール名" value={toolName} onChange={(e) => setToolName(e.target.value)} />
          <input className="rounded border border-border px-3 py-2 md:col-span-2" placeholder="導入目的" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <button className="btn-primary" onClick={add}>計画に追加</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">進捗管理・効果測定</div>
        <div className="card-body space-y-3">
          {plans.length === 0 && <div className="text-sm text-text/70">まだ計画がありません。</div>}
          {plans.map((p) => (
            <div key={p.id} className="p-3 border border-border rounded">
              <div className="font-medium">{p.toolName}</div>
              <div className="text-sm text-text/70">目的：{p.goal}</div>
              <input type="range" min={0} max={100} value={p.progress} onChange={(e) => setProgress(p.id, Number(e.target.value))} className="w-full" />
              <div className="text-sm">進捗：{p.progress}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


