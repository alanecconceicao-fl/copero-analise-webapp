import { expect, test } from "vitest";
import { getTeam } from "./team-repository";

test("resolves at least one team member with a full profile", async () => {
  const team = await getTeam();

  expect(team.length).toBeGreaterThan(0);
  for (const member of team) {
    expect(member.initials).toBeTruthy();
    expect(member.name).toBeTruthy();
    expect(member.role).toBeTruthy();
    expect(member.bio).toBeTruthy();
  }
});
