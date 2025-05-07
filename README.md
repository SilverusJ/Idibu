# FNM Full Moisturized Beards

## Overview

FNM Full Moisturized Beards is an e-commerce website designed to sell natural beard care products, targeting men seeking organic grooming solutions. The platform allows users to browse products (e.g., Beard Growth Oil, Beard Wash), manage a cart, and complete payments via PayPal. It features a responsive frontend with a green, nature-inspired design and a backend for product and order management. The project is developed by a two-member team: Chikamso Ezeaku (frontend) and Hector Agwara (backend).

### Features
- **Frontend**:
  - Responsive pages: Homepage, Shop, Product Details, Cart, Checkout, About Us.
  - Product slider, search bar, testimonials, and FAQs for user engagement.
  - Cart management using localStorage with dynamic navigation count.
  - PayPal JavaScript SDK for client-side payment processing.
- **Backend**:
  - REST API for product retrieval (`/api/v1/products`) and order creation (`/api/v1/orders`).
  - MongoDB database for storing products and orders.
  - PayPal REST SDK for server-side payment processing (sandbox mode).
  - Planned admin features: secure login, CRUD operations, product image uploads, admin dashboard.

### Current Status
- **Frontend**: Fully functional with responsive design and PayPal integration, but checkout encounters “An error occurred during payment.”
- **Backend**: APIs for products and orders are operational, but PayPal integration requires debugging. Admin features are planned but not yet implemented.
- **Deployment**: Prepared for Heroku (backend) and Netlify (frontend) with GitHub repositories.

## Technologies Used

### Frontend
- **HTML**: Page structure (`index.html`, `shop.html`, `cart.html`, `checkout.html`, `about.html`).
- **CSS**: Flexbox, grid, media queries, green theme (#2e7d32, #0b3d0b, #fdf6ec).
- **JavaScript**: Cart logic, product slider, PayPal integration (`script.js`).
- **PayPal JavaScript SDK**: Client-side payments.
- **localStorage**: Temporary cart storage.
- **live-server**: Local development server.

### Backend
- **Node.js/Express**: REST API framework.
- **MongoDB/Mongoose**: Database for products and orders (`fnm_db`).
- **PayPal REST SDK**: Server-side payment processing.
- **dotenv**: Environment variables (`PORT`, `MONGODB_URI`, `PAYPAL_*`).
- **CORS**: Cross-origin support for frontend.
- **Planned**: `jsonwebtoken`, `bcryptjs` (admin authentication), `multer` (image uploads).

## Project Structure

```
fnm-backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── Product.js         # Product schema
│   │   └── Order.js           # Order schema
│   ├── controllers/
│   │   ├── productController.js  # Product API logic
│   │   └── orderController.js    # Order/PayPal logic
│   ├── routes/
│   │   ├── products.js        # Product routes
│   │   └── orders.js          # Order routes
│   └── app.js                 # Express app
├── seed.js                    # Database seeding
├── .env                       # Environment variables
├── package.json               # Dependencies
└── .gitignore                 # Ignore node_modules, .env

fnm-website/
├── admin/                     # Planned admin dashboard
├── img/                       # Product images
├── index.html                 # Homepage
├── shop.html                  # Product grid
├── cart.html                  # Cart summary
├── checkout.html              # PayPal checkout
├── about.html                 # Team bios, FAQs
├── styles.css                 # CSS styles
├── script.js                  # JavaScript logic
└── .gitignore                 # Ignore node_modules
```

## Prerequisites
- **Node.js**: LTS version (e.g., 20.x) ([nodejs.org](https://nodejs.org/)).
- **MongoDB**: Local server or MongoDB Atlas ([mongodb.com](https://www.mongodb.com/)).
- **Git**: For version control ([git-scm.com](https://git-scm.com/)).
- **live-server**: For frontend (`npm install -g live-server`).
- **PayPal Developer Account**: Sandbox credentials ([developer.paypal.com](https://developer.paypal.com/)).

## Setup Instructions

### Backend
1. **Navigate to Backend Directory**:
   ```bash
   cd fnm-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create `.env` in `fnm-backend`:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/fnm_db
     PAYPAL_CLIENT_ID=your_sandbox_client_id
     PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
     PAYPAL_MODE=sandbox
     ```
   - Replace `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` with sandbox credentials from PayPal Developer Dashboard.

4. **Start MongoDB**:
   - Local: Run `mongod` (ensure MongoDB is installed).
   - Atlas: Update `MONGODB_URI` with Atlas connection string (e.g., `mongodb+srv://fnm_admin:<password>@fnm-cluster.mongodb.net/fnm_db`).

5. **Seed Database**:
   ```bash
   node seed.js
   ```

6. **Run Backend**:
   ```bash
   npm run dev
   ```
   - Access at `http://localhost:5000`.
   - Test: `curl http://localhost:5000/api/v1/products`.

### Frontend
1. **Navigate to Frontend Directory**:
   ```bash
   cd fnm-website
   ```

2. **Install live-server** (if not global):
   ```bash
   npm install live-server
   ```

3. **Run Frontend**:
   ```bash
   npx live-server --port=8080
   ```
   - Access at `http://localhost:8080`.

### Testing
- **Frontend**:
  - Verify product grid (`shop.html`), cart updates (`cart.html`), and PayPal checkout (`checkout.html`).
  - Check browser DevTools (F12 > Console/Network) for errors.
- **Backend**:
  - Test APIs:
    ```bash
    curl http://localhost:5000/api/v1/products
    curl -X POST http://localhost:5000/api/v1/orders -H "Content-Type: application/json" -d '{"items":[{"name":"Beard Growth Oil","price":19.99,"quantity":1,"image":"./img/img/beardoil.jpeg","description":"A lightweight oil","scent":"Cedar","size":"2oz"}],"shipping":{"firstName":"John","lastName":"Doe","address":"123 Beard St","city":"Beardville","state":"MD","zip":"12345"}}'
    ```
  - Check MongoDB (`fnm_db.products`, `fnm_db.orders`) with MongoDB Compass.

## Known Issues
- **PayPal Checkout Error**: “An error occurred during payment” during checkout. Debug with backend logs in `orderController.js`.
- **.env Loading**: Hardcoded PayPal credentials in `orderController.js`. Transition to `.env` variables (see Setup).
- **Admin Features**: Not yet implemented (planned: authentication, CRUD, dashboard).

## Deployment
- **Backend (Heroku)**:
  - Create `Procfile`:
    ```
    web: node src/app.js
    ```
  - Deploy:
    ```bash
    heroku create fnm-backend
    heroku config:set MONGODB_URI=<atlas-uri> PAYPAL_CLIENT_ID=<live-id> PAYPAL_CLIENT_SECRET=<live-secret> PAYPAL_MODE=live
    git push heroku main
    ```
- **Frontend (Netlify)**:
  - Push to GitHub and connect to Netlify.
  - Update `script.js`:
    ```javascript
    const API_URL = 'https://fnm-backend.herokuapp.com/api/v1';
    ```

## Future Improvements
- **Backend**:
  - Resolve PayPal checkout error (debug logs, verify credentials).
  - Implement admin features: JWT authentication, product CRUD, image uploads (`multer`), admin dashboard.
  - Deploy with MongoDB Atlas.
- **Frontend**:
  - Add search functionality to `shop.html`.
  - Compress images and minify CSS/JS.
- **General**:
  - Add Google Analytics.
  - Support multiple payment methods.
  - Develop dynamic Blog, Terms, Privacy pages.

## Contributors
- **Chikamso Ezeaku**: Frontend development (HTML, CSS, JavaScript, PayPal SDK).
- **Hector Agwara**: Backend development (Node.js, Express, MongoDB, PayPal REST SDK).

## License
This project is licensed under the MIT License.
