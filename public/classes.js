"use strict";

const tableBody = document.querySelector("#classes-tbody");
const statusEl = document.querySelector("#status-message");
const reloadBtn = document.querySelector("#reload-btn");

function showMessage(text, type) {
  statusEl.textContent = text;
  statusEl.className = "status-message " + type;
}

function renderRows(items) {
  tableBody.textContent = "";

  if (!items || items.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.textContent = "登録されている授業はありません。";
    tr.appendChild(td);
    tableBody.appendChild(tr);
    return;
  }

  for (const row of items) {
    const tr = document.createElement("tr");

    const idTd = document.createElement("td");
    idTd.textContent = String(row.id);

    const courseTd = document.createElement("td");
    const link = document.createElement("a");
    link.href = "/classes/" + encodeURIComponent(row.id);
    link.textContent = row.course;
    courseTd.appendChild(link);

    const dayTd = document.createElement("td");
    dayTd.textContent = row.day;

    const periodTd = document.createElement("td");
    periodTd.textContent = row.period;

    const roomTd = document.createElement("td");
    roomTd.textContent = row.room;

    const creditsTd = document.createElement("td");
    creditsTd.textContent = String(row.credits);

    const actionTd = document.createElement("td");
    actionTd.className = "actions";

    const detailLink = document.createElement("a");
    detailLink.href = "/classes/" + encodeURIComponent(row.id);
    detailLink.className = "btn";
    detailLink.textContent = "詳細・編集";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-danger delete-btn";
    deleteBtn.dataset.id = String(row.id);
    deleteBtn.dataset.course = row.course;
    deleteBtn.textContent = "削除";

    actionTd.appendChild(detailLink);
    actionTd.appendChild(deleteBtn);

    tr.appendChild(idTd);
    tr.appendChild(courseTd);
    tr.appendChild(dayTd);
    tr.appendChild(periodTd);
    tr.appendChild(roomTd);
    tr.appendChild(creditsTd);
    tr.appendChild(actionTd);

    tableBody.appendChild(tr);
  }
}

async function fetchClasses() {
  const res = await fetch("/api/classes");
  if (!res.ok) {
    throw new Error("一覧の取得に失敗しました");
  }
  const json = await res.json();
  renderRows(json.data);
}

async function deleteClass(id, course) {
  if (!window.confirm(`「${course}」を削除しますか？`)) {
    return;
  }

  try {
    const res = await fetch("/api/classes/" + encodeURIComponent(id), {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "削除に失敗しました");
    }
    await fetchClasses();
    showMessage(`「${course}」を削除しました。`, "success");
  } catch (err) {
    showMessage(err.message, "error");
  }
}

tableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("delete-btn")) {
    const id = target.dataset.id;
    const course = target.dataset.course || "";
    deleteClass(id, course);
  }
});

if (reloadBtn) {
  reloadBtn.addEventListener("click", async () => {
    try {
      await fetchClasses();
      showMessage("最新の授業一覧を再取得しました。", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  });
}
