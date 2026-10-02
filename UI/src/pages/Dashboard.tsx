import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Github,
  Download,
  Eye,
  Trash2,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Bell,
  X,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import documentsService, { Document as ApiDocument, GenerateDocumentData } from "@/services/documentsService";

const Dashboard = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewDocPanel, setShowNewDocPanel] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      console.log('🔐 Not authenticated, redirecting to login');
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Load documents only when user is authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log('✅ User authenticated, loading documents');
      const pendingRepoUrl = sessionStorage.getItem("git2doc:pending-repo-url");
      if (pendingRepoUrl) {
        sessionStorage.removeItem("git2doc:pending-repo-url");
        setGithubUrl(pendingRepoUrl);
        setIsGenerating(true);
        setError("");
        documentsService.generate({ repo_url: pendingRepoUrl })
          .then(loadDocuments)
          .catch((err: unknown) => {
            setError(err instanceof Error ? err.message : "Failed to start documentation generation");
          })
          .finally(() => setIsGenerating(false));
      } else {
        loadDocuments();
      }
    }
  }, [user, authLoading]);

  const loadDocuments = async () => {
    if (!user) {
      console.log('⚠️  No user, skipping document load');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📄 Loading documents for user:', user.email);
      const docs = await documentsService.getAll();
      console.log('✅ Documents loaded:', docs.length);
      setDocuments(docs);
      if (docs[0]?.status === "failed") {
        const status = await documentsService.checkStatus(docs[0].id);
        setError(status.message || "The latest documentation generation failed. Check the backend logs.");
      } else {
        setError("");
      }
    } catch (err: any) {
      console.error("❌ Failed to load documents:", err);
      setError(err.response?.data?.detail || "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for document status updates
  useEffect(() => {
    const processingDocs = documents.filter(doc => doc.status === "processing");
    if (processingDocs.length === 0) return;

    const interval = setInterval(async () => {
      for (const doc of processingDocs) {
        try {
          const status = await documentsService.checkStatus(doc.id);
          if (status.status !== "processing") {
            if (status.status === "failed") {
              setError(status.message || "Documentation generation failed. Check the backend logs.");
            }
            loadDocuments();
          }
        } catch (err) {
          console.error(`Failed to check status for doc ${doc.id}`, err);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [documents]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filteredDocs = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.github_repo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!githubUrl.trim()) {
      setError("Please enter a GitHub URL");
      return;
    }

    try {
      setIsGenerating(true);
      setError("");

      const data: GenerateDocumentData = {
        repo_url: githubUrl,
        prompt: prompt || undefined
      };

      await documentsService.generate(data);

      setShowNewDocPanel(false);
      setGithubUrl("");
      setPrompt("");

      await loadDocuments();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate document");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (doc: ApiDocument) => {
    try {
      const blob = await documentsService.download(doc.id);
      documentsService.downloadFile(blob, doc.name || `document-${doc.id}.pdf`);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to download document");
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      await documentsService.delete(docId);
      await loadDocuments();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to delete document");
    }
  };

  // Wait for auth to load
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Redirect if not authenticated (will happen via useEffect, but this prevents flash)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Git2Doc</span>
          </Link>
          <span className="text-sm text-muted-foreground ml-4">Welcome, <span className="font-medium text-foreground">{user?.fullName || "Guest"}</span></span>
        </div>
        <div className="flex items-center gap-4 flex-1 justify-center max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>
          <button
            className="btn-primary text-sm py-2"
            onClick={() => setShowNewDocPanel(true)}
          >
            <Plus className="w-4 h-4" /> New Document
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* New Document Panel */}
        {showNewDocPanel && (
          <div className="mb-8 card-solid p-6 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Github className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Generate New Documentation</h3>
                  <p className="text-sm text-muted-foreground">Transform your repository into professional docs</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewDocPanel(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* GitHub URL Input */}
              <div>
                <label className="block text-sm font-medium mb-2">GitHub Repository URL</label>
                <div className="relative">
                  <Github className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-base"
                  />
                </div>
              </div>

              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Documentation Instructions <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="E.g., Focus on the API endpoints and include code examples. Add a getting started section for new developers..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-base"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Tell the AI what to focus on, what sections to include, or any specific requirements for your documentation.
                </p>
              </div>

              {/* Generate Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowNewDocPanel(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!githubUrl.trim() || isGenerating}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Documentation
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-solid p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Documents</p>
            <p className="text-3xl font-bold">{documents.length}</p>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </div>
          <div className="card-solid p-6">
            <p className="text-sm text-muted-foreground mb-1">Processing</p>
            <p className="text-3xl font-bold">{documents.filter(d => d.status === "processing").length}</p>
            <p className="text-xs text-muted-foreground mt-2">In progress</p>
          </div>
          <div className="card-solid p-6">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-3xl font-bold">{documents.filter(d => d.status === "completed").length}</p>
            <p className="text-xs text-muted-foreground mt-2">Ready to download</p>
          </div>
          <div className="card-solid p-6">
            <p className="text-sm text-muted-foreground mb-1">Pages Generated</p>
            <p className="text-3xl font-bold">{documents.reduce((sum, d) => sum + (d.status === "completed" ? d.pages || 0 : 0), 0)}</p>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </div>
        </div>

        {/* Recent Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Documents</h2>
            <a href="#" className="text-sm text-primary hover:underline">View all</a>
          </div>

          <div className="card-solid overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Document</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground hidden md:table-cell">Repository</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground hidden lg:table-cell">Pages</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground hidden lg:table-cell">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-muted-foreground">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                      <p className="text-muted-foreground">Loading documents...</p>
                    </td>
                  </tr>
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">
                        {searchQuery ? "No documents match your search" : "No documents yet. Click 'New Document' to get started!"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.status === "completed" ? "bg-accent-green/20" :
                            doc.status === "processing" ? "bg-primary/20" :
                              "bg-red-500/20"
                            }`}>
                            {doc.status === "processing" ? (
                              <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            ) : (
                              <FileText className={`w-5 h-5 ${doc.status === "completed" ? "text-accent-green" : "text-red-400"}`} />
                            )}
                          </div>
                          <div>
                            <span className="font-medium block">
                              {doc.status === "failed" ? "Generation failed" : doc.name}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">{doc.status}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Github className="w-4 h-4" />
                          {doc.github_repo}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground hidden lg:table-cell">{doc.status === "completed" ? doc.pages || "-" : "-"}</td>
                      <td className="py-4 px-4 text-muted-foreground hidden lg:table-cell">{doc.status === "completed" ? doc.size || "-" : "-"}</td>
                      <td className="py-4 px-4 text-muted-foreground">{formatDate(doc.created_at)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {doc.status === "completed" && (
                            <button
                              onClick={() => handleDownload(doc)}
                              className="p-2 rounded-lg hover:bg-muted transition-colors text-accent-green"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 rounded-lg hover:bg-muted text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
