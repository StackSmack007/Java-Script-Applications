const validateStatus = function(res) {
  {
    if (!res.ok) {
      throw new Error("Status not OK!");
    }
    return res;
  }
};

const jsonify = r => r.json();

const errorHandler = e => {
  console.log(e);
  throw new Error(e);
};

async function fetchGET(valStat = validateStatus, eHandle = errorHandler, url) {
  return fetch(url)
    .then(valStat)
    .then(jsonify)
    .catch(eHandle);
}

async function fetchDELETE(
  valStat = validateStatus,
  eHandle = errorHandler,
  url
) {
  return fetch(url, { method: "DELETE" })
    .then(valStat)
    .catch(eHandle);
}

async function fetchPOST(
  valStat = validateStatus,
  eHandle = errorHandler,
  url,
  data
) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(valStat)
    .catch(eHandle);
}

async function fetchPUT(
  valStat = validateStatus,
  eHandle = errorHandler,
  url,
  data
) {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(valStat)
    .catch(eHandle);
}

export { fetchGET, fetchPOST, fetchDELETE, fetchPUT };
