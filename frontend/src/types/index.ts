export interface Sample {
  id: string;
  name: string;
  imageUrl: string;
  originalImageUrl: string;
  uploadedAt: string;
  status: 'analyzing' | 'completed' | 'failed';
  results?: AnalysisResults;
}

export interface AnalysisResults {
  detections: Record<string, number>; // Object class name -> count
  totalObjects: number;
  processingTime: number; // in milliseconds
  annotatedImageBase64: string;
  analysisTime: string; // formatted time string
}

/**
 * Response from the /predict endpoint
 * Contains the detection results and annotated image
 */
export interface PredictionResponse {
  id: string;                    // Unique identifier for this prediction
  detections: Record<string, number>;  // Map of class names to their counts
  total_objects: number;         // Total number of objects detected
  density_percentage: number;
  timing: {
    total_processing_time_ms: number;  // Time taken to process the image in milliseconds
  };
  annotated_image_base64: string;  // Base64 encoded image with detection boxes
}

/**
 * Response from the /history endpoint
 * Contains a list of all previous predictions
 */
export interface HistoryItem {
  id: string;                    // Unique identifier for this prediction
  timestamp: number;             // Unix timestamp when prediction was made
  detections: Record<string, number>;  // Map of class names to their counts
  total_objects: number;         // Total number of objects detected
  density_percentage: number;
  annotated_image_base64: string;  // Base64 encoded image with detection boxes
  input_image_base64: string;    // Base64 encoded original input image
  processingTime: number;
}

/**
 * Response from the /history/clear endpoint
 * Simple success message
 */
export interface SuccessResponse {
  message: string;  // Success message from the server
}

/**
 * Error response from any endpoint
 * Contains error message when something goes wrong
 */
export interface ErrorResponse {
  error: string;  // Error message from the server
}

export interface UploadResponse {
  success: boolean;
  sampleId?: string;
  error?: string;
}

