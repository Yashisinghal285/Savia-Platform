CREATE TABLE children (
    id BIGSERIAL PRIMARY KEY,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),

    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),

    disability_type VARCHAR(100),
    additional_needs TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE child_guardians (
    id BIGSERIAL PRIMARY KEY,

    child_id BIGINT NOT NULL REFERENCES children(id),
    user_id BIGINT NOT NULL REFERENCES users(id),

    relationship_type VARCHAR(30) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (child_id, user_id)
);