import { userManager, partials, post } from "./controler_base.js";

export function logoff(returnPath, ctx) {
  post("user", "Kinvey", "/_logout")
    .then(() => userManager.clearSessionData())
    .then(() => ctx.redirect(returnPath))
    .catch(console.log);
}

export function getRegister(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  if (typeof ctx.authtoken !== "undefined") {
    alert("Only unlogged users can register!");
    if (confirm("Do you wish to Log off?")) {
      userManager.logoff("/register", ctx);
    }
    return;
  }
  partials["registerForm"] = "../templates/register/registerForm.hbs";
  this.loadPartials(partials).partial("../templates/register/registerPage.hbs");
}

export function postRegistration(ctx) {
  const { name, pas1, pas2 } = ctx.params;
  if (pas1 !== pas2) {
    alert("passwords mismatch");
  } else if (pas1.length < 4) {
    alert("Password must be atleast 4 symbols!");
  } else if (name.length < 4) {
    alert("Name must be atleast 4 symbols!");
  } else {
    post("user", "basic", "/", { username: name, password: pas1 })
      .then(userManager.setUserDataInStorage)
      .then(() => {
        ctx.redirect("/");
      })
      .catch(e => alert("Choose different UserName!"));
  }
}

export function getLogin(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  if (typeof ctx.username !== "undefined") {
    alert("You are currently loged in as: " + ctx.username);
    if (confirm("Do you wish to Log off?")) {
      userManager.logoff("/login", ctx);
    }
    return;
  }
  partials["loginForm"] = "../templates/login/loginForm.hbs";
  this.loadPartials(partials).partial("../templates/login/loginPage.hbs");
}

export function postLogin(ctx) {
  const { username, password } = ctx.params;
  if (username.length < 4) {
    alert("Username must be atleast 4 symbols");
  } else if (password.length < 4) {
    alert("Password must be atleast 4 symbols!");
  } else {
    post("user", "basic", "/login", { username, password })
      .then(userManager.setUserDataInStorage)
      .then(() => ctx.redirect("/"))
      .catch(e => {
        alert("Username or Password Mismatch!");
      });
  }
}
