
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container py-6 px-4 md:px-6 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground mt-1">
            Learn how to use the POME Bacteria Analysis platform
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <a href="#getting-started" className="block px-2 py-1 text-sm hover:bg-muted rounded-md">Getting Started</a>
                  <a href="#image-requirements" className="block px-2 py-1 text-sm hover:bg-muted rounded-md">Image Requirements</a>
                  <a href="#analysis-process" className="block px-2 py-1 text-sm hover:bg-muted rounded-md">Analysis Process</a>
                  <a href="#interpreting-results" className="block px-2 py-1 text-sm hover:bg-muted rounded-md">Interpreting Results</a>
                  <a href="#api-reference" className="block px-2 py-1 text-sm hover:bg-muted rounded-md">API Reference</a>
                  <a href="#model-details" className="block px-2 py-1 text-sm hover:bg-muted rounded-md">Model Details</a>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card id="getting-started">
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Basic introduction to the platform</CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  BacteriaVision is a specialized platform designed for analyzing bacterial presence in Palm Oil Mill Effluent (POME) samples through scanning electron microscope (SEM) imagery. The system uses advanced computer vision and machine learning techniques to identify bacterial species and provide quantitative analysis.
                </p>
                <h3>Basic workflow</h3>
                <ol>
                  <li><strong>Upload</strong> - Submit your SEM images through the dashboard</li>
                  <li><strong>Analysis</strong> - Our YOLO model processes the image to detect bacteria</li>
                  <li><strong>Review</strong> - Examine the detailed results including species identification</li>
                  <li><strong>Export</strong> - Download reports or access via API for your research</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card id="image-requirements">
              <CardHeader>
                <CardTitle>Image Requirements</CardTitle>
                <CardDescription>Specifications for optimal analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="format">
                  <TabsList className="w-full">
                    <TabsTrigger value="format" className="flex-1">Format</TabsTrigger>
                    <TabsTrigger value="resolution" className="flex-1">Resolution</TabsTrigger>
                    <TabsTrigger value="quality" className="flex-1">Quality</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="format" className="prose max-w-none">
                    <h3>Supported Formats</h3>
                    <p>The system accepts the following image formats:</p>
                    <ul>
                      <li><strong>PNG</strong> - Preferred for lossless compression</li>
                      <li><strong>JPEG/JPG</strong> - Acceptable for general use</li>
                      <li><strong>TIFF</strong> - Ideal for high-detail scientific imagery</li>
                    </ul>
                    <p>Maximum file size: <strong>10MB</strong></p>
                  </TabsContent>
                  
                  <TabsContent value="resolution" className="prose max-w-none">
                    <h3>Resolution Requirements</h3>
                    <p>For optimal bacterial detection, images should meet these specifications:</p>
                    <ul>
                      <li>Minimum resolution: <strong>1024×768 pixels</strong></li>
                      <li>Recommended resolution: <strong>2048×1536 pixels or higher</strong></li>
                      <li>Magnification: <strong>5,000-20,000×</strong> is optimal for bacterial identification</li>
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="quality" className="prose max-w-none">
                    <h3>Image Quality Factors</h3>
                    <p>Several factors affect analysis accuracy:</p>
                    <ul>
                      <li><strong>Contrast</strong> - High contrast between bacteria and background improves detection</li>
                      <li><strong>Focus</strong> - Ensure bacteria are in sharp focus</li>
                      <li><strong>Sample preparation</strong> - Proper preparation minimizes artifacts</li>
                      <li><strong>Scale bar</strong> - Including a scale bar helps with size estimation</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card id="analysis-process">
              <CardHeader>
                <CardTitle>Analysis Process</CardTitle>
                <CardDescription>How the AI model processes images</CardDescription>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  The BacteriaVision platform uses a custom-trained YOLO (You Only Look Once) model specifically adapted for bacterial detection in POME samples. Here's how the analysis works:
                </p>
                
                <ol>
                  <li><strong>Preprocessing</strong> - Images are normalized, enhanced, and segmented</li>
                  <li><strong>Detection</strong> - The YOLO model identifies bacterial cells and colonies</li>
                  <li><strong>Classification</strong> - Each detected bacterium is classified by species</li>
                  <li><strong>Counting</strong> - Total bacterial count and per-species statistics are calculated</li>
                  <li><strong>Confidence scoring</strong> - Each detection receives a confidence score</li>
                </ol>
                
                <p>
                  The model has been trained on thousands of SEM images of POME samples, with expert-labeled bacterial species common in palm oil processing environments.
                </p>
              </CardContent>
            </Card>
            
            {/* Additional documentation sections would continue here */}
          </div>
        </div>
      </div>
      
      <footer className="border-t py-6 px-4 md:px-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 BacteriaVision. All rights reserved.</p>
          <nav className="flex gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Documentation;
