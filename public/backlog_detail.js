"use strict";

const detailRoot = document.querySelector("#backlog-detail-root");
const editForm = document.querySelector("#backlog-edit-form");
const deleteBtn = document.querySelector("#delete-btn");
const statusEl = document.querySelector("#status-message");

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

function syncFormValues(item) {
  document.title = item.title + " - 詳細";
  document.querySelector("#detail-heading").textContent = item.title + " の詳細";
  document.querySelector("#edit-title").value = item.title;
  document.querySelector("#edit-type").value = item.type;
  document.querySelector("#edit-platform").value = item.platform;
  document.querySelector("#edit-years").value = String(item.yearsStacked);
  document.querySelector("#edit-hours").value = String(item.estimatedHours);
  document.querySelector("#edit-status").value = item.status;
  document.querySelector("#edit-memo").value = item.memo || "";
}

if (detailRoot && editForm) {
  const itemId = detailRoot.dataset.id;

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      title: document.querySelector("#edit-title").value.trim(),
      type: document.querySelector("#edit-type").value.trim(),
      platform: document.querySelector("#edit-platform").value.trim(),
      yearsStacked: Number(document.querySelector("#edit-years").value),
      estimatedHours: Number(document.querySelector("#edit-hours").value),
      status: document.querySelector("#edit-status").value.trim(),
      memo: document.querySelector("#edit-memo").value.trim(),
    };

    try {
      const res = await fetch("/api/backlog/" + encodeURIComponent(itemId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "更新に失敗しました");
      }
      syncFormValues(json.data);
      showMessage("アイテム情報を更新しました。", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  });
}

if (detailRoot && deleteBtn) {
  const itemId = detailRoot.dataset.id;

  deleteBtn.addEventListener("click", async () => {
    const title = document.querySelector("#edit-title").value.trim();
    if (!window.confirm(`「${title}」を削除しますか？`)) {
      return;
    }

    try {
      const res = await fetch("/api/backlog/" + encodeURIComponent(itemId), {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "削除に失敗しました");
      }
      window.location.href = "/backlog";
    } catch (err) {
      showMessage(err.message, "error");
    }
  });
}
