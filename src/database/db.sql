CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    userId INT,
    title VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    postId INT,
    userId INT,
    content TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES posts(id)
);


-- ALTER TABLE comments
-- ALTER COLUMN createdAt SET DEFAULT CURRENT_TIMESTAMP;

-- ALTER TABLE users
-- ALTER COLUMN createdAt SET DEFAULT CURRENT_TIMESTAMP;


-- ALTER TABLE posts
-- ALTER COLUMN createdAt SET DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_comments_createdAt ON comments (createdAt);

CREATE INDEX IF NOT EXISTS idx_posts_userId ON posts (userId);

CREATE INDEX IF NOT EXISTS idx_posts_count ON posts (userId, id);

CREATE INDEX IF NOT EXISTS idx_comments_postId_createdAt ON comments (postId, createdAt);
