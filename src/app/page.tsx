import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  CreditCard,
  Clock,
  FileText,
  Users,
  Award,
  Bus,
  Star,
  ArrowRight,
  Smile,
  Heart,
  Apple,
  Palette,
  Sun,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

const SheekshaTechLanding = () => {
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-chart-1" />,
      title: "Teacher & Student Dashboard",
      description:
        "Easy-to-use dashboards that make learning and teaching a joy for everyone.",
      color: "bg-chart-1/10 border-chart-1/30",
    },
    {
      icon: <Calendar className="w-8 h-8 text-chart-2" />,
      title: "Class Schedule",
      description:
        "Keep track of classes with colorful, easy-to-read schedules that kids love.",
      color: "bg-chart-2/10 border-chart-2/30",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-chart-3" />,
      title: "Homework Management",
      description:
        "Make homework fun and organized with our friendly assignment system.",
      color: "bg-chart-3/10 border-chart-3/30",
    },
    {
      icon: <CreditCard className="w-8 h-8 text-chart-4" />,
      title: "Fees Management",
      description:
        "Simple and stress-free fee management for parents and schools.",
      color: "bg-chart-4/10 border-chart-4/30",
    },
    {
      icon: <Clock className="w-8 h-8 text-chart-5" />,
      title: "Timetable",
      description:
        "Beautiful timetables that help students stay on track with their day.",
      color: "bg-chart-5/10 border-chart-5/30",
    },
    {
      icon: <FileText className="w-8 h-8 text-primary" />,
      title: "Gate Pass",
      description:
        "Safe and secure gate pass system that keeps children protected.",
      color: "bg-primary/10 border-primary/30",
    },
    {
      icon: <Users className="w-8 h-8 text-accent-foreground" />,
      title: "Student Information",
      description:
        "Keep all student details organized and easily accessible for teachers.",
      color: "bg-accent border-accent/50",
    },
    {
      icon: <Award className="w-8 h-8 text-chart-1" />,
      title: "Exam Report Card",
      description:
        "Celebrate achievements with beautiful, detailed report cards.",
      color: "bg-chart-1/15 border-chart-1/40",
    },
    {
      icon: <Bus className="w-8 h-8 text-destructive" />,
      title: "Transport Management",
      description:
        "Safe school bus tracking so parents know their kids are secure.",
      color: "bg-destructive/10 border-destructive/30",
    },
  ];

  const testimonials = [
    {
      quote:
        "Our students love how colorful and easy everything is! The teachers say it's made their work so much more enjoyable.",
      author: "Mrs. Meera Singh",
      role: "Principal, Rainbow Kids School",
      rating: 5,
      avatar: "🌈",
    },
    {
      quote:
        "Parents are so happy with the clear updates and communication. It feels like we're all one big family now!",
      author: "Mr. Amit Gupta",
      role: "Vice Principal, Little Stars Academy",
      rating: 5,
      avatar: "⭐",
    },
    {
      quote:
        "The children actually get excited about checking their homework and schedules. It's wonderful to see!",
      author: "Dr. Kavya Nair",
      role: "Academic Head, Sunshine School",
      rating: 5,
      avatar: "☀️",
    },
  ];

  const stats = [
    { number: "500+", label: "Happy Schools", icon: "🏫" },
    { number: "50K+", label: "Smiling Students", icon: "😊" },
    { number: "2K+", label: "Caring Teachers", icon: "👩‍🏫" },
    { number: "99.9%", label: "Parents Trust Us", icon: "💝" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-chart-1/5 via-background to-chart-2/5">
      {/* Header */}
      <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                Sheeksha Tech
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
              >
                Stories
              </Link>
              <Link
                href="#contact"
                className="text-muted-foreground hover:text-chart-2 transition-colors font-medium"
              >
                Contact
              </Link>
            </nav>

            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="cursor-pointer">
                    Step Into Sheeksha
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-44 p-2">
                    <NavigationMenuLink
                      href="/auth/school"
                      className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors flex-row"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>As School</span>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      href="#"
                      className="flex items-center gap-2 p-3 rounded-md hover:bg-accent transition-colors flex-row"
                    >
                      <Users className="w-4 h-4" />
                      As Parent
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-chart-4/10 to-chart-2/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0">
              <Badge className="mb-6 bg-gradient-to-r from-chart-1/20 to-chart-2/20 text-chart-1 hover:from-chart-1/30 hover:to-chart-2/30 rounded-full px-4 py-2 border-chart-1/30">
                <Smile className="w-4 h-4 mr-2" />
                Loved by 500+ Schools 💕
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Making School Management
                <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent block">
                  Fun & Simple! ✨
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                A friendly school management system that brings joy to learning!
                Help teachers teach better, students learn happier, and parents
                stay connected 🌟
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-primary-foreground px-8 py-3 text-lg rounded-full shadow-lg group"
                >
                  Let&apos;s Get Started! 🚀
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-3 text-lg rounded-full"
                >
                  Watch Demo 📺
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-tr from-chart-1 via-chart-2 to-chart-3 rounded-3xl p-6 shadow-2xl transform hover:rotate-1 transition-transform duration-500">
                <div className="bg-card rounded-2xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-chart-4 to-chart-1 rounded-full flex items-center justify-center">
                      <span className="text-lg">📚</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        Today&apos;s Overview
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Let&apos;s see how we&apos;re doing! 😊
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Happy Students Today
                      </span>
                      <span className="text-sm font-semibold text-chart-4">
                        847/952 😊
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-gradient-to-r from-chart-4 to-chart-5 h-3 rounded-full w-4/5 relative">
                        <div className="absolute right-0 top-0 w-3 h-3 bg-background rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-chart-5/10 rounded-xl p-3 text-center border border-chart-5/20">
                      <div className="text-xl font-bold text-chart-5">24</div>
                      <div className="text-xs text-muted-foreground">
                        Fun Classes 🎯
                      </div>
                    </div>
                    <div className="bg-chart-4/10 rounded-xl p-3 text-center border border-chart-4/20">
                      <div className="text-xl font-bold text-chart-4">98%</div>
                      <div className="text-xs text-muted-foreground">
                        Attendance 🌟
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-chart-4/5 to-chart-2/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-chart-4/20 to-chart-1/20 text-chart-1 rounded-full px-4 py-2 border-chart-1/30">
              <Palette className="w-4 h-4 mr-2" />
              Amazing Features 🎨
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything to Make School Life
              <span className="bg-gradient-to-r from-chart-2 to-chart-3 bg-clip-text text-transparent">
                Wonderful! 🌈
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We&apos;ve packed everything you need into one friendly platform
              that everyone will love using! 💖
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${feature.color} border-2 hover:border-opacity-100`}
              >
                <CardHeader className="pb-4">
                  <div className="mb-4 group-hover:scale-110 group-hover:translate-x-3 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg text-card-foreground font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Toned Down */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-br from-chart-2/10 via-background to-chart-3/10 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-chart-2/5 to-chart-3/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-chart-2/20 text-chart-2 hover:bg-chart-2/30 rounded-full px-4 py-2 border-chart-2/30">
              <Heart className="w-4 h-4 mr-2" />
              Stories from Our Family 💕
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our School Family Says 👨‍👩‍👧‍👦
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              These happy stories from our school community warm our hearts
              every day! 🥰
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card/80 backdrop-blur-sm border-border hover:bg-card/90 transition-all duration-300 hover:scale-105 rounded-2xl shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-chart-4 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.author}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Toned Down */}
      <section className="py-20 bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-3/10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-chart-1/8 to-chart-2/8"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ready to Join Our Happy School Family? 🏫💕
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let&apos;s make school management fun and easy for everyone! Start
            your beautiful journey with us today 🌟
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-primary-foreground px-8 py-3 text-lg rounded-full shadow-lg group"
            >
              Start Free Trial 🚀
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg rounded-full border-2"
            >
              Schedule Demo 📞
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-secondary text-secondary-foreground py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                  Sheeksha Tech
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                Spreading joy in education with our friendly school management
                system. Making every day at school a little brighter! 🌈✨
              </p>
              <div className="flex space-x-4">
                <Button size="sm" variant="outline" className="rounded-full">
                  <Apple className="w-4 h-4 mr-2" />
                  Kid-Safe 🛡️
                </Button>
                <Button size="sm" variant="outline" className="rounded-full">
                  <Sun className="w-4 h-4 mr-2" />
                  Happy Platform 😊
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-chart-2">
                Our Features 🎯
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-chart-2 transition-colors">
                    Fun Dashboard 📊
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-chart-2 transition-colors">
                    Easy Scheduling 📅
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-chart-2 transition-colors">
                    Happy Reports 📈
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-chart-2 transition-colors">
                    Safe Transport 🚌
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-chart-3">
                Get Help 🤝
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-chart-3 transition-colors">
                    Help Center 💡
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-chart-3 transition-colors">
                    Fun Training 🎓
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-chart-3 transition-colors">
                    Chat With Us 💬
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-chart-3 transition-colors">
                    System Health 💚
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-muted-foreground">
              © 2025 Sheeksha Tech. Made with 💕 for schools everywhere!
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-chart-2 transition-colors"
              >
                Privacy 🔐
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-chart-2 transition-colors"
              >
                Terms 📋
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SheekshaTechLanding;
