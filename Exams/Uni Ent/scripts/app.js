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
  this.get("/event-details/:id", getDetails);

  this.get("/register", accountController.getRegister);
  this.post("/register", accountController.postRegistration);
  this.get("/login", accountController.getLogin);
  this.post("/login", accountController.postLogin);
  this.get("/logout", accountController.logoff);

  this.get("/create-event", getCreateEvent);
  this.post("/create-event", postCreatedEvent);
  this.get("/join-event/:id", joinEvent);
  this.get("/delete-event/:id", deleteEvent);
  this.get("/edit-event/:id", getEditEvent);
  this.post("/edit-event/:id", postEditedEvent);
  this.get("/profile-info", getProfileInfo);
});


function getIndex(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  if (ctx.authtoken) {
    get("appdata", "kinvey", "events").then(evnts => {
      ctx["events"] = evnts.sort(
        (a, b) => b.peopleInterestedIn - a.peopleInterestedIn
      );
      this.loadPartials(partials).partial("../templates/home/home-user.hbs");
    });
  } else {
    this.loadPartials(partials).partial("../templates/home/home-guest.hbs");
  }
}

function getDetails(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", `events/${ctx.params.id}`).then(evnt => {
    ctx["event"] = evnt;
    ctx["isAuthor"] = evnt._acl.creator === ctx.userId;
    this.loadPartials(partials).partial("../templates/events/details.hbs");
  });
}

function getCreateEvent(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  this.loadPartials(partials).partial("../templates/events/createForm.hbs");
}

function postCreatedEvent(ctx) {
  let emptyFields = [...Object.keys(ctx.params)].filter(
    x => ctx.params[x] === ""
    );
    if (emptyFields.length > 0) {
      alert("Empty field unallowed: " + emptyFields.join(", "));
      return;
    }
    
    const { name, dateTime, description, imageURL } = ctx.params;
    
    const newEvent = {
      name,
      dateTime,
      description,
      imageURL,
      peopleInterestedIn: 0,
      organiser: userManager.retrieveCurrentUserData({}).username
    };
    
    post("appdata", "kinvey", "/events", newEvent).then(rec => {
      ctx.redirect(`/event-details/${rec._id}`);
    });
  }
  
  function joinEvent(ctx) {
    userManager.retrieveCurrentUserData(ctx);
    get("appdata", "kinvey", `events/${ctx.params.id}`).then(rec => {
      if (ctx.userId === rec._acl.creator) {
        alert("User cant join his own events!");
        return;
      }
      
      put("appdata", "kinvey", `events/${ctx.params.id}`, {
        name: rec.name,
        dateTime: rec.dateTime,
        description: rec.description,
        imageURL: rec.imageURL,
        peopleInterestedIn: +rec.peopleInterestedIn + 1,
        organiser: rec.organiser
      }).then(() => {
        ctx.redirect(`/event-details/${rec._id}`);
      });
    });
  }
  
  function deleteEvent(ctx) {
    get("appdata", "kinvey", `/events/${ctx.params.id}`).then(rec => {
      if (rec._acl.creator !== userManager.retrieveCurrentUserData({}).userId) {
        alert("Only creator can delete Event!");
        return;
      }
      
    del("appdata", "kinvey", `/events/${ctx.params.id}`).then(() => {
      ctx.redirect("/");
    });
  });
}

function getEditEvent(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", `/events/${ctx.params.id}`)
  .then(rec => {
    ctx["event"] = rec;
    this.loadPartials(partials).partial("../templates/events/editForm.hbs");
  })
  .catch(() => {
    ctx.redirect("/");
  });
}

function postEditedEvent(ctx) {
  if (ctx.params.authorId !== userManager.retrieveCurrentUserData({}).userId) {
    alert("You are not author and thus not authorised to modify event!");
    return;
  }
  const {
    name,
    description,
    peopleInterestedIn,
    organiser,
    imageURL,
    dateTime
  } = ctx.params;
  
  put("appdata", "kinvey", `/events/${ctx.params.id}`, {
    name,
    description,
    peopleInterestedIn,
    organiser,
    imageURL,
    dateTime
  })
  .then(rec => {
    ctx.redirect(`/event-details/${rec._id}`);
  })
  .catch(() => {
    ctx.redirect("/edit-event/" + ctx.params.id);
  });
}

function getProfileInfo(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", "/events")
    .then(evnts => {
      ctx["events"] = evnts.filter(x => x._acl.creator === ctx.userId).map(e=>e.name);
      ctx["eventsCount"] = ctx["events"].length;
      this.loadPartials(partials).partial(
        "../templates/accounts/profileInfo.hbs"
      );
    })
    .catch(() => ctx.redirect("/"));
}

//----------------------------------------------------------------------------------------------------------------------
(function Main() {
  userManager.clearSessionData();
  app.run("/home");
})();
