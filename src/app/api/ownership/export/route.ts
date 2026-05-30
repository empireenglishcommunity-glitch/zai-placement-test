/**
 * MACAL EMPIRE — Documentation Package Export API
 * Generates a comprehensive, professionally formatted HTML document
 * that can be saved as PDF. Contains all legal and ownership documents.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';

    // Fetch ownership records for inclusion
    let records: Array<{
      eventType: string;
      description: string;
      createdBy: string | null;
      createdAt: Date;
    }> = [];
    try {
      records = await db.ownershipRecord.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    } catch {
      // Records table may not exist yet — that's OK
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    // Build records HTML
    const recordsHtml = records.length > 0
      ? records.map(r => `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${r.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:13px;">${r.description}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:12px;color:#888;">${r.createdBy || 'system'}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:12px;color:#888;">${new Date(r.createdAt).toLocaleString()}</td>
          </tr>
        `).join('')
      : '<tr><td colspan="4" style="padding:16px;text-align:center;color:#999;font-style:italic;">No records yet — records will be generated as platform events occur.</td></tr>';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MACAL EMPIRE — IP & Ownership Documentation Package</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      color: #1a1a1a;
      background: #fff;
      line-height: 1.7;
      font-size: 14px;
    }
    .cover {
      page-break-after: always;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: #0a0a0a;
      color: #c9a84c;
      padding: 60px 40px;
    }
    .cover h1 {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 0.15em;
      margin-bottom: 8px;
      color: #c9a84c;
    }
    .cover h2 {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 0.1em;
      color: #8b7355;
      margin-bottom: 40px;
    }
    .cover .divider {
      width: 200px;
      height: 1px;
      background: linear-gradient(to right, transparent, #c9a84c, transparent);
      margin: 20px auto;
    }
    .cover p {
      font-family: 'Georgia', serif;
      color: #8b7355;
      font-size: 14px;
      font-style: italic;
    }
    .cover .date {
      margin-top: 40px;
      font-size: 12px;
      letter-spacing: 0.1em;
      color: #8b7355;
    }
    .cover .logo-text {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 14px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #c9a84c;
      margin-bottom: 30px;
    }
    .section {
      page-break-before: always;
      padding: 50px 60px;
    }
    .section:first-of-type {
      page-break-before: auto;
    }
    .section-header {
      border-bottom: 2px solid #c9a84c;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .section-header h2 {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: 0.05em;
    }
    .section-header p {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
      font-style: italic;
    }
    .subsection {
      margin-bottom: 24px;
    }
    .subsection h3 {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      padding-left: 12px;
      border-left: 3px solid #c9a84c;
    }
    p {
      margin-bottom: 12px;
      text-align: justify;
    }
    .category-box {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px 20px;
      margin-bottom: 16px;
    }
    .category-box h4 {
      font-family: 'Cinzel', 'Georgia', serif;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 6px;
    }
    .category-box p {
      font-size: 13px;
      color: #444;
      margin-bottom: 8px;
    }
    .category-box ul {
      margin-left: 20px;
      font-size: 12px;
      color: #555;
    }
    .category-box li {
      margin-bottom: 3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    thead th {
      background: #f5f5f5;
      padding: 10px 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #ddd;
      font-family: 'Cinzel', 'Georgia', serif;
      letter-spacing: 0.05em;
    }
    .highlight-box {
      background: #fffbe6;
      border: 1px solid #c9a84c;
      border-radius: 4px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .highlight-box p {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }
    .footer-notice {
      text-align: center;
      padding: 30px;
      border-top: 2px solid #c9a84c;
      margin-top: 40px;
    }
    .footer-notice p {
      text-align: center;
      font-size: 13px;
      color: #333;
    }
    .safety-notice {
      background: #fff3f3;
      border: 1px solid #e74c3c;
      border-radius: 4px;
      padding: 16px 20px;
      margin: 20px 0;
    }
    .safety-notice h4 {
      font-size: 13px;
      font-weight: 600;
      color: #c0392b;
      margin-bottom: 6px;
    }
    .safety-notice p {
      font-size: 12px;
      color: #555;
    }
    .timeline-entry {
      display: flex;
      margin-bottom: 16px;
    }
    .timeline-version {
      min-width: 70px;
      font-family: 'Cinzel', 'Georgia', serif;
      font-weight: 600;
      font-size: 13px;
      color: #c9a84c;
    }
    .timeline-content h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 2px;
    }
    .timeline-content p {
      font-size: 13px;
      color: #555;
      margin-bottom: 4px;
    }
    .timeline-content .date {
      font-size: 11px;
      color: #888;
    }
    @media print {
      body { font-size: 12px; }
      .section { page-break-before: always; padding: 40px 30px; }
      .cover { min-height: auto; padding: 80px 40px; }
    }
  </style>
</head>
<body>

  <!-- ═══ COVER PAGE ═══ -->
  <div class="cover">
    <p class="logo-text">MACAL EMPIRE</p>
    <div class="divider"></div>
    <h1>INTELLECTUAL PROPERTY</h1>
    <h2>& Ownership Documentation Package</h2>
    <div class="divider"></div>
    <p>Empire English Assessment System</p>
    <p>Complete Legal & Ownership Documentation</p>
    <div class="divider" style="margin-top:60px;"></div>
    <p class="date">Generated: ${dateStr}</p>
    <p class="date" style="margin-top:8px;">Document Version: 1.0</p>
  </div>

  <!-- ═══ TABLE OF CONTENTS ═══ -->
  <div class="section" style="page-break-after: always;">
    <div class="section-header">
      <h2>Table of Contents</h2>
      <p>Complete documentation package overview</p>
    </div>
    <div style="padding: 20px 0;">
      <ol style="line-height: 2.5; padding-left: 24px;">
        <li><strong>Ownership Declaration</strong> — Formal proprietary ownership statement</li>
        <li><strong>Intellectual Property Categories</strong> — Detailed category breakdowns</li>
        <li><strong>Creation Timeline</strong> — Development history and version records</li>
        <li><strong>Digital Ownership Records</strong> — Timestamped event log</li>
        <li><strong>Terms of Service</strong> — Complete user agreement</li>
        <li><strong>Privacy Policy</strong> — Data handling and privacy practices</li>
        <li><strong>Rights Reserved Notice</strong> — Legal protection declarations</li>
        <li><strong>Copyright Standardization</strong> — Consistent copyright notices</li>
        <li><strong>Legal Safety Notice</strong> — IP registration readiness disclaimer</li>
      </ol>
    </div>
  </div>

  <!-- ═══ SECTION 1: OWNERSHIP DECLARATION ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>1. Ownership Declaration</h2>
      <p>Formal declaration of proprietary ownership</p>
    </div>

    <div class="highlight-box">
      <p>&copy; MACAL EMPIRE. All rights reserved.</p>
      <p style="font-weight:400;font-size:12px;margin-top:4px;">Official Ownership Declaration — Empire English Assessment System</p>
    </div>

    <div class="subsection">
      <p>The <strong>Empire English Assessment System</strong>, including all associated platforms, applications, and services, is the exclusive proprietary property of <strong>MACAL EMPIRE</strong>. All intellectual property rights — including but not limited to copyright, trademark, trade secret, and patent rights — are fully and exclusively reserved under MACAL EMPIRE.</p>
      <p>This declaration encompasses the entirety of the platform: its source code, design systems, assessment methodologies, scoring algorithms, question content, database architectures, branding materials, user interface designs, audio compositions, written content, educational frameworks, and all derivative works. No element of this platform, whether individually or collectively, may be considered public domain, open source, or freely distributable unless explicitly stated in writing by MACAL EMPIRE.</p>
      <p>The MACAL EMPIRE name, logo, visual identity, and all branding materials are protected property. Any unauthorized use, reproduction, or imitation of these assets constitutes a violation of intellectual property rights and the terms governing this platform.</p>
    </div>

    <div class="subsection">
      <h3>Scope of Proprietary Property</h3>
      <p>The following categories of intellectual property are declared as proprietary assets of MACAL EMPIRE. Each category represents a distinct domain of creative, technical, or strategic work that has been independently developed and is maintained as protected proprietary content.</p>
    </div>
  </div>

  <!-- ═══ SECTION 2: IP CATEGORIES ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>2. Intellectual Property Categories</h2>
      <p>Detailed breakdown of proprietary categories</p>
    </div>

    <div class="category-box">
      <h4>Branding & Identity</h4>
      <p>The MACAL EMPIRE name, logo, visual identity system, color palette, typography selections, and all associated brand materials are the exclusive intellectual property of MACAL EMPIRE. This encompasses the imperial aesthetic design language, the matte black and antique gold color system, the Cinzel and Playfair Display font pairings, and all visual communication standards.</p>
      <ul><li>MACAL EMPIRE name and wordmark</li><li>Official logo and icon variations</li><li>Color system (antique gold, bronze, matte black)</li><li>Typography selections (Cinzel, Playfair Display)</li><li>Visual identity guidelines and standards</li></ul>
    </div>

    <div class="category-box">
      <h4>UI/UX Design</h4>
      <p>All user interface designs, interaction patterns, layout structures, animation systems, and user experience flows created for the Empire English Assessment System are proprietary. This includes the immersive dark fantasy imperial theme, the card-based navigation system, the assessment flow architecture, and all micro-interaction designs.</p>
      <ul><li>Dark fantasy imperial theme system</li><li>Card-based UI component library</li><li>Assessment flow architecture</li><li>Animation and transition systems</li><li>Micro-interaction design patterns</li></ul>
    </div>

    <div class="category-box">
      <h4>Assessment Structures</h4>
      <p>The Four Trials framework — comprising the Speaking, Listening, Vocabulary, and Grammar assessment modules — along with the Imperial Rank classification system, represents a proprietary assessment methodology developed by MACAL EMPIRE. The structure, sequencing, difficulty calibration, and pedagogical approach of these assessments are original intellectual property.</p>
      <ul><li>Four Trials framework architecture</li><li>Imperial Rank system (Recruit through Champion)</li><li>Module sequencing and integration logic</li><li>Difficulty calibration methodology</li><li>Assessment time allocation strategies</li></ul>
    </div>

    <div class="category-box">
      <h4>Question Systems</h4>
      <p>All assessment questions, answer options, question-type taxonomies, and the organizational structure of the question bank are proprietary content. This includes vocabulary band classifications, grammar topic categorizations, listening comprehension passage designs, and speaking prompt architectures.</p>
      <ul><li>Complete question bank content</li><li>Question-type classification system</li><li>Vocabulary band framework</li><li>Grammar topic taxonomy</li><li>Question selection and ordering algorithms</li></ul>
    </div>

    <div class="category-box">
      <h4>Scoring Systems</h4>
      <p>The scoring methodology, level assignment algorithms, and result calculation processes constitute proprietary business logic. This includes the weighted scoring formulas, the majority-rule level assignment system, the speaking module tiebreaker logic, and the 20-point discrepancy flagging mechanism.</p>
      <ul><li>Weighted scoring algorithms</li><li>Level assignment decision logic</li><li>Speaking tiebreaker mechanism</li><li>Discrepancy flagging system</li><li>Score normalization processes</li></ul>
    </div>

    <div class="category-box">
      <h4>Certificates & Results</h4>
      <p>All certificate designs, result presentation formats, rank badge visuals, and ceremonial result delivery systems are proprietary creative works of MACAL EMPIRE. The certificate template, including its imperial seal design, decorative borders, and official language, represents original creative content.</p>
      <ul><li>Certificate template and seal design</li><li>Result ceremony presentation format</li><li>Rank badge visual designs</li><li>Module breakdown display architecture</li><li>Official certification language</li></ul>
    </div>

    <div class="category-box">
      <h4>Written Content</h4>
      <p>All textual content throughout the platform constitutes original written content that is the exclusive property of MACAL EMPIRE. The distinctive imperial narrative voice and thematic language style used throughout the platform are also protected.</p>
      <ul><li>Assessment instructions and prompts</li><li>User interface copy and microcopy</li><li>Imperial narrative voice and thematic style</li><li>Educational feedback and guidance text</li><li>Legal and policy documentation</li></ul>
    </div>

    <div class="category-box">
      <h4>Graphics & Media</h4>
      <p>All graphical assets, illustrations, icon designs, particle effects, background textures, and audio content used within the platform are proprietary creative works.</p>
      <ul><li>Icon and illustration assets</li><li>Particle effect and background systems</li><li>Metallic and glowing visual effects</li><li>Empire soundtrack and audio content</li><li>Decorative and atmospheric assets</li></ul>
    </div>

    <div class="category-box">
      <h4>Database Structures</h4>
      <p>The database schema, table designs, relationship models, indexing strategies, and data organization patterns that underpin the Empire English Assessment System represent proprietary technical architecture.</p>
      <ul><li>Complete database schema design</li><li>Table relationship architecture</li><li>Assessment data model structure</li><li>Question bank data organization</li><li>Data access and indexing strategies</li></ul>
    </div>

    <div class="category-box">
      <h4>Educational Methodologies</h4>
      <p>The pedagogical approaches, learning assessment frameworks, and educational design principles embedded within the platform represent proprietary methodology.</p>
      <ul><li>Multi-modal assessment framework</li><li>Adaptive difficulty calibration approach</li><li>Progressive skill measurement methodology</li><li>Integrated feedback design principles</li><li>Skill integration assessment strategy</li></ul>
    </div>

    <div class="category-box">
      <h4>Source Code & Architecture</h4>
      <p>The application source code, software architecture, component design patterns, API endpoint structures, middleware configurations, and all technical implementation details are proprietary.</p>
      <ul><li>Application architecture and design patterns</li><li>Component hierarchy and state management</li><li>API endpoint structure and logic</li><li>Authentication and authorization flows</li><li>Content protection and security systems</li></ul>
    </div>

    <div class="category-box">
      <h4>Audio & Sound Design</h4>
      <p>All audio content, sound design elements, voice synthesis configurations, and auditory experience designs are proprietary.</p>
      <ul><li>Empire soundtrack composition</li><li>Text-to-speech voice configurations</li><li>Audio recording system architecture</li><li>Immersive audio overlay design</li><li>Sound effect and atmosphere elements</li></ul>
    </div>
  </div>

  <!-- ═══ SECTION 3: CREATION TIMELINE ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>3. Creation Timeline</h2>
      <p>Development history and version records</p>
    </div>
    <div class="timeline-entry"><div class="timeline-version">v1.0.0</div><div class="timeline-content"><h4>Platform Foundation</h4><p>Initial conception and architectural planning of the Empire English Assessment System. Core technology stack selected, imperial brand identity established, and foundational design system created.</p><p class="date">January 2025 — Foundation</p></div></div>
    <div class="timeline-entry"><div class="timeline-version">v1.1.0</div><div class="timeline-content"><h4>Assessment Framework</h4><p>Development of the Four Trials assessment framework. Design and implementation of the Imperial Rank classification system with four progressive levels.</p><p class="date">February 2025 — Feature</p></div></div>
    <div class="timeline-entry"><div class="timeline-version">v1.2.0</div><div class="timeline-content"><h4>Question Bank & Content</h4><p>Creation of the comprehensive question bank covering vocabulary bands, grammar topics, listening comprehension, and speaking prompts.</p><p class="date">March 2025 — Content</p></div></div>
    <div class="timeline-entry"><div class="timeline-version">v1.3.0</div><div class="timeline-content"><h4>UI/UX Design System</h4><p>Implementation of the complete imperial design system — MetallicCard, GlowingBorder, ImperialButton, ParticleBackground, and all custom UI components.</p><p class="date">April 2025 — Design</p></div></div>
    <div class="timeline-entry"><div class="timeline-version">v1.4.0</div><div class="timeline-content"><h4>Authentication & Security</h4><p>Integration of user authentication, content protection mechanisms, rate limiting middleware, bot detection, and security event logging.</p><p class="date">May 2025 — Security</p></div></div>
    <div class="timeline-entry"><div class="timeline-version">v1.5.0</div><div class="timeline-content"><h4>Legal & IP Framework</h4><p>Establishment of Terms of Service, Privacy Policy, and Intellectual Property & Ownership declaration. Digital ownership record system created.</p><p class="date">June 2025 — Legal</p></div></div>
    <div class="timeline-entry"><div class="timeline-version">v1.6.0</div><div class="timeline-content"><h4>Immersive Experience</h4><p>Addition of the Empire Audio Experience with cinematic soundtrack, social media integration, testimonials section, and enhanced certificate system.</p><p class="date">June 2025 — Design</p></div></div>
    <div class="timeline-entry"><div class="timeline-version">v2.0.0</div><div class="timeline-content"><h4>Production Release</h4><p>Complete platform deployment with all systems operational. Netlify deployment configuration, performance optimization, and production security hardening.</p><p class="date">July 2025 — Foundation</p></div></div>
  </div>

  <!-- ═══ SECTION 4: DIGITAL OWNERSHIP RECORDS ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>4. Digital Ownership Records</h2>
      <p>Timestamped event log — Generated ${dateStr}</p>
    </div>
    <p>Lightweight timestamped records that establish a historical evidence trail for key platform events. These records document terms acceptances, content publications, certificate generations, and major system updates.</p>
    <table>
      <thead>
        <tr>
          <th>Event Type</th>
          <th>Description</th>
          <th>Source</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        ${recordsHtml}
      </tbody>
    </table>
  </div>

  <!-- ═══ SECTION 5: TERMS OF SERVICE ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>5. Terms of Service</h2>
      <p>Complete user agreement and liability terms</p>
    </div>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin-bottom:12px;padding-left:12px;border-left:3px solid #c9a84c;">1. Ownership Declaration</h3>
    <p>This platform, including all content, assessment questions, design elements, branding, system logic, algorithms, scoring methodology, and user interface — is the exclusive property of MACAL EMPIRE. All intellectual property rights, including but not limited to copyright, trademark, trade secret, and patent rights, are fully reserved under MACAL EMPIRE.</p>
    <p>The Empire English Assessment System, its Four Trials framework (Speaking, Listening, Vocabulary, Grammar), the Imperial Rank system (Recruit, Initiate, Warrior, Champion), and all associated content are proprietary assets. No part of this platform may be considered public domain, open source, or freely distributable.</p>
    <p>The MACAL EMPIRE name, logo, visual identity, and all branding materials are protected trademarks. Any unauthorized use of these assets constitutes a violation of intellectual property law and the terms outlined herein.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">2. User Agreement</h3>
    <p>By creating an account and accessing the Empire English Assessment System, you agree to the following binding terms:</p>
    <p>You shall not copy, reproduce, distribute, publish, display, modify, or create derivative works from any content, questions, assessments, scoring logic, or design elements found on this platform.</p>
    <p>You shall not attempt to clone, reverse engineer, decompile, disassemble, or otherwise replicate the system logic, architecture, algorithms, or underlying technology of this platform.</p>
    <p>You shall not reuse, repurpose, or redistribute any assessment content — including questions, answer options, scoring rubrics, or evaluation criteria — for commercial purposes, educational replication, tutoring services, competitive platforms, or any other application outside of your personal use within this platform.</p>
    <p>Unauthorized use, access, or distribution of proprietary content will be treated as a breach of these terms and may result in immediate account termination, legal action, and pursuit of damages as permitted by applicable law.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">3. Liability Statement</h3>
    <p>MACAL EMPIRE reserves the right to restrict, suspend, or permanently terminate access to this platform for any user who violates these Terms of Service, engages in misuse of the system, or attempts to compromise the integrity of the assessment process.</p>
    <p>All usage of this platform is subject to the rules, policies, and guidelines established by MACAL EMPIRE. We retain the right to modify these terms at any time, and continued use of the platform constitutes acceptance of any updates.</p>
    <p>MACAL EMPIRE provides this platform on an "as is" basis without warranties of any kind, either express or implied. We do not guarantee that the platform will be error-free, uninterrupted, or free from defects.</p>
    <p>MACAL EMPIRE shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use or inability to use this platform.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">4. Data & Privacy</h3>
    <p>By using this platform, you consent to the collection and processing of your personal data (including name, email, and assessment results) as necessary to operate the service. Your data will be handled in accordance with our Privacy Policy and will not be sold to third parties.</p>
    <p>Assessment results and user activity may be reviewed by authorized administrators for quality assurance, fraud detection, and platform improvement purposes.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">5. Governing Law</h3>
    <p>These Terms of Service shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or the use of this platform shall be resolved through appropriate legal channels as determined by MACAL EMPIRE.</p>
    <p>MACAL EMPIRE reserves the right to update these Terms of Service at any time. Users will be notified of significant changes, and continued use of the platform after such updates constitutes acceptance of the revised terms.</p>
  </div>

  <!-- ═══ SECTION 6: PRIVACY POLICY ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>6. Privacy Policy</h2>
      <p>Data handling and privacy practices</p>
    </div>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin-bottom:12px;padding-left:12px;border-left:3px solid #c9a84c;">1. Information We Collect</h3>
    <p>When you create an account and use the Empire English Assessment System, MACAL EMPIRE may collect certain personal information that is necessary to provide and improve our services. This includes your full name, email address, and account credentials (such as your password, which is stored in an encrypted form and never displayed to anyone, including our team).</p>
    <p>We also collect assessment-related data, including your responses to the Four Trials, your scores, your assigned Imperial Rank, and any certificates issued to you. This information is essential for delivering the assessment experience and generating your results.</p>
    <p>Additionally, the platform may collect session and login activity, such as the times you access the platform, the duration of your sessions, and general device or browser technical information. This technical data is collected automatically and is used solely for security monitoring, performance optimization, and improving your user experience.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">2. How We Use Your Information</h3>
    <p>The information we collect serves several important purposes. Primarily, your account credentials are used for user authentication — verifying your identity and allowing you secure access to the platform. Your assessment data is processed to evaluate your English proficiency across the Four Trials, calculate your scores, and assign your Imperial Rank.</p>
    <p>Your results and rank information are used to generate and send certificates and assessment reports. Security monitoring and fraud prevention represent another critical use of collected information.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">3. Data Protection</h3>
    <p>MACAL EMPIRE takes reasonable and appropriate measures to protect user information from unauthorized access, misuse, loss, and unauthorized disclosure. We employ industry-standard security practices including encrypted data transmission (HTTPS/TLS), secure password storage using cryptographic hashing, and access controls that limit who can view personal data.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">4. Data Sharing</h3>
    <p>MACAL EMPIRE does not sell, rent, or trade your personal information to third parties for marketing or commercial purposes. Your data is treated as confidential and is used exclusively for the operation and improvement of the Empire English Assessment System. Information may only be shared when legally required by applicable law or when necessary to protect the rights, safety, or property of MACAL EMPIRE, our users, or the public.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">5. Cookies & Sessions</h3>
    <p>The Empire English Assessment System uses cookies and similar technologies to maintain your authenticated session, remember your preferences, and ensure the security and stability of the platform.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">6. Your Rights</h3>
    <p>You have the right to request access to the personal data we hold about you. If any information is inaccurate or outdated, you may request a correction. You may also request deletion of your account and associated data, subject to certain limitations for legal or operational reasons.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">7. Contact</h3>
    <p>For any questions regarding this Privacy Policy, please contact MACAL EMPIRE at: <strong>macalempire@gmail.com</strong></p>
  </div>

  <!-- ═══ SECTION 7: RIGHTS RESERVED ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>7. Rights Reserved Notice</h2>
      <p>Legal protection declarations</p>
    </div>

    <div class="highlight-box">
      <p>&copy; MACAL EMPIRE. All rights reserved.</p>
      <p style="font-weight:400;font-size:13px;margin-top:4px;">All rights reserved by MACAL EMPIRE. Unauthorized copying, redistribution, replication, or commercial reproduction is prohibited.</p>
    </div>

    <p>All rights reserved by MACAL EMPIRE. Unauthorized copying, redistribution, replication, or commercial reproduction of any content, design, code, assessment materials, scoring methodologies, branding elements, or any other proprietary assets of the Empire English Assessment System is strictly prohibited.</p>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">Prohibited Activities</h3>
    <ul style="margin-left:20px;margin-bottom:16px;">
      <li style="margin-bottom:6px;">Copying, reproducing, or distributing any portion of the platform content without written authorization</li>
      <li style="margin-bottom:6px;">Reverse engineering, decompiling, or disassembling the platform architecture or source code</li>
      <li style="margin-bottom:6px;">Creating derivative works based on the assessment framework, scoring logic, or design system</li>
      <li style="margin-bottom:6px;">Using the MACAL EMPIRE brand identity, logo, or visual elements without explicit permission</li>
      <li style="margin-bottom:6px;">Replicating the assessment methodology, question structures, or ranking system for commercial purposes</li>
      <li style="margin-bottom:6px;">Selling, licensing, or sublicensing any content obtained from or through this platform</li>
    </ul>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">IP Registration Readiness</h3>
    <p>This documentation system is structured to support future intellectual property registration processes. The organized ownership records, timestamped evidence trail, and comprehensive documentation package are designed to facilitate: copyright registration applications, trademark filing preparation, evidence of creation and first publication, ownership chain documentation, trade secret identification and cataloging, and legal dispute supporting materials.</p>
  </div>

  <!-- ═══ SECTION 8: COPYRIGHT STANDARDIZATION ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>8. Copyright Standardization</h2>
      <p>Consistent copyright notice implementation</p>
    </div>

    <p>All pages and components within the Empire English Assessment System consistently include the following copyright notice:</p>

    <div class="highlight-box">
      <p>&copy; ${now.getFullYear()} MACAL EMPIRE. All rights reserved.</p>
    </div>

    <p>This notice appears in the following locations throughout the platform:</p>
    <ul style="margin-left:20px;">
      <li style="margin-bottom:4px;">Global footer component — visible on every page</li>
      <li style="margin-bottom:4px;">Terms of Service page — copyright declaration section</li>
      <li style="margin-bottom:4px;">Privacy Policy page — footer copyright notice</li>
      <li style="margin-bottom:4px;">Intellectual Property & Ownership page — multiple sections</li>
      <li style="margin-bottom:4px;">Certificate generation — embedded in certificate design</li>
      <li style="margin-bottom:4px;">Legal notice components — banner, footer, inline, and watermark variants</li>
      <li style="margin-bottom:4px;">Exported documentation packages — cover page and each section</li>
    </ul>

    <h3 style="font-family:'Cinzel','Georgia',serif;font-size:16px;margin:20px 0 12px;padding-left:12px;border-left:3px solid #c9a84c;">MACAL EMPIRE Branding Identity</h3>
    <p>The official MACAL EMPIRE branding identity consists of the following elements, which are consistently referenced across all legal and ownership documentation:</p>
    <ul style="margin-left:20px;">
      <li style="margin-bottom:4px;"><strong>Name:</strong> MACAL EMPIRE</li>
      <li style="margin-bottom:4px;"><strong>Platform:</strong> Empire English Assessment System / Empire English Community</li>
      <li style="margin-bottom:4px;"><strong>Tagline:</strong> "Forged in Language. Crowned in Mastery."</li>
      <li style="margin-bottom:4px;"><strong>Colors:</strong> Antique Gold (#C9A84C), Bronze (#CD7F32), Matte Black (#0A0A0A)</li>
      <li style="margin-bottom:4px;"><strong>Contact:</strong> macalempire@gmail.com</li>
    </ul>
  </div>

  <!-- ═══ SECTION 9: LEGAL SAFETY NOTICE ═══ -->
  <div class="section">
    <div class="section-header">
      <h2>9. Legal Safety Notice</h2>
      <p>IP registration readiness disclaimer</p>
    </div>

    <div class="safety-notice">
      <h4>Important Legal Disclaimer</h4>
      <p>This documentation system does not constitute official government copyright registration, trademark registration, or any form of government-issued legal certification. It is designed solely to organize and document ownership evidence, structure IP-related information, and prepare materials that may support future legal registration processes.</p>
    </div>

    <div class="safety-notice">
      <h4>What This System Does NOT Claim</h4>
      <ul style="margin-left:20px;">
        <li style="margin-bottom:4px;">Official government copyright registration</li>
        <li style="margin-bottom:4px;">Officially registered trademarks</li>
        <li style="margin-bottom:4px;">Legal certifications that do not exist</li>
        <li style="margin-bottom:4px;">Fake compliance seals or badges</li>
      </ul>
    </div>

    <div class="safety-notice">
      <h4>What This System DOES Provide</h4>
      <ul style="margin-left:20px;">
        <li style="margin-bottom:4px;">Structured ownership documentation for organizational purposes</li>
        <li style="margin-bottom:4px;">Professional evidence organization to support future IP registration</li>
        <li style="margin-bottom:4px;">Timestamped records establishing a chronological evidence trail</li>
        <li style="margin-bottom:4px;">Comprehensive documentation package for legal reference</li>
        <li style="margin-bottom:4px;">IP-registration-ready organizational structure</li>
        <li style="margin-bottom:4px;">Strengthened ownership clarity and evidence documentation</li>
      </ul>
    </div>

    <p style="margin-top:20px;">This system is designed to be <strong>"IP registration ready"</strong> — meaning it organizes and documents ownership information in a format that can readily support future intellectual property registration processes, legal proceedings, or ownership disputes. It does not replace formal legal registration but provides the foundational documentation and evidence structure that such processes require.</p>
  </div>

  <!-- ═══ FINAL FOOTER ═══ -->
  <div class="footer-notice">
    <p style="font-family:'Cinzel','Georgia',serif;font-size:16px;color:#1a1a1a;font-weight:700;">&copy; MACAL EMPIRE. All rights reserved.</p>
    <p style="font-size:12px;color:#888;margin-top:8px;">Empire English Assessment System — IP & Ownership Documentation Package</p>
    <p style="font-size:11px;color:#aaa;margin-top:4px;">Generated: ${dateStr} | Document Version: 1.0</p>
    <p style="font-size:11px;color:#aaa;margin-top:4px;">MACAL EMPIRE — Forged in Language. Crowned in Mastery.</p>
  </div>

</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-MACAL-EMPIRE': 'Protected-Content',
      },
    });
  } catch (error) {
    console.error('[OWNERSHIP-EXPORT] Failed to generate documentation:', error);
    return NextResponse.json(
      { error: 'Failed to generate documentation package' },
      { status: 500 }
    );
  }
}
