
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ReversalPredictionProps {
  homeTeam: string
  awayTeam: string
}

export function ReversalPrediction({ homeTeam, awayTeam }: ReversalPredictionProps) {
  return (
    <Card className="bg-black/20 border-white/5">
      <CardHeader>
        <CardTitle>Félidő/Végeredmény Fordítás Elemzés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-black/30 rounded-lg">
            <div className="flex justify-between mb-2">
              <div>
                <span className="text-white font-medium">{homeTeam} → {awayTeam}</span>
                <div className="text-sm text-gray-400 mt-1">
                  Hazai vezetésből vendég győzelem
                </div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/20">
                28.5×
              </Badge>
            </div>
            <div className="mt-3 text-sm text-gray-400">
              <p>Az elmúlt 10 mérkőzésből 1 alkalommal fordult elő, hogy a félidei hazai vezetés vendég győzelemmel zárult.</p>
            </div>
          </div>
          
          <div className="p-4 bg-black/30 rounded-lg">
            <div className="flex justify-between mb-2">
              <div>
                <span className="text-white font-medium">{awayTeam} → {homeTeam}</span>
                <div className="text-sm text-gray-400 mt-1">
                  Vendég vezetésből hazai győzelem
                </div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/20">
                22.0×
              </Badge>
            </div>
            <div className="mt-3 text-sm text-gray-400">
              <p>Az elmúlt 10 mérkőzésből 2 alkalommal fordult elő, hogy a félidei vendég vezetés hazai győzelemmel zárult.</p>
            </div>
          </div>
          
          <div className="p-4 bg-black/30 rounded-lg">
            <div className="flex justify-between mb-2">
              <div>
                <span className="text-white font-medium">X → {homeTeam}</span>
                <div className="text-sm text-gray-400 mt-1">
                  Döntetlen félidő, hazai győzelem
                </div>
              </div>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/20">
                4.5×
              </Badge>
            </div>
            <div className="mt-3 text-sm text-gray-400">
              <p>Az elmúlt 10 mérkőzésből 3 alkalommal fordult elő, hogy a félidei döntetlen hazai győzelemmel zárult.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
