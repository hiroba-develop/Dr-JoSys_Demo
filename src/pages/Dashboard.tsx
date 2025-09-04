import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="card">
          <div className="card-header">利用状況サマリー</div>
          <div className="card-body text-sm text-text/80">
            ・直近7日：相談 8件 / チケット 5件
            <br />・平均対応時間：2.3h / SLA遵守 96%
          </div>
        </section>
        <section className="card">
          <div className="card-header">直近の相談・チケット</div>
          <div className="card-body text-sm text-text/80 space-y-2">
            <div>・VPNが切れる（対応中）</div>
            <div>・端末キッティングの見積（受付中）</div>
            <div>・メール誤送信防止（完了）</div>
          </div>
        </section>
        <section className="card">
          <div className="card-header">お知らせ・アラート</div>
          <div className="card-body text-sm text-text/80">
            ・ライセンス更新期限アラート：3件
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="card">
          <div className="card-header">対応状況（ダミー）</div>
          <div className="card-body text-sm text-text/80">
            ・未着手 4 / 作業中 7 / 確認待ち 3 / 完了 23
          </div>
        </section>
        <section className="card">
          <div className="card-header">セキュリティ通知</div>
          <div className="card-body text-sm text-text/80 space-y-2">
            <div>・ウイルス定義更新未適用：2台</div>
            <div>・OSパッチ適用待ち：5台</div>
          </div>
        </section>
      </div>
    </div>
  );
};


