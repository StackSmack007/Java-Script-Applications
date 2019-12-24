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
  this.loadPartials(partials).partial("../templates/accounts/registerForm.hbs");
}

export function postRegistration(ctx) {
  const {
    firstName,
    lastName,
    username,
    password,
    repeatPassword
  } = ctx.params;
  if (password !== repeatPassword) {
    alert("passwords mismatch");
  } else if (password.length < 4) {
    alert("Password must be atleast 4 symbols!");
  } else if (firstName.length < 2 || lastName.length < 2) {
    alert("Names must contain atleast 2 symbols!");
  } else if (username.length < 3) {
    alert("Username must contain atleast 3 symbols!");
  } else {
    post("rpc", "basic", "/check-username-exists", { username })
    .then(({ usernameExists }) => {
        if (usernameExists) {
          alert(`Choose different UserName!\n${username} is taken!`);
          return;
        }
        post("user", "basic", "/", {
          username,
          firstName,
          lastName,
          password
        })
          .then(userManager.setUserDataInStorage)
          .then(() => {
            ctx.redirect("/");
          });
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
  // partials["loginForm"] = "../templates/login/loginForm.hbs";
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
