import { fetchGET, fetchPOST, fetchDELETE, fetchPUT } from "./fetcher.js";
import {  resetValues,  attachAttributes,  appendToParent,  createElementWithContent,  createElementWithClassses} from "./domFunc.js";

const route="https://fisher-game.firebaseio.com/catches";
const fetchData = {
  getAll: fetchGET.bind(undefined, undefined, undefined, route+".json"),
  postOne: fetchPOST.bind(undefined, undefined, undefined, route+".json"),
  deleteOne: id => fetchDELETE.bind(undefined, undefined, undefined, route+`/${id}.json`),
  updateOne: id => fetchPUT.bind(undefined, undefined, undefined, route+`/${id}.json`)
};

const getInputFromDiv= (targetId, className) =>  document.querySelector(`#${targetId} > input.${className}`);
const getInputFromAddForm=getInputFromDiv.bind(undefined,"addForm");

const elementsAddForm = {
  getInputFromAddForm:getInputFromDiv.bind(undefined,"addForm"),
  $addBtn: () => document.getElementById("addForm").querySelector("button.add"),
  $angler: getInputFromAddForm.bind(undefined, "angler"),
  $weight: getInputFromAddForm.bind(undefined, "weight"),
  $species: getInputFromAddForm.bind(undefined, "species"),
  $location: getInputFromAddForm.bind(undefined, "location"),
  $bait: getInputFromAddForm.bind(undefined, "bait"),
  $captureTime: getInputFromAddForm.bind(undefined, "captureTime"),

isValidRecord: record => ![...Object.values(record)].some(x=>x===""||x===null),

  makeRecord: function() {
    return ["$angler","$weight","$species","$location","$bait","$captureTime"].reduce((a,n)=>{
      a[n.slice(1)]=this[n]().value;
      return a;
    },{})  
  }
};

const elements = {
  $loadBtn: () => document.querySelector("button.load"),
  $displayDiv: () => document.getElementById("catches")
};

const normalizeString = function(str) {
  let arr = str.split(" ").filter(x => x !== "");
  arr[0] = arr[0].toLowerCase();
  return arr.join("");
};

function renderAllData(data) {
  function appendfield(target, type, label, value) {
    appendToParent(target, [
      createElementWithContent("hr"),
      createElementWithContent("label", label),
      attachAttributes(createElementWithContent("input"), {
        type,
        class: normalizeString(label),
        value
      })
    ]);
    return target;
  }

  let catches = Object.entries(data).map(([key, value]) => {
    let wraperDiv = attachAttributes(createElementWithContent("div"), {
      class: "catch",
      "data-id": key
    });

    appendfield(wraperDiv, "text", "Angler", value.angler);
    appendfield(wraperDiv, "number", "Weight", value.weight);
    appendfield(wraperDiv, "text", "Species", value.species);
    appendfield(wraperDiv, "text", "Location", value.location);
    appendfield(wraperDiv, "text", "Bait", value.bait);
    appendfield(wraperDiv, "text", "Capture Time", value.captureTime);

    appendToParent(wraperDiv, [
      createElementWithContent("hr"),
      createElementWithClassses("button", "update", "Update"),
      createElementWithClassses("button", "delete", "Delete")
    ]);
    return wraperDiv;
  });
  elements.$displayDiv().innerHTML = "";
  elements.$displayDiv().append(...catches);
}

async function loadData() {
  let data;
  try {
    data = await fetchData.getAll();
  } catch {
    alert("unsuccessfull Retrieval!");
  }
  renderAllData(data);
}

async function submitCatch() {
  let product = elementsAddForm.makeRecord();
  if (!elementsAddForm.isValidRecord(product)) {
    console.log("Incorrect field input");
    return;
  }
  try {
    await fetchData.postOne(product);
    resetValues(
      elementsAddForm.$angler(),
      elementsAddForm.$bait(),
      elementsAddForm.$captureTime(),
      elementsAddForm.$location(),
      elementsAddForm.$weight(),
      elementsAddForm.$species()
    );
    loadData();
  } catch {
    alert("Failure nothing was sent!");
  }
}

async function attachEvents() {
  elements.$loadBtn().addEventListener("click", loadData);
  elementsAddForm.$addBtn().addEventListener("click", submitCatch);
  elements.$displayDiv().addEventListener("click", async function(evnt) {
    if (evnt.target.nodeName !== "BUTTON") {
      return;
    }

    const targetCatch = evnt.target.parentNode;
    const id = targetCatch.getAttribute("data-id");
    if (evnt.target.classList.contains("update")) {
      const newEntry = Array.from(targetCatch.querySelectorAll("input")).reduce(
        (a, b) => {
          a[b.className] = b.value;
          return a;
        },
        {}
      );
      if (!elementsAddForm.isValidRecord(newEntry)) {
        console.log("Incorrect field input");
        return;
      }
      fetchData
        .updateOne(id)(newEntry)
        .catch(e => console.log(e + "unsuccessfull update!"));
    }
    if (evnt.target.classList.contains("delete")) {
      fetchData
        .deleteOne(id)()
        .then(() => targetCatch.parentNode.removeChild(targetCatch))
        .catch(e => console.log(e + "unsuccessfull delete!"));
    }
  });
}

attachEvents();
