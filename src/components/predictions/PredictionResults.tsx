
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2, Calculator } from "lucide-react"
import type { PredictionResult } from "@/types/api"

interface PredictionResultsProps {
  predictions: Array<{
    homeTeam: string;
    awayTeam: string;
    prediction: PredictionResult | null;
    predictionType: "both_score" | "draw" | "reversal" | "home_win" | "away_win";
    odds: number;
  }>
  totalOdds: number;
  onClear: () => void;
}

export function PredictionResults({ predictions, totalOdds, onClear }: PredictionResultsProps) {
  const [betAmount, setBetAmount] = useState<string>("2000")
  
  const getPredictionLabel = (type: string) => {
    switch(type) {
      case "both_score": return "Mindkét csapat gólt szerez"
      case "draw": return "Döntetlen"
      case "reversal": return "Fordítás (félidő/végeredmény)"
      case "home_win": return "Hazai győzelem"
      case "away_win": return "Vendég győzelem"
      default: return type
    }
  }
  
  const getPredictionClass = (type: string) => {
    switch(type) {
      case "both_score": return "bg-blue-500/20 border-blue-500/30 text-blue-300"
      case "draw": return "bg-purple-500/20 border-purple-500/30 text-purple-300"
      case "reversal": return "bg-amber-500/20 border-amber-500/30 text-amber-300" 
      case "home_win": return "bg-green-500/20 border-green-500/30 text-green-300"
      case "away_win": return "bg-red-500/20 border-red-500/30 text-red-300"
      default: return "bg-gray-500/20 border-gray-500/30 text-gray-300"
    }
  }
  
  const calculatedWinning = parseFloat(betAmount) * totalOdds

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-white/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Kiválasztott Tippek</CardTitle>
            {predictions.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 bg-red-900/10 border-red-900/30 text-red-400"
                onClick={onClear}
              >
                <Trash2 className="h-4 w-4" />
                Törlés
              </Button>
            )}
          </div>
          <CardDescription>
            Cél: Legalább 3 sikeres tipp
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {predictions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Még nem adtál hozzá tippeket. Válassz a 'Predikciók' fülön.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {predictions.map((pred, index) => (
                  <div key={`${pred.homeTeam}-${pred.awayTeam}`} className="p-3 bg-black/30 rounded-lg border border-white/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-white mb-1">
                          {pred.homeTeam} vs {pred.awayTeam}
                        </div>
                        <Badge variant="outline" className={getPredictionClass(pred.predictionType)}>
                          {getPredictionLabel(pred.predictionType)}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 font-semibold">{pred.odds.toFixed(2)}×</div>
                        <div className="text-xs text-gray-400">
                          Bizalom: {pred.prediction?.confidence ? Math.round(pred.prediction.confidence * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400">Összesített odds:</div>
                  <div className="text-lg font-bold text-amber-400">{totalOdds.toFixed(2)}×</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Tét (HUF)</label>
                    <Input
                      type="number"
                      min="100"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="bg-black/30 border-white/10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Nyeremény (HUF)</label>
                    <div className="p-2 bg-black/30 border border-white/10 rounded-md flex items-center">
                      <Calculator className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-lg text-green-400">{calculatedWinning.toLocaleString('hu-HU')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">Sikerességi Statisztika</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-black/30 rounded-lg">
              <div className="text-2xl font-bold text-white">{predictions.length}</div>
              <div className="text-sm text-gray-400">Kiválasztott Tippek</div>
            </div>
            <div className="p-4 bg-black/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">0</div>
              <div className="text-sm text-gray-400">Sikeres Tippek</div>
            </div>
            <div className="p-4 bg-black/30 rounded-lg">
              <div className="text-2xl font-bold text-red-400">0</div>
              <div className="text-sm text-gray-400">Sikertelen Tippek</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
