// import AWS from "aws-sdk";
// const dynamodb = new AWS.DynamoDB.DocumentClient();

async function logDivTime(event, context) {
  let info = event.payload;
  // const newUser = {
  //   ip,
  //   location,
  //   visits: [firstVisit],
  // };

  // await dynamodb
  //   .put({
  //     TableName: "PortfolioTrackerTable",
  //     Item: newUser,
  //   })
  //   .promise();

  return {
    statusCode: 201,
    // Headers required for CORS
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
    },
    body: JSON.stringify(info),
  };
}

export const handler = logDivTime;
