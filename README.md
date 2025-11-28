# ANYMORE

A full-stack application built with Next.js (frontend) and NestJS (backend) featuring authentication, role management, validation, and full TypeScript support.

![Project Screenshot](https://files.catbox.moe/tmcubk.png)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 18.x)
- PostgreSQL (>= 14.x)
- npm

---

## 📦 Installation & Setup

### Frontend Setup

The frontend is built with Next.js, a React framework for production.

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm i`

3. Create a `.env` file in the `frontend` directory with the following variables: `BASE_URL=http://localhost:4000` , `NEXT_PUBLIC_BASE_URL=http://localhost:4000`

4. Run the development server: `npm run dev`

The frontend will be available at `http://localhost:3000`

### Backend Setup

The backend is built with NestJS, a progressive Node.js framework ``  express framework so anytime this can be convert to raw express with a click`

1. Navigate to the backend directory: `cd backend`

2. Install dependencies: `npm i`

3. Create a `.env` file in the `backend` directory with the following variables:
   ``
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=admin
   DB_DATABASE=my_new_database_name
   ACCESS_TOKEN=fafwafaf

``

4. Start the development server: `npm run start:dev`

The backend API will be available at `http://localhost:4000`

The backend API will be available at `http://localhost:4000`

---

## 📚 API Documentation

Full API documentation is available via **Swagger UI**.

**Access the documentation at:** `http://localhost:4000/api`

### Default Admin Credentials

For testing and initial setup, use these default admin credentials:

- **Email:** `admin@gmail.com`
- **Password:** `admin123`

> ⚠️ **Important:** Change these credentials in production!

---

## ✨ Features

This application includes the following features:

- ✅ **Authentication System** - Secure JWT-based authentication
- ✅ **Role Management** - Multi-role user access control (Admin, User, etc.)
- ✅ **Validation & Transformation** - Request validation using class-validator and class-transformer
- ✅ **Full TypeScript Support** - End-to-end type safety across frontend and backend
- ✅ **PostgreSQL Database** - Robust relational database with TypeORM
- ✅ **API Documentation** - Auto-generated Swagger documentation
- ✅ **RESTful API** - Clean and scalable API architecture

---

## 🗄️ Database Setup

Make sure PostgreSQL is installed and running on your system.

1. Create the database: `CREATE DATABASE my_new_database_name;`
