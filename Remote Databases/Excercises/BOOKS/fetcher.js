import {
  authenticationsFor,
  generateUrl,
  allowedContentTypes
} from "./fetchSettings.js";

const allowedMethods = ["POST", "PUT", "GET", "DELETE"];

const validateStatus = function(res) {
  {
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Status not good! \nRecieved :${res.status}`);
    }
    return res;
  }
};

const getJsonParsed = r => r.json();
const errorHandler = e => {
  console.log(e);
  throw new Error(e);
};

function makeContent(collectionType, method, data) {
  method = method.toUpperCase();
  if (!allowedMethods.includes(method)) {
    throw Error("unidentified method!");
  }

  const content = { headers: {} };
  content["headers"]["authorization"] =
    "Basic " + authenticationsFor[collectionType];
  content["method"] = method;
  if (allowedMethods.slice(0, 2).includes(method)) {
    content["headers"]["content-type"] = "application/json";
    content["body"] = JSON.stringify(data);
    content["headers"]["content-length"] = content["body"].length;
  }
  return content;
}

function makeRequest(
  method,
  collectionType,
  valStat = validateStatus,
  eHandle = errorHandler,
  endPoint,
  data
) {
  if (!allowedContentTypes.includes(collectionType)) {
    throw new Error("Not supported collection Type:" + collectionType);
  }

  return fetch(
    generateUrl[collectionType.toLowerCase()](endPoint),
    makeContent(collectionType, method, data)
  )
    .then(valStat)
    .then(getJsonParsed)
    .catch(eHandle);
}

export const fd_get = makeRequest.bind(undefined, "GET", "appdata");
export const fd_post = makeRequest.bind(undefined, "POST", "appdata");
export const fd_put = makeRequest.bind(undefined, "PUT", "appdata");
export const fd_delete = makeRequest.bind(undefined, "DELETE", "appdata");

// export  const fu_get = makeRequest.bind(undefined, "GET", "user");
// export  const fu_post = makeRequest.bind(undefined, "POST", "user");
// export  const fu_put = makeRequest.bind(undefined, "PUT", "user");
// export  const fu_delete = makeRequest.bind(undefined, "DELETE", "user");
