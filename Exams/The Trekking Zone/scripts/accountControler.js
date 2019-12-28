import { userManager, partials, post } from "./controler_base.js";

export function logoff(path = "/", ctx) {
  post("user", "Kinvey", "/_logout")
    .then(() => userManager.clearSessionData())
    .then(() => userManager.notify("successBox", `Logout successfull!`, 1500))
    .then(() => ctx.redirect(path))
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
  } else if (password.length < 6) {
    userManager.notify("errorBox", `Password must be atleast 6 symbols!`, 3000);
  } else if (username.length < 3) {
    userManager.notify("errorBox", `Username must be atleast 3 symbols!`, 3000);
  } else {
    post("rpc", "basic", "/check-username-exists", { username }).then(
      ({ usernameExists }) => {
        if (usernameExists) {
          userManager.notify(
            "errorBox",
            `Choose different UserName!\n<strong>${username}</strong> is taken!`,
            3000
          );
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
                `Successfully registered user.`,
                1000
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
      logoff("/accounts/login",ctx );
    }
    return;
  }
  this.loadPartials(partials).partial("../templates/accounts/loginForm.hbs");
}

export function postLogin(ctx) {
  const { username, password } = ctx.params;
  if (username.length < 3) {
    userManager.notify("errorBox", `Username must be atleast 3 symbols!`, 3000);
  } else if (password.length < 6) {
    userManager.notify("errorBox", `Password must be atleast 6 symbols!`, 3000);
  } else {
    post("user", "basic", "/login", { username, password })
      .then(userManager.setUserDataInStorage)
      .then(() =>
        userManager.notify("successBox", `Successfully loged user!`, 1000)
      )
      .then(() => ctx.redirect("/"))
      .catch(e => {
        userManager.notify("errorBox", `Username or Password mismatch!`, 3000);
      });
  }
}
