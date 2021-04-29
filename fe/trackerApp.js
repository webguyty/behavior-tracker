// import Gumshoe from 'gumshoejs/dist/gumshoe.polyfills';
// import axios from 'axios';

class trackerApp {
  constructor() {
    // Schema of user object
    this.user = {
      // Partition key = ip
      ip: '',
      userLocation: {
        city: '',
        state: '',
        country: '',
        zip: '',
        lat: '',
        long: '',
      },
      visits: [],
      divVisits: [],
      linksClicked: [],
    };

    this.apiURL = 'https://ywhvk48wn5.execute-api.us-west-2.amazonaws.com/dev';
    this.axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    this.sessionStats = {
      enterTime: '',
      exitTime: '',
    };

    // For logging stats of the divs visited in GumShoe
    this.divStats = {
      divName: '',
      enterTime: '',
      exitTime: '',
      divTime: '',
    };
  }

  start() {
    // init gumshoe
    const spy = new Gumshoe('#my-awesome-nav a', {
      offset: 200,
      nested: true,
    });

    // Log user's info into db and into user obj
    // REQUIRED
    this.trackUser();

    // Initial optional trackers
    this.trackDivs();
    this.trackLinks();
    this.trackSessions();
  }

  // Required - Log user's info into db and into user obj
  trackUser() {
    this.logUser();
  }

  //
  // Session event listener
  //
  trackSessions() {
    // add start time for session tracking
    let now = new Date();
    this.sessionStats.enterTime = now.toISOString();

    window.addEventListener('visibilitychange', () => {
      // If user hides and comes back to page consider it a new session
      if (document.visibilityState === 'visible') {
        this.sessionStats.enterTime = new Date().toISOString();
      }

      // If user leaves or hides page send logSession API call
      if (document.visibilityState === 'hidden') {
        this.sessionStats.exitTime = new Date().toISOString();

        this.logSession(this.sessionStats);

        this.sessionStats.enterTime = '';
        this.sessionStats.exitTime = '';
      }
    });
  }

  //
  // Gumshoe - div and link tracking
  //

  trackDivs() {
    // Configure for reading first div 'header' when page loads. If page is reloaded a reload message will appear
    this.divStats.divName = 'header';
    let now = new Date();
    this.divStats.enterTime = now.toISOString();

    // Add event listeners to log div time with Gumshoe
    // When div becomes active on screen, activate Gumshoe
    document.addEventListener(
      'gumshoeActivate',
      event => {
        // Div name
        const divID = event.detail.content.id;
        this.divStats.divName = divID;

        // Div enter time
        let now = new Date();
        this.divStats.enterTime = now.toISOString();
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
        if (divID === this.divStats.divName) {
          // Div exit time
          this.divStats.exitTime = now;
        } else {
          // Create a this.divStats object that had to result from page reload or some type of error
          this.divStats.divName = `${divID} - page reloaded`;
          this.divStats.enterTime = now;
          this.divStats.exitTime = now;
        }

        this.logDiv(this.divStats);

        this.divStats = {};
      },
      false
    );
  }

  // Event listeners for links
  trackLinks() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
      link.addEventListener('click', e => {
        this.logLink({ link: link.href });
      });
    });
  }

  //
  // Api Calls
  //

  getUser = async () => {
    try {
      const res = await axios.get(`${this.apiURL}/user`);

      const user = res.data;
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  getUserByIP = async ip => {
    try {
      const res = await axios.get(`${this.apiURL}/user/${ip}`);

      const user = res.data;
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  logUser = async () => {
    try {
      const res = await axios.post(`${this.apiURL}/logUser`);

      const user = res.data;

      return user;
    } catch (err) {
      console.log(err);
    }
  };

  logDiv = async info => {
    try {
      const res = await axios.patch(
        `${this.apiURL}/logDiv`,
        info,
        this.axiosConfig
      );
    } catch (err) {
      console.log(err);
    }
  };

  logLink = async info => {
    try {
      const res = await axios.patch(
        `${this.apiURL}/logLink`,
        info,
        this.axiosConfig
      );

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  logSession = async info => {
    try {
      const res = await fetch(`${this.apiURL}/logSession`, {
        method: 'POST',
        headers: this.axiosConfig.headers,
        body: JSON.stringify(info),
        keepalive: true,
      });
    } catch (err) {
      console.log(err);
    }
  };
}

// export default trackerApp;
