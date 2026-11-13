"use strict";

const form = document.querySelector("#class-add-form");
const statusEl = document.querySelector("#status-message");

function showMessage(text, type) {
  statusEl.textContent = text;
  statusEl.className = "status-message " + type;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    course: document.querySelector("#course").value.trim(),
    day: document.querySelector("#day").value.trim(),
    period: document.querySelector("#period").value.trim(),
    room: document.querySelector("#room").value.trim(),
    teacher: document.querySelector("#teacher").value.trim(),
    credits: Number(document.querySelector("#credits").value),
    memo: document.querySelector("#memo").value.trim(),
  };

  try {
    const res = await fetch("/api/classes", {
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
    window.location.href = "/classes";
  } catch (err) {
    showMessage(err.message, "error");
  }
});
