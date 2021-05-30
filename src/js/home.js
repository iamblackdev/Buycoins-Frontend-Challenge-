let storeUsername = document.forms.storeUsername;
storeUsername.addEventListener("submit", e => {
  e.preventDefault();
  console.log("heol");
  localStorage.setItem("userName", storeUsername.username.value);
  storeUsername.username.value = "";
  window.location = "profile.html";
});
