CREATE SCHEMA catalog;

CREATE TABLE catalog.genres (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TYPE catalog.format_type AS ENUM ('VINYL', 'CASSETTE', 'CD');

CREATE TABLE catalog.discographies (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    artist VARCHAR(150) NOT NULL,
    genre_id BIGINT NOT NULL REFERENCES catalog.genres (id),
    year INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NULL,
    format catalog.format_type NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT FALSE,
    release TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);

CREATE TYPE catalog.discography_sides AS ENUM ('A', 'B');

CREATE TABLE catalog.songs (
    id BIGSERIAL PRIMARY KEY,
    discography_id BIGINT NOT NULL REFERENCES catalog.discographies (id),
    name VARCHAR(150) NOT NULL,
    side catalog.discography_sides NULL,
    url VARCHAR(255) NULL
);

CREATE TABLE catalog.vinyls (
    discography_id BIGINT PRIMARY KEY REFERENCES catalog.discographies (id),
    size INT NOT NULL CHECK (size IN (7, 10, 12)),
    special_edition VARCHAR(150) NULL
);

CREATE TYPE catalog.cassette_condition AS ENUM ('NEW', 'SEMI_USED', 'USED');

CREATE TABLE catalog.cassettes (
    discography_id BIGINT PRIMARY KEY REFERENCES catalog.discographies (id),
    condition catalog.cassette_condition NOT NULL
);

CREATE TABLE catalog.cds (
    discography_id BIGINT PRIMARY KEY REFERENCES catalog.discographies (id)
);