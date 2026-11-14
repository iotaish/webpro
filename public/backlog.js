"use strict";

const tableBody = document.querySelector("#backlog-tbody");
const statusEl = document.querySelector("#status-message");
const reloadBtn = document.querySelector("#reload-btn");
const typeSelect = document.querySelector("#filter-type");
const statusSelect = document.querySelector("#filter-status");
const keywordInput = document.querySelector("#filter-keyword");
const resetFilterBtn = document.querySelector("#reset-filter-btn");
const summaryCountEl = document.querySelector("#summary-count");
const summaryHoursEl = document.querySelector("#summary-hours");

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
  const pendingHours = list
    .filter((item) => item.status === "未着手" || item.status === "進行中")
    .reduce((sum, item) => sum + Number(item.estimatedHours || 0), 0);
  summaryCountEl.textContent = String(list.length);
  summaryHoursEl.textContent = String(pendingHours);
}

function renderRows(items) {
  tableBody.textContent = "";
  updateSummary(items);

  if (!items || items.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 8;
    td.textContent = "該当するアイテムはありません。";
    tr.appendChild(td);
    tableBody.appendChild(tr);
    return;
  }

  for (const row of items) {
    const tr = document.createElement("tr");

    const idTd = document.createElement("td");
    idTd.textContent = String(row.id);

    const titleTd = document.createElement("td");
    const link = document.createElement("a");
    link.href = "/backlog/" + encodeURIComponent(row.id);
    link.textContent = row.title;
    titleTd.appendChild(link);

    const typeTd = document.createElement("td");
    typeTd.textContent = row.type;

    const platformTd = document.createElement("td");
    platformTd.textContent = row.platform;

    const yearsTd = document.createElement("td");
    yearsTd.textContent = String(row.yearsStacked) + "年";

    const hoursTd = document.createElement("td");
    hoursTd.textContent = String(row.estimatedHours) + "時間";

    const statusTd = document.createElement("td");
    statusTd.textContent = row.status;

    const actionTd = document.createElement("td");
    actionTd.className = "actions";

    const detailLink = document.createElement("a");
    detailLink.href = "/backlog/" + encodeURIComponent(row.id);
    detailLink.className = "btn";
    detailLink.textContent = "詳細・編集";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-danger delete-btn";
    deleteBtn.dataset.id = String(row.id);
    deleteBtn.dataset.title = row.title;
    deleteBtn.textContent = "削除";

    actionTd.appendChild(detailLink);
    actionTd.appendChild(deleteBtn);

    tr.appendChild(idTd);
    tr.appendChild(titleTd);
    tr.appendChild(typeTd);
    tr.appendChild(platformTd);
    tr.appendChild(yearsTd);
    tr.appendChild(hoursTd);
    tr.appendChild(statusTd);
    tr.appendChild(actionTd);

    tableBody.appendChild(tr);
  }
}

async function fetchBacklog() {
  const params = new URLSearchParams();
  if (typeSelect && typeSelect.value) {
    params.set("type", typeSelect.value);
  }
  if (statusSelect && statusSelect.value) {
    params.set("status", statusSelect.value);
  }
  if (keywordInput && keywordInput.value.trim()) {
    params.set("q", keywordInput.value.trim());
  }
  const query = params.toString();
  const url = query ? "/api/backlog?" + query : "/api/backlog";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("一覧の取得に失敗しました");
  }
  const json = await res.json();
  renderRows(json.data);
}

async function deleteBacklogItem(id, title) {
  if (!window.confirm(`「${title}」を削除しますか？`)) {
    return;
  }

  try {
    const res = await fetch("/api/backlog/" + encodeURIComponent(id), {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "削除に失敗しました");
    }
    await fetchBacklog();
    showMessage(`「${title}」を削除しました。`, "success");
  } catch (err) {
    showMessage(err.message, "error");
  }
}

tableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("delete-btn")) {
    const id = target.dataset.id;
    const title = target.dataset.title || "";
    deleteBacklogItem(id, title);
  }
});

if (reloadBtn) {
  reloadBtn.addEventListener("click", async () => {
    try {
      await fetchBacklog();
      showMessage("最新の積みゲー・積読一覧を再取得しました。", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  });
}

if (typeSelect) {
  typeSelect.addEventListener("change", () => {
    fetchBacklog().catch((err) => showMessage(err.message, "error"));
  });
}

if (statusSelect) {
  statusSelect.addEventListener("change", () => {
    fetchBacklog().catch((err) => showMessage(err.message, "error"));
  });
}

if (keywordInput) {
  keywordInput.addEventListener("input", () => {
    fetchBacklog().catch((err) => showMessage(err.message, "error"));
  });
}

if (resetFilterBtn) {
  resetFilterBtn.addEventListener("click", () => {
    typeSelect.value = "";
    statusSelect.value = "";
    keywordInput.value = "";
    fetchBacklog().catch((err) => showMessage(err.message, "error"));
  });
}
