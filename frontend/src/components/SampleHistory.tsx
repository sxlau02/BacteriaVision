/**
 * SampleHistory Component
 * 
 * This component displays a list of previous image analyses, including:
 * - Timestamp of each analysis
 * - Total number of objects detected
 * - Breakdown of detected objects by class
 * - Ability to select and view previous analyses
 */

// Import UI components from our component library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { History as HistoryIcon } from "lucide-react";
import { HistoryItem } from "@/types";

/**
 * Props interface for the SampleHistory component
 * @property history - Array of previous analysis results
 * @property onSelectHistory - Callback function when a history item is selected
 * @property selectedId - ID of the currently selected history item
 */
interface SampleHistoryProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  selectedId?: string;
}

const headerColors = [
  "bg-green-200 text-green-900",
  "bg-blue-200 text-blue-900",
  "bg-purple-200 text-purple-900",
  "bg-yellow-200 text-yellow-900",
  "bg-pink-200 text-pink-900",
];

/**
 * SampleHistory Component
 * 
 * @param props - Component props
 * @returns React component for displaying analysis history
 */
const SampleHistory = ({ history }: SampleHistoryProps) => {
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  if (!history.length) {
    return (
      <div className="text-center text-muted py-8 text-black">No analysis history yet.</div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item, idx) => {
          const color = headerColors[idx % headerColors.length];
          const bacteriaTypes = Object.keys(item.detections).length;
          return (
            <Card key={item.id} className="flex flex-col rounded-2xl shadow-md overflow-hidden">
              <div className={`px-4 py-2 flex items-center gap-2 ${color} font-semibold text-sm`}>
                <HistoryIcon className="h-4 w-4" />
                {`Sample #${String(idx + 1).padStart(3, "0")}`}
              </div>
              <CardContent className="flex-1 flex flex-col justify-between p-4 bg-white">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg text-black">{`POME Sample ${String(idx + 1)}`}</span>
                    <span className="text-gray-400 text-sm">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-block w-3 h-3 rounded-full ${color.split(" ")[0]}`}></span>
                    <span className="text-black text-base">{bacteriaTypes} bacteria class identified</span>
                  </div>
                </div>
                <button
                  className="mt-auto text-blue-600 font-medium hover:underline"
                  onClick={() => setSelected(item)}
                >
                  View Details
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* Details Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Sample Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <img
                src={`data:image/jpeg;base64,${selected.annotated_image_base64}`}
                alt="Annotated"
                className="w-full rounded-lg border border-border object-contain"
              />
              <div>
                <div className="font-semibold mb-2">Class Distribution</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selected.detections).map(([name, count]) => {
                    const total = selected.total_objects;
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
  );
};

export default SampleHistory;
