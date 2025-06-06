import { useState, useEffect } from "react";
import Header from "@/components/Header";
import bacteriaImg from "@/assets/bacteria.png";
import ImageUpload from "@/components/ImageUpload";
import AnalysisResults from "@/components/AnalysisResults";
import SampleHistory from "@/components/SampleHistory";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TreePalm, Bug, Microscope, HelpCircle, History, Camera } from "lucide-react";
import { modelService } from "@/services/modelService";
import { PredictionResponse, HistoryItem } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SampleHistoryCard from "@/components/SampleHistoryCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const bacteriaLibrary = [
  {
    key: 'clostridiaceae',
    name: 'Clostridiaceae',
    color: 'bg-orange-600',
    description: 'Anaerobic, spore-forming, rod-shaped bacteria commonly found in oxygen-depleted environments.',
    taxonomy: 'Phylum Bacillota, Class Clostridia',
    function: 'Major fermenters in the anaerobic digestion process. They hydrolyze carbohydrates, proteins, and lipids into volatile fatty acids (VFAs), hydrogen, and carbon dioxide—essential substrates for methanogenesis.'
  },
  {
    key: 'syntrophomonadaceae',
    name: 'Syntrophomonadaceae',
    color: 'bg-yellow-600',
    description: 'Strict anaerobes known for syntrophic metabolism, particularly in conjunction with hydrogenotrophic methanogens.',
    taxonomy: 'Phylum Bacillota, Class Clostridia',
    function: 'Degrade long-chain and branched fatty acids into acetate and hydrogen. This process is thermodynamically feasible only when hydrogen-scavenging methanogens are present, making them key players in the stabilization of anaerobic digestion.'
  },
  {
    key: 'thermoanaerobacterales',
    name: 'Thermoanaerobacterales',
    color: 'bg-red-600',
    description: 'Thermophilic, strictly anaerobic bacteria adapted to elevated temperatures.',
    taxonomy: 'Phylum Bacillota, Class Clostridia, Order Thermoanaerobacterales',
    function: 'Facilitate rapid hydrolysis and acidogenesis at higher temperatures, increasing the efficiency of thermophilic digestion processes and enhancing methane yields in advanced treatment stages.'
  },
  {
    key: 'lactobacillaceae',
    name: 'Lactobacillaceae',
    color: 'bg-pink-600',
    description: 'Facultative anaerobes involved in lactic acid fermentation, commonly found in early-stage fermentation environments.',
    taxonomy: 'Phylum Bacillota, Class Bacilli',
    function: 'Convert simple carbohydrates into lactic acid, contributing to early acidogenesis and pH reduction. This creates favorable conditions for successive anaerobic microbial activity.'
  },
  {
    key: 'leuconostocaceae',
    name: 'Leuconostocaceae',
    color: 'bg-green-700',
    description: 'Heterofermentative lactic acid bacteria with coccoid or rod morphology.',
    taxonomy: 'Phylum Bacillota, Class Bacilli',
    function: 'Contribute to acidogenesis by fermenting sugars into lactic acid, ethanol, and carbon dioxide. Their activity aids in microbial succession and system acidification in anaerobic ponds.'
  },
  {
    key: 'prevotellaceae',
    name: 'Prevotellaceae',
    color: 'bg-blue-700',
    description: 'Obligate anaerobes that degrade complex plant polysaccharides and proteins.',
    taxonomy: 'Phylum Bacteroidota, Class Bacteroidia',
    function: 'Break down fibrous plant material and proteins into VFAs, facilitating microbial cross-feeding and supporting methanogenic archaea in downstream stages.'
  },
  {
    key: 'pseudomonadota',
    name: 'Pseudomonadota',
    color: 'bg-indigo-600',
    description: 'Diverse phylum of Gram-negative bacteria with broad metabolic versatility.',
    taxonomy: 'Phylum Pseudomonadota',
    function: 'Participate in the degradation of aromatic compounds, detoxification of pollutants, and nitrogen cycling. Their facultative anaerobic metabolism supports early-stage aerobic or microaerophilic processes in treatment ponds.'
  },
  {
    key: 'actinomycetota',
    name: 'Actinomycetota',
    color: 'bg-pink-700',
    description: 'High G+C Gram-positive bacteria, many of which are filamentous and capable of secondary metabolite production.',
    taxonomy: 'Phylum Actinomycetota',
    function: 'Contribute to the breakdown of lignocellulosic material and complex organics, especially in acclimated systems. Their presence enhances sludge stabilization and supports long-term system resilience.'
  }
];

const Index = () => {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<HistoryItem | null>(null);
  const [openDetails, setOpenDetails] = useState<string | null>(null);
  const [modalBacteria, setModalBacteria] = useState<null | typeof bacteriaLibrary[0]>(null);
  
  // Initialize model on component mount
  useEffect(() => {
    const initializeModel = async () => {
      try {
        const success = await modelService.initialize({
          backendUrl: "http://127.0.0.1:5000"
        });
        
        if (!success) {
          toast.error("Failed to connect to the backend. Please check if the server is running.");
          return;
        }
        
        setIsInitialized(true);
        toast.success("Model initialized successfully");
      } catch (error) {
        console.error("Error initializing model:", error);
        toast.error("Failed to initialize model. Please check if the server is running and try refreshing the page.");
      }
    };
    
    initializeModel();
  }, []);

  // Show error state if model initialization failed
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-primary">Connection Error</h1>
          <p className="text-muted-foreground">
            Unable to connect to the analysis server. Please make sure the server is running and try refreshing the page.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  const handlePredictionComplete = (newPrediction: PredictionResponse, newInputImage: string) => {
    setPrediction(newPrediction);
    setInputImage(newInputImage);
    
    // Convert PredictionResponse to HistoryItem
    const historyItem: HistoryItem = {
      id: newPrediction.id,
      timestamp: Date.now(),
      detections: newPrediction.detections,
      total_objects: newPrediction.total_objects,
      annotated_image_base64: newPrediction.annotated_image_base64,
      input_image_base64: newInputImage,
      processingTime: newPrediction.timing.total_processing_time_ms,
    };
    setHistory(prev => [historyItem, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-8 md:py-10 overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TreePalm className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary drop-shadow-sm">POME Bacteria Analysis</h1>
              <p className="text-base text-foreground/80 mt-1 whitespace-nowrap">
                Upload scanning electron microscope images to analyze bacterial families in palm oil mill effluent
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="pt-4 pb-12 bg-gradient-to-b from-background/95 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary">How It Works</h2>
              <p className="text-lg text-muted-foreground whitespace-nowrap">
                Our advanced AI-powered platform makes bacterial analysis simple and efficient
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-stretch gap-8 py-8 lg:grid-cols-3 lg:gap-10">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center h-full">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 font-bold text-lg text-gray-700 mb-4">1</span>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Camera className="h-6 w-6 text-black" />
                <h3 className="font-semibold text-lg text-primary">Upload SEM Image</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload a high-resolution scanning electron microscope image of your POME sample.
              </p>
            </div>
            {/* Step 2 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center h-full">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 font-bold text-lg text-gray-700 mb-4">2</span>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Microscope className="h-6 w-6 text-black" />
                <h3 className="font-semibold text-lg text-primary">AI Analysis</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                The YOLO-based computer vision model identifies and classifies bacterial families.
              </p>
            </div>
            {/* Step 3 */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center h-full">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 font-bold text-lg text-gray-700 mb-4">3</span>
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src={bacteriaImg} alt="Bacteria" className="h-6 w-6 object-contain" />
                <h3 className="font-semibold text-lg text-primary">Results & Insights</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Review detailed analysis with bacterial counts, family identification, and visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container py-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Upload and Analysis Result side by side */}
        <div className="grid gap-10 md:grid-cols-2 mb-16">
          <ImageUpload onPredictionComplete={handlePredictionComplete} />
          <AnalysisResults prediction={prediction} inputImage={inputImage} />
        </div>
        {/* Analysis History below upload/result */}
        <div className="w-full mb-16">
          <div className="bg-gradient-to-br from-background to-primary/5 border-primary/10 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-background to-primary/5 px-6 py-3 rounded-t-2xl border-b border-primary/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-black">Analysis History</h2>
            </div>
            <div className="p-8">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-12 border border-dashed border-gray-300">
                  <svg className="h-10 w-10 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="text-lg font-semibold text-gray-500">No analysis history yet</div>
                </div>
              ) : (
                <>
                  <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
                    {[...history].slice().reverse().map((item, idx) => (
                      <SampleHistoryCard key={item.id} item={item} idx={idx} onViewDetails={setSelectedHistory} />
                    ))}
                  </div>
                  <Dialog open={!!selectedHistory} onOpenChange={() => setSelectedHistory(null)}>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Sample Details</DialogTitle>
                      </DialogHeader>
                      {selectedHistory && (
                        <div className="space-y-4">
                          <img
                            src={`data:image/jpeg;base64,${selectedHistory.annotated_image_base64}`}
                            alt="Annotated"
                            className="w-full rounded-lg border border-border object-contain"
                          />
                          <div>
                            <div className="font-semibold mb-2">Class Distribution</div>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(selectedHistory.detections).map(([name, count]) => {
                                const total = selectedHistory.total_objects;
                                const percentage = ((count / total) * 100).toFixed(1);
                                return (
                                  <Badge key={name} className="bg-muted text-black border border-border px-3 py-1 rounded-full">
                                    {name}: {count} ({percentage}%)
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Bacteria Library below history */}
        <div className="w-full mb-12">
          <div className="bg-gradient-to-br from-background to-primary/5 border-primary/10 shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-background to-primary/5 px-6 py-3 rounded-t-2xl border-b border-primary/10 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-black">Common Bacteria Class Detected in POME</h2>
            </div>
            <div className="p-8">
              <div className="space-y-6">
                <div className="relative">
                  <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
                    {bacteriaLibrary.map((bacteria) => (
                      <div key={bacteria.key} className="flex-none w-[400px] snap-start">
                        <div className={`${bacteria.color} shadow-lg border border-white/10 rounded-xl overflow-hidden p-8 h-full transition-all duration-200 relative group hover:scale-[1.025] hover:shadow-2xl focus-within:scale-[1.025] focus-within:shadow-2xl`}>
                          <div className="absolute inset-0 bg-black/10 pointer-events-none rounded-xl" />
                          <div className="relative z-10 font-sans">
                            <div className="font-extrabold text-2xl text-white mb-3 tracking-tight drop-shadow-md leading-snug">{bacteria.name}</div>
                            <div className="text-white font-semibold mb-6 leading-relaxed drop-shadow-md tracking-normal">{bacteria.description}</div>
                            <div className="flex items-center justify-end mt-2">
                              <button
                                onClick={() => setModalBacteria(bacteria)}
                                className="px-5 py-2 rounded-full bg-white/20 text-white font-bold shadow hover:bg-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black drop-shadow-md"
                              >
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Dialog open={!!modalBacteria} onOpenChange={() => setModalBacteria(null)}>
                    <DialogContent className="max-w-md animate-fade-in">
                      <DialogHeader>
                        <DialogTitle className="font-sans tracking-tight text-2xl leading-snug">{modalBacteria?.name}</DialogTitle>
                      </DialogHeader>
                      {modalBacteria && (
                        <div className="space-y-4 font-sans">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 uppercase tracking-wide">Taxonomy</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{modalBacteria.taxonomy}</p>
                          </div>
                          <hr className="my-2 border-gray-200" />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 uppercase tracking-wide">Function in POME</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{modalBacteria.function}</p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 px-4 md:px-6 bg-gradient-to-r from-primary/5 to-accent/5 microscope-bg">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={bacteriaImg} alt="Bacteria icon" className="h-4 w-4 object-contain" />
            <p>© 2025 BacteriaVision. POME Analysis Platform.</p>
          </div>
          <nav className="flex gap-4">
            <a href="#" className="hover:underline hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:underline hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:underline hover:text-primary transition-colors">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Index;
