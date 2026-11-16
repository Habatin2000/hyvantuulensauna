import Image from 'next/image';
import type { VibeCommunity as VibeCommunityData } from './pages';

export default function VibeCommunity({ data }: { data: VibeCommunityData }) {
  return (
    <section className="vibe-community" aria-labelledby="vibe-community-title">
      <div className="vibe-community-image">
        <Image src={data.image} alt={data.imageAlt} fill sizes="(max-width: 760px) 100vw, 45vw" />
      </div>
      <div className="vibe-community-copy">
        <p className="vibe-eyebrow">{data.eyebrow}</p>
        <h2 id="vibe-community-title">{data.title}</h2>
        <p>{data.text}</p>
        <div className="vibe-crew-list">
          {data.people.map((person) => (
            <article key={person.name}>
              <h3>{person.name}<span>{person.role}</span></h3>
              <p>{person.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
