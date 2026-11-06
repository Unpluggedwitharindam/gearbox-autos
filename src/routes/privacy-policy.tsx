import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Gearbox Autos" },
      { name: "description", content: "How Gearbox Autos collects, uses, stores and protects your personal information on our website and Android application." },
      { property: "og:title", content: "Privacy Policy — Gearbox Autos" },
      { property: "og:description", content: "How Gearbox Autos collects, uses, stores and protects your personal information on our website and Android application." },
      { property: "og:url", content: "https://gearboxautos.in/privacy-policy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://gearboxautos.in/privacy-policy" }],
  }),
  component: PrivacyPolicy,
});

const EFFECTIVE_DATE = "6 November 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold uppercase tracking-wide">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function PrivacyPolicy() {
  return (
    <div className="container-page pt-12 pb-20 max-w-3xl">
      <div className="eyebrow flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Legal</div>
      <h1 className="display-h1 mt-4">Privacy Policy<span className="text-primary">.</span></h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Effective date: {EFFECTIVE_DATE} · Last updated: {EFFECTIVE_DATE}
      </p>

      <Section title="1. Who we are">
        <p>
          This Privacy Policy applies to <strong className="text-foreground">Gearbox Autos</strong>, a used-car
          dealership and marketplace based in Jamshedpur, Jharkhand, India. It covers our website at{" "}
          <a href="https://www.gearboxautos.in" className="text-primary hover:underline">https://www.gearboxautos.in</a>{" "}
          and the <strong className="text-foreground">Gearbox Autos Android application</strong> (together, the
          "Services").
        </p>
        <p>
          Gearbox Autos, Near Golden Town, opp. BSS School, Adarsh Nagar, Sonari, Jamshedpur, Jharkhand 831011, India.
          Privacy contact:{" "}
          <a href="mailto:gearboxautotechgbat@gmail.com" className="text-primary hover:underline break-all">
            gearboxautotechgbat@gmail.com
          </a>{" "}
          · Phone: +91 90655 91253.
        </p>
      </Section>

      <Section title="2. Information we collect">
        <p>We collect information you give us directly when you use our forms and features:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-foreground">Name</strong> — submitted through enquiry, sell-car, test-drive and contact forms.</li>
          <li><strong className="text-foreground">Phone number</strong> — used to call or WhatsApp you about your enquiry.</li>
          <li><strong className="text-foreground">Email address</strong> — where you choose to provide it.</li>
          <li><strong className="text-foreground">City and location details</strong> you submit in forms.</li>
          <li><strong className="text-foreground">Vehicle information</strong> — make, model, year, kilometres, price expectations and photos you share when selling or enquiring about a car.</li>
          <li><strong className="text-foreground">Buying and selling enquiries</strong> — including the cars you are interested in and messages you send us.</li>
          <li><strong className="text-foreground">Account information</strong> — if you sign in (for example with Google), we receive your name, email address and profile identifier from the sign-in provider.</li>
        </ul>
        <p>
          We do <strong className="text-foreground">not</strong> run advertising trackers or third-party analytics on
          the website, and we do not collect precise GPS location, contacts, or device files. Standard technical
          information (such as IP address and browser type) is processed by our hosting provider only as needed to
          deliver and secure the Services.
        </p>
      </Section>

      <Section title="3. How we use your information">
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Responding to your enquiries and customer support requests.</li>
          <li>Connecting buyers and sellers and arranging test drives and inspections.</li>
          <li>Providing vehicle-related services and managing car listings.</li>
          <li>Sending you updates about your enquiry by phone, WhatsApp, SMS or email.</li>
          <li>Improving the functionality, content and performance of the website and app.</li>
          <li>Meeting legal, accounting and fraud-prevention obligations.</li>
        </ul>
        <p>We do not sell your personal information to anyone.</p>
      </Section>

      <Section title="4. Third-party services and data sharing">
        <p>We share information only with the service providers needed to operate the Services:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-foreground">Cloud database, hosting and authentication (Lovable Cloud / Supabase)</strong> — stores your form submissions, listings and account data and processes sign-ins on our behalf.</li>
          <li><strong className="text-foreground">Email delivery providers (Resend and Lovable's managed email service)</strong> — deliver enquiry notifications and follow-up reminders to our team; your submitted contact details are included in those notifications.</li>
          <li><strong className="text-foreground">Google</strong> — if you choose "Sign in with Google", Google processes the sign-in and shares your basic profile details with us.</li>
          <li><strong className="text-foreground">WhatsApp and Instagram (Meta)</strong> — when you tap a WhatsApp or Instagram link, you leave our Services and Meta's own privacy policy applies to that interaction.</li>
        </ul>
        <p>
          We may also disclose information if required by law or to protect our rights. We do not share your
          information with advertisers or data brokers.
        </p>
      </Section>

      <Section title="5. Data storage and security">
        <p>
          Your information is stored on secure cloud servers with access restricted to authorised Gearbox Autos team
          members. Data is transmitted over HTTPS encryption. While we take reasonable technical and organisational
          measures to protect your information, no method of transmission or storage is completely secure, and we
          cannot guarantee absolute security.
        </p>
      </Section>

      <Section title="6. Data retention and deletion">
        <p>
          We keep enquiry and lead information for as long as needed to respond to you, maintain our business records
          and meet legal obligations. You may ask us to correct or delete your personal information at any time by
          emailing{" "}
          <a href="mailto:gearboxautotechgbat@gmail.com" className="text-primary hover:underline break-all">
            gearboxautotechgbat@gmail.com
          </a>
          . We will action verified deletion requests within a reasonable period, except where we must retain records
          by law.
        </p>
      </Section>

      <Section title="7. Your rights and consent">
        <p>
          By submitting a form or signing in, you consent to the collection and use of your information as described
          in this policy. You may withdraw consent, request a copy of your data, ask for corrections, or request
          deletion by contacting us at the email above. Withdrawing consent does not affect processing already carried
          out.
        </p>
      </Section>

      <Section title="8. Children's privacy">
        <p>
          Our Services are intended for adults interested in buying or selling vehicles and are not directed at
          children under 18. We do not knowingly collect personal information from children. If you believe a child
          has provided us information, contact us and we will delete it.
        </p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page shows
          the current version. Continued use of the Services after a change means you accept the updated policy.
        </p>
      </Section>

      <Section title="10. Contact us">
        <p>For any privacy-related question, request or complaint, contact:</p>
        <p className="text-foreground">
          Gearbox Autos — Privacy<br />
          Near Golden Town, opp. BSS School, Adarsh Nagar, Sonari, Jamshedpur, Jharkhand 831011, India<br />
          Email:{" "}
          <a href="mailto:gearboxautotechgbat@gmail.com" className="text-primary hover:underline break-all">
            gearboxautotechgbat@gmail.com
          </a>
          <br />
          Phone: +91 90655 91253
        </p>
      </Section>
    </div>
  );
}
