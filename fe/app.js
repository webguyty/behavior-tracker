fetch("https://3uw8yuipx5.execute-api.us-west-2.amazonaws.com/dev/createUser", {
  method: "POST",
})
  .then((res) => res.json())
  .then((data) => console.log(data));
