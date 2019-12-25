import { userManager, partials, post } from "./controler_base.js";

export function logoff(ctx) {
  post("user", "Kinvey", "/_logout")
    .then(() => userManager.clearSessionData())
    .then(() => ctx.redirect("/"))
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
  this.loadPartials(partials).partial("../templates/accounts/registerForm.hbs");
}

export function postRegistration(ctx) {
  const { username, password, rePassword } = ctx.params;
  if (password !== rePassword) {
    userManager.notify("errorBox", `passwords mismatch`, 3000);
    // alert("passwords mismatch");
  } else if (password.length < 4) {
    userManager.notify("errorBox", `Password must be atleast 4 symbols!`, 3000);
    //  alert("Password must be atleast 4 symbols!");
  } else {
    post("rpc", "basic", "/check-username-exists", { username }).then(
      ({ usernameExists }) => {
        if (usernameExists) {
          userManager.notify(
            "errorBox",
            `Choose different UserName!\n<strong>${username}</strong> is taken!`,
            3000
          );
          // alert(`Choose different UserName!\n${username} is taken!`);
          return;
        } else {
          post("user", "basic", "/", {
            username,
            password
          })
            .then(userManager.setUserDataInStorage)
            .then(() =>
              userManager.notify(
                "successBox",
                `Successfull registration of user ${username}!`,
                4000
              )
            )
            .then(() => {
              ctx.redirect("/");
            });
        }
      }
    );
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
  this.loadPartials(partials).partial("../templates/accounts/loginForm.hbs");
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
