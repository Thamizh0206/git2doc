import { Github, FileText, Zap, Download } from "lucide-react";

const SimpleLanding = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Simple Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Git2Doc</h1>
                    </div>
                    <a
                        href="https://github.com/Manik0107/Git2Doc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                    >
                        <Github className="w-5 h-5" />
                        <span className="font-medium">GitHub</span>
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-20">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        AI-Powered Documentation Generator
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Transform your GitHub repositories into comprehensive technical documentation
                        with workflow diagrams and professional PDFs — automatically.
                    </p>
                </div>

                {/* CLI Instructions */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h3>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                1
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Clone the Repository</h4>
                                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                                    git clone https://github.com/Manik0107/Git2Doc.git
                                    <br />
                                    cd Git2Doc
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                2
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Install Dependencies</h4>
                                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                                    python -m venv venv
                                    <br />
                                    venv\Scripts\activate
                                    <br />
                                    pip install -r requirements.txt
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                3
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Configure API Keys</h4>
                                <p className="text-gray-600 mb-2">Create a <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> file with:</p>
                                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                                    GITHUB_ACCESS_TOKEN=your_github_token
                                    <br />
                                    OPENROUTER_API_KEY=your_openrouter_key
                                </div>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                4
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-2">Run the Generator</h4>
                                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-100">
                                    python main.py
                                </div>
                                <p className="text-gray-600 mt-2 text-sm">
                                    Enter your GitHub repository URL and let AI generate comprehensive documentation!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Lightning Fast</h3>
                        <p className="text-gray-600 text-sm">
                            Generate complete documentation in under 30 seconds
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Comprehensive Docs</h3>
                        <p className="text-gray-600 text-sm">
                            Detailed documentation with workflow diagrams
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                            <Download className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">PDF Export</h3>
                        <p className="text-gray-600 text-sm">
                            Professional PDFs with embedded high-res diagrams
                        </p>
                    </div>
                </div>

                {/* Output Files */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Files</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <code className="text-blue-600 font-mono text-sm">content.txt</code>
                            <p className="text-gray-600 text-sm mt-1">Markdown documentation</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <code className="text-blue-600 font-mono text-sm">technical_documentation.pdf</code>
                            <p className="text-gray-600 text-sm mt-1">Professional PDF</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <code className="text-blue-600 font-mono text-sm">project_workflow.json</code>
                            <p className="text-gray-600 text-sm mt-1">Workflow structure</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <code className="text-blue-600 font-mono text-sm">project_workflow_diagram.png</code>
                            <p className="text-gray-600 text-sm mt-1">Architecture diagram</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm mt-20">
                <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600">
                    <p>Made with ❤️ by developers, for developers</p>
                    <p className="text-sm mt-2">
                        <a href="https://github.com/Manik0107/Git2Doc" className="text-blue-600 hover:underline">
                            View on GitHub
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default SimpleLanding;
