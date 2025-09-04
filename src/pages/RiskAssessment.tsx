import React, { useMemo, useState } from 'react';
import type { RiskAssessmentRecord } from '../types';
import { v4 as uuid } from 'uuid';

export const RiskAssessment: React.FC = () => {
  const [q1, setQ1] = useState(3);
  const [q2, setQ2] = useState(3);
  const [q3, setQ3] = useState(3);
  const [history, setHistory] = useState<RiskAssessmentRecord[]>([]);

  const score = useMemo(() => Math.round((q1 + q2 + q3) / 3) as 1|2|3|4|5, [q1, q2, q3]);
  const recommendations = useMemo(() => {
    switch (score) {
      case 1:
      case 2:
        return ['基本的なセキュリティ対策の徹底', '資産管理の整備'];
      case 3:
        return ['ルール整備と教育の継続', 'バックアップ計画の定期見直し'];
      case 4:
      case 5:
        return ['脅威監視の自動化', 'インシデント演習の導入'];
    }
  }, [score]);

  const save = () => {
    const rec: RiskAssessmentRecord = { id: uuid(), score: score as 1|2|3|4|5, recommendations, createdAt: new Date().toISOString() };
    setHistory((prev) => [rec, ...prev]);
  };

  const exportReport = () => {
    const lines = [
      `診断レポート (作成: ${new Date().toLocaleString()})`,
      `スコア: ${score}/5`,
      `提案: ${recommendations.join('、')}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'risk_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">診断質問フォーム</div>
        <div className="card-body grid gap-3">
          <label className="grid grid-cols-[1fr_200px] items-center gap-2">
            <span>バックアップは定期的に取得されていますか？</span>
            <input type="range" min={1} max={5} value={q1} onChange={(e) => setQ1(Number(e.target.value))} />
          </label>
          <label className="grid grid-cols-[1fr_200px] items-center gap-2">
            <span>端末やアカウントの管理ルールは整備されていますか？</span>
            <input type="range" min={1} max={5} value={q2} onChange={(e) => setQ2(Number(e.target.value))} />
          </label>
          <label className="grid grid-cols-[1fr_200px] items-center gap-2">
            <span>セキュリティインシデント対応の体制はありますか？</span>
            <input type="range" min={1} max={5} value={q3} onChange={(e) => setQ3(Number(e.target.value))} />
          </label>
          <div className="text-sm">リスクレベル判定：<span className="font-semibold">{score}/5</span></div>
          <div className="text-sm">改善提案：{recommendations.join('、')}</div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={save}>診断結果を保存</button>
            <button className="btn-accent" onClick={exportReport}>レポート出力</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">診断履歴</div>
        <div className="card-body text-sm space-y-2">
          {history.length === 0 && <div className="text-text/70">まだ記録がありません。</div>}
          {history.map((h) => (
            <div key={h.id} className="p-2 border border-border rounded">
              <div>スコア: {h.score}/5</div>
              <div>提案: {h.recommendations.join('、')}</div>
              <div className="text-xs text-text/60">{new Date(h.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


