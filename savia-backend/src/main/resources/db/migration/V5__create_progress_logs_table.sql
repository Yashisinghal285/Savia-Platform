CREATE TABLE progress_logs (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    program_id BIGINT REFERENCES programs(id) ON DELETE SET NULL,
    logged_by_user_id BIGINT NOT NULL REFERENCES users(id),

    session_date DATE NOT NULL,
    duration_minutes INTEGER,
    mood_rating VARCHAR(30),
    performance_rating VARCHAR(30),
    milestone_achieved TEXT,
    notes TEXT,
    challenges_faced TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_logs_child_id ON progress_logs(child_id);
CREATE INDEX idx_progress_logs_program_id ON progress_logs(program_id);
CREATE INDEX idx_progress_logs_session_date ON progress_logs(session_date);
