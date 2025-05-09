
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPrediction } from "@/services/api"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { HeadToHeadStats, TeamAnalysis } from "@/types/api"

interface MatchHistoryStatsProps {
  homeTeam: string
  awayTeam: string
}

export const MatchHistoryStats = ({ homeTeam, awayTeam }: MatchHistoryStatsProps) => {
  const [loading, setLoading] = useState(true)
  const [teamAnalysis, setTeamAnalysis] = useState<TeamAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadHistoryData() {
      if (!homeTeam || !awayTeam) return
      
      try {
        setLoading(true)
        const response = await getPrediction(homeTeam, awayTeam)
        setTeamAnalysis(response.team_analysis || null)
        setLoading(false)
      } catch (err) {
        setError("Nem sikerült betölteni az egymás elleni statisztikákat")
        setLoading(false)
      }
    }

    loadHistoryData()
  }, [homeTeam, awayTeam])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[150px]" />
          <Skeleton className="h-[150px]" />
        </div>
      </div>
    )
  }

  if (error || !teamAnalysis) {
    return (
      <div className="p-6 text-center bg-black/30 rounded-lg border border-white/10">
        <p className="text-gray-400">{error || "Nincs elérhető egymás elleni statisztika"}</p>
      </div>
    )
  }

  const { head_to_head_stats, both_teams_scored_percentage, average_goals, home_form_index, away_form_index } = teamAnalysis
  
  // Format data for the pie chart
  const pieChartData = [
    { name: 'Hazai győzelmek', value: head_to_head_stats.home_win_percentage },
    { name: 'Döntetlenek', value: head_to_head_stats.draw_percentage },
    { name: 'Vendég győzelmek', value: head_to_head_stats.away_win_percentage },
  ]
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];
  
  // Format data for the goals bar chart
  const goalsData = [
    { name: 'Hazai gólok', value: average_goals.average_home_goals },
    { name: 'Vendég gólok', value: average_goals.average_away_goals },
    { name: 'Összes gól', value: average_goals.average_total_goals },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-lg">Egymás elleni múlt: {homeTeam} vs {awayTeam}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">{head_to_head_stats.home_wins}</div>
              <div className="text-sm text-gray-400">{homeTeam} győzelem</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{head_to_head_stats.draws}</div>
              <div className="text-sm text-gray-400">Döntetlen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{head_to_head_stats.away_wins}</div>
              <div className="text-sm text-gray-400">{awayTeam} győzelem</div>
            </div>
          </div>
          
          <div className="h-[200px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Csapatok formája</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{homeTeam}</span>
                  <span className="text-blue-400">{home_form_index}%</span>
                </div>
                <Progress value={home_form_index} className="h-2 bg-gray-700" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{awayTeam}</span>
                  <span className="text-amber-400">{away_form_index}%</span>
                </div>
                <Progress value={away_form_index} className="h-2 bg-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border-white/5">
          <CardHeader>
            <CardTitle className="text-lg">Gólok statisztikája</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-2">
              <div className="text-2xl font-bold text-green-400">{both_teams_scored_percentage}%</div>
              <div className="text-sm text-gray-400">Mindkét csapat gólt szerzett</div>
            </div>
            
            <div className="h-[150px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }} />
                  <Bar dataKey="value" fill="#3b82f6" name="Gólok" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
