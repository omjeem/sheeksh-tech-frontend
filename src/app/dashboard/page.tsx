"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSWR } from "@/hooks/useSWR";
import { classService } from "@/services/classService";
import { studentService } from "@/services/studentService";
import { teacherService } from "@/services/teacherService";
import { subjectService } from "@/services/subjectService";
import { sessionService } from "@/services/sessionService";
import PageHeader from "@/components/common/page-header";
import Stat from "@/components/common/stat";
import SectionCard from "@/components/common/section-card";
import Tile from "@/components/common/tile";
import InitialsAvatar from "@/components/common/initials-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  Bell,
  BookOpen,
  Bus,
  CheckCircle2,
  CreditCard,
  Download,
  GraduationCap,
  MessageSquare,
  Plus,
  UserPlus,
  Wallet,
} from "lucide-react";

const activityFeed = [
  {
    icon: UserPlus,
    tone: "brand" as const,
    title: "12 admissions awaiting review",
    desc: "Class 1 · 8 forms",
    time: "2h",
  },
  {
    icon: CreditCard,
    tone: "warning" as const,
    title: "Fee reminders sent",
    desc: "248 guardians · auto",
    time: "4h",
  },
  {
    icon: Bus,
    tone: "info" as const,
    title: "Route 4 delayed 20 min",
    desc: "Driver notified parents",
    time: "6h",
  },
  {
    icon: Award,
    tone: "success" as const,
    title: "Term 1 results published",
    desc: "Class 10 · 142 students",
    time: "1d",
  },
  {
    icon: Bell,
    tone: "teal" as const,
    title: "PTM reminder scheduled",
    desc: "Sends Fri 9:00 AM",
    time: "1d",
  },
];

const feeBreakdown = [
  { l: "Tuition", v: "₹9.2L", c: "var(--brand)" },
  { l: "Transport", v: "₹2.4L", c: "var(--teal)" },
  { l: "Activity & lab", v: "₹1.8L", c: "var(--warning)" },
  { l: "Exam fees", v: "₹1.2L", c: "var(--info)" },
];

const upcoming = [
  { d: "18", m: "May", t: "Parent-teacher meeting", s: "9:00 AM · All classes" },
  { d: "22", m: "May", t: "Summer term ends", s: "Auto-close timetables" },
  { d: "25", m: "May", t: "Annual day rehearsal", s: "Auditorium · 2:00 PM" },
  { d: "01", m: "Jun", t: "Fees due · Q2", s: "248 students" },
  { d: "10", m: "Jun", t: "Result publication", s: "Class 10 · Term 2" },
];

export default function DashboardPage() {
  const { data: classes } = useSWR("/class", () => classService.list());
  const { data: students } = useSWR("/student", () => studentService.list());
  const { data: teachersData } = useSWR("/teacher", () =>
    teacherService.list(),
  );
  const { data: subjects } = useSWR("/subject", () => subjectService.list());
  const { data: sessions } = useSWR("/session/active", () =>
    sessionService.list(),
  );

  const teachers = teachersData?.teachers ?? [];
  const studentCount = students?.length ?? 0;
  const classCount = classes?.length ?? 0;
  const teacherCount = teachers.length;
  const subjectCount = subjects?.length ?? 0;
  const sessionCount = sessions?.length ?? 0;

  // Real attendance & fees data isn't available — use dummy values that fit the design.
  const attendancePct = "94.2%";
  const pendingFees = "₹3.4L";
  const smsCredits = "1,842";

  const attendanceByClass = useMemo(
    () =>
      (classes ?? [])
        .slice(0, 8)
        .map((c: any, i: number) => ({
          l: c.name,
          v: 88 + ((i * 7) % 11),
        })),
    [classes],
  );

  return (
    <>
      <PageHeader
        title="Good morning, Om"
        subtitle="Here's what's happening at your school today."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Download size={14} /> Export report
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard/notifications">
                <Plus size={14} /> New notification
              </Link>
            </Button>
          </>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          label="Total students"
          value={studentCount > 0 ? studentCount.toLocaleString() : "1,248"}
          delta="+24 this month"
          icon={GraduationCap}
        />
        <Stat
          label="Present today"
          value={attendancePct}
          delta="+1.3% vs last week"
          icon={CheckCircle2}
        />
        <Stat
          label="Pending fees"
          value={pendingFees}
          delta="14 students"
          deltaDir="down"
          icon={Wallet}
          tone="warning"
        />
        <Stat
          label="SMS credits"
          value={smsCredits}
          delta="of 5,000 / month"
          icon={MessageSquare}
          tone="teal"
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-4 mt-4">
        <SectionCard
          title="Attendance · last 30 days"
          subtitle="Daily presence across all sections"
          noPadding
        >
          <div className="p-5">
            <svg viewBox="0 0 600 200" className="w-full h-[200px]">
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={40 + i * 40}
                  x2="600"
                  y2={40 + i * 40}
                  stroke="var(--divider)"
                />
              ))}
              <path
                d="M0 120 L20 100 L40 110 L60 80 L80 90 L100 60 L120 70 L140 55 L160 75 L180 50 L200 65 L220 40 L240 55 L260 30 L280 45 L300 35 L320 50 L340 30 L360 45 L380 25 L400 40 L420 30 L440 50 L460 25 L480 40 L500 20 L520 35 L540 18 L560 30 L580 15 L600 25 L600 200 L0 200 Z"
                fill="url(#ag)"
              />
              <path
                d="M0 120 L20 100 L40 110 L60 80 L80 90 L100 60 L120 70 L140 55 L160 75 L180 50 L200 65 L220 40 L240 55 L260 30 L280 45 L300 35 L320 50 L340 30 L360 45 L380 25 L400 40 L420 30 L440 50 L460 25 L480 40 L500 20 L520 35 L540 18 L560 30 L580 15 L600 25"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="1.8"
              />
              {["1", "8", "15", "22", "29", "6", "13"].map((d, i) => (
                <text
                  key={i}
                  x={i * 100}
                  y="195"
                  fontSize="10"
                  fill="var(--ink-3)"
                  textAnchor={i === 0 ? "start" : "middle"}
                >
                  {d}
                </text>
              ))}
            </svg>
          </div>
        </SectionCard>

        <SectionCard title="Today" noPadding>
          <div className="flex flex-col">
            {activityFeed.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3.5 hover:bg-bg-2 transition-colors"
              >
                <Tile tone={a.tone} icon={a.icon} size={32} />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate text-ink">
                    {a.title}
                  </div>
                  <div className="text-[12px] text-ink-3 truncate">
                    {a.desc}
                  </div>
                </div>
                <span className="text-[11px] text-ink-3 whitespace-nowrap">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Second row */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <SectionCard title="Fee collection · May">
          <div className="flex items-baseline gap-2">
            <div className="text-[28px] font-semibold tracking-tight tnum">
              ₹14.6L
            </div>
            <div className="text-[12px] text-ink-3">of ₹18L target</div>
          </div>
          <Progress value={81} className="mt-3" />
          <div className="flex flex-col gap-2 mt-4">
            {feeBreakdown.map((r) => (
              <div
                key={r.l}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-sm"
                    style={{ background: r.c }}
                  />
                  <span className="text-[13px]">{r.l}</span>
                </div>
                <span className="text-[13px] font-medium tnum">{r.v}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Attendance by class">
          <div className="flex flex-col gap-3">
            {(attendanceByClass.length
              ? attendanceByClass
              : [
                  { l: "Class 1", v: 98 },
                  { l: "Class 2", v: 95 },
                  { l: "Class 3", v: 92 },
                  { l: "Class 4", v: 89 },
                  { l: "Class 5", v: 94 },
                  { l: "Class 6", v: 91 },
                  { l: "Class 7", v: 88 },
                  { l: "Class 8", v: 90 },
                ]
            ).map((r) => (
              <div key={r.l}>
                <div className="flex justify-between mb-1">
                  <span className="text-[12px]">{r.l}</span>
                  <span className="text-[12px] text-ink-3 tnum">{r.v}%</span>
                </div>
                <Progress
                  value={r.v}
                  tone={r.v < 90 ? "warning" : "brand"}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Upcoming" noPadding>
          <div className="flex flex-col">
            {upcoming.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5">
                <div className="size-[42px] rounded-lg bg-surface-2 border border-border flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-semibold text-ink-3 uppercase">
                    {e.m}
                  </span>
                  <span className="text-[15px] font-semibold leading-none tnum">
                    {e.d}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium truncate text-ink">
                    {e.t}
                  </div>
                  <div className="text-[12px] text-ink-3 truncate">{e.s}</div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          {
            icon: BookOpen,
            label: "Classes",
            count: classCount || 38,
            href: "/dashboard/classes",
            tone: "brand" as const,
          },
          {
            icon: GraduationCap,
            label: "Students",
            count: studentCount || 1248,
            href: "/dashboard/students",
            tone: "teal" as const,
          },
          {
            icon: BookOpen,
            label: "Subjects",
            count: subjectCount || 12,
            href: "/dashboard/subjects",
            tone: "warning" as const,
          },
          {
            icon: GraduationCap,
            label: "Sessions",
            count: sessionCount || 1,
            href: "/dashboard/sessions",
            tone: "info" as const,
          },
        ].map((q) => (
          <Link
            key={q.label}
            href={q.href}
            className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
          >
            <Tile tone={q.tone} icon={q.icon} size={36} />
            <div className="min-w-0">
              <div className="text-[12px] text-ink-3">{q.label}</div>
              <div className="text-[20px] font-semibold tnum">
                {q.count.toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-[12px] text-ink-3 mt-6">
        {`Workspace summary: ${classCount} classes · ${teacherCount} teachers · ${studentCount} students`}
      </p>
    </>
  );
}
