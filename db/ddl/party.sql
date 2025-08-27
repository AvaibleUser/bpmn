CREATE SCHEMA party;

CREATE TABLE party.events (
    id SERIAL PRIMARY KEY,
    organizer_id INT NOT NULL REFERENCES interactivity.users (id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    event_datetime TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TABLE party.event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES party.events (id),
    user_id INT NOT NULL REFERENCES interactivity.users (id),
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL
);

CREATE TABLE party.event_chats (
    id SERIAL PRIMARY KEY,
    registration_id INT NOT NULL REFERENCES party.event_registrations (id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);