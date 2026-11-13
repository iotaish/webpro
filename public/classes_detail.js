"use strict";

const detailRoot = document.querySelector("#class-detail-root");
const editForm = document.querySelector("#class-edit-form");
const deleteBtn = document.querySelector("#delete-btn");
const statusEl = document.querySelector("#status-message");

function showMessage(text, type) {
  statusEl.textContent = text;
  statusEl.className = "status-message " + type;
}

function syncFormValues(item) {
  document.title = item.course + " - 授業詳細";
  document.querySelector("#detail-heading").textContent = item.course + " の詳細";
  document.querySelector("#edit-course").value = item.course;
  document.querySelector("#edit-day").value = item.day;
  document.querySelector("#edit-period").value = item.period;
  document.querySelector("#edit-room").value = item.room;
  document.querySelector("#edit-teacher").value = item.teacher || "";
  document.querySelector("#edit-credits").value = String(item.credits);
  document.querySelector("#edit-memo").value = item.memo || "";
}

if (detailRoot && editForm) {
  const classId = detailRoot.dataset.id;

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      course: document.querySelector("#edit-course").value.trim(),
      day: document.querySelector("#edit-day").value.trim(),
      period: document.querySelector("#edit-period").value.trim(),
      room: document.querySelector("#edit-room").value.trim(),
      teacher: document.querySelector("#edit-teacher").value.trim(),
      credits: Number(document.querySelector("#edit-credits").value),
      memo: document.querySelector("#edit-memo").value.trim(),
    };

    try {
      const res = await fetch("/api/classes/" + encodeURIComponent(classId), {
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
      showMessage("授業情報を更新しました。", "success");
    } catch (err) {
      showMessage(err.message, "error");
    }
  });
}

if (detailRoot && deleteBtn) {
  const classId = detailRoot.dataset.id;

  deleteBtn.addEventListener("click", async () => {
    const courseName = document.querySelector("#edit-course").value.trim();
    if (!window.confirm(`「${courseName}」を削除しますか？`)) {
      return;
    }

    try {
      const res = await fetch("/api/classes/" + encodeURIComponent(classId), {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "削除に失敗しました");
      }
      window.location.href = "/classes";
    } catch (err) {
      showMessage(err.message, "error");
    }
  });
}
