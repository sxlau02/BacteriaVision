/**
 * ImageUpload Component
 * 
 * This component allows users to upload images for object detection analysis.
 * It handles:
 * - File selection through a file input
 * - Image validation
 * - Upload and analysis process
 * - Success/error notifications
 * - Loading states
 */

// Import UI components from our component library
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Import icons for visual elements
import { Upload, Loader2, Microscope, Image as ImageIcon, Trash2 } from "lucide-react";

// Import React hooks for state management
import { useState, useEffect, useRef } from "react";

// Import our model service for image analysis
import { modelService } from "@/services/modelService";

// Import toast notifications for user feedback
import { toast } from "sonner";

// Import type definitions
import { PredictionResponse } from "@/types";

import TIFF from 'tiff.js';

/**
 * Props interface for the ImageUpload component
 * @property onPredictionComplete - Callback function that receives the prediction results and input image
 */
interface ImageUploadProps {
  onPredictionComplete: (prediction: PredictionResponse, inputImage: string) => void;
}

/**
 * ImageUpload Component
 * 
 * @param props - Component props
 * @returns React component for image upload and analysis
 */
const ImageUpload = ({ onPredictionComplete }: ImageUploadProps) => {
  // State to track if an image is currently being uploaded/analyzed
  const [isUploading, setIsUploading] = useState(false);
  
  // State to store the currently selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // State to store the preview URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tiffPreviewUrl, setTiffPreviewUrl] = useState<string | null>(null);
  const [tiffError, setTiffError] = useState<string | null>(null);
  const [tiffLoading, setTiffLoading] = useState<boolean>(false);

  /**
   * Converts a File object to a base64 string
   * @param file - The file to convert
   * @returns Promise that resolves to the base64 string
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      // Clear previous preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Create new preview
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setSelectedFile(file);
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const isTiffFile = selectedFile && (selectedFile.type === 'image/tiff' || selectedFile.name.toLowerCase().endsWith('.tif') || selectedFile.name.toLowerCase().endsWith('.tiff'));

  useEffect(() => {
    if (isTiffFile && selectedFile) {
      setTiffError(null);
      setTiffPreviewUrl(null);
      setTiffLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      fetch('http://localhost:5000/convert-tiff', {
        method: 'POST',
        body: formData,
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to convert TIFF');
          return res.blob();
        })
        .then(blob => {
          setTiffPreviewUrl(URL.createObjectURL(blob));
          setTiffLoading(false);
        })
        .catch(err => {
          setTiffError('Preview not supported for this TIFF file, but you can still analyze it.');
          setTiffLoading(false);
          console.error('TIFF backend convert error:', err);
        });
    } else {
      setTiffPreviewUrl(null);
      setTiffError(null);
      setTiffLoading(false);
    }
  }, [isTiffFile, selectedFile]);

  /**
   * Handles the upload and analysis process
   * Sends the image to the model service and processes the results
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      let fileForAnalysis = selectedFile;

      // If TIFF, convert to JPEG first
      if (isTiffFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const response = await fetch('http://localhost:5000/convert-tiff', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const jpegBlob = await response.blob();
          fileForAnalysis = new File([jpegBlob], selectedFile.name.replace(/\.(tif|tiff)$/i, '.jpg'), { type: 'image/jpeg' });
        } else {
          toast.error("Failed to convert TIFF for analysis.");
          setIsUploading(false);
          return;
        }
      }

      // Convert file to base64 for history (optional)
      const base64 = await fileToBase64(fileForAnalysis);

      // Send to model service
      const result = await modelService.predict(fileForAnalysis);

      if (result) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        const newPreviewUrl = URL.createObjectURL(fileForAnalysis);
        setPreviewUrl(newPreviewUrl);
        onPredictionComplete(result, base64);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to analyze image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Render the component UI
  return (
    <Card className="w-full bg-gradient-to-br from-background to-primary/5 border-primary/10 shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Upload Image</CardTitle>
            <CardDescription className="text-base">
              Select an image to analyze
            </CardDescription>
          </div>
        </div>
        <Separator className="bg-primary/10" />
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File input and preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={handleFileButtonClick} className="px-6 py-2 font-semibold">
              Choose File
            </Button>
            {selectedFileName && (
              <span className="text-sm text-muted-foreground truncate max-w-[200px]">{selectedFileName}</span>
            )}
          </div>
          {/* Image preview or placeholder */}
          <div className="mt-4 flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">Input Preview</span>
            {selectedFile ? (
              <div className="relative w-72 h-48">
                {isTiffFile ? (
                  tiffLoading ? (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-muted rounded-md border border-dashed border-gray-300">
                      <span className="text-muted-foreground text-center">Loading TIFF preview...</span>
                    </div>
                  ) : tiffPreviewUrl ? (
                    <img
                      src={tiffPreviewUrl}
                      alt="TIFF preview"
                      className="w-full h-full object-contain rounded border border-border bg-muted"
                    />
                  ) : tiffError ? (
                    <div className="flex flex-col items-center justify-center h-full w-full bg-muted rounded-md border border-dashed border-gray-300">
                      <span className="text-muted-foreground text-center">{tiffError}</span>
                    </div>
                  ) : null
                ) : (
                  <img
                    src={previewUrl!}
                    alt="Input preview"
                    className="w-full h-full object-contain rounded border border-border bg-muted"
                  />
                )}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-red-100 rounded-full p-1 shadow transition"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ) : (
              <div className="w-72 h-48 flex flex-col items-center justify-center rounded border border-dashed border-border bg-muted text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2" />
                <span className="text-sm">No image selected</span>
              </div>
            )}
          </div>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="mt-4 w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-semibold mb-2">Instructions</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Select an image file (JPEG, PNG, TIFF, etc.)</li>
            <li>Click Upload to analyze the image</li>
            <li>Wait for the analysis to complete</li>
            <li>View the results in the Analysis tab</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageUpload;
