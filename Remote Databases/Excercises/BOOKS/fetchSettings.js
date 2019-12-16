const appId = "kid_Hk_QIYXRH";
const appSecret = "a7e20d74a6d64141b1c1b7424b322f3c";
const baseURL = "https://baas.kinvey.com/";

const userName = "user1";
const userPassword = "user1";
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
