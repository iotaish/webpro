-- name: createTable
CREATE TABLE classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course TEXT NOT NULL,
  day TEXT NOT NULL,
  period TEXT NOT NULL,
  room TEXT NOT NULL,
  teacher TEXT NOT NULL DEFAULT '',
  credits INTEGER NOT NULL DEFAULT 2,
  memo TEXT NOT NULL DEFAULT ''
);

-- name: tableInfo
PRAGMA table_info(classes);

-- name: addTeacherColumn
ALTER TABLE classes ADD COLUMN teacher TEXT NOT NULL DEFAULT '';

-- name: addCreditsColumn
ALTER TABLE classes ADD COLUMN credits INTEGER NOT NULL DEFAULT 2;

-- name: addMemoColumn
ALTER TABLE classes ADD COLUMN memo TEXT NOT NULL DEFAULT '';

-- name: list
SELECT id, course, day, period, room, teacher, credits, memo
FROM classes
WHERE (? = '' OR day = ?)
  AND (? = '' OR LOWER(course) LIKE ? OR LOWER(room) LIKE ? OR LOWER(teacher) LIKE ? OR LOWER(memo) LIKE ?)
ORDER BY id ASC;

-- name: findById
SELECT id, course, day, period, room, teacher, credits, memo
FROM classes
WHERE id = ?;

-- name: insert
INSERT INTO classes (course, day, period, room, teacher, credits, memo)
VALUES (?, ?, ?, ?, ?, ?, ?);

-- name: update
UPDATE classes
SET course = ?, day = ?, period = ?, room = ?, teacher = ?, credits = ?, memo = ?
WHERE id = ?;

-- name: deleteById
DELETE FROM classes
WHERE id = ?;
