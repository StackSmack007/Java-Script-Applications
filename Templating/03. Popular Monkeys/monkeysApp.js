const elements = {
  $targetDiv: () => document.querySelector("div.monkeys"),
  $templateDiv: () => document.getElementById("monkey-template")
};

function loadMonkeyData() {
  const templateFn = Handlebars.compile(elements.$templateDiv().innerHTML);
  elements.$targetDiv().innerHTML = monkeys.map(templateFn).join("\n\n");
}

function toggleInfo(evnt) {
  if (
    !(evnt.target.nodeName === "BUTTON" && evnt.target.textContent === "Info")
  ) {
    console.log("not info button chosen");
    return;
  }
  hideShow(evnt.target.nextSibling.nextSibling);
}

(() => {
  document.addEventListener("DOMContentLoaded", function() {
    loadMonkeyData();
    elements.$targetDiv().addEventListener("click", toggleInfo);
  });
})();
