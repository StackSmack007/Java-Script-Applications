const appId = "kid_H1OpK9oAS";
const appSecret = "f311ca3e897a4f98ab1856ed59648c80";
const baseURL = "https://baas.kinvey.com/";

const allowedContentTypes = ["user", "appdata"];

export const generateUrl = (contentType, endPoint) => {
  if (!allowedContentTypes.includes(contentType)) {
    throw new Error("Not supported collection Type:" + contentType);
  }
  const _urlBaseEndsWithSlash = `${baseURL}${baseURL.endsWith("/") ? "" : "/"}`;
  const _endPoint =
    endPoint.startsWith("/") || endPoint === "" ? endPoint : "/" + endPoint;
  return _urlBaseEndsWithSlash + `${contentType}/${appId}${_endPoint}`;
};

export const authenticationsFor = {
  basic:()=> "Basic " + btoa(`${appId}:${appSecret}`),
  kinvey:()=> "Kinvey " + sessionStorage.getItem("authtoken")
};
