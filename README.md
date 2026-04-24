# WedIndia: Cultural Experience Platform 🇮🇳

WedIndia is a production-ready, full-stack MERN application that connects foreign tourists with authentic Indian wedding experiences. The platform empowers Indian families to host tourists at their weddings, fostering cultural exchange and creating unforgettable memories.

![WedIndia Preview](https://images.unsplash.com/photo-1583939000240-690a1e05d0bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)

## 🚀 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS v4, React Router, Lucide React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose (with `mongodb-memory-server` for zero-setup local dev)
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Real-Time Communication:** Socket.io
- **Localization:** react-i18next (English & Hindi)

## ✨ Core Features

1. **Role-Based Access Control (RBAC):**
   - **Tourists:** Browse weddings, book experiences, use AI recommendations, and chat with hosts.
   - **Hosts:** Create and manage wedding listings, track guest bookings, and communicate with guests.
2. **Zero-Friction Local Setup:** Automatic in-memory MongoDB initialization with pre-seeded dummy data.
3. **Real-Time Chat:** Live messaging between hosts and guests using WebSockets (`socket.io`).
4. **AI Cultural Matchmaker:** Interactive dashboard widget simulating AI-driven personalized wedding recommendations.
5. **Interactive Mapping:** Google Maps iframe integration to easily locate wedding venues.
6. **Multi-Language Support:** Instant UI translation between English and Hindi.
7. **Mock Payment Gateway:** Simulated payment processing flow.

---

## 🏗 Architecture & Folder Structure

```text
📁 Foriegner App
├── 📁 backend                 # Express REST API
│   ├── 📁 config              # Database connection logic
│   ├── 📁 controllers         # Business logic (auth, weddings, bookings, reviews)
│   ├── 📁 middleware          # JWT protection and Role-based authorization
│   ├── 📁 models              # Mongoose DB Schemas
│   ├── 📁 routes              # API routing endpoints
│   ├── server.js              # Entry point & Socket.io configuration
│   └── seedData.js            # Database seeder (auto-runs on localhost)
└── 📁 frontend                # React + Vite Client
    ├── 📁 src
    │   ├── 📁 components      # Reusable UI components (Navbar, ChatBox, Modals)
    │   ├── 📁 context         # React Context API (Auth state)
    │   ├── 📁 pages           # Top-level views (Home, Dashboard, WeddingDetails)
    │   ├── i18n.js            # Localization configuration
    │   ├── App.jsx            # React Router setup
    │   └── main.jsx           # React DOM render
    ├── tailwind.config.js     # Tailwind design system
    └── vite.config.js         # Vite build configuration
```

---

## 🛠 Installation & Setup

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- *(Optional)* MongoDB URI if you wish to use a persistent database instead of the default in-memory database.

### 2. Backend Setup
Navigate to the `backend` directory, install dependencies, and configure your environment:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5000
# Leave as localhost to trigger the automatic zero-setup in-memory MongoDB
MONGO_URI=mongodb://localhost:27017/indian_weddings
JWT_SECRET=supersecret_jwt_key_for_dev_change_in_prod
```

Start the backend development server:
```bash
npm run dev
```
*Note: Upon starting with a localhost URI, the backend will automatically download a MongoDB binary, start an in-memory database, and seed it with dummy users and weddings!*

### 3. Frontend Setup
Navigate to the `frontend` directory:

```bash
cd frontend
npm install
npm run dev
```
The React frontend will be available at `http://localhost:5173`.

---

## 📖 API Documentation

The backend exposes a RESTful API. Below are the core endpoints:

### Authentication (`/api/auth`)
- `POST /register` - Register a new User or Host.
- `POST /login` - Authenticate user and return a JWT.
- `GET /profile` - Retrieve current user profile (Protected).

### Weddings (`/api/weddings`)
- `GET /` - Fetch all active wedding listings.
- `GET /myweddings` - Fetch listings created by the logged-in Host (Protected/Host).
- `GET /:id` - Fetch details of a specific wedding.
- `POST /` - Create a new wedding listing (Protected/Host).

### Bookings (`/api/bookings`)
- `POST /` - Book a wedding (Protected/Tourist).
- `GET /mybookings` - Fetch bookings made by the Tourist (Protected/Tourist).
- `GET /hostbookings` - Fetch bookings received by the Host (Protected/Host).
- `PUT /:id/pay` - Process mock payment for a booking (Protected).

### Reviews (`/api/reviews`)
- `GET /:weddingId` - Get all reviews for a specific wedding.
- `POST /` - Create a new review (Protected/Tourist).

---

## 💡 Advanced Configurations

### Changing Database to Production
To use a persistent MongoDB Atlas cluster, simply update your `backend/.env` file:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/indian_weddings
```
*When connected to Atlas, the automatic in-memory DB and auto-seeding will be safely disabled.*

### Adding More Languages
To add additional languages, edit `frontend/src/i18n.js` and add the translation dictionary to the `resources` object. Then, add the language code to the dropdown in `frontend/src/components/Navbar.jsx`.
