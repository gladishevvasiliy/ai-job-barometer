export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl bg-white rounded-3xl shadow-sm p-8 md:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-400 mb-8">
          Last updated: January 26, 2026
        </p>

        <section className="space-y-4 text-slate-700 text-sm leading-relaxed">
          <p>
            AI Job Barometer is provided as an experimental community tool “as
            is”, without any guarantees. By using this site, you agree to these
            Terms of Service.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            Use of the service
          </h2>
          <p>
            You agree not to abuse the service, attempt to manipulate results,
            or interfere with the infrastructure. We reserve the right to block
            access or remove data in case of abuse or technical issues.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            No professional advice
          </h2>
          <p>
            The content and statistics on this site are for informational and
            entertainment purposes only and do not constitute career, legal, or
            financial advice.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            Accounts and authentication
          </h2>
          <p>
            When you sign in with X (Twitter) or other OAuth providers, you are
            responsible for keeping your accounts secure. We do not have access
            to your login credentials; authentication is handled by the provider.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            Limitation of liability
          </h2>
          <p>
            To the maximum extent permitted by law, the maintainers of this
            project are not liable for any damages or losses arising from your
            use of this site.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            Changes to these terms
          </h2>
          <p>
            These Terms of Service may be updated from time to time. Continued
            use of the site after changes become effective constitutes
            acceptance of the new terms.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 mt-6">
            Contact
          </h2>
          <p>
            If you have questions about these Terms of Service, please contact
            the maintainer via the project repository on GitHub or the contact
            information provided there.
          </p>
        </section>
      </div>
    </main>
  )
}

