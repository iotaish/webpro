-- name: createTable
CREATE TABLE backlog (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  platform TEXT NOT NULL,
  yearsStacked INTEGER NOT NULL DEFAULT 0,
  estimatedHours INTEGER NOT NULL DEFAULT 10,
  status TEXT NOT NULL DEFAULT '未着手',
  memo TEXT NOT NULL DEFAULT ''
);

-- name: tableInfo
PRAGMA table_info(backlog);

-- name: list
SELECT id, title, type, platform, yearsStacked, estimatedHours, status, memo
FROM backlog
WHERE (? = '' OR type = ?)
  AND (? = '' OR status = ?)
  AND (? = '' OR LOWER(title) LIKE ? OR LOWER(platform) LIKE ? OR LOWER(memo) LIKE ?)
ORDER BY id ASC;

-- name: findById
SELECT id, title, type, platform, yearsStacked, estimatedHours, status, memo
FROM backlog
WHERE id = ?;

-- name: insert
INSERT INTO backlog (title, type, platform, yearsStacked, estimatedHours, status, memo)
VALUES (?, ?, ?, ?, ?, ?, ?);

-- name: update
UPDATE backlog
SET title = ?, type = ?, platform = ?, yearsStacked = ?, estimatedHours = ?, status = ?, memo = ?
WHERE id = ?;

-- name: deleteById
DELETE FROM backlog
WHERE id = ?;
