CREATE SCHEMA interactivity;

CREATE TYPE interactivity.role_type AS ENUM ('CLIENT', 'ADMIN');

CREATE TABLE interactivity.users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role interactivity.role_type NOT NULL,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    banned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TABLE interactivity.user_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES interactivity.users (id),
    code VARCHAR(6) NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TABLE interactivity.comments (
    id BIGSERIAL PRIMARY KEY,
    discography_id BIGINT NOT NULL REFERENCES catalog.discographies (id),
    user_id BIGINT NOT NULL REFERENCES interactivity.users (id),
    comment_id BIGINT NULL REFERENCES interactivity.comments (id),
    content TEXT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE interactivity.ratings (
    id BIGSERIAL PRIMARY KEY,
    discography_id BIGINT NOT NULL REFERENCES catalog.discographies (id),
    user_id BIGINT NOT NULL REFERENCES interactivity.users (id),
    rating INT NOT NULL CHECK (
        rating > 0
        AND rating < 6
    ),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);