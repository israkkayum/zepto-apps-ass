document.addEventListener("DOMContentLoaded", function () {
  const wishlistContainer = document.getElementById("wishlist-container");
  const spinnerContainer = document.getElementById("spinner-container");

  // Check localStorage for wishlist
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Fetch book data from the API or use a local array (ensure you have book data available)
  let books = []; // Replace with your book data fetching logic

  // Fetch book data from the Gutenberg API
  async function fetchBooks() {
    // Show the spinner before starting the fetch
    spinnerContainer.style.display = "block";

    try {
      const response = await fetch("https://gutendex.com/books");
      const data = await response.json();
      books = data.results;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      displayWishlistBooks();
      spinnerContainer.style.display = "none";
    }
    // console.log(books);
  }

  // Function to update the wishlist counter
  function updateWishlistCount() {
    const wishlistCountElement = document.querySelector(".wishlist-count");
    wishlistCountElement.textContent = wishlist.length; // Update the counter
  }
  updateWishlistCount();

  // Function to display wishlist books
  function displayWishlistBooks() {
    // Check if the element exists before setting innerHTML
    if (!wishlistContainer) {
      console.error("Wishlist container not found");
      return;
    }

    wishlistContainer.innerHTML = ""; // Clear the container

    if (wishlist.length === 0) {
      noDataCard.style.display = "block";
      return;
    }

    // Filter books that are in the wishlist
    const wishlistedBooks = books.filter((book) => wishlist.includes(book.id));

    wishlistedBooks.forEach((book) => {
      const isLiked = wishlist.includes(book.id); // Check if book is in wishlist
      const div = document.createElement("div");
      div.innerHTML = `
        <div class="card-container">
          <div class="card-flex">
            <div class="card-image-container">
              <img class="card-image" src=${
                book.formats["image/jpeg"] || "default-cover.jpg"
              }>
            </div>
            <div class="card-content">
              <div class="flex-container">
               <a class="card-title" href="/book-details.html?id=${book.id}">${
        book.title
      }</a>
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
      wishlistContainer.appendChild(div);
    });

    // Attach click event listeners to love icons
    document.querySelectorAll(".love-icon").forEach((icon) => {
      icon.addEventListener("click", function () {
        const bookId = parseInt(this.getAttribute("data-id"));

        // Toggle like/unlike status in the DOM
        this.classList.toggle("liked");

        // Update wishlist in localStorage
        if (wishlist.includes(bookId)) {
          wishlist = wishlist.filter((id) => id !== bookId); // Remove from wishlist
        } else {
          wishlist.push(bookId); // Add to wishlist
        }
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        // Update the wishlist count
        displayWishlistBooks();
        updateWishlistCount();
      });
    });
  }

  fetchBooks();
});
