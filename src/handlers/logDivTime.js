// import AWS from "aws-sdk";
// const dynamodb = new AWS.DynamoDB.DocumentClient();

import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
// import createHttpError from "http-errors";
// import cors from "@middy/http-cors";

async function logDivTime(event, context) {
  let info = event.body;

  return {
    statusCode: 200,
    // Headers required for CORS
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST",
    },
    body: JSON.stringify(info),
  };
}

// export const handler = logDivTime;

export const handler = middy(logDivTime)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
