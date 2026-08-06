import TimerDisplay from "@/components/TimerDisplay";
import { Ground } from "@/db/schema";

export default function ScoreboardSobre({
  ground,
}: {
  ground: Ground;
}) {
  return (
    <div className="max-w-[767px] p-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-[250px] text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">
              {ground.teamA}
            </div>
            <div className="text-7xl font-bold text-gray-900 tracking-tight">
              {ground.teamAScore}
            </div>
          </div>
          <div className="w-[150px] text-center">
            <TimerDisplay ground={ground} withTimerDisplay />
          </div>
          <div className="w-[250px] text-center">
            <div className="text-lg font-semibold text-gray-700 mb-2">
              {ground.teamB}
            </div>
            <div className="text-7xl font-bold text-gray-900 tracking-tight">
              {ground.teamBScore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
