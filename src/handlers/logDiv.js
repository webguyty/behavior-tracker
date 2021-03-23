// import AWS from "aws-sdk";
// const dynamodb = new AWS.DynamoDB.DocumentClient();

import corsHeaders from "../../utils/corsHeaders";
const cors = corsHeaders();

async function logDiv(event, context) {
  const info = JSON.parse(event.body);
  const { divName, enterTime, exitTime } = info;

  return {
    statusCode: 200,
    headers: cors,
    body: divName + enterTime + exitTime,
  };
}

export const handler = logDiv;
