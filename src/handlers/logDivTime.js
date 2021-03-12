// import AWS from "aws-sdk";
// const dynamodb = new AWS.DynamoDB.DocumentClient();

import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
// import createHttpError from "http-errors";
// import cors from "@middy/http-cors";

async function logDivTime(event, context) {
  // let info = event.payload;

  return {
    statusCode: 200,
    // Headers required for CORS
    headers: {
      "Access-Control-Allow-Headers":
        "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Max-Age": 86400,
    },
    body: "Success",
  };
}

// export const handler = logDivTime;

export const handler = middy(logDivTime)
  .use(httpJsonBodyParser())
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
