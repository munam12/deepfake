
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function Navbar() {
  const location = useLocation();
  
  const links = [
    { href: '/', label: 'Home' },
    { href: '/news', label: 'News' },
    { href: '/detect', label: 'Detect' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            DeepFake Detector
          </Link>
          
          <div className="flex gap-4">
            {links.map((link) => (
              <Button
                key={link.href}
                variant={location.pathname === link.href ? 'default' : 'ghost'}
                asChild
              >
                <Link to={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
