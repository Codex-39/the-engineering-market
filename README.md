# The Engineering Market

A student-focused marketplace platform where engineering students can buy and sell used books, drafter tools, calculators, electronics, lab equipment, project components, hostel essentials, and other academic items.

## Live Demo

**Frontend:** https://the-engineering-market.vercel.app

**Backend:** https://the-engineering-market.onrender.com

---

## Features

### User Authentication

* Secure user registration and login
* JWT-based authentication
* Protected routes
* Persistent login sessions

### Marketplace

* Create listings with item details
* Upload multiple item images
* View all available listings
* Detailed product pages
* Mark items as sold
* Edit and delete listings

### Smart Filtering

* Filter by category
* Filter by state
* Filter by city
* College-based marketplace experience
* Search listings easily

### Real-Time Communication

* User-to-user chat system
* Direct messaging between buyers and sellers
* Notification system for new messages

### Responsive Design

* Mobile-friendly UI
* Tablet support
* Desktop optimized layout

---

## Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Tailwind CSS
* Context API

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* bcryptjs

### Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

## Project Structure

```bash
The-Engineering-Market/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <your-github-repository-url>
cd The-Engineering-Market
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start Backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Future Enhancements

* Real-time notifications using Socket.io
* College verification system
* Wishlist functionality
* Item reporting system
* Payment gateway integration
* Rating and review system
* AI-powered item recommendations

---

## Use Case

Engineering students often have textbooks, calculators, drafter tools, lab equipment, and project components that become unused after a semester. The Engineering Market provides a dedicated platform where students can sell these items to other students at affordable prices.

---

## Author

**Ahamed Raza**

Built as a Full Stack MERN Project using React, Node.js, Express, and MongoDB.
