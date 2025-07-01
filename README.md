# BacteriaVision

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/sxlau02/BacteriaVision)

A modern web platform for automated analysis of bacteria in Palm Oil Mill Effluent (POME) using deep learning and scientific visualization.

## 🚀 Features

- **AI-Powered Detection:** Analyze SEM images for bacterial families using YOLO
- **Interactive Results:** Annotated images, class distribution charts, and detailed stats
- **Density Analysis:** Calculate and display estimated bacterial density percentage in images
- **Analysis History:** Review, compare, and revisit past analyses
- **Professional UI:** Clean, responsive React + Tailwind interface
- **Real-time Processing:** Fast and efficient image analysis
- **Data Export:** Export analysis results and statistics

## 🛠 Tech Stack

### Backend
- Python 3.8+
- Flask 3.0.2
- YOLO (Ultralytics) 11L-seg.pt
- OpenCV 4.9.0
- NumPy 1.26.4
- Gunicorn 21.2.0

### Frontend
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.1.3
- Tailwind CSS 3.4.1
- Shadcn UI Components
- React Query
- Recharts

## ⚡ Quickstart

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- Git

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/sxlau02/BacteriaVision
cd BacteriaVision

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install -r requirements.txt

# Create .env file
echo "PROJECT_DIR=./runs" > .env
echo "MODEL_PATH=./model/best.pt" >> .env

# Place your YOLO model file (260501.pt) in backend/model/

# Start the backend server
python app.py
```

### Frontend Setup
```bash
# In a new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🖼 Usage

1. **Upload Image**
   - Click the upload button or drag and drop a SEM image
   - Supported formats: JPG, PNG, TIFF

2. **Analysis**
   - The AI model automatically processes the image
   - View real-time progress and processing time
   - Get estimated bacterial density percentage

3. **Results**
   - View annotated image with detected bacteria
   - Check class distribution and statistics
   - See estimated density percentage
   - Export results if needed

4. **History**
   - Access previous analyses
   - Compare results including density measurements
   - Download past reports

## 📁 Project Structure
```
BacteriaVision/
├── backend/
│   ├── app.py              # Flask backend
│   ├── requirements.txt    # Python dependencies
│   └── model/
│       └── best.pt      # YOLO model file
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── assets/       # Static assets
│   ├── public/
│   └── package.json      # Node dependencies
└── README.md
```

## 📡 API Endpoints

### Analysis
- `POST /predict` - Analyze an image
  - Request: Form data with image file
  - Response: Detection results, annotated image, and estimated density percentage

### History
- `GET /history` - List all analyses
- `GET /history/<id>` - Get specific analysis
- `POST /history/clear` - Clear history

## 🔧 Development

### Backend Development
```bash
# Run with debug mode
python app.py

# Run with gunicorn (production)
gunicorn app:app --bind 0.0.0.0:5000
```

### Frontend Development
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

- Open an issue on GitHub for bug reports or feature requests
- Contact the maintainers for additional support

## 🙏 Acknowledgments

- YOLO team for the object detection model
- Shadcn UI for the beautiful components
- All contributors and users of the project 