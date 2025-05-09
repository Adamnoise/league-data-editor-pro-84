
import { memo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Match } from "@/types"

interface MatchesTableViewProps {
  matches: Match[]
  onRequestSort: (key: string) => void
  getSortIcon: (key: string) => JSX.Element
  onMatchClick?: (match: Match) => void
}

export const MatchesTableView = memo(({ matches, onRequestSort, getSortIcon, onMatchClick }: MatchesTableViewProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No matches available to display</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-black/40">
          <TableRow className="border-b border-white/5 hover:bg-transparent">
            <TableHead 
              onClick={() => onRequestSort("date")}
              className="text-gray-400 font-normal cursor-pointer hover:text-white w-32"
            >
              <div className="flex items-center">
                Date {getSortIcon("date")}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => onRequestSort("round")}
              className="text-gray-400 font-normal cursor-pointer hover:text-white w-24"
            >
              <div className="flex items-center">
                Round {getSortIcon("round")}
              </div>
            </TableHead>
            <TableHead 
              onClick={() => onRequestSort("home_team")}
              className="text-gray-400 font-normal cursor-pointer hover:text-white"
            >
              <div className="flex items-center">
                Home Team {getSortIcon("home_team")}
              </div>
            </TableHead>
            <TableHead className="text-gray-400 font-normal w-24 text-center">
              Score
            </TableHead>
            <TableHead 
              onClick={() => onRequestSort("away_team")}
              className="text-gray-400 font-normal cursor-pointer hover:text-white"
            >
              <div className="flex items-center">
                Away Team {getSortIcon("away_team")}
              </div>
            </TableHead>
            <TableHead className="text-gray-400 font-normal w-24">
              HT Score
            </TableHead>
            <TableHead className="text-gray-400 font-normal text-right w-24">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match, index) => (
            <TableRow key={`${match.home_team}-${match.away_team}-${index}`} className="border-b border-white/5 hover:bg-white/5">
              <TableCell className="font-medium text-sm">
                {match.date}
              </TableCell>
              <TableCell>
                {match.round}
              </TableCell>
              <TableCell>
                {match.home_team}
              </TableCell>
              <TableCell className="font-bold text-center">
                {match.home_score} - {match.away_score}
              </TableCell>
              <TableCell>
                {match.away_team}
              </TableCell>
              <TableCell className="text-gray-400 text-sm">
                {`${match.ht_home_score} - ${match.ht_away_score}`}
              </TableCell>
              <TableCell className="text-right">
                <button 
                  className="text-blue-400 hover:text-blue-300 text-sm"
                  onClick={() => onMatchClick && onMatchClick(match)}  // Added click handler that uses the new prop
                >
                  Details
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
})

MatchesTableView.displayName = "MatchesTableView"
