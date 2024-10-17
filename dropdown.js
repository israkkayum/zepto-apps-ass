function toggleDropdown() {
  const dropdownList = document.getElementById("dropdown-list");
  dropdownList.style.display =
    dropdownList.style.display === "block" ? "none" : "block";
}

function selectOption(name, imageUrl) {
  const dropdownText = document.querySelector(".dropdown-text");
  const avatar = document.querySelector(".dropdown-selected img");

  dropdownText.textContent = name;
  avatar.src = imageUrl;

  // Hide the dropdown after selecting
  toggleDropdown();
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  const dropdownContainer = document.querySelector(".dropdown-container");
  const dropdownList = document.getElementById("dropdown-list");

  if (!dropdownContainer.contains(event.target)) {
    dropdownList.style.display = "none";
  }
});
