import { cats } from "./catSeeder.js";
import { validateExisting, hideShow } from "./domFunc.js";

let elemetns = {
  targetUl: () => validateExisting(document.querySelector("#allCats>ul"))
};

async function renderCatTemplate() {
  const renderFn = await fetch("./cat-template.hbs")
    .then(x => x.text())
    .then(x => Handlebars.compile(x))
    .catch(e => {
      throw Error(e);
    });

  elemetns.targetUl().innerHTML = cats.map(renderFn).join("\n");

  elemetns.targetUl().addEventListener("click", function(evnt) {
    if (
      evnt.target.nodeName !== "BUTTON" ||
      !evnt.target.classList.contains("showBtn")
    ) {
      console.log("aimless click");
      return;
    }
    const btnText=evnt.target.textContent;
   if(btnText==="Show status code"){
    evnt.target.textContent="Hide status code";
   }else{
    evnt.target.textContent="Show status code";
   }
    hideShow(evnt.target.nextSibling.nextSibling);
  });
}
renderCatTemplate();
