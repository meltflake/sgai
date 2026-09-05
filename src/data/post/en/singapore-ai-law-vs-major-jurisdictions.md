---
publishDate: 2026-09-05
title: Singapore's AI Laws in Comparison with Major Countries
excerpt: 'Singapore does not have a law called an "Artificial Intelligence Law," but there are more than 20 hard laws and soft laws directly related to AI. This article lists them one by one, then compares them in a single table against the legislative status as of September 2026 of the EU, United States, China, Japan, South Korea, United Kingdom, and Vietnam: who enacted a horizontal law, who is delaying, whose law puts training data copyright into legal provisions, and how each country manages deepfakes.'
category: Observation
topicIds:
  - governance-regulation
  - deepfakes-disinformation
  - international
tags:
  - Law
  - Governance
  - Observation
  - Singapore
  - EU AI Act
  - Deepfakes
  - Copyright
author: Singapore AI Observation
relatedPolicyIds:
  - copyright-act-2021-section-244-computational-data-analysis-exception
  - pdpc-advisory-guidelines-personal-data-in-generative-ai-2026
  - imda-generative-ai-chatbot-transparency-guidelines-2026
  - model-ai-governance-framework-for-agentic-ai
  - model-ai-governance-framework
  - proposed-model-ai-governance-framework-for-generative-ai
  - ai-verify
  - digital-infrastructure-bill-consultation-2026
  - guide-on-use-of-generative-ai-tools-by-court-users
  - pdpc-advisory-guidelines-on-use-of-personal-data-in-ai
  - securing-agentic-ai-addendum
relatedLeverNumbers:
  - 2
relatedTimelineYears:
  - 2024
  - 2025
  - 2026
relatedPersonIds:
  - josephine-teo
lang: en
---

Singapore does not have a law called an "Artificial Intelligence Law." But when you list the laws, regulations, and guidelines directly related to AI, there are more than 20, denser than many countries that have already passed AI laws. Its approach is: leave the training side open, use criminal law, electoral law, and cybersecurity law to block the output side point by point, and rely on voluntary frameworks and industry regulators at the governance level. Looking at 2026, the EU delayed high-risk provisions, the U.S. federal government is pressuring state laws, the UK announced it will maintain the status quo, and Singapore's approach has become the de facto state of most countries by 2026.

## I. What AI-Related Laws Does Singapore Have?

Below, they are listed separately according to "hard law" (with penalties, enforceable by courts) and "soft law" (frameworks, guidelines, regulatory expectations). Complete entries and links to original text are in this site's [Legal Framework](/legal-ai/) and [Policy Library](/policies/) sections.

### Hard Law: Laws with Penalties

| Law                                                              | Year                                                                   | Authority         | What It Covers                                                                                                                                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personal Data Protection Act (PDPA)                              | Passed 2012, amended 2020                                              | PDPC              | Data. In 2020, "business improvement exception" was added, allowing enterprises to improve products (including training models) without additional consent under reasonableness testing |
| Copyright Act 2021 Section 244                                   | Effective November 2021                                                | MINLAW            | Training. Content lawfully obtained may be used for computational data analysis, including AI training, and does not constitute infringement                                            |
| Road Traffic Act Amendment                                       | 2017                                                                   | MOT               | Test authorization for autonomous vehicles                                                                                                                                              |
| Protection from Online Falsehoods and Manipulation Act (POFMA)   | 2019                                                                   | Various Ministers | Correction orders and takedown orders for false information; AI-generated false information is subject to the same rules                                                                |
| Cybersecurity (Miscellaneous Amendment) Act                      | Passed 2022, effective February 2023                                   | IMDA              | Obligations of social platforms regarding harmful content                                                                                                                               |
| Online Criminal Harms Act (OCHA)                                 | July 2023                                                              | MHA               | Fraud, extortion, harassment. AI-generated fraud and deepfake extortion are both handled under this law                                                                                 |
| Elections (Online Political Advertising Integrity) Amendment Act | Passed 15 October 2024                                                 | ELD               | Prohibition on publishing AI-generated content or impersonating candidates' statements or actions during election periods                                                               |
| Penal Code (Miscellaneous Amendment) Act 2025                    | Passed 4 November 2025, AI-related provisions effective 17 August 2026 | MHA               | AI-generated intimate images and child sexual exploitation material become criminal offenses, even if the person depicted is fictional                                                  |
| Cybersecurity (Relief and Accountability) Act 2025               | Passed 5 November 2025, effective 29 June 2026                         | MDDI              | Establishes an Online Safety Commission (OSC); victims can request takedown, 13 categories of cyber harm include AI-generated intimate images                                           |
| Digital Infrastructure Act (Draft)                               | Public consultation July 2026                                          | MDDI / IMDA       | Licensing for data centres over 3 megawatts and large cloud service providers; energy efficiency moves from voluntary to mandatory                                                      |

### Soft Law: Frameworks, Guidelines, Regulatory Expectations

| Document                                                | Year                                       | Issued By                   | What It Covers                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| AI Governance Model Framework                           | January 2019, second version 2020          | IMDA / PDPC                 | Generic governance framework for enterprise AI deployment                                                       |
| MAS FEAT Principles, Veritas, MindForge                 | 2018, 2021, 2024                           | MAS                         | Fairness, ethics, accountability, transparency for AI in finance; gradually moving from principles to tools     |
| AI Verify                                               | May 2022                                   | IMDA                        | AI system testing tools and framework                                                                           |
| Generative AI Governance Model Framework                | 2024                                       | IMDA / AI Verify Foundation | Nine governance dimensions for large models                                                                     |
| PDPC Guidelines on AI Use of Personal Data              | March 2024                                 | PDPC                        | Application of PDPA in recommendation and decision-making systems                                               |
| CSA AI System Security Guidelines                       | October 2024                               | CSA                         | Security across the full lifecycle of AI systems. On 17 June 2026, an Agentic AI supplement was added           |
| Guidelines for the Use of Generative AI in Courts       | October 2024                               | Supreme Court               | Lawyers and parties bear final responsibility for AI-prepared documents and must disclose                       |
| MAS AI Risk Management Guidance                         | December 2024                              | MAS                         | Bank AI model governance, third-party risk, human in the loop                                                   |
| Agentic AI Governance Model Framework                   | Released January 2026, updated 20 May 2026 | IMDA                        | Risk grading, human approval, and auditing for AI agents                                                        |
| PDPC Guidelines on Personal Data Use in Generative AI   | 20 July 2026                               | PDPC                        | Notification obligations when using personal data to train generative AI; does not create new legal obligations |
| IMDA Transparency Guidelines for Generative AI Chatbots | 20 July 2026                               | IMDA                        | Chatbot information card: purpose, limitations, data handling, complaint channels                               |

### Singapore's Three Approaches

**Training side open.** Section 244 of the Copyright Act makes AI training an explicit exception. Globally, only Singapore and Japan have written this into law. The US relies on court rulings case by case; the EU relies on a copyright holders' "opt-out" mechanism. Plus the PDPA's business improvement exception, there are two laws backing the training data layer in Singapore.

**Output side strictly regulated.** Deepfakes, AI-generated intimate images, impersonating candidates during elections, and AI fraud—four categories of problems each have a dedicated law. In 2024, the electoral deepfake law took five weeks from proposal to passage, faster than the EU AI Act's electoral provisions going into effect. The criminal code amendment taking effect on 17 August 2026 classifies "AI-generated fictional minors" as child sexual exploitation material, closing the loophole of "the person in the image doesn't exist."

**Governance through soft law and industry regulation.** At the general level, there are three IMDA model frameworks (generic, generative, Agentic) and the AI Verify testing tool, all voluntary. What has enforcement power are industry regulators: MAS oversees banks, CSA oversees security, courts oversee litigation documents, MOH oversees medical devices. In July 2026, PDPC and IMDA released two guidelines on the same day; PDPC itself stated "does not create new legal obligations."

Minister Josephine Teo's statement in the 2026 Supply Committee debate was: do not enact a separate AI law, but legislate quickly and narrowly when concrete harms appear. The Digital Infrastructure Act draft is an extension of this approach at the compute layer: no discussion of models or training, just licensing for data centres and cloud service providers.

## II. Comparison Among Major Countries

As of September 2026.

| Jurisdiction and horizontal AI law                                                                                                                                                                                                                                         | Penalties                                                  | Training-data copyright                                                                                                                                                    | Deepfakes and generated content                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Singapore**: None. Relies on existing laws and industry guidelines                                                                                                                                                                                                       | Each sectoral law carries its own                          | Section 244 of Copyright Act provides explicit exception                                                                                                                   | Four separate laws cover elections, intimate images, fraud, and platform remedies                                            |
| **EU**: AI Act (2024/1689). Effective August 2024; prohibited categories effective 2 February 2025, general model obligations effective 8 August 2025; high-risk provisions delayed to 2 December 2027 and 8 August 2028                                                   | Up to €35 million or 7% of global revenue                  | Text and data mining exception under Digital Single Market Copyright Directive, which copyright holders can opt out of; general models must disclose training data summary | AI Act requires labeling of deepfakes and AI-generated content                                                               |
| **United States**: No federal law. December 2025 presidential order directs DOJ to prosecute "burdensome" state laws; states proceed individually                                                                                                                          | Varies by state                                            | No statutory exception. Courts rule case by case; in 2025 Anthropic case, training deemed fair use, pirated books not included; settled for $1.5 billion                   | Federal TAKE IT DOWN Act signed May 2025, requires platforms to remove non-consensual intimate images within 48 hours        |
| **China**: No comprehensive law, drafting in progress. Algorithmic recommendation (2022), deepfake synthesis (2023), generative AI interim measures (2023) stacked incrementally; 2026 State Council legislative plan includes "accelerating comprehensive AI legislation" | Penalties under Cybersecurity Law, Data Security Law, etc. | No statutory exception; courts handle individual cases                                                                                                                     | Generative synthetic content labeling measures effective 1 September 2025, with mandatory national standard                  |
| **Japan**: AI Promotion Act. Passed 28 May 2025, mostly effective 4 June 2025; AI Basic Plan passed by Cabinet 23 December 2025                                                                                                                                            | No penalties, only recommendations and public disclosure   | Copyright Act Section 30-4 provides explicit exception (since 2019)                                                                                                        | No dedicated law; relies on existing laws                                                                                    |
| **South Korea**: AI Basic Law. Passed December 2024, effective 22 January 2026; penalties deferred one year                                                                                                                                                                | Maximum 30 million won                                     | No statutory exception                                                                                                                                                     | Basic Law requires labeling for generative AI; since September 2024, possession and viewing of sexual deepfakes are criminal |
| **United Kingdom**: None. No AI bill mentioned in May 2026 King's Speech; March 2026 Copyright and AI Report decided to maintain status quo                                                                                                                                | None                                                       | Maintain status quo; previously preferred text data mining exception scheme shelved                                                                                        | 2023 Online Safety Act; 2025 Data Act criminalizes creation of sexual deepfakes                                              |
| **Vietnam**: AI Law (134/2025/QH15). Passed 10 December 2025, effective 1 March 2026; existing systems have grace period until 1 March 2027                                                                                                                                | Yes                                                        | No dedicated provisions seen                                                                                                                                               | Risk-tiered approach; many concepts borrowed from EU                                                                         |

### Looking at Each One

**EU.** The AI Act effective 1 August 2024 is the world's first horizontal AI law. Prohibited use categories took effect 2 February 2025; obligations for general models (GPT, Claude, etc.) took effect 2 August 2025. High-risk system provisions originally scheduled for 2 August 2026 were delayed due to member states' regulators and coordinating standards not being ready. On 7 May 2026, Parliament and Council reached a "Digital Governance Act" agreement, effective 27 July 2026, pushing Annex III standalone high-risk systems to 2 December 2027 and those embedded in regulated products to 2 August 2028. Italy passed the first member state national AI law in September 2025.

**United States.** No federal AI law. Biden's 2023 AI executive order was rescinded in January 2025; AI Action Plan released July 2025; 11 December presidential order directed DOJ to establish an AI litigation task force to prosecute "burdensome" state AI laws, naming California and Colorado. On the state side, Colorado's 2024 AI law was delayed twice and changed to 1 January 2027 effective date in May 2026, while deleting algorithmic discrimination notice obligations and impact assessment, leaving only disclosure requirements. California SB 53 frontier model transparency law took effect 1 January 2026. Texas AI governance law took effect the same day. On copyright, in June 2025 the Anthropic case judge ruled training is fair use and storing pirated books is not; the case settled for $1.5 billion in September. That same month the Meta case also ruled in Meta's favor, but the judge wrote that "in many situations training does not constitute fair use."

**China.** No comprehensive law; regulations added piecemeal: algorithmic recommendation regulation March 2022, deepfake synthesis regulation January 2023, generative AI interim measures August 2023, generative synthetic content labeling measures effective 1 September 2025 with mandatory national standard. Cybersecurity Law revised in 2025, effective 1 January 2026, adding Section 20 stating the state supports AI basic theory and algorithm research. May 2026 State Council annual legislative plan includes "accelerating comprehensive AI legislation," covering data, computing power, algorithms, data property rights, cybersecurity, and supply chain security. Training data copyright has no statutory exception; courts handle individual cases.

**Japan.** Passed the AI Promotion Act on May 28, 2025, with most provisions taking effect on June 4, established an AI Strategy Headquarters on September 1, and the Cabinet approved an AI Basic Plan on December 23. This law has no penalties. The government can only provide recommendations, request information, and publicly name entities. On the training side, Article 30-4 of the Copyright Act has allowed works to be used for information analysis purposes since 2019, putting it on par with Singapore's Article 244.

**South Korea.** The AI Basic Act was passed on December 26, 2024, and took effect on January 22, 2026, making it the first comprehensive AI law to take effect outside the EU. It governs high-impact AI and generative AI labeling, and foreign enterprises must appoint domestic representatives. The maximum fine is 30 million Korean won; the Ministry of Science and ICT announced that it generally will not levy fines for at least one year from 2026, but entity obligations apply from the effective date. On deepfakes, a law amendment in September 2024 criminalized possession and viewing of non-consensual sexual deepfakes; an electoral law amendment in December 2023 prohibited deepfake campaign content for 90 days before elections.

**United Kingdom.** A 2023 white paper set out a principle-based approach supporting innovation, delegating enforcement to existing regulators. The AI Bill has been postponed multiple times and was not mentioned in the King's Speech in May 2026. The copyright and AI consultation received over 11,000 responses; the report issued on March 18, 2026, decided to maintain the status quo, and the previously preferred text data mining exception plus opt-out approach is no longer the first choice, as the government awaits the results of cases such as Getty v. Stability AI.

**Vietnam.** Passed an AI Law on December 10, 2025, which took effect on March 1, 2026, making it one of Southeast Asia's earliest comprehensive AI laws. It classifies by risk level and borrows heavily from the EU AI Act, led by the Ministry of Science and Technology. Existing systems have a grace period until March 1, 2027, and the healthcare, education, and finance sectors until September 1, 2027.

## III. Key Observations

**The world divides into four camps.** Comprehensive legislation camp: EU, South Korea, Vietnam — one law governing all AI. Promotion law camp: Japan — has law but no teeth. No comprehensive law camp: Singapore, UK, US federal — using existing laws and sector regulation. China is in its own camp: first issuing departmental regulations by scenario, with comprehensive law in progress.

**Comprehensive laws are retreating in 2026.** The EU's high-risk provisions have been delayed by 16 to 24 months, Colorado delayed and scaled back, the UK announced it would not legislate, and the US federal level is preempting state laws. South Korea's and Vietnam's laws have taken effect, but both granted grace periods of over one year. Singapore never planned comprehensive legislation from 2019 onward, and in 2026 its position appears to align with the actual status of most countries.

**Only two countries have written training provisions into law.** Singapore and Japan. The EU relies on opt-out mechanisms, the US on courts, while China and South Korea have no exceptions, and the UK discussed it for two years and decided not to move. For companies training models in Singapore, this is the most concrete differentiator.

**Output-side rules are converging fastest.** On AI-generated intimate images, child sexual abuse material, election deepfakes, and generated content labeling, Singapore, the US, China, South Korea, the UK, and the EU have all enacted legislation or regulations between 2024 and 2026, with different wording and penalties but consistent direction.

## IV. What to Watch When Doing AI in Singapore Now

- Training models: Copyright Law Article 244 and the PDPA business improvement exception are the foundation. The July 2026 PDPC guidelines require stating in privacy policies that "user data will be used to train models". A broad "for improving services" statement is no longer sufficient.
- Building user-facing generative products: IMDA's chatbot information card is voluntary, but the Online Safety (Relief and Accountability) Act has taken effect, and users can file complaints with the OSC about AI-generated intimate images, which platforms must address.
- Finance, healthcare, law: follow industry regulations, particularly MAS guidance, MOH AI guidelines for healthcare, and court notices, which are more binding than general frameworks.
- Selling products to the EU: AI Act general model obligations have applied since August 2025, with high-risk provisions pushed to December 2027. Selling to South Korea: entity obligations apply from January 2026, with fines deferred for one year. Selling to Vietnam: grace period until March 2027.
- Watch three things: when the Digital Infrastructure Bill goes to Parliament; when China's comprehensive AI law draft is made public; whether the EU's high-risk provisions will change before December 2027.

## Sources

- Singapore Copyright Act Article 244: [sso.agc.gov.sg](https://sso.agc.gov.sg/Act/CA2021?ProvIds=P14-#pr244-)
- MDDI: Online Safety Commission and Online Safety (Relief and Accountability) Act launched on June 29, 2026: [mddi.gov.sg](https://www.mddi.gov.sg/newsroom/online-safety-commission-and-online-safety--relief-and-accountability--act-2025-to-start-on-29-june-2026/)
- MHA: Criminal Law (Miscellaneous Amendments) Act 2025 commencement notice: [mha.gov.sg](https://www.mha.gov.sg/media-room/newsroom/commencement-of-the-criminal-law-miscellaneous-amendments-act-2025/)
- MDDI: Public consultation on Digital Infrastructure Bill: [mddi.gov.sg](https://www.mddi.gov.sg/newsroom/public-consultation-on-digital-infrastructure-bill/)
- MDDI: Minister Josephine Teo's speech at the Committee of Supply debate 2026: [mddi.gov.sg](https://www.mddi.gov.sg/newsroom/speech-by-minister-josephine-teo-at-the-committee-of-supply-debate-2026/)
- EU Digital Omnibus Act agreement: [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/), [White & Case](https://www.whitecase.com/insight-alert/eu-agrees-digital-omnibus-deal-simplify-ai-rules)
- White House Executive Order, December 11, 2025: [whitehouse.gov](https://www.whitehouse.gov/presidential-actions/2025/12/eliminating-state-law-obstruction-of-national-artificial-intelligence-policy/)
- Colorado AI Act amendments and delay: [Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/colorado-ai-act-amended-and-effective-date-delayed)
- US AI copyright litigation 2026 update: [Norton Rose Fulbright](https://www.nortonrosefulbright.com/en/knowledge/publications/ce8eaa5f/ai-in-litigation-series-an-update-on-ai-copyright-cases-in-2026)
- China State Council 2026 legislative agenda: [MLex](https://www.mlex.com/mlex/articles/2476359/china-state-council-puts-ai-cybersecurity-legislation-on-2026-agenda); China AI Legal Framework August 2026: [MMLC](https://mmlcgroup.com/china-ai-2026/)
- Japan AI Promotion Act: [FPF](https://fpf.org/blog/understanding-japans-ai-promotion-act-an-innovation-first-blueprint-for-ai-regulation/)
- South Korea AI Basic Act: [Cooley](https://www.cooley.com/news/insight/2026/2026-01-27-south-koreas-ai-basic-act-overview-and-key-takeaways)
- UK Copyright and AI Report: [GOV.UK](https://www.gov.uk/government/publications/report-and-impact-assessment-on-copyright-and-artificial-intelligence/report-on-copyright-and-artificial-intelligence); Status quo analysis: [Fieldfisher](https://www.fieldfisher.com/en/services/intellectual-property/intellectual-property-blog/uk-government-maintains-status-quo-on-ai-and-copyr)
- Vietnam AI Law: [Allen & Gledhill](https://www.allenandgledhill.com/vn/publication/articles/32667/s-new-law-on-artificial-intelligence-risk-based-regulatory-framework-in-force-1-march-2026); Original text: [Law 134/2025/QH15](https://english.luatvietnam.vn/law-no-134-2025-qh15-dated-december-10-2025-of-the-national-assembly-on-artificial-intelligence-422299-doc1.html)
