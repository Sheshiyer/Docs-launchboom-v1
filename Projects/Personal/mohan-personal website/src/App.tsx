import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Code, Network, Zap, User, Mail, Globe, Phone, FileText, Download, Brain, Rocket, Users, Car, Building2, Headphones } from 'lucide-react';
import ReactGA from 'react-ga4';
import './index.css';
import GlitchScanlineFX from './GlitchScanlineFX';

// Initialize GA4
ReactGA.initialize('G-XXXXXXXXXX'); // Replace with your GA4 measurement ID

function App() {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono antialiased relative overflow-hidden">
      <GlitchScanlineFX />
      {/* CRT Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="scanline"></div>
        <div className="noise"></div>
        <div className="crt-overlay"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Header />
        <main className="mt-8">
          <AboutSection />
          <IntroSection />
          <ExperienceSection />
          <SkillsSection />
          <HobbiesSection />
          <ContactSection />
        </main>
      </div>
    </div>
  );
}

function Header() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 500);
  }, []);

  return (
    <header className="border-b border-green-500 pb-4 glitch-container">
      <div className={`transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <h1 className="text-4xl md:text-5xl font-bold mb-2 text-cyan-400 glitch-text" data-text="MOHAN KUMAR V">
          MOHAN KUMAR V
        </h1>
        <div className="flex items-center">
          <div className="blink-cursor mr-2">_</div>
          <p className="text-xl text-gray-400 typewriter-text">
            CTO - Creative technology officer 
          </p>
        </div>
      </div>
    </header>
  );
}

function AboutSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleResumeDownload = () => {
    ReactGA.event({
      category: 'Resume',
      action: 'Download',
      label: 'Resume PDF'
    });
  };

  return (
    <section className={`my-8 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="terminal-window about-section">
        <div className="terminal-header">
          <div className="terminal-title">SYSTEM.IDENTITY</div>
          <div className="flex">
            <div className="terminal-button bg-red-500"></div>
            <div className="terminal-button bg-yellow-500"></div>
            <div className="terminal-button bg-green-500"></div>
          </div>
        </div>
        <div className="terminal-body p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vision-block">
              <div className="flex items-center mb-3">
                <Brain className="w-5 h-5 mr-2 text-cyan-400" />
                <h3 className="text-cyan-400 font-bold">Tech Vision</h3>
              </div>
              <p className="text-sm">
                Pushing the boundaries to accelerate our evolution from carbon-based consciousness to silicon-based sentience, creating a future where technology helps humans transcends and asscend to a higher state of being.
              </p>
            </div>

            <div className="achievements-block">
              <div className="flex items-center mb-3">
                <Rocket className="w-5 h-5 mr-2 text-magenta-500" />
                <h3 className="text-magenta-500 font-bold">Innovation Track</h3>
              </div>
              <ul className="text-sm list-disc pl-4">
                <li>Led development of enterprise-scale applications</li>
                <li>Architected scalable IOT and XR solutions</li>
                <li>Pioneered biosensing wearables and Brain computer interfaces</li>
                <li>Dabbled in Web3 and Blockchain solutions</li>
              </ul>
            </div>

            <div className="leadership-block">
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 mr-2 text-green-500" />
                <h3 className="text-green-500 font-bold">Leadership</h3>
              </div>
              <p className="text-sm">
              Leading with vision and technical excellence, I cultivate high-performing teams that push boundaries while ensuring robust, scalable architectures.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-700 pt-6">
            {/* <p className="text-sm mb-4">
              Currently focused on revolutionizing workplace safety and productivity through XR and AI. Creating profitable products that solve real-world problems.
            </p> */}
            
            <div className="flex justify-center">
              <a
                href="/Mohankumar - Resume2025.pdf"
                onClick={handleResumeDownload}
                className="resume-download-btn group"
                download
              >
                <Download className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-y-1 transition-transform" />
                Download Full Resume
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`my-8 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-title">SYSTEM INFORMATION</div>
          <div className="flex">
            <div className="terminal-button bg-red-500"></div>
            <div className="terminal-button bg-yellow-500"></div>
            <div className="terminal-button bg-green-500"></div>
          </div>
        </div>
        <div className="terminal-body">
          <p className="mb-2"><span className="text-cyan-400">$</span> whoami</p>
          <p className="mb-4 pl-4">
          <ul className="list-disc pl-4 space-y-2">
            <li>CTO at SAFVR, backed by Antler - revolutionizing workplace safety with XR/AI</li>
            <li>Creative technology generalist & entrepreneur - turning bold ideas into market-disrupting products</li>
            <li>5+ years leading teams through Web3, VR/AR, and wearable tech frontiers</li>
            <li>Built and scaled products that generated 100k+ ARR by solving real industry pain points</li>
            <li>Led high-performance teams that ship innovative solutions</li>
            <li>Technical visionary who bridges cutting-edge tech with business impact</li>
            <li>Seeking to push boundaries and create revolutionary solutions that matter</li>
            
          </ul>
          </p>
          {/* <p className="mb-2"><span className="text-cyan-400">$</span> cat skills.txt</p>
          <p className="mb-4 pl-4">React | TypeScript | Node.js | AWS | REST/GraphQL | FastAPI | Python | Firebase | AWS | PostgreSQL | MongoDB | Redis | Docker | Kubernetes | CI/CD | Git | GitHub Actions | Linux | MacOS | Windows</p> */}
          <p><span className="text-cyan-400">$</span> _</p>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const experiences = [
    {
      id: 1,
      title: "Chief Technology Officer",
      company: "SAFVR",
      date: "April 2024 - Present",
      location: "Singapore",
      description: [
        "Leading the development of SAFVR, an end-to-end safety management suite leveraging VR, AI, and gamification to solve critical workplace safety challenges",
        "Built immersive training simulations for high-risk scenarios, real-time safety monitoring systems, and automated compliance reporting tools",
        "Clocked 100k+ in ARR from enterprise clients by addressing key pain points in workplace safety training and incident prevention",
        "Driving product roadmap focused on reducing workplace accidents, improving safety compliance, and enhancing emergency response preparedness",
        
      ]
    },
    {
      id: 2,
      title: "Entrepreneur in Residence",
      company: "Antler",
      date: "March 2024 - April 2024",
      location: "Singapore",
      description: [
        "Expanded a gamified training concept into a full EHS solution with training and reporting",
        "Collaborated with mentors on product vision, GTM strategy, and investor pitches",
        "Participated in masterclasses on fundraising and marketing",
        "Secured $125K pre-seed funding after successful IC approval"
      ]
    },
    {
      id: 3,
      title: "Chief Technology Officer",
      company: "ZyenaLABS",
      date: "July 2021 - February 2024",
      description: [
        "Led transition from service-based to product-driven company, securing $700K VC funding",
        "Oversaw development of VR training simulations for private and public sectors",
        "Integrated Blockchain for transparency in enterprise safety training",
        "Built and managed a high-performing cross-functional development team"
      ]
    },
    {
      id: 4,
      title: "Director",
      company: "ThoughtSeed",
      date: "October 2020 - February 2024",
      location: "Bengaluru, India",
      description: [
        "Founded and led technology initiatives across VR/AR, Web3, NFT, and mobile domains clocking $100k+ annual revenue with lean team",
        "Developed wearable biosensors, immersive experiences, fintech solutions, SAAS products, and mobile apps",
        "Led the implementation of large-scale demand response project (50K+ homes, 400K+ devices) integrating Enedis/Tuya APIs",
        "Created biofeedback experiences and breathwork wellness apps, created a DTC wellness brand that uses scientifically engineered sound frequencies to solve sleep disorders and anxiety"
      ]
    },
    {
      id: 5,
      title: "Chief Technology Officer",
      company: "Tokenofme",
      date: "August 2021 - December 2023",
      location: "Zurich, Switzerland",
      description: [
        "Built a Web3-powered mental wellness app integrating biosignal data and gamified crypto rewards",
        "Led bio-signal algorithm design, mobile app development, and product strategy",
        "Oversaw UI/UX, Agile project management, and App Store deployment",
        "Helped pioneer the integration of HRV-based wellness incentives into blockchain ecosystems"
      ]
    },
    {
      id: 6,
      title: "Chief Technology Officer",
      company: "Maximum Network LLC",
      date: "February 2022 - October 2022",
      location: "Bengaluru, India",
      description: [
        "Developed a custodial and decentralized asset management platform",
        "Integrated machine learning for AI-driven portfolio optimization",
        "Led DevOps-driven product development from design to deployment",
        "Assembled and managed the early engineering team"
      ]
    },
    {
      id: 7,
      title: "Scientific Researcher",
      company: "Centre for Biofield Sciences",
      date: "June 2018 - June 2020",
      location: "Panaji, India",
      description: [
        "Led research study design, ethical approval processes, and participant recruitment",
        "Conducted scientific evaluations for major healthcare companies",
        "Applied advanced statistics to validate product efficacy",
        "Supported healthcare product launches with robust clinical data"
      ]
    }
  ];

  return (
    <section className="my-16">
      <div className="section-header">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FileText className="mr-2 text-magenta-500" />
          <span className="text-magenta-500">EXEC_HISTORY</span>
          <div className="ascii-divider ml-4">--[ * ]--</div>
        </h2>
      </div>

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div 
            key={exp.id} 
            className={`data-block ${expandedId === exp.id ? 'data-block-expanded' : ''}`}
            onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
          >
            <div className="data-block-header">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-cyan-400">{exp.title}</h3>
                <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded">
                  {exp.date}
                </span>
              </div>
              <p className="text-gray-400">{exp.company}</p>
              {exp.location && (
                <p className="text-sm text-gray-500">{exp.location}</p>
              )}
            </div>
            
            {expandedId === exp.id && (
              <div className="data-block-content mt-4">
                <ul className="list-disc pl-6 space-y-2 text-green-300">
                  {exp.description.map((item, idx) => (
                    <li key={idx} className="typing-animation" style={{ animationDelay: `${idx * 0.2}s` }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="data-block-footer">
              <span className="text-xs text-gray-500">
                {expandedId === exp.id ? '[ CLICK TO ENCRYPT ]' : '[ CLICK TO DECRYPT ]'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const skills = [
    { category: "Core Development", items: [
      "HTML/CSS/JS","React", "React Native", "TypeScript", "Next.js", "Node.js/Hano", 
      "Express", "GraphQL", "REST API", "Python", "FastAPI", "Flask", "MongoDB", "PostgreSQL"
    ]},
    { category: "Emerging Technologies", items: [
      "ML", "LLMs", "Langchain", "Agents", "Prompt Engineering", "Fine-tuning",
      "Blockchain", "Solidity", "EVM", "Web3", "Smart Contracts",
      "Unity", "Unreal", "Blender", "TouchDesigner",
      "IoT", "Arduino", "Raspberry Pi", "ESP32", "ESP8266", "Tuya"
    ]},
    { category: "Infrastructure & DevOps", items: [
      "AWS", "GCP", "Firebase", "Docker", "CI/CD",
      "Git", "GitHub Actions", "Internal Tools", "Serverless", "Locust", "Sentry"
    ]},
    { category: "Business & Operations", items: [
      "Product Management", "Agile", "Notion", "Kanban", "Asana", "Trello",
      "Entrepreneurship", "Startup", "Venture Funding",
      "Marketing Tech", "CRM", "Google Analytics", "Google Keyword Planner", 
      "Digital Ads", "SEO", "N8N", "Automation"
    ]}
  ];

  // For mobile: handle click to toggle
  const handleCategoryClick = (idx: number) => {
    setActiveCategory(activeCategory === idx ? null : idx);
  };

  return (
    <section className="my-16">
      <div className="section-header">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Code className="mr-2 text-cyan-500" />
          <span className="text-cyan-500">SKILL_MATRIX</span>
          <div className="ascii-divider ml-4">--[ * ]--</div>
        </h2>
      </div>
      <div className="terminal-window">
        <div className="terminal-body p-6">
          <div className="command-line mb-4">
            <span className="text-magenta-500">root@psychon:~$</span> list_skills --category {activeCategory !== null ? skills[activeCategory].category.toLowerCase() : "[hover or tap a category]"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skillGroup, groupIdx) => (
              <div
                key={groupIdx}
                className={`skill-group ${activeCategory === groupIdx ? 'active-skill-group' : ''}`}
                onMouseEnter={() => setActiveCategory(groupIdx)}
                onMouseLeave={() => setActiveCategory(null)}
                onClick={() => handleCategoryClick(groupIdx)}
                tabIndex={0}
                role="button"
                style={{ cursor: 'pointer' }}
              >
                <div className="skill-category mb-2">
                  <span className="text-yellow-400">{'>'}</span> {skillGroup.category}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {activeCategory === groupIdx && skillGroup.items.map((skill, idx) => (
                    <div
                      key={idx}
                      className={`skill-item active-skill`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <span className="text-green-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="command-prompt mt-4">
            <span className="text-magenta-500">root@psychon:~$</span> <span className="blink-cursor">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HobbiesSection() {
  const hobbies = [
    { icon: <Zap className="mr-2 text-yellow-400" />, label: 'Biohacking & Nootropics' },
    { icon: <Building2 className="mr-2 text-magenta-500" />, label: 'Urban Skating & Ice Skating' },
    { icon: <Code className="mr-2 text-cyan-400" />, label: 'Generative Art & Music' },
    { icon: <Car className="mr-2 text-green-500" />, label: 'Sim Racing & FPS Gaming' },
    { icon: <Brain className="mr-2 text-cyan-400" />, label: 'Exploring Emerging Technologies' },
    { icon: <Headphones className="mr-2 text-magenta-500" />, label: 'Audiobooks & Tech Podcasts' },
  ];
  return (
    <section className="my-16">
      <div className="section-header">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Terminal className="mr-2 text-yellow-400" />
          <span className="text-yellow-400">HOBBY_MATRIX</span>
          <div className="ascii-divider ml-4">--[ * ]--</div>
        </h2>
      </div>
      <div className="terminal-window">
        <div className="terminal-body p-6">
          <div className="command-line mb-4">
            <span className="text-magenta-500">root@psychon:~$</span> list_hobbies
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hobbies.map((hobby, idx) => (
              <li key={idx} className="flex items-center py-2 px-3 bg-gray-800 rounded text-green-300 text-lg shadow-neon-cyan">
                {hobby.icon} {hobby.label}
              </li>
            ))}
          </ul>
          <div className="command-prompt mt-4">
            <span className="text-magenta-500">root@psychon:~$</span> <span className="blink-cursor">_</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="my-16">
      <div className="section-header">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Network className="mr-2 text-green-500" />
          <span className="text-green-500">CONNECT_REQUEST</span>
          <div className="ascii-divider ml-4">--[ * ]--</div>
        </h2>
      </div>

      <div className="terminal-window">
        <div className="terminal-body p-6">
          <p className="mb-4 text-cyan-400"># CONTACT PROTOCOLS INITIALIZED</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <a href="mailto:mohanmv1711@gmail.com" className="contact-link group">
              <div className="flex items-center">
                <Mail className="mr-3 text-magenta-500 group-hover:text-magenta-400" />
                <div>
                  <p className="text-gray-400">Email</p>
                  <p className="contact-value group-hover:text-cyan-400">mohanmv1711@gmail.com</p>
                </div>
              </div>
            </a>
            {/* Phone */}
            <div className="contact-link group cursor-pointer">
              <div className="flex items-center">
                <Phone className="mr-3 text-magenta-500 group-hover:text-magenta-400" />
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="contact-value group-hover:text-cyan-400">[+65 8585 6414]</p>
                </div>
              </div>
            </div>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/mohankumar-v-6b9600110" target="_blank" rel="noreferrer" className="contact-link group">
              <div className="flex items-center">
                <User className="mr-3 text-magenta-500 group-hover:text-magenta-400" />
                <div>
                  <p className="text-gray-400">LinkedIn</p>
                  <p className="contact-value group-hover:text-cyan-400">Mohan Kumar V</p>
                </div>
              </div>
            </a>
            {/* GitHub */}
            <a href="https://github.com/psychon7" target="_blank" rel="noreferrer" className="contact-link group">
              <div className="flex items-center">
                <svg className="mr-3 text-magenta-500 group-hover:text-magenta-400" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"></path></svg>
                <div>
                  <p className="text-gray-400">GitHub</p>
                  <p className="contact-value group-hover:text-cyan-400">psychon7</p>
                </div>
              </div>
            </a>
            {/* Twitter */}
            <a href="https://twitter.com/7Psychon" target="_blank" rel="noreferrer" className="contact-link group">
              <div className="flex items-center">
                <svg className="mr-3 text-magenta-500 group-hover:text-magenta-400" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.09 9.09 0 01-2.88 1.1A4.52 4.52 0 0016.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03C7.69 5.4 4.07 3.6 1.64.95c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.94 3.65A4.48 4.48 0 01.96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.56 1.74 2.17 3.01 4.09 3.05A9.05 9.05 0 010 19.54a12.8 12.8 0 006.92 2.03c8.3 0 12.84-6.87 12.84-12.84 0-.2 0-.39-.01-.58A9.22 9.22 0 0023 3z"></path></svg>
                <div>
                  <p className="text-gray-400">Twitter</p>
                  <p className="contact-value group-hover:text-cyan-400">@7Psychon</p>
                </div>
              </div>
            </a>
            {/* Website */}
            <a href="https://thoughtseed.space" target="_blank" rel="noreferrer" className="contact-link group">
              <div className="flex items-center">
                <Globe className="mr-3 text-magenta-500 group-hover:text-magenta-400" />
                <div>
                  <p className="text-gray-400">Website</p>
                  <p className="contact-value group-hover:text-cyan-400">thoughtseed.space</p>
                </div>
              </div>
            </a>
          </div>
          <p className="mt-8 text-center terminal-message">
            <span className="blink-cursor">_</span> AWAITING YOUR TRANSMISSION
          </p>
        </div>
      </div>
    </section>
  );
}

export default App;