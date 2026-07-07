import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Search, ShieldAlert, Sparkles, ArrowRight, UserCheck, RefreshCw } from 'lucide-react';

const symptomDatabase = [
  {
    keywords: ['chest', 'heart', 'tightness', 'angina', 'breath', 'cardio'],
    condition: 'Potential Cardiovascular Insufficiency',
    specialist: 'Dr. Evelyn Sinclair, MD (Cardiology)',
    urgency: 'High Urgency',
    urgencyColor: 'text-rose-600 bg-rose-50 border-rose-100',
    description: 'Chest tightness or breathing issues can indicate cardiac concerns. We advise scheduling a prompt cardiology screening.',
    advice: 'If you are experiencing severe pain radiating to your arm or jaw, please contact emergency services (+1 800-NOVARA-H) immediately.',
  },
  {
    keywords: ['tooth', 'teeth', 'dental', 'gum', 'mouth', 'ache', 'dentist'],
    condition: 'Acute Dental Sensitivity or Pulpitis',
    specialist: 'Premium Dental Care Team',
    urgency: 'Medium Urgency',
    urgencyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    description: 'Local mouth or tooth discomfort is often linked to dental pulp inflammation or micro-fractures.',
    advice: 'Avoid extremely cold or hot liquids. We recommend a diagnostic scan and dental examination.',
  },
  {
    keywords: ['child', 'baby', 'toddler', 'pediatric', 'fever', 'kid', 'rash'],
    condition: 'Pediatric Viral Infection or Growth Check',
    specialist: 'Dr. Sophia Laurent, MD (Pediatrics)',
    urgency: 'Medium Urgency',
    urgencyColor: 'text-amber-600 bg-amber-50 border-amber-100',
    description: 'Childhood fevers or rashes require specialized pediatric evaluation to rule out common biological infections.',
    advice: 'Monitor fluid intake and temperature closely. Schedule a consultation with our child care specialists.',
  },
  {
    keywords: ['headache', 'migraine', 'dizzy', 'numb', 'seizure', 'neurology', 'brain'],
    condition: 'Migraine Syndrome or Neurological Alert',
    specialist: 'Dr. Marcus Thorne, PhD (Neurology)',
    urgency: 'Medium-High Urgency',
    urgencyColor: 'text-orange-600 bg-orange-50 border-orange-100',
    description: 'Frequent headaches, dizziness, or focal numbness can be tied to vascular or nerve conduction pathways.',
    advice: 'Rest in a quiet, dark environment. A comprehensive neurological consult and EEG screening is recommended.',
  },
  {
    keywords: ['skin', 'spot', 'itch', 'allergy', 'hives'],
    condition: 'Dermatological Response or Hypersensitivity',
    specialist: 'General Consultation & Dermatology',
    urgency: 'Low Urgency',
    urgencyColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    description: 'Localized skin irritations or hives represent inflammatory reactions to environmental or food allergies.',
    advice: 'Avoid scratching the irritated zone. We recommend a general consultation for initial testing.',
  },
];

const presets = [
  { label: 'Chest tightness when walking', query: 'I feel a tightness in my chest when I walk quickly' },
  { label: 'Sharp pain in my front tooth', query: 'I have a sharp tooth pain whenever I drink cold water' },
  { label: 'Toddler has a mild rash & fever', query: 'My baby has a high fever and a small red rash on their arm' },
  { label: 'Chronic migraines and dizziness', query: 'I have been suffering from dizzy spells and severe headaches lately' },
];

export default function SymptomChecker() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    // Mock AI Analysis delay
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let matchedResult = null;

      for (const item of symptomDatabase) {
        const matches = item.keywords.some((keyword) => lowerQuery.includes(keyword));
        if (matches) {
          matchedResult = item;
          break;
        }
      }

      // Default result if no match is found
      if (!matchedResult) {
        matchedResult = {
          condition: 'General Wellness Query',
          specialist: 'Primary Consultation Team',
          urgency: 'Routine Care',
          urgencyColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
          description: 'Your symptoms seem to fall under general health indices. A primary consultation is recommended for initial diagnostics.',
          advice: 'Maintain a symptom diary detailing when these feelings manifest to share with your family practitioner.',
        };
      }

      setResult(matchedResult);
      setIsAnalyzing(false);
    }, 1800);
  };

  const handlePresetClick = (presetQuery) => {
    setQuery(presetQuery);
    // Auto-trigger submit behavior
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      // Programmatically trigger search
    }, 100);
  };

  const resetChecker = () => {
    setQuery('');
    setResult(null);
  };

  const scrollToBooking = () => {
    const el = document.querySelector('#booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="ai-assistant" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/2 right-[-10%] w-[35%] h-[35%] rounded-full bg-brand-50/50 blur-3xl -translate-y-1/2 -z-10"></div>
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-accent-500 font-bold text-sm tracking-[0.2em] uppercase block mb-3 flex items-center justify-center gap-1.5">
            <Sparkles size={16} className="text-accent-500 fill-accent-500/20" />
            <span>AI Clinical Navigation</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-950 leading-tight">
            Novara AI Symptom Assistant <br />
            <span className="text-brand-500 font-normal italic">Instant Consultation Guidance</span>
          </h2>
          <p className="text-sm text-slate-luxury-900/60 mt-4 leading-relaxed font-sans">
            Describe what you are experiencing in plain text. Our interactive clinical navigation tool will suggest the appropriate specialist and clinical triage urgency.
          </p>
        </div>

        {/* Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Input and Presets */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-brand-100 shadow-md">
              <form onSubmit={handleAnalyze} className="space-y-4">
                <label className="block text-xs text-brand-950 font-bold uppercase tracking-wider">
                  Describe Symptoms *
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g., I have been experiencing a sharp, throbbing pain in my lower left gum when chewing food..."
                    className="w-full p-4 rounded-xl border border-brand-100 bg-white/70 text-slate-luxury-900 focus:outline-hidden focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all duration-300 font-sans text-sm md:text-base leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzing || !query.trim()}
                  className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-500/10 hover:shadow-brand-500/35 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BrainCircuit size={18} />
                  <span>Analyze Symptoms</span>
                </button>
              </form>

              {/* Presets List */}
              <div className="mt-6 pt-6 border-t border-brand-50">
                <span className="block text-xs font-semibold text-slate-luxury-900/50 uppercase tracking-wider mb-3">
                  Or Test with a Diagnostic Preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handlePresetClick(preset.query)}
                      className="px-3.5 py-2 rounded-lg bg-accent-50/50 hover:bg-brand-50 border border-brand-100/50 hover:border-brand-200 text-left text-xs text-slate-luxury-900/70 hover:text-brand-700 font-medium transition-all duration-300 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Display Analysis / Results */}
          <div className="lg:col-span-5 h-full min-h-[300px]">
            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <motion.div
                  key="analyzing-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full min-h-[340px] flex flex-col items-center justify-center bg-brand-50/50 border border-brand-100 rounded-3xl p-8 text-center"
                >
                  {/* Glowing Animated Brain Circle */}
                  <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-brand-500/10 rounded-full"
                    />
                    <div className="w-16 h-16 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-500">
                      <BrainCircuit size={32} className="animate-pulse" />
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-serif font-bold text-brand-950 mb-2">Analyzing Clinical Terms...</h4>
                  <p className="text-xs text-slate-luxury-900/50 font-sans max-w-xs mb-6">
                    Cross-referencing symptoms with specialized medical taxonomies and department guidelines.
                  </p>
                  
                  {/* Loader progress strip */}
                  <div className="w-full max-w-xs h-1.5 bg-brand-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.6 }}
                      className="h-full bg-brand-500"
                    />
                  </div>
                </motion.div>
              )}

              {!isAnalyzing && result && (
                <motion.div
                  key="result-state"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="w-full bg-brand-50 border border-brand-100 rounded-3xl p-8 text-left shadow-lg"
                >
                  {/* Result Header */}
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-brand-100 mb-6">
                    <div className="flex items-center gap-2 text-brand-700">
                      <BrainCircuit size={20} className="stroke-[2.5]" />
                      <span className="font-bold text-sm tracking-wider uppercase">Analysis Complete</span>
                    </div>
                    <button
                      onClick={resetChecker}
                      className="text-xs text-slate-luxury-900/40 hover:text-brand-500 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Condition Name */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-luxury-900/40 block">Potential Diagnosis</span>
                    <h3 className="text-xl font-serif font-bold text-brand-950 leading-snug">
                      {result.condition}
                    </h3>
                  </div>

                  {/* Urgency Badge & Rec Specialist */}
                  <div className="space-y-4 mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="flex-grow">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-luxury-900/40 block mb-1">Triage Urgency</span>
                        <span className={`inline-flex px-3 py-1 rounded-md text-xs font-bold border ${result.urgencyColor}`}>
                          {result.urgency}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-luxury-900/40 block mb-1">Recommended Specialist</span>
                      <span className="text-base font-bold text-brand-950 flex items-center gap-2">
                        <UserCheck size={18} className="text-accent-500" />
                        <span>{result.specialist}</span>
                      </span>
                    </div>
                  </div>

                  {/* Description Paragraphs */}
                  <div className="space-y-4 pt-6 border-t border-brand-100 text-xs md:text-sm text-slate-luxury-900/60 leading-relaxed font-sans">
                    <p>{result.description}</p>
                    {result.advice && (
                      <div className="flex gap-2.5 bg-white/60 p-3.5 rounded-xl border border-brand-200/50 text-brand-700">
                        <ShieldAlert size={18} className="text-brand-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] font-medium leading-normal">{result.advice}</p>
                      </div>
                    )}
                  </div>

                  {/* CTA Book Consultation */}
                  <button
                    onClick={scrollToBooking}
                    className="w-full mt-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Request Diagnostic Consult</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  </button>
                </motion.div>
              )}

              {!isAnalyzing && !result && (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full min-h-[340px] flex flex-col items-center justify-center bg-accent-50/40 border border-brand-100 border-dashed rounded-3xl p-8 text-center"
                >
                  <Search size={40} className="text-brand-500/20 mb-4" />
                  <h4 className="text-base font-serif font-bold text-brand-950/70 mb-2">Awaiting Diagnosis Input</h4>
                  <p className="text-xs text-slate-luxury-900/40 font-sans max-w-xs">
                    Type your clinical symptoms on the left or select one of the testing presets to trigger immediate medical triage analysis.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
        
        {/* Fine Disclaimer */}
        <div className="text-center mt-12 text-[10px] text-slate-luxury-900/40 max-w-2xl mx-auto leading-relaxed">
          * Disclaimer: The AI Clinical Navigation is a diagnostic prototype mapping keyword indices for client demo presentation. It does not constitute formal medical prescription or emergency advice.
        </div>

      </div>
    </section>
  );
}
