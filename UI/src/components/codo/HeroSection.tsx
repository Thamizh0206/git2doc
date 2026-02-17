import { useState } from "react";
import { ArrowRight, Github, Sparkles, FileText, Zap, Terminal, Copy, CheckCircle } from "lucide-react";

const HeroSection = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!repoUrl.trim()) return;
    setShowInstructions(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const setupCommands = `git clone https://github.com/Manik0107/Git2Doc.git
cd Git2Doc
python -m venv venv
venv\\Scripts\\activate
pip install -r requirements.txt
python main.py`;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-60" />

      {/* Floating Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-orange-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-glow" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-200/50 shadow-lg shadow-indigo-500/10 mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-900">AI-Powered Documentation Generator</span>
        </div>

        {/* Main Heading */}
        <h1 className="heading-hero mb-6 animate-fade-in-up">
          Transform Your
          <span className="block mt-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            GitHub Repositories
          </span>
          <span className="block mt-2">Into Beautiful Docs</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          Automatically generate comprehensive technical documentation with AI-powered analysis,
          workflow diagrams, and professional PDFs — all in seconds.
        </p>

        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={!repoUrl.trim()}
                className="group/btn px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            ✨ Free to use • No installation required • Generate unlimited docs
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900">Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-900">PDF Export</span>
          </div>
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">AI-Powered</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-gradient-to-b from-indigo-600 to-purple-600 animate-pulse" />
        </div>
      </div>

      {/* CLI Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInstructions(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100">
                <Terminal className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Quick Start Guide</h3>
                <p className="text-gray-600">Follow these steps to generate documentation</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">1. Setup (One-time)</h4>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm font-mono whitespace-pre">
                    {setupCommands}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(setupCommands)}
                    className="absolute top-2 right-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">2. Configure API Keys</h4>
                <p className="text-gray-600 text-sm mb-2">Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file with:</p>
                <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm font-mono">
                  GITHUB_ACCESS_TOKEN=your_token_here{'\n'}OPENROUTER_API_KEY=your_key_here
                </pre>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">3. Run & Enter Your Repository</h4>
                <p className="text-gray-600 text-sm mb-2">When prompted, enter:</p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-1">Repository URL:</p>
                  <p className="font-mono text-indigo-600 break-all">{repoUrl}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
