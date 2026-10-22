import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Prose } from "@/components/layout/Prose";
import { LegalReviewNotice } from "@/components/layout/LegalReviewNotice";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects and uses personal information submitted through this website.`,
  alternates: { canonical: "/privacy" },
};

const TBC = <strong>[To be confirmed]</strong>;

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" intro={<p>Last updated: {TBC}</p>} />
      <div className="bg-white py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <LegalReviewNotice />
          <Prose>
            <p>
              This policy explains how {site.name} (“we”, “us”) collects, uses and protects personal
              information when you visit this website or contact us through it.
            </p>

            <h2>Who we are</h2>
            <p>
              {site.name} is a performance marketing business. Registered legal entity name, address
              and contact details: {TBC}
              {site.contact.email ? <> You can reach us at <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>.</> : null}
            </p>

            <h2>Information we collect</h2>
            <p>When you submit our enquiry form, we collect the details you provide:</p>
            <ul>
              <li>Full name, business email address and company name</li>
              <li>Company website (optional)</li>
              <li>Industry, target market, approximate monthly advertising budget and main marketing challenge</li>
              <li>Any message you choose to include</li>
              <li>Your consent confirmation and the date and time of submission</li>
            </ul>
            <p>
              Our hosting provider may also process technical information such as IP addresses and
              request logs for security and reliability. This website does not currently use
              advertising or analytics cookies. If that changes, we will update this policy and
              request consent where required.
            </p>

            <h2>How we use your information</h2>
            <ul>
              <li>To respond to your enquiry and arrange a conversation</li>
              <li>To assess whether and how we may be able to help your business</li>
              <li>To keep a record of our communication with you</li>
              <li>To protect this website against spam and abuse</li>
            </ul>
            <p>We do not sell your personal information, and we do not use enquiry details for unrelated marketing without your permission.</p>

            <h2>Legal basis</h2>
            <p>
              We process enquiry information on the basis of your consent, given when you submit the
              form, and, where applicable, our legitimate interest in responding to business
              enquiries. Applicable legal bases by jurisdiction: {TBC}
            </p>

            <h2>Service providers</h2>
            <p>
              We use trusted providers to operate this website and handle enquiries, such as website
              hosting, email delivery and customer relationship management (CRM) tools. These
              providers process data on our behalf. List of providers and where data is stored: {TBC}
            </p>

            <h2>Retention</h2>
            <p>
              We keep enquiry information only as long as needed to respond to you and maintain
              reasonable business records. Retention period: {TBC}
            </p>

            <h2>Your rights</h2>
            <p>
              Depending on where you live, you may have the right to access, correct or delete your
              personal information, to withdraw consent, and to raise a concern with a regulator. To
              make a request, contact us using the details above. Grievance officer / contact
              person: {TBC}
            </p>

            <h2>Security</h2>
            <p>
              We use reasonable technical and organizational measures to protect personal information.
              No method of transmission or storage is completely secure, so please avoid sending
              sensitive information through the enquiry form.
            </p>

            <h2>Children</h2>
            <p>This website is intended for businesses and is not directed at children.</p>

            <h2>Changes to this policy</h2>
            <p>We may update this policy from time to time. The “last updated” date above shows when it was last changed.</p>

            <p>
              See also our <Link href="/terms">Terms of Service</Link>.
            </p>
          </Prose>
        </div>
      </div>
    </>
  );
}
