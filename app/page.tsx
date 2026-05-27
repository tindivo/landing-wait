import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/sections/HeroSection";
import { IdentitySection } from "@/components/sections/IdentitySection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { RestaurantsSection } from "@/components/sections/RestaurantsSection";
import { TrackingSection } from "@/components/sections/TrackingSection";
import { PaymentsSection } from "@/components/sections/PaymentsSection";
import { RewardsSection } from "@/components/sections/RewardsSection";
import { ConnectedSection } from "@/components/sections/ConnectedSection";
import { ClosingSection } from "@/components/sections/ClosingSection";

export default function Home() {
  return (
    <PageShell>
      <main id="main" className="snap-y snap-mandatory">
        <HeroSection />
        <IdentitySection />
        <ProblemSection />
        <RestaurantsSection />
        <TrackingSection />
        <PaymentsSection />
        <RewardsSection />
        <ConnectedSection />
        <ClosingSection />
      </main>
    </PageShell>
  );
}
