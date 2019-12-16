const appId = "kid_BJ_Ke8hZg";
const appSecret = "...";
const baseURL = "https://baas.kinvey.com/";

const userName = "guest";
const userPassword = "pass";
export const allowedContentTypes = ["user", "appdata"];

export const generateUrl = {
  _urlBaseEndsWithSlash: `${baseURL}${baseURL.endsWith("/") ? "" : "/"}`,

  _setStartingSlash: endPoint =>
    endPoint.startsWith("/") ? endPoint : "/" + endPoint,

  appdata: function(endPoint) {
    return (
      this._urlBaseEndsWithSlash +
      `appdata/${appId}${this._setStartingSlash(endPoint)}`
    );
  },

  user: function(endPoint) {
    return (
      this._urlBaseEndsWithSlash +
      `user/${appId}${this._setStartingSlash(endPoint)}`
    );
  }
};

export const authenticationsFor = {
  user: btoa(`${appId}:${appSecret}`),
  appdata: btoa(`${userName}:${userPassword}`)
};
