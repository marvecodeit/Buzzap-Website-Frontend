import HomePage from "./home/page";
import InfraBar from "./infra-bar/InfraBar";
import Problem from "./problem/Problem";
import SolutionCta from "./solution-cta/SolutionCta";
import Services from "./services/page";
import Industries from "./industries/Industries";
import Experience from "./experience/page";
import CaseStudies from "./case-studies/CaseStudies";
import BrandShowcase from "./brand-showcase/BrandShowcase";
import Pricing from "./pricing/page";
import Insights from "./insights/Insights";
import FinalCta from "./final-cta/FinalCta";

export default function Home() {
  return (
    <main>
      {/* 1. Hero */}
      <HomePage />

      {/* 2. Built on world-class AI infrastructure (logo ticker) */}
      <InfraBar />

      {/* 3. Problem — three pain points */}
      <Problem />

      {/* 4. Solution — glowy button to 3-layer system */}
      <SolutionCta />

      {/* 5. Services overview */}
      <Services isHomepage />

      {/* 6. Industries we serve (ticker) */}
      <Industries />

      {/* 7. Performance metrics / Why Buzzap */}
      <Experience />

      {/* 8. Case Studies */}
      <CaseStudies />

      {/* 9. Brand showcase slideshow */}
      <BrandShowcase />

      {/* 10. Pricing + FAQ */}
      <Pricing />

      {/* 11. Insights / Blog */}
      <Insights />

      {/* 12. Final CTA banner with booking */}
      <FinalCta />
    </main>
  );
}
