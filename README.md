🌟 ProbMap
===========

ProbMap is a React-based web application that allows users to 📸 upload photos and 🌍 tag locations using either their current location or by selecting on a map. This repository contains multiple React setups in separate folders for different features.

✨ Features
-----------

- 📸 Photo Upload: Users can upload images from their device.
- 🌍 Location Tagging:
  - 📍 Use current GPS location.
  - 🗺 Select location manually on an interactive map.
- 🗂 Multiple React Apps: Each app is organized in its own folder for modular development.
- 📱 Fully responsive and mobile-friendly design.

📁 Folder Structure
-------------------

my-multi-react-repo/
- project1/       (React app for basic photo upload)
- project2/       (React app with map-based location tagging)
- project3/       (Experimental features or future modules)
- README.md

💻 Installation
----------------

1. Clone the repository:

   git clone https://github.com/yourusername/ProbMap.git
   cd ProbMap

2. Navigate to a project folder:

   cd project1

3. Install dependencies:

   npm install

4. Start the development server:

   npm start

> Repeat steps 2–4 for project2 or project3.

🛠 Technologies Used
-------------------

- ⚛ React 18
- 🗺 Leaflet / react-leaflet (for map functionality)
- 🖌 MDB React UI Kit / MUI (for UI components)
- 💻 JavaScript / TypeScript
- 🌐 HTML & CSS

🚀 Usage
--------

1. Upload a photo using the file input.
2. Choose either:
   - 📍 Use Current Location → fetches browser geolocation.
   - 🗺 Select on Map → opens an interactive map to pick a location.
3. The selected location coordinates are displayed next to the uploaded photo.

⚠ Notes
--------

- Ensure your browser has location permissions enabled.
- React apps are independent, so each project may have its own dependencies and setup.

