"use strict";

const tableBody = document.querySelector("#classes-tbody");
const statusEl = document.querySelector("#status-message");
const reloadBtn = document.querySelector("#reload-btn");
const daySelect = document.querySelector("#filter-day");
const keywordInput = document.querySelector("#filter-keyword");
const resetFilterBtn = document.querySelector("#reset-filter-btn");
const summaryCountEl = document.querySelector("#summary-count");
const summaryCreditsEl = document.querySelector("#summary-credits");

let statusTimerId = null;

function showMessage(text, type) {
  if (statusTimerId !== null) {
    clearTimeout(statusTimerId);
    statusTimerId = null;
  }
  statusEl.textContent = text;
  if (type === "success") {
    statusEl.className = "status-message success toast";
    statusTimerId = setTimeout(() => {
      statusEl.className = "status-message";
      statusEl.textContent = "";
      statusTimerId = null;
    }, 1800);
  } else {
    statusEl.className = "status-message " + type;
  }
}

function updateSummary(items) {
  const list = items || [];
  const totalCredits = list.reduce((sum, item) => sum + Number(item.credits || 0), 0);
  summaryCountEl.textContent = String(list.length);
  summaryCreditsEl.textContent = String(totalCredits);
}

function renderRows(items) {
  tableBody.textContent = "";
  updateSummary(items);

  if (!items || items.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.textContent = "該当する授業はありません。";
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
  const params = new URLSearchParams();
  if (daySelect && daySelect.value) {
    params.set("day", daySelect.value);
  }
  if (keywordInput && keywordInput.value.trim()) {
    params.set("q", keywordInput.value.trim());
  }
  const query = params.toString();
  const url = query ? "/api/classes?" + query : "/api/classes";

  const res = await fetch(url);
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

if (daySelect) {
  daySelect.addEventListener("change", () => {
    fetchClasses().catch((err) => showMessage(err.message, "error"));
  });
}

if (keywordInput) {
  keywordInput.addEventListener("input", () => {
    fetchClasses().catch((err) => showMessage(err.message, "error"));
  });
}

if (resetFilterBtn) {
  resetFilterBtn.addEventListener("click", () => {
    daySelect.value = "";
    keywordInput.value = "";
    fetchClasses().catch((err) => showMessage(err.message, "error"));
  });
}
