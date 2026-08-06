import GroundCard from "@/components/GroundCard";
import GroundCardCreation from "@/components/GroundCardCreation";
import LabelEditor from "@/components/LabelEditor";
import {
  getTournamentsWithGrounds,
  updateTournament,
} from "@/db/repositories/tournament";
import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth-client";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { routes } from "@/routes";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const headersData = await headers();
  const session = await auth.api.getSession({
    headers: headersData,
  });

  if (!session?.user.id) {
    await signOut();
    redirect("/");
  }

  const tournamentsWithGrounds = await getTournamentsWithGrounds(
    session.user.id
  );

  const baseUrl = await getBaseUrl();

  return (
    <div className="">
      {tournamentsWithGrounds.map((tournament) => (
        <div key={tournament.id} className="  m-4 ">
          <LabelEditor
            value={tournament.name}
            onValidate={async (name) => {
              "use server";
              await updateTournament(tournament.id, { name });
            }}
          >
            <h2 className="text-2xl font-bold">{tournament.name}</h2>
          </LabelEditor>
          <ul className="flex items-stretch flex-wrap  gap-4">
            {tournament.grounds.map((ground) => (
              <li key={ground.id} className="p-2 m-2">
                <GroundCard
                  ground={ground}
                  url={`${baseUrl}${routes.stream}/${ground.slug}`}
                />
              </li>
            ))}
            <li key={"newGround"} className="p-2 m-2 ">
              <GroundCardCreation tournamentId={tournament.id} />
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}
