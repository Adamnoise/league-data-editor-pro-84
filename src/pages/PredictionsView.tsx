
import { memo, useState } from "react"
import { useLeagueState } from "@/hooks/league"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, ArrowLeft } from "lucide-react"
import { LeagueStats } from "@/components/stats/LeagueStats"
import { calculateLeagueStatistics } from "@/utils/leagueStatistics"
import { PredictionDashboard } from "@/components/predictions/PredictionDashboard"

export const PredictionsView = memo(() => {
  const { 
    currentMatches, 
    selectedLeagueId, 
    leaguesList, 
    navigate, 
    isLoading, 
    refreshData 
  } = useLeagueState()
  
  // Get the currently selected league
  const selectedLeague = leaguesList.find(league => league.id === selectedLeagueId)
  
  // Calculate statistics for the selected league
  const leagueStatistics = calculateLeagueStatistics(currentMatches)
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("leagues")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Vissza
          </Button>
          <h2 className="text-2xl font-bold text-white">
            Mérkőzés Predikciók {selectedLeague ? `- ${selectedLeague.name}` : ''}
          </h2>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          onClick={refreshData}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PredictionDashboard matches={currentMatches} />
        </div>
        
        <div>
          <LeagueStats statistics={leagueStatistics} league={selectedLeague} />
          
          <Card className="mt-6 bg-black/20 border-white/5">
            <CardHeader>
              <CardTitle className="text-white">Predikciós Modell Információ</CardTitle>
              <CardDescription>A predikciós rendszer működése</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                A mérkőzés-kimenetel előrejelző többfaktoros modellt használ, amely figyelembe veszi:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-400">
                <li>Egymás elleni eredmények történelmi adatait</li>
                <li>Aktuális forma (utolsó 5 mérkőzés) időbeli súlyozással</li>
                <li>Hazai pálya előnyt (1.2x szorzó a hazai csapat gólszerzésére)</li>
                <li>Átlagos rúgott és kapott gólokat csapatonként</li>
                <li>Bajnoki helyezést és relatív csapaterőt</li>
              </ul>
              <p className="text-gray-300 mt-4">
                A megbízhatósági szint az elérhető adatok mennyisége és a múltbeli eredmények konzisztenciája alapján kerül kiszámításra.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
})

PredictionsView.displayName = "PredictionsView"
