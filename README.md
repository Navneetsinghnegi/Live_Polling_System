# 🚀 Pulse Check  
### Real-Time Live Polling System for Interactive Classrooms

> A high-performance, real-time polling platform enabling educators to launch instant assessments and receive live audience feedback with zero-latency synchronization.

---

## 📌 Overview

**Pulse Check** is a scalable real-time polling system built to support interactive classrooms and live sessions.  
It enables teachers to create time-bound polls while students participate in synchronized, real-time voting sessions.

The system leverages WebSockets for instant updates and an automated analytics engine for immediate result computation — delivering a seamless live feedback experience.

---

## ✨ Core Features

### 🔄 Real-Time Synchronization
- Powered by **Socket.io**
- Bi-directional communication between teacher and student clients
- Instant poll launch & live vote updates

### ⏱️ Live Countdown Engine
- Dedicated timer management per session
- Automatic poll expiration
- Auto-transition to result view upon timeout

### 📊 Automated Analytics
- Real-time vote aggregation
- Accuracy rate calculation
- Correct answer identification
- Winner detection logic

### 🧠 Dynamic UI State Architecture
- "Waiting for Poll" state
- "Active Poll" voting state
- "Live Results" dashboard
- Conditional rendering based on session state

### 💾 Persistent Storage
- MongoDB-backed poll history
- Mongoose schema modeling
- Stored results accessible post-session

---

## 🛠️ Tech Stack

### Frontend
- React  
- TypeScript  
- Tailwind CSS  
- Lucide React Icons  
- Axios  
- Socket.io Client  

### Backend
- Node.js  
- Express  
- TypeScript  
- Socket.io  
- MongoDB  
- Mongoose  

### DevOps
- GitHub Actions (CI)  
- ESLint + TypeScript validation  

---

## 🏗️ System Architecture

```
Teacher Client ───┐
                  │
                  │  (WebSockets)
                  ▼
            Socket.io Server
                  ▲
                  │
Student Clients ──┘

REST API (Express)
     │
     ▼
MongoDB Database
```

---

## 🔄 Application Flow

### 1️⃣ Poll Creation (Teacher)
- Teacher creates poll via REST endpoint
- Backend persists poll in MongoDB
- Server emits `pollStarted` event
- All connected students receive poll instantly

### 2️⃣ Live Voting (Students)
- Students submit vote via REST endpoint
- Backend updates vote count
- Server emits `voteUpdate` event
- Live results dashboard updates in real-time

### 3️⃣ Poll Expiry
- Countdown timer reaches zero
- Backend computes:
  - Correct answer
  - Accuracy rate
  - Winning option
- Results displayed automatically

---

## 📂 Project Structure

```
pulse-check/
│
├── client/                # React Frontend
│   ├── components/
│   │   ├── CreatePoll.tsx
│   │   ├── LiveResults.tsx
│   │   └── StudentView.tsx
│   └── socket.ts
│
├── server/                # Express Backend
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   ├── Routes/
│   └── index.ts
│
└── .github/workflows/     # CI Configuration
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/pulse-check.git
cd pulse-check
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

Backend runs on:
```
http://localhost:5000
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/polls/create` | Create new poll |
| GET | `/api/polls/active` | Get active poll |
| POST | `/api/polls/submitVote` | Submit vote |
| GET | `/api/polls/results/:pollId` | Fetch poll results |

---

## 📡 Socket Events

| Event | Description |
|-------|------------|
| `pollStarted` | Emitted when new poll begins |
| `voteUpdate` | Emitted when a vote is submitted |

---

## 🎯 Engineering Highlights

- Architected real-time event-driven communication using WebSockets
- Designed modular service-controller architecture
- Implemented session-safe voting using unique student identifiers
- Built an automated analytics pipeline for accuracy computation
- Integrated CI pipeline to enforce code quality standards
- Leveraged TypeScript for strict type safety across full stack

---

## 📊 Performance Considerations

- Stateless REST endpoints for scalability
- Efficient vote aggregation logic
- Optimized UI re-renders with controlled state updates
- Dedicated countdown effect hooks to prevent memory leaks

---

## 🔮 Future Improvements

- Role-based authentication (Teacher / Student)
- Redis-based session scaling
- Poll history dashboard
- Data visualization with charts
- Deployment using Docker + Nginx
- Horizontal scaling with load balancing

---

## 📸 Screenshots (Optional)

```
assets/
 ├── teacher-view.png
 ├── student-view.png
 └── live-results.png
```

```md
## 📸 Screenshots

### Teacher Dashboard
![Teacher View](assets/teacher-view.png)

### Student Voting View
![Student View](assets/student-view.png)

### Live Results
![Live Results](assets/live-results.png)
```

---

## 👨‍💻 Author

Your Name  
Full-Stack Developer | Real-Time Systems Enthusiast  

---

## 📜 License

MIT License