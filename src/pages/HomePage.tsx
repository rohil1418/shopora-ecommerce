import { HeroBanner, heroPrimary } from "../features/home";

export default function HomePage() {
  return (
    <main>
      <HeroBanner {...heroPrimary} />
    </main>
  );
}