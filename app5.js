"use strict";
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

let nextClassId = 6;
const classes = [
  {
    id: 1,
    course: "Webプログラミング",
    day: "金",
    period: "3-4限",
    room: "7104",
    teacher: "須田 博之",
    credits: 2,
    memo: "Node.js / Express / REST API を用いた Web アプリケーション開発"
  },
  {
    id: 2,
    course: "情報ネットワーク",
    day: "金",
    period: "2-3限",
    room: "1231",
    teacher: "未設定",
    credits: 2,
    memo: "TCP/IP やルーティングなどネットワークの基礎を学ぶ"
  },
  {
    id: 3,
    course: "アジャイルワーク１",
    day: "水",
    period: "5-8限",
    room: "7212",
    teacher: "未設定",
    credits: 2,
    memo: "チーム開発と反復的なソフトウェア開発プロセスの実践"
  },
  {
    id: 4,
    course: "建築構造材料",
    day: "金",
    period: "2-3限",
    room: "1102",
    teacher: "未設定",
    credits: 2,
    memo: "建築に用いる構造材料の性質と設計上の扱い"
  },
  {
    id: 5,
    course: "AI・プログラミング基礎演習",
    day: "金",
    period: "7-8限",
    room: "8103",
    teacher: "未設定",
    credits: 2,
    memo: "プログラミングとデータ処理の基礎演習"
  }
];

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
  if (!Number.isFinite(creditsRaw) || creditsRaw < 1 || creditsRaw > 10) {
    return { error: "単位数は 1〜10 の数値で指定してください。" };
  }

  return {
    value: {
      course,
      day,
      period,
      room,
      teacher,
      credits: Math.floor(creditsRaw),
      memo
    }
  };
}

app.get("/classes", (req, res) => {
  res.render("classes", { data: classes });
});

app.get("/classes/:id", (req, res) => {
  const id = Number(req.params.id);
  const detail = Number.isInteger(id) ? classes.find((item) => item.id === id) : null;
  if (!detail) {
    return res.status(404).render("classes_detail", { data: null, id: req.params.id });
  }
  res.render("classes_detail", { data: detail });
});

app.get("/api/classes", (req, res) => {
  res.json({ data: classes });
});

app.get("/api/classes/:id", (req, res) => {
  const id = Number(req.params.id);
  const detail = Number.isInteger(id) ? classes.find((item) => item.id === id) : null;
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
  const newClass = {
    id: nextClassId++,
    ...parsed.value
  };
  classes.push(newClass);
  res.status(201).json({ data: newClass });
});

app.put("/api/classes/:id", (req, res) => {
  const id = Number(req.params.id);
  const target = Number.isInteger(id) ? classes.find((item) => item.id === id) : null;
  if (!target) {
    return res.status(404).json({ error: "指定された授業が見つかりません。" });
  }
  const parsed = parseClassPayload(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  Object.assign(target, parsed.value);
  res.json({ data: target });
});

app.delete("/api/classes/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = Number.isInteger(id) ? classes.findIndex((item) => item.id === id) : -1;
  if (index === -1) {
    return res.status(404).json({ error: "指定された授業が見つかりません。" });
  }
  const [deleted] = classes.splice(index, 1);
  res.json({ deleted });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
