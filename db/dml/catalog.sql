INSERT INTO
    catalog.genres (name)
VALUES
    ('Rock'),
    ('Pop'),
    ('Metal'),
    ('Jazz'),
    ('Clasica'),
    ('Electronica'),
    ('Folk'),
    ('World'),
    ('Country'),
    ('Latin'),
    ('Reggae'),
    ('Hip-Hop'),
    ('R&B'),
    ('Soul'),
    ('Funk'),
    ('Gospel'),
    ('Blues'),
    ('Punk'),
    ('Rap'),
    ('Indie'),
    ('Dance'),
    ('Latino'),
    ('Reggaeton'),
    ('Afro'),
    ('Afrobeat'),
    ('Dubstep'),
    ('Drum & Bass'),
    ('House'),
    ('Techno'),
    ('Trance'),
    ('Ambiental'),
    ('Progressiva'),
    ('Experimental'),
    ('Alternative'),
    ('Indie Rock'),
    ('Psychedelic'),
    ('Grunge'),
    ('Punk Rock'),
    ('Soft Rock');

INSERT INTO
    catalog.discographies (
        title,
        artist,
        image_url,
        genre_id,
        year,
        price,
        stock,
        format,
        visible,
        created_at
    )
VALUES
    (
        'The Beatles',
        'The Beatles',
        'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/The_Beatles.jpg/220px-The_Beatles.jpg',
        (
            SELECT
                id
            FROM
                catalog.genres
            WHERE
                name = 'Rock'
        ),
        1962,
        8.99,
        NULL,
        'CD',
        TRUE,
        '2019-01-01 00:00:00'
    ),
    (
        'The Rolling Stones',
        'The Rolling Stones',
        'https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Rolling_Stones.jpg/220px-Rolling_Stones.jpg',
        (
            SELECT
                id
            FROM
                catalog.genres
            WHERE
                name = 'Rock'
        ),
        1964,
        8.99,
        NULL,
        'CASSETTE',
        TRUE,
        '2019-01-01 00:00:00'
    ),
    (
        'The Who',
        'The Who',
        'https://upload.wikimedia.org/wikipedia/en/thumb/f/f4/The_Who.jpg/220px-The_Who.jpg',
        (
            SELECT
                id
            FROM
                catalog.genres
            WHERE
                name = 'Rock'
        ),
        1960,
        8.99,
        NULL,
        'VINYL',
        TRUE,
        '2019-01-01 00:00:00'
    );

INSERT INTO
    catalog.songs (
        discography_id,
        name,
        side
    )
VALUES
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Beatles'
        ),
        'Hey Jude',
        'A'
    ),
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Beatles'
        ),
        'Revolution 9',
        'A'
    ),
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Rolling Stones'
        ),
        'You Can''t Always Get What You Want',
        'A'
    ),
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Rolling Stones'
        ),
        'Aftermath',
        'B'
    ),
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Who'
        ),
        'I''m A Boy',
        'A'
    ),
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Who'
        ),
        'Athena',
        'B'
    );

INSERT INTO
    catalog.vinyls (
        discography_id,
        size,
        special_edition
    )
VALUES
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Who'
        ),
        7,
        'Special Edition'
    );

INSERT INTO
    catalog.cassettes (discography_id, condition)
VALUES
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Rolling Stones'
        ),
        'NEW'
    );

INSERT INTO
    catalog.cds (discography_id)
VALUES
    (
        (
            SELECT
                id
            FROM
                catalog.discographies
            WHERE
                title = 'The Beatles'
        )
    );