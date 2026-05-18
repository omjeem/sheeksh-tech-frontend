"use client";

import { useState } from "react";
import AuthShell from "@/components/common/auth-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTab } from "@/components/school/login-tab";
import { RegisterTab } from "@/components/school/register-tab";

export default function SchoolAuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [step, setStep] = useState(1);

  const resetStep = () => setStep(1);
  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <AuthShell
      rightHeader={
        <span className="text-[13px] text-ink-3">
          {activeTab === "login" ? (
            <>
              New school?{" "}
              <button
                onClick={() => {
                  setActiveTab("register");
                  resetStep();
                }}
                className="text-brand font-medium hover:underline"
              >
                Create account
              </button>
            </>
          ) : (
            <>
              Already a member?{" "}
              <button
                onClick={() => setActiveTab("login")}
                className="text-brand font-medium hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </span>
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v);
          resetStep();
        }}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="login">Sign in</TabsTrigger>
          <TabsTrigger value="register">Create workspace</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginTab />
        </TabsContent>
        <TabsContent value="register">
          <RegisterTab
            showLoginTab={() => setActiveTab("login")}
            step={step}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        </TabsContent>
      </Tabs>
    </AuthShell>
  );
}
