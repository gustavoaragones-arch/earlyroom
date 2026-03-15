import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";

export const metadata = {
  title: "Terms of Service — earlyroom",
  description: "Terms of Service for earlyroom by Albor Digital LLC.",
};

export default function TermsPage() {
  return (
    <Container className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl">
        <Heading as="h1">Terms of Service</Heading>
        <Subheading className="mt-4">
          Albor Digital LLC · Effective Date: January 1, 2026 · Last Updated: January 1, 2026
        </Subheading>

        <div className="mt-12 flex flex-col gap-10">

          <LegalSection title="1. Acceptance of Terms">
            By accessing or using any website, web application, mobile application, or digital tool owned and operated by Albor Digital LLC ("Albor Digital," "we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use our products or services. These Terms apply to all products and digital properties operated under the Albor Digital brand, including but not limited to any tools, platforms, or applications available at albor.digital and its subdomains.
          </LegalSection>

          <LegalSection title="2. Who We Are">
            Albor Digital LLC is an independent digital product studio registered in the State of Wyoming, United States. We design, build, and operate our own digital products and tools. We do not provide client services, consulting, or custom software development for third parties.
          </LegalSection>

          <LegalSection title="3. Products and Services">
            Our products may include utility web applications, mobile applications, SaaS platforms, ad-supported tools, and AI-assisted services. Each product may have its own supplemental terms or conditions, which will be presented at the point of use and are incorporated into these Terms by reference. We reserve the right to modify, suspend, or discontinue any product or feature at any time without prior notice.
          </LegalSection>

          <LegalSection title="4. User Eligibility">
            You must be at least 13 years of age to use our products. If you are under 18, you represent that you have obtained parental or guardian consent. By using our services, you represent and warrant that you meet these eligibility requirements.
          </LegalSection>

          <LegalSection title="5. User Accounts">
            Some of our products may require you to create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to notify us immediately at contact@albor.digital of any unauthorized use of your account. We reserve the right to terminate or suspend accounts at our sole discretion, including for violation of these Terms.
          </LegalSection>

          <LegalSection title="6. Acceptable Use">
            You agree not to use our products to: (a) violate any applicable law or regulation; (b) infringe on the intellectual property rights of Albor Digital or any third party; (c) transmit harmful, abusive, or offensive content; (d) attempt to gain unauthorized access to our systems or other users' accounts; (e) scrape, harvest, or extract data from our products without written permission; (f) use our products for any commercial purpose without our prior written consent; or (g) interfere with the operation or integrity of our platforms.
          </LegalSection>

          <LegalSection title="7. Intellectual Property">
            All content, design, code, data, and materials within our products are the exclusive property of Albor Digital LLC or its licensors and are protected by applicable intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use our products for personal, non-commercial purposes in accordance with these Terms.
          </LegalSection>

          <LegalSection title="8. User-Generated Content">
            Where our products allow you to submit, post, or share content, you grant Albor Digital LLC a non-exclusive, worldwide, royalty-free license to use, reproduce, and display that content solely for the purpose of providing and improving the relevant product. You retain ownership of your content and are solely responsible for it.
          </LegalSection>

          <LegalSection title="9. Subscriptions and Payments">
            Certain products are offered on a subscription basis. By subscribing, you authorize us to charge your chosen payment method on a recurring basis at the rate disclosed at checkout. Subscriptions auto-renew unless cancelled before the renewal date. All fees are stated in US dollars and are non-refundable except where required by applicable law. We reserve the right to change pricing with reasonable notice.
          </LegalSection>

          <LegalSection title="10. Third-Party Services">
            Our products may integrate with or link to third-party services such as payment processors, analytics providers, or AI platforms. These third parties have their own terms and privacy policies. Albor Digital LLC is not responsible for the practices or content of any third-party service.
          </LegalSection>

          <LegalSection title="11. Disclaimer of Warranties">
            OUR PRODUCTS ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT OUR PRODUCTS WILL BE ERROR-FREE, UNINTERRUPTED, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </LegalSection>

          <LegalSection title="12. Limitation of Liability">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ALBOR DIGITAL LLC AND ITS OWNER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF OUR PRODUCTS. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM OR (B) USD $50.
          </LegalSection>

          <LegalSection title="13. Indemnification">
            You agree to indemnify, defend, and hold harmless Albor Digital LLC and its owner from any claims, damages, liabilities, costs, or expenses (including reasonable legal fees) arising from your use of our products, your violation of these Terms, or your violation of any third-party rights.
          </LegalSection>

          <LegalSection title="14. Governing Law and Disputes">
            These Terms are governed by the laws of the State of Wyoming, United States, without regard to its conflict of law provisions. Any dispute arising from these Terms shall first be addressed through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association.
          </LegalSection>

          <LegalSection title="15. Changes to These Terms">
            We reserve the right to update these Terms at any time. Changes will be posted on this page with a revised effective date. Your continued use of our products after any changes constitutes your acceptance of the revised Terms.
          </LegalSection>

          <LegalSection title="16. Contact">
            For questions about these Terms, contact us at: contact@albor.digital
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
