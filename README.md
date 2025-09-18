# 🎒 Campus Lost & Found System

A full-stack web application designed to solve the real problem of lost-and-found items on campus.  
Built with **React.js, Firebase, and MongoDB**, this system provides students and staff with a reliable, real-time platform to report, search, and recover lost items efficiently.  

🔗 **Live Demo:** [itmlostandfound.web.app](https://itmlostandfound.web.app/)  
📂 **GitHub Repo:** [itmlost-found](https://github.com/vijayKota2776/itmlost-found)

---

## 🚀 Features

- 🔐 **User Authentication** – Secure login with university email (Firebase Auth).  
- 📝 **Lost & Found Reports** – Submit lost/found items with details and photos.  
- ⚡ **Real-Time Updates** – Instant notifications & live data sync via Firestore.  
- 🔍 **Smart Search & Filters** – Search by keywords, location, or categories.  
- 🤝 **Automated Matching** – Cloud Functions suggest possible matches for lost/found items.  
- 📊 **Analytics Dashboard** – Visual reports from survey data (e.g., common items lost).  
- 💬 **Feedback System** – Collects user input for improvements.  
- 📱 **Responsive UI** – Mobile-friendly with modern design and animations.

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js (Hooks, Context API)  
- Tailwind CSS (animations, responsive design)  

**Backend & Database:**  
- Firebase (Authentication, Firestore, Hosting, Cloud Functions)  
- MongoDB Atlas (NoSQL schema for lost/found items, users, feedback)  

**Deployment:**  
- Firebase Hosting (production-ready)  

---

## 📂 Project Structure
CampusLostFound/<br>
├── src/<br>
│   ├── components/        # React components (HomePage, ReportForm, Dashboard)<br>
│   ├── styles/            # CSS (Glassmorphism, responsive, animations)<br>
│   ├── firebase/          # Firebase config & integration<br>
│   └── utils/             # Helper functions<br>
├── public/                # Static assets<br>
└── feedback/              # User feedback system<br>
---

## 🧑‍💻 How to Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/vijayKota2776/itmlost-found.git
   cd itmlost-found
2.	Install dependencies:
    ```bash
    npm install
3.	Configure Firebase:
	•	Create a Firebase project.
	•	Enable Authentication and Firestore.
	•	Copy your Firebase config into src/firebase/config.js.
4.	Run the app:
     ```bash
      npm start
📊 Survey Insights (50+ students)
	•	📱 Most lost items: Phones (35%), Keys/ID Cards (25%), Books (15%)
	•	⚡ Recovery rate (manual system): ~40%
	•	📸 Top requested features: Photo upload (85%), real-time notifications (78%), location-based search (70%)
	•	✅ 90% students said they would use a digital lost & found app

⸻

🌟 Future Improvements
	•	🤖 AI-based photo & text matching for faster recovery
	•	📲 Mobile app (React Native)
	•	🔗 QR-code-based claim verification
	•	🏫 Multi-campus support with sharding

⸻

👨‍👩‍👦 Team
	•	Fayaz Shaikh – Survey Design & Analysis
	•	Naman Sethi – CRUD Operations & API Routes
	•	Rayan Rawat – MongoDB Schema & Queries
	•	Vijay Kota – Testing & Bug Fixes

