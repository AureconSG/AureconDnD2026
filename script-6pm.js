const eventTime = new Date("2026-12-04T18:00:00+08:00").getTime();
const envelope = document.getElementById("envelope");
const openPrompt = document.getElementById("openPrompt");
const modal = document.getElementById("videoModal");
const video = document.getElementById("clueVideo");
const closeVideo = document.getElementById("closeVideo");
const replay = document.getElementById("replay");
let opened = false;
let lastTrigger = null;

function pad(value) {
  return String(value).padStart(2, "0");
}

function setCountdownUnit(unit, value) {
  document.querySelectorAll(`[data-unit="${unit}"]`).forEach((element) => {
    element.textContent = pad(value);
  });
}

function updateCountdown() {
  const remaining = Math.max(0, eventTime - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining / 3600000) % 24),
    minutes: Math.floor((remaining / 60000) % 60),
    seconds: Math.floor((remaining / 1000) % 60),
  };

  Object.entries(values).forEach(([unit, value]) => setCountdownUnit(unit, value));
  const label = `${values.days} days, ${values.hours} hours, ${values.minutes} minutes and ${values.seconds} seconds until registration at 6PM Singapore time`;
  document.querySelectorAll("[data-countdown]").forEach((element) => {
    element.setAttribute("aria-label", label);
  });
}

function showVideo(trigger) {
  lastTrigger = trigger || document.activeElement;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  closeVideo.focus();
  video.play().catch(() => {});
}

function hideVideo() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  video.pause();
  if (lastTrigger instanceof HTMLElement) lastTrigger.focus();
}

function openInvitation(event) {
  if (opened) {
    showVideo(event.currentTarget);
    return;
  }
  opened = true;
  envelope.classList.add("is-open");
  envelope.setAttribute("aria-label", "Invitation opened");
  openPrompt.innerHTML = '<span aria-hidden="true">▶</span> Play invitation';
  window.setTimeout(() => showVideo(event.currentTarget), 1450);
}

function replayInvitation() {
  hideVideo();
  video.currentTime = 0;
  opened = false;
  envelope.classList.remove("is-open");
  envelope.setAttribute("aria-label", "Open invitation");
  openPrompt.textContent = "Tap the envelope to open your clue";
}

envelope.addEventListener("click", openInvitation);
openPrompt.addEventListener("click", openInvitation);
closeVideo.addEventListener("click", hideVideo);
replay.addEventListener("click", replayInvitation);
modal.addEventListener("mousedown", (event) => {
  if (event.target === modal) hideVideo();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) hideVideo();
});

updateCountdown();
window.setInterval(updateCountdown, 1000);
