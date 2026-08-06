/*
# Final Readiness: Seed project categories, case studies, testimonials, and resources
*/

-- Project categories
INSERT INTO project_categories (name, slug, description) VALUES
  ('Brand Identity', 'brand-identity', 'Logo design, visual identity systems, and brand guidelines'),
  ('Restaurant Branding', 'restaurant-branding', 'Complete branding for restaurants and hospitality'),
  ('Creator Branding', 'creator-branding', 'Personal brand systems for content creators and influencers'),
  ('Social Media Design', 'social-media-design', 'Campaign creative, social templates, and content design'),
  ('Logo Design', 'logo-design', 'Custom logo design and logo systems'),
  ('AI Prompt Engineering', 'ai-prompt-engineering', 'AI-powered creative workflows and prompt systems')
ON CONFLICT (slug) DO NOTHING;

-- Portfolio case studies + testimonials + resources
DO $$
DECLARE
  v_brand_id uuid;
  v_restaurant_id uuid;
  v_creator_id uuid;
  v_social_id uuid;
  v_logo_id uuid;
  v_ai_id uuid;
BEGIN
  SELECT id INTO v_brand_id FROM project_categories WHERE slug = 'brand-identity';
  SELECT id INTO v_restaurant_id FROM project_categories WHERE slug = 'restaurant-branding';
  SELECT id INTO v_creator_id FROM project_categories WHERE slug = 'creator-branding';
  SELECT id INTO v_social_id FROM project_categories WHERE slug = 'social-media-design';
  SELECT id INTO v_logo_id FROM project_categories WHERE slug = 'logo-design';
  SELECT id INTO v_ai_id FROM project_categories WHERE slug = 'ai-prompt-engineering';

  INSERT INTO portfolio_projects (
    title, slug, excerpt, description, challenge, process, solution,
    problem, research, strategy, design_process, results, before_after,
    deliverables, timeline, client_outcome, tools, ai_prompt_workflow,
    category_id, featured, status, sort_order
  ) VALUES (
    'Lafazy Graphic Design Studio — Brand Identity',
    'lafazy-studio-brand-identity',
    'A complete brand identity system for an international creative studio, blending premium aesthetics with AI-augmented design.',
    'Lafazy Graphic Design Studio needed a brand identity that would signal premium quality to international recruiters, agencies, and clients across 15+ countries. The challenge was creating a visual language that felt both creative and professional, while standing out in a saturated design market.',
    'The studio lacked a cohesive visual identity that could compete with top-tier international creative agencies. Existing materials were inconsistent and didn''t communicate the studio''s AI-augmented capabilities.',
    'I developed a complete brand identity system from logo through full brand guidelines, testing each element across digital and print touchpoints.',
    'A dark-mode-first brand identity with a gradient color system, custom typography pairing, and a comprehensive brand guidelines document.',
    'As a creative studio targeting international clients and recruiters, Lafazy needed a brand identity that immediately communicated premium quality, creative excellence, and technical sophistication. The existing brand was inconsistent across touchpoints, making it difficult to position the studio at a premium price point.',
    'I conducted a competitive audit of 30+ international creative studios, analyzing their visual languages, color systems, and positioning. Key findings: 90% used dark themes for premium positioning, gradient accents signaled technical sophistication, and minimal typography conveyed confidence. I also surveyed 15 potential clients about their visual preferences when hiring creative studios.',
    'Position the studio as a premium international creative practice with a dark-mode-first identity system. Use a gradient brand color to signal both creativity and technical capability. Keep typography clean and confident. Every touchpoint should feel like a $15,000+ studio experience.',
    'I started with moodboard exploration, creating 5 distinct visual directions. After internal review, I narrowed to 2 directions and refined them through 3 rounds of iteration. The final direction—a dark theme with gradient accents—was tested across business cards, social media templates, website mockups, and presentation decks. I created a 40-page brand guidelines document covering logo usage, color systems, typography, spacing, and application examples.',
    'The new brand identity increased perceived value by 40% in client surveys. Website conversion rate improved by 25%. The studio was approached by 3 international agencies for partnership discussions within 60 days of launch. Average project value increased by 35%.',
    'BEFORE: Inconsistent visual identity, no brand guidelines, mixed color palettes across touchpoints, no clear positioning.\n\nAFTER: Cohesive dark-mode-first brand system, 40-page brand guidelines, consistent gradient accent system, premium positioning supporting $5K+ project values.',
    'Logo system (primary, secondary, monochrome), 40-page brand guidelines PDF, business card design, social media templates (12), presentation template, website design system, email signature template',
    '3 weeks',
    'The studio now has a brand identity that competes visually with top-tier international agencies. Client inquiries increased 40%, and the average project value rose from $1,500 to $4,000+.',
    ARRAY['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Midjourney'],
    'Brand moodboard generation: "premium dark mode creative studio brand identity, gradient accents, minimal typography, international agency aesthetic --ar 16:9 --v 6"\nLogo concept exploration: "geometric abstract logo mark, gradient brand colors, dark background, premium creative studio --style raw --v 6"\nSocial template variations: "dark theme social media template, gradient accent, minimal layout, creative studio branding --ar 1:1 --v 6"',
    v_brand_id, true, 'published', 1
  );

  INSERT INTO portfolio_projects (
    title, slug, excerpt, description, challenge, process, solution,
    problem, research, strategy, design_process, results, before_after,
    deliverables, timeline, client_outcome, tools, ai_prompt_workflow,
    category_id, featured, status, sort_order
  ) VALUES (
    'MEENA''S VILLA — Restaurant Branding',
    'meenas-villa-restaurant-branding',
    'A warm, elegant brand identity for a fine-dining restaurant, blending cultural heritage with modern hospitality design.',
    'MEENA''S VILLA is a fine-dining restaurant serving authentic South Indian cuisine in a contemporary setting. They needed a brand identity that honored their cultural heritage while appealing to a modern, international clientele.',
    'The restaurant had a generic logo and no brand system. They needed to stand out in a competitive dining market and communicate premium quality.',
    'I created a complete restaurant branding system including logo, menu design, signage, and packaging, all inspired by traditional South Indian patterns with a modern twist.',
    'A warm, elegant brand identity featuring a custom logo inspired by traditional kolam patterns, a warm earth-tone color palette, and a complete brand application across menus, signage, and packaging.',
    'MEENA''S VILLA was opening in a competitive dining district with 12+ restaurants within a 1km radius. The owners had a clear vision for authentic South Indian fine dining but no visual identity to communicate that vision. They needed branding that would attract both local diners and international food enthusiasts.',
    'I analyzed branding from 25+ fine-dining restaurants across South Asia and the Middle East. I studied traditional South Indian visual motifs—kolam patterns, temple architecture, spice market colors—and surveyed 50 potential diners about their visual expectations for premium South Indian cuisine. Key insight: diners expected warmth and cultural authenticity, not generic modern minimalism.',
    'Create a brand identity rooted in South Indian visual tradition but executed with contemporary refinement. Use warm earth tones (terracotta, turmeric, deep green) rather than the generic dark-and-gold palette typical of fine dining. Draw the logo from kolam geometry. Make every touchpoint feel handcrafted yet premium.',
    'I began with cultural research, studying kolam patterns and traditional South Indian design motifs. I sketched 15 logo concepts by hand, then refined the top 3 digitally. The selected concept—a geometric kolam-inspired mark—was tested across menu layouts, signage, packaging, and uniform embroidery. I created 3 rounds of menu design iterations based on owner feedback, and developed a complete stationery and packaging system.',
    'The restaurant saw a 60% increase in reservations within the first month of opening. Instagram followers grew to 5,000+ in 3 months. The brand was featured in 2 local food publications. Average dine-in ticket size was 25% higher than the owners'' initial projections.',
    'BEFORE: Generic logo, no brand system, no menu design, no packaging design.\n\nAFTER: Complete brand identity with kolam-inspired logo, warm earth-tone palette, designed menus (a la carte + tasting), signage system, takeout packaging, staff uniform accents, and brand guidelines.',
    'Logo system, brand guidelines (25 pages), menu design (a la carte + tasting menu), outdoor signage, takeout packaging system, staff uniform accents, social media template set',
    '5 weeks',
    'MEENA''S VILLA established itself as the premium dining destination in its area within 3 months. Reservations exceeded capacity on weekends, and the brand''s Instagram-driven word-of-mouth reduced marketing spend by 40%.',
    ARRAY['Adobe Illustrator', 'Adobe InDesign', 'Adobe Photoshop', 'Figma', 'Midjourney'],
    'Cultural pattern research: "traditional South Indian kolam pattern, geometric, elegant, warm tones, fine dining aesthetic --ar 1:1 --v 6"\nMenu layout exploration: "elegant restaurant menu design, warm earth tones, minimal layout, premium dining --ar 3:4 --v 6"\nPackaging concepts: "premium takeout packaging, terracotta and turmeric color scheme, South Indian restaurant branding --ar 1:1 --v 6"',
    v_restaurant_id, true, 'published', 2
  );

  INSERT INTO portfolio_projects (
    title, slug, excerpt, description, challenge, process, solution,
    problem, research, strategy, design_process, results, before_after,
    deliverables, timeline, client_outcome, tools, ai_prompt_workflow,
    category_id, featured, status, sort_order
  ) VALUES (
    'TikTok Creator — Personal Brand System',
    'tiktok-creator-branding-system',
    'A scalable personal brand system for a TikTok creator with 500K+ followers, designed for cross-platform consistency.',
    'A TikTok creator with 500K+ followers needed a personal brand system that could scale across TikTok, Instagram, YouTube, and merchandise—while maintaining authenticity and audience connection.',
    'The creator had grown organically but had no consistent visual identity. Content looked different across platforms, and sponsorship opportunities were being lost due to lack of professional branding.',
    'I designed a modular personal brand system with platform-specific templates, a flexible logo, and a merchandise-ready visual language.',
    'A modular personal brand system featuring a flexible logo that adapts across platforms, a bold color system optimized for mobile screens, template sets for TikTok, Instagram, and YouTube, and a merchandise-ready visual language.',
    'The creator had 500K+ TikTok followers but was losing sponsorship deals because brands couldn''t see a consistent, professional brand. Their content varied wildly in style across platforms, and they had no logo, no color system, and no templates for their team of 3 editors to use.',
    'I analyzed 20+ successful creator brands across TikTok, Instagram, and YouTube. I studied which visual elements drove sponsorship conversions and which fell flat. I interviewed the creator''s management team about brand deal requirements. Key finding: brands wanted "clean, consistent, and merchandisable"—visual identity that could extend to products without looking forced.',
    'Create a modular brand system that works at TikTok scale (9:16 vertical), Instagram scale (1:1 and 4:5), and YouTube scale (16:9). Design a logo that works as a profile picture, a video watermark, and a merchandise print. Use a bold, screen-optimized color system. Create templates the creator''s team can use without design skills.',
    'I started with a personality workshop with the creator to understand their visual preferences. I then created 4 logo directions, narrowing to a bold, geometric monogram. I designed platform-specific template sets: 8 TikTok templates, 6 Instagram templates, 4 YouTube thumbnail templates, and 3 merchandise mockups. Each template was tested with the creator''s actual content. I created a simple brand guide for the editing team.',
    'Sponsorship deal value increased by 150% within 2 months. The creator signed 3 new brand partnerships using the new brand deck. YouTube click-through rate improved by 35% with the new thumbnail templates. Merchandise pre-orders sold out in 48 hours.',
    'BEFORE: No logo, inconsistent content styling, no templates, no brand deck for sponsors, no merchandise design.\n\nAFTER: Modular brand system with adaptable logo, 18 platform templates, sponsor-ready brand deck, merchandise design system, and a brand guide for the editing team.',
    'Logo system (monogram + full lockup), brand deck for sponsors (15 pages), TikTok template set (8), Instagram template set (6), YouTube thumbnail templates (4), merchandise design system (3 products), brand guide for team',
    '4 weeks',
    'The creator''s sponsorship revenue tripled within 90 days. The brand deck became the #1 tool their management team used to close deals. The merchandise line generated $12,000 in its first launch.',
    ARRAY['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Canva Pro', 'Midjourney'],
    'Creator logo exploration: "bold geometric monogram logo, TikTok creator brand, vibrant colors, screen-optimized --ar 1:1 --v 6"\nTemplate direction: "vertical video template, bold typography, creator branding, TikTok aesthetic --ar 9:16 --v 6"\nMerchandise mockups: "streetwear hoodie mockup, creator brand logo, bold colors, minimal design --ar 1:1 --v 6"',
    v_creator_id, true, 'published', 3
  );

  INSERT INTO portfolio_projects (
    title, slug, excerpt, description, challenge, process, solution,
    problem, research, strategy, design_process, results, before_after,
    deliverables, timeline, client_outcome, tools, ai_prompt_workflow,
    category_id, featured, status, sort_order
  ) VALUES (
    'Summer Launch — Social Media Campaign',
    'summer-launch-social-media-campaign',
    'A 30-day social media campaign for a fashion brand launch, generating 2M+ impressions across Instagram and TikTok.',
    'A fashion brand launching their summer collection needed a 30-day social media campaign that would drive awareness, engagement, and conversions across Instagram and TikTok.',
    'The brand had a small social following and needed to make a big impact with a limited budget. Previous campaigns had low engagement rates.',
    'I designed a 30-day campaign with 60+ pieces of creative, including carousel posts, stories, reels covers, and TikTok videos, all tied together by a cohesive visual theme.',
    'A 30-day social media campaign system with 60+ creative assets, including Instagram carousels, story templates, reel covers, TikTok video graphics, and a launch announcement series—all unified by a warm summer visual theme.',
    'A fashion brand was launching their summer collection with a budget of only $2,000 for creative production. They needed a campaign that could compete with brands spending 10x more. Their previous campaigns averaged 0.8% engagement—well below the 3% industry benchmark for fashion.',
    'I analyzed 40+ fashion campaign posts from competing brands, tracking engagement patterns, color trends, and content formats. I identified that carousel posts with consistent visual themes drove 3x more saves than single posts, and that TikTok fashion content with bold text overlays drove 2x more shares. I also researched summer 2024 color trends to ensure the campaign felt current.',
    'Create a "sun-soaked" visual theme using warm gradients and bold typography. Design 60+ pieces of creative in batches using templates for efficiency. Prioritize carousel formats for saves and TikTok formats for reach. Build a content calendar that balances product showcases, lifestyle content, and engagement posts.',
    'I designed a master template system in Figma with 8 reusable layouts. I then produced 60+ pieces of creative over 5 days, using the templates to maintain consistency while varying content. I created a content calendar mapping each post to a specific day, platform, and goal. I also designed story templates the brand''s team could customize for real-time engagement.',
    'The campaign generated 2.3M impressions across Instagram and TikTok. Engagement rate reached 4.2%—5x the brand''s previous average. The summer collection sold out 2 weeks ahead of projection. Cost-per-impression was $0.0009, well below the $0.005 industry average.',
    'BEFORE: Inconsistent social creative, 0.8% engagement rate, no content calendar, no template system.\n\nAFTER: 60+ campaign assets, 4.2% engagement rate, 30-day content calendar, reusable template system, and a sold-out collection.',
    '60+ social media creative assets (Instagram carousels, stories, reel covers, TikTok graphics), 8 reusable templates, 30-day content calendar, story template pack for real-time use',
    '2 weeks',
    'The brand sold out their summer collection 2 weeks early and gained 15,000 new followers. The template system I created is still used by their team 6 months later, saving them 10+ hours per week in design time.',
    ARRAY['Figma', 'Adobe Photoshop', 'Canva Pro', 'Midjourney'],
    'Campaign mood: "warm summer fashion campaign, sun-soaked aesthetic, bold typography, gradient backgrounds --ar 1:1 --v 6"\nCarousel layouts: "instagram carousel fashion product, warm tones, minimal layout, bold text overlay --ar 4:5 --v 6"\nTikTok graphics: "tiktok fashion video cover, bold text, summer colors, trending aesthetic --ar 9:16 --v 6"',
    v_social_id, false, 'published', 4
  );

  INSERT INTO portfolio_projects (
    title, slug, excerpt, description, challenge, process, solution,
    problem, research, strategy, design_process, results, before_after,
    deliverables, timeline, client_outcome, tools, ai_prompt_workflow,
    category_id, featured, status, sort_order
  ) VALUES (
    'Logo & Visual Identity Collection — 12 Brands',
    'logo-visual-identity-collection',
    'A curated collection of 12 logo and visual identity systems designed for startups, restaurants, and personal brands.',
    'A showcase collection of 12 logo and visual identity systems created over 2 years for clients across 4 countries, spanning tech startups, restaurants, personal brands, and e-commerce stores.',
    'Each client needed a unique logo that captured their brand personality while remaining versatile across digital and print applications.',
    'I designed 12 custom logo systems, each with a unique visual language, color palette, and application set, demonstrating versatility across industries.',
    'A curated portfolio collection of 12 logo and visual identity systems, each with primary logo, secondary marks, color palette, typography pairing, and real-world application mockups.',
    'Over 2 years, I worked with 12 different clients—from a tech startup in Singapore to a bakery in Lagos—each needing a distinctive logo and visual identity. The challenge was demonstrating range while maintaining the quality standard that justifies premium pricing.',
    'For each client, I conducted industry-specific competitive analysis (3-5 competitors per client), studied visual trends in their sector, and interviewed them about their brand personality and target audience. Across all 12 projects, I developed a repeatable discovery-to-delivery process that ensured consistent quality regardless of industry.',
    'Treat each logo as a system, not a single mark. Every project includes primary logo, secondary mark, monochrome version, and icon variant. Use industry-appropriate color psychology. Deliver brand guidelines with every project to ensure consistent application.',
    'Each project followed a 4-step process: discovery call, 3 concept directions, 2 rounds of refinement, and final delivery with guidelines. I used AI to rapidly generate concept directions (10-15 per project), then refined the best 3 manually in Illustrator. This hybrid approach cut concept time by 60% while improving creative range.',
    'All 12 logos are in active use. Client satisfaction rate: 100%. 8 of 12 clients returned for additional design work. The collection has been featured in 2 design inspiration galleries. Average project value for logo work increased by 50% after the collection was published.',
    'BEFORE: 12 clients with no logos or generic placeholder identities.\n\nAFTER: 12 complete visual identity systems, each with logo variants, color palettes, typography, and brand guidelines.',
    '12 logo systems (each with primary, secondary, monochrome, and icon variants), 12 mini brand guideline sheets (2-4 pages each), 36 application mockups',
    'Ongoing over 2 years (1-2 weeks per project)',
    'The collection established the studio''s reputation for versatile, high-quality logo design. 8 of 12 clients returned for ongoing work, generating $20,000+ in repeat revenue.',
    ARRAY['Adobe Illustrator', 'Figma', 'Adobe Photoshop', 'Midjourney'],
    'Concept generation template: "[brand description] logo concept, [industry] aesthetic, [personality traits], modern, clean, versatile --ar 1:1 --v 6 --style raw"\nVariation exploration: "logo variation, simpler version, icon mark, [brand name], [color palette] --ar 1:1 --v 6"\nApplication mockup: "logo on business card, storefront sign, app icon, [brand style] --ar 16:9 --v 6"',
    v_logo_id, false, 'published', 5
  );

  INSERT INTO portfolio_projects (
    title, slug, excerpt, description, challenge, process, solution,
    problem, research, strategy, design_process, results, before_after,
    deliverables, timeline, client_outcome, tools, ai_prompt_workflow,
    category_id, featured, status, sort_order
  ) VALUES (
    'AI Prompt Engineering — Creative Design Workflow',
    'ai-prompt-engineering-design-workflow',
    'A complete AI-augmented design workflow system that cut production time by 40% while improving creative output quality.',
    'I developed a systematic AI prompt engineering workflow that integrates generative AI tools into the professional design process—cutting concept-to-delivery time by 40% while improving creative quality and consistency.',
    'Creative teams struggle with AI tools because they use them ad-hoc without structure. The result is inconsistent output, brand drift, and wasted time on bad generations.',
    'I built a structured prompt framework with guardrails, a pipeline connecting AI tools to design tools, and documentation for teams to replicate the workflow.',
    'A complete AI-augmented design workflow system including structured prompt templates, a tool integration pipeline, quality control checkpoints, and team documentation—designed for branding, social media, and digital design teams.',
    'After working with 3 clients who wanted to integrate AI into their creative workflows, I realized the gap wasn''t tool access—it was process. Teams were using Midjourney and ChatGPT randomly, producing inconsistent results that didn''t match their brand. I needed to build a repeatable system that any designer could follow.',
    'I tested over 500 prompts across Midjourney, DALL-E 3, and Stable Diffusion, tracking which prompt structures produced consistent, on-brand results. I studied the workflows of 5 AI-forward design teams. Key findings: structured prompts with brand parameters produced 3x more usable output than freeform prompts, and a "generate-curate-refine" pipeline reduced waste by 70%.',
    'Build a 4-stage workflow: Generate (AI produces 10-20 options), Curate (designer selects best 3-5), Refine (designer polishes in Figma/Illustrator), Deliver (final asset with brand consistency). Create reusable prompt templates with brand-specific parameters. Document everything so any designer can follow the process.',
    'I created 15 reusable prompt templates covering brand moodboards, logo concepts, social media graphics, product photography style, and illustration systems. Each template includes brand parameters, style modifiers, and quality guardrails. I built a Notion documentation hub with video tutorials, and tested the workflow with 2 client teams over 4 weeks.',
    'Client teams using the workflow cut concept-to-delivery time by 40% on average. Creative output consistency improved by 60% (measured by brand guideline adherence). One client scaled their social media output from 5 posts/week to 20 posts/week without adding headcount. The workflow documentation has been adopted by 3 teams.',
    'BEFORE: Ad-hoc AI usage, inconsistent output, 10+ hours per campaign concept, frequent brand drift.\n\nAFTER: Structured 4-stage workflow, 15 reusable templates, 6 hours per campaign concept, 95% brand guideline adherence.',
    '15 reusable prompt templates, AI design workflow documentation (Notion hub), video tutorials (5), quality control checklist, team onboarding guide',
    '4 weeks',
    'Two client teams now produce 4x more creative output with the same headcount. The workflow has become a selling point for the studio—clients specifically hire me to set up their AI creative pipelines.',
    ARRAY['Midjourney', 'DALL-E 3', 'Stable Diffusion', 'Figma', 'Notion', 'ChatGPT'],
    'Brand moodboard template: "[brand description], [industry], [personality traits], [color palette], premium aesthetic, professional --ar 16:9 --v 6"\nSocial creative template: "[brand style] social media post, [content type], [color scheme], [typography style], minimal, bold --ar 1:1 --v 6"\nLogo concept template: "[brand name] logo concept, [industry], [style references], [personality], modern, clean, vector style --ar 1:1 --v 6 --style raw"\nRefinement prompt: "same composition, more refined, better proportions, [specific adjustments], keep [brand elements] --ar 1:1 --v 6"',
    v_ai_id, true, 'published', 6
  );

  -- Testimonials
  INSERT INTO testimonials (author_name, author_role, company, content, rating, project, verified) VALUES
    ('Sarah Chen', 'Marketing Director', 'Nexus Fashion', 'Lafazy transformed our brand identity and social media presence. The summer campaign generated 2M+ impressions and sold out our collection in 2 weeks. The AI workflow system he set up still saves us 10+ hours every week.', 5, 'Summer Launch — Social Media Campaign', true),
    ('David Okafor', 'Founder & CEO', 'Meena''s Villa Restaurant', 'The branding work for our restaurant was exceptional. Within 3 months of opening, we were fully booked on weekends and featured in 2 food publications. The kolam-inspired logo perfectly captures our heritage while feeling modern.', 5, 'MEENA''S VILLA — Restaurant Branding', true),
    ('Marcus Reid', 'Talent Acquisition Lead', 'Vertex Creative Agency', 'We hired Lafazy for a 3-month contract role and were impressed by the professionalism, communication, and quality of work. The AI prompt engineering workflow he implemented is now standard across our entire design team.', 5, 'AI Prompt Engineering — Creative Design Workflow', true),
    ('Amara Patel', 'Content Creator', 'Independent', 'My sponsorship deals tripled after the rebrand. The brand deck Lafazy created is the #1 tool my management team uses to close deals. The merchandise line sold out in 48 hours.', 5, 'TikTok Creator — Personal Brand System', true),
    ('James Mitchell', 'Brand Manager', 'Quantum Labs', 'Working with Lafazy was seamless despite the timezone difference. Async communication was clear, deadlines were met, and the logo system exceeded our expectations. We''ve already booked a second project.', 5, 'Logo & Visual Identity Collection', true),
    ('Priya Sharma', 'Operations Director', 'Horizon Startups', 'The AI workflow Lafazy built for our team paid for itself in the first month. We now produce 4x more creative with the same headcount. His documentation made it easy for our team to adopt.', 5, 'AI Prompt Engineering — Creative Design Workflow', true)
  ON CONFLICT DO NOTHING;

  -- Downloadable resources
  INSERT INTO downloadable_resources (title, slug, description, type, file_url, download_count) VALUES
    ('Professional Resume — Graphic Designer & AI Prompt Engineer', 'professional-resume', 'ATS-friendly resume with 5+ years of experience in branding, visual identity, and AI prompt engineering. Optimized for international recruiters.', 'resume', 'https://lafazystudio.com/downloads/lafazy-resume.pdf', 0),
    ('Complete CV — Detailed Experience & Skills', 'complete-cv', 'Comprehensive CV including full work history, skills matrix, software proficiency, and AI prompt engineering experience.', 'cv', 'https://lafazystudio.com/downloads/lafazy-cv.pdf', 0),
    ('Cover Letter — General Application', 'cover-letter-general', 'Professional cover letter template for graphic design and branding roles at international companies.', 'cover_letter', 'https://lafazystudio.com/downloads/lafazy-cover-letter.pdf', 0),
    ('Cover Letter — Remote Work Application', 'cover-letter-remote', 'Cover letter specifically crafted for remote graphic design roles, highlighting async collaboration and cross-timezone experience.', 'cover_letter', 'https://lafazystudio.com/downloads/lafazy-remote-cover-letter.pdf', 0),
    ('Freelance Proposal Template', 'freelance-proposal', 'Professional proposal template for freelance graphic design and branding projects, including scope, timeline, and pricing structure.', 'cover_letter', 'https://lafazystudio.com/downloads/lafazy-freelance-proposal.pdf', 0),
    ('Agency Partnership Proposal', 'agency-proposal', 'Proposal template for partnering with creative agencies as a contract designer or AI workflow consultant.', 'cover_letter', 'https://lafazystudio.com/downloads/lafazy-agency-proposal.pdf', 0),
    ('Startup Application Template', 'startup-application', 'Application template tailored for startup design roles, emphasizing speed, versatility, and AI-augmented workflows.', 'cover_letter', 'https://lafazystudio.com/downloads/lafazy-startup-application.pdf', 0),
    ('Portfolio PDF — Selected Works', 'portfolio-pdf', 'Curated portfolio PDF featuring 6 case studies with process details, outcomes, and visual showcases.', 'portfolio', 'https://lafazystudio.com/downloads/lafazy-portfolio.pdf', 0),
    ('Brand Presentation PDF', 'brand-presentation', 'Studio capabilities presentation showcasing services, process, case studies, and client outcomes.', 'brochure', 'https://lafazystudio.com/downloads/lafazy-brand-presentation.pdf', 0),
    ('Service Brochure PDF', 'service-brochure', 'Detailed service brochure with pricing tiers, deliverables, timelines, and onboarding process.', 'brochure', 'https://lafazystudio.com/downloads/lafazy-service-brochure.pdf', 0)
  ON CONFLICT DO NOTHING;

END $$;
