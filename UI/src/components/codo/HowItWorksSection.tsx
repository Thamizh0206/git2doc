import { Github, Brain, FileText, Download, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Github,
    title: "Enter Repository URL",
    description: "Simply paste your GitHub repository URL into the input field. Works with both public and private repositories.",
    color: "indigo",
  },
  {
    number: "02",
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI analyzes your entire codebase, understanding structure, dependencies, and relationships.",
    color: "purple",
  },
  {
    number: "03",
    icon: FileText,
    title: "Generate Documentation",
    description: "Comprehensive documentation is created automatically, including workflow diagrams and detailed explanations.",
    color: "pink",
  },
  {
    number: "04",
    icon: Download,
    title: "Export & Share",
    description: "Download your documentation as a professional PDF or share it directly with your team.",
    color: "cyan",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-gradient-to-b from-white via-indigo-50/30 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-grid" />
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-200 shadow-lg shadow-indigo-500/10 mb-6">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-sm font-semibold text-indigo-900">Simple Process</span>
          </div>
          <h2 className="heading-section mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Generate professional documentation in just four simple steps.
            No configuration required, no manual work needed.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 via-pink-200 to-cyan-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Step Card */}
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-gray-200">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`mb-6 inline-block p-4 rounded-2xl bg-gradient-to-br from-${step.color}-50 to-${step.color}-100 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-8 h-8 text-${step.color}-600`} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow Indicator (Desktop) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 z-20">
                      <ArrowRight className="w-6 h-6 text-indigo-300 animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-200 to-purple-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block p-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <div className="bg-white rounded-xl px-8 py-6">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                Ready to see it in action?
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105">
                Try It Now — It's Free!
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid {
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .bg-radial-gradient {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.8) 70%);
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
