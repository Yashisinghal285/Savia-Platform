CREATE TABLE child_needs_profiles (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL UNIQUE REFERENCES children(id) ON DELETE CASCADE,

    primary_diagnosis VARCHAR(100),
    secondary_diagnosis VARCHAR(100),
    severity_level VARCHAR(50),

    communication_mode VARCHAR(100),
    mobility_status VARCHAR(100),

    dietary_restrictions TEXT,
    allergies TEXT,
    behavioral_triggers TEXT,
    calming_strategies TEXT,

    emergency_medications TEXT,
    medical_notes TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
