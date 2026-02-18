import { useState, useEffect } from "react";
import { Menu, X, Github, FileText, Sparkles } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-200/50"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Git2Doc
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">AI Documentation</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#how-it-works"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="#examples"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors relative group"
            >
              Examples
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </a>
            <a
              href="https://github.com/Thamizh0206/git2doc.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition-all duration-300 hover:scale-105"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105">
              <Sparkles className="w-5 h-5" />
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl">
          <div className="px-4 py-6 space-y-4">
            <a
              href="#features"
              className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#examples"
              className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Examples
            </a>
            <a
              href="https://github.com/Thamizh0206/git2doc.git"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg">
              <Sparkles className="w-5 h-5" />
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
