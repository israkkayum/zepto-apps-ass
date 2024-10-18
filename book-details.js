document.addEventListener("DOMContentLoaded", () => {
  const spinnerContainer = document.getElementById("spinner-container");
  const noDataCard = document.getElementById("no-data-card");
  // Fetch the book details using the ID from the query parameters
  const bookId = new URLSearchParams(window.location.search).get("id");

  // Wishlist stored in localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Function to update the wishlist counter
  function updateWishlistCount() {
    const wishlistCountElement = document.querySelector(".wishlist-count");
    wishlistCountElement.textContent = wishlist.length; // Update the counter
  }
  updateWishlistCount();

  async function fetchBookDetails(bookId) {
    spinnerContainer.style.display = "block";
    try {
      const response = await fetch(`https://gutendex.com/books/${bookId}`);
      const bookData = await response.json();

      // Ensure the .book-details-container exists before proceeding
      const bookContainer = document.querySelector(".book-details-container");
      if (!bookContainer) {
        console.error("Book container not found in the DOM");
        return;
      }

      if (!bookData.id) {
        noDataCard.style.display = "block";
        return;
      }

      // Extract data from the API response
      const title = bookData.title || "Title not available";
      const authors = bookData.authors || [];
      const subjects = bookData.subjects || [];
      const languages = bookData.languages || [];
      const bookshelves = bookData.bookshelves || [];
      const translators = bookData.translators || [];
      const downloadCount = bookData.download_count || "N/A";
      const mediaType = bookData.media_type || "N/A";
      const id = bookData.id || "N/A";
      const copyright = bookData.copyright || "Public Domain";
      const formats = bookData.formats || {};
      const coverUrl =
        bookData.formats["image/jpeg"] || "https://via.placeholder.com/150";

      // Helper function to create a list from array elements
      const createListItems = (array) => {
        return array.map((item) => `<li>${item}</li>`).join("");
      };

      // Helper function to create list items with links for formats
      const createFormatLinks = (formatsObj) => {
        return Object.entries(formatsObj)
          .map(([formatType, url]) => {
            return `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${formatType}</a></li>`;
          })
          .join("");
      };

      // Check if translators exist, and create the HTML block only if the array has elements
      const translatorSection =
        translators.length > 0
          ? `
           <div class="book-item">
             <span class="book-char">Translators</span>
             <ul class="custom-list">
               ${createListItems(
                 translators.map((translator) => translator.name)
               )}
             </ul>
           </div>`
          : "";

      const isLiked = wishlist.includes(id); // Check if book is in wishlist

      // Set the innerHTML to render the details in the container
      bookContainer.innerHTML = `
           <div class="book-container">
        <div class="overview">
            <div class="book-box">
                <img class="book-cover" src="${coverUrl}" alt="Book Cover">
               <div class="icon-container">
                    <svg class="love-icon ${isLiked ? "liked" : ""}" 
                  data-id="${id}" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="book-details">
            <div class="book-title">
                <h2>${title}</h2>
            </div>
            <div class="book-item">
                <span class="book-char">Authors</span>
                <ul class="custom-list">
                    ${createListItems(authors.map((author) => author.name))}
                </ul>
            </div>
              <!-- Only show this section if translators exist -->
           ${translatorSection} 
            <div class="book-item">
                <span class="book-char">Subjects</span>
                <ul class="custom-list">
                    ${createListItems(subjects)}
                </ul>
            </div>
            <div class="book-item">
                <span class="book-char">Languages</span>
                <ul class="custom-list">
                    ${createListItems(languages)}
                </ul>
            </div>
            <div class="book-item">
                <span class="book-char">Bookshelves</span>
                <ul class="custom-list">
                    ${createListItems(bookshelves)}
                </ul>
            </div>
            <div class="book-item">
                <span class="book-char">Formats</span>
                <ul class="custom-list">
                    ${createFormatLinks(formats)}
                </ul>
            </div>
            <div class="book-item">
                <span class="book-char">Others</span>
                <ul class="custom-list">
                    <li>ID: ${id}</li>
                    <li>Copyright: ${copyright}</li>
                    <li>Media Type: ${mediaType}</li>
                    <li>Download Count: ${downloadCount}</li>
                </ul>
            </div>
        </div>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      spinnerContainer.style.display = "none";
    }

    // Attach click event listeners to love icons
    document.querySelectorAll(".love-icon").forEach((icon) => {
      icon.addEventListener("click", function () {
        const wishListBookId = parseInt(this.getAttribute("data-id"));

        // Toggle like/unlike status in the DOM
        this.classList.toggle("liked");

        // Update wishlist in localStorage
        if (wishlist.includes(wishListBookId)) {
          wishlist = wishlist.filter((id) => id !== wishListBookId); // Remove from wishlist
        } else {
          wishlist.push(wishListBookId); // Add to wishlist
        }
        localStorage.setItem("wishlist", JSON.stringify(wishlist));

        // Update the wishlist count
        updateWishlistCount();
      });
    });
  }

  // Example usage: Fetch book with ID 1342 (Frankenstein)
  fetchBookDetails(bookId);
});
