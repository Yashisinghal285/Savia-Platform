CREATE TABLE programs (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    created_by_user_id BIGINT NOT NULL REFERENCES users(id),

    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    frequency VARCHAR(50) NOT NULL DEFAULT 'DAILY',
    target_goal TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    start_date DATE,
    end_date DATE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_programs_child_id ON programs(child_id);
