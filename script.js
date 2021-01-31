const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdown-form");
const dateEl = document.getElementById("date-picker");

const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");

const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");
const completeBg = document.querySelector("img");

let countdownTitle = "";
let countdownDate = "";
let countdownValue = 0;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set date input min with today's date
const today = new Date().toISOString().split("T")[0]; // UTC
dateEl.setAttribute("min", today);

function showInput() {
  inputContainer.hidden = false;
  countdownEl.hidden = true;
  completeEl.hidden = true;
  completeBg.hidden = true;
}

function showCountdown() {
  countdownEl.hidden = false;
  inputContainer.hidden = true;
  completeEl.hidden = true;
  completeBg.hidden = true;
}

function showComplete() {
  completeEl.hidden = false;
  completeBg.hidden = false;
  inputContainer.hidden = true;
  countdownEl.hidden = true;
}

function updateDOMForCountdown() {
  countdownActive = setInterval(() => {
    const _now = new Date().getTime();
    const distance = countdownValue - _now;

    const days = (distance / day) << 0;
    const hours = ((distance % day) / hour) << 0;
    const minutes = ((distance % hour) / minute) << 0;
    const seconds = ((distance % minute) / second) << 0;
    const timeNums = [days, hours, minutes, seconds];

    if (distance < 0) {
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      showComplete();
    } else {
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements.forEach((el, i) => {
        el.textContent = timeNums[i];
      });
      showCountdown();
    }
  }, second);
}

function updateCountdown(e) {
  // Prevent button from submitting a form with a network request and refreshing page
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));
  // Get current date in milliseconds
  if (countdownDate === "") {
    alert("Please select a date for the countdown.");
  } else {
    countdownValue = new Date(countdownDate).getTime();
    updateDOMForCountdown();
  }
}

function reset() {
  showInput();
  clearInterval(countdownActive);
  countdownTitle = "";
  countdownDate = "";
  localStorage.removeItem("countdown");
}

countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", reset);
completeBtn.addEventListener("click", reset);

function restoreCountdown() {
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOMForCountdown();
  }
}

// On load
restoreCountdown();
