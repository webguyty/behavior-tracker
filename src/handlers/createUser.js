import AWS from "aws-sdk";
const iplocate = require("node-iplocate");
var zipcodes = require("zipcodes");

import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import createHttpError from "http-errors";
import cors from "@middy/http-cors";

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

  try {
    await dynamodb
      .put({
        TableName: process.env.PORTFOLIO_TRACKER_TABLE_NAME,
        Item: newUser,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    // Headers required for CORS
    // headers: {
    //   "Access-Control-Allow-Headers": "Content-Type",
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "POST",
    // },
    body: JSON.stringify(newUser),
  };
}

export const handler = middy(createUser)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler())
  .use(cors());
