
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function PredictionPatterns() {
  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">Sikeres Predikciós Minták</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="bg-black/30 mb-4">
              <TabsTrigger value="all">Összes Minta</TabsTrigger>
              <TabsTrigger value="both-score">Mindkét gól</TabsTrigger>
              <TabsTrigger value="draw">Döntetlen</TabsTrigger>
              <TabsTrigger value="reversal">Fordítás</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="space-y-4">
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-white">West Ham vs Nottingham</div>
                      <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300 mt-1">
                        Mindkét csapat gólt szerez
                      </Badge>
                    </div>
                    <div className="bg-green-900/30 px-2 py-1 rounded text-green-400 text-sm">
                      Sikeres
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    <p>Az elmúlt 5 meccsből 4 alkalommal mindkét csapat gólt szerzett.</p>
                    <div className="mt-1 flex justify-between">
                      <span>Végeredmény: <span className="text-white">3-4</span></span>
                      <span>Szorzó: <span className="text-amber-400">2.2×</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-white">Aston Oroszlán vs Manchester Kék</div>
                      <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300 mt-1">
                        Mindkét csapat gólt szerez
                      </Badge>
                    </div>
                    <div className="bg-green-900/30 px-2 py-1 rounded text-green-400 text-sm">
                      Sikeres
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    <p>Az elmúlt 5 meccsből 5 alkalommal mindkét csapat gólt szerzett.</p>
                    <div className="mt-1 flex justify-between">
                      <span>Végeredmény: <span className="text-white">1-1</span></span>
                      <span>Szorzó: <span className="text-amber-400">1.9×</span></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-medium text-white">Newcastle vs London Ágyúk</div>
                      <Badge variant="outline" className="bg-purple-500/20 border-purple-500/30 text-purple-300 mt-1">
                        Döntetlen
                      </Badge>
                    </div>
                    <div className="bg-green-900/30 px-2 py-1 rounded text-green-400 text-sm">
                      Sikeres
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    <p>Newcastle otthoni meccsein gyakori a döntetlen eredmény.</p>
                    <div className="mt-1 flex justify-between">
                      <span>Végeredmény: <span className="text-white">2-2</span></span>
                      <span>Szorzó: <span className="text-amber-400">4.1×</span></span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="both-score">
              <div className="text-center py-12 text-gray-400">
                Válassz ki egy mintát a részletes előzmények megtekintéséhez.
              </div>
            </TabsContent>
            
            <TabsContent value="draw">
              <div className="text-center py-12 text-gray-400">
                Válassz ki egy mintát a részletes előzmények megtekintéséhez.
              </div>
            </TabsContent>
            
            <TabsContent value="reversal">
              <div className="text-center py-12 text-gray-400">
                Válassz ki egy mintát a részletes előzmények megtekintéséhez.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-black/20 border-white/5">
        <CardHeader>
          <CardTitle className="text-white">Magas Szorzós Lehetőségek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-black/30 rounded-lg border-l-4 border-amber-500 border-t border-r border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-amber-500/20 border-amber-500/30 text-amber-300">
                Félidő/Végeredmény Fordítás
              </Badge>
              <span className="text-white text-sm">20-50× szorzó</span>
            </div>
            <p className="text-sm text-gray-400">
              A félidő/végeredmény (HT/FT) fogadások, különösen a fordítások esetén, kiemelkedően magas szorzókkal jelennek meg.
              Például: félidőben vezet a hazai csapat, de a vendég nyer a végén.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
