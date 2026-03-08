# MarketNest

MarketNest is a mini fashion marketplace built using the MERN stack.  
The platform supports two roles:

• Brand (Seller) – manages products  
• Customer (User) – browses marketplace  

This project demonstrates full-stack engineering skills including authentication, role-based authorization, REST APIs, and cloud-based image storage.

---

## Live Links

Frontend:
https://marketnest-silk.vercel.app/

Backend:
https://marketnest-backend-htxq.onrender.com/

GitHub Repository:
https://github.com/charanramagiri/marketnest/

---

## Tech Stack

Frontend
- React (Vite)
- Axios
- React Router

Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

Authentication
- JWT Access Tokens
- Refresh Tokens (httpOnly cookies)

Cloud Storage
- Cloudinary (for product images)

Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## Architecture

Client → React Frontend  
Backend → Express API Server  
Database → MongoDB Atlas  
Image Storage → Cloudinary  

Flow:

User → React → Express API → MongoDB  
Images → Cloudinary

---

## Authentication Flow

1. User signs up or logs in
2. Password is hashed using bcrypt
3. Server generates:
   - Access Token (short-lived)
   - Refresh Token (stored in httpOnly cookie)
4. Access token is used for protected API requests
5. Refresh token generates new access tokens when expired

---

## User Roles

### Brand (Seller)

- Access dashboard
- Create products
- Upload product images
- Edit own products
- Soft delete products
- View dashboard summary

### Customer

- Browse marketplace
- Search products
- Filter by category
- View product details
- Use server-side pagination

---

## Folder Structure

### Backend


backend/
src/
config/
controllers/
middleware/
models/
routes/
utils/


### Frontend


frontend/
src/
api/
pages/
components/


---

## Security Decisions

- Password hashing with bcrypt
- JWT authentication
- Refresh tokens stored in httpOnly cookies
- Role-based access control
- Protected API routes
- Ownership validation for product updates

---

## Features Implemented

Authentication
- Signup
- Login
- Logout
- JWT tokens
- Refresh tokens

Brand Features
- Product creation
- Product editing
- Soft delete products
- Brand dashboard

Customer Features
- Marketplace browsing
- Search products
- Filter by category
- Pagination
- Product details page

Image Handling
- Multiple product images upload
- Cloudinary integration

---

## Running Locally

Clone repository

git clone https://github.com/charanramagiri/marketnest.git


Backend setup

cd backend  
npm install  
npm run dev  


Frontend setup


cd frontend
npm install
npm run dev


---

## Environment Variables

Backend requires:


MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=


---

## AI Tools Used

AI tools such as ChatGPT were used for:

- architectural guidance
- debugging backend logic
- improving code structure

All final implementation decisions and testing were performed manually.

---

## Author

Charan Ramagiri
B.Tech Computer Science