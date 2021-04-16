import AWS from 'aws-sdk';
const dynamodb = new AWS.DynamoDB.DocumentClient();

import corsHeaders from '../../utils/corsHeaders';
const cors = corsHeaders();

async function logSession(event, context) {
  const info = JSON.parse(event.body);
  let { enterTime, exitTime } = info;

  // Find length of time on div
  let enter = new Date(enterTime);
  let exit = new Date(exitTime);
  const sessionTime = (exit - enter) / 1000;

  const sessionArr = [
    {
      enterTime,
      exitTime,
      sessionTime,
    },
  ];

  // Get user IP address and only take first value for put into table
  let ip = event.headers['X-Forwarded-For'];
  ip = ip.split(',');
  ip = ip[0];

  //
  // Make API call to post user session
  //

  try {
    // Record user session - enter and exit time
    // Return records
    let params = {
      TableName: process.env.PORTFOLIO_TRACKER_TABLE_NAME,
      Key: { ip },
      UpdateExpression:
        'SET #sessions = list_append(if_not_exists(#sessions, :create_list), :sessionArr)',
      ExpressionAttributeNames: {
        '#sessions': 'sessions',
      },
      ExpressionAttributeValues: {
        ':sessionArr': sessionArr,
        ':create_list': [],
      },
      ReturnValues: 'ALL_OLD',
    };

    const result = await dynamodb.update(params).promise();

    // Side effect - calculate session stats information
    // compute total session time
    const allSessions = result.Attributes.sessions;

    let totalTime = 0;
    let count = 1;
    allSessions.forEach(s => {
      totalTime += s.sessionTime;
      count++;
    });
    const allSessionsInfo = {
      totalTime,
      count,
    };
    // Record overall user session time and count
    params = {
      TableName: process.env.PORTFOLIO_TRACKER_TABLE_NAME,
      Key: { ip },
      UpdateExpression: 'SET #si = :ss',
      ExpressionAttributeNames: {
        '#si': 'sessionsInfo',
      },
      ExpressionAttributeValues: {
        ':ss': allSessionsInfo,
      },
    };

    await dynamodb.update(params).promise();

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify(sessionArr[0]),
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

export const handler = logSession;
