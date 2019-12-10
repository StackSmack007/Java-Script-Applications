function getInfo() {
  let elements = {
    stopIdInput: document.getElementById("stopId"),
    sendButton: document.getElementById("stopId"),
    stopNameDiv: document.getElementById("stopName"),
    bussesUL: document.getElementById("buses")
  };

  (function() {
    const stopId = elements.stopIdInput.value;
    if (stopId === "") {
      return;
    }
    let uri = `https://judgetests.firebaseio.com/businfo/${stopId}.json`;
    fetch(uri)
      .then(res => {
        if (!res.ok) {
          return false;
        }
        return res.json();
      })
      .then(retrieved => {
        if (
          !retrieved.hasOwnProperty("name") ||
          !retrieved.hasOwnProperty("buses")
        ) {
          return false;
        }
        return retrieved;
      })
      .then(bus => {
        elements.bussesUL.innerHTML = "";
        if (bus === false) {
          elements.stopNameDiv.innerText = "Error";
          return;
        }

        elements.stopNameDiv.innerText = bus.name;
        Object.keys(bus.buses)
          .map(x => `Bus ${x} arrives in ${bus.buses[x]} minutes`)
          .map(x => {
            let li = document.createElement("li");
            li.innerText = x;
            elements.bussesUL.appendChild(li);
          });
      });

  })();
}
