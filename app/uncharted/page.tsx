"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import CircularText from "@/components/CircularText";
import DecryptedText from "@/components/DecryptedText";
import LiquidChrome from "@/components/LiquidChrome";

const missionPoints = [
  "A live digital treasure hunt originally run during Utsav Ananta 2025.",
  "Every puzzle unlocks the next URL fragment, so each answer is also your key.",
  "Best experienced on desktop, where the full visual and puzzle layouts breathe properly.",
];

const credits = [
  {
    label: "Event Coordinators",
    value: "Pranav Veeraghanta and Siddharth",
  },
  {
    label: "Integration, Management, and Testing",
    value: "Pranav Veeraghanta",
  },
];

const volunteers = [
  "Fasi Owaiz Ahmed",
  "Varsha V Kumar",
  "Shriyans Nayak",
  "Suniksha Priya",
  "Ahas Kaushik",
  "Anirudh Kuppam",
  "Navit Mathur",
  "Shashank Bhat",
  "Sahana BK",
  "Channabasavanna",
];

const rules = [
  "Use Google Search if you need it, but avoid AI tools if you want the original challenge curve.",
  "Decoding and encoding tools are fair game whenever a puzzle demands them.",
  "Each puzzle gives you a password. Append that password to the base URL without changing the domain.",
];

const socialLinks = [
  {
    href: "https://instagram.com/gradient.aiml",
    label: "Instagram",
    handle: "@gradient.aiml",
    className:
      "from-[#ff6cab] via-[#ff914d] to-[#ffd166] text-slate-950 shadow-[0_18px_60px_rgba(255,145,77,0.28)]",
  },
  {
    href: "https://www.linkedin.com/company/gradient-club",
    label: "LinkedIn",
    handle: "Gradient Club",
    className:
      "from-cyan-300 via-sky-400 to-blue-500 text-slate-950 shadow-[0_18px_60px_rgba(59,130,246,0.24)]",
  },
];

export default function UnchartedLandingPage() {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [showBody, setShowBody] = useState(false);
  const [showPanels, setShowPanels] = useState(false);
  const [glitchPulse, setGlitchPulse] = useState(false);

  useEffect(() => {
    const bodyTimer = window.setTimeout(() => setShowBody(true), 350);
    const panelTimer = window.setTimeout(() => setShowPanels(true), 900);
    const glitchInterval = window.setInterval(() => {
      setGlitchPulse(true);
      window.setTimeout(() => setGlitchPulse(false), 220);
    }, 5200);

    return () => {
      window.clearTimeout(bodyTimer);
      window.clearTimeout(panelTimer);
      window.clearInterval(glitchInterval);
    };
  }, []);

  const yearLabel = useMemo(() => new Date().getFullYear(), []);

  return (
    <>
      <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="absolute inset-0">
          <LiquidChrome
            baseColor={[0.12, 0.32, 0.62]}
            speed={0.12}
            amplitude={0.22}
            interactive={false}
          />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(112,211,255,0.16),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(255,128,176,0.16),_transparent_24%),linear-gradient(180deg,rgba(5,8,22,0.18),rgba(5,8,22,0.92)_58%,rgba(5,8,22,1))]" />
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:90px_90px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0,_transparent_52%,rgba(5,8,22,0.7)_100%)]" />

        <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-12 pt-8 sm:px-8 lg:px-12">
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur-xl">
                <CircularText
                  text="GRADIENT*CLUB*UNCHARTED*"
                  onHover="speedUp"
                  spinDuration={18}
                  className="scale-[0.46] text-[8px]"
                />
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950/85 shadow-[0_0_24px_rgba(125,211,252,0.3)]">
                  <Image
                    src="/atcg.png"
                    alt="Gradient Club"
                    width={42}
                    height={42}
                    className="h-10 w-10 object-contain"
                    priority
                  />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-cyan-200/70">
                  Gradient Club Archive
                </p>
                <h1 className="mt-2 text-xl font-semibold tracking-[0.18em] text-white/95">
                  Uncharted: Lost Voyage
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.28em] text-white/65">
              <span className="rounded-full border border-white/12 bg-white/6 px-4 py-2 backdrop-blur-lg">
                Season 2025
              </span>
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-cyan-100">
                Desktop Recommended
              </span>
            </div>
          </header>

          <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
            <div
              className={`relative transition-all duration-1000 ${
                showBody ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/7 px-4 py-2 text-sm text-white/72 backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.8)]" />
                Puzzle hunt briefing interface
              </div>

              <div className="max-w-4xl">
                <div
                  className={`relative mb-6 ${
                    glitchPulse ? "translate-x-[2px] skew-x-1" : ""
                  } transition-transform duration-200`}
                >
                  <Image
                    src="/unc.png"
                    alt="Uncharted title"
                    width={1500}
                    height={360}
                    className="h-auto w-full max-w-[38rem] drop-shadow-[0_24px_50px_rgba(34,211,238,0.2)]"
                    priority
                  />
                </div>

                <div
                  className={`mb-8 ${
                    glitchPulse ? "-translate-x-[2px]" : ""
                  } transition-transform duration-200`}
                >
                  <Image
                    src="/lv.png"
                    alt="Lost Voyage subtitle"
                    width={1500}
                    height={360}
                    className="h-auto w-full max-w-[32rem] drop-shadow-[0_24px_50px_rgba(244,114,182,0.2)]"
                    priority
                  />
                </div>

                <div className="max-w-3xl space-y-5">
                  <DecryptedText
                    text="A recovered expedition log built for players who like their clues cryptic, layered, and just a little hostile."
                    animateOn="view"
                    revealDirection="start"
                    speed={18}
                    maxIterations={20}
                    className="font-serif text-2xl leading-tight text-white sm:text-3xl lg:text-[2.6rem]"
                    encryptedClassName="font-serif text-2xl leading-tight text-cyan-100/35 sm:text-3xl lg:text-[2.6rem]"
                  />

                  <p className="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                    The original event is over, but the hunt still runs. Step into
                    the archive, decode the trail, and navigate each puzzle exactly
                    the way competitors did during the live challenge.
                  </p>
                </div>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setRulesOpen(true)}
                    className="group relative overflow-hidden rounded-2xl border border-cyan-300/30 bg-cyan-300/12 px-7 py-4 text-left shadow-[0_24px_80px_rgba(34,211,238,0.22)] transition duration-300 hover:-translate-y-1 hover:border-cyan-200/60 hover:bg-cyan-300/18"
                  >
                    <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-0 transition duration-500 group-hover:translate-x-full group-hover:opacity-100" />
                    <span className="block text-xs uppercase tracking-[0.35em] text-cyan-100/75">
                      Step 01
                    </span>
                    <span className="mt-2 block text-lg font-semibold text-white">
                      Read the rules
                    </span>
                  </button>

                  <Link
                    href="/scroll"
                    className="group relative overflow-hidden rounded-2xl border border-fuchsia-300/30 bg-[linear-gradient(135deg,rgba(244,114,182,0.18),rgba(99,102,241,0.16))] px-7 py-4 shadow-[0_24px_80px_rgba(217,70,239,0.18)] transition duration-300 hover:-translate-y-1 hover:border-fuchsia-200/60"
                  >
                    <span className="block text-xs uppercase tracking-[0.35em] text-fuchsia-100/75">
                      Step 02
                    </span>
                    <span className="mt-2 block text-lg font-semibold text-white">
                      Enter the voyage
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <aside
              className={`grid gap-5 transition-all delay-150 duration-1000 ${
                showPanels ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-2xl shadow-[0_24px_100px_rgba(4,8,20,0.6)]">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/70">
                    Mission Snapshot
                  </p>
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-emerald-100">
                    Live Archive
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-[1.5rem] border border-cyan-200/10 bg-slate-950/55 p-5">
                    <p className="text-xs uppercase tracking-[0.32em] text-white/45">
                      Format
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      Puzzle Hunt
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-fuchsia-200/10 bg-slate-950/55 p-5">
                    <p className="text-xs uppercase tracking-[0.32em] text-white/45">
                      Progression
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      URL Password Chain
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-amber-200/10 bg-slate-950/55 p-5">
                    <p className="text-xs uppercase tracking-[0.32em] text-white/45">
                      Ideal Setup
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      Desktop + Curiosity
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(15,23,42,0.75),rgba(6,10,24,0.88))] p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(4,8,20,0.45)]">
                <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-100/70">
                  Before You Begin
                </p>
                <ul className="mt-5 space-y-4">
                  {missionPoints.map((point, index) => (
                    <li
                      key={point}
                      className="flex gap-4 rounded-[1.35rem] border border-white/8 bg-white/6 px-4 py-4"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10 text-xs font-semibold text-cyan-100">
                        0{index + 1}
                      </span>
                      <p className="text-sm leading-7 text-white/72">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(4,8,20,0.4)] sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/70">
                About The Hunt
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Built like an expedition dossier, not a generic landing page.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
                Uncharted Lost Voyage was designed as a chained experience: one
                solved clue unlocks the next destination. The satisfaction comes
                from making strange fragments cohere into a path, not from being
                handed instructions too early.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Link
                  href="https://github.com/pranav1211/Uncharted-3"
                  className="rounded-[1.4rem] border border-cyan-300/20 bg-cyan-300/10 px-5 py-4 text-sm font-medium text-cyan-50 transition hover:-translate-y-1 hover:border-cyan-200/40 hover:bg-cyan-300/16"
                >
                  Explore the source code
                </Link>
                <Link
                  href="https://docs.google.com/spreadsheets/d/1kqMGGnIZ9MjnrBB9Xw2lE4Tc5S4-_jcsCcb_KHgPh2w/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[1.4rem] border border-fuchsia-300/20 bg-fuchsia-300/10 px-5 py-4 text-sm font-medium text-fuchsia-50 transition hover:-translate-y-1 hover:border-fuchsia-200/40 hover:bg-fuchsia-300/16"
                >
                  View the official answers
                </Link>
              </div>
            </article>

            <article className="rounded-[2rem] border border-white/12 bg-slate-950/72 p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(4,8,20,0.4)] sm:p-8">
              <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-100/70">
                Credits
              </p>
              <div className="mt-5 space-y-4">
                {credits.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.25rem] border border-white/8 bg-white/6 px-4 py-4"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                      {item.label}
                    </p>
                    <p className="mt-2 text-base leading-7 text-white/82">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-white/6 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                  Volunteers and Puzzle Creators
                </p>
                <div className="mt-4 grid gap-3 text-sm text-white/72 sm:grid-cols-2">
                  {volunteers.map((volunteer) => (
                    <div
                      key={volunteer}
                      className="rounded-xl border border-white/6 bg-slate-950/45 px-3 py-3"
                    >
                      {volunteer}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="mt-6 rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6 backdrop-blur-2xl shadow-[0_24px_80px_rgba(4,8,20,0.4)] sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/70">
                  Share Your Run
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                  Finished the voyage? Let people know you made it out.
                </h2>
                <p className="mt-4 text-base leading-8 text-white/72">
                  Tag the club, post your solve path, or show off the moment the
                  final clue clicks. The hunt is better when it leaves a trail.
                </p>
              </div>

              <div className="rounded-full border border-amber-200/16 bg-amber-300/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-amber-100">
                Archive build {yearLabel}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-[1.7rem] border border-white/12 bg-gradient-to-r px-6 py-5 transition duration-300 hover:-translate-y-1 ${link.className}`}
                >
                  <span className="block text-xs uppercase tracking-[0.32em] text-slate-900/70">
                    {link.label}
                  </span>
                  <span className="mt-2 block text-2xl font-semibold">
                    Tag {link.handle}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      {rulesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#02040d]/80 px-4 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(10,16,32,0.96),rgba(4,8,18,0.98))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.7)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/70">
                  Briefing
                </p>
                <h3 className="mt-3 text-3xl font-semibold text-white">
                  Rules of the voyage
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setRulesOpen(false)}
                className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70 transition hover:bg-white/12"
              >
                Close
              </button>
            </div>

            <div className="mt-8 space-y-4">
              {rules.map((rule, index) => (
                <div
                  key={rule}
                  className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/5 px-4 py-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-sm font-semibold text-cyan-100">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-white/76">{rule}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/scroll"
                className="rounded-[1.25rem] border border-cyan-300/30 bg-cyan-300/12 px-5 py-4 text-center text-sm font-semibold text-cyan-50 transition hover:-translate-y-1 hover:bg-cyan-300/18"
              >
                I understand. Start the hunt.
              </Link>
              <button
                type="button"
                onClick={() => setRulesOpen(false)}
                className="rounded-[1.25rem] border border-white/10 bg-white/6 px-5 py-4 text-sm font-semibold text-white/76 transition hover:-translate-y-1 hover:bg-white/10"
              >
                Stay here a little longer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
