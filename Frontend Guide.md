# **🎨 Frontend \- FixIt Civic Platform**

## **Tech Stack Recommendation**

* **Framework:** React (Vite) \- *Fast setup.*  
* **Styling:** Tailwind CSS \- *Rapid UI development.*  
* **Maps:** Leaflet (via react-leaflet) \- *Free, easy to use, no API key required for basic tiles.*  
* **HTTP:** Axios \- *For API requests.*

## **🚀 Quick Start**

\# 1\. Initialize Project  
npm create vite@latest frontend \-- \--template react  
cd frontend  
npm install

\# 2\. Install Dependencies  
npm install axios react-router-dom react-leaflet leaflet lucide-react

\# 3\. Setup Tailwind (if not selected in init)  
npx tailwindcss init \-p

\# 4\. Run Dev Server  
npm run dev

## **🛠️ Development Checklist & Steps**

### **Phase 1: Foundation & Setup**

* \[ \] **Router Setup:** Create App.jsx with routes:  
  * / (Landing/Login)  
  * /report (Citizen: Report Flow)  
  * /map (Citizen: View/Upvote)  
  * /dashboard (Government: Internal View)  
* \[ \] **Global State/Context:** Create a simple AuthContext to mock a logged-in user (Citizen vs. Gov Official).  
* \[ \] **Map Setup:** Initialize a basic \<MapContainer\> component using Leaflet. Ensure it renders tiles.

### **Phase 2: Citizen App (The Reporter)**

*Focus: Mobile Responsiveness*

* \[ \] **Component: LocationPicker**  
  * Use navigator.geolocation.getCurrentPosition to get Lat/Long.  
  * Show a map pin that the user can drag to fine-tune location.  
* \[ \] **Component: PhotoUpload**  
  * Create a file input: \<input type="file" accept="image/\*" capture="environment" /\>.  
  * *Hackathon Tip:* Store the image as a Base64 string for MVP (easier) or upload to Cloudinary if time permits.  
* \[ \] **Component: ReportForm**  
  * Dropdown for **Category** (Water, Roads, Power).  
  * Sub-dropdown for **Type** (Leak, Outage, Pothole).  
  * "Submit" button triggers POST /api/reports.  
* \[ \] **Component: NearbyReports (The Deduplication Logic)**  
  * Before submitting, query GET /api/reports?lat=...\&lng=....  
  * Display nearby pins. If user clicks one, show "Upvote" instead of "Submit New".

### **Phase 3: Government Dashboard (The Control Center)**

*Focus: Desktop Data Visualization*

* \[ \] **Component: HeatmapLayer**  
  * Fetch all reports.  
  * Render red circles for high priorityScore and green for low.  
* \[ \] **Component: PriorityTable**  
  * A table listing reports.  
  * **Crucial:** Sort by priorityScore (descending) by default.  
  * Add filters: "Show Escalated Only", "Show Water Dept Only".  
* \[ \] **Component: StatusUpdater**  
  * A dropdown inside the table row to change status: Open \-\> Scheduled \-\> Resolved.  
  * On Resolved, prompt for a "Resolution Note" or "After Photo".

### **Phase 4: Polish (The Demo Winners)**

* \[ \] **"Resolved" Visuals:** When a ticket is green/fixed, show a confetti animation or a "Success" badge.  
* \[ \] **Escalation Alert:** Add a red banner at the top of the Dashboard: *"⚠️ 3 Tickets have escalated to Gov Oversight\!"*

## **🔑 Environment Variables (.env)**

VITE\_API\_URL=http://localhost:5000/api  
