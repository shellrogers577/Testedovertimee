import "./VerseMarquee.css";

const verse = "“Blessed is the one who perseveres under trial”";

function VerseGroup({ hidden = false }) {
  return (
    <div className="verse-group" aria-hidden={hidden}>
      <span>{verse}</span>
      <span className="verse-reference">— James 1:12</span>
      <span>{verse}</span>
      <span className="verse-reference">— James 1:12</span>
    </div>
  );
}

export default function VerseMarquee() {
  return (
    <section className="verse-strip" aria-label="Scripture: James 1:12">
      <div className="verse-track">
        <VerseGroup />
        <VerseGroup hidden />
      </div>
    </section>
  );
}
