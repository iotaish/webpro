"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1: message1, greet2: message2 });
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1: "Hello world", greet2: "Bon jour" });
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename: "./public/Apple_logo_black.svg", alt: "Apple Logo" });
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor(Math.random() * 6 + 1);
  let luck = '';
  if (num == 1) luck = '大吉';
  else if (num == 2) luck = '中吉';

  res.send('今日の運勢は' + luck + 'です');
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor(Math.random() * 6 + 1);
  let luck = '';
  if (num == 1) luck = '大吉';
  else if (num == 2) luck = '中吉';

  res.render('omikuji2', { result: luck });
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win);
  let total = Number(req.query.total);
  console.log({ hand, win, total });
  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  let judgement = '';
  if (num == 1) cpu = 'グー';
  else if (num == 2) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する
  judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render('janken', display);
});

app.get("/janken2", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win) || 0;
  let draw = Number(req.query.draw) || 0;
  let total = Number(req.query.total) || 0;
  console.log({ hand, win, draw, total });
  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = "";
  let judgement = "";
  if (num == 1) cpu = "グー";
  else if (num == 2) cpu = "チョキ";
  else cpu = "パー";

  if (hand === cpu) {
    judgement = "あいこ";
    draw += 1;
  } else if (
    (hand === "グー" && cpu === "チョキ") ||
    (hand === "チョキ" && cpu === "パー") ||
    (hand === "パー" && cpu === "グー")
  ) {
    judgement = "勝ち";
    win += 1;
  } else {
    judgement = "負け";
  }
  total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    draw: draw,
    total: total,
  };
  res.render("janken2", display);
});

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db1', { data: station });
});

app.post("/keiyo_add", (req, res) => {
  const body = req.body || {};
  let id = Number(body.id);
  let code = body.code;
  let name = body.name;
  let newdata = { id: id, code: code, name: name };
  station.push(newdata);
  res.redirect('/keiyo');
});

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE18", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:null, name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

app.get("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('keiyo2', {data: station2} );
});

app.get("/keiyo2/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_detail', {data: detail} );
});

const dbPath = process.env.TIMETABLE_DB_PATH || path.join(__dirname, "timetable.db");
const dbExists = fs.existsSync(dbPath);
const db = new DatabaseSync(dbPath);

const INITIAL_CLASSES = [
  {
    course: "Webプログラミング",
    day: "金",
    period: "3-4限",
    room: "7104",
    teacher: "須田 博之",
    credits: 2,
    memo: "Node.js / Express / REST API を用いた Web アプリケーション開発"
  },
  {
    course: "情報ネットワーク",
    day: "金",
    period: "2-3限",
    room: "1231",
    teacher: "",
    credits: 2,
    memo: "TCP/IP やルーティングなどネットワークの基礎を学ぶ"
  },
  {
    course: "アジャイルワーク１",
    day: "水",
    period: "5-8限",
    room: "7212",
    teacher: "",
    credits: 2,
    memo: "チーム開発と反復的なソフトウェア開発プロセスの実践"
  },
  {
    course: "建築構造材料",
    day: "金",
    period: "2-3限",
    room: "1102",
    teacher: "",
    credits: 2,
    memo: "建築に用いる構造材料の性質と設計上の扱い"
  },
  {
    course: "AI・プログラミング基礎演習",
    day: "金",
    period: "7-8限",
    room: "8103",
    teacher: "",
    credits: 2,
    memo: "プログラミングとデータ処理の基礎演習"
  }
];

function createClassesTable(database) {
  database.exec(`
    CREATE TABLE classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course TEXT NOT NULL,
      day TEXT NOT NULL,
      period TEXT NOT NULL,
      room TEXT NOT NULL,
      teacher TEXT NOT NULL DEFAULT '',
      credits INTEGER NOT NULL DEFAULT 2,
      memo TEXT NOT NULL DEFAULT ''
    )
  `);
}

if (!dbExists) {
  createClassesTable(db);
  const insert = db.prepare(
    "INSERT INTO classes (course, day, period, room, teacher, credits, memo) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const item of INITIAL_CLASSES) {
    insert.run(item.course, item.day, item.period, item.room, item.teacher, item.credits, item.memo);
  }
} else {
  const existingCols = new Set(
    db.prepare("PRAGMA table_info(classes)").all().map((col) => col.name)
  );
  if (existingCols.size === 0) {
    createClassesTable(db);
  } else {
    if (!existingCols.has("teacher")) {
      db.exec("ALTER TABLE classes ADD COLUMN teacher TEXT NOT NULL DEFAULT ''");
    }
    if (!existingCols.has("credits")) {
      db.exec("ALTER TABLE classes ADD COLUMN credits INTEGER NOT NULL DEFAULT 2");
    }
    if (!existingCols.has("memo")) {
      db.exec("ALTER TABLE classes ADD COLUMN memo TEXT NOT NULL DEFAULT ''");
    }
  }
}

const ALLOWED_CLASS_DAYS = ["月", "火", "水", "木", "金", "土"];
const CLASS_COLUMNS = "id, course, day, period, room, teacher, credits, memo";

function parsePositiveIntId(raw) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function parseClassPayload(body) {
  const data = body || {};
  const course = typeof data.course === "string" ? data.course.trim() : "";
  const day = typeof data.day === "string" ? data.day.trim() : "";
  const period = typeof data.period === "string" ? data.period.trim() : "";
  const room = typeof data.room === "string" ? data.room.trim() : "";
  const teacher = typeof data.teacher === "string" ? data.teacher.trim() : "";
  const memo = typeof data.memo === "string" ? data.memo.trim() : "";
  const creditsRaw = data.credits === undefined || data.credits === "" ? 2 : Number(data.credits);

  if (!course || !day || !period || !room) {
    return { error: "科目名・曜日・時限・教室は必須です。" };
  }
  if (!ALLOWED_CLASS_DAYS.includes(day)) {
    return { error: "曜日は 月〜土 のいずれかを指定してください。" };
  }
  if (!Number.isInteger(creditsRaw) || creditsRaw < 1 || creditsRaw > 10) {
    return { error: "単位数は 1〜10 の整数で指定してください。" };
  }

  return {
    value: {
      course,
      day,
      period,
      room,
      teacher,
      credits: creditsRaw,
      memo
    }
  };
}

app.get("/classes", (req, res) => {
  const rows = db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes ORDER BY id ASC`).all();
  res.render("classes", { data: rows, days: ALLOWED_CLASS_DAYS });
});

app.get("/classes/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const detail = id
    ? db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id)
    : null;
  if (!detail) {
    return res.status(404).render("classes_detail", { data: null, id: req.params.id, days: ALLOWED_CLASS_DAYS });
  }
  res.render("classes_detail", { data: detail, days: ALLOWED_CLASS_DAYS });
});

app.get("/api/classes", (req, res) => {
  const dayFilter = typeof req.query.day === "string" ? req.query.day.trim() : "";
  const keyword = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";

  const conditions = [];
  const params = [];
  if (dayFilter) {
    conditions.push("day = ?");
    params.push(dayFilter);
  }
  if (keyword) {
    conditions.push("(LOWER(course) LIKE ? OR LOWER(room) LIKE ? OR LOWER(teacher) LIKE ? OR LOWER(memo) LIKE ?)");
    const likePattern = `%${keyword}%`;
    params.push(likePattern, likePattern, likePattern, likePattern);
  }

  const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
  const filtered = db.prepare(
    `SELECT ${CLASS_COLUMNS} FROM classes${whereClause} ORDER BY id ASC`
  ).all(...params);

  res.json({ data: filtered });
});

app.get("/api/classes/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const detail = id
    ? db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id)
    : null;
  if (!detail) {
    return res.status(404).json({ error: "指定された授業が見つかりません。" });
  }
  res.json({ data: detail });
});

app.post("/api/classes", (req, res) => {
  const parsed = parseClassPayload(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  const v = parsed.value;
  const result = db.prepare(
    "INSERT INTO classes (course, day, period, room, teacher, credits, memo) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(v.course, v.day, v.period, v.room, v.teacher, v.credits, v.memo);
  const newClass = db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(Number(result.lastInsertRowid));
  res.status(201).json({ data: newClass });
});

app.put("/api/classes/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const target = id
    ? db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id)
    : null;
  if (!target) {
    return res.status(404).json({ error: "指定された授業が見つかりません。" });
  }
  const parsed = parseClassPayload(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  const v = parsed.value;
  db.prepare(
    "UPDATE classes SET course = ?, day = ?, period = ?, room = ?, teacher = ?, credits = ?, memo = ? WHERE id = ?"
  ).run(v.course, v.day, v.period, v.room, v.teacher, v.credits, v.memo, id);
  const updated = db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id);
  res.json({ data: updated });
});

app.delete("/api/classes/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const target = id
    ? db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id)
    : null;
  if (!target) {
    return res.status(404).json({ error: "指定された授業が見つかりません。" });
  }
  db.prepare("DELETE FROM classes WHERE id = ?").run(id);
  res.json({ deleted: target });
});

const backlogDbPath = process.env.BACKLOG_DB_PATH || path.join(__dirname, "backlog.db");
const backlogDbExists = fs.existsSync(backlogDbPath);
const backlogDb = new DatabaseSync(backlogDbPath);

const INITIAL_BACKLOG = [
  {
    title: "ゼルダの伝説 ティアーズ オブ ザ キングダム",
    type: "ゲーム",
    platform: "Switch",
    yearsStacked: 1,
    estimatedHours: 80,
    status: "進行中",
    memo: "メインストーリー中盤、空島の探索を進行中"
  },
  {
    title: "リーダブルコード",
    type: "書籍",
    platform: "技術書",
    yearsStacked: 2,
    estimatedHours: 8,
    status: "未着手",
    memo: "変数名・関数分割の設計指針を整理するために購入"
  },
  {
    title: "ELDEN RING",
    type: "ゲーム",
    platform: "PC(Steam)",
    yearsStacked: 2,
    estimatedHours: 100,
    status: "未着手",
    memo: "セール時に購入しまとまった休みに遊ぶ予定"
  },
  {
    title: "Webを支える技術",
    type: "書籍",
    platform: "技術書",
    yearsStacked: 1,
    estimatedHours: 12,
    status: "完了",
    memo: "HTTPメソッドとREST設計の基礎理解のため読了"
  },
  {
    title: "積読中のSF長編小説",
    type: "書籍",
    platform: "文庫",
    yearsStacked: 3,
    estimatedHours: 15,
    status: "断念",
    memo: "序盤で止まったまま別作品へ移行"
  }
];

function createBacklogTable(database) {
  database.exec(`
    CREATE TABLE backlog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      platform TEXT NOT NULL,
      yearsStacked INTEGER NOT NULL DEFAULT 0,
      estimatedHours INTEGER NOT NULL DEFAULT 10,
      status TEXT NOT NULL DEFAULT '未着手',
      memo TEXT NOT NULL DEFAULT ''
    )
  `);
}

if (!backlogDbExists) {
  createBacklogTable(backlogDb);
  const insertBacklog = backlogDb.prepare(
    "INSERT INTO backlog (title, type, platform, yearsStacked, estimatedHours, status, memo) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  for (const item of INITIAL_BACKLOG) {
    insertBacklog.run(
      item.title,
      item.type,
      item.platform,
      item.yearsStacked,
      item.estimatedHours,
      item.status,
      item.memo
    );
  }
} else {
  const existingCols = backlogDb.prepare("PRAGMA table_info(backlog)").all();
  if (existingCols.length === 0) {
    createBacklogTable(backlogDb);
  }
}

const ALLOWED_BACKLOG_TYPES = ["ゲーム", "書籍"];
const ALLOWED_BACKLOG_STATUSES = ["未着手", "進行中", "完了", "断念"];
const BACKLOG_COLUMNS = "id, title, type, platform, yearsStacked, estimatedHours, status, memo";

function parseOptionalInt(raw, fallback) {
  if (raw === undefined || raw === null || raw === "") {
    return fallback;
  }
  if (typeof raw === "boolean") {
    return NaN;
  }
  return Number(raw);
}

function parseBacklogPayload(body) {
  const data = body || {};
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const type = typeof data.type === "string" ? data.type.trim() : "";
  const platform = typeof data.platform === "string" ? data.platform.trim() : "";
  const status = typeof data.status === "string" && data.status.trim() ? data.status.trim() : "未着手";
  const memo = typeof data.memo === "string" ? data.memo.trim() : "";
  const yearsStacked = parseOptionalInt(data.yearsStacked, 0);
  const estimatedHours = parseOptionalInt(data.estimatedHours, 10);

  if (!title || !type || !platform) {
    return { error: "タイトル・種別・媒体/プラットフォームは必須です。" };
  }
  if (!ALLOWED_BACKLOG_TYPES.includes(type)) {
    return { error: "種別は ゲーム / 書籍 のいずれかを指定してください。" };
  }
  if (!ALLOWED_BACKLOG_STATUSES.includes(status)) {
    return { error: "ステータスは 未着手 / 進行中 / 完了 / 断念 のいずれかを指定してください。" };
  }
  if (!Number.isInteger(yearsStacked) || yearsStacked < 0 || yearsStacked > 50) {
    return { error: "積み年数は 0〜50 の整数で指定してください。" };
  }
  if (!Number.isInteger(estimatedHours) || estimatedHours < 1 || estimatedHours > 1000) {
    return { error: "想定所要時間は 1〜1000 の整数で指定してください。" };
  }

  return {
    value: {
      title,
      type,
      platform,
      yearsStacked,
      estimatedHours,
      status,
      memo
    }
  };
}

app.get("/backlog", (req, res) => {
  const rows = backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog ORDER BY id ASC`).all();
  res.render("backlog", {
    data: rows,
    types: ALLOWED_BACKLOG_TYPES,
    statuses: ALLOWED_BACKLOG_STATUSES
  });
});

app.get("/backlog/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const detail = id
    ? backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id)
    : null;
  if (!detail) {
    return res.status(404).render("backlog_detail", {
      data: null,
      id: req.params.id,
      types: ALLOWED_BACKLOG_TYPES,
      statuses: ALLOWED_BACKLOG_STATUSES
    });
  }
  res.render("backlog_detail", {
    data: detail,
    types: ALLOWED_BACKLOG_TYPES,
    statuses: ALLOWED_BACKLOG_STATUSES
  });
});

app.get("/api/backlog", (req, res) => {
  const typeFilter = typeof req.query.type === "string" ? req.query.type.trim() : "";
  const statusFilter = typeof req.query.status === "string" ? req.query.status.trim() : "";
  const keyword = typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";

  const conditions = [];
  const params = [];
  if (typeFilter) {
    conditions.push("type = ?");
    params.push(typeFilter);
  }
  if (statusFilter) {
    conditions.push("status = ?");
    params.push(statusFilter);
  }
  if (keyword) {
    conditions.push("(LOWER(title) LIKE ? OR LOWER(platform) LIKE ? OR LOWER(memo) LIKE ?)");
    const likePattern = `%${keyword}%`;
    params.push(likePattern, likePattern, likePattern);
  }

  const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
  const filtered = backlogDb.prepare(
    `SELECT ${BACKLOG_COLUMNS} FROM backlog${whereClause} ORDER BY id ASC`
  ).all(...params);

  res.json({ data: filtered });
});

app.get("/api/backlog/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const detail = id
    ? backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id)
    : null;
  if (!detail) {
    return res.status(404).json({ error: "指定された積みアイテムが見つかりません。" });
  }
  res.json({ data: detail });
});

app.post("/api/backlog", (req, res) => {
  const parsed = parseBacklogPayload(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  const v = parsed.value;
  const result = backlogDb.prepare(
    "INSERT INTO backlog (title, type, platform, yearsStacked, estimatedHours, status, memo) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(v.title, v.type, v.platform, v.yearsStacked, v.estimatedHours, v.status, v.memo);
  const created = backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(Number(result.lastInsertRowid));
  res.status(201).json({ data: created });
});

app.put("/api/backlog/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const target = id
    ? backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id)
    : null;
  if (!target) {
    return res.status(404).json({ error: "指定された積みアイテムが見つかりません。" });
  }
  const parsed = parseBacklogPayload(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  const v = parsed.value;
  backlogDb.prepare(
    "UPDATE backlog SET title = ?, type = ?, platform = ?, yearsStacked = ?, estimatedHours = ?, status = ?, memo = ? WHERE id = ?"
  ).run(v.title, v.type, v.platform, v.yearsStacked, v.estimatedHours, v.status, v.memo, id);
  const updated = backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id);
  res.json({ data: updated });
});

app.delete("/api/backlog/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const target = id
    ? backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id)
    : null;
  if (!target) {
    return res.status(404).json({ error: "指定された積みアイテムが見つかりません。" });
  }
  backlogDb.prepare("DELETE FROM backlog WHERE id = ?").run(id);
  res.json({ deleted: target });
});

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
