import { Card, CardContent } from "@/components/ui/card";
import { History as HistoryIcon, Timer as TimerIcon, Microscope } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { HistoryItem } from "@/types";

const headerColors = [
  "bg-green-200 text-green-900",
  "bg-blue-200 text-blue-900",
  "bg-purple-200 text-purple-900",
  "bg-yellow-200 text-yellow-900",
  "bg-pink-200 text-pink-900",
];

interface SampleHistoryCardProps {
  item: HistoryItem;
  idx: number;
  onViewDetails: (item: HistoryItem) => void;
}

const formatProcessingTime = (ms?: number) => {
  if (typeof ms !== 'number') return 'N/A';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

const SampleHistoryCard = ({ item, idx, onViewDetails }: SampleHistoryCardProps) => {
  const color = headerColors[idx % headerColors.length];
  const bacteriaTypes = Object.keys(item.detections).length;
  return (
    <Card className="flex flex-col rounded-2xl shadow-lg overflow-hidden min-w-[340px] max-w-[340px] bg-gradient-to-br from-background to-primary/5 border-primary/10">
      <div className={`px-4 py-2 flex items-center gap-2 ${color} font-semibold text-sm`}>
        <HistoryIcon className="h-4 w-4" />
        {`Sample #${String(idx + 1).padStart(3, "0")}`}
      </div>
      <CardContent className="flex-1 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg text-black">{`POME Sample ${String(idx + 1)}`}</span>
            <span className="text-gray-400 text-sm">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <TimerIcon className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-blue-700 font-semibold">{formatProcessingTime(item.processingTime)}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Microscope className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-700 font-semibold">Estimated Density: {item.density_percentage.toFixed(2)}%</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-block w-3 h-3 rounded-full ${color.split(" ")[0]}`}></span>
            <span className="text-black text-base">{bacteriaTypes} bacteria class identified</span>
          </div>
        </div>
        <button
          className="mt-auto text-blue-600 font-medium hover:underline"
          onClick={() => onViewDetails(item)}
        >
          View Details
        </button>
      </CardContent>
    </Card>
  );
};

export default SampleHistoryCard; 