function solve() {
  let nextStopId = "depot";
  const getUrl = id => `https://judgetests.firebaseio.com/schedule/${id}.json`;
  let elements = {
    infoSpan: document.querySelector("#info>span.info"),
    departBtn: document.getElementById("depart"),
    arriveBtn: document.getElementById("arrive")
  };

  function depart() {
    fetch(getUrl(nextStopId))
      .then(x => x.json())
      .then(data => {
        nextStopId = data.next;
        elements.infoSpan.textContent = `Next stop ${data.name}`;
        elements.departBtn.disabled = true;
        elements.arriveBtn.disabled = false;
      })
      .catch(x => {
        elements.infoSpan.textContent = "Error";
        elements.departBtn.disabled = true;
        elements.arriveBtn.disabled = true;
      });
  }

  function arrive() {
    elements.infoSpan.textContent = elements.infoSpan.textContent.replace(
      "Next stop",
      "Arriving at"
    );

    elements.departBtn.disabled = false;
    elements.arriveBtn.disabled = true;
  }

  return {
    depart,
    arrive
  };
}

let result = solve();
