import { Github, Twitter, Linkedin, Mail, Heart, FileText } from "lucide-react";

const FooterSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Git2Doc
                </h3>
                <p className="text-xs text-muted-foreground -mt-1">AI Documentation Generator</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Transform your GitHub repositories into comprehensive technical documentation
              with AI-powered analysis, workflow diagrams, and professional PDFs.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Manik0107/Git2Doc"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:scale-110 group"
              >
                <Github className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              </a>
              <a
                href="#"
                className="p-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:scale-110 group"
              >
                <Twitter className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              </a>
              <a
                href="#"
                className="p-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:scale-110 group"
              >
                <Linkedin className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              </a>
              <a
                href="mailto:contact@git2doc.com"
                className="p-3 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:scale-110 group"
              >
                <Mail className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#examples" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  Examples
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/Manik0107/Git2Doc" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} Git2Doc. Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>by developers, for developers</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-indigo-600 transition-colors">
                License
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
    </footer>
  );
};

export default FooterSection;
