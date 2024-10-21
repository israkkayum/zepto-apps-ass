document.addEventListener("DOMContentLoaded", function () {
  // Select the hamburger button and navigation menu
  const hamburger = document.querySelector(".btn-hamburger");
  const nav = document.querySelector("nav");

  // Add click event listener to the hamburger button
  hamburger.addEventListener("click", function () {
    // Toggle the 'opened' class on the nav to show/hide the menu
    nav.classList.toggle("opened");
  });
});
