"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

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
  res.render('keiyo2', { data: station2 });
});

app.get("/keiyo2/create", (req, res) => {
  res.redirect('/public/keiyo2_new.html');
});

app.get("/keiyo2/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[number];
  res.render('keiyo2_detail', { id: number, data: detail });
});

app.get("/keiyo2/delete/:number", (req, res) => {
  // 本来は削除の確認ページを表示する
  // 本来は削除する番号が存在するか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  station2.splice(req.params.number, 1);
  res.redirect('/keiyo2');
});

app.post("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const id = station2.length + 1;
  const code = req.body.code;
  const name = req.body.name;
  const change = req.body.change;
  const passengers = req.body.passengers;
  const distance = req.body.distance;
  station2.push({ id: id, code: code, name: name, change: change, passengers: passengers, distance: distance });
  console.log(station2);
  res.render('keiyo2', { data: station2 });
});

app.get("/keiyo2/edit/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[number];
  res.render('keiyo2_edit', { id: number, data: detail });
});

app.post("/keiyo2/update/:number", (req, res) => {
  // 本来は変更する番号が存在するか，各項目が正しいか厳重にチェックする
  // 本来ならここにDBとのやり取りが入る
  station2[req.params.number].code = req.body.code;
  station2[req.params.number].name = req.body.name;
  station2[req.params.number].change = req.body.change;
  station2[req.params.number].passengers = req.body.passengers;
  station2[req.params.number].distance = req.body.distance;
  console.log(station2);
  res.redirect('/keiyo2');
});

const dbPath = process.env.TIMETABLE_DB_PATH || path.join(__dirname, "data", "timetable.db");
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
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
  const rows = db.prepare(
    `SELECT ${CLASS_COLUMNS} FROM classes${whereClause} ORDER BY id ASC`
  ).all(...params);

  res.render("classes", {
    data: rows,
    days: ALLOWED_CLASS_DAYS,
    day: dayFilter,
    q: typeof req.query.q === "string" ? req.query.q.trim() : ""
  });
});

app.get("/classes/create", (req, res) => {
  res.redirect("/public/classes_add.html");
});

app.get("/classes/edit/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const detail = id
    ? db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id)
    : null;
  if (!detail) {
    return res.status(404).render("classes_edit", { data: null, id: req.params.id, days: ALLOWED_CLASS_DAYS, error: null });
  }
  res.render("classes_edit", { data: detail, days: ALLOWED_CLASS_DAYS, error: null });
});

app.get("/classes/delete/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const detail = id
    ? db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id)
    : null;
  if (!detail) {
    return res.status(404).render("classes_delete", { data: null, id: req.params.id });
  }
  res.render("classes_delete", { data: detail });
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

app.post("/classes", (req, res) => {
  const parsed = parseClassPayload(req.body);
  if (parsed.error) {
    return res.status(400).send(parsed.error);
  }
  const v = parsed.value;
  db.prepare(
    "INSERT INTO classes (course, day, period, room, teacher, credits, memo) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(v.course, v.day, v.period, v.room, v.teacher, v.credits, v.memo);
  res.redirect("/classes");
});

app.post("/classes/update/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const target = id
    ? db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id)
    : null;
  if (!target) {
    return res.status(404).render("classes_edit", { data: null, id: req.params.id, days: ALLOWED_CLASS_DAYS, error: null });
  }
  const parsed = parseClassPayload(req.body);
  if (parsed.error) {
    return res.status(400).render("classes_edit", {
      data: { id, ...req.body },
      days: ALLOWED_CLASS_DAYS,
      error: parsed.error
    });
  }
  const v = parsed.value;
  db.prepare(
    "UPDATE classes SET course = ?, day = ?, period = ?, room = ?, teacher = ?, credits = ?, memo = ? WHERE id = ?"
  ).run(v.course, v.day, v.period, v.room, v.teacher, v.credits, v.memo, id);
  res.redirect(`/classes/${id}`);
});

app.post("/classes/delete/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const target = id
    ? db.prepare(`SELECT ${CLASS_COLUMNS} FROM classes WHERE id = ?`).get(id)
    : null;
  if (!target) {
    return res.status(404).render("classes_delete", { data: null, id: req.params.id });
  }
  db.prepare("DELETE FROM classes WHERE id = ?").run(id);
  res.redirect("/classes");
});

const backlogDbPath = process.env.BACKLOG_DB_PATH || path.join(__dirname, "data", "backlog.db");
fs.mkdirSync(path.dirname(backlogDbPath), { recursive: true });
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
  const rows = backlogDb.prepare(
    `SELECT ${BACKLOG_COLUMNS} FROM backlog${whereClause} ORDER BY id ASC`
  ).all(...params);

  res.render("backlog", {
    data: rows,
    types: ALLOWED_BACKLOG_TYPES,
    statuses: ALLOWED_BACKLOG_STATUSES,
    type: typeFilter,
    status: statusFilter,
    q: typeof req.query.q === "string" ? req.query.q.trim() : ""
  });
});

app.get("/backlog/create", (req, res) => {
  res.redirect("/public/backlog_add.html");
});

app.get("/backlog/edit/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const detail = id
    ? backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id)
    : null;
  if (!detail) {
    return res.status(404).render("backlog_edit", {
      data: null,
      id: req.params.id,
      types: ALLOWED_BACKLOG_TYPES,
      statuses: ALLOWED_BACKLOG_STATUSES,
      error: null
    });
  }
  res.render("backlog_edit", {
    data: detail,
    types: ALLOWED_BACKLOG_TYPES,
    statuses: ALLOWED_BACKLOG_STATUSES,
    error: null
  });
});

app.get("/backlog/delete/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const detail = id
    ? backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id)
    : null;
  if (!detail) {
    return res.status(404).render("backlog_delete", { data: null, id: req.params.id });
  }
  res.render("backlog_delete", { data: detail });
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

app.post("/backlog", (req, res) => {
  const parsed = parseBacklogPayload(req.body);
  if (parsed.error) {
    return res.status(400).send(parsed.error);
  }
  const v = parsed.value;
  backlogDb.prepare(
    "INSERT INTO backlog (title, type, platform, yearsStacked, estimatedHours, status, memo) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(v.title, v.type, v.platform, v.yearsStacked, v.estimatedHours, v.status, v.memo);
  res.redirect("/backlog");
});

app.post("/backlog/update/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const target = id
    ? backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id)
    : null;
  if (!target) {
    return res.status(404).render("backlog_edit", {
      data: null,
      id: req.params.id,
      types: ALLOWED_BACKLOG_TYPES,
      statuses: ALLOWED_BACKLOG_STATUSES,
      error: null
    });
  }
  const parsed = parseBacklogPayload(req.body);
  if (parsed.error) {
    return res.status(400).render("backlog_edit", {
      data: { id, ...req.body },
      types: ALLOWED_BACKLOG_TYPES,
      statuses: ALLOWED_BACKLOG_STATUSES,
      error: parsed.error
    });
  }
  const v = parsed.value;
  backlogDb.prepare(
    "UPDATE backlog SET title = ?, type = ?, platform = ?, yearsStacked = ?, estimatedHours = ?, status = ?, memo = ? WHERE id = ?"
  ).run(v.title, v.type, v.platform, v.yearsStacked, v.estimatedHours, v.status, v.memo, id);
  res.redirect(`/backlog/${id}`);
});

app.post("/backlog/delete/:id", (req, res) => {
  const id = parsePositiveIntId(req.params.id);
  const target = id
    ? backlogDb.prepare(`SELECT ${BACKLOG_COLUMNS} FROM backlog WHERE id = ?`).get(id)
    : null;
  if (!target) {
    return res.status(404).render("backlog_delete", { data: null, id: req.params.id });
  }
  backlogDb.prepare("DELETE FROM backlog WHERE id = ?").run(id);
  res.redirect("/backlog");
});

const aiAuditDbPath = process.env.AI_AUDIT_DB_PATH || path.join(__dirname, "data", "ai_audit.db");
fs.mkdirSync(path.dirname(aiAuditDbPath), { recursive: true });
const aiAuditDbExists = fs.existsSync(aiAuditDbPath);
const aiAuditDb = new DatabaseSync(aiAuditDbPath);

const INITIAL_AI_MODELS = [
  { provider: "OpenAI", modelName: "GPT-5.2", grade: "Frontier", inputPricePer1M: 1.75, outputPricePer1M: 14.0 },
  { provider: "OpenAI", modelName: "GPT-5 mini", grade: "Mini", inputPricePer1M: 0.25, outputPricePer1M: 2.0 },
  { provider: "Anthropic", modelName: "Claude Opus 4.5", grade: "Frontier", inputPricePer1M: 5.0, outputPricePer1M: 25.0 },
  { provider: "Anthropic", modelName: "Claude Sonnet 4.5", grade: "Standard", inputPricePer1M: 3.0, outputPricePer1M: 15.0 },
  { provider: "Google", modelName: "Gemini 2.5 Pro", grade: "Standard", inputPricePer1M: 1.25, outputPricePer1M: 10.0 },
  { provider: "Google", modelName: "Gemini 2.5 Flash", grade: "Mini", inputPricePer1M: 0.15, outputPricePer1M: 0.6 }
];

const INITIAL_AI_AUDITS = [
  {
    serviceName: "ChatGPT Plus",
    modelId: 1,
    billingCycle: "月額",
    contractFeeUsd: 20,
    inputTokensM: 4.5,
    outputTokensM: 1.2,
    status: "継続中",
    memo: "日常の設計相談・コードレビューで活用"
  },
  {
    serviceName: "Claude Max",
    modelId: 3,
    billingCycle: "月額",
    contractFeeUsd: 100,
    inputTokensM: 6.0,
    outputTokensM: 1.5,
    status: "要見直し",
    memo: "高負荷コーディング利用、Pro へのダウングレード候補"
  },
  {
    serviceName: "Google AI Pro (年額)",
    modelId: 5,
    billingCycle: "年額",
    contractFeeUsd: 240,
    inputTokensM: 8.0,
    outputTokensM: 1.8,
    status: "継続中",
    memo: "年額プランを月額 $20 相当で正規化"
  },
  {
    serviceName: "OpenAI API (Mini 検証)",
    modelId: 2,
    billingCycle: "従量のみ",
    contractFeeUsd: 0,
    inputTokensM: 12.0,
    outputTokensM: 3.0,
    status: "継続中",
    memo: "定額なしの純粋 API 従量利用"
  },
  {
    serviceName: "Claude Pro",
    modelId: 4,
    billingCycle: "月額",
    contractFeeUsd: 20,
    inputTokensM: 0.8,
    outputTokensM: 0.2,
    status: "解約候補",
    memo: "利用頻度が低下しているため API 従量移行を検討"
  }
];

function createAiAuditTables(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS ai_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT NOT NULL,
      modelName TEXT NOT NULL,
      grade TEXT NOT NULL,
      inputPricePer1M REAL NOT NULL,
      outputPricePer1M REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ai_audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      serviceName TEXT NOT NULL,
      modelId INTEGER NOT NULL,
      billingCycle TEXT NOT NULL,
      contractFeeUsd REAL NOT NULL DEFAULT 0,
      inputTokensM REAL NOT NULL DEFAULT 0,
      outputTokensM REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT '継続中',
      memo TEXT NOT NULL DEFAULT ''
    );
  `);
}

if (!aiAuditDbExists) {
  createAiAuditTables(aiAuditDb);
  const insertModel = aiAuditDb.prepare(
    "INSERT INTO ai_models (provider, modelName, grade, inputPricePer1M, outputPricePer1M) VALUES (?, ?, ?, ?, ?)"
  );
  for (const model of INITIAL_AI_MODELS) {
    insertModel.run(model.provider, model.modelName, model.grade, model.inputPricePer1M, model.outputPricePer1M);
  }
  const insertAudit = aiAuditDb.prepare(
    "INSERT INTO ai_audits (serviceName, modelId, billingCycle, contractFeeUsd, inputTokensM, outputTokensM, status, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  for (const item of INITIAL_AI_AUDITS) {
    insertAudit.run(
      item.serviceName,
      item.modelId,
      item.billingCycle,
      item.contractFeeUsd,
      item.inputTokensM,
      item.outputTokensM,
      item.status,
      item.memo
    );
  }
} else {
  const existingModels = aiAuditDb.prepare("PRAGMA table_info(ai_models)").all();
  const existingAudits = aiAuditDb.prepare("PRAGMA table_info(ai_audits)").all();
  if (existingModels.length === 0 || existingAudits.length === 0) {
    createAiAuditTables(aiAuditDb);
  }
}

const ALLOWED_AI_GRADES = ["Frontier", "Standard", "Mini"];
const ALLOWED_AI_BILLING_CYCLES = ["月額", "年額", "従量のみ"];
const ALLOWED_AI_STATUSES = ["継続中", "要見直し", "解約候補"];

const AI_MONTHLY_COST_SQL =
  "CASE WHEN a.billingCycle = '年額' THEN a.contractFeeUsd / 12.0 WHEN a.billingCycle = '月額' THEN a.contractFeeUsd ELSE 0.0 END";
const AI_API_EQUIV_SQL =
  "(a.inputTokensM * m.inputPricePer1M + a.outputTokensM * m.outputPricePer1M)";
const AI_AUDIT_SELECT = `
  SELECT
    a.id,
    a.serviceName,
    a.modelId,
    a.billingCycle,
    a.contractFeeUsd,
    a.inputTokensM,
    a.outputTokensM,
    a.status,
    a.memo,
    m.provider,
    m.modelName,
    m.grade,
    m.inputPricePer1M,
    m.outputPricePer1M,
    (${AI_MONTHLY_COST_SQL}) AS monthlySubCostUsd,
    (${AI_API_EQUIV_SQL}) AS apiEquivalentUsd,
    ((${AI_API_EQUIV_SQL}) - (${AI_MONTHLY_COST_SQL})) AS savingsUsd
  FROM ai_audits a
  JOIN ai_models m ON a.modelId = m.id
`;

function parseOptionalNumber(raw, fallback) {
  if (raw === undefined || raw === null) {
    return fallback;
  }
  if (typeof raw === "boolean") {
    return NaN;
  }
  if (typeof raw === "string" && raw.trim() === "") {
    return fallback;
  }
  return Number(raw);
}

function listAiModels() {
  return aiAuditDb
    .prepare("SELECT id, provider, modelName, grade, inputPricePer1M, outputPricePer1M FROM ai_models ORDER BY id ASC")
    .all();
}

function findAiAuditById(rawId) {
  const id = parsePositiveIntId(rawId);
  if (!id) {
    return null;
  }
  return aiAuditDb.prepare(`${AI_AUDIT_SELECT} WHERE a.id = ?`).get(id) || null;
}

function buildAiAuditFilter(query) {
  const gradeFilter = typeof query.grade === "string" ? query.grade.trim() : "";
  const statusFilter = typeof query.status === "string" ? query.status.trim() : "";
  const rawQ = typeof query.q === "string" ? query.q.trim() : "";
  const keyword = rawQ.toLowerCase();

  const conditions = [];
  const params = [];
  if (gradeFilter) {
    conditions.push("m.grade = ?");
    params.push(gradeFilter);
  }
  if (statusFilter) {
    conditions.push("a.status = ?");
    params.push(statusFilter);
  }
  if (keyword) {
    conditions.push("(LOWER(a.serviceName) LIKE ? OR LOWER(m.modelName) LIKE ? OR LOWER(m.provider) LIKE ? OR LOWER(a.memo) LIKE ?)");
    const likePattern = `%${keyword}%`;
    params.push(likePattern, likePattern, likePattern, likePattern);
  }

  return {
    gradeFilter,
    statusFilter,
    rawQ,
    whereClause: conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "",
    params
  };
}

function parseAiAuditPayload(body) {
  const data = body || {};
  const serviceName = typeof data.serviceName === "string" ? data.serviceName.trim() : "";
  const modelId = parsePositiveIntId(data.modelId);
  const billingCycle = typeof data.billingCycle === "string" ? data.billingCycle.trim() : "";
  const contractFeeUsd = parseOptionalNumber(data.contractFeeUsd, 0);
  const inputTokensM = parseOptionalNumber(data.inputTokensM, 0);
  const outputTokensM = parseOptionalNumber(data.outputTokensM, 0);
  const status = typeof data.status === "string" && data.status.trim() ? data.status.trim() : "継続中";
  const memo = typeof data.memo === "string" ? data.memo.trim() : "";

  if (!serviceName || !modelId || !billingCycle) {
    return { error: "サービス・プラン名・利用モデル・契約周期は必須です。" };
  }
  const modelExists = aiAuditDb.prepare("SELECT id FROM ai_models WHERE id = ?").get(modelId);
  if (!modelExists) {
    return { error: "指定された利用モデルが存在しません。" };
  }
  if (!ALLOWED_AI_BILLING_CYCLES.includes(billingCycle)) {
    return { error: "契約周期は 月額 / 年額 / 従量のみ のいずれかを指定してください。" };
  }
  if (!ALLOWED_AI_STATUSES.includes(status)) {
    return { error: "監査ステータスは 継続中 / 要見直し / 解約候補 のいずれかを指定してください。" };
  }
  if (!Number.isFinite(contractFeeUsd) || contractFeeUsd < 0 || contractFeeUsd > 10000) {
    return { error: "契約額は 0〜10000 の数値で指定してください。" };
  }
  if (!Number.isFinite(inputTokensM) || inputTokensM < 0 || inputTokensM > 10000) {
    return { error: "月間入力トークン数は 0〜10000 の数値で指定してください。" };
  }
  if (!Number.isFinite(outputTokensM) || outputTokensM < 0 || outputTokensM > 10000) {
    return { error: "月間出力トークン数は 0〜10000 の数値で指定してください。" };
  }

  return {
    value: {
      serviceName,
      modelId,
      billingCycle,
      contractFeeUsd,
      inputTokensM,
      outputTokensM,
      status,
      memo
    }
  };
}

app.get("/ai-audit", (req, res) => {
  const { gradeFilter, statusFilter, rawQ, whereClause, params } = buildAiAuditFilter(req.query);
  const rows = aiAuditDb
    .prepare(`${AI_AUDIT_SELECT}${whereClause} ORDER BY a.id ASC`)
    .all(...params);
  const crossSummary = aiAuditDb.prepare(`
    SELECT
      m.provider,
      m.grade,
      COUNT(*) AS itemCount,
      ROUND(SUM(${AI_MONTHLY_COST_SQL}), 2) AS totalSubUsd,
      ROUND(SUM(${AI_API_EQUIV_SQL}), 2) AS totalApiUsd,
      ROUND(SUM((${AI_API_EQUIV_SQL}) - (${AI_MONTHLY_COST_SQL})), 2) AS totalSavingsUsd
    FROM ai_audits a
    JOIN ai_models m ON a.modelId = m.id
    ${whereClause}
    GROUP BY m.provider, m.grade
    ORDER BY m.provider ASC, CASE m.grade WHEN 'Frontier' THEN 1 WHEN 'Standard' THEN 2 ELSE 3 END ASC
  `).all(...params);

  res.render("ai_audit", {
    data: rows,
    crossSummary,
    grades: ALLOWED_AI_GRADES,
    statuses: ALLOWED_AI_STATUSES,
    grade: gradeFilter,
    status: statusFilter,
    q: rawQ
  });
});

app.get("/ai-audit/create", (req, res) => {
  res.redirect("/public/ai_audit_add.html");
});

app.get("/ai-audit/edit/:id", (req, res) => {
  const detail = findAiAuditById(req.params.id);
  const models = listAiModels();
  if (!detail) {
    return res.status(404).render("ai_audit_edit", {
      data: null,
      id: req.params.id,
      models,
      billingCycles: ALLOWED_AI_BILLING_CYCLES,
      statuses: ALLOWED_AI_STATUSES,
      error: null
    });
  }
  res.render("ai_audit_edit", {
    data: detail,
    models,
    billingCycles: ALLOWED_AI_BILLING_CYCLES,
    statuses: ALLOWED_AI_STATUSES,
    error: null
  });
});

app.get("/ai-audit/delete/:id", (req, res) => {
  const detail = findAiAuditById(req.params.id);
  if (!detail) {
    return res.status(404).render("ai_audit_delete", { data: null, id: req.params.id });
  }
  res.render("ai_audit_delete", { data: detail });
});

app.get("/ai-audit/:id", (req, res) => {
  const detail = findAiAuditById(req.params.id);
  if (!detail) {
    return res.status(404).render("ai_audit_detail", { data: null, id: req.params.id });
  }
  res.render("ai_audit_detail", { data: detail });
});

app.post("/ai-audit", (req, res) => {
  const parsed = parseAiAuditPayload(req.body);
  if (parsed.error) {
    return res.status(400).send(parsed.error);
  }
  const v = parsed.value;
  aiAuditDb.prepare(
    "INSERT INTO ai_audits (serviceName, modelId, billingCycle, contractFeeUsd, inputTokensM, outputTokensM, status, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(v.serviceName, v.modelId, v.billingCycle, v.contractFeeUsd, v.inputTokensM, v.outputTokensM, v.status, v.memo);
  res.redirect("/ai-audit");
});

app.post("/ai-audit/update/:id", (req, res) => {
  const target = findAiAuditById(req.params.id);
  const models = listAiModels();
  if (!target) {
    return res.status(404).render("ai_audit_edit", {
      data: null,
      id: req.params.id,
      models,
      billingCycles: ALLOWED_AI_BILLING_CYCLES,
      statuses: ALLOWED_AI_STATUSES,
      error: null
    });
  }
  const parsed = parseAiAuditPayload(req.body);
  if (parsed.error) {
    return res.status(400).render("ai_audit_edit", {
      data: { id: target.id, ...req.body },
      models,
      billingCycles: ALLOWED_AI_BILLING_CYCLES,
      statuses: ALLOWED_AI_STATUSES,
      error: parsed.error
    });
  }
  const v = parsed.value;
  aiAuditDb.prepare(
    "UPDATE ai_audits SET serviceName = ?, modelId = ?, billingCycle = ?, contractFeeUsd = ?, inputTokensM = ?, outputTokensM = ?, status = ?, memo = ? WHERE id = ?"
  ).run(v.serviceName, v.modelId, v.billingCycle, v.contractFeeUsd, v.inputTokensM, v.outputTokensM, v.status, v.memo, target.id);
  res.redirect(`/ai-audit/${target.id}`);
});

app.post("/ai-audit/delete/:id", (req, res) => {
  const target = findAiAuditById(req.params.id);
  if (!target) {
    return res.status(404).render("ai_audit_delete", { data: null, id: req.params.id });
  }
  aiAuditDb.prepare("DELETE FROM ai_audits WHERE id = ?").run(target.id);
  res.redirect("/ai-audit");
});

const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
