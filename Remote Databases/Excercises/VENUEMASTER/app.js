import { fd_get,} from "./fetcher.js";
import {
  validateExisting,
  createElementWithClassses,
  createElementWithContent,
  attachAttributes,
  hideShow,
  appendToParent
} from "./domFunc.js";

const fdv_get = fd_get.bind(undefined, undefined, undefined);

const elements = {
  $venueDateInput: () => document.getElementById("venueDate"),
  $venuesButton: () => document.getElementById("getVenues"),
  $venuesTargetDiv: () => document.getElementById("venuesContent"),
  $venueInfoDiv: () => document.getElementById("venue-info")
};

const getVenueIDSPostURL = date =>
  `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query=${date}`;

const getPurchasePostURL = (id, qty) =>
  `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${id}&qty=${qty}`;

async function loadVenues() {
  const date = validateExisting(elements.$venueDateInput());
  if (date === "") {
    console.log("no date enetered!");
    return;
  }
  let data;
  try {
    const idsArray = await fetch(getVenueIDSPostURL(date.value), {
      method: "POST",
      headers: {
        authorization: "Basic Z3Vlc3Q6cGFzcw=="
      }
    }).then(x => x.json());

    date.value = "";
    data = await Promise.all(idsArray.map(id => fdv_get("/venues/" + id)));
    data = data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    console.log(e);
  }
  updateVenues(data);
}

function updateVenues(venues) {
  elements.$venuesTargetDiv().innerHTML = "";
  elements.$venuesTargetDiv().append(...venues.map(generateVenueComponent));
}

function generateVenueComponent(venue) {
  let $wraperDiv = document.createElement("div");
  $wraperDiv.id = venue._id;

  $wraperDiv.innerHTML = `<span class="venue-name">
 <input class="info" type="button" value="More info">{venue.name}
</span>
<div class="venue-details" style="display: none;">
 <table>
     <tr>
         <th>Ticket Price</th>
         <th>Quantity</th>
         <th></th>
     </tr>
     <tr>
         <td class="venue-price">{venue.price} lv</td>
         <td><select class="quantity">
                 <option value="1">1</option>
                 <option value="2">2</option>
                 <option value="3">3</option>
                 <option value="4">4</option>
                 <option value="5">5</option>
             </select></td>
         <td><input class="purchase" type="button" value="Purchase"></td>
     </tr>
 </table>
 <span class="head">Venue description:</span>
 <p class="description">{venue.description}</p>
 <p class="description">Starting time: {venue.startingHour}</p>
</div>`
    .replace("{venue.name}", venue.name)
    .replace("{venue.price}", venue.price.toFixed(2))
    .replace("{venue.description}", venue.description)
    .replace("{venue.startingHour}", venue.startingHour);

  $wraperDiv.querySelector("input.info").addEventListener("click", function() {
    hideShow($wraperDiv.querySelector("div.venue-details"));
  });

  $wraperDiv
    .querySelector("input.purchase")
    .addEventListener("click", getConfirmation);
  return $wraperDiv;
}

async function getConfirmation(evnt) {
  if (
    evnt.target.nodeName !== "INPUT" ||
    !evnt.target.classList.contains("purchase")
  ) {
    console.log("cukash deto ne biva");
    return;
  }

  const id =
    evnt.target.parentNode.parentNode.parentNode.parentNode.parentNode
      .parentNode.id;

  const quantity = +evnt.target.parentNode.parentNode.querySelector(
    "select.quantity"
  ).value;

  let venue;
  try {
    venue = await fdv_get("venues/" + id);
  } catch (e) {
    console.log(e);
  }

  let $span = createElementWithClassses("span", "head", "Confirm purchase");
  let $div = appendToParent(createElementWithClassses("div", "purchase-info"), [
    createElementWithContent("span", venue.name), //name
    createElementWithContent("span", `${quantity} x ${venue.price.toFixed(2)}`), //price
    createElementWithContent(
      "span",
      `$Total: ${(quantity * venue.price).toFixed(2)}`
    ),
    attachAttributes(createElementWithContent("input"), {
      type: "button",
      value: "Confirm"
    })
  ]);

  elements.$venuesTargetDiv().innerHTML = "";
  elements.$venuesTargetDiv().append($span, $div);

  $div.lastChild.addEventListener("click", submitPurchase.bind(undefined,id,quantity));
}

async function submitPurchase(id, quantity) {
  let response;
  try {
    response = await fetch(getPurchasePostURL(id, quantity), {
      method: "POST",
      headers: {
        authorization: "Basic Z3Vlc3Q6cGFzcw=="
      }
    }).then(x => x.json());
  } catch (e) {
    console.log(e);
  }
  elements.$venuesTargetDiv().innerHTML = "";
  elements.$venueInfoDiv().innerHTML =
    "You may print this page as your ticket" + response.html;
}

(function attachHandlers() {
  elements.$venuesButton().addEventListener("click", loadVenues);
})();