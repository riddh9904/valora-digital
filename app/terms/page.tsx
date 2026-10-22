import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Prose } from "@/components/layout/Prose";
import { LegalReviewNotice } from "@/components/layout/LegalReviewNotice";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms governing use of the ${site.name} website.`,
  alternates: { canonical: "/terms" },
};

const TBC = <strong>[To be confirmed]</strong>;

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" intro={<p>Last updated: {TBC}</p>} />
      <div className="bg-white py-16 sm:py-20">
        <div className="container-site max-w-3xl">
          <LegalReviewNotice />
          <Prose>
            <p>
              These terms govern your use of the {site.name} website. By using the website you agree
              to them. Any services we provide will be governed by a separate written agreement.
            </p>

            <h2>Information on this website</h2>
            <p>
              Content on this website is provided for general information. It is not professional,
              legal or financial advice, and it should not be relied on as a guarantee of any
              particular marketing result.
            </p>

            <h2>Illustrative data and examples</h2>
            <p>
              Dashboards, charts, figures and scenarios shown on this website are illustrative and
              use synthetic sample data unless explicitly labelled as verified. They do not represent
              actual client results or historical performance of {site.name}.
            </p>

            <h2>Intellectual property</h2>
            <p>
              The website design, text, graphics and code are owned by or licensed to {site.name}.
              You may view and share pages for personal or internal business use, but you may not
              reproduce them for commercial purposes without permission.
            </p>

            <h2>Acceptable use</h2>
            <p>
              You agree not to misuse the website, including by attempting unauthorised access,
              interfering with its operation, or submitting false, unlawful or automated enquiries.
            </p>

            <h2>Third-party links</h2>
            <p>
              The website may link to third-party sites or tools (for example, a scheduling service).
              We are not responsible for their content or practices.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the extent permitted by law, {site.name} is not liable for any loss arising from use
              of, or reliance on, this website. Jurisdiction-specific wording: {TBC}
            </p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of {TBC}.</p>

            <h2>Changes</h2>
            <p>We may update these terms from time to time. Continued use of the website means you accept the updated terms.</p>

            <p>
              See also our <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </Prose>
        </div>
      </div>
    </>
  );
}
