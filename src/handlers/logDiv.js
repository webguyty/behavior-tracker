import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

import corsHeaders from "../../utils/corsHeaders";
const cors = corsHeaders();

async function logDiv(event, context) {
  const info = JSON.parse(event.body);
  const { divName, enterTime, exitTime } = info;

  // Find length of time on div
  const enterDate = new Date(enterTime);
  const exitDate = new Date(exitTime);
  const timeOnDivSec = (exitDate - enterDate) / 1000;

  const divArr = [
    {
      divName,
      enterTime,
      exitTime,
      timeOnDivSec,
    },
  ];

  //
  // Make API call
  //

  // Get user IP address and only take first value for put into table
  let ip = event.headers["X-Forwarded-For"];
  ip = ip.split(",");
  ip = ip[0];

  const params = {
    TableName: process.env.PORTFOLIO_TRACKER_TABLE_NAME,
    Key: { ip },
    UpdateExpression:
      "SET #dv = list_append(if_not_exists(#dv, :create_list), :divArr)",
    ExpressionAttributeNames: {
      "#dv": "divVisits",
    },
    ExpressionAttributeValues: {
      ":divArr": divArr,
      ":create_list": [],
    },
    ReturnValues: "NONE",
  };

  try {
    const result = await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify(divArr[0]),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify(error),
    };
  }
}

export const handler = logDiv;
