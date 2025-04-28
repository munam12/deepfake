# DeepFake Detection Web Application

A modern web application for detecting and understanding deepfake content built with React and Vite.

## Requirements

### Frontend Requirements
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Backend Requirements (Optional)
- Python (v3.8 or higher)
- pip (for Python package management)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/deepfake.git
cd deepfake
```

### 2. Frontend Setup
Install Node.js dependencies:
```bash
npm install
```

### 3. Backend Setup (If using the Python backend)
Create and activate a virtual environment:
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python -m venv venv
source venv/bin/activate
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the root directory if needed:
```
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Start the Frontend Development Server
```bash
npm run dev
```
The application will be available at http://localhost:5173

### Build for Production
```bash
npm run build
```

### Preview the Production Build
```bash
npm run preview
```

## Project Structure

- `/src`: React frontend source code
  - `/components`: Reusable UI components
  - `/pages`: Application pages
  - `/lib`: Utility functions and hooks
- `/public`: Static assets
- `/server`: Backend API code (if applicable)

## Features

- Interactive home page with information about deepfakes
- News section with latest updates on deepfake technology
- Deepfake detection functionality
- About and contact pages
- Modern UI with responsive design using Tailwind CSS

## Technologies Used

- React (v18)
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Swiper for carousels
- Vite for frontend tooling
- Flask for backend API (optional)

## License

[MIT](LICENSE) 