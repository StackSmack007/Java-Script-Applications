import { fd_get, fd_post, fd_put, fd_delete } from "./fetcher.js";
export const get = fd_get.bind(undefined, undefined, undefined, undefined);
export const post = fd_post.bind(undefined, undefined, undefined, undefined);
export const put = fd_put.bind(undefined, undefined, undefined, undefined);
export const del = fd_delete.bind(undefined, undefined, undefined, undefined);
// contentType,// authType,// endPoint,// data

export const partials = {
  header: "../templates/common/header.hbs",
  footer: "../templates/common/footer.hbs"
};

export const userManager = {
  retrieveCurrentUserData: function(ctx) {
    const authtoken = sessionStorage.getItem("authtoken");
    if (authtoken !== null) {
      ctx.loggedIn = true;
      ctx["authtoken"] = authtoken;
      ctx["username"] = sessionStorage.getItem("username");
      ctx["userId"] = sessionStorage.getItem("userId");
      return ctx;
    }
    return undefined;
  },

  setUserDataInStorage: function(obj) {
    sessionStorage["authtoken"] = obj._kmd.authtoken;
    sessionStorage["username"] = obj.username;
    sessionStorage["userId"] = obj._id;
    console.log("User Data set in storage!");
  },

  clearSessionData: function() {
    return sessionStorage.clear();
  }
};
