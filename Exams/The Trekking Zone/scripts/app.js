"use strct";
import * as accountController from "./accountControler.js";
import {
  userManager,
  partials,
  get,
  post,
  put,
  del
} from "./controler_base.js";
// contentType,// authType,// endPoint,// data
var app = Sammy("body", function() {
  this.use("Handlebars", "hbs");

  this.get("/", getIndex);
  this.get("/home", getIndex);

  this.get("/accounts/register", accountController.getRegister);
  this.post("/accounts/register", accountController.postRegistration);
  this.get("/accounts/login", accountController.getLogin);
  this.post("/accounts/login", accountController.postLogin);
  this.get("/accounts/logout", accountController.logoff.bind(undefined, "/"));
  this.get("/accounts/profile/:id", getProfileInfo);

  this.get("/treks/create", getCreateTrek);
  this.post("/treks/create", postCreatedTrek);
  this.get("/treks/details/:id", getDetails);

  this.get("/treks/like/:id", giveLike);
  this.get("/treks/delete/:id", deleteTrek);
  this.get("/treks/edit/:id", getEditTrek);
  this.post("/treks/edit/:id", postEditedTrek);
});

function getIndex(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  if (ctx.authtoken) {
    get("appdata", "kinvey", "treks").then(evnts => {
      ctx["treks"] = evnts.sort((a, b) => b.likes - a.likes);
      this.loadPartials(partials).partial("../templates/home/home-user.hbs");
    });
  } else {
    this.loadPartials(partials).partial("../templates/home/home-guest.hbs");
  }
}

function getCreateTrek(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  this.loadPartials(partials).partial("../templates/treks/createForm.hbs");
}

function validateTreck(treck) {
  let status = "";
  if (treck.name.length < 6) {
    status += "Treck Name must be atleast 6 symbols long!\n";
  }
  if (treck.description.length < 10) {
    status += "Treck Description must be atleast 10 symbols long!\n";
  }
  return status;
}

function postCreatedTrek(ctx) {
  const { name, dateTime, description, imageURL } = ctx.params;

  const newTreck = {
    name,
    dateTime,
    description,
    imageURL,
    likes: 0,
    organiser: userManager.retrieveCurrentUserData({}).username
  };

  const status = validateTreck(newTreck);
  if (status !== "") {
    userManager.notify("errorBox", status, 3000);
  } else {
    post("appdata", "kinvey", "/treks", newTreck).then(rec => {
      userManager
        .notify("successBox", "Trek created successfully.", 1000)
        .then(() => {
          ctx.redirect(`/`);
        });
    });
  }
}

function getDetails(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", `treks/${ctx.params.id}`).then(rec => {
    ctx["trek"] = rec;
    ctx["isAuthor"] = rec._acl.creator === ctx.userId;
    this.loadPartials(partials).partial("../../templates/treks/details.hbs");
  });
}

function giveLike(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", `treks/${ctx.params.id}`).then(rec => {
    if (ctx.userId === rec._acl.creator) {
      alert("User cant join his own events!");
      return;
    }

    put("appdata", "kinvey", `treks/${ctx.params.id}`, {
      name: rec.name,
      dateTime: rec.dateTime,
      description: rec.description,
      imageURL: rec.imageURL,
      likes: +rec.likes + 1,
      organiser: rec.organiser
    }).then(() => {
      ctx.redirect(`/treks/details/${rec._id}`);
    });
  });
}

function deleteTrek(ctx) {
  get("appdata", "kinvey", `/treks/${ctx.params.id}`).then(rec => {
    if (rec._acl.creator !== userManager.retrieveCurrentUserData({}).userId) {
      alert("Only creator can delete Event!");
      return;
    }

    del("appdata", "kinvey", `/treks/${ctx.params.id}`).then(() => {
      ctx.redirect("/");
    });
  });
}

function getEditTrek(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", `/treks/${ctx.params.id}`)
    .then(rec => {
      ctx["trek"] = rec;
      this.loadPartials(partials).partial("../../templates/treks/editForm.hbs");
    })
    .catch(e => {
      console.log(e);
      ctx.redirect("/");
    });
}

function postEditedTrek(ctx) {
  if (ctx.params.creatorId !== userManager.retrieveCurrentUserData({}).userId) {
    alert("Only creator can delete Event!");
    return;
  }

  const {
    name,
    description,
    likes,

    imageURL,
    dateTime
  } = ctx.params;

  const editedTrek = {
    name,
    description,
    likes,
    organiser: userManager.retrieveCurrentUserData({}).username,
    imageURL,
    dateTime
  };

  const status = validateTreck(editedTrek);

  if (status !== "") {
    userManager.notify("errorBox", status, 3000);
  } else {
    put("appdata", "kinvey", `/treks/${ctx.params.id}`, editedTrek)
      .then(rec => {
        ctx.redirect(`/treks/details/${rec._id}`);
      })
      .catch(e => {
        console.log(e);
        ctx.redirect("/treks/edit/" + ctx.params.id);
      });
  }
}

function getProfileInfo(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", "/treks")
    .then(evnts => {
      ctx["treks"] = evnts
        .filter(x => x._acl.creator === ctx.userId)
        .map(e => e.name);
      ctx["treksCount"] = ctx["treks"].length;
      this.loadPartials(partials).partial(
        "../../templates/accounts/profileInfo.hbs"
      );
    })
    .catch(() => ctx.redirect("/"));
}

//----------------------------------------------------------------------------------------------------------------------
(function Main() {
  userManager.clearSessionData();
  app.run("/home");
})();
