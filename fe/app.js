// import trackerApp from './trackerApp';

// const tracker = new trackerApp();

// tracker.start();

import '../node_modules/gumshoejs/dist/gumshoe.min.js';

const apiURL = 'https://ywhvk48wn5.execute-api.us-west-2.amazonaws.com/dev';

// Initializing gumshoe
const header = document.querySelector('#my-awesome-nav');
const spy = new Gumshoe('#my-awesome-nav a', {
  offset: 200,
});

//
// User state
//
//
let user = {};

//
// API Methods
//

const config = {
  headers: {
    'Content-Type': 'application/json',
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
    const res = await axios.patch(`${apiURL}/logDiv`, info, config);

    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
}

async function logLink(info) {
  try {
    const res = await axios.patch(`${apiURL}/logLink`, info, config);

    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
}

logUser();

// Create object for gumshoe to send
let divStats = {
  divName: '',
  enterTime: '',
  exitTime: '',
  divTime: '',
};

// When div becomes active on screen, activate Gumshoe

document.addEventListener(
  'gumshoeActivate',
  event => {
    // Div name
    const divID = event.detail.content.id;
    divStats.divName = divID;

    // Div enter time
    let now = new Date();
    divStats.enterTime = now.toISOString();
  },
  false
);

// When div becomes deactive on screen, deactivate Gumshoe
document.addEventListener(
  'gumshoeDeactivate',
  event => {
    const divID = event.detail.content.id;
    let now = new Date();
    now = now.toISOString();

    // If things are are working correctly give exit time
    if (divID === divStats.divName) {
      // Div exit time
      divStats.exitTime = now;
    } else {
      // Create a divStats object that had to result from page reload or some type of error
      divStats.divName = `${divID} - page reloaded`;
      divStats.enterTime = now;
      divStats.exitTime = now;
    }

    logDiv(divStats);

    divStats = {};
  },
  false
);

//
// Event listeners for links
//

const links = document.querySelectorAll('a');

links.forEach(link => {
  link.addEventListener('click', e => {
    logLink({ link: link.href });
  });
});
// console.log(links);
