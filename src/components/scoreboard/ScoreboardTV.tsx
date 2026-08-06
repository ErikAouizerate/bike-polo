import TimerDisplay from "@/components/TimerDisplay";
import { Ground } from "@/db/schema";

export default function ScoreboardTV({
  ground,
}: {
  ground: Ground;
}) {
  return (
    <div className="max-w-[900px] w-full px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 w-full">
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
            <div className="text-2xl font-bold text-blue-100 uppercase tracking-wider mb-4">
              {ground.teamA || "Team A"}
            </div>
            <div className="text-8xl font-bold text-white leading-none tracking-tight drop-shadow-lg">
              {ground.teamAScore}
            </div>
          </div>
          <div className="flex items-center justify-center min-w-[140px]">
            <div className="bg-gray-800/90 rounded-xl px-6 py-3 shadow-lg backdrop-blur text-white">
              <TimerDisplay ground={ground} withTimerDisplay />
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
            <div className="text-2xl font-bold text-red-100 uppercase tracking-wider mb-4">
              {ground.teamB || "Team B"}
            </div>
            <div className="text-8xl font-bold text-white leading-none tracking-tight drop-shadow-lg">
              {ground.teamBScore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
