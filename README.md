# BacteriaVision

A modern web platform for automated analysis of bacteria in Palm Oil Mill Effluent (POME) using deep learning and scientific visualization.

---

## 🚀 Features
- **AI-Powered Detection:** Analyze SEM images for bacterial families using YOLO.
- **Interactive Results:** Annotated images, class distribution charts, and detailed stats.
- **Analysis History:** Review, compare, and revisit past analyses.
- **Professional UI:** Clean, responsive React + Tailwind interface.

## 🛠 Tech Stack
- **Backend:** Python, Flask, YOLO, OpenCV, NumPy
- **Frontend:** React, TypeScript, Tailwind CSS, Shadcn UI, Recharts

## ⚡ Quickstart

### Backend
```bash
# (If not already created)
conda create -n FYP python=3.8
conda activate FYP

# Install dependencies
conda install flask numpy opencv
pip install ultralytics

# Place your YOLO model file (e.g., 260501.pt) in backend/model/
# NOTE: Change the model file name in app.py as appropriate for your use case.

# Start the backend server
cd backend
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🖼 Usage
1. **Upload** a SEM image of POME.
2. **Analyze**: The AI model detects and classifies bacteria.
3. **Review**: See annotated results, class stats, and processing time.
4. **History**: Browse and compare previous analyses.

## 📁 Project Structure
```
effluent-eye-microbe-vision/
├── backend/
│   ├── app.py              # Flask backend
│   └── model/
│       └── 260501.pt       # (Place your YOLO model here; change name as needed)
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── assets/         # Images/assets
│   │   └── ...
│   ├── public/
│   ├── package.json        # Node dependencies
│   └── ...
└── README.md               # Documentation
```

## 📡 API Endpoints
- `POST /predict` – Analyze an image
- `GET /history` – List previous analyses
- `GET /history/<id>` – Get details for a specific analysis

## 🤝 Contributing
- Fork & branch from `main`
- Follow code style and add comments
- Submit a Pull Request with a clear description

## 📄 License
MIT License – see [LICENSE](LICENSE)

## 💬 Support
- Open an issue on GitHub for help or bug reports 