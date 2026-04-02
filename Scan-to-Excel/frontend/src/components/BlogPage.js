import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Share2, Tag, ChevronRight } from 'lucide-react';

const blogPostContent = {
  "From Paper to Structured Data in Seconds": {
    category: "Tutorial",
    date: "April 02, 2026",
    author: "Scan-to-Excel Team",
    readTime: "8 min read",
    content: (
      <div className="space-y-10 leading-relaxed font-light">
        <p className="text-xl leading-relaxed italic border-l-4 border-blue-500 pl-6 py-4 bg-blue-500/5 rounded-r-xl">
          In today’s data-driven world, a large portion of valuable information still exists in physical formats — invoices, reports, forms, and handwritten records. Manually converting this data into digital systems is not only time-consuming but also highly error-prone.
        </p>

        <section>
          <h3 className="text-3xl font-bold tracking-tight mb-4">The Problem</h3>
          <p className="mb-4">Manual data entry faces significant hurdles that impact business efficiency:</p>
          <ul className="space-y-3 list-none">
            {['Increased operational costs', 'Slower workflows', 'Higher chances of human error'].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-3xl font-bold tracking-tight mb-4">The Solution: AI-Powered OCR</h3>
          <p>
            Modern OCR systems use artificial intelligence to detect text, understand document structure, and extract tabular data accurately. Unlike legacy systems, AI recognizes patterns and context.
          </p>
        </section>

        <section>
          <h3 className="text-3xl font-bold tracking-tight mb-4">How It Works</h3>
          <ol className="space-y-4 list-none counter-reset-steps">
            {[
              'Image is uploaded via a secure interface',
              'Preprocessing filters improve image clarity and contrast',
              'The OCR engine extracts raw text line by line',
              'AI detects tables, columns, and logical structure',
              'Data is formatted into structured spreadsheets'
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-bold text-blue-500">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10">
          <h3 className="text-2xl font-bold mb-4">Key Benefits</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Faster processing', 'High accuracy', 'Structured output', 'Cost Reduction'].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-500 font-bold">✓</div>
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        <p className="text-lg font-medium text-blue-400">
          Conclusion: AI-powered OCR transforms static documents into actionable data instantly.
        </p>
      </div>
    )
  },
  "Building Smart Document Processing Pipelines": {
    category: "Insights",
    date: "April 03, 2026",
    author: "Pipeline Architects",
    readTime: "12 min read",
    content: (
      <div className="space-y-10 leading-relaxed font-light">
        <p className="text-xl leading-relaxed italic border-l-4 border-purple-500 pl-6 py-4 bg-purple-500/5 rounded-r-xl">
          Extracting data is only one part of the process. Production-level systems require complete pipelines to ensure accuracy, consistency, and scalability.
        </p>

        <section>
          <h3 className="text-3xl font-bold tracking-tight mb-4">What is a Document Pipeline?</h3>
          <p>
            A document processing pipeline is a sequence of automated steps that transforms raw input—like a photo of an invoice—into structured output ready for database ingestion or manual analysis.
          </p>
        </section>

        <section className="space-y-8">
          <h3 className="text-3xl font-bold tracking-tight">Core Components</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-purple-400">1. Input Handling</h4>
              <p className="text-sm">Comprehensive support for varied image formats and multi-page PDFs.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-purple-400">2. Preprocessing</h4>
              <ul className="text-sm space-y-1 opacity-70">
                <li>• Noise reduction</li>
                <li>• Image enhancement</li>
                <li>• Alignment correction</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-purple-400">3. OCR Engine</h4>
              <p className="text-sm">The heavy lifting: converting pixels into machine-readable characters.</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-purple-400">4. Structure Detection</h4>
              <p className="text-sm">Identifying the visual grammar of the document: headers, footers, and cells.</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-purple-400">5. Data Validation</h4>
              <p className="text-sm">Automated logic to detect missing values and ensure financial consistency.</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-purple-400">6. Output Generation</h4>
              <p className="text-sm">Compiling clean, validated data into production-ready Excel files.</p>
            </div>
          </div>
        </section>

        <section className="p-8 rounded-[2rem] bg-purple-500/5 border border-purple-500/10">
          <h3 className="text-2xl font-bold mb-4">Why It Matters</h3>
          <ul className="space-y-3">
             <li className="flex gap-4">
                <span className="text-purple-500 font-bold">»</span> Enables scalability across thousands of documents.
             </li>
             <li className="flex gap-4">
                <span className="text-purple-500 font-bold">»</span> Drastically improves final accuracy through multi-layer validation.
             </li>
             <li className="flex gap-4">
                <span className="text-purple-500 font-bold">»</span> Automates repetitive manual workflows.
             </li>
          </ul>
        </section>

        <p className="text-lg font-medium text-purple-400">
          Conclusion: Smart pipelines enable reliable and scalable document automation.
        </p>
      </div>
    )
  },
  "Ensuring Accuracy in Automated Data Extraction": {
    category: "Security",
    date: "April 04, 2026",
    author: "OCR Experts",
    readTime: "10 min read",
    content: (
      <div className="space-y-10 leading-relaxed font-light">
        <p className="text-xl leading-relaxed italic border-l-4 border-green-500 pl-6 py-4 bg-green-500/5 rounded-r-xl">
          Accuracy is critical in automated data extraction. Even small errors can lead to major issues in financial reporting and operations.
        </p>

        <section>
          <h3 className="text-3xl font-bold tracking-tight mb-4">The Challenges</h3>
          <div className="flex flex-wrap gap-3">
            {['Poor image quality', 'Handwritten text', 'Complex layouts', 'Multiple languages'].map((tag, i) => (
              <span key={i} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium">{tag}</span>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-3xl font-bold tracking-tight">Techniques to Improve Accuracy</h3>
          
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
              <h4 className="text-lg font-bold text-green-400 mb-2">Image Preprocessing</h4>
              <p className="text-sm">Enhancing clarity before OCR through adaptive thresholding and contrast boosting.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
              <h4 className="text-lg font-bold text-green-400 mb-2">AI-Based Correction</h4>
              <p className="text-sm">Fixing common OCR substitution errors and predicting missing values using language models.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
              <h4 className="text-lg font-bold text-green-400 mb-2">Validation Layers</h4>
              <p className="text-sm">Applying rigorous format validation and proactive duplicate detection.</p>
            </div>

            <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
              <h4 className="text-lg font-bold text-green-400 mb-2">Human-in-the-Loop</h4>
              <p className="text-sm">Optional manual review for low-confidence results to ensure 100% integrity.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-3xl font-bold tracking-tight mb-4">Best Practices</h3>
          <ul className="space-y-2">
            <li>• Use high-quality inputs (300+ DPI) whenever possible.</li>
            <li>• Always combine OCR with a post-processing AI layer.</li>
            <li>• Apply customized validation rules matching your data schema.</li>
          </ul>
        </section>

        <p className="text-lg font-medium text-green-400">
          Conclusion: High accuracy requires intelligent processing and validation.
        </p>
      </div>
    )
  }
};

const BlogPage = ({ postTitle, darkMode, onBack }) => {
  const post = blogPostContent[postTitle];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!post) return <div className="p-24 text-center">Post Not Found</div>;

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-24 ${darkMode ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Background Gradients */}
      <div className={`fixed inset-0 pointer-events-none -z-10 opacity-30 ${darkMode ? 'bg-[radial-gradient(circle_at_20%_20%,#1e293b_0%,transparent_50%)]' : 'bg-[radial-gradient(circle_at_20%_20%,#e2e8f0_0%,transparent_50%)]'}`}></div>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={onBack}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 mb-12 text-sm font-bold uppercase tracking-widest transition-colors ${darkMode ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-blue-600'}`}
          >
            <ArrowLeft size={16} /> Back to Insights
          </motion.button>

          <header className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              <Tag size={12} /> {post.category}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter"
            >
              {postTitle}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium ${darkMode ? 'text-white/40' : 'text-gray-400'}`}
            >
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-500" /> {post.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-purple-500" /> {post.readTime}
              </div>
              <div className="ml-auto flex items-center gap-4">
                <button className="hover:text-blue-500 transition-colors"><Share2 size={18} /></button>
              </div>
            </motion.div>
          </header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {post.content}
          </motion.div>

          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={`mt-24 pt-12 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}
          >
          </motion.footer>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
