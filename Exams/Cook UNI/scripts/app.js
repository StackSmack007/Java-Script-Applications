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

var app = Sammy("#rooter", function() {
  this.use("Handlebars", "hbs");

  this.get("/", getIndex);
  this.get("/home", getIndex);
  this.get("/details/:id", getDetails);

  this.get("/register", accountController.getRegister);
  this.post("/register", accountController.postRegistration);
  this.get("/login", accountController.getLogin);
  this.post("/login", accountController.postLogin);
  this.get("/logout", accountController.logoff.bind(undefined, "/"));

  this.get("/create-recipe", getCreateRecipe);
  this.post("/create-recipe", postCreatedRecipe);
  this.get("/give-like/:id", giveLike);
  this.get("/delete/:id", removeRecipe);
  this.get("/edit-recipe/:id", editRecipe);
  this.post("/edit-recipe", postEditedRecipe);
});

const categoryImgMap = {
  "Grain Food":
    "https://cdn.pixabay.com/photo/2014/12/11/02/55/corn-syrup-563796__340.jpg",
  "Vegetables and legumes/beans":
    "https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549__340.jpg",
  Fruits:
    "https://cdn.pixabay.com/photo/2017/06/02/18/24/fruit-2367029__340.jpg",
  "Milk, cheese, eggs and alternatives":
    "https://image.shutterstock.com/image-photo/assorted-dairy-products-milk-yogurt-260nw-530162824.jpg",
  "Lean meats and poultry, fish and alternatives":
    "https://t3.ftcdn.net/jpg/01/18/84/52/240_F_118845283_n9uWnb81tg8cG7Rf9y3McWT1DT1ZKTDx.jpg"
};

function getIndex(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  if (ctx.authtoken) {
    get("appdata", "kinvey", "recipes").then(recipes => {
      ctx["recipes"] = recipes;
      this.loadPartials(partials).partial("../templates/home/home-user.hbs");
    });
  } else {
    this.loadPartials(partials).partial("../templates/home/home-guest.hbs");
  }
}

function getDetails(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", `recipes/${ctx.params.id}`).then(rec => {
    ctx["recipe"] = rec;
    this.loadPartials(partials).partial("../templates/recipe/details.hbs");
  });
}

function getCreateRecipe(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  this.loadPartials(partials).partial("../templates/recipe/createForm.hbs");
}

function postCreatedRecipe(ctx) {
  let emptyFields = [...Object.keys(ctx.params)].filter(
    x => ctx.params[x] === ""
  );
  if (emptyFields.length > 0) {
    alert("Empty field unallowed: " + emptyFields.join(", "));
    return;
  }

  ctx.params.ingredients = ctx.params.ingredients.split(", ");
  const {
    meal,
    ingredients,
    prepMethod,
    description,
    foodImageURL,
    category
  } = ctx.params;
  const newRecepy = {
    meal,
    ingredients,
    prepMethod,
    description,
    foodImageURL,
    category
  };

  newRecepy.likesCounter = 0;
  if (categoryImgMap.hasOwnProperty(newRecepy.category)) {
    newRecepy["categoryImageURL"] = categoryImgMap[newRecepy.category];
  } else {
    newRecepy["categoryImageURL"] =
      "https://ichef.bbci.co.uk/news/410/cpsprodpb/16CE8/production/_109061439_hi018470968.jpg";
  }
  post("appdata", "kinvey", "/recipes", newRecepy).then(rec => {
    ctx.redirect(`/details/${rec._id}`);
  });
}

function giveLike(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", `recipes/${ctx.params.id}`).then(rec => {
    rec.likesCounter++;
    put("appdata", "kinvey", `recipes/${ctx.params.id}`, rec).then(() => {
      ctx.redirect(`/details/${ctx.params.id}`);
    });
  });
}

function removeRecipe(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  del("appdata", "kinvey", `recipes/${ctx.params.id}`).then(() => {
    ctx.redirect(`/`);
  });
}

function editRecipe(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  get("appdata", "kinvey", `recipes/${ctx.params.id}`).then(rec => {
    rec.ingredients = rec.ingredients.join(", ");
    ctx.recipe = rec;
    this.loadPartials(partials).partial("../templates/recipe/editForm.hbs");
  });
}

function postEditedRecipe(ctx) {
  userManager.retrieveCurrentUserData(ctx);
  let {
    meal,
    description,
    ingredients,
    prepMethod,
    foodImageURL,
    category
  } = ctx.params;
  ingredients = ingredients.split(", ");
  const editedEntity = {
    meal,
    description,
    ingredients,
    prepMethod,
    foodImageURL,
    category,
    categoryImageURL: categoryImgMap[category],
    likesCounter: ctx.params.likesCounter
  };

  put("appdata", "kinvey", `recipes/${ctx.params.id}`, editedEntity).then(
    () => {
      ctx.redirect(`/details/${ctx.params.id}`);
    }
  );
}

//----------------------------------------------------------------------------------------------------------------------
(function Main() {
  userManager.clearSessionData();
  app.run("/home");
})();
