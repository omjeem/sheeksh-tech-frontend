"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, User, School } from "lucide-react";
import Link from "next/link";
import { LoginTab } from "@/components/school/login-tab";
import { RegisterTab } from "@/components/school/register-tab";

export default function SheekshaAuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [step, setStep] = useState(1);

  const resetStep = () => setStep(1);
  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="h-screen bg-gradient-to-br from-chart-1/5 via-background to-chart-2/5">
      {/* Header */}
      <header className="bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
              Sheeksha Tech
            </span>
          </div>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" /> Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent block">
              Let's Get Started ✨
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy schools with Sheeksha Tech! 🌈
          </p>
        </div>

        <Card className="shadow-2xl border-2 border-chart-1/20 bg-card/80 backdrop-blur-sm">
          <Tabs
            value={activeTab}
            onValueChange={(v) => {
              setActiveTab(v);
              resetStep();
            }}
          >
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 mb-6 bg-chart-1/10 rounded-full p-1">
              {[
                { value: "login", icon: User, text: "Welcome Back! 👋" },
                {
                  value: "register",
                  icon: School,
                  text: "Join Our Family! 🎉",
                },
              ].map(({ value, icon: Icon, text }) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`rounded-full p-3 transition flex items-center justify-center gap-2 ${
                    activeTab === value
                      ? "bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {text}
                </button>
              ))}
            </div>

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
        </Card>

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            "🔒 Secure & Safe",
            "⚡ Quick Setup",
            "🎯 Easy to Use",
            "💝 Made with Love",
          ].map((t, i) => (
            <div key={i}>
              <div className="text-2xl mb-2">{t.split(" ")[0]}</div>
              <div className="text-sm text-muted-foreground">
                {t.split(" ").slice(1).join(" ")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
