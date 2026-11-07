---
title: 'agent-browser Explained: Let Your AI Use a Browser'
seoTitle: 'agent-browser Explained: Uses, Skills and Limitations'
description: >-
  Learn how agent-browser lets Claude Code inspect pages, fill forms and
  check results, through one practical example and its real limitations.
seoDescription: >-
  What is agent-browser? Learn how its skill and browser tool work together,
  where browser automation helps, and what still needs human judgment.
date: '2026-11-07'
category: Practical AI
tags:
  - AI Agents
  - Browser Automation
  - Agent Skills
  - Claude Code
cover: /illustrations/articles/agent-browser.png
coverAlt: A terminal controls a browser contact form using numbered element references.
coverWidth: 1200
coverHeight: 630
takeaway: >-
  agent-browser lets Claude inspect a running website, use its controls
  and check the result. Its skill provides the operating instructions.
draft: true
---
A code change does not prove that a website works. After fixing a contact form, Claude still needs to open it, try the inputs and check the result.

**agent-browser gives Claude a way to do that.**

## What is agent-browser?

[agent-browser](https://agent-browser.dev/) is a browser automation tool that AI agents control through terminal commands. It can open pages, read controls, fill forms, click buttons and capture screenshots.

Three parts work together:

- **Claude decides** what to do and whether the result matches your request.
- **agent-browser operates the browser** and returns what it observes.
- **The skill teaches Claude the commands** and workflows. Installing the skill alone does not install the browser tool.

The browser stays open between commands, so Claude can complete a multi-step task. The [skill instructions](https://agent-browser.dev/skills) come from the installed CLI version.

## Example: check a contact form

Ask Claude:

> Test the contact form with synthetic data. Check that it rejects an invalid email, then submit valid data and show the result.

The page, output and references below are illustrative; this is not a recorded test.

### 1. Read the page

```bash
agent-browser open http://localhost:3000/contact
agent-browser snapshot -i
```

A **snapshot** describes the page in text. With `-i`, it focuses on interactive controls:

```text
@e1 [textbox] "Email"
@e2 [textbox] "Message"
@e3 [button] "Send message"
```

Claude uses these references to target the fields and button. A screenshot serves a different purpose: showing layout, overlap and other visual details. See the [snapshot guide](https://agent-browser.dev/snapshots).

### 2. Try the inputs

Claude first tries an invalid email and checks for a validation error. It takes another snapshot before continuing, because the page may have changed.

If the current references match the example above, it can submit valid data:

```bash
agent-browser fill @e1 "reader@example.com"
agent-browser fill @e2 "Synthetic contact-form test."
agent-browser click @e3
```

### 3. Check the result

```bash
agent-browser wait --text "Message received"
agent-browser snapshot
agent-browser screenshot contact-confirmation.png
```

The full snapshot includes status text that `-i` might omit. The [wait command](https://agent-browser.dev/quick-start) waits for the expected confirmation; a timeout means Claude needs to investigate.

A confirmation proves what the interface displayed. Proving that the message reached an inbox requires checking the receiving side too.

## Where it helps

- **Check UI changes:** open menus, follow routes and test forms after editing code.
- **Reproduce bugs:** follow the reported steps and capture the failure.
- **Collect information:** apply filters and read results on interactive websites.
- **Use web-only tools:** operate a dashboard or download an authorized report when no suitable integration exists.

## Set it up in Claude Code

Install the tool, its browser and the skill:

```bash
npm install -g agent-browser
agent-browser install
npx skills add vercel-labs/agent-browser
```

The skill tells Claude to load its working instructions with:

```bash
agent-browser skills get core
```

Follow the [installation guide](https://agent-browser.dev/installation) for platform requirements. Commands and features depend on the installed version.

## What are the drawbacks?

- **Login can interrupt a task.** Sessions expire; MFA and CAPTCHA may require human input. Saved state helps reuse a login. [Session options](https://agent-browser.dev/sessions).
- **Text does not show everything.** Canvas content, poorly labelled controls and layout problems may need screenshots or further inspection.
- **Claude can make mistakes.** It can choose the wrong button or miss an error. Give it a clear expected result.
- **Account access carries real permissions.** Use an appropriate test account and configure action controls. Treat website content as untrusted data. [Security controls](https://agent-browser.dev/security).
- **Automation has a cost.** Browser work, model calls and retries take time and resources.

## What if you already use Playwright?

Playwright MCP can perform the same form test. Both tools provide text snapshots, element references, browser actions and screenshots. Microsoft also offers a [Playwright CLI with skills](https://github.com/microsoft/playwright-cli).

The useful differences are in their built-in controls and workflows:

| What matters | agent-browser | Playwright MCP / CLI |
| --- | --- | --- |
| Giving commands | Terminal commands and skill instructions; also supports MCP. | MCP tools, or terminal commands through Playwright CLI. |
| Tokens and page context | Compact text with interactive, depth and selector filters. | Text snapshots with scope, depth and file options. CLI and MCP output settings can reduce context too. |
| Saved logins | Sessions and profiles, plus a named credential vault. | Persistent profiles, saved state and existing-browser connections. |
| Action rules | Built-in policies and approval gates for categories such as uploads. | Origin and file-access controls; tool approvals depend on the agent host. |
| Seeing what changed | Built-in snapshot, screenshot and URL comparison commands. | Comparisons can be implemented with Playwright code; Playwright Test supports screenshot assertions. |
| Reusing Playwright code | Uses its own browser commands. | MCP generates Playwright code; the CLI records actions, generates locators and runs snippets. |
| Browser choices | Chrome by default, plus other backends with varying features. | MCP supports Chrome, Firefox, WebKit and Edge. |

Sources: [agent-browser controls](https://agent-browser.dev/security), [page comparisons](https://agent-browser.dev/diffing), [Playwright MCP](https://github.com/microsoft/playwright-mcp) and [Playwright screenshot assertions](https://playwright.dev/docs/test-snapshots).

**Does agent-browser use fewer tokens?** Its [documentation](https://agent-browser.dev/#why-refs) estimates 200–400 tokens for compact text versus 3,000–5,000 for a full DOM dump. That compares page formats, not agent-browser against Playwright MCP. Both can return concise text; lower total task usage needs a matched test.

## How companies use them

PostHog's public `code` repository documents an explicit split:

- **agent-browser:** ask an agent to inspect a change in the running desktop app now.
- **Playwright E2E:** run saved test scripts automatically after code changes. This is part of CI, the automated checks before merging or releasing code.

The distinction appears directly in its [testing guide](https://github.com/PostHog/code/blob/main/docs/testing.md#interactive-app-testing). This is agent-browser alongside **Playwright Test**, not Playwright MCP. The [repository was archived in August 2026](https://github.com/PostHog/code), so it is a historical project example.

Sentry's official GitHub organization also publishes an [agent-browser visual QA skill](https://github.com/getsentry/skill-sentry-visual-qa) for checking UI changes with screenshots and videos. Separately, AOE [reports using Playwright MCP](https://ai-radar.aoe.com/tools/playwright_mcp/) to let coding agents verify frontend changes.

## My take: should you switch?

**If Playwright MCP already works for you, I wouldn't switch just to use agent-browser.** They cover the same core browser tasks. Agent-browser is worth trying when its terminal commands, credential vault or action rules solve a specific problem in your setup.

User reports are mixed. A [January 2026 user test](https://www.reddit.com/r/vibecoding/comments/1qc59ri/if_youre_doing_browserbased_scraping_or_testing/) reported much smaller page output with agent-browser's interactive filter. A [November user comparison](https://www.reddit.com/r/AI_Agents/comments/1xm0ac4/i_ran_the_same_browser_job_216_times_with_claude/) found that token rankings changed between Claude Code and Codex. These are individual tests, not a general ranking.

For a new setup, agent-browser is a reasonable option. For a working Playwright setup, switch only after it handles your actual task better or saves enough time or tokens to justify the change.
