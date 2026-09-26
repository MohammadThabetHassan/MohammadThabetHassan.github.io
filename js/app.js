'use strict';

const GITHUB_USERNAME = 'MohammadThabetHassan';
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Three.js Background ── */
(function initBG(){
  if(prefersReducedMotion) return;
  const canvas = document.getElementById('bg-canvas');
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const N = 4000;
  const pos = new Float32Array(N * 3);
  for(let i=0;i<N*3;i++) pos[i] = (Math.random()-0.5)*30;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const mat = new THREE.PointsMaterial({ color:0x00d4ff, size:0.015, transparent:true, opacity:0.5 });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  let tX=0, tY=0;
  document.addEventListener('mousemove', e=>{
    tX = (e.clientX/innerWidth -0.5)*0.3;
    tY = (e.clientY/innerHeight-0.5)*0.3;
  });

  let animId;
  function bgAnimate(){
    animId = requestAnimationFrame(bgAnimate);
    particles.rotation.y += 0.0003;
    particles.rotation.x += (tY - particles.rotation.x)*0.02;
    particles.rotation.z += (tX - particles.rotation.z)*0.02;
    renderer.render(scene, camera);
  }
  bgAnimate();

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) cancelAnimationFrame(animId); else bgAnimate();
  });
  window.addEventListener('resize',()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ── Three.js Globe ── */
(function initGlobe(){
  const canvas = document.getElementById('globe-canvas');
  const W = canvas.parentElement.offsetWidth || 420;
  const gScene = new THREE.Scene();
  const gCam   = new THREE.PerspectiveCamera(75,1,0.1,100);
  gCam.position.z = 5;
  const gRenderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  const SIZE = W;
  gRenderer.setSize(SIZE, SIZE);
  gRenderer.setPixelRatio(Math.min(devicePixelRatio,2));

  // Wireframe globe
  const globeGeo = new THREE.SphereGeometry(2,32,32);
  const globeMat = new THREE.MeshBasicMaterial({ color:0x00d4ff, wireframe:true, transparent:true, opacity:0.14 });
  const globe = new THREE.Mesh(globeGeo, globeMat);
  gScene.add(globe);

  // Nodes
  const nodes = [];
  for(let i=0;i<20;i++){
    const phi   = Math.random()*Math.PI*2;
    const theta = Math.acos(2*Math.random()-1);
    const r = 2.1;
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(0.04,8,8),
      new THREE.MeshBasicMaterial({ color:0x00d4ff })
    );
    node.position.set(r*Math.sin(theta)*Math.cos(phi), r*Math.cos(theta), r*Math.sin(theta)*Math.sin(phi));
    node.userData.offset = Math.random()*Math.PI*2;
    gScene.add(node);
    nodes.push(node);
  }

  // Lines
  for(let i=0;i<15;i++){
    const a = nodes[Math.floor(Math.random()*nodes.length)];
    const b = nodes[Math.floor(Math.random()*nodes.length)];
    const lGeo = new THREE.BufferGeometry().setFromPoints([a.position, b.position]);
    const line = new THREE.Line(lGeo, new THREE.LineBasicMaterial({ color:0x00d4ff, transparent:true, opacity:0.22 }));
    gScene.add(line);
  }

  let gTargetX=0, gTargetY=0;
  const heroEl = document.getElementById('hero');
  heroEl.addEventListener('mousemove', e=>{
    const r = heroEl.getBoundingClientRect();
    gTargetX = ((e.clientX-r.left)/r.width -0.5)*0.6;
    gTargetY = ((e.clientY-r.top )/r.height-0.5)*0.6;
  });

  let t=0;
  function globeAnimate(){
    requestAnimationFrame(globeAnimate);
    t += 0.016;
    globe.rotation.y += 0.003;
    globe.rotation.x += 0.001;
    globe.rotation.y += (gTargetX - globe.rotation.y)*0.03;
    globe.rotation.x += (gTargetY - globe.rotation.x)*0.03;
    nodes.forEach(n=>{
      const s = Math.sin(t + n.userData.offset)*0.3+1;
      n.scale.setScalar(s);
    });
    gRenderer.render(gScene, gCam);
  }
  globeAnimate();
})();

/* ── Custom Cursor ── */
(function initCursor(){
  if(window.innerWidth<=768) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let rx=0,ry=0, mx=0,my=0;
  document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  function lerpCursor(){
    rx += (mx-rx)*0.12;
    ry += (my-ry)*0.12;
    ring.style.left=rx+'px';
    ring.style.top =ry+'px';
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();
  document.querySelectorAll('a,button,.project-card,.skill-tag,.cert-card,.credly-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
  });
})();

/* ── Scroll Progress ── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll',()=>{
  const pct = scrollY/(document.body.scrollHeight-innerHeight)*100;
  progressBar.style.width = pct+'%';
});

/* ── Navbar ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll',()=>{ navbar.classList.toggle('scrolled', scrollY>60); });

/* ── Mobile Nav ── */
const toggle  = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
toggle.addEventListener('click',()=>{
  toggle.classList.toggle('active');
  mobileNav.classList.toggle('active');
  toggle.setAttribute('aria-expanded', mobileNav.classList.contains('active') ? 'true' : 'false');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  toggle.classList.remove('active');
  mobileNav.classList.remove('active');
  toggle.setAttribute('aria-expanded','false');
  document.body.style.overflow='';
}));

/* ── Active Nav Tracking ── */
const navLinks = document.querySelectorAll('.nav-links a');
const sectionTargets = document.querySelectorAll('section[id]');
const navObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(l=>{ l.classList.toggle('active', l.getAttribute('href')==='#'+e.target.id); });
    }
  });
},{rootMargin:'-20% 0px -75% 0px'});
sectionTargets.forEach(s=>navObs.observe(s));

/* ── Typewriter ── */
(function initTypewriter(){
  const el = document.getElementById('tw-text');
  const words = ['Cybersecurity Researcher','Ethical Hacker','AI Security Engineer','IEEE Author'];
  let wi=0, ci=0, deleting=false;
  function tick(){
    const word = words[wi];
    el.textContent = deleting ? word.slice(0,ci-1) : word.slice(0,ci+1);
    if(!deleting){ ci++; if(ci>word.length){ deleting=true; setTimeout(tick,2000); return; } }
    else         { ci--; if(ci===0){ deleting=false; wi=(wi+1)%words.length; setTimeout(tick,400); return; } }
    setTimeout(tick, deleting?50:90);
  }
  setTimeout(tick,600);
})();

/* ── Stats Count-Up ── */
(function initStats(){
  const nums = document.querySelectorAll('.stat-number');
  const statsObs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      statsObs.unobserve(e.target);
      const target = +e.target.dataset.target;
      const suffix = e.target.dataset.suffix||'';
      const dur    = 2000;
      const start  = performance.now();
      const ease   = t => 1-Math.pow(1-t,4);
      function step(now){
        const t = Math.min((now-start)/dur,1);
        e.target.textContent = Math.floor(ease(t)*target)+suffix;
        if(t<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  },{threshold:0.35});
  nums.forEach(n=>statsObs.observe(n));
})();

/* ── Scroll Reveal ── */
function initReveal(){
  const revealEls = document.querySelectorAll('.reveal:not(.visible)');
  const ro = new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        e.target.style.transitionDelay = (i * 80)+'ms';
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  },{threshold:0.1});
  revealEls.forEach(el=>ro.observe(el));
}
initReveal();

/* ── About Photo Tilt ── */
const aboutCard = document.getElementById('aboutCard');
if(aboutCard){
  aboutCard.addEventListener('mousemove',e=>{
    const r=aboutCard.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    aboutCard.style.transform=`perspective(600px) rotateY(${x*18}deg) rotateX(${-y*18}deg) scale(1.02)`;
  });
  aboutCard.addEventListener('mouseleave',()=>{ aboutCard.style.transform=''; });
}

/* ── 3D Skills Sphere ── */
(function initSkillSphere(){
  const container = document.getElementById('skillSphere');
  if(!container) return;

  const skills = [
    {name:'Kali Linux',type:'security'},{name:'Burp Suite',type:'security'},{name:'Metasploit',type:'security'},
    {name:'Wireshark',type:'security'},{name:'Nmap',type:'security'},{name:'SIEM / Log Analysis',type:'security'},
    {name:'Pen Testing',type:'security'},{name:'OWASP Top 10',type:'security'},{name:'OWASP LLM Top 10',type:'security'},
    {name:'MITRE ATT&CK',type:'security'},{name:'Detection Engineering',type:'security'},{name:'Incident Response',type:'security'},
    {name:'Threat Hunting',type:'security'},{name:'Entra ID / OAuth',type:'security'},{name:'Digital Forensics',type:'security'},
    {name:'Adversarial ML',type:'security'},{name:'CTF / Exploitation',type:'security'},{name:'DNS / SPF / DKIM',type:'security'},
    {name:'Python',type:'programming'},{name:'Rust',type:'programming'},{name:'C / C++',type:'programming'},
    {name:'Java',type:'programming'},{name:'TypeScript',type:'programming'},{name:'JavaScript',type:'programming'},
    {name:'PowerShell / KQL',type:'programming'},{name:'SQL',type:'programming'},{name:'Bash',type:'programming'},
    {name:'PyTorch',type:'programming'},{name:'XGBoost',type:'programming'},{name:'Scikit-learn',type:'programming'},
    {name:'SHAP / LIME',type:'programming'},{name:'ONNX Runtime',type:'programming'},{name:'YOLOv8',type:'programming'},
    {name:'FastAPI',type:'programming'},{name:'React',type:'programming'},{name:'Docker',type:'programming'},
    {name:'GitHub Actions',type:'programming'},{name:'AWS',type:'programming'},{name:'Alibaba Cloud',type:'programming'},
    {name:'Linux',type:'programming'},{name:'Git',type:'programming'},{name:'Playwright',type:'programming'},
    {name:'Research Writing',type:'soft'},{name:'Problem-Solving',type:'soft'},{name:'Team Work',type:'soft'},
    {name:'Communication',type:'soft'},{name:'Adaptability',type:'soft'},{name:'Project Management',type:'soft'},
  ];

  const N = skills.length;
  const R = container.offsetWidth/2 - 20 || 240;
  const cx = container.offsetWidth/2  || 260;
  const cy = container.offsetHeight/2 || 260;

  // Fibonacci sphere
  const pts = skills.map((_,i)=>{
    const theta = Math.acos(1 - 2*(i+0.5)/N);
    const phi   = Math.PI*(1+Math.sqrt(5))*i;
    return { x: R*Math.sin(theta)*Math.cos(phi), y: R*Math.cos(theta), z: R*Math.sin(theta)*Math.sin(phi) };
  });

  let aX=0.3, aY=0;
  let dragging=false, lastMX, lastMY, velX=0, velY=0;
  let paused = false;

  const tags = skills.map((s,i)=>{
    const el = document.createElement('div');
    el.className = `skill-tag ${s.type}`;
    el.textContent = s.name;
    el.addEventListener('mouseenter',()=>{ paused=true; });
    el.addEventListener('mouseleave',()=>{ paused=false; });
    container.appendChild(el);
    return el;
  });

  function rotP(p,ax,ay){
    const cy_=Math.cos(ay),sy_=Math.sin(ay);
    const cx_=Math.cos(ax),sx_=Math.sin(ax);
    const x1=p.x*cy_-p.z*sy_;
    const z1=p.x*sy_+p.z*cy_;
    const y1=p.y*cx_-z1*sx_;
    const z2=p.y*sx_+z1*cx_;
    return {x:x1,y:y1,z:z2};
  }

  function updateCloud(){
    if(!paused && !dragging){
      aY += 0.0035;
      aX += 0.0012;
    }
    if(!dragging){
      velX*=0.9; velY*=0.9;
      aX+=velX; aY+=velY;
    }
    tags.forEach((tag,i)=>{
      const p = rotP(pts[i],aX,aY);
      const scale   = (p.z+R)/(2*R)*0.85+0.55;
      const opacity = (p.z+R)/(2*R)*0.75+0.25;
      const tx = cx + p.x - tag.offsetWidth/2;
      const ty = cy + p.y - tag.offsetHeight/2;
      tag.style.transform  = `translate(${tx}px,${ty}px) scale(${scale})`;
      tag.style.opacity    = opacity;
      tag.style.zIndex     = Math.round((p.z+R));
    });
    requestAnimationFrame(updateCloud);
  }
  updateCloud();

  container.addEventListener('mousedown',e=>{ dragging=true; lastMX=e.clientX; lastMY=e.clientY; velX=velY=0; });
  window.addEventListener('mousemove',e=>{
    if(!dragging) return;
    const dx=e.clientX-lastMX, dy=e.clientY-lastMY;
    velY=dx*0.008; velX=dy*0.008;
    aY+=velY; aX+=velX;
    lastMX=e.clientX; lastMY=e.clientY;
  });
  window.addEventListener('mouseup',()=>{ dragging=false; });

  // Touch
  let lastTX, lastTY;
  container.addEventListener('touchstart',e=>{ lastTX=e.touches[0].clientX; lastTY=e.touches[0].clientY; },{passive:true});
  container.addEventListener('touchmove',e=>{
    const dx=e.touches[0].clientX-lastTX, dy=e.touches[0].clientY-lastTY;
    aY+=dx*0.008; aX+=dy*0.008;
    lastTX=e.touches[0].clientX; lastTY=e.touches[0].clientY;
  },{passive:true});
})();

/* ── Projects (curated; every card has a real screenshot from the repository) ── */
const PROJECTS = [
  {
    title:'VoiceGuard', cats:['Security','AI/ML'], lang:'Python', year:'2026',
    image:'img/projects/voiceguard.webp', alt:'VoiceGuard overview: real-time voice deepfake detection, 2.84% EER, 0.62 MB edge model',
    desc:'Real-time voice-deepfake detection, synthesis watermarking and vishing defence. XLS-R + AASIST server model, a separate 0.62 MB ONNX edge model, Integrated-Gradients explanations, C2PA-signed provenance and NIST SP 800-86-style forensic reports. Team project at CUD; the platform that grew out of paper [2].',
    facts:['2.84% EER · ASVspoof 2021 LA','0.62 MB edge model','FastAPI + React'],
    topics:['deepfake-detection','aasist','onnx','fastapi'],
    code:'https://github.com/MohammadThabetHassan/VoiceGuard', paper:'https://doi.org/10.1109/SM69703.2026.11614145'
  },
  {
    title:'TrustWeave', cats:['Security','AI/ML'], lang:'Python', year:'2026',
    image:'img/projects/trustweave.webp', alt:'TrustWeave scan output: a decision table of which sources may reach which tools',
    desc:'Static security review for AI-agent configurations (LangGraph, CrewAI, OpenAI Agents, MCP). Maps source-to-tool flows and flags untrusted input that can reach a privileged action. Runs locally and deterministically, with no agent execution and no network calls. Apache-2.0.',
    facts:['Published on PyPI','25 adversarial scenario patterns','CI · benchmarks · CITATION.cff'],
    topics:['agent-security','mcp','static-analysis','llm-security'],
    code:'https://github.com/MohammadThabetHassan/trustweave', pypi:'https://pypi.org/project/trustweave/', demo:'https://mohammadthabethassan.github.io/trustweave/', demoLabel:'Docs'
  },
  {
    title:'XAI-IDS', cats:['Security','AI/ML','SOC'], lang:'Python', year:'2026',
    image:'img/projects/xai-ids.webp', alt:'XAI-IDS dashboard showing a DDoS prediction with per-feature explanations and the confidence score',
    desc:'Explainable intrusion detection across CIC-IDS-2017, UNSW-NB15 and CSE-CIC-IDS-2018 with SHAP and LIME, plus an XAI Confidence Score that tells the analyst which alerts deserve a second look. Live in-browser XGBoost demo, model card, benchmark tables and CI. Basis of manuscript [4].',
    facts:['16M+ flows · 26 attack classes','F1 up to 0.9964','Cohen’s d 1.0–1.2'],
    topics:['intrusion-detection','explainable-ai','shap','xgboost'],
    code:'https://github.com/MohammadThabetHassan/xai-ids', demo:'https://mohammadthabethassan.github.io/xai-ids/'
  },
  {
    title:'MIRAGE SOC Lab', cats:['SOC','Security'], lang:'TypeScript', year:'2026',
    image:'img/projects/mirage-soc-lab.webp', alt:'MIRAGE SOC Lab: controlled detection engineering and SOC training',
    desc:'Controlled SOC lab for deterministic detection engineering: replayable telemetry, explainable analyst cases mapped to MITRE ATT&CK, and regression tests for the rule catalogue, so a detection change can be proven rather than assumed.',
    facts:['ATT&CK-mapped cases','Rule regression tests','Playwright end-to-end tests'],
    topics:['detection-engineering','soc-lab','react','typescript'],
    code:'https://github.com/MohammadThabetHassan/mirage-soc-lab', demo:'https://mohammadthabethassan.github.io/mirage-soc-lab/', demoLabel:'Overview'
  },
  {
    title:'DiskTrace', cats:['Forensics','Security'], lang:'Rust', year:'2026',
    image:'img/projects/disktrace.webp', alt:'DiskTrace desktop workspace after a read-only scan: recovered candidates and evidence detail',
    desc:'Read-only forensic recovery for disk images with explicit evidence boundaries. Every candidate carries its method, source range, validation state and an export receipt; the source image is never written to. Native desktop app in Rust.',
    facts:['Local-first · no telemetry','Machine-readable receipts','CodeQL + release CI'],
    topics:['dfir','data-carving','chain-of-custody','egui'],
    code:'https://github.com/MohammadThabetHassan/disktrace'
  },
  {
    title:'TokenAbuse-Azure', cats:['Security','SOC'], lang:'PowerShell', year:'2026',
    image:'img/projects/tokenabuse-azure.webp', alt:'TokenAbuse-Azure attack chain: device-code phishing, token theft, Graph and SharePoint enumeration, exfiltration',
    desc:'Walkthrough of an authorised cloud red-team CTF: OAuth device-code phishing, token theft, Microsoft Graph and SharePoint enumeration, and exfiltration, without touching the perimeter. Paired with the KQL hunts and the Conditional Access policy that catch the chain.',
    facts:['Entra ID / Microsoft 365','Mapped to MITRE ATT&CK','Detections included'],
    topics:['device-code-phishing','entra-id','kql','microsoft-sentinel'],
    code:'https://github.com/MohammadThabetHassan/TokenAbuse-Azure', codeLabel:'Write-up'
  },
  {
    title:'Facts Only', cats:['AI/ML','Web'], lang:'JavaScript', year:'2026',
    image:'img/projects/facts-only.webp', alt:'Facts Only report flagging one source in an AI answer as likely planted',
    desc:'Browser extension and web app that flags paid or planted sources in AI chatbot answers. Shows evidence, never a true-or-false verdict. English and Arabic, zero dependencies, 174 offline checks.',
    facts:['0 false positives / 209 publishers','English + Arabic (RTL)','Zero dependencies'],
    topics:['browser-extension','misinformation','osint','trust-and-safety'],
    code:'https://github.com/MohammadThabetHassan/facts-only', demo:'https://mohammadthabethassan.github.io/facts-only/webapp/index.html?demo=1'
  },
  {
    title:'Campus Safety Detection', cats:['AI/ML'], lang:'Python', year:'2026',
    image:'img/projects/campus-safety.webp', alt:'Campus Safety Detection running on a phone: a fire alarm detected in the camera view',
    desc:'Real-time YOLOv8m detector for four campus-safety objects (wet-floor signs, fire alarms, exit signs, helmets), trained on a 10,000-image dataset from four public sources, with a class-balancing pipeline included. Runs in the browser through ONNX Runtime Web. BCS407 course project at CUD.',
    facts:['mAP@0.5 = 0.98','5.2 ms per frame','Runs in the browser (ONNX Runtime Web)'],
    topics:['yolov8','computer-vision','onnxruntime-web','class-imbalance'],
    code:'https://github.com/MohammadThabetHassan/bcs407-campus-safety', demo:'https://campussafety.eu.cc'
  },
  {
    title:'Odoo AI Helpdesk Triage', cats:['AI/ML','Tools'], lang:'Python', year:'2026',
    image:'img/projects/odoo-helpdesk.webp', alt:'GitHub Actions history for the Odoo AI helpdesk triage add-on, every run passing',
    desc:'Odoo 19 add-on that turns Claude into a guarded first-line helpdesk agent: triage, routing and tool-use resolution behind cost caps, rate limits, circuit breakers and a human final say. Per-tool audit trail, safety gates and 74 tests.',
    facts:['Cost caps + circuit breakers','Per-tool audit trail','74 tests'],
    topics:['odoo-19','ai-agents','llm-security','helpdesk'],
    code:'https://github.com/MohammadThabetHassan/odoo-ai-helpdesk-triage'
  },
  {
    title:'Voice Deepfake Vishing Toolkit', cats:['Security','AI/ML'], lang:'Python', year:'2025',
    image:'img/projects/voice-deepfake-toolkit.webp', alt:'Voice Deepfake Vishing Detector web app upload screen',
    desc:'The earlier research toolkit behind paper [2]: MFCC, jitter and shimmer features with an XGBoost classifier, plus a generator for building vishing test sets. It grew into VoiceGuard.',
    facts:['XGBoost ensemble · F1 0.95','< 2 MB model','36.8 ms feature extraction'],
    topics:['vishing','audio-deepfake','xgboost','mfcc'],
    code:'https://github.com/MohammadThabetHassan/Voice-Deepfake-Vishing-Detector-Generator', demo:'https://mohammadthabethassan.github.io/Voice-Deepfake-Vishing-Detector-Generator/'
  },
];

const LANG_COLORS = {
  Python:'#3776ab', JavaScript:'#f7df1e', TypeScript:'#3178c6', Java:'#b07219', Rust:'#dea584',
  PowerShell:'#5391fe', C:'#a8b9cc', 'C++':'#f34b7d', Shell:'#89e051', HTML:'#e34c26', default:'#64748b'
};

const ARROW = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

function renderProjectCards(projects){
  const g=document.getElementById('projects-grid');
  g.innerHTML='';
  const allCats = projects.flatMap(p=>p.cats);
  const cats = ['all', ...new Set(allCats)];
  const filterBar = document.getElementById('filterBar');
  const counts = {};
  projects.forEach(p=>{ p.cats.forEach(c=>{ counts[c]=(counts[c]||0)+1; }); });
  filterBar.innerHTML = cats.map(c=>{
    const cnt = c==='all' ? projects.length : (counts[c]||0);
    return `<button class="filter-btn${c==='all'?' active':''}" data-filter="${c}" aria-pressed="${c==='all'}">${c==='all'?'All':c} <span class="count">${cnt}</span></button>`;
  }).join('');

  filterBar.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      filterBar.querySelectorAll('.filter-btn').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      const f=btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card=>{
        const cardCats = card.dataset.categories.split(',');
        const match = f==='all' || cardCats.includes(f);
        card.style.opacity=match?'1':'0.15';
        card.style.pointerEvents=match?'auto':'none';
        card.style.transform=match?'':'scale(0.97)';
      });
    });
  });

  projects.forEach(p=>{
    const primaryCat = p.cats[0];
    const lc = LANG_COLORS[p.lang] || LANG_COLORS.default;
    const card = document.createElement('article');
    card.className = 'project-card';
    card.dataset.categories = p.cats.join(',');
    card.style.opacity = '1';
    card.style.transform = 'none';

    const catTags = p.cats.map(c=>`<span class="proj-cat cat-${CSS.escape(c)}">${c}</span>`).join(' ');
    const links = [
      `<a href="${p.code}" target="_blank" rel="noopener" class="proj-link">${p.codeLabel||'Source Code'} ${ARROW}</a>`,
      p.demo  ? `<a href="${p.demo}" target="_blank" rel="noopener" class="proj-link demo">${p.demoLabel||'Live Demo'} ${ARROW}</a>` : '',
      p.paper ? `<a href="${p.paper}" target="_blank" rel="noopener" class="proj-link paper">Paper ${ARROW}</a>` : '',
      p.pypi  ? `<a href="${p.pypi}" target="_blank" rel="noopener" class="proj-link pypi">PyPI ${ARROW}</a>` : '',
    ].join('');

    card.innerHTML = `
      <div class="project-accent-bar accent-${CSS.escape(primaryCat)}"></div>
      <div class="proj-img"><img src="${p.image}" width="1200" height="675" alt="${p.alt}" loading="lazy"></div>
      <div class="proj-body">
        <div class="proj-meta">
          <div>${catTags}</div>
          <span class="proj-date">${p.year}</span>
        </div>
        <div class="proj-title">${p.title}</div>
        <p class="proj-desc">${p.desc}</p>
        <div class="proj-facts">${p.facts.map(f=>`<span>${f}</span>`).join('')}</div>
        <div class="proj-footer">
          <div>
            <div class="proj-lang"><span class="lang-dot" style="background:${lc}"></span>${p.lang}</div>
            <div class="proj-topics">${p.topics.map(t=>`<span class="topic-tag">${t}</span>`).join('')}</div>
          </div>
        </div>
        <div class="proj-links">${links}</div>
      </div>`;

    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-0.5;
      const y=(e.clientY-r.top)/r.height-0.5;
      card.style.transform=`perspective(800px) rotateY(${x*16}deg) rotateX(${-y*16}deg) scale(1.03)`;
      card.style.boxShadow=`${-x*14}px ${y*14}px 30px rgba(0,212,255,0.14)`;
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; card.style.boxShadow=''; });

    g.appendChild(card);
  });
}
renderProjectCards(PROJECTS);

/* ── Certifications from certs.json ── */
(async function initCerts(){
  try{
    const res = await fetch('certs.json');
    if(!res.ok) throw new Error('Failed');
    const data = await res.json();

    // Render badges
    const credlyRow = document.getElementById('credlyRow');
    credlyRow.innerHTML = data.badges.map(b=>`
      <a href="${b.url}" target="_blank" rel="noopener" class="credly-card">
        <img class="credly-img" src="${b.image}" width="320" height="320" alt="${b.name}" loading="lazy">
        <div class="credly-name">${b.name}</div>
        ${b.issuer?`<div class="credly-issuer">${b.issuer}</div>`:''}
      </a>
    `).join('');

    // Render cert cards
    const certGrid = document.getElementById('certGrid');
    certGrid.innerHTML = data.certifications.map(c=>{
      const imgHTML = c.image
        ? `<div class="cert-img-wrap"><img src="${c.image}" alt="${c.name}" loading="lazy"></div>`
        : `<div class="cert-img-wrap" style="background:var(--surface);display:flex;align-items:center;justify-content:center;"><span style="font-size:3rem">📜</span></div>`;
      const verifyHTML = c.verify
        ? `<a href="${c.verify}" target="_blank" rel="noopener" class="cert-verify" aria-label="Verify: ${c.name}">Verify ↗</a>`
        : `<span class="cert-verify" style="cursor:default;color:var(--muted)">Completed</span>`;
      return `<div class="cert-card reveal" data-cert="${c.category}">
        ${imgHTML}
        <div class="cert-body-inner">
          <span class="cert-issuer iss-${c.issuerKey||'Other'}">${c.issuer}</span>
          <h3>${c.name}</h3>
          ${c.meta?`<div class="cert-meta">${c.meta}</div>`:''}
          ${verifyHTML}
        </div>
      </div>`;
    }).join('');

    // Render filter buttons
    const cats = ['all', ...new Set(data.certifications.map(c=>c.category))];
    const certFilterBar = document.getElementById('certFilterBar');
    const labels = {all:'All',cybersecurity:'Cybersecurity',ai:'AI',programming:'Programming',data:'Data Analysis'};
    certFilterBar.innerHTML = cats.map(c=>`<button class="filter-btn${c==='all'?' active':''}" data-cert="${c}">${labels[c]||c}</button>`).join('');

    // Bind filter
    certFilterBar.querySelectorAll('.filter-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        certFilterBar.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const f=btn.dataset.cert;
        document.querySelectorAll('.cert-card').forEach(c=>{
          c.style.display = (f==='all'||c.dataset.cert===f)?'':'none';
        });
      });
    });

    initReveal();
  } catch(e){
    console.warn('Failed to load certs.json:', e.message);
  }
})();

/* ── GSAP Achievements ── */
if(!prefersReducedMotion && typeof gsap!=='undefined'){
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.t-item').forEach((el,i)=>{
    const isLeft = i%2===0;
    gsap.from(el.querySelector('.t-card'),{
      x: isLeft?-60:60, opacity:0, duration:0.85,
      ease:'power3.out',
      scrollTrigger:{ trigger:el, start:'top 88%' }
    });
  });
}

/* ── Contact Form ── */
document.getElementById('contactForm').addEventListener('submit',function(e){
  e.preventDefault();
  const btn = e.target.querySelector('.btn-send');
  const fd = new FormData(e.target);
  const name=fd.get('name'), email=fd.get('email'), msg=fd.get('message');
  btn.textContent = 'OPENING EMAIL...';
  btn.disabled = true;
  window.location.href=`mailto:Mohammad_Thabet@hotmail.com?subject=${encodeURIComponent('Portfolio Contact — '+name)}&body=${encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\nMessage:\n'+msg)}`;
  setTimeout(()=>{
    btn.textContent = 'OPENED IN YOUR MAIL APP ✓';
    btn.style.background = 'linear-gradient(135deg, var(--green), #00b894)';
    e.target.reset();
    setTimeout(()=>{ btn.textContent='SEND MESSAGE →'; btn.style.background=''; btn.disabled=false; },3000);
  },1000);
});

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const target=document.querySelector(a.getAttribute('href'));
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({behavior:'smooth', block:'start'});
  });
});