# MedDrop

MedDrop is a full-stack MERN application that enables users to donate and request unused or surplus medicines. It aims to reduce medicine wastage and make essential medications more accessible to those in need.

## Features

- **User Authentication**: Secure signup and login using JWT-based authentication.
- **Medicine Management**: Add, edit, delete, and view medicines with details like name, quantity, expiry date, and notes.
- **Location Integration**: Google Maps API integration to mark pickup locations for medicine availability.
- **Request System**: Users can request medicines from others and manage incoming and outgoing requests.
- **Role-Based Checks**: Users cannot request their own medicines, and only valid pending requests can be accepted or rejected.

## Technologies Used

### Frontend (meddrop-frontend)
- React.js
- Tailwind CSS
- React Router
- Axios
- @react-google-maps/api

### Backend (meddrop-backend)
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- dotenv for environment configuration

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB instance running locally or in the cloud
- Google Maps API key with the **Places** library enabled

### Environment Variables

Create a `.env` file in both `meddrop-backend` and `meddrop-frontend` directories.

#### Backend (`meddrop-backend/.env`)
