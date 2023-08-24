CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    createdAt VARCHAR(255)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES users(id),
    title VARCHAR(255)
);


CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    postId INT REFERENCES posts(id),
    content TEXT,
    createdAt TIMESTAMP
);
