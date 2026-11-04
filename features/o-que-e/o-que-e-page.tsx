// The carousel's first item links here (AC 4) — a page that goes deeper on
// what the Copero is. Copy is a DRAFT per _docs/guia-voz.md (author's HITL).
import { AdSenseSlot } from "../../shared/adsense";
import { Logo } from "../../shared/logo";

export function OQueEPage() {
  return (
    <main className="page" data-testid="o-que-e">
      <header className="page-header page-header--centered">
        <Logo size="md" />
      </header>
      <div className="stripe-divider" />
      <div className="hero-card">
        <span className="kicker">About Copero</span>
        <h1>Copero Analysis</h1>
        <p>Coming soon to your pocket: the Team PA analysis you have been missing.</p>
      </div>
      <div className="page-section the-story">
        <p>
          <strong>Copero Analysis</strong> is a Team PA analysis app:
          real data and tactical insight on the inside; on the outside, told
          in the easygoing language of the stands. No
          clickbait or pundit guesses.
        </p>
        <p>
          Every analysis follows sound technical criteria: attacking transitions,
          defensive transitions, movement on and off the ball,
          set pieces, combination play, and pressure on the ball carrier.
          That work stays behind the scenes; the jargon never makes it into the copy.
          What you get is a clear explanation of the match, like the open space left
          out wide or the pace of young players on the wings.
        </p>
      </div>
      <div className="callout">
        <span className="kicker">The idea</span>
        <h2>Every Team PA match deserves analysis to match.</h2>
        <p>And it should fit in a fan’s pocket.</p>
      </div>
      <div className="page-section the-features">
        <h2>Analysis formats</h2>
        <ul className="feature-list">
          <li>
            <h3>Match Preview</h3>
            <p>
              1–2 days before the match: how the opponent usually plays and the
              two key areas likely to decide the match.
            </p>
          </li>
          <li>
            <h3>Copero Matchday</h3>
            <p>
              On match day: the confirmed lineup, a halftime recap of
              the first half, and a lively post-match recap.
            </p>
          </li>
        </ul>
      </div>
      <AdSenseSlot />
    </main>
  );
}
