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

export { fetchGET };
