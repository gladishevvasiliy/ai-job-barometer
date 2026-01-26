export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl bg-white rounded-3xl shadow-sm p-8 md:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last updated: January 26, 2026
        </p>

        <section className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            AI Job Barometer is a community project that helps developers
            understand how AI is impacting our jobs. We collect minimal data
            needed to prevent duplicate votes and provide aggregated statistics.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            What we collect
          </h2>
          <p>
            When you sign in with X (Twitter) or other OAuth providers, we may
            receive basic profile information such as your unique provider ID,
            display name, username/handle, and email address (if you grant
            access). We also store your vote and selected specialty.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            How we use your data
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To ensure each person can only vote once per cooldown window.</li>
            <li>To compute aggregated, anonymized statistics about votes.</li>
            <li>To detect abuse or fraudulent activity.</li>
          </ul>

          <p className="mt-4">
            We do <span className="font-semibold">not</span> sell your personal
            data and do not use it for targeted advertising.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            Data retention
          </h2>
          <p>
            Votes and minimal user identifiers are stored in our database to
            keep the barometer historically useful. You may request deletion of
            your personal data by contacting the maintainer of this project.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            Third-party services
          </h2>
          <p>
            We use Supabase for authentication and data storage, and PostHog
            for privacy-friendly analytics. These services may process limited
            technical data (such as IP address or user agent) as part of their
            normal operation.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            Contact
          </h2>
          <p>
            If you have questions about this Privacy Policy or want to request
            data deletion, please reach out via the project repository on GitHub
            or the contact information provided there.
          </p>
        </section>
      </div>
    </main>
  )
}

