let deleteMode = false;
let allePins = [];
let pinBeingEdited = null;

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector(".pin");
  const popup = document.getElementById("popup");
  const confirmBtn = document.getElementById("confirmBtn");
  let placingPin = false;
  let currentPinData = {};
  let skipNextClick = false;

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "X";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "10px";
  closeBtn.style.background = "red";
  closeBtn.style.color = "white";
  closeBtn.style.border = "none";
  closeBtn.style.padding = "5px 10px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "16px";
  closeBtn.style.borderRadius = "5px";
  document.querySelector(".popup-content").appendChild(closeBtn);

  openBtn.addEventListener("click", () => {
    popup.classList.remove("hidden");
  });

  confirmBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();

    const text = document.getElementById('textInput').value;
    const date = document.getElementById('dateInput').value;

    currentPinData = { text, date };
    popup.classList.add("hidden");

    placingPin = true;
    skipNextClick = true;

    if (pinBeingEdited) {
      const index = allePins.findIndex(p => p.x === parseInt(pinBeingEdited.style.left) && p.y === parseInt(pinBeingEdited.style.top));
      if (index !== -1) {
        allePins.splice(index, 1);
        localStorage.setItem('pins', JSON.stringify(allePins));
      }
      pinBeingEdited.remove();
      pinBeingEdited = null;
    }
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");

    if (pinBeingEdited) {
      const index = allePins.findIndex(p => p.x === parseInt(pinBeingEdited.style.left) && p.y === parseInt(pinBeingEdited.style.top));
      if (index !== -1) {
        allePins.splice(index, 1);
        localStorage.setItem('pins', JSON.stringify(allePins));
      }
      pinBeingEdited.remove();
      pinBeingEdited = null;
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (placingPin) {
      let tempPin = document.querySelector(".temp-pin");
      if (!tempPin) {
        tempPin = document.createElement("div");
        tempPin.classList.add("pin-marker", "temp-pin", "dragging");
        document.body.appendChild(tempPin);
      }
      tempPin.style.left = `${e.pageX - 15}px`;
      tempPin.style.top = `${e.pageY - 15}px`;
    }
  });

  document.addEventListener("click", (e) => {
    if (placingPin) {
      if (skipNextClick) {
        skipNextClick = false;
        return;
      }

      e.preventDefault();

      const pin = document.createElement("div");
      pin.classList.add("pin-marker");
      pin.style.left = `${e.pageX - 15}px`;
      pin.style.top = `${e.pageY - 15}px`;
      pin.dataset.info = `Reiseziel: ${currentPinData.text}, Datum: ${currentPinData.date}`;

      pin.addEventListener("click", (ev) => {
        ev.stopPropagation();
        editPin(pin);
      });

      document.body.appendChild(pin);

      allePins.push({
        x: e.pageX - 15,
        y: e.pageY - 15,
        text: currentPinData.text,
        date: currentPinData.date
      });

      localStorage.setItem('pins', JSON.stringify(allePins));

      const tempPin = document.querySelector(".temp-pin");
      if (tempPin) tempPin.remove();

      placingPin = false;
    }
  });

  function editPin(pinElement) {
    const info = pinElement.dataset.info;
    const match = info.match(/Reiseziel: (.*), Datum: (.*)/);
    if (match) {
      const [, text, date] = match;
      document.getElementById('textInput').value = text;
      document.getElementById('dateInput').value = date;
      popup.classList.remove("hidden");

      placingPin = false;

      pinBeingEdited = pinElement;
    }
  }

  const gespeichertePins = JSON.parse(localStorage.getItem('pins')) || [];

  gespeichertePins.forEach(pinData => {
    const pin = document.createElement("div");
    pin.classList.add("pin-marker");
    pin.style.left = `${pinData.x}px`;
    pin.style.top = `${pinData.y}px`;
    pin.dataset.info = `Reiseziel: ${pinData.text}, Datum: ${pinData.date}`;

    pin.addEventListener("click", (ev) => {
      ev.stopPropagation();
      editPin(pin);
    });

    document.body.appendChild(pin);

    allePins.push(pinData);
  });

});