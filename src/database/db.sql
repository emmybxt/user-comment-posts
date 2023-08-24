CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    userId INT,
    title VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    postId INT,
    content TEXT,
    createdAt TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES posts(id)
);

CREATE INDEX IF NOT EXISTS idx_comments_createdAt ON comments (createdAt);

CREATE INDEX IF NOT EXISTS idx_posts_userId ON posts (userId);

CREATE INDEX IF NOT EXISTS idx_posts_count ON posts (userId, id);

CREATE INDEX IF NOT EXISTS idx_comments_postId_createdAt ON comments (postId, createdAt);
