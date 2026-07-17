---
publishDate: 2026-07-17T00:00:00.000Z
title: A Few Q&A About AI
excerpt: 'At a roundtable at NUS Global Entrepreneurship Forum Singapore, the moderator posed four questions about enterprise AI: how to choose a model, what the core competitive advantage of the next generation of companies will be, how CEO capabilities will change, and what a truly AI Native Company is. Here are my answers—one principle with two exceptions, betting on Data, CEOs must personally have a sense for AI, and AI-native companies organized around data.'
category: 'Analysis'
topicIds:
  - economy-industry
  - startups-investment
tags:
  - Enterprise AI
  - AI-native
  - Data
  - CEO
  - Model Selection
author: 'Singapore AI Observatory'
lang: en
---

Yesterday I attended NUS Global Entrepreneurship Forum Singapore. In the third panel discussion, the moderator asked several questions. Let me record my thoughts on them.

## Q1: How should enterprises choose models? Open-source or proprietary? General-purpose or industry-specific models?

What principles should enterprises base their choices on?

One principle, two exceptions.

The principle is: **default to using the smartest model**. Use the smartest model to design rules, generate samples, spot-check outputs… the smart model as the manager, small models as factory-line workers.

- **Exception 1: Data cannot leave (compliance, security) → self-deploy open-source.** Example: financial data doesn't connect to large models; buy a few GPUs, put them in the finance office, run appropriate open-source models.
- **Exception 2: Unit economics don't work out (high volume, repetitive, simple) → small models.** Example: content classification and tagging; with high daily volume, using small models is the only way to make the unit economics work.

Additionally, don't lock into any single model—build your own routing layer.

## Q2: As model capabilities converge, what will be the core competitive advantage of the next generation of companies?

If you could only choose one, which would it be: Data (data), Workflow (workflow), Ecosystem (ecosystem), Brand & Trust (brand and trust), Distribution (distribution), or Judgement (founding team judgment)?

I choose **Data**. But what I mean by Data may be different from what many others mean.

Publicly available data models have all been learned; static datasets don't create competitive moats. Most companies lack "proprietary datasets" as a competitive advantage. The reason I choose Data is: most company data may still be in the "not yet digitized" stage, or the "already digitized, but only for humans to see" stage—in other words, not yet able to let AI access business and workflows. Obviously, you have to start with data.

Starting with data has another layer of meaning: simply "showing data to AI" is not enough. It needs to be accompanied by permissions; when A2A—AI Agents conversing with each other—happens, sensitive information won't leak. Only when data work is done well can you safely hand over enterprise context to AI.

Human organizations use architecture to manage permissions; each person only sees their own piece. An agent with full company context is a security nightmare—one prompt injection and it's a total data breach.

## Q3: What will change about the most important capabilities for CEOs in the AI era?

CEOs can't just delegate; they have to truly understand AI capabilities firsthand. Delegation works for stable technologies, but AI capabilities change every month—the feedback loop for delegated decisions is too slow.

The simplest and most direct way to build this understanding is: **get a $200/month subscription to the smartest model, use it to solve as many business problems as possible, spend the entire monthly budget every single month.**

AI is the most CEO-friendly technological revolution in history. AI's interface is natural language, so CEOs' judgment in asking questions and validating results can be fully unleashed.

The term FDE has become popular recently, with a down-to-earth translation called "AI landing officer." I'm not optimistic about external consulting-style FDEs, but I think a CEO can be the true AI landing officer for the enterprise: understands the business, has good judgment, possesses full organizational context, and can allocate resources.

## Q4: What is a truly AI-Native Company? How should enterprises organize in the future?

Look at the history of how context evolved—from this angle, I believe it's about **organizing around data**.

- In the Chatbot era, context was manually pasted by humans;
- In the Claude Code / Cowork era, context was the file system;
- In the enterprise era, context needs to cross people, cross departments, and carry permissions—there's no best practice yet.

Don't start with grand theories—start with getting AI into more business operations. AI isn't one person's or one department's responsibility—it's everyone's.

The key to implementation is driving business growth, not cost reduction. We're seeing many companies use AI as an excuse for layoffs—that's wrong. **The correct metric for efficiency improvements is not how many people you've cut, but how much additional work the same team accomplishes that they previously couldn't, and the resulting business and profit growth.**

Therefore, to determine if a company is AI Native:

- Look at where your data lives—in people's heads, scattered across different business systems, or accessible to Agents;
- Look at how work is divided between people and Agents;
- Look at what proportion of business growth is driven by AI.
