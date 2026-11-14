"use strict";

const form = document.querySelector("#backlog-add-form");
const statusEl = document.querySelector("#status-message");

function showMessage(text, type) {
  statusEl.textContent = text;
  statusEl.className = "status-message " + type;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: document.querySelector("#title").value.trim(),
    type: document.querySelector("#type").value.trim(),
    platform: document.querySelector("#platform").value.trim(),
    yearsStacked: Number(document.querySelector("#yearsStacked").value),
    estimatedHours: Number(document.querySelector("#estimatedHours").value),
    status: document.querySelector("#status").value.trim(),
    memo: document.querySelector("#memo").value.trim(),
  };

  try {
    const res = await fetch("/api/backlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "登録に失敗しました");
    }
    window.location.href = "/backlog";
  } catch (err) {
    showMessage(err.message, "error");
  }
});
