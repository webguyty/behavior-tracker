// import "../node_modules/gumshoejs/dist/gumshoe.min.js";

const apiURL = "https://k73ftbe5yi.execute-api.us-west-2.amazonaws.com/dev";

// Initializing gumshoe
const header = document.querySelector("#my-awesome-nav");
const spy = new Gumshoe("#my-awesome-nav a", {
  offset: 200,
});

// API Methods

async function logUser() {
  try {
    const res = await axios.post(
      "https://k73ftbe5yi.execute-api.us-west-2.amazonaws.com/dev/logUser"
    );

    sessionStorage.setItem("user", JSON.stringify(res.data));
    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
}

async function logDivTime(info) {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      `https://3uw8yuipx5.execute-api.us-west-2.amazonaws.com/dev/logDivTime`,
      info,
      config
    );

    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
}

logUser();

// Create object for gumshoe to send
let divStats = {
  div: "",
  enterTime: "",
  exitTime: "",
};

// When div becomes active on screen, activate Gumshoe

document.addEventListener(
  "gumshoeActivate",
  (event) => {
    // Div name
    const divID = event.detail.content.id;
    divStats.div = divID;

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

    if (divID === divStats.div) {
      // Div enter time
      let now = new Date();
      now = now.toISOString();
      divStats.exitTime = now;
    }

    logDivTime(divStats);
    // console.log(divStats);
    divStats = {};
  },
  false
);
