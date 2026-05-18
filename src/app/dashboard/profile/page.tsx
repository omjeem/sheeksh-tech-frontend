"use client";

import {
  CalendarIcon,
  Clock,
  Edit3,
  Key,
  Mail,
  Package,
  Phone,
  Shield,
} from "lucide-react";
import useSWR from "swr";
import { userService } from "@/services/userService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/common/page-header";
import SectionCard from "@/components/common/section-card";
import InitialsAvatar from "@/components/common/initials-avatar";

interface UserProfile {
  id: string;
  role: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: user, isLoading } = useSWR("profile", userService.getProfile, {
    revalidateOnFocus: false,
  });

  return (
    <>
      <PageHeader
        title="My Profile"
        subtitle="View and manage your account details."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Profile" },
        ]}
      />

      {isLoading ? (
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <Skeleton className="h-[360px] rounded-xl" />
          <Skeleton className="h-[360px] rounded-xl" />
        </div>
      ) : !user ? (
        <div className="bg-surface border border-border rounded-xl p-10 text-center">
          <p className="text-danger-ink text-[14px]">
            Failed to load profile. Please try again.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_320px] gap-4">
          <SectionCard
            title="Personal information"
            subtitle="This is how the school knows you."
            actions={
              <Button size="sm" variant="secondary">
                <Edit3 size={13} /> Edit
              </Button>
            }
          >
            <div className="flex items-center gap-4 mb-6">
              <InitialsAvatar
                name={`${user.firstName} ${user.lastName}`}
                size="xl"
                tone="brand"
              />
              <div>
                <div className="text-[20px] font-semibold tracking-tight">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[14px] text-ink-3">{user.email}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="brand">{user.role}</Badge>
                  <Badge variant="success" dot>
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
                  />
                  <Input
                    defaultValue={user.email}
                    disabled
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>Phone</Label>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
                  />
                  <Input
                    defaultValue={user.phone || ""}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>Date of birth</Label>
                <div className="relative">
                  <CalendarIcon
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
                  />
                  <Input
                    defaultValue={
                      user.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : ""
                    }
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <Label>Member since</Label>
                <div className="relative">
                  <Clock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
                  />
                  <Input
                    defaultValue={
                      user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : ""
                    }
                    disabled
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="flex flex-col gap-4">
            <SectionCard title="Security" noPadding>
              <div className="p-2">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-2 cursor-pointer transition-colors">
                  <Key size={15} className="text-ink-3" />
                  <span className="text-[13px] flex-1">Change password</span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-2 cursor-pointer transition-colors">
                  <Shield size={15} className="text-ink-3" />
                  <span className="text-[13px] flex-1">Two-factor auth</span>
                  <Badge variant="success">On</Badge>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-2 cursor-pointer transition-colors">
                  <Package size={15} className="text-ink-3" />
                  <span className="text-[13px] flex-1">Active sessions</span>
                  <span className="text-[12px] text-ink-3">2 devices</span>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Preferences">
              <div className="flex flex-col gap-3">
                {[
                  { label: "Email digest", on: true },
                  { label: "Critical SMS alerts", on: true },
                  { label: "Browser notifications", on: false },
                  { label: "Dark mode", on: false },
                ].map((p) => (
                  <div
                    key={p.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[13px]">{p.label}</span>
                    <Switch defaultChecked={p.on} />
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      )}
    </>
  );
}
