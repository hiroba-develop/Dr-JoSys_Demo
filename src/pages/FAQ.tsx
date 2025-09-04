import React from 'react';

const faqs = [
  { q: 'VPNが不安定なときの対処方法は？', a: '回線品質の確認、ルータ再起動、クライアント更新、拠点間IPSec確認等を順に確認します。' },
  { q: '端末キッティングの流れは？', a: '調達→資産登録→OS/パッチ→ソフト配布→セキュリティ設定→受領確認の順で行います。' },
  { q: 'ライセンス管理のベストプラクティスは？', a: '棚卸の定期化、集約台帳、期限アラート、自動化ツールの活用が有効です。' },
];

export const FAQ: React.FC = () => {
  return (
    <div className="space-y-3">
      {faqs.map((f, idx) => (
        <details key={idx} className="p-3 bg-white border border-border rounded">
          <summary className="cursor-pointer font-medium">{f.q}</summary>
          <div className="mt-2 text-sm text-text/80">{f.a}</div>
        </details>
      ))}
    </div>
  );
};


