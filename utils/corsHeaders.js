export default function corsHeaders() {
  return {
    'Access-Control-Allow-Headers':
      'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':
      'OPTIONS,POST,PATCH,GET,PUT,HEAD,CONNECT,OPTIONS,TRACE',
    'Access-Control-Allow-Methods': 'true',
  };
}
