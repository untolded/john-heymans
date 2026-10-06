import { content } from "@/lib/content";
import { StageLoop } from "./StageLoop";

const p = content.story.practical;
const ROOMS = ["small", "large"] as const;

/**
 * Where it works: two stages side by side, the small room narrower than the
 * full house, each with the bookings that belong to it. Both are real
 * footage: a leadership lunch for the small room, the keynote film's main
 * stage at Supernova for the full house.
 */
export function Stages() {
  return (
    <div className="venues">
      {ROOMS.map((room) => {
        const stage = p.stages[room];
        return (
          <figure className={`venue venue-${room}`} key={room}>
            <div className="venue-media">
              <StageLoop name={room === "small" ? "small-room" : "full-house"} sizes={room === "small" ? "(min-width: 992px) 40vw, 100vw" : "(min-width: 992px) 56vw, 100vw"} />
              <span className="venue-note">{stage.note}</span>
            </div>
            <figcaption className="venue-cap">
              <h4 className="venue-title" data-reveal="rise">
                {stage.title}
              </h4>
              <ul className="venue-rooms">
                {p.scale
                  .filter((s) => s.room === room)
                  .map((s) => (
                    <li key={s.title} data-reveal="fade">
                      <span className="sm-size">{s.size}</span>
                      <span className="sm-title">{s.title}</span>
                    </li>
                  ))}
              </ul>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
