const apiURL = "https://3uw8yuipx5.execute-api.us-west-2.amazonaws.com/dev";

// Initializing gumshoe
const header = document.querySelector("#my-awesome-nav");
const spy = new Gumshoe("#my-awesome-nav a", {
  offset: function () {
    return header.getBoundingClientRect().height;
  },
});

// Create user when logging into page
fetch(`${apiURL}/createUser`, {
  method: "POST",
})
  .then((res) => res.json())
  .then((data) => console.log(data));
