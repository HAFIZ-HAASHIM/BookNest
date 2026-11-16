# BookNest – Online Bookstore Management System

> **A Complete Full-Stack Web Application built with React.js (Vite), Node.js, Express.js, and MongoDB / Mongoose.**  
> Designed specifically as a beginner-friendly, high-scoring engineering college laboratory project and viva demonstration.

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [System Architecture](#-system-architecture)
5. [Project Folder Structure](#-project-folder-structure)
6. [Prerequisites & System Requirements](#-prerequisites--system-requirements)
7. [Installation & Setup Instructions](#-installation--setup-instructions)
8. [Running the Application (Exact Commands)](#-running-the-application-exact-commands)
9. [MongoDB Configuration & Smart Fallback](#-mongodb-configuration--smart-fallback)
10. [REST API Documentation](#-rest-api-documentation)
11. [Sample Demonstration Data](#-sample-demonstration-data)
12. [Faculty Demonstration Script (Step-by-Step)](#-faculty-demonstration-script-step-by-step)
13. [20 Critical Viva Questions & Answers](#-20-critical-viva-questions--answers)

---

## 🎯 Project Overview

**BookNest** is a full-stack bookstore and inventory management web application. It enables bookstore administrators to:
- Monitor key business performance indicators (total book titles, inventory stock, total orders, total sales revenue).
- Perform complete **CRUD** (Create, Read, Update, Delete) operations on book catalog items.
- Filter books by genre and search in real-time by title or author.
- Manage warehouse inventory with real-time stock status badges (*In Stock*, *Low Stock*, *Out of Stock*).
- Process customer orders with automated server-side price calculation and automatic stock deduction.
- Prevent stock deficits with strict quantity validation.
- Review sales summaries and itemized transaction histories.

---

## ✨ Key Features

### 1. Admin Dashboard
- **Live Statistics Cards**:
  - Total Books in catalog
  - Total Available Stock
  - Total Customer Orders
  - Total Sales Revenue (calculated from orders)
- **Quick Action Buttons**: 1-click access to add books, place orders, and inspect inventory.
- **Recent Orders Table**: Instant preview of the latest 5 orders.
- **Inventory Overview**: Breakdown of out-of-stock items, low stock warnings, and category counts.

### 2. Book Management (CRUD)
- **Add Book**: Form modal to register title, author, category, price, and stock quantity.
- **View Books**: Responsive table displaying all catalog records with status badges.
- **Edit Book**: Update price, title, genre, and quantity seamlessly.
- **Delete Book**: Remove discontinued titles with browser confirmation safeguards.
- **Live Search & Filter**: Instant case-insensitive search by book title or author, plus category filtering.

### 3. Inventory Management
- Real-time stock tracking with status badges:
  - 🟢 **In Stock**: Available units (> 5).
  - 🟡 **Low Stock**: 5 or fewer units remaining.
  - 🔴 **Out of Stock**: 0 units left.
- Quick 1-click stock adjustment buttons (`-1`, `+1`, `+5`).
- Dedicated stock adjustment modal for bulk restocking.
- Status filters: *All*, *In Stock*, *Low Stock*, *Out of Stock*.

### 4. Order Management
- Interactive order modal for recording customer purchases.
- Select book from a dynamic dropdown displaying current unit price and stock.
- **Automatic Price Calculation**: Subtotal updates dynamically as quantity changes (`quantity × unitPrice`).
- **Inventory Validation**: Prevents orders exceeding available stock; blocks orders on zero-stock items.
- **Automatic Stock Deduction**: Confirmed orders instantly decrement inventory units in MongoDB.
- Comprehensive order history table with order timestamps, customer contacts, and items purchased.

### 5. Sales Summary & Financial Analytics
- Total revenue calculated dynamically from stored MongoDB order transactions.
- Average Order Value (AOV) calculation.
- Sales breakdown by individual book title (units sold, revenue, percentage of total sales).
- Visual distribution of catalog categories.

---

## 💻 Technology Stack

### Frontend
- **Framework**: React.js 18 (bootstrapped with Vite)
- **Language**: JavaScript (ES6+)
- **Styling**: Clean, custom Plain CSS (light modern theme, blue primary accent `#2563eb`, no bloated CSS libraries)
- **State Management**: Built-in React Hooks (`useState`, `useEffect`)
- **HTTP Client**: Native browser `fetch()` API with `async/await`

### Backend
- **Runtime**: Node.js (v18+ / v20+)
- **Framework**: Express.js
- **Database ODM**: Mongoose (v8+)
- **Database**: MongoDB (supports Local MongoDB, MongoDB Atlas, and automatic embedded MongoDB Memory Server)
- **Middleware**: `cors` (Cross-Origin Resource Sharing), `express.json()` (Body parser)

---

## 🏗️ System Architecture

```
+-------------------------------------------------------------+
|                      React Frontend (Vite)                  |
|             http://localhost:5173 (Port 5173)               |
|                                                             |
|   +-------------------+  +-------------------------------+  |
|   |  Sidebar / Navbar |  |  Dashboard / Books / Orders   |  |
|   +-------------------+  +-------------------------------+  |
|                     \     /                                 |
|               api.js (fetch client)                         |
+------------------------+------------------------------------+
                         | HTTP REST API (JSON)
                         v
+-------------------------------------------------------------+
|                    Express.js Backend Server                |
|             http://localhost:5000 (Port 5000)               |
|                                                             |
|   +------------------+-------------------+---------------+  |
|   | /api/books       | /api/orders       | /api/stats    |  |
|   | (BookController) | (OrderController) | (StatsCtrl)   |  |
|   +------------------+-------------------+---------------+  |
|                              |                              |
|                    Mongoose ODM Models                      |
+------------------------------+------------------------------+
                               | Native Driver / Wire Protocol
                               v
+-------------------------------------------------------------+
|                      MongoDB Database                       |
|   - Books Collection  { title, author, price, quantity... } |
|   - Orders Collection { customerName, book, totalPrice... } |
+-------------------------------------------------------------+
```

---

## 📁 Project Folder Structure

```
BookNest/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & embedded fallback logic
│   ├── controllers/
│   │   ├── bookController.js     # Book CRUD & inventory business logic
│   │   ├── orderController.js    # Order placement, price calc & stock deduction
│   │   └── statsController.js    # Dashboard & sales metrics aggregation
│   ├── models/
│   │   ├── Book.js               # Mongoose schema for Books collection
│   │   └── Order.js              # Mongoose schema for Orders collection
│   ├── routes/
│   │   ├── bookRoutes.js         # REST route endpoints for books
│   │   ├── orderRoutes.js        # REST route endpoints for orders
│   │   └── statsRoutes.js        # REST route endpoints for stats
│   ├── seed/
│   │   ├── seedData.js           # 12 realistic books & initial orders
│   │   └── seeder.js             # Standalone database population script
│   ├── .env                      # Environment variables (PORT, MONGODB_URI)
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies & npm scripts
│   └── server.js                 # Express server entry point & middlewares
│
├── frontend/
│   ├── public/                   # Static assets & favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookModal.jsx     # Modal form for Add/Edit book
│   │   │   ├── Navbar.jsx        # Top header & quick actions
│   │   │   ├── OrderModal.jsx    # Modal for customer checkout & price calc
│   │   │   ├── Sidebar.jsx       # Left navigation menu
│   │   │   ├── StatCard.jsx      # Reusable KPI metric card
│   │   │   ├── StockModal.jsx    # Modal for quick inventory adjustment
│   │   │   └── Toast.jsx         # Non-blocking feedback notification
│   │   ├── pages/
│   │   │   ├── Books.jsx         # Catalog table, search & CRUD controls
│   │   │   ├── Dashboard.jsx     # Main KPI summary & quick actions
│   │   │   ├── Inventory.jsx     # Stock alerts & level adjustments
│   │   │   ├── Orders.jsx        # Customer order transaction history
│   │   │   └── Sales.jsx         # Financial analytics & book breakdown
│   │   ├── services/
│   │   │   └── api.js            # Centralized fetch API service layer
│   │   ├── App.css               # Clean modern light theme CSS stylesheet
│   │   ├── App.jsx               # Root React component & state orchestrator
│   │   └── main.jsx              # Vite React entry point
│   ├── index.html                # HTML5 root template
│   ├── package.json              # Frontend dependencies & Vite scripts
│   └── vite.config.js            # Vite configuration & proxy rules
│
├── run-backend.bat               # 1-click Windows launcher for backend
├── run-frontend.bat              # 1-click Windows launcher for frontend
├── package.json                  # Root convenience package.json
└── README.md                     # Comprehensive project documentation & viva guide
```

---

## ⚙️ Prerequisites & System Requirements

- **Node.js**: v18.0.0 or higher (Run `node -v` to verify).
- **npm**: v9.0.0 or higher (Run `npm -v` to verify).
- **Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge.
- **MongoDB**: (Optional) Local MongoDB Server (Community Edition) or MongoDB Atlas URI. *If not installed, BookNest automatically runs using its embedded in-memory MongoDB engine.*

---

## 🚀 Installation & Setup Instructions

### Step 1: Open the Project Directory
Open your terminal (PowerShell, Command Prompt, or VS Code terminal) and navigate to the project directory:
```bash
cd "c:\Users\Student\Desktop\BookNest"
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## 🏃 Running the Application (Exact Commands)

To run both servers, open **two separate terminal windows**:

### Terminal 1: Start Backend Server
```bash
cd "c:\Users\Student\Desktop\BookNest\backend"
npm start
```
*The backend server will start on `http://localhost:5000`.*  
*If the database is empty, it will automatically populate 12 sample books and orders.*

### Terminal 2: Start Frontend Development Server
```bash
cd "c:\Users\Student\Desktop\BookNest\frontend"
npm run dev
```
*The frontend will run at `http://localhost:5173`. Open this URL in your web browser.*

> **Windows 1-Click Shortcut**: You can also simply double-click `run-backend.bat` and `run-frontend.bat` from File Explorer!

---

## 🗄️ MongoDB Configuration & Smart Fallback

The backend connects to MongoDB using Mongoose configured in `backend/config/db.js`.

### Default Configuration (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/booknest
```

### Seamless Viva Fallback:
1. When launched, BookNest attempts to connect to `MONGODB_URI`.
2. If a local MongoDB service is running, it connects immediately.
3. If local MongoDB is not installed or the Windows service is stopped (very common on college lab PCs), BookNest **automatically starts an embedded in-memory MongoDB instance**.
4. This ensures your project will **never crash** or fail to connect during evaluation.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Books API (`/api/books`)

| Method | Endpoint | Description | Request Body | Sample Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/books` | Get all books (supports `?search=`, `?category=`, `?stockStatus=`) | None | `{ success: true, count: 12, data: [...] }` |
| **GET** | `/api/books/:id` | Get single book details | None | `{ success: true, data: { ... } }` |
| **POST** | `/api/books` | Add a new book | `{ title, author, category, price, quantity }` | `{ success: true, message: "Book added...", data: { ... } }` |
| **PUT** | `/api/books/:id` | Update book details | `{ title, author, category, price, quantity }` | `{ success: true, message: "Book updated...", data: { ... } }` |
| **DELETE**| `/api/books/:id` | Delete a book | None | `{ success: true, message: "Book deleted...", data: { id } }` |
| **PATCH** | `/api/books/:id/stock` | Quick stock update | `{ quantity: 15 }` | `{ success: true, message: "Stock updated...", data: { ... } }` |

### 2. Orders API (`/api/orders`)

| Method | Endpoint | Description | Request Body | Sample Response |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/orders` | Retrieve all customer orders | None | `{ success: true, count: 2, data: [...] }` |
| **POST** | `/api/orders` | Place customer order & deduct stock | `{ customerName, customerEmail, bookId, quantity }` | `{ success: true, message: "Order placed...", data: { order, remainingStock } }` |

### 3. Analytics & Utility API

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/stats/dashboard` | Returns totalBooks, totalStock, totalOrders, totalSales, and category counts |
| **GET** | `/api/health` | Health check endpoint confirming API status |
| **POST**| `/api/seed/reset` | Resets and re-seeds database with sample demo records |

---

## 📚 Sample Demonstration Data

BookNest comes pre-loaded with diverse sample records across genres:

| Title | Author | Category | Price | Initial Stock | Demo Scenario Tested |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *The Great Gatsby* | F. Scott Fitzgerald | Literature | \$14.99 | 25 | Standard in-stock item |
| *Clean Code* | Robert C. Martin | Technology | \$38.50 | 12 | Tech category best-seller |
| *Atomic Habits* | James Clear | Self-Help | \$19.99 | 18 | High volume sales |
| *Designing Data-Intensive Apps* | Martin Kleppmann | Technology | \$45.00 | 8 | Higher price unit |
| *JavaScript: The Good Parts* | Douglas Crockford | Technology | \$29.99 | 3 | **Low Stock Alert (<= 5)** |
| *1984* | George Orwell | Fiction | \$11.95 | 2 | **Low Stock Alert (<= 5)** |
| *Algorithms Unlocked* | Thomas H. Cormen | Technology | \$32.00 | 0 | **Out of Stock (Tests rejection)** |

---

## 🎓 Faculty Demonstration Script (Step-by-Step)

When demonstrating this project to your professor or viva examiner, follow this 5-minute presentation walkthrough:

### Step 1: Introduction & Architecture (30 seconds)
> *"Good morning, Professor. Today I am demonstrating **BookNest**, an Online Bookstore Management System. The application is built using a modern full-stack architecture: React with Vite on the frontend, Node.js with Express on the backend, and MongoDB with Mongoose for data persistence. It allows an administrator to manage books, track warehouse inventory, process customer orders, and analyze sales performance."*

### Step 2: Dashboard Overview (45 seconds)
1. Open `http://localhost:5173`.
2. Point to the top 4 statistic cards:
   > *"On the dashboard, we immediately see our four core metrics: **Total Books**, **Total Stock**, **Total Orders**, and **Total Sales Revenue** ($68.48). These are computed in real time from our MongoDB database using Mongoose aggregation queries."*
3. Show the **Recent Orders** table and the **Inventory Status** panel on the right.

### Step 3: Book Management & CRUD (1 minute)
1. Click **Book Management** in the sidebar.
2. Click **+ Add New Book**:
   - Title: `Introduction to Algorithms`
   - Author: `Thomas Cormen`
   - Category: `Technology`
   - Price: `49.99`
   - Quantity: `10`
   - Click **Add Book**.
   - Show the success toast and the new book appearing at the top of the table.
3. Test **Live Search**: Type `"Clean"` in the search bar. Point out how only *Clean Code* is displayed. Clear the search.
4. Test **Category Filter**: Select `Fiction` from the dropdown. Show how the table filters instantly.
5. Click **Edit** on any book: Change its price or quantity, and save.

### Step 4: Inventory Management & Stock Alerts (45 seconds)
1. Click **Inventory** in the sidebar.
2. Highlight the three status badges:
   - 🟢 Green badge for **In Stock**
   - 🟡 Yellow badge for **Low Stock** (e.g., *JavaScript: The Good Parts*, 3 units)
   - 🔴 Red badge for **Out of Stock** (e.g., *Algorithms Unlocked*, 0 units)
3. Demonstrate quick adjustment: Click **+1** or **+5** on any book. Show how the stock updates instantly without a page refresh.

### Step 5: Order Creation & Stock Deduction (1.5 minutes)
1. Click **Customer Orders** in the sidebar.
2. Click **+ Place New Order**:
   - Customer Name: `Rahul Sen`
   - Customer Email: `rahul@gmail.com`
   - Select Book: Choose *Clean Code* (note current stock, e.g., 10 units, unit price \$38.50).
   - Enter Quantity: `2`.
   - **Point to the live calculation box**:
     > *"Notice how the total price (\$77.00) is automatically calculated in real-time on the client side as the quantity changes."*
   - Try entering Quantity: `999`.
     > *"Notice that our validation prevents the order from exceeding available stock."*
   - Change quantity back to `2` and click **Complete Order**.
3. Point out two immediate consequences:
   - The order appears in the **Customer Orders** table.
   - Switch back to **Inventory** or **Books**: *Clean Code* stock has automatically decreased from 10 to 8 units!

### Step 6: Sales Summary & Conclusion (30 seconds)
1. Click **Sales Summary** in the sidebar.
2. Show that Total Sales and Total Orders have automatically updated with the newly placed order.
3. Show the **Sales by Book Title** breakdown and progress bars.
4. Conclude:
   > *"This confirms seamless synchronization between frontend components, Express REST APIs, and MongoDB collections with full data integrity. Thank you!"*

---

## ❓ 20 Critical Viva Questions & Answers

### 1. What is the architecture of the BookNest application?
**Answer:** BookNest follows a **Three-Tier MERN Architecture**:
1. **Presentation Tier (Frontend)**: React.js (built with Vite) manages the user interface, renders views, and handles user interactions.
2. **Application Tier (Backend)**: Node.js and Express.js expose RESTful API endpoints, handle business logic, validate inputs, and process requests.
3. **Data Tier (Database)**: MongoDB stores books and orders as BSON/JSON-like documents, managed via the Mongoose ODM.

---

### 2. How does React communicate with the Express backend?
**Answer:** React communicates with Express via **asynchronous HTTP requests** using the browser's native `fetch()` API and `async/await` syntax.
- When an administrator triggers an action (such as adding a book or creating an order), the frontend sends an HTTP request (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`) with a JSON payload to endpoints like `http://localhost:5000/api/books`.
- The Express server processes the request, interacts with MongoDB, and sends back an HTTP response with a JSON payload and an HTTP status code (e.g., `200 OK`, `201 Created`, `400 Bad Request`).

---

### 3. What is CORS and why is it necessary in this project?
**Answer:** **CORS** stands for *Cross-Origin Resource Sharing*.
- By default, web browsers enforce the **Same-Origin Policy**, which restricts web pages from making AJAX requests to a different domain, protocol, or port.
- In our development setup, the React frontend runs on `http://localhost:5173` (port 5173), while the Express backend runs on `http://localhost:5000` (port 5000).
- Without the `cors()` middleware in Express, the browser would block the frontend from accessing the backend APIs.

---

### 4. What is Mongoose and why do we use it with MongoDB?
**Answer:** MongoDB is a NoSQL, schema-less document database. **Mongoose** is an **Object Data Modeling (ODM)** library for Node.js and MongoDB.
- Mongoose allows us to define rigid **Schemas** with strict data types, required fields, default values, and custom validators (e.g., ensuring `price >= 0` and `quantity >= 0`).
- It translates MongoDB documents into JavaScript objects with helper methods for querying, updating, and aggregating data.

---

### 5. Explain how the automatic stock deduction works during order placement.
**Answer:** When an order is placed:
1. The client sends a `POST` request to `/api/orders` containing the `customerName`, `bookId`, and `quantity`.
2. The `orderController.js` fetches the book from MongoDB using `Book.findById(bookId)`.
3. It performs a stock validation: `if (book.quantity < orderQty)` -> returns an HTTP `400` error with *"Insufficient stock"*.
4. If sufficient stock exists, it executes `book.quantity -= orderQty` and saves the updated book document using `await book.save()`.
5. It then records the new order in the `orders` collection using `Order.create(...)`.
6. This guarantees inventory consistency and prevents overselling.

---

### 6. What React Hooks did you use and why?
**Answer:** We used standard built-in React hooks:
- **`useState`**: To maintain local component state, such as form inputs, the list of books, modal visibility, search queries, and selected category filters.
- **`useEffect`**: To handle side effects, specifically fetching initial data from the Express backend when components mount or when dependencies (like search terms or filter selections) change.

---

### 7. What is the difference between SQL and NoSQL databases? Why choose MongoDB?
**Answer:**
- **SQL Databases** (e.g., MySQL, PostgreSQL) are relational, store data in rigid tables with rows and columns, and use foreign keys and strict schemas.
- **NoSQL Databases** (e.g., MongoDB) are document-oriented, store data in flexible, JSON-like BSON documents, and scale horizontally with ease.
- We chose MongoDB because JSON documents map naturally to JavaScript objects in Node.js and React, making development faster and eliminating complex object-relational mapping impedance.

---

### 8. What are HTTP Status Codes? Which ones did you use?
**Answer:** HTTP status codes indicate the result of an HTTP request:
- `200 OK`: Request succeeded (e.g., fetching books, updating a book).
- `201 Created`: A new resource was successfully created (e.g., adding a book, placing an order).
- `400 Bad Request`: Client sent invalid data (e.g., missing required fields, negative price, quantity exceeding stock).
- `404 Not Found`: The requested resource or route does not exist (e.g., book ID not found).
- `500 Internal Server Error`: An unexpected error occurred on the server.

---

### 9. What is the purpose of `express.json()` middleware?
**Answer:** In Express, incoming HTTP request bodies arrive as raw readable streams. The `express.json()` built-in middleware parses incoming requests with JSON payloads and attaches the parsed data as a JavaScript object to `req.body`, making it easily accessible in route handlers.

---

### 10. Why did you use Vite instead of Create React App (CRA)?
**Answer:**
- **Create React App** is deprecated and uses Webpack, which bundles the entire application before starting the dev server, resulting in slow startup times.
- **Vite** leverages native ES Modules (ESM) in modern browsers and uses esbuild (written in Go) for pre-bundling. It starts the development server almost instantly (sub-second) and provides lightning-fast Hot Module Replacement (HMR).

---

### 11. How is the total sales revenue calculated?
**Answer:** Total sales revenue is calculated in two complementary ways:
1. **Server-Side**: Using a MongoDB **Aggregation Pipeline** (`Order.aggregate([ { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } } ])`), which computes the mathematical sum across all order documents directly inside the database engine.
2. **Client-Side**: In `Sales.jsx`, using JavaScript's `reduce()` function (`orders.reduce((sum, ord) => sum + ord.totalPrice, 0)`) for immediate client-side verification and UI rendering.

---

### 12. How does the live search functionality work in the frontend?
**Answer:**
- The search input in `Books.jsx` binds to a `search` state variable via controlled component input (`value={search}`).
- An input change triggers a `useEffect` hook with a small 250ms debounce timeout to prevent spamming the backend.
- The `api.getBooks({ search })` call appends the query parameter to the URL (`/api/books?search=gatsby`).
- On the backend, `bookController.js` constructs a case-insensitive regular expression: `new RegExp(search.trim(), 'i')` and matches it against either the `title` or `author` using MongoDB's `$or` operator.

---

### 13. What is the difference between `PUT` and `PATCH` methods?
**Answer:**
- **`PUT`**: Used to replace an entire resource or update all fields of a document (e.g., updating title, author, category, price, and quantity at `/api/books/:id`).
- **`PATCH`**: Used to apply partial modifications to a resource (e.g., modifying only the `quantity` field at `/api/books/:id/stock`).

---

### 14. What are Mongoose Virtuals and did you use any?
**Answer:** Mongoose Virtuals are document properties that can be read and set, but are **not** persisted to MongoDB storage.
- In `Book.js`, we defined a virtual property:
  ```javascript
  bookSchema.virtual('inStock').get(function () {
    return this.quantity > 0;
  });
  ```
- This dynamically indicates whether a book is available without needing to store a redundant boolean field in the database.

---

### 15. What are environment variables and why use `.env`?
**Answer:** Environment variables are key-value pairs configured outside the source code to manage runtime settings across different environments (development, testing, production).
- We use the `dotenv` package to load variables from `.env`.
- It keeps sensitive or environment-specific values (like server `PORT` and `MONGODB_URI`) separate from application logic, making the code secure, portable, and configurable without code edits.

---

### 16. What prevents a user from placing an order for a negative or zero quantity?
**Answer:** We implemented **dual-layer validation**:
1. **Client-Side Validation (OrderModal.jsx)**: The HTML input has `min="1"`, and JavaScript verifies `if (isNaN(orderQty) || orderQty <= 0)` before sending the request.
2. **Server-Side Validation (orderController.js & Order.js Schema)**: The controller checks `if (orderQty <= 0)` and returns HTTP `400`. Furthermore, the Mongoose schema specifies `min: [1, 'Quantity must be at least 1']`. Dual-layer validation ensures API security even if client validation is bypassed.

---

### 17. What is the role of `package.json` and `node_modules`?
**Answer:**
- **`package.json`**: Acts as the project manifest. It records project metadata, scripts (like `npm start` and `npm run dev`), and specifies dependencies with their semantic version ranges.
- **`node_modules`**: The physical directory where npm downloads and stores the actual compiled code for all third-party libraries and their transitive dependencies.

---

### 18. How did you structure the backend to follow the MVC pattern?
**Answer:** We implemented a clean separation of concerns:
- **Model**: `models/Book.js` and `models/Order.js` define database structure and schema validations.
- **View**: The React frontend serves as the View layer.
- **Controller**: `controllers/bookController.js`, `orderController.js`, and `statsController.js` contain the business logic, database queries, and response formatting.
- **Routes**: `routes/` map incoming HTTP URL endpoints to specific controller methods.

---

### 19. What happens if a database connection error occurs?
**Answer:**
- In `backend/config/db.js`, we implemented an automated fallback mechanism:
  - The server first tries to connect to the configured local or remote MongoDB instance with a 3-second timeout.
  - If the connection fails (e.g., MongoDB service is stopped on a college lab PC), the `catch` block automatically launches an embedded **MongoDB Memory Server**.
  - This embedded server runs a temporary MongoDB instance directly in Node.js, ensuring the application stays operational for demonstrations without crashing.

---

### 20. What are some possible future enhancements for BookNest?
**Answer:**
1. **User Authentication & Authorization**: Implement JWT (JSON Web Tokens) or session-based authentication to distinguish between Customers and Store Administrators.
2. **Payment Gateway Integration**: Integrate Razorpay, Stripe, or PayPal for processing live credit card and UPI transactions.
3. **Shopping Cart**: Allow customers to select multiple books in a single session before checking out.
4. **Automated Low-Stock Email Alerts**: Send automated emails to store managers when book quantities fall below reorder thresholds.

---

## 👨‍💻 Project Evaluation Checklist for Viva

- [x] Clean, organized folder structure (`frontend/` and `backend/`).
- [x] Zero TypeScript, Redux, Next.js, or Tailwind CSS (pure JavaScript & standard React hooks).
- [x] Full CRUD operations for books functioning smoothly.
- [x] Dynamic search and category filtering verified.
- [x] Real-time stock status badges (In Stock, Low Stock, Out of Stock).
- [x] Order placement with automatic total calculation and stock deduction.
- [x] Over-order rejection (cannot order more than available stock).
- [x] Dashboard KPI cards (Total Books, Stock, Orders, Sales).
- [x] Sales analytics breakdown by book title.
- [x] Automated embedded database fallback for lab PC demonstrations.
- [x] Comprehensive documentation and viva question bank.

**Good luck with your project demonstration and viva examination!**
