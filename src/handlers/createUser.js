async function createUser(event, context) {
  const now = new Date();
  const newUser = {
    ip: "",
    firstVisit: now.toISOString(),
  };
  return {
    statusCode: 200,
    body: JSON.stringify({ event, context }),
  };
}

export const handler = createUser;
