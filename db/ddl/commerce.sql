CREATE SCHEMA commerce;

CREATE TABLE commerce.wishlists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES interactivity.users (id),
    discography_id BIGINT NOT NULL REFERENCES catalog.discographies (id),
    paid BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commerce.grouping_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    discount DECIMAL(10, 2) NOT NULL,
    cds_limit INT NOT NULL,
    limited_time BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE commerce.promotions (
    id BIGSERIAL PRIMARY KEY,
    group_type_id BIGINT NOT NULL REFERENCES commerce.grouping_types (id),
    start_date DATE NOT NULL,
    end_date DATE NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TABLE commerce.promoted_cds (
    promotion_id BIGINT NOT NULL REFERENCES commerce.promotions (id),
    cd_id BIGINT NOT NULL REFERENCES catalog.cds (discography_id)
);

CREATE TYPE commerce.order_status AS ENUM ('ON_HOLD', 'PENDING', 'SENDING', 'COMPLETED');

CREATE TABLE commerce.orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES interactivity.users (id),
    total DECIMAL(10, 2) NOT NULL,
    status commerce.order_status NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commerce.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES commerce.orders (id),
    discography_id BIGINT NULL REFERENCES catalog.discographies (id),
    promotion_id BIGINT NULL REFERENCES commerce.promotions (id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        discography_id IS NOT NULL
        OR promotion_id IS NOT NULL
    )
);