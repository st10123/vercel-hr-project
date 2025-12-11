-- HR評価システムのデータベーススキーマ
-- 従業員テーブル
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    position VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 評価期間テーブル
CREATE TABLE IF NOT EXISTS evaluation_periods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 評価テーブル
CREATE TABLE IF NOT EXISTS evaluations (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    period_id INTEGER REFERENCES evaluation_periods(id),
    evaluator_name VARCHAR(100),
    responsibility_score INTEGER CHECK (responsibility_score >= 1 AND responsibility_score <= 10),
    speed_score INTEGER CHECK (speed_score >= 1 AND speed_score <= 10),
    accuracy_score INTEGER CHECK (accuracy_score >= 1 AND accuracy_score <= 10),
    overall_score INTEGER CHECK (overall_score >= 1 AND overall_score <= 10),
    achievements TEXT,
    goals TEXT,
    status VARCHAR(20) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- チャット履歴テーブル
CREATE TABLE IF NOT EXISTS chat_sessions (
    id SERIAL PRIMARY KEY,
    evaluation_id INTEGER REFERENCES evaluations(id),
    messages JSONB NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_evaluations_employee_id ON evaluations(employee_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_period_id ON evaluations(period_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_status ON evaluations(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_evaluation_id ON chat_sessions(evaluation_id);
