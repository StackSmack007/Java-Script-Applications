import { fetchGET } from "./fetcher.js";
import {
  attachAttributes,
  createElementWithContent,
  createElementWithClassses,
  validateExisting
} from "./domFunc.js";

const targetDivs = {
  wraper: () => validateExisting(document.getElementById("forecast")),
  current: () => validateExisting(document.getElementById("current")),
  upcoming: () => validateExisting(document.getElementById("upcoming"))
};

const errorHandle = function() {
  targetDivs.wraper().style.display = "block";
  targetDivs.current().innerHTML = "";
  targetDivs.upcoming().innerHTML = "";
  targetDivs.current().appendChild(
    attachAttributes(createElementWithContent("div", "Error!"), {
      class: "label"
    })
  );
};

async function attachEvents() {
  let requester = {
    getTownCodes: fetchGET.bind(
      undefined,
      undefined,
      errorHandle,
      "https://judgetests.firebaseio.com/locations.json"
    ),
    getCurrentConditions: async function(code) {
      return fetchGET.bind(
        undefined,
        undefined,
        errorHandle
      )(`https://judgetests.firebaseio.com/forecast/today/${code}.json`);
    },
    get3DayForecast: async function(code) {
      return fetchGET.bind(
        undefined,
        undefined,
        errorHandle
      )(`https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`);
    }
  };

  let townCodes;
  try {
    townCodes = await requester.getTownCodes().then(x =>
      x.reduce((a, b) => {
        a[b.name] = b.code;
        return a;
      }, {})
    );
  } catch {
    console.log("No towns populated!");
  }

  const getTownNameInputValue = () =>
    validateExisting(document.getElementById("location")).value;

  const weatherSymbols = {
    Sunny: "&#x2600;",
    "Partly sunny": "&#x26C5;",
    Overcast: "&#x2601;",
    Rain: "&#x2614;",
    degrees: "&#176;"
  };
  
  const getDegreesInfo = (min, max) =>
    `${min}${weatherSymbols.degrees}/${max}${weatherSymbols.degrees}`;

  function createForecastToday(obj) {
    let fragment = document.createDocumentFragment();
    let labelDiv = createElementWithClassses(
      "div",
      "label",
      "Current conditions"
    );
    fragment.appendChild(labelDiv);

    let contentDiv = createElementWithClassses("div", "forecasts");
    fragment.appendChild(contentDiv);
    let span1 = createElementWithClassses("span", "condition symbol");

    contentDiv.appendChild(span1);
    span1.innerHTML = weatherSymbols[obj.forecast.condition];

    let span2 = createElementWithClassses("span", "condition");
    contentDiv.appendChild(span2);

    let span21 = createElementWithClassses("span", "forecast-data", obj.name);
    let span22 = createElementWithClassses("span", "forecast-data");
    span22.innerHTML = getDegreesInfo(obj.forecast.low, obj.forecast.high);
    let span23 = createElementWithClassses(
      "span",
      "forecast-data",
      obj.forecast.condition
    );

    span2.append(span21, span22, span23);
    return fragment;
  }

  function createForecast3Day(obj) {
    let fragment = document.createDocumentFragment();
    let labelDiv = createElementWithClassses(
      "div",
      "label",
      "Three-day forecast"
    );
    fragment.appendChild(labelDiv);

    let contentDiv = createElementWithClassses("div", "forecasts-info");
    fragment.appendChild(contentDiv);

    let innerFragment = obj.forecast.reduce((acc, next) => {
      let spanWraper = createElementWithClassses("span", "upcoming");
      acc.appendChild(spanWraper);

      let span1 = createElementWithClassses("span", "symbol");
      span1.innerHTML = weatherSymbols[next.condition];

      let span2 = createElementWithClassses("span", "forecast-data");
      span2.innerHTML = getDegreesInfo(next.low, next.high);

      let span3 = createElementWithClassses(
        "span",
        "forecast-data",
        next.condition
      );
      spanWraper.append(span1, span2, span3);

      return acc;
    }, document.createDocumentFragment());

    fragment.appendChild(innerFragment);
    return fragment;
  }

  function renderForecasts(fc) {
    targetDivs.wraper().style.display = "block";
    targetDivs.current().innerHTML = "";
    targetDivs.current().appendChild(createForecastToday(fc.current));
    targetDivs.upcoming().innerHTML = "";
    targetDivs.upcoming().appendChild(createForecast3Day(fc.future));
  }

  validateExisting(document.getElementById("submit")).addEventListener(
    "click",
    loadForecasts()
  );

  function loadForecasts() {
    return async function() {
      let townName = getTownNameInputValue();
      if (!townCodes.hasOwnProperty(townName)) {
        errorHandle();
        return;
      }
      const townCode = townCodes[townName];
      let forecasts = {};
      try {
        forecasts["current"] = await requester.getCurrentConditions(townCode);
        forecasts["future"] = await requester.get3DayForecast(townCode);
      } catch {
        errorHandle();
      }
      renderForecasts(forecasts);
    };
  }
}

attachEvents();
