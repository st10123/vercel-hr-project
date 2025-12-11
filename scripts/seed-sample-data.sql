-- サンプルデータの挿入
-- 評価期間データ
INSERT INTO evaluation_periods (name, start_date, end_date, is_active) VALUES
('2024年度 第4四半期', '2024-01-01', '2024-03-31', true),
('2024年度 第3四半期', '2023-10-01', '2023-12-31', false);

-- 従業員データ
INSERT INTO employees (name, department, position, email) VALUES
('田中太郎', '営業部', '営業主任', 'tanaka@company.com'),
('佐藤花子', '開発部', 'シニアエンジニア', 'sato@company.com'),
('鈴木一郎', 'マーケティング部', 'マーケティングマネージャー', 'suzuki@company.com'),
('高橋美咲', '人事部', '人事スペシャリスト', 'takahashi@company.com'),
('山田健太', '財務部', '財務アナリスト', 'yamada@company.com'),
('伊藤由美', '営業部', '営業担当', 'ito@company.com'),
('渡辺慎一', '開発部', 'エンジニア', 'watanabe@company.com'),
('中村麻衣', 'マーケティング部', 'マーケティング担当', 'nakamura@company.com');

-- サンプル評価データ
INSERT INTO evaluations (employee_id, period_id, evaluator_name, responsibility_score, speed_score, accuracy_score, overall_score, achievements, goals, status) VALUES
(1, 1, '営業部長', 8, 7, 8, 8, '四半期売上目標を120%達成。新規顧客開拓に成功。', '来期は新人指導にも力を入れる。', 'completed'),
(2, 1, '開発部長', 9, 8, 9, 9, 'システムの安定性向上に大きく貢献。バグ修正率が大幅改善。', 'アーキテクチャ設計のスキルアップを目指す。', 'completed'),
(3, 1, 'マーケティング部長', 7, 8, 7, 7, 'SNSマーケティングキャンペーンが成功。', 'データ分析スキルの向上が必要。', 'in_progress'),
(4, 1, '人事部長', 9, 7, 9, 8, '採用プロセスの効率化を実現。', '人材育成プログラムの企画立案。', 'completed'),
(5, 1, '財務部長', 8, 7, 9, 8, '予算管理の精度向上。コスト削減提案が採用。', '財務分析の自動化推進。', 'completed');
