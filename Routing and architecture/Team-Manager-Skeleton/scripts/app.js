"use strct";
import * as accountController from "./accountControler.js";
import { userManager, partials, get, post, put } from "./controler_base.js";

var app = Sammy("#main", function() {
  this.use("Handlebars", "hbs");
  this.get("/", getIndex);
  this.get("/home", getIndex);
  this.get("/about", getAbout);

  this.get("/register", accountController.getRegister);
  this.post("/register", accountController.postRegistration);
  this.get("/login", accountController.getLogin);
  this.post("/login", accountController.postLogin);
  this.get("/logout", accountController.logoff.bind(undefined, "/"));

  this.get("/catalog", getCatalog);
  this.get("/create-team", getCatalogCreate);
  this.post("/create-team", postTeam);
  this.get("/catalog/:id", getTeamDetails);
  this.get("/leaveTeam", leaveTeamAny.bind(undefined, "/catalog"));
  this.get("/joinTeam/:id", joinTeam.bind(undefined, "/catalog"));
  this.get("/editTeam/:id", getEditTeam);
  this.post("/editTeam/:id", postEditedTeam.bind(undefined, "/catalog"));
});

function getIndex(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  this.loadPartials(partials).partial("../templates/home/home.hbs");
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
