// app/dashboard/profile/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { userService } from "@/services/userService";

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
  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR("profile", userService.getProfile, {
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-destructive">
          Failed to load profile. Please try again.
        </p>
      </div>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const formattedDOB = new Date(user.dateOfBirth).toLocaleDateString();
  const formattedCreatedAt = new Date(user.createdAt).toLocaleDateString();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your account details.
          </p>
        </div>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {fullName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <p className="text-sm">{user.email}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Phone className="w-4 h-4" />
                Phone
              </div>
              <p className="text-sm">{user.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                Date of Birth
              </div>
              <p className="text-sm">{formattedDOB}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarIcon className="w-4 h-4" />
                Member Since
              </div>
              <p className="text-sm">{formattedCreatedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t">
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
