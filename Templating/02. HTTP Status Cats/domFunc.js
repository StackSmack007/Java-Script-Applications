function validateExisting(x) {
  if (x) {
    return x;
  }
  debugger;
  throw new Error("Non existing element!");
}

function resetValues(...params) {
  params.map(x => {
    x.value = "";
  });
}

function createElementWithContent(tag, content_s) {
  //Content is optional
  let result = document.createElement(tag);
  if (["string", "number"].includes(typeof content_s)) {
    result.textContent = content_s;
  } else if (Array.isArray(content_s)) {
    content_s.forEach(x => {
      result.appendChild(x);
    });
  } else if (content_s instanceof HTMLElement) {
    result.appendChild(content_s);
  }
  return result;
}

function createElementWithClassses(tag, classes, content_s) {
  let element = createElementWithContent(tag, content_s);
  element.classList.add(...classes.split(" "));
  return element;
}

function appendToParent(parrent, element_s) {
  element_s = Array.isArray(element_s) ? element_s : [element_s];
  if (element_s.some(x => !(x instanceof HTMLElement))) {
    debugger;
    throw new Error("Arguments contain Non - Html Elements!");
  }
  element_s.forEach(x => {
    parrent.appendChild(x);
  });
  return parrent;
}

function attachAttributes(targetEl, attributesObject) {
  //Classes can be attributes if passed in one string!
  Object.keys(attributesObject).forEach(key => {
    targetEl.setAttribute(key, attributesObject[key]);
  });
  return targetEl;
}

function hideShow(targetEl) {
  if (targetEl.style.display === "none") {
    targetEl.style.display = "block";
  } else if ((targetEl.style.display = "block")) {
    targetEl.style.display = "none";
  }
}

export {
  hideShow,
  resetValues,
  attachAttributes,
  appendToParent,
  createElementWithContent,
  validateExisting,
  createElementWithClassses
};
