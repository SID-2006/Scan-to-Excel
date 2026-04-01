import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User, Share2, Tag, ChevronRight } from 'lucide-react';

const blogPostContent = {
  "How to Convert Scanned PDFs to Excel Automatically": {
    category: "Tutorial",
    date: "March 28, 2026",
    readTime: "8 min read",
    content: (
      <div className="space-y-8 leading-relaxed font-light">
        <p className="text-xl leading-relaxed italic border-l-4 border-blue-500 pl-6 py-4 bg-blue-500/5 rounded-r-xl">
          Scaling businesses today require moving away from manual data entry. Discover how modern AI-powered OCR technology can convert thousands of scanned PDFs into accurate Excel sheets in record time.
        </p>

        <h3 className="text-3xl font-bold tracking-tight">Step 1: Intelligent Image Pre-processing</h3>
        <p>
          The success of OCR starts long before character recognition. To handle blurry scans or slanted images, we apply grayscale normalization, noise reduction filters, and deskewing algorithms. This "cleans" the digital snapshot for the AI to see clearly.
        </p>

        <h3 className="text-3xl font-bold tracking-tight">Step 2: Table & Structure Recognition</h3>
        <p>
          Traditional OCR treats everything as a flat wall of text. We use deep learning models to identify "Regions of Interest" (ROI)—specifically targeting grid patterns and cell boundaries. This determines the logical structure of your document.
        </p>

        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h4 className="font-bold mb-4">Pro Tip: DPI Matters</h4>
          <p className="text-sm">For maximum accuracy, ensure your scans are at least 300 DPI. This provides enough resolution for our neural network to distinguish between similar characters like 'B' and '8'.</p>
        </div>

        <h3 className="text-3xl font-bold tracking-tight">Step 3: Neural Character Extraction</h3>
        <p>
          Once the cells are mapped, each individual segment is passed through a multi-lingual OCR engine. This handles complex fonts, handwriting variants, and even low-contrast ink.
        </p>

        <h3 className="text-3xl font-bold tracking-tight">Step 4: CSV/XLSX Mapping</h3>
        <p>
          Finally, the extracted data is mapped back into the identified grid structure. We apply post-extraction cleanup to correct common errors (like currency symbols or date formats) before compiling it into a downloadable Excel file.
        </p>
      </div>
    )
  },
  "Barcode Scanning to Excel": {
    category: "Insights",
    date: "March 30, 2026",
    author: "UPAY AI Team",
    readTime: "6 min read",
    content: (
      <div className="space-y-8 leading-relaxed font-light">
        <p className="text-xl leading-relaxed italic border-l-4 border-purple-500 pl-6 py-4 bg-purple-500/5 rounded-r-xl">
          Inventory management is being revolutionized by high-speed barcode integration. Learn how to transform your smartphone camera into a powerful data entry tool.
        </p>

        <h3 className="text-3xl font-bold tracking-tight">The Power of Batch Scanning</h3>
        <p>
          In warehouses and retail environments, scanning one barcode at a time is the old way. Advanced computer vision now allows for "Multi-Scan" technology, where a single scan can identify and record dozens of unique SKU tags from a single pallet.
        </p>

        <h3 className="text-3xl font-bold tracking-tight">Data Integrity and Real-time Sync</h3>
        <p>
          The core challenge isn't the scan—it's the destination. We explore how to sync scanned data instantly with centralized Excel sheets via cloud APIs, ensuring your inventory levels are accurate to the second.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <h5 className="font-bold mb-2 uppercase text-xs tracking-widest text-purple-400">1D Barcodes</h5>
            <p className="text-sm">UPC, EAN, and Code 128 - best for basic product tracking.</p>
          </div>
          <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <h5 className="font-bold mb-2 uppercase text-xs tracking-widest text-blue-400">2D Matrix</h5>
            <p className="text-sm">QR Codes and Data Matrix - can store complex metadata like URLs or expiration dates.</p>
          </div>
        </div>

        <h3 className="text-3xl font-bold tracking-tight">Automated Reporting</h3>
        <p>
          Learn how to use Excel macros to take your barcode data and generate automated restock alerts and category-wise distributions without lifting a finger.
        </p>
      </div>
    )
  },
  "Data Security in Cloud-Based OCR Systems": {
    category: "Security",
    date: "April 01, 2026",
    author: "Safety First",
    readTime: "10 min read",
    content: (
      <div className="space-y-8 leading-relaxed font-light">
        <p className="text-xl leading-relaxed italic border-l-4 border-green-500 pl-6 py-4 bg-green-500/5 rounded-r-xl">
          Privacy isn't a feature; it's a fundamental right. In the world of OCR, where sensitive financial and medical records are processed, security architecture is everything.
        </p>

        <h3 className="text-3xl font-bold tracking-tight">Transient Processing Architecture</h3>
        <p>
          Unlike traditional systems that store your documents "just in case," our cloud-based engine utilizes transient memory. This means the moment your Excel file is generated, the original scan is wiped from RAM. No long-term storage, No footprint.
        </p>

        <h3 className="text-3xl font-bold tracking-tight">End-to-End Encryption (E2EE)</h3>
        <p>
          We utilize AES-256 bit encryption at rest and TLS 1.3 for data in transit. This ensures that even if data was intercepted, it would remain completely unreadable to unauthorized parties.
        </p>

        <div className="p-8 rounded-[2rem] bg-green-500/5 border border-green-500/20">
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>GDPR Compliance for European data handling.</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>SOC2 Audited cloud infrastructure.</span>
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Monthly third-party penetration testing.</span>
            </li>
          </ul>
        </div>

        <h3 className="text-3xl font-bold tracking-tight">Access Control & Auditing</h3>
        <p>
          Who can see the data? In our ecosystem, the answer is "Only You." We dive into the protocols that restrict server access and how we maintain rigorous audit logs for system activity.
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
