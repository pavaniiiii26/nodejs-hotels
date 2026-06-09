# 🍽️ Restaurant Management REST API

> A secure, production-style backend for managing restaurant staff and menu items.

Built with **Node.js · Express · MongoDB · JWT**

![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

---

## 📌 About

This is a fully functional REST API built for a restaurant management system. It handles two core resources — **staff (persons)** and **menu items** — with a complete authentication system, role-based permissions, and production-level security practices.

The project was built progressively, starting from a basic CRUD API and improved to follow real-world backend standards including secure password storage, rate limiting, input validation, and proper error handling.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 JWT Authentication | Tokens expire in 1 hour, verified on every protected route |
| 🔑 Password Security | bcrypt hashing with 10 salt rounds, never stored in plaintext |
| 👮 Role-Based Access | Managers, chefs, and waiters have different permissions |
| 🛡️ Security Headers | Helmet middleware applied globally |
| 🚦 Rate Limiting | Global: 100 req/15 min · Auth routes: 10 req/15 min |
| ✅ Input Validation | Mongoose schema validators on every field |
| 📄 Pagination | All list endpoints support `?page` and `?limit` |
| ⚡ Error Handling | Centralized error handler + 404 catch-all route |
| 🔒 Env Variables | All secrets in `.env`, validated on startup |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v20+ |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | jsonwebtoken (JWT) |
| Password Hashing | bcrypt |
| Security | Helmet, express-rate-limit |
| Configuration | dotenv |

---

## 📁 Project Structure

```
restaurant-api/
├── models/
│   ├── person.js         # Staff schema — name, role, salary, auth fields
│   └── menu.js           # Menu schema — name, price, taste, ingredients
├── routes/
│   ├── personRoutes.js   # Signup, login, profile CRUD
│   └── menuRoutes.js     # Menu CRUD with manager-only guard
├── db.js                 # MongoDB connection setup
├── jwt.js                # JWT middleware + token generator
├── auth.js               # Auth notes (passport removed, JWT used instead)
├── server.js             # App entry point — middleware, routes, error handler
├── .env.example          # Environment variable template
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v20+
- MongoDB running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) account

---

## 📖 API Reference

### Staff Routes — `/person`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/person/signup` | ❌ | Any | Register new staff member |
| POST | `/person/login` | ❌ | Any | Login, returns JWT token |
| GET | `/person/profile` | ✅ | Any | View your own profile |
| PUT | `/person/profile/update` | ✅ | Any | Update your own profile |
| DELETE | `/person/profile/delete` | ✅ | Any | Delete your account |
| GET | `/person/:work` | ❌ | Any | Get all staff by role |

**Valid roles for `/:work`:** `chef` · `waiter` · `manager`

---

### Menu Routes — `/menu`

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/menu` | ❌ | Any | Get all menu items |
| GET | `/menu/:taste` | ❌ | Any | Filter by taste |
| POST | `/menu` | ✅ | Manager only | Add new menu item |
| DELETE | `/menu/:id` | ✅ | Manager only | Delete a menu item |

**Valid tastes for `/:taste`:** `sweet` · `salty` · `sour`

---

### Authentication

All protected routes require this header:
```
Authorization: Bearer <your_jwt_token>
```

Get your token from `POST /person/login` or `POST /person/signup`.

---

## 👮 Role Permissions

| Action | Manager | Chef | Waiter |
|---|---|---|---|
| Add menu item | ✅ | ❌ | ❌ |
| Delete menu item | ✅ | ❌ | ❌ |
| View own profile | ✅ | ✅ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| Delete own account | ✅ | ✅ | ✅ |

---

## 🔒 Security Details

- Passwords hashed with **bcrypt** (salt rounds: 10) — never stored in plaintext
- JWT tokens signed with a secret key, expire after **1 hour**
- Auth routes rate limited to **10 requests per 15 minutes** per IP
- All routes protected by **Helmet** security headers
- Login returns the same error for wrong username or wrong password — prevents **username enumeration**
- Server **crashes on startup** if `JWT_SECRET` or `MONGODB_URI` are missing from `.env`
- Password changes on profile update are **manually re-hashed** since `findByIdAndUpdate` bypasses Mongoose hooks

---
## 🎯 Conclusion

This project gave me hands-on experience building a secure, production-style REST API from scratch. I learned how to structure a Node.js backend properly, implement JWT authentication, handle role-based access control, and apply real-world security practices like bcrypt hashing, rate limiting, and helmet headers.

Beyond just making it work, I focused on making it production-ready — proper error handling, input validation, pagination, and environment variable management. Every decision in this project was made with a real-world use case in mind.
This is the backend foundation for a fullstack restaurant management application. The React frontend and deployment are currently in progress.
