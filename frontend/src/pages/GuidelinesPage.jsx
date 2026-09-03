import { LuTriangleAlert, LuExternalLink, LuEye, LuKeyRound, LuLightbulb, LuLock, LuRefreshCw, LuSettings2, LuShieldCheck, LuX, LuBrain, LuCamera, LuInfo, LuUserRound } from "react-icons/lu";
import { VscWarning } from "react-icons/vsc";
import { FaInfo, FaLaptopCode, FaQuestion } from "react-icons/fa";
import { SiGit, SiGooglegemini } from "react-icons/si";
import screenshot1 from "../assets/google_screenshot1.png";
import screenshot2 from "../assets/google_screenshot2.png";
import auditScreenshot from "../assets/audit_screenshot.png";

const SectionTitle = ({ number, icon, title, description }) => (
  <div className="mb-6">
    <div className="mb-2 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-semibold text-indigo-400">
        {number}
      </span>

      <h2 className="text-xl flex items-center gap-1 font-semibold text-white">
        {icon}
        {title}
      </h2>
    </div>

    {description && (
      <p className="max-w-3xl text-sm leading-6 text-slate-400">
        {description}
      </p>
    )}
  </div>
);

const Step = ({ number, title, children }) => (
  <div className="flex gap-4">
    <div className="flex shrink-0 flex-col items-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-sm font-semibold text-indigo-300">
        {number}
      </div>

      <div className="mt-2 h-full w-px bg-white/5" />
    </div>

    <div className="pb-7">
      <h3 className="mb-1 font-medium text-slate-200">{title}</h3>
      <div className="text-sm leading-6 text-slate-400">{children}</div>
    </div>
  </div>
);

const InfoCard = ({ icon, title, children, variant = "default" }) => {
  const styles = {
    default:
      "border-white/10 bg-white/[0.03]",
    info:
      "border-indigo-400/20 bg-indigo-500/[0.06]",
    success:
      "border-emerald-400/20 bg-emerald-500/[0.06]",
    warning:
      "border-amber-400/20 bg-amber-500/[0.06]",
    danger:
      "border-red-400/20 bg-red-500/[0.06]",
  };

  return (
    <div
      className={`rounded-2xl border p-5 backdrop-blur-sm ${styles[variant]}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-slate-100">{title}</h3>
      </div>

      <div className="text-sm leading-6 text-slate-400">
        {children}
      </div>
    </div>
  );
};

const ScreenshotPlaceholder = ({ step, title, source }) => (
  <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-slate-950/60">
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
      <span className="text-xs font-medium text-slate-400">
        Step {step}
      </span>

      <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-slate-500">
        Screenshot
      </span>
    </div>

    <div className="flex flex-col gap-2 min-h-44 items-center justify-center p-6 text-center">
        <img
          src={source}
          alt={title}
          className="w-full rounded-xl"
        />
        <p className="text-sm text-slate-500">{title}</p>
    </div>
  </div>
);

const GuidelinesPage = () => {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Hero */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-10 shadow-2xl shadow-black/20 sm:px-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
              <LuShieldCheck className="h-4 w-4" />
              ProLearn Guidelines
            </div>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Your AI.
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                Your Key. Your Control.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Learn how to create and configure your Gemini API key,
              understand how ProLearn uses it, and keep your AI access
              secure.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://ai.google.dev/gemini-api/docs/api-key"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
              >
                Google Gemini API Key Guide
                <LuExternalLink className="h-4 w-4" />  
              </a>

              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Open Google AI Studio
                <LuExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Important notice */}
        <section className="mb-10">
          <InfoCard
            icon={<VscWarning className="h-4 w-4" />}
            title="Before you begin"
            variant="warning"
          >
            <p>
              ProLearn uses a Bring Your Own Key (BYOK) model for
              Gemini-powered features. Your Gemini API key is your own
              credential and should be treated as sensitive information.
            </p>

            <p className="mt-3">
              Google's Gemini API documentation is the authoritative
              source for creating and managing your API keys. ProLearn's
              instructions explain how that key is used specifically
              within ProLearn.
            </p>
          </InfoCard>
        </section>

        {/* 1. Get key */}
        <section className="mb-12">
          <SectionTitle
            number="01"
            icon={<LuKeyRound className="h-4 w-4" />}
            title="Get a Gemini API Key"
            description="Create your key through Google AI Studio before configuring it in ProLearn."
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <Step number="1" title="Open Google AI Studio">
              Visit Google AI Studio and open the API key section.

              <div className="mt-3">
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-indigo-300 transition hover:bg-white/10"
                >
                  Open API Keys
                  <LuExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Step>

            <Step number="2" title="Sign in with your Google account">
              Sign in to the Google account you want to use with
              Gemini API.

              <ScreenshotPlaceholder
                step="2"
                title="Google AI Studio API Keys page"
                source={screenshot1}
              />
            </Step>

            <Step number="3" title="Create an API key">
              Select the option to create a new API key and follow the
              instructions shown by Google AI Studio.

              <ScreenshotPlaceholder
                step="3"
                title="Create API key action in Google AI Studio"
                source={screenshot2}
              />
            </Step>

            <Step number="4" title="Copy your key">
              Once the key has been created, copy it and keep it
              private. Do not post it publicly or include it in
              screenshots, source code, Git commits, or public
              documentation.
            </Step>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Google may change the appearance or flow of AI Studio over
            time. If the interface differs from these screenshots,
            follow Google's current instructions.
          </p>
        </section>

        {/* 2. Configure */}
        <section className="mb-12">
          <SectionTitle
            number="02"
            icon={<LuSettings2 className="h-4 w-4" />}
            title="Configure Your Key in ProLearn"
            description="Once you have your Gemini API key, connect it to your current ProLearn session."
          />

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["1", "Open Profile", "Go to your ProLearn profile."],
              ["2", "Enter Key", "Paste your Gemini API key into the key field."],
              ["3", "Save", "Save the key and start using Gemini-powered features."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-semibold text-indigo-300">
                  {number}
                </div>

                <h3 className="font-semibold text-slate-100">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <InfoCard
              icon={<LuLightbulb className="h-4 w-4" />}
              title="What happens after you save it?"
              variant="info"
            >
              ProLearn's Gemini integration uses the key from the
              frontend when making Gemini requests. The ProLearn
              backend does not need to receive or store your Gemini
              API key.
            </InfoCard>
          </div>
        </section>

        {/* 3. Architecture */}
        <section className="mb-12">
          <SectionTitle
            number="03"
            icon={<LuShieldCheck className="h-4 w-4" />}
            title="How ProLearn Handles Your Key"
            description="Understanding the data flow is just as important as knowing where to paste the key."
          />

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-sm font-medium text-slate-300">
                Gemini request flow
              </p>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-5 sm:items-center">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
                <LuUserRound className="mx-auto text-2xl" />
                <p className="mt-2 text-xs font-medium text-slate-300">
                  You
                </p>
              </div>

              <div className="hidden text-center text-slate-600 sm:block">
                →
              </div>

              <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/[0.06] p-4 text-center">
                <FaLaptopCode className="mx-auto text-2xl" />
                <p className="mt-2 text-xs font-medium text-indigo-300">
                  ProLearn Frontend
                </p>
              </div>

              <div className="hidden text-center text-slate-600 sm:block">
                →
              </div>

              <div className="rounded-xl border border-blue-400/20 bg-blue-500/[0.06] p-4 text-center">
                <SiGooglegemini className="mx-auto text-2xl" />
                <p className="mt-2 text-xs font-medium text-blue-300">
                  Gemini API
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 px-6 py-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-emerald-400">✓</span>
                <p className="text-sm leading-6 text-slate-400">
                  The Gemini key is used by the ProLearn frontend for
                  Gemini communication and is not sent to the ProLearn
                  backend for storage.
                </p>
              </div>

              <div className="mt-3 flex items-start gap-3">
                <span className="mt-0.5 text-red-400">✕</span>
                <p className="text-sm leading-6 text-slate-400">
                  ProLearn audit records do not contain the Gemini API
                  key itself.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InfoCard
              icon={<LuLock className="h-4 w-4" />}
              title="Session-oriented"
              variant="success"
            >
              The Gemini key is kept for the authenticated ProLearn
              session and is released when the user logs out.
            </InfoCard>

            <InfoCard
              icon={<LuX className="h-4 w-4" />}
              title="Never put it in Git"
              variant="danger"
            >
              Never commit your Gemini API key to your repository,
              source code, screenshots, issues, or public posts.
            </InfoCard>
          </div>
        </section>

        {/* 4. Audit */}
        <section className="mb-12">
          <SectionTitle
            number="04"
            icon={<LuEye className="h-4 w-4" />}
            title="Understand ProLearn Audit"
            description="ProLearn Audit provides visibility into recent Gemini requests initiated by ProLearn."
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm leading-6 text-slate-400">
              The ProLearn Audit page is designed to make Gemini usage transparent.
              Recent requests initiated by ProLearn can
              be inspected so you can understand what the application
              asked Gemini to do.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
              <div className="relative">
                <img
                  src={auditScreenshot}
                  alt="ProLearn Audit page showing recent AI activity"
                  className="w-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-indigo-950/10" />
              </div>

              <div className="border-t border-white/10 px-5 py-4">
                <p className="text-xs leading-5 text-slate-500">
                  Example of the ProLearn Audit page. Individual records can be
                  expanded to inspect additional request details.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/[0.05] p-4">
              <p className="text-sm flex gap-1 font-medium text-emerald-300">
                <LuShieldCheck className="h-4 w-4" /> API keys are never part of audit records.
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Audit information is intended to help you understand
                ProLearn's Gemini activity without exposing your
                credential.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Rotate */}
        <section className="mb-12">
          <SectionTitle
            number="05"
            icon={<LuRefreshCw className="h-4 w-4" />}
            title="Rotate or Revoke Your Key"
            description="If you want to replace your key or suspect that it has been exposed, rotate it promptly."
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <Step number="1" title="Create a replacement key">
              Use Google AI Studio to create a new API key.
            </Step>

            <Step number="2" title="Update ProLearn">
              Replace the old key with the new one in your ProLearn
              Profile.
            </Step>

            <Step number="3" title="Verify your AI features">
              Test an AI-powered feature such as AI Tutor or Study
              Plan generation.
            </Step>

            <Step number="4" title="Disable the old key">
              Once the replacement has been verified, disable or
              delete the old key through Google's key-management
              interface.
            </Step>
          </div>

          <div className="mt-5">
            <a
              href="https://ai.google.dev/gemini-api/docs/api-key#security"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 transition hover:text-indigo-300"
            >
              Read Google's current API key management guidance
              <LuExternalLink className="h-3 w-3" />
            </a>
          </div>
        </section>

        {/* 6. Exposed key */}
        <section className="mb-12">
          <SectionTitle
            number="06"
            icon={<LuTriangleAlert className="h-4 w-4" />}
            title="If Your Key Is Exposed"
            description="Treat an exposed API key as compromised."
          />

          <InfoCard
            icon={<VscWarning className="h-4 w-4" />}
            title="Act quickly"
            variant="danger"
          >
            <ol className="list-decimal space-y-2 pl-5">
              <li>Create a new Gemini API key.</li>
              <li>Update the key in ProLearn.</li>
              <li>Verify that Gemini-powered features work.</li>
              <li>Disable or revoke the compromised key.</li>
              <li>Review your Google Gemini API usage for unexpected activity.</li>
            </ol>
          </InfoCard>
        </section>

        {/* 7. Safety rules */}
        <section className="mb-12">
          <SectionTitle
            number="07"
            icon={<LuBrain className="h-4 w-4" />}
            title="Key Safety Rules"
            description="A few rules worth remembering whenever you work with API credentials."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [<LuLock className="h-4 w-4" />, "Treat your key like a password."],
              [<LuX className="h-4 w-4" />, "Never publish or share your key."],
              [<LuCamera className="h-4 w-4" />, "Never include your key in screenshots."],
              [<SiGit className="h-4 w-4" />, "Never commit your key to Git."],
              [<LuRefreshCw className="h-4 w-4" />, "Rotate your key if you suspect exposure."],
              [<LuEye className="h-4 w-4" />, "Review usage if something looks suspicious."],
            ].map(([icon, text]) => (
              <div
                key={text}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
              >
                <span className="text-xl">{icon}</span>
                <p className="text-sm text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Current Google guidance */}
        <section className="mb-12">
          <SectionTitle
            number="08"
            icon={<LuInfo className="h-4 w-4" />}
            title="Google's Current Guidance"
            description="Gemini API key behavior and Google AI Studio can change over time."
          />

          <InfoCard
            icon={<FaInfo className="h-4 w-4" />}
            title="Use Google's documentation as the source of truth"
            variant="info"
          >
            <p>
              Google's Gemini API documentation should be considered
              the authoritative source for current API-key creation,
              management, restrictions, and migration guidance.
            </p>

            <a
              href="https://ai.google.dev/gemini-api/docs/api-key"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-medium text-indigo-400 transition hover:text-indigo-300"
            >
              View Gemini API key documentation
              <LuExternalLink className="h-3 w-3" />
            </a>
          </InfoCard>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <SectionTitle
            number="09"
            icon={<FaQuestion className="h-4 w-4" />}
            title="Frequently Asked Questions"
          />

          <div className="space-y-3">
            {[
              [
                "Does ProLearn store my Gemini API key?",
                "ProLearn's BYOK architecture is designed so the Gemini API key is handled by the frontend rather than being stored by the ProLearn backend.",
              ],
              [
                "Does my Gemini key go through the ProLearn backend?",
                "No. Gemini communication is performed from the ProLearn frontend using the user-provided key.",
              ],
              [
                "What happens when I log out?",
                "The Gemini key stored for the current ProLearn session is released when you log out.",
              ],
              [
                "Should I rotate my key?",
                "Rotate it whenever you suspect it may have been exposed or compromised. You can also rotate credentials as part of your normal security practices.",
              ],
              [
                "Can I see what ProLearn sends to Gemini?",
                "The ProLearn Audit feature is designed to provide visibility into recent Gemini requests initiated by ProLearn, including the originating component and prompt information.",
              ],
              [
                "Does ProLearn pay for my Gemini API usage?",
                "No. You provide and use your own Gemini API credentials. Applicable Google Gemini API quotas, limits, billing, and usage policies are your responsibility.",
              ],
            ].map(([question, answer]) => (
              <details
                key={question}
                className="group rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <span>{question}</span>
                    <span className="text-slate-500 transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </summary>

                <div className="border-t border-white/5 px-5 py-4 text-sm leading-6 text-slate-500">
                  {answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8 pb-4 text-center">
          <p className="text-sm text-slate-500">
            ProLearn uses Google Gemini through a user-owned BYOK
            architecture.
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs">
            <a
              href="https://ai.google.dev/gemini-api/docs/api-key"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 transition hover:text-indigo-300"
            >
              <LuExternalLink className="inline h-3 w-3 mr-1" />
              Google Gemini API Documentation
            </a>

            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 transition hover:text-indigo-300"
            >
              <LuExternalLink className="inline h-3 w-3 mr-1" />
              Google AI Studio
            </a>
          </div>
        </footer>

      </div>
    </main>
  );
};

export default GuidelinesPage;
