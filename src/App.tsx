import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X, 
  ShieldCheck, 
  Calculator, 
  Users, 
  FileText, 
  BarChart3, 
  Clock, 
  ShoppingCart, 
  Receipt, 
  Package, 
  Barcode, 
  Building2, 
  Briefcase, 
  IndianRupee, 
  Star,
  PlayCircle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- UI Components ---

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm hover:shadow",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-500 shadow-sm",
    outline: "bg-transparent text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500",
    ghost: "bg-transparent text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
  };
  
  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, type, onLogin, onDemoBooked }: any) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'login') {
      if (email === 'admin@digitalsoftware.com' && password === 'admin123') {
        setIsSubmitted(true);
        onLogin({ name: 'Admin User', email });
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError('Invalid email or password. Try admin@digitalsoftware.com / admin123');
      }
    } else if (type === 'demo') {
      setIsSubmitted(true);
      onDemoBooked();
      setTimeout(() => {
        onClose();
        setTimeout(() => {
          document.getElementById('demo-presentation')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }, 2000);
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-8">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {type === 'login' ? 'Welcome back!' : type === 'demo' ? 'Demo Booked!' : 'Account Created!'}
                </h3>
                <p className="text-slate-500 mb-6">
                  {type === 'login' 
                    ? "You have successfully logged into your account." 
                    : type === 'demo'
                    ? "Our team will contact you shortly. Your demo presentation is now unlocked below!"
                    : "Your 14-day free trial has started. Check your email for login details."}
                </p>
                <Button className="w-full" onClick={onClose}>Close</Button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 mb-6">
                  {type === 'trial' 
                    ? "Start your 14-day free trial. No credit card required." 
                    : type === 'demo'
                    ? "Schedule a personalized walkthrough with our experts."
                    : "Enter your credentials to access your dashboard. (Try admin@digitalsoftware.com / admin123)"}
                </p>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                      {error}
                    </div>
                  )}

                  {type !== 'login' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="Rahul Sharma" />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Work Email</label>
                    <input 
                      required 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                      placeholder={type === 'login' ? "admin@digitalsoftware.com" : "rahul@company.com"} 
                    />
                  </div>

                  {type === 'login' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                      <input 
                        required 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                        placeholder="admin123" 
                      />
                    </div>
                  )}
                  
                  {type !== 'login' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                          +91
                        </span>
                        <input required type="tel" className="flex-1 px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" placeholder="98765 43210" />
                      </div>
                    </div>
                  )}
                  
                  {type === 'demo' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company Size</label>
                      <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white">
                        <option>1-10 Employees</option>
                        <option>11-50 Employees</option>
                        <option>51-200 Employees</option>
                        <option>201+ Employees</option>
                      </select>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button className="w-full" type="submit">
                      {type === 'trial' ? "Create Account" : type === 'demo' ? "Confirm Booking" : "Log In"}
                    </Button>
                    {type !== 'login' && (
                      <p className="text-xs text-center text-slate-500 mt-4">
                        By submitting, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// --- Sections ---

const Navbar = ({ onOpenModal, loggedInUser, onLogout }: any) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Digital<span className="text-indigo-600">Software</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#workflow" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Reviews</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {loggedInUser ? (
              <>
                <span className="text-sm font-medium text-slate-700">Hi, {loggedInUser.name}</span>
                <Button variant="ghost" className="px-4 py-2" onClick={onLogout}>Log out</Button>
              </>
            ) : (
              <Button variant="ghost" className="px-4 py-2" onClick={() => onOpenModal('login')}>Log in</Button>
            )}
            <Button className="px-5 py-2" onClick={() => onOpenModal('demo')}>Book Demo</Button>
          </div>

          <button className="md:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg py-4 px-4 flex flex-col space-y-4">
          <a href="#features" className="text-base font-medium text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          <a href="#workflow" className="text-base font-medium text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
          <a href="#pricing" className="text-base font-medium text-slate-700" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
            {loggedInUser ? (
              <>
                <span className="text-center text-sm font-medium text-slate-700">Hi, {loggedInUser.name}</span>
                <Button variant="secondary" className="w-full justify-center" onClick={() => { setIsMobileMenuOpen(false); onLogout(); }}>Log out</Button>
              </>
            ) : (
              <Button variant="secondary" className="w-full justify-center" onClick={() => { setIsMobileMenuOpen(false); onOpenModal('login'); }}>Log in</Button>
            )}
            <Button className="w-full justify-center" onClick={() => { setIsMobileMenuOpen(false); onOpenModal('demo'); }}>Book Demo</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onOpenModal }: any) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-300 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
            India's #1 Unified HRMS & Retail Billing Platform
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
          >
            Run your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Payroll & Retail</span> from one dashboard.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Automate PF/ESIC compliance, generate GST invoices instantly, and manage your workforce without the headache. Built specifically for Indian SMBs.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button className="w-full sm:w-auto text-lg px-8 py-4 group" onClick={() => onOpenModal('trial')}>
              Start 14-Day Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4" onClick={() => onOpenModal('demo')}>
              <PlayCircle className="mr-2 w-5 h-5 text-slate-500" />
              Book Live Demo
            </Button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 text-sm text-slate-500"
          >
            No credit card required. Setup in 5 minutes.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm font-medium text-slate-500"
          >
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> 100% GST Compliant</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> PF & ESIC Ready</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Bank-Grade Security</div>
          </motion.div>
        </div>

        {/* Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50 aspect-[16/9] relative">
              {/* Placeholder for actual dashboard image */}
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
                alt="Dashboard Preview" 
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSolution = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Running an SMB in India is hard enough.</h2>
          <p className="text-lg text-slate-600">Don't let manual paperwork, compliance penalties, and billing errors slow your growth.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Problem */}
          <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
            <h3 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
              <X className="w-6 h-6 text-red-500" /> The Old Way
            </h3>
            <ul className="space-y-4">
              {[
                "Manual salary calculations leading to errors and disputes.",
                "Missing PF/ESIC deadlines and facing heavy compliance penalties.",
                "Slow, error-prone manual GST billing at the retail counter.",
                "Using 3 different software tools that don't talk to each other."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-red-800">
                  <div className="mt-1 min-w-[20px]"><X className="w-5 h-5 text-red-400" /></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solution */}
          <div className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
            <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2 relative z-10">
              <CheckCircle2 className="w-6 h-6 text-indigo-600" /> The DigitalSoftware Way
            </h3>
            <ul className="space-y-4 relative z-10">
              {[
                "1-click automated payroll with zero calculation errors.",
                "Auto-generated PF, ESIC, and TDS challans to stay 100% compliant.",
                "Lightning-fast POS and instant GST invoice generation.",
                "One unified dashboard for your HR, inventory, and billing."
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-indigo-900">
                  <div className="mt-1 min-w-[20px]"><CheckCircle2 className="w-5 h-5 text-indigo-600" /></div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const hrFeatures = [
    { icon: <Users />, title: "Employee Management", desc: "Digital onboarding, document storage, and employee self-service portal." },
    { icon: <Calculator />, title: "Automated Payroll", desc: "1-click salary processing with automatic deductions and additions." },
    { icon: <ShieldCheck />, title: "PF & ESIC Compliance", desc: "Auto-calculate statutory deductions and generate ready-to-upload ECR files." },
    { icon: <FileText />, title: "Instant Payslips", desc: "Automatically email professional payslips to employees on payday." },
    { icon: <Clock />, title: "Attendance & Leaves", desc: "Track time, manage shifts, and handle leave requests seamlessly." },
    { icon: <BarChart3 />, title: "HR Analytics", desc: "Visual reports on headcount, attrition, and payroll expenses." },
  ];

  const billingFeatures = [
    { icon: <Receipt />, title: "GST Billing", desc: "Create B2B/B2C GST invoices in seconds with auto-calculated taxes." },
    { icon: <ShoppingCart />, title: "Fast POS System", desc: "Lightning-fast retail counter billing with keyboard shortcuts." },
    { icon: <Package />, title: "Inventory Management", desc: "Real-time stock tracking, low stock alerts, and purchase orders." },
    { icon: <Barcode />, title: "Barcode Support", desc: "Scan barcodes for quick billing and print custom barcode labels." },
    { icon: <IndianRupee />, title: "Payment Tracking", desc: "Track pending payments, send reminders, and manage cash flow." },
    { icon: <BarChart3 />, title: "Sales Reports", desc: "Daily sales summaries, GST reports (GSTR-1, GSTR-3B ready), and profit analysis." },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to run your business.</h2>
          <p className="text-lg text-slate-600">Powerful features designed specifically for the Indian regulatory environment.</p>
        </div>

        {/* HRMS Features */}
        <div className="mb-24">
          <div className="flex flex-col lg:flex-row gap-12 items-center mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Payroll & HRMS</h3>
              </div>
              <p className="text-lg text-slate-600 mb-8 max-w-xl">Manage your entire workforce from onboarding to exit. Automate salary calculations, ensure statutory compliance, and empower employees with self-service tools.</p>
            </div>
            <div className="flex-1 w-full">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80" alt="HR Management Dashboard" className="rounded-2xl shadow-xl w-full object-cover aspect-video" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hrFeatures.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Billing Features */}
        <div>
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center mb-12">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Retail & GST Billing</h3>
              </div>
              <p className="text-lg text-slate-600 mb-8 max-w-xl">Streamline your retail operations with our lightning-fast POS. Generate GST-compliant invoices, track inventory in real-time, and get actionable sales insights.</p>
            </div>
            <div className="flex-1 w-full">
              <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1000&q=80" alt="Retail POS System" className="rounded-2xl shadow-xl w-full object-cover aspect-video" referrerPolicy="no-referrer" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {billingFeatures.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Workflow = () => {
  const steps = [
    { num: "01", title: "Register Company", desc: "Add your GSTIN, PAN, and company details in a simple 2-minute setup." },
    { num: "02", title: "Add Data", desc: "Bulk import your employees and product inventory via Excel/CSV." },
    { num: "03", title: "Daily Operations", desc: "Mark attendance, manage leaves, and punch retail sales at the POS." },
    { num: "04", title: "Auto-Calculate", desc: "System automatically calculates monthly salaries and daily GST taxes." },
    { num: "05", title: "Generate & Comply", desc: "Send payslips, print invoices, and download ready-to-file GST/PF reports." },
  ];

  return (
    <section id="workflow" className="py-24 bg-slate-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How DigitalSoftware Works</h2>
          <p className="text-lg text-slate-400">A streamlined workflow designed to save you 40+ hours every month.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-xl font-bold text-indigo-400 mb-6 shadow-xl">
                  {step.num}
                </div>
                <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ onOpenModal }: any) => {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing.</h2>
          <p className="text-lg text-slate-600">Pay only for what you need. No hidden charges, no surprise fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Starter</h3>
            <p className="text-slate-500 text-sm mb-6">Perfect for small retail shops.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">₹999</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Up to 5 Employees", "Unlimited GST Invoices", "Basic POS System", "Email Support"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" onClick={() => onOpenModal('trial')}>Start Free Trial</Button>
          </div>

          {/* Professional */}
          <div className="bg-indigo-600 rounded-3xl p-8 border border-indigo-500 shadow-xl flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Professional</h3>
            <p className="text-indigo-200 text-sm mb-6">For growing businesses with compliance needs.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹2,499</span>
              <span className="text-indigo-200">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Up to 50 Employees", "PF & ESIC Automation", "Advanced Inventory", "Barcode Generation", "Priority Phone Support"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white text-sm">
                  <CheckCircle2 className="w-5 h-5 text-indigo-300 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50" onClick={() => onOpenModal('trial')}>Start Free Trial</Button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h3>
            <p className="text-slate-500 text-sm mb-6">For large operations with multiple branches.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-900">Custom</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited Employees", "Multi-branch Support", "Custom API Access", "Dedicated Account Manager", "On-premise Setup Option"].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full" onClick={() => onOpenModal('demo')}>Book Demo</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      quote: "Before DigitalSoftware, month-end payroll took us 3 days and we still made PF calculation errors. Now it takes 15 minutes. The GST billing is just a bonus for our retail outlet.",
      author: "Rajesh Kumar",
      role: "Director, Sharma Electronics",
      rating: 5
    },
    {
      quote: "The POS interface is incredibly fast. My counter staff learned it in 10 minutes. Plus, having employee attendance linked directly to payroll saves me so much headache.",
      author: "Priya Singh",
      role: "Owner, StyleBoutique",
      rating: 5
    },
    {
      quote: "We switched from using separate software for accounting and HR. DigitalSoftware unified everything. Their support team actually understands Indian compliance laws.",
      author: "Amit Patel",
      role: "HR Head, Apex Manufacturing",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by 5,000+ Indian Businesses</h2>
          <p className="text-lg text-slate-600">See what business owners and HR managers have to say.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 mb-8 italic">"{review.quote}"</p>
              <div>
                <p className="font-bold text-slate-900">{review.author}</p>
                <p className="text-sm text-slate-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">One Dashboard. Total Control.</h2>
          <p className="text-lg text-slate-400">Switch seamlessly between HR management and Retail billing with a single click.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* HR Dashboard Mock */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-4 text-xs font-medium text-slate-400">HR & Payroll View</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-white font-semibold">Payroll Run - Oct 2026</h4>
                    <p className="text-xs text-slate-400">45 Employees Processed</p>
                  </div>
                  <Button className="px-3 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600">Process Salary</Button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Rahul Sharma", role: "Sales Executive", net: "â¹45,000", status: "Processed" },
                    { name: "Priya Patel", role: "Store Manager", net: "â¹65,000", status: "Processed" },
                    { name: "Amit Kumar", role: "Cashier", net: "â¹25,000", status: "Pending" },
                  ].map((emp, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/50 border border-slate-600/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{emp.net}</p>
                        <p className={`text-[10px] font-medium ${emp.status === 'Processed' ? 'text-emerald-400' : 'text-amber-400'}`}>{emp.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Retail Dashboard Mock */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-4 text-xs font-medium text-slate-400">Retail POS & Billing View</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-white font-semibold">New Sale (INV-2026-089)</h4>
                    <p className="text-xs text-slate-400">Customer: Walk-in</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total Amount</p>
                    <p className="text-xl font-bold text-emerald-400">â¹4,250.00</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { item: "Wireless Mouse", qty: 2, price: "â¹1,500", tax: "18% GST" },
                    { item: "USB-C Cable", qty: 1, price: "â¹450", tax: "18% GST" },
                    { item: "Keyboard", qty: 1, price: "â¹2,300", tax: "18% GST" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-700/50 border border-slate-600/50">
                      <div>
                        <p className="text-sm font-medium text-white">{item.item}</p>
                        <p className="text-xs text-slate-400">Qty: {item.qty} | {item.tax}</p>
                      </div>
                      <p className="text-sm font-bold text-white">{item.price}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Generate GST Invoice</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const DemoPresentation = ({ isUnlocked }: { isUnlocked: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isUnlocked) return null;

  return (
    <section id="demo-presentation" className="py-24 bg-slate-900 text-white overflow-hidden relative border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold mb-6 border border-emerald-500/30"
          >
            <CheckCircle2 className="w-5 h-5" />
            Demo Successfully Unlocked
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">DigitalSoftware Interactive Demo</h2>
          <p className="text-lg text-slate-400">Watch the presentation below to see how DigitalSoftware can transform your business.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="aspect-video bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl relative flex items-center justify-center group"
        >
          {!isPlaying ? (
            <>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000')] opacity-40 bg-cover bg-center mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors"></div>
              
              <div className="relative z-10 text-center">
                <div 
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/30 group-hover:scale-110 transform duration-300"
                >
                  <PlayCircle className="w-10 h-10 text-white ml-1" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Product Walkthrough</h3>
                <p className="text-slate-300">12:45 Mins • Full Platform Overview</p>
              </div>
            </>
          ) : (
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/3QhU9jwSqMA?autoplay=1" 
              title="Product Walkthrough" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-2xl"
            ></iframe>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const TrustSection = () => {
  return (
    <section className="py-20 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Bank-Grade Security</h3>
            <p className="text-slate-600 text-sm">Your financial and employee data is encrypted with 256-bit AES encryption and hosted on secure AWS servers in Mumbai.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">100% Compliant</h3>
            <p className="text-slate-600 text-sm">Always up-to-date with the latest Indian tax laws. Automatically handles GST, TDS, PF, ESIC, and Professional Tax calculations.</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Dedicated Support</h3>
            <p className="text-slate-600 text-sm">Get help when you need it. Our India-based support team is available via phone, chat, and email during business hours.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CtaSection = ({ onOpenModal }: any) => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-600"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to simplify your business?</h2>
        <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
          Join thousands of Indian SMBs who have automated their payroll and billing. Setup takes less than 5 minutes.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-slate-50 text-lg px-8 py-4" onClick={() => onOpenModal('trial')}>
            Start Your Free Trial
          </Button>
          <Button className="w-full sm:w-auto bg-indigo-700 text-white hover:bg-indigo-800 border border-indigo-500 text-lg px-8 py-4" onClick={() => onOpenModal('demo')}>
            Book a Live Demo
          </Button>
        </div>
        <p className="mt-6 text-sm text-indigo-200">14-day free trial. No credit card required. Cancel anytime.</p>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Digital<span className="text-indigo-500">Software</span></span>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              The unified platform for Indian SMBs to manage payroll, compliance, and retail billing effortlessly.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Payroll HRMS</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GST Billing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Book Demo</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">PF/ESIC Calculator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GST Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 DigitalSoftware Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social Icons Placeholder */}
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
            <div className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 cursor-pointer"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const AboutUs = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About DigitalSoftware</h2>
          <p className="text-lg text-slate-600">We are on a mission to simplify business operations for Indian SMBs through powerful, intuitive, and compliant software.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Our Team" className="rounded-2xl shadow-lg" referrerPolicy="no-referrer" />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Empowering Businesses Since 2020</h3>
            <p className="text-slate-600">DigitalSoftware was founded with a simple idea: managing payroll, HR, and retail billing shouldn't require multiple disjointed systems. We built an all-in-one platform that brings everything together.</p>
            <p className="text-slate-600">Today, thousands of businesses across India trust us to handle their most critical operations, ensuring 100% compliance with GST, PF, and ESIC regulations.</p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-1">10k+</div>
                <div className="text-sm text-slate-500 font-medium">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600 mb-1">99.9%</div>
                <div className="text-sm text-slate-500 font-medium">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactUs = ({ loggedInUser }: { loggedInUser: any }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loggedInUser) {
      const names = loggedInUser.name?.split(' ') || [];
      setFirstName(names[0] || '');
      setLastName(names.slice(1).join(' ') || '');
      setEmail(loggedInUser.email || '');
    }
  }, [loggedInUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await addDoc(collection(db, 'contactMessages'), {
        firstName,
        lastName,
        email,
        message,
        isLoggedIn: !!loggedInUser,
        createdAt: serverTimestamp()
      });

      // Send email via backend API
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          message,
          isLoggedIn: !!loggedInUser
        }),
      });

      setSubmitSuccess(true);
      if (!loggedInUser) {
        setFirstName('');
        setLastName('');
        setEmail('');
      }
      setMessage('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-slate-600">Have questions? Our team is here to help you get started with DigitalSoftware.</p>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Email Us</h4>
                <p className="text-slate-600 mb-2">Our friendly team is here to help.</p>
                <a href="mailto:adarshsupport@dev2dev.in" className="text-indigo-600 font-medium hover:text-indigo-700">adarshsupport@dev2dev.in</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Call Us</h4>
                <p className="text-slate-600 mb-2">Mon-Fri from 9am to 6pm.</p>
                <a href="tel:+917089850933" className="text-indigo-600 font-medium hover:text-indigo-700">+91 7089850933</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">Office</h4>
                <p className="text-slate-600">123 Tech Park, Sector 4<br/>HSR Layout, Bengaluru<br/>Karnataka 560102, India</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-600">Thank you for reaching out. Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      required 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                      placeholder="First name" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      required 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                      placeholder="Last name" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Work Email</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                    placeholder="you@company.com" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <Button type="submit" className="w-full py-3 text-lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [modalState, setModalState] = useState({ isOpen: false, type: 'trial', title: '' });
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [isDemoUnlocked, setIsDemoUnlocked] = useState(false);

  const openModal = (type: 'trial' | 'demo' | 'login') => {
    let title = '';
    if (type === 'trial') title = 'Start Free Trial';
    else if (type === 'demo') title = 'Book a Live Demo';
    else if (type === 'login') title = 'Welcome Back';

    setModalState({
      isOpen: true,
      type,
      title
    });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleLogin = (user: any) => {
    setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  const handleDemoBooked = () => {
    setIsDemoUnlocked(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar onOpenModal={openModal} loggedInUser={loggedInUser} onLogout={handleLogout} />
      <main>
        <Hero onOpenModal={openModal} />
        <ProblemSolution />
        <Features />
        <Workflow />
        <DashboardPreview />
        <DemoPresentation isUnlocked={isDemoUnlocked} />
        <Pricing onOpenModal={openModal} />
        <Testimonials />
        <AboutUs />
        <TrustSection />
        <ContactUs loggedInUser={loggedInUser} />
        <CtaSection onOpenModal={openModal} />
      </main>
      <Footer />
      <Modal 
        isOpen={modalState.isOpen} 
        onClose={closeModal} 
        title={modalState.title} 
        type={modalState.type} 
        onLogin={handleLogin}
        onDemoBooked={handleDemoBooked}
      />
    </div>
  );
}
