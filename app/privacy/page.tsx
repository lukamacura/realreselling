import Link from "next/link";

/**
 * Uslovi i politika (Terms) — Real Reselling (App Router)
 * - Minimalno, jasno, srpski jezik (latinica)
 * - Next.js 15 (app/) — koristi `export const metadata` umesto <Head>
 * - TailwindCSS za stilove (prose)
 * - Server Component (bez "use client"): nema hydration mismatch-a
 */

export const metadata = {
  title: "Privacy Policy | Real Reselling",
  description:
    "Uslovi korišćenja i politika privatnosti za Real Reselling. Jasna i kratka pravila korišćenja platforme.",
  robots: { index: false, follow: true },
};

function formatLastUpdated(date: Date) {
  return new Intl.DateTimeFormat("sr-RS", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default function TermsPage() {
  // Server component => izračunato na serveru; nema klijentske razlike
  const lastUpdated = formatLastUpdated(new Date());

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 prose prose-neutral dark:prose-invert">
      <h1 className="mb-2">Privacy Policy</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Poslednje ažuriranje: {lastUpdated}
      </p>

      

      
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        RR Team Consulting LLC we respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or use our consulting and educational services.
<br />1. Information We Collect

We may collect the following types of information:

    Personal details you provide (such as name, email address, phone number, and payment information).

    Information automatically collected via cookies or analytics tools (such as IP address, browser type, and time spent on our website).

<br />2. How We Use Your Information

We use your information to:

    Provide consulting and educational services you purchase.

    Respond to your inquiries and support requests.

    Process payments and send invoices or confirmations.

    Improve our website and services.

    Comply with legal obligations.

<br />3. Data Protection and Security

We take reasonable technical and organizational measures to protect your information against unauthorized access, loss, misuse, or disclosure. Payments are securely processed by third-party providers such as Stripe or Wise, and we do not store full payment card details.
<br />4. Sharing of Information

We do not sell, trade, or rent users’ personal identification information. We may share information with trusted partners who help us operate our business or provide services to you, as long as they agree to keep your information confidential.
<br />5. Your Rights

You have the right to access, correct, or delete your personal data. You may also object to or restrict our processing of your information. To exercise these rights, contact us at 📧 rrteamconsulting@gmail.com
<br />6. Contact Us

If you have questions about this Privacy Policy, please contact us at:
📧 rrteamconsulting@gmail.com

📍 RR Team Consulting LLC, 33 North Gould Street, Sheridan, WY 82801, United States

      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="no-underline inline-flex items-center rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Nazad na početnu
        </Link>
      </div>
    </main>
  );
}
