function attachEvents() {
  let elements = {
    textArea: document.getElementById("messages"),
    autnorInput: document.getElementById("author"),
    contentInput: document.getElementById("content"),
    submithBtn: document.getElementById("submit"),
    refreshBtn: document.getElementById("refresh")
  };

  const uri = `https://rest-messanger.firebaseio.com/messanger.json`;

  function refreshMsgs() {
    elements.textArea.value = "";
    fetch(uri)
      .then(x => x.json())
      .then(data => {
        Object.values(data).forEach(({ author, content }) => {
          elements.textArea.value += `${author}: ${content}\n`;
        });
      });
  }

  function addPost() {
    let [author, content] = [
      elements.autnorInput.value,
      elements.contentInput.value
    ];
    if ([author, content].includes("")) {
      alert("Not allowed empty field!");
      return;
    }
    elements.autnorInput.value = "";
    elements.contentInput.value = "";

    fetch(uri, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ author, content })
    });
  }

  elements.refreshBtn.addEventListener("click", refreshMsgs);

  elements.submithBtn.addEventListener("click", addPost);
}

attachEvents();
