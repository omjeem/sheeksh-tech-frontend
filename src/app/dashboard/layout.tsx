// // app/dashboard/layout.tsx (Main Dashboard Layout)
// import LogoutBtn from "@/components/logout-btn";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   LogOut,
//   School,
//   Users,
//   Calendar,
//   BookOpen,
//   LayoutDashboard,
//   BookCopy,
// } from "lucide-react";
// import Link from "next/link";
// // import { useRouter } from "next/navigation";
// // import { useEffect } from "react";

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   // const router = useRouter();

//   // useEffect(() => {
//   //   const token = localStorage.getItem("authToken");
//   //   if (!token) router.push("/auth");
//   // }, [router]);

//   const handleLogout = () => {
//     localStorage.clear();
//     // router.push("/auth");
//   };

//   return (
// <div className="min-h-screen bg-gradient-to-br from-chart-1/5 via-background to-chart-2/5">
//       {/* Sidebar */}
//       <aside className="fixed left-0 top-0 h-full w-64 bg-card/90 backdrop-blur-md border-r border-border shadow-xl">
//         <div className="p-6">
//           <div className="flex items-center space-x-3 mb-8">
//             <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
//               <School className="w-6 h-6 text-primary-foreground" />
//             </div>
//             <span className="text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
//               Sheeksha Admin
//             </span>
//           </div>
//           <nav className="space-y-2">
//             {[
//               // { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
//               {
//                 icon: Calendar,
//                 label: "Sessions",
//                 href: "/dashboard/sessions",
//               },
//               { icon: BookOpen, label: "Classes", href: "/dashboard/classes" },
//               // { icon: Users, label: "Sections", href: "/dashboard/sections" },
//               { icon: Users, label: "Students", href: "/dashboard/students" },
//               { icon: Users, label: "Teachers", href: "/dashboard/teachers" },
//               {
//                 icon: BookCopy,
//                 label: "Subjects",
//                 href: "/dashboard/subjects",
//               },
//             ].map(({ icon: Icon, label, href }) => (
//               <Button
//                 key={href}
//                 variant="ghost"
//                 className="w-full justify-start text-left text-foreground hover:bg-chart-1/10 rounded-lg"
//                 asChild
//               >
//                 <Link href={href}>
//                   <Icon className="w-4 h-4 mr-3" />
//                   {label}
//                 </Link>
//               </Button>
//             ))}
//           </nav>
//         </div>
//         <div className="absolute bottom-6 left-6">
//           <LogoutBtn />
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="ml-64 p-8 h-screen">
//         <Card className="shadow-2xl border-2 border-chart-1/20 bg-card/80 backdrop-blur-sm p-6 h-full">
//           {children}
//         </Card>
//       </main>
//     </div>
//   );
// };

// export default DashboardLayout;

// app/dashboard/layout.tsx
"use client";

import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-chart-1/5 via-background to-chart-2/5 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Hamburger */}
        <header className="lg:hidden bg-card/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <span className="ml-4 text-lg font-semibold">Sheeksha Admin</span>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 max-lg:h-[calc(100vh-2rem)] h-full overflow-hidden">
          <Card className="shadow-2xl border-2 border-chart-1/20 bg-card/80 backdrop-blur-sm p-6 h-full">
            {children}
          </Card>
        </main>
      </div>
    </div>
  );
}
