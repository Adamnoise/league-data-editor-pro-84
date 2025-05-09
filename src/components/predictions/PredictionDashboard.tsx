
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { MatchPredictionPanel } from "./MatchPredictionPanel"
import { PredictionResults } from "./PredictionResults"
import { PredictionPatterns } from "./PredictionPatterns"
import { RefreshCw, TrendingUp, History, Target } from "lucide-react"
import { toast } from "sonner"
import { getPrediction } from "@/services/api"
import type { Match } from "@/types"
import type { PredictionResult } from "@/types/api"

export function PredictionDashboard({ matches }: { matches: Match[] }) {
  const [activeTab, setActiveTab] = useState("predictions")
  const [selectedPredictions, setSelectedPredictions] = useState<Array<{
    homeTeam: string;
    awayTeam: string;
    prediction: PredictionResult | null;
    predictionType: "both_score" | "draw" | "reversal" | "home_win" | "away_win";
    odds: number;
  }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleAddPrediction = (prediction: {
    homeTeam: string;
    awayTeam: string;
    prediction: PredictionResult | null;
    predictionType: "both_score" | "draw" | "reversal" | "home_win" | "away_win";
    odds: number;
  }) => {
    setSelectedPredictions(prev => {
      // Check if we already have this match
      const exists = prev.some(p => 
        p.homeTeam === prediction.homeTeam && p.awayTeam === prediction.awayTeam
      )
      
      if (exists) {
        toast.warning("Ez a mérkőzés már hozzá lett adva.")
        return prev
      }
      
      return [...prev, prediction]
    })
    
    toast.success(`${prediction.homeTeam} vs ${prediction.awayTeam} hozzáadva.`)
    setActiveTab("results")
  }
  
  const calculateTotalOdds = () => {
    return selectedPredictions.reduce((acc, curr) => acc * curr.odds, 1)
  }
  
  const handleClearPredictions = () => {
    setSelectedPredictions([])
    toast.info("Tippek törölve.")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Predikció Rendszer</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 bg-white/5 border-white/10"
          onClick={() => setActiveTab("predictions")}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Frissítés
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 bg-black/20 w-full rounded-xl mb-6">
          <TabsTrigger
            value="predictions"
            className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-black/20"
          >
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Predikciók</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-black/20"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Eredmények</span>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-black/20"
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Előzmények</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictions">
          <MatchPredictionPanel matches={matches} onAddPrediction={handleAddPrediction} />
        </TabsContent>
        
        <TabsContent value="results">
          <PredictionResults 
            predictions={selectedPredictions} 
            totalOdds={calculateTotalOdds()}
            onClear={handleClearPredictions}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <PredictionPatterns />
        </TabsContent>
      </Tabs>
    </div>
  )
}
