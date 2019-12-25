const appId = "kid_ryOwp8Jk8";
const appSecret = "1f16b7b1b4974bf497347859d1c31aac";
const baseURL = "https://baas.kinvey.com/";

const allowedContentTypes = ["user", "appdata","rpc"];

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
