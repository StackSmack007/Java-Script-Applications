import { fd_get, fd_post, fd_put } from "./fetcher.js";

const get = fd_get.bind(undefined, undefined, undefined, undefined);
const post = fd_post.bind(undefined, undefined, undefined, undefined);
const put = fd_put.bind(undefined, undefined, undefined, undefined);
// contentType,// authType,// endPoint,// data

let partials = {
  header: "../templates/common/header.hbs",
  footer: "../templates/common/footer.hbs"
};

var app = Sammy("#main", function() {
  this.use("Handlebars", "hbs");
  this.get("/", getIndex);
  this.get("/home", getIndex);
  this.get("/about", getAbout);

  this.get("/register", getRegister);
  this.post("/register", postRegistration);
  this.get("/login", getLogin);
  this.post("/login", postLogin);
  this.get("/logout", logof.bind(undefined, "/"));

  this.get("/catalog", getCatalog);
  this.get("/create-team", getCatalogCreate);
  this.post("/create-team", postTeam);
  this.get("/catalog/:id", getTeamDetails);
  this.get("/leaveTeam", leaveTeamAny.bind(undefined, "/catalog"));
  this.get("/joinTeam/:id", joinTeam.bind(undefined, "/catalog"));
  this.get("/editTeam/:id", getEditTeam);
  this.post("/editTeam/:id", postEditedTeam.bind(undefined, "/catalog"));
});

var userManager = {
  retrieveCurrentUserData: function retrieveCurrentUserData(ctx) {
    const authtoken = localStorage.getItem("authtoken");
    if (authtoken !== null) {
      ctx.loggedIn = true;
      ctx["authtoken"] = authtoken;
      ctx["username"] = localStorage.getItem("username");
      ctx["userId"] = localStorage.getItem("userId");
      return ctx;
    }
    return undefined;
  },

  setUserDataInStorage: function(obj) {
    localStorage["authtoken"] = obj._kmd.authtoken;
    localStorage["username"] = obj.username;
    localStorage["userId"] = obj._id;
    console.log("User Data set in storage!");
  },

  clearSessionData: function() {
    return localStorage.clear();
  }
};
function logof(returnPath, ctx) {
  userManager.clearSessionData();
  ctx.redirect(returnPath);
}

function getRegister(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  if (typeof ctx.authtoken !== "undefined") {
    alert("Only unlogged users can register!");
    if (confirm("Do you wish to Log off?")) {
      userManager.logof("/register", ctx);
    }
    return;
  }
  partials["registerForm"] = "../templates/register/registerForm.hbs";
  this.loadPartials(partials).then(function() {
    this.partial("../templates/register/registerPage.hbs");
  });
}

function postRegistration(ctx) {
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

function getLogin(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  if (typeof ctx.username !== "undefined") {
    alert("You are currently loged in as: " + ctx.username);
    if (confirm("Do you wish to Log off?")) {
      userManager.logof("/login", ctx);
    }
    return;
  }
  partials["loginForm"] = "../templates/login/loginForm.hbs";
  this.loadPartials(partials).then(function() {
    this.partial("../templates/login/loginPage.hbs");
  });
}

function postLogin(ctx) {
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

//-----------------------------------------------------------------------------------
function getIndex(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  this.loadPartials(partials).then(function() {
    this.partial("../templates/home/home.hbs");
  });
}

function getAbout(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  this.loadPartials(partials).then(function() {
    this.partial("../templates/about/about.hbs");
  });
}

function getCatalog(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  partials["team"] = "../templates/catalog/team.hbs";
  get("appdata", "kinvey", "teams")
    .then(data => {
      ctx["teams"] = [...data];
      ctx["teamLess"] = ctx["teams"]
        .reduce((a, b) => {
          return [...a, ...b.players];
        }, [])
        .every(x => x.userId !== ctx.userId);
    })
    .then(() => {
      this.loadPartials(partials).then(function() {
        this.partial("../templates/catalog/teamCatalog.hbs");
      });
    });
}

function getCatalogCreate(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  partials["createForm"] = "../templates/create/createForm.hbs";
  this.loadPartials(partials).then(function() {
    this.partial("../templates/create/createPage.hbs");
  });
}

function postTeam(ctx) {
  const { name, comment } = ctx.params;
  const { username, userId } = userManager.retrieveCurrentUserData({});
  const players = [{ username, userId }];
  const newTeam = { name, comment, players };

  post("appdata", "kinvey", "/teams", newTeam).then(() =>
    ctx.redirect("/catalog")
  );
}

function getTeamDetails(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  partials["teamMember"] = "../templates/catalog/teamMember.hbs";
  partials["teamControls"] = "../templates/catalog/teamControls.hbs";

  get("appdata", "kinvey", "/teams/" + ctx.params.id).then(data => {
    ctx["players"] = data.players;
    ctx["teamId"] = data._id;
    ctx["description"] = data.comment;
    ctx["name"] = data.name;
    ctx["isAuthor"] = ctx.userId === data._acl.creator;
    ctx["isOnTeam"] = data.players.some(x => x.username === ctx.username);
    this.loadPartials(partials).then(function() {
      this.partial("../templates/catalog/details.hbs");
    });
  });
}

function leaveTeamAny(route = "", ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", "teams")
    .then(data => {
      let joinedTeam = data.find(x =>
        x.players.some(p => p.userId === ctx.userId)
      );
      if (typeof joinedTeam === "undefined") {
        console.log("player do not have team");
        return;
      }
      let { name, comment, players } = joinedTeam;
      players = players.filter(x => x.userId !== ctx.userId);
      put("appdata", "kinvey", "/teams/" + joinedTeam._id, {
        name,
        comment,
        players
      })
        .then(() => {
          if (typeof route !== "") {
            ctx.redirect(route);
          }
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
}

function joinTeam(route = "", ctx) {
  userManager.retrieveCurrentUserData(ctx);
  leaveTeamAny("", ctx);
  const teamId = ctx.params.id;
  get("appdata", "kinvey", "teams/" + teamId)
    .then(({ name, comment, players }) => {
      players.push({ username: ctx.username, userId: ctx.userId });
      put("appdata", "kinvey", "/teams/" + teamId, {
        name,
        comment,
        players
      })
        .then(() => {
          if (typeof route !== "") {
            ctx.redirect(route + `/${teamId}`);
          }
        })
        .catch(e => console.log(e));
    })
    .catch(e => console.log(e));
}

function getEditTeam(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  partials["editForm"] = "../templates/edit/editForm.hbs";
  get("appdata", "kinvey", "/teams/" + ctx.params.id).then(data => {
    ctx["name"] = data.name;
    ctx["id"] = data._id;
    ctx["comment"] = data.comment;
    this.loadPartials(partials).then(function() {
      this.partial("../templates/edit/editPage.hbs");
    });
  });
}

function postEditedTeam(route = "", ctx) {
  userManager.retrieveCurrentUserData(ctx);
  const teamId = ctx.params.id;
  get("appdata", "kinvey", "/teams/" + teamId).then(({ players }) => {
    put("appdata", "kinvey", "/teams/" + teamId, {
      players,
      name: ctx.params.name,
      comment: ctx.params.comment
    }).then(() => {
      if (route !== "") {
        ctx.redirect(route + "/" + teamId);
      }
    });
  });
}

(function Main() {
  userManager.clearSessionData();
  app.run("/home");
})();
