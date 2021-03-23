import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

import corsHeaders from "../../utils/corsHeaders";
const cors = corsHeaders();

async function logUser(event, context) {
  // Get user IP address and only take first value
  let ip = event.headers["X-Forwarded-For"];
  ip = ip.split(",");
  ip = ip[0];

  const params = {
    TableName: process.env.PORTFOLIO_TRACKER_TABLE_NAME,
    Key: { ip: user.ip },
    UpdateExpression:
      "SET #ul = :userLocation, #v = list_append(if_not_exists(#v, :create_list), :visit)",
    ExpressionAttributeNames: {
      "#ul": "userLocation",
      "#v": "visits",
    },
    ExpressionAttributeValues: {
      ":userLocation": user.location,
      ":visit": user.visit,
      ":create_list": [],
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamodb.update(params).promise();

    return {
      statusCode: 201,
      headers: cors,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: cors,
      body: "A horrible error has occured",
    };
  }
}

export const handler = logUser;
