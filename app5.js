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

app.get("/keiyo_add", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  res.redirect('/public/keiyo_add.html');
  // res.render('db1', { data: station });
});

const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync(__dirname + "/timetable.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY,
    course TEXT NOT NULL,
    day TEXT NOT NULL,
    period TEXT NOT NULL,
    room TEXT NOT NULL
  )
`);

const classCount = db.prepare("SELECT count(*) as cnt FROM classes").get().cnt;
if (classCount === 0) {
  const insert = db.prepare(
    "INSERT INTO classes (id, course, day, period, room) VALUES (?, ?, ?, ?, ?)"
  );
  insert.run(1, "Webプログラミング", "金", "3-4限", "7104");
  insert.run(2, "情報ネットワーク", "金", "2-3限", "1231");
  insert.run(3, "アジャイルワーク１", "水", "5-8限", "7212");
  insert.run(4, "建築構造材料", "金", "2-3限", "1102");
  insert.run(5, "AI・プログラミング基礎演習", "金", "7-8限", "8103");
}

app.get("/classes", (req, res) => {
  const classes = db.prepare("SELECT * FROM classes ORDER BY id ASC").all();
  res.render("classes", { data: classes });
});

app.post("/classes_add", (req, res) => {
  let id = Number(req.body.id);
  let course = req.body.course;
  let day = req.body.day;
  let period = req.body.period;
  let room = req.body.room;
  const insert = db.prepare(
    "INSERT OR REPLACE INTO classes (id, course, day, period, room) VALUES (?, ?, ?, ?, ?)"
  );
  insert.run(id, course, day, period, room);
  // 一覧画面にリダイレクトして追加結果をすぐに確認できるようにする
  res.redirect("/classes");
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
