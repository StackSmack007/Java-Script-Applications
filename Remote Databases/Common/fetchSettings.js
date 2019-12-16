const appId = "kid_Hk_QIYXRH";
const appSecret = "a7e20d74a6d64141b1c1b7424b322f3c";
const baseURL = "https://baas.kinvey.com/";
const allowedContentTypes = ["user", "appdata"];

const userName = "user1";
const userPassword = "user1";

generateUrl = {
  appdata: entityPath => `${baseURL}/appdata/${appId}${entityPath}`,
  user: entityPath => `${baseURL}/user/${appId}${entityPath}`
};

authenticationsFor = {
  user: btoa(`${appId}:${appSecret}`),
  appdata: btoa(`${userName}:${userPassword}`)
};

export { authenticationsFor, generateUrl, allowedContentTypes };
