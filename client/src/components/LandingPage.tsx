import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, Stethoscope, Users, Image as ImageIcon, MessageSquare, ArrowRight, BookOpen, FileText } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const onGetStarted = () => navigate('/signup');
  const onLogin = () => navigate('/login');

  const stats = [
    { label: "Verified Physicians", value: "185,000+" },
    { label: "Clinical Cases Logged", value: "2.4 Million" },
    { label: "Avg. Specialist Response", value: "14 Minutes" },
    { label: "Global Medical Centers", value: "920+" },
  ];

  const features = [
    {
      icon: <ImageIcon className="w-6 h-6 text-indigo-600" />,
      title: "Interactive Scan Uploads",
      desc: "Drag-and-drop high-definition DICOM, MRI, CT, and dermatological images. Share secure, compressed file-sets."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-teal-600" />,
      title: "Colleague Insights & Forum",
      desc: "Tag specialists, comment on files, bookmark interesting cases, and hold peer-to-peer discussions securely."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "HIPAA Compliant Sharing",
      desc: "Built with double AES-256 encryption. Integrated patient-deidentification layers ensure compliance by default."
    },
    {
      icon: <Users className="w-6 h-6 text-sky-600" />,
      title: "Specialty Board Review",
      desc: "Easily elevate challenging or anomalous cases directly to accredited international specialist advisory boards."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" id="landing-container">
      {/* Top Header/Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-black flex items-center justify-center shadow-sm">
            <span className="text-white text-xl font-bold">+</span>
          </div>
          <span className="text-base sm:text-xl font-extrabold tracking-tight font-display text-slate-900 truncate">MedConnect</span>
          <span className="hidden sm:inline text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 font-mono shrink-0">PORTAL</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Features</a>
          <a href="#compliance" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Compliance</a>
          <a href="#stats" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Global Network</a>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onLogin}
            className="px-3 sm:px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all"
            id="nav-login-btn"
          >
            Login
          </button>
          <button
            onClick={onGetStarted}
            className="px-3 sm:px-4 py-2 bg-black text-white hover:bg-slate-800 rounded-lg text-sm font-bold shadow-md shadow-slate-950/10 active:scale-95 transition-all whitespace-nowrap"
            id="nav-getstarted-btn"
          >
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Sign Up</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-20 text-center max-w-5xl mx-auto">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-emerald-100 rounded-full blur-3xl opacity-40" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-slate-200 rounded-full text-slate-600 text-xs font-semibold shadow-sm">
            <Activity className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            Empowering Clinical Case Collaboration
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 font-display leading-tight max-w-4xl mx-auto">
            The Professional Network for <span className="text-indigo-600">Clinical Excellence</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
            MedConnect enables verified physicians, specialists, and residents to securely share anamneses, discuss diagnostic challenges, and consult in real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl text-base font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              id="hero-getstarted-btn"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
             <button
               onClick={onLogin}
               className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl text-base font-bold shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
               id="hero-login-btn"
             >
               Login to Doctor Portal
             </button>
           </div>
        </motion.div>
      </section>

      {/* Network Stats Bar */}
      <section className="bg-white border-y border-slate-200 py-12 px-6" id="stats">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, idx) => (
            <div key={idx} className="text-center">
              <span className="block text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-display">{s.value}</span>
              <span className="block text-xs uppercase tracking-wider text-slate-400 font-bold mt-1.5">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">Built for Specialists</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 font-display mt-2">
            Clinical Tools, Designed with Precision
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Accelerate diagnostic accuracy and bridge knowledge gaps with zero-compromise security protocols.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all flex gap-4">
              <div className="p-3 bg-slate-50 rounded-xl h-fit shrink-0 border border-slate-100">
                {f.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-950 font-display">{f.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Compliance Callout */}
      <section className="bg-slate-950 text-white py-20 px-6 relative overflow-hidden" id="compliance">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="space-y-6 md:w-3/5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 border border-sky-400/20 rounded-full text-sky-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA & GDPR compliant
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              End-to-End Cryptographic Privacy
            </h3>
            <p className="text-white text-sm leading-relaxed">
              We understand that clinical details require utmost confidence. MedConnect employs direct patient-deidentification scans before upload. Any diagnostic image is fully scrubbed of metadata, personal identifying elements, and protected health information (PHI) securely before transmitting.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <FileText className="w-4 h-4 text-emerald-400" /> AES-256 Storage
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <BookOpen className="w-4 h-4 text-emerald-400" /> BAA Agreements Ready
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Stethoscope className="w-4 h-4 text-emerald-400" /> SOC2 Certified Platform
              </div>
            </div>
          </div>
          <div className="md:w-2/5 flex justify-center">
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-xl w-full max-w-xs text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-500/15 rounded-xl flex items-center justify-center mx-auto text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="block text-sm font-semibold text-white">Secure Server Enclave</span>
              <p className="text-xs text-white">
                Zero-Knowledge architecture. MedConnect engineers do not have administrative access to patient clinical scans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 font-display">
          Elevate Your Diagnostic Precision
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Create your verified doctor profile in seconds. Connect with peers, share expertise, and review medical developments.
        </p>
        <button
          onClick={onGetStarted}
          className="px-8 py-4 bg-black text-white hover:bg-slate-800 rounded-xl text-base font-bold shadow-lg shadow-slate-950/10 active:scale-95 transition-all inline-flex items-center gap-2 group"
          id="cta-bottom-btn"
        >
          Join MedConnect
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 px-6 py-8 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900">+ MedConnect</span>
            <span className="text-[10px] text-slate-400">© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-slate-400">
            <a href="#features" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#features" className="hover:text-slate-600">Terms of Service</a>
            <a href="#features" className="hover:text-slate-600">HIPAA Clause</a>
            <a href="#features" className="hover:text-slate-600">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
