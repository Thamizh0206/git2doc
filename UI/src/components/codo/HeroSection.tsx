import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, Github, Sparkles, FileText, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import documentsService from "@/services/documentsService";

const HeroSection = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGenerate = async () => {
    const trimmedRepoUrl = repoUrl.trim();
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedRepoUrl);
    } catch {
      setError("Enter a valid GitHub repository URL.");
      return;
    }

    if (parsedUrl.hostname !== "github.com" && parsedUrl.hostname !== "www.github.com") {
      setError("Enter a valid GitHub repository URL.");
      return;
    }

    if (parsedUrl.pathname.split("/").filter(Boolean).length < 2) {
      setError("Include both the GitHub owner and repository name.");
      return;
    }

    setError("");
    if (!user) {
      sessionStorage.setItem("git2doc:pending-repo-url", trimmedRepoUrl);
      navigate("/signup");
      return;
    }

    setIsGenerating(true);
    try {
      await documentsService.generate({ repo_url: trimmedRepoUrl });
      navigate("/dashboard");
    } catch (requestError: unknown) {
      const detail = axios.isAxiosError<{ detail?: string }>(requestError)
        ? requestError.response?.data?.detail
        : undefined;
      setError(detail || "Could not start documentation generation. Check that the API is running and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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
        <form
          className="max-w-2xl mx-auto mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
          onSubmit={(event) => {
            event.preventDefault();
            void handleGenerate();
          }}
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="repository-url"
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={!repoUrl.trim() || isGenerating}
                className="group/btn px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {isGenerating ? "Starting..." : "Get Started"}
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
              </button>
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-red-600 mt-3">{error}</p>}
          <p className="text-sm text-muted-foreground mt-4">
            Sign in or create an account to generate documentation.
          </p>
        </form>

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
