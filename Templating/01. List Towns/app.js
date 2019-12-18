import { validateExisting } from "./domFunc.js";

const elements = {
  sendBtn: () => validateExisting(document.getElementById("btnLoadTowns")),
  townsInput: () => validateExisting(document.getElementById("towns")),
  targetDiv: () => validateExisting(document.getElementById("root"))
};

let templateFn;

(async function Main() {
  templateFn = await (async function() {
    try {
      return Handlebars.compile(
        await fetch("./townTemplate.hbs").then(x => x.text())
      );
    } catch (e) {
      console.log("unfound template" + e);
      return () => "UnfoundTemplate";
    }
  })();
  elements.sendBtn().addEventListener("click", listItems);
})();

async function listItems() {
  let inputValue = elements.townsInput().value;
  if (inputValue === "") {
    console.log("nothing entered");
    return;
  }
  const towns = inputValue.split(", ").filter(x => x !== "");

  elements.targetDiv().innerHTML = templateFn({ towns });
}
