import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, TrendingUp, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: MapPin,
      title: "Report Local Issues",
      description: "Easily report potholes, water leaks, power outages, and more with just a few clicks."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Upvote existing reports to show support and prevent duplicate submissions."
    },
    {
      icon: TrendingUp,
      title: "Priority Tracking",
      description: "Issues are automatically prioritized based on severity and community engagement."
    },
    {
      icon: CheckCircle,
      title: "Real-time Updates",
      description: "Track the status of your reports from submission to resolution."
    }
  ];

  const stats = [
    { value: "1,234", label: "Issues Reported" },
    { value: "892", label: "Issues Resolved" },
    { value: "72%", label: "Resolution Rate" },
    { value: "5,678", label: "Active Citizens" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              <Zap className="w-3 h-3 mr-1" />
              Empowering Communities
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Fix Your Community,
              <span className="text-primary block mt-2">One Report at a Time</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of citizens making a difference. Report local issues, track progress, 
              and help build a better community together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/report">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Report an Issue
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/map">
                  <MapPin className="mr-2 h-5 w-5" />
                  View Issue Map
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary/5 border-y">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform makes it simple to report issues and track their resolution
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg opacity-90">
              Start reporting issues in your community today and help create positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8">
                <Link to="/report">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 FixIt Civic Platform. Empowering communities through technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
