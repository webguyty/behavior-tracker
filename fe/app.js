// import "../node_modules/gumshoejs/dist/gumshoe.min.js";

const apiURL = "https://ywhvk48wn5.execute-api.us-west-2.amazonaws.com/dev";

// Initializing gumshoe
const header = document.querySelector("#my-awesome-nav");
const spy = new Gumshoe("#my-awesome-nav a", {
  offset: 200,
});

// User state
let user = {};

// API Methods

const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

async function logUser() {
  try {
    const res = await axios.post(`${apiURL}/logUser`);

    user = res.data;
    console.log(user);
  } catch (err) {
    console.log(err);
  }
}

async function logDiv(info) {
  try {
    const res = await axios.patch(`${apiURL}/logDiv`, {
      firstName: "Bitchboy",
    });

    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
}

logUser();

// Create object for gumshoe to send
let divStats = {
  divName: "",
  enterTime: "",
  exitTime: "",
};

// When div becomes active on screen, activate Gumshoe

document.addEventListener(
  "gumshoeActivate",
  (event) => {
    // Div name
    const divID = event.detail.content.id;
    divStats.divName = divID;

    // Div enter time
    let now = new Date();
    now = now.toISOString();
    divStats.enterTime = now;
  },
  false
);

// When div becomes deactive on screen, deactivate Gumshoe
document.addEventListener(
  "gumshoeDeactivate",
  (event) => {
    const divID = event.detail.content.id;

    // If things are are working correctly give exit time
    if (divID === divStats.divName) {
      // Div exit time
      let now = new Date();
      now = now.toISOString();
      divStats.exitTime = now;
    } else {
      // Create an error message to read in DB
      divStats.divName = `${divID} - page reloaded`;
      divStats.enterTime = now;
      divStats.exitTime = now;
    }

    logDiv(divStats);
    // console.log(divStats);
    divStats = {};
  },
  false
);
