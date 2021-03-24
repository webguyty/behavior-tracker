import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

import corsHeaders from "../../utils/corsHeaders";
const cors = corsHeaders();

async function logLink(event, context) {
  const { link } = JSON.parse(event.body);

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
      "SET #lc = list_append(if_not_exists(#lc, :create_list), :linksArr)",
    ExpressionAttributeNames: {
      "#lc": "linksClicked",
    },
    ExpressionAttributeValues: {
      ":linksArr": [link],
      ":create_list": [],
    },
    ReturnValues: "NONE",
  };

  try {
    await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      headers: cors,
      body: link,
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

export const handler = logLink;
