import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Subheading } from "@/components/subheading";

export const metadata = {
  title: "Privacy Policy — earlyroom",
  description: "Privacy Policy for earlyroom by Albor Digital LLC.",
};

export default function PrivacyPage() {
  return (
    <Container className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl">
        <Heading as="h1">Privacy Policy</Heading>
        <Subheading className="mt-4">
          Albor Digital LLC · Effective Date: January 1, 2026 · Last Updated: January 1, 2026
        </Subheading>

        <div className="mt-12 flex flex-col gap-10">

          <LegalSection title="1. Introduction">
            Albor Digital LLC respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use any product or digital property operated by Albor Digital. By using our products, you consent to the practices described in this policy.
          </LegalSection>

          <LegalSection title="2. Information We Collect">
            Information you provide directly: Name, email address, payment information, and any other data you submit when creating an account, subscribing, or contacting us. Usage data: Pages visited, features used, time spent, device type, browser type, IP address, and referring URLs. Cookies and tracking data: See our Cookie Notice for full details. AI interaction data: Where applicable, prompts or inputs you provide to AI-powered features within our products may be used to improve product functionality.
          </LegalSection>

          <LegalSection title="3. How We Use Your Information">
            We use collected information to: (a) provide, operate, and maintain our products; (b) process payments and manage subscriptions; (c) respond to inquiries and support requests; (d) send transactional communications; (e) improve and develop our products; (f) detect and prevent fraud or misuse; and (g) comply with legal obligations. We do not sell your personal information to third parties. We do not use your data for targeted advertising on behalf of third parties.
          </LegalSection>

          <LegalSection title="4. Legal Basis for Processing (GDPR)">
            If you are located in the European Economic Area, our legal bases for processing your personal data include: performance of a contract (to provide our services), compliance with legal obligations, our legitimate interests in operating and improving our products, and — where required — your consent.
          </LegalSection>

          <LegalSection title="5. Sharing of Information">
            We may share your information with: (a) service providers who assist in operating our products under confidentiality agreements; (b) law enforcement or regulatory bodies when required by law; and (c) a successor entity in the event of a merger, acquisition, or sale of assets.
          </LegalSection>

          <LegalSection title="6. Data Retention">
            We retain personal data for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Account data is retained for the duration of your account and for a reasonable period thereafter. You may request deletion of your data at any time.
          </LegalSection>

          <LegalSection title="7. Your Rights">
            Depending on your jurisdiction, you may have the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data; object to or restrict our processing; withdraw consent at any time; and receive your data in a portable format. To exercise any of these rights, contact us at contact@albor.digital. We will respond within 30 days.
          </LegalSection>

          <LegalSection title="8. Children's Privacy">
            Our products are not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such data, we will delete it promptly.
          </LegalSection>

          <LegalSection title="9. Data Security">
            We implement reasonable administrative, technical, and physical safeguards to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
          </LegalSection>

          <LegalSection title="10. International Transfers">
            Your information may be transferred to and processed in countries other than your own, including the United States and Canada. We take steps to ensure that appropriate safeguards are in place for such transfers in compliance with applicable law.
          </LegalSection>

          <LegalSection title="11. Third-Party Links">
            Our products may contain links to third-party websites or services. We are not responsible for the privacy practices of those third parties and encourage you to review their privacy policies.
          </LegalSection>

          <LegalSection title="12. Changes to This Policy">
            We may update this Privacy Policy periodically. Changes will be posted with a revised effective date. Continued use of our products after changes constitutes acceptance of the updated policy.
          </LegalSection>

          <LegalSection title="13. Contact">
            For privacy-related questions or requests: contact@albor.digital
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
