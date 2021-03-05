const iplocate = require("node-iplocate");
var zipcodes = require("zipcodes");

async function createUser(event, context) {
  // Get user IP address and only take first value
  let ip = event.headers["X-Forwarded-For"];
  ip = ip.split(",");
  ip = ip[0];

  // Set first visit date
  const now = new Date();
  const firstVisit = now.toISOString();

  // Get user location
  let location = {};
  const result = await iplocate(ip);
  location = {
    city: result.city,
    country: result.country,
    zip: result.postal_code,
  };

  const zipResults = zipcodes.lookup(location.zip);

  location.state = zipResults.state;

  const newUser = {
    ip,
    location,
    firstVisit,
  };

  return {
    statusCode: 200,
    body: JSON.stringify({ newUser }),
  };
}

export const handler = createUser;
