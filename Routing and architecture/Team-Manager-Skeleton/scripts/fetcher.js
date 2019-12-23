import {
  authenticationsFor as authentications,
  generateUrl
} from "./fetchSettings.js";

const allowedMethods = ["POST", "PUT", "GET", "DELETE"];

const validateStatus = function(res) {
  {
    if (res.status < 200 || res.status >= 300) {
      throw new Error(`Status not good! \nRecieved :${res.statuss}`);
    }
    return res;
  }
};

const getJsonParsed = r => {
  if (r.status === 204) {
    return;
  }
  return r.json();
};
const errorHandler = e => {
  console.log(e);
  throw new Error(e);
};

function makeContent(authType, method, data) {
  method = method.toUpperCase();
  authType = authType.toLowerCase();
  if (!allowedMethods.includes(method)) {
    throw Error("unidentified method!");
  }
  const content = { headers: {} };
  if (typeof authentications[authType] === "function") {
    content["headers"]["authorization"] = authentications[authType]();
  }
  content["method"] = method;
  if (
    allowedMethods.slice(0, 2).includes(method) &&
    typeof data !== "undefined"
  ) {
    content["headers"]["content-type"] = "application/json";
    content["body"] = JSON.stringify(data);
    content["headers"]["content-length"] = content["body"].length;
  }
  return content;
}

function makeRequest(
  method,
  statValidator = validateStatus,
  parser = getJsonParsed,
  eHandler = errorHandler,
  contentType,
  authType,
  endPoint,
  data
) {
  // console.log(generateUrl(contentType, endPoint),JSON.stringify(makeContent(authType, method, data)));

  return fetch(
    generateUrl(contentType, endPoint),
    makeContent(authType, method, data)
  )
    .then(statValidator)
    .then(parser)
    .catch(eHandler);
}

export const fd_get = makeRequest.bind(undefined, "GET");
export const fd_post = makeRequest.bind(undefined, "POST");
export const fd_put = makeRequest.bind(undefined, "PUT");
export const fd_delete = makeRequest.bind(undefined, "DELETE");
