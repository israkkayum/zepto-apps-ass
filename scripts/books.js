document.addEventListener("DOMContentLoaded", function () {
  const bookList = document.getElementById("book-list");
  const pagination = document.getElementById("pagination");
  const searchInput = document.getElementById("search-input");
  const dropdownButton = document.getElementById("dropdown-button");
  const dropdownList = document.getElementById("dropdown-list");
  const spinnerContainer = document.getElementById("spinner-container");
  const noDataCard = document.getElementById("no-data-card");

  let booksData = [];
  let currentPage = 1;
  let isFetching = false;
  let nextUrl = null;
  let prevUrl = null;
  let genres = new Set();

  // Store wishlist in localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Function to update the wishlist counter
  function updateWishlistCount() {
    const wishlistCountElement = document.querySelector(".wishlist-count");
    wishlistCountElement.textContent = wishlist.length;
  }

  // Toggle dropdown visibility
  dropdownButton.addEventListener("click", () => {
    dropdownList.style.display =
      dropdownList.style.display === "none" ? "block" : "none";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !dropdownButton.contains(e.target) &&
      !dropdownList.contains(e.target)
    ) {
      dropdownList.style.display = "none";
    }
  });

  // Fetch books from the API with error handling
  async function fetchBooks(url = "https://gutendex.com/books") {
    if (isFetching) return; // Prevent overlapping fetches
    isFetching = true;
    try {
      bookList.innerHTML = "";
      spinnerContainer.style.display = "block";
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      booksData = data.results;
      nextUrl = data.next;
      prevUrl = data.previous;

      extractGenres(booksData);
      populateDropdown(genres);
      displayBooks(booksData);
      generatePagination();
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      spinnerContainer.style.display = "none";
      isFetching = false;
    }
  }

  // Function to display books
  function displayBooks(books) {
    bookList.innerHTML = "";
    if (books.length === 0) {
      noDataCard.style.display = "block";
      return;
    }

    books.forEach((book) => {
      const isLiked = wishlist.includes(book.id);
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="card-container">
          <div class="card-flex">
            <div class="card-image-container">
              <img class="card-image" src="${
                book.formats["image/jpeg"] || "default-cover.jpg"
              }">
            </div>
            <div class="card-content">
              <div class="flex-container">
                  <a class="card-title" href="../pages/book-details.html?id=${
                    book.id
                  }">${book.title}</a>

                  <div class="icon-container">
                    <svg class="love-icon ${isLiked ? "liked" : ""}" 
                  data-id="${
                    book.id
                  }" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>
              </div>
              <p class="card-description">${
                book.subjects.length > 0
                  ? book.subjects.slice(0, 3).join(", ")
                  : "Unknown"
              }
              </p>
              <div class="card-footer-container">
                <div>
                  <a class="author-name"> By ${book.authors
                    .map((author) => author.name)
                    .join(", ")}</a>
                </div>
                <div>
                  <span class="id-view">
                    <svg class="id-view-icon" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5-3.9 19.5m-2.1-19.5-3.9 19.5" />
                    </svg>
                    ${book.id}
                  </span>
                  <span class="downloads">
                    <svg class="downloads-icon" stroke="currentColor" stroke-width="2" fill="none"
                        stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg> ${book.download_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      bookList.appendChild(div);
    });

    // Attach event listeners to love icons
    document.querySelectorAll(".love-icon").forEach((icon) => {
      icon.addEventListener("click", function () {
        const bookId = parseInt(this.getAttribute("data-id"));
        this.classList.toggle("liked");
        if (wishlist.includes(bookId)) {
          wishlist = wishlist.filter((id) => id !== bookId);
        } else {
          wishlist.push(bookId);
        }
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        updateWishlistCount();
      });
    });

    updateWishlistCount();
  }

  // Debounce Search functionality
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debouncedSearch = debounce(function () {
    const searchTerm = searchInput.value.toLowerCase();

    // Update the URL with the search query
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("search", searchTerm);
    window.history.replaceState(null, "", newUrl);

    currentPage = 1;

    fetchBooks(`https://gutendex.com/books?search=${searchTerm}`);
  }, 300);

  searchInput.addEventListener("input", debouncedSearch);

  // Dropdown option select and filter books
  dropdownList.addEventListener("click", (e) => {
    if (e.target.classList.contains("dropdown-option")) {
      const selectedGenre = e.target.getAttribute("data-genre");

      const dropdownText = document.querySelector(".dropdown-text");
      dropdownText.textContent =
        selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1);

      filterBooksByGenre(selectedGenre);

      dropdownList.style.display = "none";
    }
  });

  // Function to filter books by genre (query API using `topic` parameter)
  function filterBooksByGenre(genre) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set("genre", genre);
    window.history.replaceState(null, "", newUrl);

    currentPage = 1;

    fetchBooks(`https://gutendex.com/books?topic=${genre.toLowerCase()}`);
  }

  // Extract unique genres/topics from the book data
  function extractGenres(books) {
    books.forEach((book) => {
      book.subjects.forEach((subject) => {
        genres.add(subject.toLowerCase());
      });
    });
  }

  // Populate dropdown with genres/topics
  function populateDropdown(genres) {
    dropdownList.innerHTML = "";
    genres.forEach((genre) => {
      const li = document.createElement("li");
      li.classList.add("dropdown-option");
      li.setAttribute("data-genre", genre);
      li.textContent = genre.charAt(0).toUpperCase() + genre.slice(1);
      dropdownList.appendChild(li);
    });
  }

  // Function to generate pagination buttons
  function generatePagination() {
    pagination.innerHTML = `
    <li>
      <button class="pagination-button ${
        !prevUrl ? "disabled" : ""
      }" id="prev-page">
        <span>
          <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 9.8125H4.15625L9.46875 4.40625C9.75 4.125 9.75 3.6875 9.46875 3.40625C9.1875 3.125 8.75 3.125 8.46875 3.40625L2 9.96875C1.71875 10.25 1.71875 10.6875 2 10.9688L8.46875 17.5312C8.59375 17.6562 8.78125 17.75 8.96875 17.75C9.15625 17.75 9.3125 17.6875 9.46875 17.5625C9.75 17.2812 9.75 16.8438 9.46875 16.5625L4.1875 11.2188H17.5C17.875 11.2188 18.1875 10.9062 18.1875 10.5312C18.1875 10.125 17.875 9.8125 17.5 9.8125Z" fill="currentColor"/>
          </svg>
        </span>
      </button>
    </li>
  `;

    pagination.innerHTML += `
    <li><button class="pagination-button active">${currentPage}</button></li>
  `;

    pagination.innerHTML += `
    <li>
      <button class="pagination-button ${
        !nextUrl ? "disabled" : ""
      }" id="next-page">
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 10L11.5312 3.4375C11.25 3.15625 10.8125 3.15625 10.5312 3.4375C10.25 3.71875 10.25 4.15625 10.5312 4.4375L15.7812 9.78125H2.5C2.125 9.78125 1.8125 10.0937 1.8125 10.4688C1.8125 10.8438 2.125 11.1875 2.5 11.1875H15.8437L10.5312 16.5938C10.25 16.875 10.25 17.3125 10.5312 17.5938C10.6562 17.7188 10.8437 17.7812 11.0312 17.7812C11.2187 17.7812 11.4062 17.7188 11.5312 17.5625L18 11C18.2812 10.7187 18.2812 10.2812 18 10Z" fill="currentColor"/>
        </svg>
      </button>
    </li>
  `;
  }

  // Event listener for pagination buttons
  pagination.addEventListener("click", async function (e) {
    const targetButton = e.target.closest("button");
    if (!targetButton) return;

    if (targetButton.id === "prev-page" && prevUrl) {
      currentPage--;
      await fetchBooks(prevUrl);
    }

    if (targetButton.id === "next-page" && nextUrl) {
      currentPage++;
      await fetchBooks(nextUrl);
    }
  });

  fetchBooks("https://gutendex.com/books");
});
