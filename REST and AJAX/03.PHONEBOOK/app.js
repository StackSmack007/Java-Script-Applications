function attachEvents() {
  let deleteButtonMapper = [];

  let elements = {
    recordsUl: document.getElementById("phonebook"),
    loadBtn: document.getElementById("btnLoad"),
    nameInput: document.getElementById("person"),
    phoneInput: document.getElementById("phone"),
    createBtn: document.getElementById("btnCreate")
  };

  function refreshRecords(data) {
    elements.recordsUl.innerHTML = "";
    deleteButtonMapper = [];
    Object.keys(data).forEach(key => {
      let { person, phone } = data[key];
      let li = document.createElement("li");
      li.innerHTML = `${person}: ${phone} &nbsp;`;
      let deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteButtonMapper.push({ deleteBtn, id: key });
      li.appendChild(deleteBtn);
      elements.recordsUl.appendChild(li);
    });
  }

  const uriGET_POST = `https://phonebook-nakov.firebaseio.com/phonebook.json`;
  function loadRecords() {
    fetch(uriGET_POST)
      .then(x => x.json())
      .then(refreshRecords);
  }

  function deleteRecord(evnt) {
    evnt.stopPropagation();
    let found = deleteButtonMapper.find(x => x.deleteBtn === evnt.target);
    if (!found) {
      return;
    }
    let deleteUri = `https://phonebook-nakov.firebaseio.com/phonebook/${found.id}.json`;

    fetch(deleteUri, {
      method: "DELETE"
    }).then(loadRecords);
  }

  function addContact() {
    let person = elements.nameInput.value;
    let phone = elements.phoneInput.value;
    if (person === phone || [person, phone].some(x => x === "")) {
      alert("empty fields not allowed!");
      return;
    }
    fetch(uriGET_POST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ person, phone })
    }).then(loadRecords);
  }

  elements.loadBtn.addEventListener("click", loadRecords);

  elements.recordsUl.addEventListener("click", deleteRecord);

  elements.createBtn.addEventListener("click", addContact);
}

attachEvents();
