import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Map, FileText, LayoutDashboard } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground font-bold text-xl">
            F
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">FixIt</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Button
            asChild
            variant={isActive('/') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive('/report') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/report">
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Report</span>
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive('/map') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/map">
              <Map className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Map</span>
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive('/dashboard') ? 'default' : 'ghost'}
            size="sm"
          >
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
