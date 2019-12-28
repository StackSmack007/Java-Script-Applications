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
      ctx["userId"] = sessionStorage.getItem("userId");
      ctx["username"]=sessionStorage.getItem("username");
      return ctx;
    }
    return undefined;
  },

  setUserDataInStorage: function(obj) {
    sessionStorage["authtoken"] = obj._kmd.authtoken;
    sessionStorage["userId"] = obj._id;
    sessionStorage["username"] = obj.username;
    console.log("User Data set in storage!");
  },

  clearSessionData: function() {
    return sessionStorage.clear();
  },

  notify: function(id, message, time = 3000) {
    const notification = document.getElementById(id);
    return new Promise((res, rej) => {
      if (typeof notification === "undefined") {
        rej("Unfound Notification DOMElement");
      }
      notification.innerHTML = message;
      notification.style.display = "block";
      setTimeout(() => {
        notification.style.display = "none";
        notification.innerHTML = "";
        res();
      }, time);
    });
  }
};
