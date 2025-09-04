import React, { useState } from 'react';

type Course = { id: string; title: string; completed: boolean; score?: number };

export const Training: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', title: '情報セキュリティ基礎', completed: false },
    { id: '2', title: 'パスワード管理と多要素認証', completed: false },
  ]);

  const complete = (id: string) => setCourses((prev) => prev.map((c) => c.id === id ? { ...c, completed: true, score: Math.floor(80 + Math.random() * 20) } : c));

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">研修コンテンツ</div>
        <div className="card-body grid md:grid-cols-2 gap-3">
          {courses.map((c) => (
            <div key={c.id} className="p-3 border border-border rounded">
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-text/70">{c.completed ? `修了 (スコア: ${c.score})` : '未修了'}</div>
              {!c.completed && <button className="btn-primary mt-2" onClick={() => complete(c.id)}>受講する</button>}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">修了証</div>
        <div className="card-body text-sm">
          {courses.filter((c) => c.completed).length === 0 ? (
            <div className="text-text/70">修了した研修はまだありません。</div>
          ) : (
            <ul className="list-disc pl-5">
              {courses.filter((c) => c.completed).map((c) => (
                <li key={c.id}>{c.title} - スコア {c.score}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};


