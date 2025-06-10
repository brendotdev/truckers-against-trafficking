# Truckers Against Trafficking — MERN Stack App

## Overview

**Truckers Against Trafficking** is a full-stack web application designed to empower truck drivers in the fight against human trafficking. By enabling real-time location-based incident reporting, community awareness, and educational resources, this platform gives drivers a voice and the tools to act when they witness suspicious activity.

## Inspiration

Inspired by the real-world initiative to engage truckers in anti-trafficking efforts, this project provides a digital platform for collective vigilance. It solves the problem of unreported trafficking observations by offering a secure, intuitive interface where drivers can submit and view incident data — no paperwork, no delays.

## Features

- **Live Incident Reporting**: Submit trafficking reports with location, description, and optional media.
- **Interactive Map View**: Visualize submitted reports based on geolocation.
- **Authentication**: Register and login system for added report traceability and safety.
- **Educational Resources**: Access curated content on how to recognize and respond to trafficking.
- **Upvote/Downvote System**: Surface the most relevant or urgent reports.
- **Sub-communities**: Filter reports by region, route, or trucking company (e.g., `r/I5Corridor` or `u/TruckSafeJoe`)
- **Dark Mode Toggle**: For long-distance night users.
- **Responsive Design**: Optimized for tablets, mobile devices, and in-cab browsers.

## Technologies Used

### Frontend

- [React.js](https://reactjs.org/) – Front-end framework
- [Redux](https://redux.js.org/) – Global state management
- [Redux Thunk](https://github.com/reduxjs/redux-thunk) – Middleware for handling async logic
- [React Router](https://reactrouter.com/) – Client-side navigation
- [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) – Form building and validation
- [Material-UI](https://mui.com/) – Component library with custom theming

### Backend

- [Node.js](https://nodejs.org/) – JavaScript runtime
- [Express.js](https://expressjs.com/) – API server framework
- [MongoDB](https://www.mongodb.com/) – NoSQL database
- [Mongoose](https://mongoosejs.com/) – ODM for MongoDB schema modeling
- [Cloudinary](https://cloudinary.com/) – Secure media upload handling
- [JWT](https://jwt.io/) – Secure authentication
- [Bcrypt.js](https://www.npmjs.com/package/bcryptjs) – Password hashing
- [Validator.js](https://www.npmjs.com/package/validator) – Input sanitization
- [Dotenv](https://www.npmjs.com/package/dotenv) – Environment variable management

## Installation

### Prerequisites

- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for image upload support

### Environment Variables

Create a `.env` file inside the `server/` directory with the following:

```
MONGODB_URI="your-mongo-uri"
PORT=3005
SECRET="your-jwt-secret"
CLOUDINARY_NAME="cloudinary-name"
CLOUDINARY_API_KEY="cloudinary-key"
CLOUDINARY_API_SECRET="cloudinary-secret"
UPLOAD_PRESET="optional-preset"
```

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/truckersagainsttrafficking.git
cd truckersagainsttrafficking
```

#### 2. Start the Server

```bash
cd server
npm install
npm run dev
```

#### 3. Start the Client

```bash
cd ../client
npm install
npm start
```

Navigate to `http://localhost:3000` in your browser.

## Project Structure

```
truckersagainsttrafficking/
│── client/                  # React frontend
│── server/                  # Express backend
│   ├── models/              # Mongoose schemas
│   ├── routes/              # Express API endpoints
│   ├── controllers/         # Route handlers and logic
│── .env                     # Environment variables
│── README.md                # Project documentation
```

## Usage

1. **Register or Login** to access report functionality.
2. **Submit a Report** with location, description, and optional photo.
3. **View Reports** on an interactive map or list view.
4. **Educate Yourself** using provided resources.
5. **Join the Community** and discuss regional incidents or prevention strategies.

## Roadmap

- ✅ MVP with reporting and authentication
- 🚧 Role-based permissions (e.g., moderators, admins)
- 🌎 SMS/Email alerts for high-priority reports
- 📱 Native mobile app support
- 📊 Analytics dashboard for NGOs and law enforcement

## Contributing

Want to help? PRs are welcome! Please fork the repo and follow the [contribution guidelines](CONTRIBUTING.md).

## License

MIT License. See the [LICENSE](LICENSE) file for full details.

## Contact

For questions, collaborations, or demo requests, reach out to **brendanprogrammer@gmail.com**.
