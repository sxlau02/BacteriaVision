import { toast } from "sonner";
import { PredictionResponse, HistoryItem, ErrorResponse, SuccessResponse } from "@/types";

/**
 * Configuration for the ModelService
 * @property backendUrl - The URL where the Flask backend is running
 */
export interface ModelConfig {
  backendUrl: string;
}

/**
 * ModelService - A simple bridge to the Flask backend API
 * 
 * This service provides methods that directly map to the backend API endpoints:
 * - /predict - Analyze an image and get detection results
 * - /history - Get all previous predictions
 * - /history/{id} - Get a specific prediction
 * - /history/clear - Clear all predictions
 * 
 * Each method handles:
 * 1. Making the API request
 * 2. Converting the response to the correct type
 * 3. Showing appropriate success/error messages
 * 4. Returning the data or null if there was an error
 */
class ModelService {
  // The URL of the Flask backend server
  private backendUrl: string = "http://127.0.0.1:5000";
  
  // Whether the backend is connected and ready
  private isConnected: boolean = false;

  /**
   * Initialize the service by connecting to the backend
   * @param config - Configuration including the backend URL
   * @returns Promise that resolves to true if connected successfully
   */
  async initialize(config: ModelConfig): Promise<boolean> {
    try {
      // Store the backend URL
      this.backendUrl = config.backendUrl || "http://127.0.0.1:5000";
      
      // Test the connection by getting the history
      const response = await fetch(`${this.backendUrl}/history`);
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        toast.error(`Cannot connect to backend: ${errorData.error || response.statusText}`);
        return false;
      }
      
      this.isConnected = true;
      toast.success("Connected to backend successfully");
      return true;
    } catch (error) {
      console.error("Error connecting to backend:", error);
      toast.error("Failed to connect to backend");
      return false;
    }
  }

  /**
   * Check if the service is connected to the backend
   * @returns true if connected and ready to use
   */
  isReady(): boolean {
    return this.isConnected;
  }

  /**
   * Analyze an image using the backend's /predict endpoint
   * @param imageFile - The image file to analyze
   * @returns Promise that resolves to the prediction results or null if there was an error
   */
  async predict(imageFile: File): Promise<PredictionResponse | null> {
    if (!this.isConnected) {
      toast.error("Not connected to backend. Please initialize first.");
      return null;
    }

    try {
      toast.info("Analyzing image...");
      
      // Create form data with the image
      const formData = new FormData();
      formData.append("file", imageFile);

      // Send the image to the backend
      const response = await fetch(`${this.backendUrl}/predict`, {
        method: "POST",
        body: formData
      });

      // Handle errors
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        toast.error(`Analysis failed: ${errorData.error || response.statusText}`);
        return null;
      }
      
      // Get the prediction results
      const data: PredictionResponse = await response.json();
      toast.success(`Analysis complete! Found ${data.total_objects} objects`);
      return data;
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze image");
      return null;
    }
  }

  /**
   * Get all previous predictions from the backend's /history endpoint
   * @returns Promise that resolves to an array of history items or empty array if there was an error
   */
  async getHistory(): Promise<HistoryItem[]> {
    if (!this.isConnected) {
      toast.error("Not connected to backend");
      return [];
    }

    try {
      const response = await fetch(`${this.backendUrl}/history`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const history: HistoryItem[] = await response.json();
      return history;
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to fetch history");
      return [];
    }
  }

  /**
   * Get a specific prediction from the backend's /history/{id} endpoint
   * @param id - The ID of the prediction to get
   * @returns Promise that resolves to the history item or null if not found
   */
  async getHistoryItem(id: string): Promise<HistoryItem | null> {
    if (!this.isConnected) {
      toast.error("Not connected to backend");
      return null;
    }

    try {
      const response = await fetch(`${this.backendUrl}/history/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Prediction not found");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return null;
      }
      
      const historyItem: HistoryItem = await response.json();
      return historyItem;
    } catch (error) {
      console.error("Error fetching prediction:", error);
      toast.error("Failed to fetch prediction");
      return null;
    }
  }

  /**
   * Clear all predictions using the backend's /history/clear endpoint
   * @returns Promise that resolves to true if cleared successfully
   */
  async clearHistory(): Promise<boolean> {
    if (!this.isConnected) {
      toast.error("Not connected to backend");
      return false;
    }

    try {
      const response = await fetch(`${this.backendUrl}/history/clear`, {
        method: "POST"
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result: SuccessResponse = await response.json();
      toast.success(result.message);
      return true;
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
      return false;
    }
  }
}

// Export a singleton instance of the service
export const modelService = new ModelService();