"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { 
      name: "Destinations", 
      href: "#destinations",
      dropdownItems: [
        { name: "Eco-Friendly", href: "#eco-friendly" },
        { name: "Popular", href: "#popular" },
        { name: "Adventure", href: "#adventure" },
      ]
    },
    { 
      name: "Travel Guides", 
      href: "#guides" 
    },
    { 
      name: "Blog",
      href: "#blog",
    },
    { 
      name: "Contact", 
      href: "#contact" 
    },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-4xl mx-auto">
        <div
          className={`flex items-center justify-between rounded-full transition-all duration-300 px-6 py-2
            ${
              isScrolled
                ? "bg-background/80 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-border/50"
                : "bg-background/50 backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:bg-background/80 transition-all duration-300"
            }`}
        >
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            Biliki AI
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdownItems ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                      {item.name}
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {item.dropdownItems.map((dropdownItem) => (
                        <DropdownMenuItem
                          key={dropdownItem.name}
                          className="cursor-pointer hover:bg-primary/5"
                          onClick={() => scrollToSection(dropdownItem.href)}
                        >
                          {dropdownItem.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-muted-foreground hover:text-primary transition-colors relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                  </button>
                )}
              </div>
            ))}
            <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105">
              Sign Up
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-primary/5"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 mx-auto max-w-4xl"
          >
            <div className="bg-background/95 backdrop-blur-sm rounded-2xl border border-border shadow-lg">
              <div className="px-4 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdownItems ? (
                      <div className="space-y-1">
                        <div className="px-3 py-2 text-base font-medium text-foreground">
                          {item.name}
                        </div>
                        {item.dropdownItems.map((dropdownItem) => (
                          <button
                            key={dropdownItem.name}
                            onClick={() => scrollToSection(dropdownItem.href)}
                            className="block w-full text-left px-6 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-lg"
                          >
                            {dropdownItem.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => scrollToSection(item.href)}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors rounded-lg"
                      >
                        {item.name}
                      </button>
                    )}
                  </div>
                ))}
                <div className="pt-2">
                  <Button className="w-full bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105">
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
