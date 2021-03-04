async function createUser(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ event, context }),
  };
}

export const handler = createUser;
