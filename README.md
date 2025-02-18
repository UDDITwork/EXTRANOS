# 🚀 Mission Tracker Web App
https://youtu.be/dYU_G8NMo_I
## https://www.youtube.com/shorts/sHjJ04RMTfs?feature=share =To view how email updates are working.

## 📌 Project Overview
The **Mission Tracker Web App** is a goal-setting and tracking application where users can:
- Define **Missions** (Projects).
- Add multiple **Targets** (Tasks) inside each Mission.
- Delete Targets **before** saving the Mission.
- Once a Mission is saved, users can **mark Targets as Done** to track progress.
- Receive **email reminders every 2 hours** with progress updates.
- Manage multiple Missions simultaneously.

---

## 🛠 Tech Stack
### **Frontend:**
- React.js (Vite for fast development)
- Tailwind CSS (for styling)
- Framer Motion (for animations)

### **Backend:**
- Node.js (Express.js for API handling)
- PostgreSQL (Database via Prisma ORM)
- Nodemailer (for email notifications)
- Cron Jobs (to automate email reminders)

---

## 📂 Project Structure
```
mission-tracker/
│── client/                  # Frontend (React.js)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Mission.jsx  # Mission component
│   │   │   ├── Target.jsx   # Target component
│   │   │   ├── Progress.jsx # Progress tracking
│   │   │   ├── Dashboard.jsx # Dashboard UI
│   ├── package.json         # Frontend dependencies
│── server/                  # Backend (Node.js + Express)
│   ├── server.js            # Main server logic
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   ├── .env                 # Environment variables
│   ├── package.json         # Backend dependencies
│── README.md                # Project documentation
```

---

## 🔧 Setup Instructions

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/mission-tracker.git
cd mission-tracker
```

### **2️⃣ Database Setup (PostgreSQL)**
1. Open CMD and login to PostgreSQL:
   ```sh
   psql -U postgres
   ```
2. Create Database:
   ```sql
   CREATE DATABASE mission_tracker;
   ```
3. Connect to the Database:
   ```sh
   \c mission_tracker
   ```
4. Create Tables:
   ```sql
   CREATE TABLE Missions (
       id SERIAL PRIMARY KEY,
       title TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT NOW()
   );
   
   CREATE TABLE Targets (
       id SERIAL PRIMARY KEY,
       mission_id INT REFERENCES Missions(id) ON DELETE CASCADE,
       title TEXT NOT NULL,
       is_completed BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### **3️⃣ Backend Setup**
```sh
cd server
npm install
npx prisma migrate dev --name init
node server.js
```

### **4️⃣ Frontend Setup**
```sh
cd ../client
npm install
npm run dev
```

---

## 🔥 API Endpoints

| Method  | Endpoint | Description |
|---------|---------|-------------|
| `POST`  | `/missions` | Create a new Mission |
| `GET`   | `/missions` | Get all Missions |
| `DELETE`| `/missions/:id` | Delete a Mission |
| `POST`  | `/missions/:id/targets` | Add a Target to a Mission |
| `PUT`   | `/targets/:id/done` | Mark a Target as Done |

---

## 📊 How It Works
1. **User creates a new Mission** → Enters a title.
2. **Adds Targets dynamically** → Using "Add Target" button.
3. **Before saving, Targets can be deleted**.
4. **Once saved, Targets cannot be deleted** → "Done" button appears instead.
5. **Progress is updated dynamically** when the user marks Targets as "Done".
6. **Email reminders are sent every 2 hours** with progress updates.

---

## 📧 Email Reminder Format
```
Hello Mr. Uddit,
EXTRANOS this side, I have a message for you;
MISSION: [Mission Title]
Progress Update: [Completed Tasks] / [Total Tasks]
You have achieved [Progress %] of your mission, KEEP GOING.
```

---

## 💡 Future Enhancements
✅ User Authentication (JWT)
✅ Dark Mode Theme
✅ Drag & Drop Task Reordering
✅ Mobile-Friendly UI

---

## 🤝 Contributing
Feel free to fork this repo and submit pull requests!

---

## 📝 License
MIT License. Free to use and modify.

🚀 **Happy Coding!**

