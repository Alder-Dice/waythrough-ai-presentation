/**
 * Waythrough Presentation Engine: "AI and Waythrough: Questions"
 * Hub-and-Spoke Topography & Interactive Brainstorm Controller
 */

(function() {
  'use strict';

  // --- Topography State ---
  const state = {
    view: 'hub', // 'hub' | 'spoke'
    spoke: 1,    // 1..4
    slide: 0,    // 0-indexed per spoke
    spokeCounts: { 1: 3, 2: 2, 3: 3, 4: 3 },
    spokeTitles: {
      1: 'The Spectrum: Do / Could / Should',
      2: 'Principles & Transparency',
      3: 'The Triangle: People Accessing Services, Us & AI',
      4: 'Possible Futures & Resilience'
    }
  };

  // --- DOM Elements ---
  let viewHub = null;
  let spokeViews = {};
  let hudBar = null;
  let hudBreadcrumb = null;
  let footerBar = null;
  let slideDotsContainer = null;
  let hubReturnBtn = null;
  let fullscreenBtn = null;

  function queryDOMElements() {
    viewHub = document.getElementById('viewHub');
    spokeViews = {
      1: document.getElementById('viewSpoke1'),
      2: document.getElementById('viewSpoke2'),
      3: document.getElementById('viewSpoke3'),
      4: document.getElementById('viewSpoke4')
    };
    hudBar = document.getElementById('stageHud');
    hudBreadcrumb = document.getElementById('hudBreadcrumb');
    footerBar = document.getElementById('stageFooter');
    slideDotsContainer = document.getElementById('slideDots');
    hubReturnBtn = document.getElementById('btnReturnHub');
    fullscreenBtn = document.getElementById('btnFullscreen');
  }

  // --- Navigation Functions ---
  function updateHUD() {
    if (hudBar) {
      if (state.view === 'hub') {
        hudBar.classList.add('dark-theme');
        if (hudBreadcrumb) {
          hudBreadcrumb.innerHTML = `
            <span class="hud-brand-dot"></span>
            <span>WAYTHROUGH // AI BRAINSTORM CORE</span>
          `;
        }
        if (hubReturnBtn) hubReturnBtn.style.display = 'none';
      } else {
        hudBar.classList.remove('dark-theme');
        if (hudBreadcrumb) {
          hudBreadcrumb.innerHTML = `
            <span class="hud-brand-dot"></span>
            <span>SECTION ${state.spoke} // SLIDE ${state.spoke}.${state.slide + 1} // ${state.spokeTitles[state.spoke]}</span>
          `;
        }
        if (hubReturnBtn) hubReturnBtn.style.display = 'inline-flex';
      }
    }

    if (footerBar) {
      if (state.view === 'hub') {
        footerBar.classList.add('dark-theme');
        if (slideDotsContainer) slideDotsContainer.innerHTML = '';
      } else {
        footerBar.classList.remove('dark-theme');
        if (slideDotsContainer) {
          const total = state.spokeCounts[state.spoke];
          let dotsHtml = '';
          for (let i = 0; i < total; i++) {
            dotsHtml += `<div class="slide-dot ${i === state.slide ? 'active' : ''}" data-slide="${i}"></div>`;
          }
          slideDotsContainer.innerHTML = dotsHtml;

          slideDotsContainer.querySelectorAll('.slide-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
              const idx = parseInt(e.target.getAttribute('data-slide'));
              goToSlide(idx);
            });
          });
        }
      }
    }
  }

  // --- Multi-Directional GSAP Slide Transition Engine ---
  function animateSlideEntrance(panelEl, direction = 1) {
    if (typeof gsap === 'undefined' || !panelEl) return;

    // Set panel visible and reset root transforms
    panelEl.style.opacity = '1';
    panelEl.style.transform = 'none';

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Slide Headline & Subhead (Glide down from above)
    const headline = panelEl.querySelector('.slide-headline');
    const subhead = panelEl.querySelector('.slide-subhead');
    if (headline) {
      tl.fromTo(headline, 
        { y: -26, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.38 }, 
        0
      );
    }
    if (subhead) {
      tl.fromTo(subhead, 
        { y: -14, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.35 }, 
        0.04
      );
    }

    // 2. Multi-Directional Content Grid Layouts
    const split = panelEl.querySelector('.split-grid-2');
    const trio = panelEl.querySelector('.trio-grid');
    const quad = panelEl.querySelector('.quad-grid');

    if (split) {
      // 2-Column Split: Independent lateral sliding from left & right
      const leftCol = split.children[0];
      const rightCol = split.children[1];
      if (leftCol) {
        tl.fromTo(leftCol, 
          { x: direction > 0 ? -45 : 45, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 
          0.06
        );
      }
      if (rightCol) {
        tl.fromTo(rightCol, 
          { x: direction > 0 ? 45 : -45, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 
          0.1
        );
      }
    } else if (trio) {
      // 3-Column Trio: Left card from left-bottom, center card rising, right card from right-bottom
      const cols = Array.from(trio.children);
      if (cols[0]) {
        tl.fromTo(cols[0], 
          { x: -35, y: 22, opacity: 0 }, 
          { x: 0, y: 0, opacity: 1, duration: 0.38, ease: 'power2.out' }, 
          0.06
        );
      }
      if (cols[1]) {
        tl.fromTo(cols[1], 
          { y: 35, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.38, ease: 'power2.out' }, 
          0.12
        );
      }
      if (cols[2]) {
        tl.fromTo(cols[2], 
          { x: 35, y: 22, opacity: 0 }, 
          { x: 0, y: 0, opacity: 1, duration: 0.38, ease: 'power2.out' }, 
          0.18
        );
      }
    } else if (quad) {
      // 4-Column Quad: Alternating subtle lateral and vertical momentum
      const cols = Array.from(quad.children);
      cols.forEach((col, idx) => {
        const xOffset = (idx % 2 === 0 ? -24 : 24);
        tl.fromTo(col, 
          { x: xOffset, y: 18, opacity: 0 }, 
          { x: 0, y: 0, opacity: 1, duration: 0.36, ease: 'power2.out' }, 
          0.06 + idx * 0.05
        );
      });
    }

    // 3. Bespoke Duotone Vector Icons (Tactile spring pop)
    const icons = panelEl.querySelectorAll('.card-icon-pill');
    if (icons.length > 0) {
      tl.fromTo(icons, 
        { scale: 0.65, opacity: 0, rotation: -6 }, 
        { scale: 1, opacity: 1, rotation: 0, duration: 0.4, stagger: 0.04, ease: 'back.out(1.8)' }, 
        0.12
      );
    }

    // 4. Interactive Tripartite Triangle Widget (Slide 3.1)
    const triangleContainer = panelEl.querySelector('.triangle-interactive-container');
    if (triangleContainer) {
      const svgWrap = triangleContainer.querySelector('.triangle-svg-wrap');
      const detailCard = triangleContainer.querySelector('.aspect-detail-card');
      const nodeBtns = triangleContainer.querySelectorAll('.triangle-node-container');
      const aspectBtns = triangleContainer.querySelectorAll('.aspect-btn');

      if (svgWrap) {
        tl.fromTo(svgWrap, 
          { scale: 0.88, rotation: -8, opacity: 0 }, 
          { scale: 1, rotation: 0, opacity: 1, duration: 0.44, ease: 'power2.out' }, 
          0.08
        );
      }
      if (nodeBtns.length > 0) {
        tl.fromTo(nodeBtns, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.32, stagger: 0.05, ease: 'back.out(1.6)' }, 
          0.18
        );
      }
      if (detailCard) {
        tl.fromTo(detailCard, 
          { x: 40, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 0.38, ease: 'power2.out' }, 
          0.14
        );
      }
      if (aspectBtns.length > 0) {
        tl.fromTo(aspectBtns, 
          { y: -10, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.28, stagger: 0.03 }, 
          0.16
        );
      }
    }

    // 5. Interactive Spectrum Widget (Slide 1.3)
    const spectrumWidget = panelEl.querySelector('.spectrum-widget');
    if (spectrumWidget) {
      tl.fromTo(spectrumWidget, 
        { y: 30, scale: 0.96, opacity: 0 }, 
        { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }, 
        0.08
      );
    }

    // 6. Organic Pebble Photo Masks (Slide 1.2, 2.2, 3.2, 3.3, 4.1)
    const pebblePhotos = panelEl.querySelectorAll('.wt-pebble-mask-1, .wt-pebble-mask-2, .wt-pebble-mask-3');
    if (pebblePhotos.length > 0) {
      tl.fromTo(pebblePhotos, 
        { x: 45, scale: 0.94, opacity: 0 }, 
        { x: 0, scale: 1, opacity: 1, duration: 0.42, ease: 'power2.out' }, 
        0.12
      );
    }

    // 7. Debate Talking Point Drawer (Smooth ascent from bottom)
    const debateDrawer = panelEl.querySelector('.debate-drawer-wrap');
    if (debateDrawer) {
      tl.fromTo(debateDrawer, 
        { y: 22, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, 
        0.18
      );
    }
  }

  function goToHub() {
    state.view = 'hub';
    Object.values(spokeViews).forEach(v => {
      if (v) {
        v.classList.remove('active');
        v.style.display = 'none';
      }
    });
    if (viewHub) {
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(viewHub);
      }
      viewHub.classList.remove('hidden');
      viewHub.style.display = 'flex';
      viewHub.style.pointerEvents = 'auto';
      viewHub.style.opacity = '1';

      if (typeof gsap !== 'undefined') {
        const hubTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Hub central core breathing entrance
        const core = viewHub.querySelector('.hub-center-core');
        if (core) {
          hubTl.fromTo(core, 
            { scale: 0.92, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.36, ease: 'power2.out' }, 
            0
          );
        }

        // Connecting orbital splines
        const splines = viewHub.querySelectorAll('.spline-line');
        if (splines.length > 0) {
          hubTl.fromTo(splines, 
            { opacity: 0 }, 
            { opacity: 0.45, duration: 0.32 }, 
            0.04
          );
        }

        // 4 Radial Spoke Cards entering from their 4 respective corners
        const spoke1 = viewHub.querySelector('.spoke-node-1');
        const spoke2 = viewHub.querySelector('.spoke-node-2');
        const spoke3 = viewHub.querySelector('.spoke-node-3');
        const spoke4 = viewHub.querySelector('.spoke-node-4');

        if (spoke1) hubTl.fromTo(spoke1, { x: -45, y: -35, opacity: 0, scale: 0.95 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.36, ease: 'back.out(1.15)' }, 0.06);
        if (spoke2) hubTl.fromTo(spoke2, { x: 45, y: -35, opacity: 0, scale: 0.95 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.36, ease: 'back.out(1.15)' }, 0.1);
        if (spoke3) hubTl.fromTo(spoke3, { x: -45, y: 35, opacity: 0, scale: 0.95 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.36, ease: 'back.out(1.15)' }, 0.14);
        if (spoke4) hubTl.fromTo(spoke4, { x: 45, y: 35, opacity: 0, scale: 0.95 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.36, ease: 'back.out(1.15)' }, 0.18);

        // Spoke duotone icons spring pop
        const spokeIcons = viewHub.querySelectorAll('.spoke-icon-pill');
        if (spokeIcons.length > 0) {
          hubTl.fromTo(spokeIcons, 
            { scale: 0.7, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.3, stagger: 0.03, ease: 'back.out(1.8)' }, 
            0.12
          );
        }
      }
    }
    updateHUD();
  }

  function goToSpoke(spokeNum, slideIndex = 0) {
    if (!spokeViews[spokeNum]) return;
    state.view = 'spoke';
    state.spoke = spokeNum;
    state.slide = slideIndex;

    if (viewHub) {
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(viewHub);
      }
      viewHub.classList.add('hidden');
      viewHub.style.display = 'none';
      viewHub.style.opacity = '0';
      viewHub.style.pointerEvents = 'none';
    }

    Object.entries(spokeViews).forEach(([num, el]) => {
      if (parseInt(num) === spokeNum) {
        el.classList.add('active');
        el.style.display = 'flex';
        // Activate target slide panel
        const panels = el.querySelectorAll('.slide-panel');
        panels.forEach((p, idx) => {
          if (idx === state.slide) {
            p.classList.add('active');
            p.style.display = 'flex';
            animateSlideEntrance(p, 1);
          } else {
            p.classList.remove('active');
            p.style.display = 'none';
          }
        });
      } else {
        el.classList.remove('active');
        el.style.display = 'none';
      }
    });

    updateHUD();
  }

  function goToSlide(targetSlideIdx) {
    if (state.view !== 'spoke') return;
    const count = state.spokeCounts[state.spoke];
    if (targetSlideIdx < 0 || targetSlideIdx >= count) return;

    const direction = targetSlideIdx >= state.slide ? 1 : -1;
    state.slide = targetSlideIdx;
    const spokeEl = spokeViews[state.spoke];
    const panels = spokeEl.querySelectorAll('.slide-panel');

    panels.forEach((p, idx) => {
      if (idx === targetSlideIdx) {
        p.classList.add('active');
        p.style.display = 'flex';
        animateSlideEntrance(p, direction);
      } else {
        p.classList.remove('active');
        p.style.display = 'none';
      }
    });

    updateHUD();
  }

  function nextSlide() {
    if (state.view === 'hub') {
      goToSpoke(1, 0);
      return;
    }
    const max = state.spokeCounts[state.spoke];
    if (state.slide < max - 1) {
      goToSlide(state.slide + 1);
    } else {
      // Finished spoke -> return to Hub smoothly
      goToHub();
    }
  }

  function prevSlide() {
    if (state.view === 'hub') return;
    if (state.slide > 0) {
      goToSlide(state.slide - 1);
    } else {
      goToHub();
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // --- Setup Hub Click Handlers ---
  function setupNavigationControls() {
    document.querySelectorAll('.spoke-node').forEach(node => {
      node.addEventListener('click', () => {
        const spoke = parseInt(node.getAttribute('data-spoke'));
        if (spoke) goToSpoke(spoke, 0);
      });
    });

    if (hubReturnBtn) {
      hubReturnBtn.addEventListener('click', goToHub);
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
  }

  // --- Keyboard Controller ---
  window.addEventListener('keydown', (e) => {
    if (!window.__presentationLoaded) return;
    // Ignore if typing in input
    if (document.activeElement && ['input', 'textarea', 'select'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }

    switch (e.key) {
      case 'Escape':
      case 'h':
      case 'H':
      case '0':
        goToHub();
        break;
      case '1':
        goToSpoke(1, 0);
        break;
      case '2':
        goToSpoke(2, 0);
        break;
      case '3':
        goToSpoke(3, 0);
        break;
      case '4':
        goToSpoke(4, 0);
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
    }
  });

  // --- Interactive Widgets ---

  // 1. Collapsible Debate Drawer
  function setupDebateDrawers() {
    document.querySelectorAll('.debate-prompt-bar').forEach(bar => {
      bar.addEventListener('click', () => {
        const body = bar.nextElementSibling;
        if (!body) return;
        const isOpen = bar.classList.contains('open');
        bar.classList.toggle('open', !isOpen);
        body.classList.toggle('open', !isOpen);
      });
    });
  }

  // 2. Spectrum Slider (Section 1.3)
  const spectrumData = {
    drafting: {
      0: { level: 'PROHIBITED', risk: 'Low', carbon: 'None', rec: 'Staff manually author all drafts. Zero synthetic assistance allowed.' },
      1: { level: 'HUMAN-IN-THE-LOOP ASSIST (Recommended)', risk: 'Controlled', carbon: 'Minimal (<1g CO2e)', rec: 'Staff use locally-hosted AI for outline & synthesis; staff retain full ownership and review.' },
      2: { level: 'SUPERVISED GENERATION', risk: 'Moderate', carbon: 'Standard (3g CO2e)', rec: 'System automatically drafts letters based on EHR records; practitioner mandatory sign-off.' },
      3: { level: 'AUTONOMOUS DISPATCH', risk: 'HIGH (Inadmissible)', carbon: 'High', rec: 'System sends unreviewed communications. Unacceptable in trauma-informed care.' }
    },
    triage: {
      0: { level: 'HUMAN TRIAGE ONLY', risk: 'Low', carbon: 'None', rec: 'Experienced triage nurse or worker assesses all incoming requests.' },
      1: { level: 'DECISION SUPPORT (Recommended)', risk: 'Controlled', carbon: 'Minimal', rec: 'AI flags risk keywords and suggests relevant pathway; human decides appointment urgency.' },
      2: { level: 'AUTOMATED QUEUING', risk: 'High', carbon: 'Moderate', rec: 'System assigns priority slots automatically based on intake questionnaire.' },
      3: { level: 'AUTONOMOUS GATEKEEPING', risk: 'UNACCEPTABLE', carbon: 'High', rec: 'Algorithms reject or redirect people accessing services without clinician oversight. High clinical danger.' }
    },
    therapeutic: {
      0: { level: 'STRICTLY HUMAN (Recommended)', risk: 'None', carbon: 'None', rec: 'Psychotherapy, recovery coaching, and emotional listening remain 100% authentic human connection.' },
      1: { level: 'RESOURCE RECOMMENDATION', risk: 'Low', carbon: 'Minimal', rec: 'AI suggests evidence-based worksheets or self-management exercises curated by clinicians.' },
      2: { level: 'COMPANION CHATBOT', risk: 'High Risk', carbon: 'Moderate', rec: 'Synthetic empathy chatbots. Risk of hallucination, pseudo-intimacy, and digital abandonment.' },
      3: { level: 'AUTONOMOUS THERAPY', risk: 'CRITICAL HAZARD', carbon: 'High', rec: 'Replacing human practitioners with bots. Contradicts Waythrough core human ethos.' }
    },
    risk_forecasting: {
      0: { level: 'MANUAL MODELLING', risk: 'Low', carbon: 'None', rec: 'Manual budget, caseload, and operational risk projections using spreadsheets.' },
      1: { level: 'TREND ANALYSIS (Recommended)', risk: 'Controlled', carbon: 'Minimal', rec: 'Statistical modelling on aggregated operational data and policy changes to identify emerging capacity pressures.' },
      2: { level: 'PREDICTIVE DEMAND ALLOCATION', risk: 'Moderate', carbon: 'Moderate', rec: 'AI models forecast regional service demand surges and staffing requirements to support strategic planning.' },
      3: { level: 'AUTONOMOUS RESOURCE ALLOCATION', risk: 'HIGH (Inadmissible)', carbon: 'High', rec: 'Automated contract, budget, or service restructuring decisions without executive and board governance.' }
    }
  };

  let currentSpectrumDomain = 'drafting';

  function setupSpectrumWidget() {
    const slider = document.getElementById('spectrumRange');
    const domainTabs = document.querySelectorAll('.domain-tab');
    const levelLabel = document.getElementById('spectrumLevelText');
    const riskLabel = document.getElementById('spectrumRiskText');
    const carbonLabel = document.getElementById('spectrumCarbonText');
    const recLabel = document.getElementById('spectrumRecText');

    if (!slider) return;

    function updateReadout() {
      const val = parseInt(slider.value);
      const data = spectrumData[currentSpectrumDomain][val] || spectrumData[currentSpectrumDomain][1];
      if (levelLabel) levelLabel.textContent = data.level;
      if (riskLabel) riskLabel.textContent = `Risk Profile: ${data.risk}`;
      if (carbonLabel) carbonLabel.textContent = `Compute: ${data.carbon}`;
      if (recLabel) recLabel.textContent = data.rec;
    }

    slider.addEventListener('input', updateReadout);

    domainTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        domainTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentSpectrumDomain = tab.getAttribute('data-domain');
        updateReadout();
      });
    });

    updateReadout();
  }

  // 3. Tripartite Triangle Widget (Section 3)
  const triangleDetails = {
    partner: {
      title: 'AI as Partner: Enhancing Pathway Access',
      body: 'AI acts as a supportive bridge between the public and Waythrough services.',
      bullets: [
        'Discovery: Conversational AI search ("Where can I get discreet help in Leeds?") accurately citing Waythrough opening hours.',
        'Practical Life Skills: Routine reminders, managing recovery diaries, CV drafting support for people accessing supported tenancy services.',
        'Administrative De-burdening: Frees practitioners from note duplication so they spend 80% of time in eye-to-eye human care.'
      ],
      takeaway: 'Key Ethos: AI handles administrative friction; humans deliver unconditional positive regard.'
    },
    competitor: {
      title: 'AI as Competitor: The Rise of Synthetic Empathy',
      body: 'Commercial tech firms flood app stores with "AI therapy", synthetic coaches, and chatbot confidantes.',
      bullets: [
        'Commercial Lure: 24/7 availability, zero waiting lists, free or subscription-based illusion of friendship.',
        'The Moat Question: Where does our value come from when basic advice is automated?',
        'Our Definitive Answer: Humanity, Authenticity, Lived Experience, Physical Presence, Shared Community Ground.'
      ],
      takeaway: 'Strategic Positioning: We do not compete on algorithmic volume; we lead on genuine human connection.'
    },
    adversary: {
      title: 'AI as Adversary: Algorithmic Harms & Exploitation',
      body: 'Emerging digital harms disproportionately affect vulnerable and isolated populations.',
      bullets: [
        'Digital Psychosis: People accessing services falling into delusional echo chambers with unfiltered LLMs.',
        'Misinformation: Dangerous DIY detox recipes or unverified medical claims spread via AI summaries.',
        'Vexatious SARs: Automated generation of bad-faith access requests designed to paralyse charity ops.'
      ],
      takeaway: 'Safeguarding Priority: Trauma-informed vigilance for digital manipulation and synthetic harm.'
    },
    grey_zone: {
      title: 'The Grey Zone: Multi-Party AI & Inbound Assistants',
      body: 'Situations where multiple people, third-party agencies, and AI intermediaries intersect.',
      bullets: [
        'Assisted Advocacy: A person accessing services attends a housing assessment armed with an AI-generated legal petition.',
        'Inbound Agents: Independent citizen AI agents booking appointments directly through web APIs.',
        'Verification: How do we verify consent and identity when communications are mediated by AI?'
      ],
      takeaway: 'Design Mandate: Open Knowledge Formats with verifiable human provenance.'
    }
  };

  function setupTriangleWidget() {
    const aspectBtns = document.querySelectorAll('.aspect-btn');
    const detailTitle = document.getElementById('triangleDetailTitle');
    const detailBody = document.getElementById('triangleDetailBody');
    const detailBullets = document.getElementById('triangleDetailBullets');
    const detailTakeaway = document.getElementById('triangleDetailTakeaway');
    const aiNode = document.getElementById('triangleAiNode');
    const aiIcon = document.getElementById('triangleAiIcon');
    const aiLabel = document.getElementById('triangleAiLabel');
    const splineAiStaff = document.getElementById('triangleSplineAiStaff');
    const splinePeopleAi = document.getElementById('triangleSplinePeopleAi');

    if (!aspectBtns.length) return;

    const personaTheme = {
      partner: {
        icon: 'assets/icons/icon-ai-partner.svg',
        label: 'AI AS PARTNER',
        color: '#427d5f',
        bg: 'rgba(216, 243, 230, 0.45)'
      },
      competitor: {
        icon: 'assets/icons/icon-ai-competitor.svg',
        label: 'AI AS COMPETITOR',
        color: '#d97430',
        bg: 'rgba(255, 207, 165, 0.38)'
      },
      adversary: {
        icon: 'assets/icons/icon-ai-adversary.svg',
        label: 'AI AS ADVERSARY',
        color: '#d64d42',
        bg: 'rgba(255, 135, 128, 0.38)'
      },
      grey_zone: {
        icon: 'assets/icons/icon-ai-greyzone.svg',
        label: 'AI IN GREY ZONE',
        color: '#6557b8',
        bg: 'rgba(215, 208, 255, 0.38)'
      }
    };

    function renderAspect(key) {
      const data = triangleDetails[key] || triangleDetails.partner;
      const theme = personaTheme[key] || personaTheme.partner;

      if (detailTitle) detailTitle.textContent = data.title;
      if (detailBody) detailBody.textContent = data.body;
      if (detailBullets) {
        detailBullets.innerHTML = data.bullets.map(b => {
          const colonIdx = b.indexOf(':');
          if (colonIdx !== -1) {
            const k = b.substring(0, colonIdx + 1);
            const v = b.substring(colonIdx + 1).trim();
            return `<li><strong class="bullet-key">${k}</strong><span class="bullet-desc">${v}</span></li>`;
          }
          return `<li>${b}</li>`;
        }).join('');
      }
      if (detailTakeaway) detailTakeaway.textContent = data.takeaway;

      if (aiIcon) aiIcon.src = theme.icon;
      if (aiLabel) {
        aiLabel.textContent = theme.label;
        aiLabel.style.borderColor = theme.color;
      }
      const aiAvatar = document.getElementById('triangleAiAvatar');
      if (aiAvatar) {
        aiAvatar.style.borderColor = theme.color;
        aiAvatar.style.backgroundColor = theme.bg;
      }
      if (splineAiStaff) {
        splineAiStaff.style.stroke = theme.color;
      }
      if (splinePeopleAi) {
        splinePeopleAi.style.stroke = theme.color;
      }

      aspectBtns.forEach(btn => {
        const isMatch = btn.getAttribute('data-aspect') === key;
        btn.classList.toggle('active', isMatch);
        if (isMatch) {
          btn.style.backgroundColor = theme.color;
          btn.style.borderColor = theme.color;
          btn.style.color = '#ffffff';
        } else {
          btn.style.backgroundColor = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }
      });
    }

    aspectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const aspect = btn.getAttribute('data-aspect');
        renderAspect(aspect);
      });
    });

    if (aiNode) {
      aiNode.addEventListener('click', () => {
        const aspects = ['partner', 'competitor', 'adversary', 'grey_zone'];
        const currentActive = document.querySelector('.aspect-btn.active');
        const currentKey = currentActive ? currentActive.getAttribute('data-aspect') : 'partner';
        const nextIdx = (aspects.indexOf(currentKey) + 1) % aspects.length;
        renderAspect(aspects[nextIdx]);
      });
    }

    renderAspect('partner');
  }

  // --- Initialize Presentation ---
  let isInitialized = false;
  function initPresentation() {
    if (isInitialized) return;
    queryDOMElements();
    if (!viewHub) return;
    isInitialized = true;

    setupNavigationControls();
    updateHUD();
    setupDebateDrawers();
    setupSpectrumWidget();
    setupTriangleWidget();

    // Export test hooks
    window.__presentation = {
      goToHub,
      goToSpoke,
      goToSlide,
      nextSlide,
      prevSlide,
      getState: () => ({ ...state })
    };
    window.__presentationLoaded = true;
    goToHub();
  }

  window.initWaythroughPresentation = initPresentation;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPresentation);
  } else {
    initPresentation();
  }

})();
