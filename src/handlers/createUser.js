async function createUser(event, context) {
  const ip = JSON.parse(event.headers.X - Forwarded - For);
  const now = new Date();
  const newUser = {
    ip,
    firstVisit: now.toISOString(),
  };

  return {
    statusCode: 200,
    body: JSON.stringify({ ip }),
  };
}

export const handler = createUser;
