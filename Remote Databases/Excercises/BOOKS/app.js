import { fd_get, fd_post, fd_put, fd_delete } from "./fetcher.js";
import { createElementWithContent, hideShow } from "./domFunc.js";

const fdb_get = fd_get.bind(undefined, undefined, undefined);
const fdb_post = fd_post.bind(undefined, undefined, undefined);
const fdb_put = fd_put.bind(undefined, undefined, undefined);
const fdb_delete = fd_delete.bind(undefined, undefined, undefined);

function getInputFields(wraperElement) {
  const bookObjKeys = ["title", "author", "isbn"];
  return bookObjKeys.reduce((a, b) => {
    a[b] = wraperElement[b];
    if (typeof a[b] === "undefined") {
      throw Error("Unfound DOM member with ID: " + b);
    }
    return a;
  }, {});
}

const addFormInputs = getInputFields.bind(
  undefined,
  document.getElementById("addForm")
);

const editFormInputs = getInputFields.bind(
  undefined,
  document.getElementById("editForm")
);

const elements = {
  $booksTBody: () => document.querySelector("body > table > tbody"),
  $editForm: () => document.getElementById("editForm"),
  $editBtn: () => document.getElementById("edit_post")
};

const clickHandler = {
  handleEvent: function(event) {
    if (typeof this[event.target.id] === "function") {
      this[event.target.id](event);
    }
  },

  loadBooks: async function(event) {
    let allBooks;
    try {
      allBooks = await fdb_get("/books");
    } catch (e) {
      console.log("Unsuccessfull retrieval of all books" + e.message);
      debugger;
    }
    let fragment = document.createDocumentFragment();
    allBooks.forEach(book => {
      let bookTr = document.createElement("tr");
      bookTr.appendChild(createElementWithContent("td", book.title));
      bookTr.appendChild(createElementWithContent("td", book.author));
      bookTr.appendChild(createElementWithContent("td", book.isbn));
      let actionsTd = document.createElement("td");
      bookTr.appendChild(actionsTd);
      let editBtn = createElementWithContent("button", "Edit");
      editBtn.addEventListener(
        "click",
        clickHandler.edit_get.bind(undefined, book._id)
      );
      let delBtn = createElementWithContent("button", "Delete");
      delBtn.addEventListener(
        "click",
        clickHandler.delete.bind(undefined, book._id, book.title)
      );
      actionsTd.append(editBtn, delBtn);
      fragment.appendChild(bookTr);
    });
    elements.$booksTBody().innerHTML = "";
    elements.$booksTBody().appendChild(fragment);
  },

  edit_get: function(id) {
    elements.$editForm().style.display = "block";
    fdb_get("/books/" + id)
      .then(book => {
        Object.entries(editFormInputs()).forEach(([key, value]) => {
          value.value = book[key];
        });
        elements.$editBtn().setAttribute("bookId", book._id);
      })
      .catch(e => {
        throw new Error("Unsucessfull edit Book retrieval!" + e);
      });
  },

  edit_post: function(evnt) {
    evnt.preventDefault();
    const editedBook=  this._createAndValidateBook(editFormInputs());

    const id = evnt.target.getAttribute("bookId");
    fdb_put("/books/" + id, editedBook)
      .then(clickHandler.loadBooks)
      .then(() => {
        [...Object.values(inputs)].forEach(i => {
          i.value = "";
        });
      })
      .catch(e => {
        throw Error(e);
      });
    elements.$editForm().style.display = "none";
    evnt.target.removeAttribute("bookId");
  },

  delete: function(id, name) {
    if (confirm("Are you sure you wish to Delete book :" + name)) {
      fdb_delete("/books/" + id)
        .then(clickHandler.loadBooks)
        .catch("Unsucessfull Delete of book: " + name);
    }
  },

  _createAndValidateBook(inputElements) {
    let newBook = Object.keys(inputElements).reduce((a, b) => {
      a[b] = inputElements[b].value;
      return a;
    }, {});

    const invalidData = Object.keys(newBook).filter(x => newBook[x] === "");
    if (invalidData.length > 0) {
      alert("Please enter data in fields: " + invalidData.join(", "));
      return;
    }
    return newBook;
  },

  create_book: function(evnt) {
    evnt.preventDefault();
    const inputs=addFormInputs();
    const newBook = this._createAndValidateBook(inputs);
    fdb_post("/books", newBook)
      .then(clickHandler.loadBooks)
      .then(() => {
        [...Object.values(inputs)].forEach(i => {
          i.value = "";
        });
      })
      .catch(e => {
        throw Error(e);
      });
  }
};

(function attach() {
  document.addEventListener("click", clickHandler);
})();
