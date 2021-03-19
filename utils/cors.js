const cors = () => {
  const corsHeaders = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS,POST,PATCH,GET,PUT",
  };

  return JSON.stringify(corsHeaders);
};

export default cors;