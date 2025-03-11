import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";
import { redirect } from "next/navigation";
import { isSignedIn } from "@/authActions";

export default async function Home() {
  if (await isSignedIn()) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  );
}
