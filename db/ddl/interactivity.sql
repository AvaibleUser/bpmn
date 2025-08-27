CREATE SCHEMA interactivity;

CREATE TYPE interactivity.role_type AS ENUM ('CLIENT', 'ADMIN');

CREATE TABLE interactivity.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role interactivity.role_type NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    banned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TABLE interactivity.user_codes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES interactivity.users (id),
    code CHAR(6) NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TABLE interactivity.comments (
    id SERIAL PRIMARY KEY,
    discography_id INT NOT NULL REFERENCES catalog.discography (id),
    user_id INT NOT NULL REFERENCES interactivity.users (id),
    comment_id INT NULL REFERENCES interactivity.comments (id),
    content TEXT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);

CREATE TABLE interactivity.ratings (
    id SERIAL PRIMARY KEY,
    discography_id INT NOT NULL REFERENCES catalog.discography (id),
    user_id INT NOT NULL REFERENCES interactivity.users (id),
    rating INT NOT NULL CHECK (
        rating > 0
        AND rating < 6
    ),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);