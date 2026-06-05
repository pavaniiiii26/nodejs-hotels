# 🏨 nodejs-hotels

A RESTful Hotel Management API built with Node.js, Express & MongoDB.

---

## 📖 About

This project is a RESTful API for hotel management built with Node.js, Express 5, and MongoDB (Mongoose). It demonstrates backend development fundamentals including route handling, database modelling, and server configuration using modern ES module syntax.

---

## 🚀 Tech Stack

| Technology  | Version   | Purpose                  |
|-------------|-----------|--------------------------|
| Node.js     | v18+      | Runtime environment      |
| Express     | ^5.2.1    | Web framework & routing  |
| Mongoose    | ^9.6.3    | MongoDB ODM              |
| body-parser | ^2.2.2    | Request body parsing     |
| nodemon     | ^3.1.14   | Development auto-reload  |
| lodash      | ^4.18.1   | Utility functions        |

---

## 📁 Project Structure
nodejs-hotels/
├── models/         # Mongoose data models
├── routes/         # Express route handlers
├── db.js           # MongoDB connection setup
├── server.js       # App entry point
└── package.json

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local instance or MongoDB Atlas)

### Installation

```bash
git clone https://github.com/pavaniiiii26/nodejs-hotels.git
cd nodejs-hotels
npm install
```


### Running the App

```bash
# Start the server
npm start

# Development mode (with auto-reload)
npx nodemon server.js or node server.js
```

The server will start at `http://localhost:3000`

---

## 📡 API Endpoints

| Method | Endpoint     | Description        |
|--------|--------------|--------------------|
| GET    | /hotels      | Get all hotels     |
| GET    | /hotels/:id  | Get a hotel by ID  |
| POST   | /hotels      | Add a new hotel    |
| PUT    | /hotels/:id  | Update a hotel     |
| DELETE | /hotels/:id  | Delete a hotel     |


---

## 📄 License

ISC
