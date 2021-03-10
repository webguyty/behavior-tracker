import AWS from "aws-sdk";
const iplocate = require("node-iplocate");
var zipcodes = require("zipcodes");

const dynamodb = new AWS.DynamoDB.DocumentClient();

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
  const ipResult = await iplocate(ip);
  location = {
    city: ipResult.city,
    country: ipResult.country,
    zip: ipResult.postal_code,
  };

  // Get state location from zip code
  const zipResults = zipcodes.lookup(location.zip);
  location.state = zipResults.state;

  const newUser = {
    ip,
    location,
    visits: [firstVisit],
  };

  await dynamodb
    .put({
      TableName: process.env.PORTFOLIO_TRACKER_TABLE_NAME,
      Item: newUser,
    })
    .promise();

  return {
    statusCode: 201,
    // Headers required for CORS
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    },
    body: JSON.stringify(newUser),
  };
}

export const handler = createUser;
