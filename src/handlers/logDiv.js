import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

import corsHeaders from "../../utils/corsHeaders";
const cors = corsHeaders();

async function logDiv(event, context) {
  let info = event.body;

  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify(info),
  };
}

export const handler = logDiv;
