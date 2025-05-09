
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { getTeams, getPrediction } from "@/services/api"
import { PredictionResult } from "./PredictionResult"
import { MatchHistoryStats } from "./MatchHistoryStats"
import { ReversalPrediction } from "./ReversalPrediction"
import { Loader2, TrendingUp, History, RefreshCw, Plus } from "lucide-react"
import type { PredictionResult as PredictionResultType } from "@/types/api"
import type { Match } from "@/types"

interface MatchPredictionPanelProps {
  matches: Match[]
  onAddPrediction?: (prediction: {
    homeTeam: string;
    awayTeam: string;
    prediction: PredictionResultType | null;
    predictionType: "both_score" | "draw" | "reversal" | "home_win" | "away_win";
    odds: number;
  }) => void
}

export function MatchPredictionPanel({ matches, onAddPrediction }: MatchPredictionPanelProps) {
  const [homeTeam, setHomeTeam] = useState<string>("")
  const [awayTeam, setAwayTeam] = useState<string>("")
  const [teams, setTeams] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResultType | null>(null)
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)
  const [activeTab, setActiveTab] = useState("prediction")
  
  // Load teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoadingTeams(true)
      try {
        const teamsList = await getTeams()
        setTeams(teamsList.length > 0 ? teamsList.sort() : [])
      } catch (error) {
        console.error("Failed to load teams:", error)
      } finally {
        setIsLoadingTeams(false)
      }
    }
    
    fetchTeams()
  }, [])
  
  const handlePredict = async () => {
    if (homeTeam && awayTeam) {
      setIsLoading(true)
      try {
        const result = await getPrediction(homeTeam, awayTeam)
        setPrediction(result.prediction || null)
        setActiveTab("prediction")
      } catch (error) {
        console.error("Prediction error:", error)
        toast.error("Hiba történt a predikció során")
      } finally {
        setIsLoading(false)
      }
    }
  }
  
  const handleAddToPredictions = (predictionType: "both_score" | "draw" | "reversal" | "home_win" | "away_win", odds: number) => {
    if (!onAddPrediction) return
    
    onAddPrediction({
      homeTeam,
      awayTeam,
      prediction,
      predictionType,
      odds
    })
  }
  
  // Calculate fixed odds for different prediction types
  const getBaseOdds = () => {
    if (!prediction) return {
      bothScore: 2.2,
      draw: 3.2,
      reversal: 22.0,
      homeWin: 2.0,
      awayWin: 3.5
    }
    
    const { predictedWinner, confidence, bothTeamsToScoreProb } = prediction
    
    // Base odds - would normally come from actual bookmaker API
    let homeOdds = predictedWinner === 'home' ? 2.0 - (confidence * 0.5) : 2.2 + (confidence * 0.8)
    let drawOdds = predictedWinner === 'draw' ? 3.0 - (confidence * 0.5) : 3.2 + (confidence * 1.0)
    let awayOdds = predictedWinner === 'away' ? 3.0 - (confidence * 0.5) : 3.5 + (confidence * 1.0)
    let bothScoreOdds = bothTeamsToScoreProb > 70 ? 1.8 : bothTeamsToScoreProb > 50 ? 2.0 : 2.2
    
    // Reversal odds - these are high-value opportunities
    const reversalOdds = 22.0
    
    return {
      bothScore: parseFloat(bothScoreOdds.toFixed(2)),
      draw: parseFloat(drawOdds.toFixed(2)),
      reversal: parseFloat(reversalOdds.toFixed(2)),
      homeWin: parseFloat(homeOdds.toFixed(2)),
      awayWin: parseFloat(awayOdds.toFixed(2))
    }
  }
  
  const odds = getBaseOdds()
  
  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">Mérkőzés Predikció</CardTitle>
          <CardDescription>
            Válassz ki két csapatot az eredmény és fogadási javaslatok előrejelzéséhez
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Hazai csapat</label>
              <Select value={homeTeam} onValueChange={setHomeTeam} disabled={isLoadingTeams}>
                <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
                  {isLoadingTeams ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Csapatok betöltése...
                    </div>
                  ) : (
                    <SelectValue placeholder="Válassz hazai csapatot" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={`home-${team}`} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Vendég csapat</label>
              <Select value={awayTeam} onValueChange={setAwayTeam} disabled={isLoadingTeams}>
                <SelectTrigger className="w-full bg-black/30 border-white/10 text-white">
                  {isLoadingTeams ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Csapatok betöltése...
                    </div>
                  ) : (
                    <SelectValue placeholder="Válassz vendég csapatot" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={`away-${team}`} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handlePredict} 
            disabled={!homeTeam || !awayTeam || homeTeam === awayTeam || isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Predikció generálása...
              </div>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Predikció Generálása
              </>
            )}
          </Button>
          
          {prediction && (
            <div className="mt-6 animate-fadeIn">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 bg-black/30 w-full rounded-lg mb-4">
                  <TabsTrigger value="prediction">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Predikció</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <div className="flex items-center gap-1">
                      <History className="h-4 w-4" />
                      <span>Előzmények</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="prediction">
                  <div className="space-y-4">
                    <PredictionResult 
                      homeTeam={homeTeam}
                      awayTeam={awayTeam}
                      prediction={prediction}
                    />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                      {prediction.bothTeamsToScoreProb > 60 && (
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-between bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-300"
                          onClick={() => handleAddToPredictions("both_score", odds.bothScore)}
                        >
                          <span>Mindkét csapat gólt szerez</span>
                          <div className="flex items-center">
                            <span className="text-amber-400 font-bold mr-1">{odds.bothScore}×</span>
                            <Plus className="h-4 w-4" />
                          </div>
                        </Button>
                      )}
                      
                      {prediction.predictedWinner === 'draw' && (
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-between bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300"
                          onClick={() => handleAddToPredictions("draw", odds.draw)}
                        >
                          <span>Döntetlen</span>
                          <div className="flex items-center">
                            <span className="text-amber-400 font-bold mr-1">{odds.draw}×</span>
                            <Plus className="h-4 w-4" />
                          </div>
                        </Button>
                      )}
                      
                      {prediction.predictedWinner === 'home' && (
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-between bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-300"
                          onClick={() => handleAddToPredictions("home_win", odds.homeWin)}
                        >
                          <span>Hazai győzelem</span>
                          <div className="flex items-center">
                            <span className="text-amber-400 font-bold mr-1">{odds.homeWin}×</span>
                            <Plus className="h-4 w-4" />
                          </div>
                        </Button>
                      )}
                      
                      {prediction.predictedWinner === 'away' && (
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-between bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300"
                          onClick={() => handleAddToPredictions("away_win", odds.awayWin)}
                        >
                          <span>Vendég győzelem</span>
                          <div className="flex items-center">
                            <span className="text-amber-400 font-bold mr-1">{odds.awayWin}×</span>
                            <Plus className="h-4 w-4" />
                          </div>
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-between bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300"
                        onClick={() => handleAddToPredictions("reversal", odds.reversal)}
                      >
                        <span>Fordítás (HT/FT)</span>
                        <div className="flex items-center">
                          <span className="text-amber-400 font-bold mr-1">{odds.reversal}×</span>
                          <Plus className="h-4 w-4" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <MatchHistoryStats homeTeam={homeTeam} awayTeam={awayTeam} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
