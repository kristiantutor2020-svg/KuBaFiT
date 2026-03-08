import React, { useEffect } from 'react';
import { ShieldCheck, Activity, Users, ArrowRight, HeartPulse, BrainCircuit, Target, Star, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  useEffect(() => {
    // Add custom Google Fonts to the document for the Landing Page
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div 
      className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden" 
      style={{ fontFamily: "'Barlow', sans-serif" }}
    >
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                KuBaFiT
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#advocacy" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Advocacy</a>
              <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Features</a>
              <a href="#impact" className="text-sm font-semibold text-slate-300 hover:text-emerald-400 transition-colors duration-200 cursor-pointer">Impact</a>
            </div>

            <div className="flex items-center">
              <button 
                onClick={onGetStarted}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-900/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-900/30 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-sm mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span>NCD Prevention & Health Advocacy</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                AI-Powered <br/>
                Workout Plans to <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                  Combat NCDs
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl">
                Revolutionizing fitness with personalized AI coaching designed to fight non-communicable diseases. We partner with organizations to advocate for active, healthy living in every community.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onGetStarted}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 rounded-full transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
                >
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  className="bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-full border border-white/10 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-3xl opacity-30 blur-xl filter group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-[#0B1120] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                      alt="Person working out with futuristic UI overlay" 
                      className="w-full h-auto object-cover opacity-80 mix-blend-lighten"
                    />
                    {/* Decorative UI Overlay element */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                       <div className="flex items-center gap-3">
                           <BrainCircuit className="w-8 h-8 text-emerald-400" />
                           <div>
                               <p className="text-xs text-slate-400 uppercase font-bold">AI Analysis</p>
                               <p className="text-white font-bold tracking-wider">Optimal Focus</p>
                           </div>
                       </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </section>

      {/* Advocacy Section */}
      <section id="advocacy" className="py-24 relative overflow-hidden bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Empowering Your Health Journey
            </h2>
            <p className="text-lg text-slate-400">
              Our organization is dedicated to advocating for healthy lifestyles through sports and providing the tools needed to overcome health challenges globally.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#020617] rounded-3xl p-8 border border-white/5 hover:border-emerald-500/30 transition-colors duration-300 group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community Advocacy</h3>
              <p className="text-slate-400 leading-relaxed">
                We partner with under-resourced organizations to promote active living and health literacy in underserved communities.
              </p>
            </div>
            
            <div className="bg-[#020617] rounded-3xl p-8 border border-white/5 hover:border-emerald-500/30 transition-colors duration-300 group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Sports Integration</h3>
              <p className="text-slate-400 leading-relaxed">
                Using competitive and recreational sports as a primary tool for disease prevention and mental wellness.
              </p>
            </div>

            <div className="bg-[#020617] rounded-3xl p-8 border border-white/5 hover:border-emerald-500/30 transition-colors duration-300 group">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Health Education</h3>
              <p className="text-slate-400 leading-relaxed">
                Comprehensive resources to help you understand, monitor, and manage your long-term physical well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Smart Features for <br />
              <span className="text-emerald-400">Real Results</span>
            </h2>
            <p className="text-lg text-slate-400">
              Cutting-edge technology meets sports science to help you reach your peak performance safely and effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="bg-[#0B1120] rounded-3xl overflow-hidden border border-white/5 group hover:border-emerald-400/50 transition-all duration-300">
                <div className="h-48 bg-slate-900 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1526401485004-46910ecc8e51?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Phone screen showing workout stats" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100" />
                </div>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3">Personalized AI Workouts</h3>
                    <p className="text-slate-400 leading-relaxed">
                        An AI fitness assistant that adapts in real-time to your fatigue levels, recovery status, and chronic health needs.
                    </p>
                </div>
             </div>

             <div className="bg-[#0B1120] rounded-3xl overflow-hidden border border-white/5 group hover:border-emerald-400/50 transition-all duration-300">
                <div className="h-48 bg-slate-900 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="People running together" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-60 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100" />
                </div>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3">Community Support</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Join a global network of users sharing active lifestyles through challenges and peer coaching.
                    </p>
                </div>
             </div>

             <div className="bg-[#0B1120] rounded-3xl overflow-hidden border border-white/5 group hover:border-emerald-400/50 transition-all duration-300">
                <div className="h-48 bg-slate-900 overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-emerald-900/40 flex flex-col justify-end p-6 border-b border-indigo-500/20">
                         {/* Abstract chart visualization */}
                         <div className="flex items-end gap-2 h-20 w-full mb-2">
                             {[40, 60, 45, 80, 55, 90, 75, 100].map((h, i) => (
                                 <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/80 to-emerald-400/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
                             ))}
                         </div>
                    </div>
                </div>
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-3">Progress Tracking</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Visualize your recovery, cardiovascular health, and strength gains with deep data analytics.
                    </p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="impact" className="py-24 bg-emerald-500 text-slate-950 relative overflow-hidden">
        <div className="absolute opacity-10 top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Impact & Success Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl">
              <div className="flex gap-1 mb-6 text-emerald-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg font-medium mb-8 leading-relaxed">
                "It has completely changed the way I manage my hypertension. The AI adapts workouts so I am never pushed into an unsafe zone, but always improving."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Alex+M&background=0F172A&color=fff" alt="Alex M" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Alex M.</h4>
                  <p className="text-sm text-slate-500">Early Adopter</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl">
              <div className="flex gap-1 mb-6 text-emerald-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg font-medium mb-8 leading-relaxed">
                "Our community challenges have motivated older groups who never felt supported in traditional gyms. KuBaFiT brings fitness to the people."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Sarah+J&background=10B981&color=fff" alt="Sarah J" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Sarah J.</h4>
                  <p className="text-sm text-slate-500">Community Leader</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl">
              <div className="flex gap-1 mb-6 text-emerald-500">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-lg font-medium mb-8 leading-relaxed">
                "Integrating health education with my daily step goals has made me acutely aware of my habits. The impact isn't just physical - it changed my mindset."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Robert+K&background=4F46E5&color=fff" alt="Robert K" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Robert K.</h4>
                  <p className="text-sm text-slate-500">Rehabilitation Program</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-br from-[#0B1120] to-[#020617] rounded-[3rem] p-12 md:p-20 text-center border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight relative z-10" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Ready to take control of <br /> your health?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of members fighting for a healthier future with AI-driven precision and sports advocacy.
            </p>
            <div className="relative z-10 flex justify-center">
                <button 
                  onClick={onGetStarted}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-10 py-5 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] cursor-pointer"
                >
                  Start Your Free Trial
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <HeartPulse className="w-6 h-6 text-emerald-500" />
                <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  KuBaFiT
                </span>
              </div>
              <p className="text-slate-400 max-w-sm mb-6">
                Empowering individuals and organizations to combat Non-Communicable Diseases through AI-guided sports and fitness.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">AI Workouts</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">App Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">For Organizations</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-sm">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Community</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Contact Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} KuBaFiT Platform. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors cursor-pointer">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
