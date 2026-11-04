import teamData from "./team.json";

export type TeamMember = {
  initials: string;
  name: string;
  role: string;
  bio: string;
};

// v0: the payload is fixed JSON, not a fetch — but the shape (async, same
// return type an endpoint would give) is the seam. Swapping in the real API
// call later only touches this function's body, not its callers.
export async function getTeam(): Promise<TeamMember[]> {
  return teamData;
}
