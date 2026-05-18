import Link from "next/link";
import {
  ArrowRight,
  Award,
  BellRing,
  BookOpen,
  Bus,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Send,
  Shield,
  Users,
} from "lucide-react";

import LandingHeader from "@/components/landing/header";
import Logo from "@/components/common/logo";
import Tile from "@/components/common/tile";
import Eyebrow from "@/components/common/eyebrow";
import InitialsAvatar from "@/components/common/initials-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: GraduationCap,
    title: "Student records",
    description:
      "A single source of truth for admissions, academics, attendance, and parent contact.",
    tone: "brand" as const,
  },
  {
    icon: Calendar,
    title: "Timetables & sessions",
    description:
      "Generate term schedules, manage substitutions, and roll classes forward each session.",
    tone: "teal" as const,
  },
  {
    icon: BookOpen,
    title: "Homework & academics",
    description:
      "Assignments, syllabus tracking, and lesson plans that sync with the parent app.",
    tone: "info" as const,
  },
  {
    icon: CreditCard,
    title: "Fees & invoicing",
    description:
      "Configurable fee heads, late fees, instalments, and one-click receipts.",
    tone: "warning" as const,
  },
  {
    icon: BellRing,
    title: "Parent communication",
    description:
      "Bulk SMS, email, and in-app notices with templates, scheduling, and delivery proof.",
    tone: "success" as const,
  },
  {
    icon: Shield,
    title: "Gate pass & safety",
    description:
      "Track who enters and exits the campus. Auto-notify guardians on pickup.",
    tone: "danger" as const,
  },
  {
    icon: Award,
    title: "Exams & report cards",
    description:
      "Custom mark schemes, grade boundaries, and printable PDF report cards.",
    tone: "brand" as const,
  },
  {
    icon: Bus,
    title: "Transport routes",
    description:
      "Bus routes, stop assignments, and live ETA notifications for parents.",
    tone: "teal" as const,
  },
  {
    icon: Users,
    title: "Guardian directory",
    description:
      "Map every student to verified guardians with role-based access.",
    tone: "info" as const,
  },
];

const stats = [
  { v: "500+", l: "Schools live", s: "across 18 states" },
  { v: "1.2M", l: "Students managed", s: "from KG through Class 12" },
  { v: "8.4M", l: "Notifications sent", s: "monthly · 99.4% delivered" },
  { v: "99.9%", l: "Uptime", s: "12-month rolling average" },
];

const steps = [
  {
    n: "01",
    t: "Discovery call",
    d: "30 minutes. We map your fee heads, classes, sessions, and existing data sources.",
  },
  {
    n: "02",
    t: "Data migration",
    d: "Bulk-import students, teachers, and ledgers from your existing system or spreadsheets.",
  },
  {
    n: "03",
    t: "Staff training",
    d: "Two live sessions for admin, two for teachers. Recordings and docs are yours forever.",
  },
  {
    n: "04",
    t: "Go live",
    d: "Run a pilot class for a week, iron out edge cases, then roll out school-wide.",
  },
];

const testimonials = [
  {
    q: "The migration was painless. Their team imported eight years of records in three days. Our staff was productive on day one.",
    n: "Mr. Amit Gupta",
    r: "Vice Principal · Little Stars Academy",
    tone: "teal" as const,
  },
  {
    q: "Parents finally have one place for fee receipts, exam schedules, and bus updates. The PTM no-show rate dropped by half.",
    n: "Dr. Kavya Nair",
    r: "Academic Head · Sunshine School",
    tone: "warning" as const,
  },
  {
    q: "The fee receipts and gate pass features alone justified the cost. The rest of the platform is a bonus we use every day.",
    n: "Mr. Rajan Verma",
    r: "Director · Heritage Public School",
    tone: "success" as const,
  },
];

const plans = [
  {
    n: "Starter",
    p: "₹29",
    per: "/ student / month",
    d: "For schools under 200 students.",
    f: [
      "All academic features",
      "1,000 SMS / month",
      "Email unlimited",
      "Basic support",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    n: "Growth",
    p: "₹49",
    per: "/ student / month",
    d: "For most schools, 200–1,000 students.",
    f: [
      "Everything in Starter",
      "5,000 SMS / month",
      "Custom report cards",
      "Priority support",
      "API access",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    n: "Enterprise",
    p: "Custom",
    per: "",
    d: "For multi-campus and 1,000+ student schools.",
    f: [
      "Everything in Growth",
      "Unlimited SMS pool",
      "SSO + custom domain",
      "Dedicated CSM",
      "On-site training",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

const trustNames = [
  "DPS Mainpuri",
  "Rainbow Kids",
  "Little Stars Academy",
  "Sunshine School",
  "Heritage Public",
  "Vidya Niketan",
  "Saraswati Vidya Mandir",
];

export default function ShikshaTechLanding() {
  return (
    <div className="bg-bg min-h-screen">
      <LandingHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.85 0.01 260 / 0.5) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
            <div>
              <Badge variant="brand" dot className="mb-5">
                Trusted by 500+ schools across India
              </Badge>
              <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-semibold tracking-[-0.03em] leading-[1.02]">
                The operating system <br className="hidden sm:block" />
                for{" "}
                <span className="serif italic font-normal text-brand">
                  modern schools
                </span>
              </h1>
              <p className="text-[16px] sm:text-[18px] text-ink-2 mt-5 max-w-[520px] leading-[1.55]">
                Admissions, attendance, fees, communication, and academics —
                unified in one platform that teachers actually want to use.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Button size="lg" asChild>
                  <Link href="/auth/school">
                    Start free trial <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary">
                  Book a demo
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-7 text-[13px] text-ink-3">
                {[
                  "30-day free trial",
                  "No credit card",
                  "Migration assistance",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-1.5">
                    <Check size={14} className="text-success" /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero product preview */}
            <div className="relative">
              <div className="bg-surface rounded-[14px] border border-border shadow-xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-divider bg-surface-2">
                  <span className="size-2.5 rounded-full bg-[oklch(0.84_0.02_30)]" />
                  <span className="size-2.5 rounded-full bg-[oklch(0.88_0.02_80)]" />
                  <span className="size-2.5 rounded-full bg-[oklch(0.84_0.02_155)]" />
                  <div className="flex-1 text-center text-[11px] text-ink-3 mono">
                    shikshatech.org/dashboard
                  </div>
                </div>
                <div className="p-5 bg-bg-2">
                  <Eyebrow>Today · 18 May 2026</Eyebrow>
                  <div className="text-[22px] font-semibold mt-1 tracking-tight">
                    Good morning, Aman
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                      {
                        l: "Present today",
                        v: "1,178",
                        d: "94.2%",
                        ink: "text-success-ink",
                      },
                      {
                        l: "Pending fees",
                        v: "₹3.4L",
                        d: "14 students",
                        ink: "text-warning-ink",
                      },
                      {
                        l: "Open tickets",
                        v: "6",
                        d: "+2 today",
                        ink: "text-brand-ink",
                      },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="bg-surface border border-border rounded-[10px] p-3"
                      >
                        <div className="text-[10px] text-ink-3">{s.l}</div>
                        <div className="text-[20px] font-semibold mt-0.5 tracking-tight tnum">
                          {s.v}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${s.ink}`}>
                          {s.d}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-surface border border-border rounded-[10px] p-3.5 mt-2.5">
                    <div className="flex justify-between mb-2">
                      <div className="text-[11px] font-semibold">
                        Attendance · last 14 days
                      </div>
                      <Badge variant="success" size="sm">
                        ↗ 1.3%
                      </Badge>
                    </div>
                    <svg viewBox="0 0 280 60" className="w-full h-[60px]">
                      <defs>
                        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor="var(--brand)"
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="100%"
                            stopColor="var(--brand)"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 40 L20 35 L40 38 L60 28 L80 30 L100 22 L120 24 L140 18 L160 22 L180 12 L200 16 L220 10 L240 14 L260 8 L280 12 L280 60 L0 60 Z"
                        fill="url(#hg)"
                      />
                      <path
                        d="M0 40 L20 35 L40 38 L60 28 L80 30 L100 22 L120 24 L140 18 L160 22 L180 12 L200 16 L220 10 L240 14 L260 8 L280 12"
                        fill="none"
                        stroke="var(--brand)"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <div className="bg-surface border border-border rounded-[10px] px-3 py-2.5 mt-2.5 flex items-center gap-2.5">
                    <Tile tone="teal" icon={BellRing} size={28} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium truncate">
                        Notice scheduled · Parent-teacher meeting
                      </div>
                      <div className="text-[10px] text-ink-3 truncate">
                        248 guardians · sends 14 May 9:00 AM
                      </div>
                    </div>
                    <Badge variant="info" size="sm">
                      Draft
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex absolute -top-4 -right-5 lg:-right-7 bg-surface border border-border rounded-xl px-3.5 py-2.5 shadow-lg items-center gap-2.5 rotate-2">
                <Tile tone="success" icon={CheckCircle2} size={28} />
                <div>
                  <div className="text-[11px] text-ink-3">Auto-saved</div>
                  <div className="text-[13px] font-semibold">
                    Roll call · Class 8-B
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex absolute -bottom-5 -left-5 lg:-left-8 bg-surface border border-border rounded-xl px-3.5 py-2.5 shadow-lg items-center gap-2.5 -rotate-2">
                <Tile tone="brand" icon={Send} size={28} />
                <div>
                  <div className="text-[11px] text-ink-3">Just now</div>
                  <div className="text-[13px] font-semibold">
                    248 SMS delivered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="border-y border-border bg-bg-2">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-6 flex items-center gap-6 overflow-x-auto">
          <span className="text-[11px] text-ink-3 uppercase tracking-[0.08em] font-semibold whitespace-nowrap">
            Powering schools across
          </span>
          <div className="flex gap-8 lg:gap-10 items-center flex-1 justify-around min-w-fit">
            {trustNames.map((n) => (
              <span
                key={n}
                className="serif italic text-[16px] sm:text-[18px] text-ink-3 whitespace-nowrap"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION HEADER */}
      <section id="features" className="pt-20 pb-8 px-5 sm:px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          <Eyebrow>Everything you need</Eyebrow>
          <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-semibold tracking-[-0.025em] mt-2.5 leading-[1.05]">
            One platform.
            <br />
            <span className="serif italic font-normal">Every part</span> of
            school operations.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-ink-2 mt-4 max-w-[620px] mx-auto leading-[1.55]">
            Replace seven disconnected tools with one workspace. From the front
            office to the staff room to the parent's pocket.
          </p>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-[1200px] mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-surface border border-border rounded-[14px] p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <Tile tone={f.tone} icon={f.icon} size={40} />
              <h3 className="text-[17px] font-semibold mt-4 tracking-tight">
                {f.title}
              </h3>
              <p className="text-[14px] text-ink-2 mt-2 leading-[1.55]">
                {f.description}
              </p>
              <span className="text-[13px] text-brand font-medium mt-3.5 inline-flex items-center gap-1">
                Learn more <ArrowRight size={13} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <section className="px-5 sm:px-8 py-20 border-t border-border bg-bg-2">
        <div className="max-w-[1200px] mx-auto text-center">
          <Eyebrow>By the numbers</Eyebrow>
          <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.025em] mt-2">
            What schools are seeing
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {stats.map((m) => (
              <div
                key={m.l}
                className="bg-surface border border-border rounded-[14px] p-7 text-left"
              >
                <div className="serif italic text-[44px] sm:text-[56px] text-brand tracking-tight leading-none">
                  {m.v}
                </div>
                <div className="text-[15px] font-semibold mt-3.5">{m.l}</div>
                <div className="text-ink-3 text-[13px] mt-1">{m.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-5 sm:px-8 py-20 border-t border-border">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center">
            <Eyebrow>Onboarding</Eyebrow>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-semibold tracking-[-0.025em] mt-2">
              Live in a week, not a quarter
            </h2>
            <p className="text-[15px] sm:text-[16px] text-ink-2 mt-3 max-w-[520px] mx-auto leading-[1.55]">
              We've done this with hundreds of schools. Here's the path most
              take.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="serif italic text-[44px] sm:text-[56px] text-brand-soft-2 tracking-tight leading-none">
                  {s.n}
                </div>
                <h3 className="text-[17px] font-semibold mt-4 tracking-tight">
                  {s.t}
                </h3>
                <p className="text-[14px] text-ink-2 mt-2 leading-[1.55]">
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="px-5 sm:px-8 py-20 border-t border-border bg-bg-2">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center">
            <Eyebrow>Customers</Eyebrow>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-semibold tracking-[-0.025em] mt-2">
              What principals say
            </h2>
          </div>

          {/* Featured */}
          <div className="mt-12 bg-surface border border-border rounded-2xl p-8 sm:p-12 grid lg:grid-cols-[1fr_220px] gap-8 lg:gap-12 items-center">
            <div>
              <p className="serif text-[20px] sm:text-[28px] leading-[1.35] text-ink tracking-tight">
                "We replaced three vendors and a tangle of spreadsheets. Fee
                collection went from a week of work to a single afternoon. The
                teachers were the surprise — they actually like the attendance
                flow."
              </p>
              <div className="flex items-center gap-3 mt-7">
                <InitialsAvatar name="Meera Singh" size="lg" tone="brand" />
                <div>
                  <div className="font-semibold text-[15px]">
                    Mrs. Meera Singh
                  </div>
                  <div className="text-ink-3 text-[13px]">
                    Principal · Rainbow Kids School, Pune
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:border-l border-border lg:pl-8">
              <div className="serif italic text-[44px] sm:text-[48px] text-brand leading-none">
                92%
              </div>
              <div className="text-ink-3 text-[13px] mt-1.5">
                reduction in fee-related queries
              </div>
              <div className="h-px bg-divider my-4" />
              <div className="serif italic text-[44px] sm:text-[48px] text-teal leading-none">
                4.2hrs
              </div>
              <div className="text-ink-3 text-[13px] mt-1.5">
                saved per teacher / week
              </div>
            </div>
          </div>

          {/* Trio */}
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.n}
                className="bg-surface border border-border rounded-[14px] p-6"
              >
                <p className="text-[14px] leading-[1.6] text-ink">"{t.q}"</p>
                <div className="flex items-center gap-3 mt-5">
                  <InitialsAvatar name={t.n} size="md" tone={t.tone} />
                  <div>
                    <div className="font-semibold text-[13px]">{t.n}</div>
                    <div className="text-ink-3 text-[12px]">{t.r}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-5 sm:px-8 py-20 border-t border-border">
        <div className="max-w-[1080px] mx-auto">
          <div className="text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[40px] font-semibold tracking-[-0.025em] mt-2">
              One price per student. No surprises.
            </h2>
            <p className="text-[15px] sm:text-[16px] text-ink-2 mt-3 leading-[1.55] max-w-[540px] mx-auto">
              Pick a plan based on how you communicate with parents. Switch
              anytime.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-12">
            {plans.map((p) => (
              <div
                key={p.n}
                className={
                  p.highlight
                    ? "bg-ink text-white border border-ink rounded-2xl p-7 relative"
                    : "bg-surface text-ink border border-border rounded-2xl p-7 relative"
                }
              >
                {p.highlight && (
                  <span className="absolute -top-2.5 left-5 bg-brand text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-[0.06em]">
                    Most popular
                  </span>
                )}
                <div
                  className={`text-[14px] font-semibold ${p.highlight ? "text-white/70" : "text-ink-3"}`}
                >
                  {p.n}
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-[40px] sm:text-[44px] font-semibold tracking-[-0.02em]">
                    {p.p}
                  </span>
                  <span
                    className={`text-[13px] ${p.highlight ? "opacity-70" : "text-ink-3"}`}
                  >
                    {p.per}
                  </span>
                </div>
                <p
                  className={`text-[13px] mt-1.5 ${p.highlight ? "opacity-70" : "text-ink-3"}`}
                >
                  {p.d}
                </p>
                <div
                  className={`h-px my-5 ${p.highlight ? "bg-white/15" : "bg-divider"}`}
                />
                <ul className="flex flex-col gap-2.5">
                  {p.f.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-[13px]"
                    >
                      <Check
                        size={14}
                        className={
                          p.highlight ? "text-brand-soft-2" : "text-success"
                        }
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`w-full mt-7 ${p.highlight ? "bg-white text-ink hover:bg-white/90" : ""}`}
                >
                  <Link href="/auth/school">{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="px-5 sm:px-8 py-20 border-t border-border bg-ink text-white"
      >
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-[34px] sm:text-[44px] lg:text-[56px] font-semibold tracking-[-0.025em] leading-[1.05]">
            Bring your school{" "}
            <span className="serif italic font-normal text-brand-soft-2">
              online
            </span>
            .<br />
            We'll handle the migration.
          </h2>
          <p className="text-[15px] sm:text-[17px] text-[oklch(0.78_0.01_80)] mt-5 max-w-[540px] mx-auto leading-[1.55]">
            30-day free trial. No credit card. Cancel anytime. Migration and
            training included for every school.
          </p>
          <div className="flex flex-wrap gap-3 mt-9 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-white text-ink hover:bg-white/90"
            >
              <Link href="/auth/school">
                Start free trial <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-transparent text-white border border-[oklch(0.4_0.01_80)] hover:bg-white/5"
            >
              Book a demo
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-bg-2 px-5 sm:px-8 pt-12 pb-8">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-10">
          <div>
            <Logo size="md" />
            <p className="text-ink-3 text-[13px] mt-3.5 leading-[1.6] max-w-[280px]">
              The school management platform for modern Indian schools. Built
              with teachers, for teachers.
            </p>
            <div className="mt-5">
              <Badge variant="success" dot>
                All systems operational
              </Badge>
            </div>
          </div>
          {[
            {
              h: "Product",
              l: ["Features", "Pricing", "Integrations", "Changelog", "Roadmap"],
            },
            {
              h: "Solutions",
              l: [
                "For administrators",
                "For teachers",
                "For parents",
                "Multi-campus",
                "Boarding schools",
              ],
            },
            {
              h: "Resources",
              l: [
                "Documentation",
                "Help center",
                "API reference",
                "System status",
                "Onboarding",
              ],
            },
            {
              h: "Company",
              l: ["About", "Customers", "Careers", "Privacy", "Terms"],
            },
          ].map((c) => (
            <div key={c.h}>
              <div className="text-[13px] font-semibold mb-3">{c.h}</div>
              <ul className="flex flex-col gap-2">
                {c.l.map((i) => (
                  <li key={i} className="text-[13px] text-ink-2">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1200px] mx-auto mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center text-[12px] text-ink-3">
          <div>© 2026 Shiksha Tech · Made in India</div>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Cookies</span>
            <span>DPDP compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
