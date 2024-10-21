# Zepto Apps - Book Listing Application

This project is a responsive book listing web application that interacts with the [Gutenberg Project API](https://gutendex.com/) to display books, allow users to filter by genres/topics, and manage a wishlist. Each section of the project has been carefully separated into components to make the app easy to maintain and scale.

## Key Features

- **Book Listing**: Display a list of books fetched from the Gutenberg API.
- **Search Functionality**: Real-time search feature to filter books by title or author.
- **Genre/Topic Filter**: Filter books based on genres or topics using a dropdown menu.
- **Wishlist Management**: Add/remove books from a wishlist, with data saved in `localStorage`.
- **Book Details**: Detailed view for each book, including title, author, and subjects.
- **Pagination**: Navigate between pages of books with dynamic pagination controls.
- **Responsive Design**: Mobile-first design that works on all device sizes.

## Tech Stack

**Client:**

- HTML5
- CSS3 (vanilla CSS)
- JavaScript (vanilla JS)

**API:**

- Gutenberg Project API for book data

**LocalStorage:**

- For wishlist management

## Project File Breakdown

### `/assets/`

- **`css/`**
  - `navigation.css`: Contains styles specific to the navigation bar that is shared across all pages.
  - `styles.css`: The main CSS file that contains styles for the book listings, filters, and other components.
  - `book-details.css`: Contains styles specific to the book details page.
- **`images/`**
  - `book-logo.png`: The logo image used in the navigation bar.

### `/pages/`

- **`index.html`**: The homepage that displays the list of books, allows filtering, and searching for books.
- **`wishlist.html`**: A page where users can view their saved books (wishlist).
- **`book-details.html`**: A detailed view of a specific book that shows additional information such as title, author, and download count.

### `/scripts/`

- **`navbar.js`**: Manages the functionality of the navigation bar, including updating the wishlist count and handling the mobile hamburger menu.
- **`books.js`**: Main script for fetching and displaying books from the Gutenberg API, managing filters, pagination, and search functionality.
- **`wishlist.js`**: Handles the addition/removal of books from the wishlist, and persists the data using `localStorage`.
- **`book-details.js`**: Fetches and displays detailed information for a specific book on the book details page.

## Setup Instructions

- Clone the repository:

```bash
git clone https://github.com/your-username/zepto-apps.git
```

- Navigate to the project directory:

```bash
cd zepto-apps
```

- Open index.html in your browser:

  - You can use Live Server in VSCode or open the index.html file directly in your browser.

- Navigate to Other Pages:

  - To access the wishlist, go to /wishlist.html.

  - To view the book details page, the structure is prepared under /book-details.html.

## Usage

- Search for Books:

  - Enter a keyword in the search bar to filter books by title.

- Filter by Genre:

  - Use the genre/topic dropdown to filter books by specific genres.

- Manage Wishlist:

  - Click on the heart icon to add/remove books from the wishlist.

  - Your wishlist will be stored in your browser’s local storage and can be accessed from the Wishlist page.

- Pagination:

  - Navigate through different pages of books using the pagination controls at the bottom of the page.

## API Reference

This project uses the [Gutenberg Project API](https://gutendex.com/books) to fetch book data.

#### Get all items

```http
  GET /gutendex.com/books
```

| Parameter | Type     | Description                                    |
| :-------- | :------- | :--------------------------------------------- |
| `/books`  | `string` | Fetches a list of books ordered by popularity. |

#### Get item

```http
  GET /books?search=
```

| Parameter | Type     | Description                                    |
| :-------- | :------- | :--------------------------------------------- |
| `search`  | `string` | Search for books by title, author, or subject. |

```http
/books?topic=
```

| Parameter | Type     | Description                                     |
| :-------- | :------- | :---------------------------------------------- |
| `topic`   | `string` | Fetch books filtered by specific genres/topics. |

```http
/books?ids=
```

| Parameter | Type | Description                                             |
| :-------- | :--- | :------------------------------------------------------ |
| `ids`     | `id` | Retrieve specific books by their Project Gutenberg IDs. |

## Contributing

We welcome contributions to improve this project! Here’s how you can help:

- Fork the repository.

- Create a new branch:

  ```bash
   git checkout -b feature-your-feature-name
  ```

- Make your changes.
- Commit your changes:

  ```bash
   git commit -m "Add your message here
  ```

- Push to the branch:

  ```bash
   git push origin feature-your-feature-name
  ```

- Create a Pull Request.

## License

This project is licensed under the MIT License. See the [MIT](https://choosealicense.com/licenses/mit/) file for details.

## Acknowledgements

- [ Gutendex API](https://gutendex.com/)
- [Heroicons](https://heroicons.com)
