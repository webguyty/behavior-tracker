const apiURL = "https://3uw8yuipx5.execute-api.us-west-2.amazonaws.com/dev";
import "../node_modules/gumshoejs/dist/gumshoe.min.js";

// Initializing gumshoe
const header = document.querySelector("#my-awesome-nav");
const spy = new Gumshoe("#my-awesome-nav a", {
  // offset: function () {
  //   return header.getBoundingClientRect().height;
  // },
  offset: 200,
});

// Create user when logging into page
fetch(`${apiURL}/createUser`, {
  method: "POST",
})
  .then((res) => res.json())
  .then((data) => console.log(data));

document.addEventListener(
  "gumshoeActivate",
  (event) => {
    const divID = event.detail.content.id;

    if (divID !== "content") {
      console.log("Entering " + divID);
    }
  },
  false
);

document.addEventListener(
  "gumshoeDeactivate",
  (event) => {
    const divID = event.detail.content.id;

    if (divID !== "content") {
      console.log("Exiting " + divID);
    }
  },
  false
);
