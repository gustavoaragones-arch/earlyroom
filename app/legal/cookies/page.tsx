import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";

export const metadata = {
  title: "Cookie Notice — earlyroom",
  description: "Cookie Notice for earlyroom by Albor Digital LLC.",
};

export default function CookiesPage() {
  return (
    <Container className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl">
        <Heading as="h1">Cookie Notice</Heading>
        <Subheading className="mt-4">
          Albor Digital LLC · Effective Date: January 1, 2026
        </Subheading>

        <div className="mt-12 flex flex-col gap-10">

          <LegalSection title="1. What Are Cookies">
            Cookies are small text files stored on your device when you visit a website. They help websites function properly, remember your preferences, and provide analytical information to operators. Similar technologies — such as local storage, session storage, and tracking pixels — may also be used.
          </LegalSection>

          <LegalSection title="2. How We Use Cookies">
            Albor Digital LLC uses cookies and similar technologies to: (a) ensure our products function correctly (strictly necessary cookies); (b) remember your preferences and settings; (c) analyze how users interact with our products so we can improve them; and (d) support advertising on ad-supported products.
          </LegalSection>

          <LegalSection title="3. Types of Cookies We Use">
            Strictly Necessary: Core product functionality, session management, security. Duration: Session. Functional: User preferences, language settings, saved states. Duration: Up to 1 year. Analytics: Aggregate usage data via tools such as Google Analytics or similar. Data is anonymized where possible. Duration: Up to 2 years. Advertising: Used in ad-supported products to serve relevant ads and measure performance. Duration: Up to 2 years.
          </LegalSection>

          <LegalSection title="4. Third-Party Cookies">
            Some cookies on our products are placed by third-party services, including analytics providers, payment processors, and advertising networks. These third parties have their own cookie policies and we encourage you to review them. Examples may include Google Analytics, Stripe, and similar services.
          </LegalSection>

          <LegalSection title="5. Your Choices">
            You can control and manage cookies in several ways: (a) through your browser settings, where you can block or delete cookies; (b) through opt-out mechanisms provided by third-party services; and (c) through any cookie preference panel we provide within our products. Please note that disabling strictly necessary cookies may affect the functionality of our products.
          </LegalSection>

          <LegalSection title="6. Do Not Track">
            Some browsers include a "Do Not Track" (DNT) feature. Our products do not currently respond to DNT signals, as there is no industry-standard approach. We continue to monitor developments in this area.
          </LegalSection>

          <LegalSection title="7. Updates to This Notice">
            We may update this Cookie Notice as our products evolve or regulations change. Updates will be posted with a revised effective date.
          </LegalSection>

          <LegalSection title="8. Contact">
            For questions about our use of cookies: contact@albor.digital
          </LegalSection>

        </div>
      </div>
    </Container>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-neutral-900 dark:text-white">{title}</h2>
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{children}</p>
    </div>
  );
}
