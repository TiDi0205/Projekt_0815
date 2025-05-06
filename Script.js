document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.querySelector(".pin");
    const popup = document.getElementById("popup");
    const confirmBtn = document.getElementById("confirmBtn");

    openBtn.addEventListener("click", () => {
      popup.classList.remove("hidden");
    });

    confirmBtn.addEventListener("click", () => {
      const text = document.getElementById('textInput').value;
      const date = document.getElementById('dateInput').value;

      console.log("Text:", text);
      console.log("Datum:", date);

      popup.classList.add("hidden");
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.querySelector(".pin");
    const popup = document.getElementById("popup");
    const confirmBtn = document.getElementById("confirmBtn");
    let placingPin = false;
    let currentPinData = {};
    let skipNextClick = false; 
    let pinBeingEdited = null;
  
    openBtn.addEventListener("click", () => {
      popup.classList.remove("hidden");
    });
  
    confirmBtn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      e.preventDefault();
  
      const text = document.getElementById('textInput').value;
      const date = document.getElementById('dateInput').value;
  
      console.log("Text:", text);
      console.log("Datum:", date);
  
      currentPinData = { text, date };
      popup.classList.add("hidden");
  
      placingPin = true;
      skipNextClick = true; 
  
      if (pinBeingEdited) {
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
  });

  