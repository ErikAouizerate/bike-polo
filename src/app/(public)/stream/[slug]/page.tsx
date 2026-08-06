import { getGround } from "@/db/repositories/ground";
import Relaoad from "./Reload";
import FullScreen from "./FullScreen";
import ScoreboardNeon from "@/components/scoreboard/ScoreboardNeon";
import ScoreboardSobre from "@/components/scoreboard/ScoreboardSobre";
import ScoreboardTV from "@/components/scoreboard/ScoreboardTV";
import { Ground, Tournament } from "@/db/schema";

type GroundWithTournament = Ground & { tournament: Tournament };

export default async function Stream({
  params,
}: {
  params: Promise<{ slug: number }>;
}) {
  const { slug } = await params;

  const ground = (await getGround(slug)) as GroundWithTournament | undefined;

  if (!ground || !ground.isStreaming) {
    return (
      <FullScreen>
        <Relaoad />
      </FullScreen>
    );
  }

  const streamStyle = ground.tournament.streamStyle;

  return (
    <FullScreen>
      <div className="flex items-center justify-center w-screen h-screen">
        {streamStyle === "neon" && <ScoreboardNeon ground={ground} />}
        {streamStyle === "sobre" && <ScoreboardSobre ground={ground} />}
        {streamStyle === "tv" && <ScoreboardTV ground={ground} />}
      </div>
      <Relaoad />
    </FullScreen>
  );
}
