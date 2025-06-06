from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import numpy as np
import cv2
import uuid
import base64
import time
import os
from collections import deque

app = Flask(__name__)
CORS(app)

# Configuration
MAX_HISTORY_ITEMS = 20  # Limit history size to prevent memory issues
PROJECT_DIR = r'C:\FYP\FYP2_work\runs'

# Load model
model = YOLO(r"C:\Users\sxlau\Downloads\260501.pt")

# In-memory storage for history (cleared when server restarts)
prediction_history = deque(maxlen=MAX_HISTORY_ITEMS)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        start_time = time.time()

        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Read image as numpy array
        img_bytes = file.read()
        img_np = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), cv2.IMREAD_COLOR)
        if img_np is None:
            return jsonify({"error": "Invalid image"}), 400

        # Generate unique run directory
        uid = uuid.uuid4().hex[:8]
        run_name = f'prediction_{uid}'

        # Run YOLO prediction
        results = model(
            img_np,
            show_boxes=False,
            save=True,
            save_txt=True,
            project=PROJECT_DIR,
            name=run_name,
            exist_ok=True
        )

        # Locate saved image
        saved_img_path = os.path.join(PROJECT_DIR, run_name, 'image0.jpg')
        if not os.path.exists(saved_img_path):
            return jsonify({"error": "Annotated image not found"}), 500

        # Convert result image to base64
        with open(saved_img_path, "rb") as f:
            img_base64 = base64.b64encode(f.read()).decode('utf-8')

        # Get detections
        detections = {}
        names = model.names
        for cls, count in zip(*np.unique(results[0].boxes.cls.cpu().numpy(), return_counts=True)):
            detections[names[int(cls)]] = int(count)

        # Create history item
        history_item = {
            "id": uid,
            "timestamp": time.time(),
            "detections": detections,
            "total_objects": len(results[0].boxes),
            "annotated_image_base64": img_base64
        }

        # Add to history
        prediction_history.append(history_item)

        return jsonify({
            "id": uid,
            "detections": detections,
            "total_objects": len(results[0].boxes),
            "timing": {
                "total_processing_time_ms": round((time.time() - start_time) * 1000, 2)
            },
            "annotated_image_base64": img_base64
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    # Return all history items sorted by most recent first
    history = sorted(prediction_history, key=lambda x: x['timestamp'], reverse=True)
    return jsonify(history)

@app.route('/history/<history_id>', methods=['GET'])
def get_history_item(history_id):
    # Find a specific history item by ID
    for item in prediction_history:
        if item['id'] == history_id:
            return jsonify(item)
    return jsonify({"error": "History item not found"}), 404

@app.route('/history/clear', methods=['POST'])
def clear_history():
    # Clear the history
    prediction_history.clear()
    return jsonify({"message": "History cleared"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)