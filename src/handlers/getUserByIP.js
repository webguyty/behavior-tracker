import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

import corsHeaders from "../../utils/corsHeaders";
const cors = corsHeaders();

async function getUserByIP(event, context) {
  const ip = event.pathParameters.ip;

  const params = {
    TableName: process.env.PORTFOLIO_TRACKER_TABLE_NAME,
    Key: { ip },
  };

  try {
    let result = await dynamodb.get(params).promise();

    result = result.Item ? result.Item : "No records found";

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify(result),
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

export const handler = getUserByIP;
