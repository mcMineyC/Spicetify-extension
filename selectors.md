Currently playing: aria-labelledby='listrow-title-device-picker-header'
- query: document.querySelector("[aria-labelledby='listrow-title-device-picker-header'] p#listrow-title-device-picker-header").innerHTML

Device list: data-testid="'devices-list-'
- Text: li [data-testid='list-row-title'] > span
  - query: document.querySelectorAll("[data-testid='devices-list-'] li [data-testid='list-row-title'] > span").forEach((e) => console.log("Device:", e.innerHTML))
  - to switch: document.querySelectorAll("[data-testid='devices-list-'] li [data-testid='list-row-title'] > span")[0].click()
    - Note: must reopen panel

Panel button:
- query: document.querySelector("[data-testid='control-button-queue']")
- click: document.querySelector("[data-testid='control-button-queue']").click()
- check if open: document.querySelector("[data-testid='control-button-queue']").getAttribute("data-active")
