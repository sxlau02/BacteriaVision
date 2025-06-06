/**
 * AnalysisResults Component
 * 
 * This component displays the results of an image analysis, including:
 * - The annotated image showing detected objects
 * - A bar chart showing object distribution
 * - Detailed statistics about detected objects
 * - Processing time and total object count
 */

// Import UI components from our component library
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Microscope, Timer as TimerIcon } from "lucide-react";

// Import charting components from Recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

// Import type definitions
import { PredictionResponse } from "@/types";

/**
 * Props interface for the AnalysisResults component
 * @property prediction - The prediction results from the model service
 * @property inputImage - The original input image as a base64 string
 */
interface AnalysisResultsProps {
  prediction?: PredictionResponse;
  inputImage?: string;
}

// Define a scientific color palette
const SCIENTIFIC_COLORS = {
  // Primary colors based on legend
  primary: '#0232f0',      // Clostridiaceae blue
  secondary: '#0ecfe8',    // Other classes cyan
  
  // Functional colors
  success: '#00a3a3',      // Teal success
  warning: '#ffb700',      // Amber warning
  error: '#ff3b30',        // Red error
  info: '#007aff',         // Blue info
  
  // Neutral colors
  background: '#f0f7ff',   // Light blue background
  surface: '#ffffff',      // Surface color
  border: '#e0f2ff',       // Light blue border
  text: '#001f3f',         // Dark blue text
  textSecondary: '#4a6b8a', // Secondary blue text
  
  // Original legend colors
  clostridiaceae: '#0232f0', // Original blue for clostridiaceae
  other: '#0ecfe8',        // Original cyan for other classes
};

/**
 * AnalysisResults Component
 * 
 * @param props - Component props
 * @returns React component for displaying analysis results
 */
const AnalysisResults = ({ prediction, inputImage }: AnalysisResultsProps) => {
  // Convert the detection data into a format suitable for the chart
  const chartData = prediction ? Object.entries(prediction.detections).map(([name, count]) => ({
    name,
    count,
    percentage: (count / prediction.total_objects) * 100
  })) : [];

  // Format processing time
  const formatProcessingTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  // Render the analysis results with visualization and distribution tabs
  return (
    <Card className="w-full bg-gradient-to-br from-background to-primary/5 border-primary/10 shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Microscope className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-text">Analysis Results</CardTitle>
            <CardDescription className="text-base text-textSecondary">
              {prediction ? 'Analysis completed successfully' : 'No analysis results available'}
            </CardDescription>
          </div>
          {prediction && (
            <Badge variant="outline" className="text-lg px-4 py-2 font-bold bg-primary/5 text-primary border-primary/20">
              {prediction.total_objects} Instances
            </Badge>
          )}
        </div>
        <Separator className="bg-border" />
        {prediction && (
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-base font-semibold">
              <TimerIcon className="h-5 w-5 mr-2 text-blue-500" />
              Processing time: {formatProcessingTime(prediction.timing.total_processing_time_ms)}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="visualization" className="w-full">
          <TabsList className="flex w-full justify-start gap-2 bg-background border border-border px-2 py-1 rounded-lg">
            <TabsTrigger value="visualization" className="flex-1 min-w-[120px] px-4 py-2 text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              Visualization
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex-1 min-w-[120px] px-4 py-2 text-base data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
              Class Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="mt-6">
            {prediction ? (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-surface border border-border shadow-sm">
                  <img
                    src={`data:image/jpeg;base64,${prediction.annotated_image_base64}`}
                    alt="Analyzed image"
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Legend for classes below the output image */}
                <div className="flex flex-wrap gap-4 items-center justify-center p-4 bg-surface border border-border rounded-lg shadow-sm">
                  {Object.keys(prediction.detections).map((name) => (
                    <div key={name} className="flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded"
                        style={{ backgroundColor: name.toLowerCase() === 'clostridiaceae' ? '#0232f0' : '#0ecfe8' }}
                      />
                      <span className="text-sm font-medium text-textSecondary">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-textSecondary bg-surface border border-border rounded-lg">
                No image to display
              </div>
            )}
          </TabsContent>

          <TabsContent value="distribution" className="mt-6">
            {prediction ? (
              <div className="space-y-6">
                {/* Legend for classes */}
                <div className="flex flex-wrap gap-4 mb-2 items-center p-4 bg-surface border border-border rounded-lg shadow-sm">
                  {Object.keys(prediction.detections).map((name) => (
                    <div key={name} className="flex items-center gap-2">
                      <span
                        className="inline-block w-4 h-4 rounded"
                        style={{ backgroundColor: name.toLowerCase() === 'clostridiaceae' ? '#0232f0' : '#0ecfe8' }}
                      />
                      <span className="text-sm font-medium text-textSecondary">{name}</span>
                    </div>
                  ))}
                </div>
                <div className="h-[300px] bg-surface border border-border rounded-lg p-4 shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="name" 
                        className="text-xs text-textSecondary"
                        tick={{ fill: 'currentColor' }}
                      />
                      <YAxis 
                        className="text-xs text-textSecondary"
                        tick={{ fill: 'currentColor' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #E2E8F0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        radius={[4, 4, 0, 0]}
                        fill={SCIENTIFIC_COLORS.primary}
                      >
                        {chartData.map((entry) => (
                          <Cell 
                            key={`cell-${entry.name}`} 
                            fill={entry.name.toLowerCase() === 'clostridiaceae' ? '#0232f0' : '#0ecfe8'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-text">Class Distribution</h3>
                  <div className="space-y-3">
                    {Object.entries(prediction.detections).map(([name, count]) => {
                      const percentage = ((count / prediction.total_objects) * 100).toFixed(1);
                      return (
                        <div key={name} className="space-y-1">
                          <div className="flex justify-between text-sm items-center">
                            <span className="flex items-center gap-2">
                              <span
                                className="inline-block w-3 h-3 rounded"
                                style={{ backgroundColor: name.toLowerCase() === 'clostridiaceae' ? '#0232f0' : '#0ecfe8' }}
                              />
                              <span className="text-textSecondary">{name}</span>
                            </span>
                            <span className="font-medium text-text">{count} ({percentage}%)</span>
                          </div>
                          <Progress 
                            value={(count / prediction.total_objects) * 100} 
                            className="h-2 bg-background"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-textSecondary bg-surface border border-border rounded-lg">
                No distribution data available
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AnalysisResults;
