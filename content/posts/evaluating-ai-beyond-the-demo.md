---
title: "From an impressive AI demo to evidence you can use"
description: "A small evaluation process for separating an exciting example from a system you can depend on."
date: "2026-10-10"
category: "Practical AI"
tags: ["Evaluation", "Agents", "Reliability"]
cover: "/illustrations/articles/evaluating-ai-beyond-the-demo.png"
coverAlt: "An evaluation notebook compares cases, checks, and results beside a computer."
source: "https://lnkd.in/p/dH_TNYsm"
takeaway: "A demo establishes that something can happen. An evaluation measures how often it happens, what fails, and what it costs under conditions that matter to you."
---
A spectacular AI demo creates a strong intuition: if it can do that, surely it can do this smaller task. Sometimes that intuition is right. Sometimes the supposedly smaller task depends on messy documents, changing interfaces, or exact details the demonstration never exercised.

My LinkedIn reaction to model-launch hype was a reminder to slow that inference down. Excitement is a reasonable starting point for an experiment. It is not the result of the experiment. Before building a workflow around a capability, I want examples that show both its useful range and its failure boundary.

## Turn the claim into a task

“Good at documents” is difficult to evaluate. “Extract the invoice number, currency, subtotal, tax, and total from this invoice, and flag missing fields” is a testable job.

Define the output schema and acceptable uncertainty. For the invoice example, a missing tax field should not become an invented zero. A mathematically consistent total is useful evidence, but it does not prove every extracted value matches the source. The evaluation needs both structural checks and comparisons with the original document.

Write the criteria before reading the candidate's answers. Otherwise a fluent response can quietly change your definition of success.

```diagram
{"title":"A repeatable loop for evaluating a claim","layout":"flow","steps":[{"label":"Collect cases","detail":"Include normal work, awkward inputs, and known failure boundaries."},{"label":"Run a fixed setup","detail":"Record model, prompt, tools, settings, and allowed attempts."},{"label":"Grade outcomes","detail":"Inspect correctness, side effects, time, and total cost."},{"label":"Keep regressions","detail":"Preserve failures as future tests without tuning away the holdout."}],"caption":"A useful result describes the conditions of the test as clearly as the score."}
```

## Build a set that can disagree with you

Start with representative cases, then deliberately include difficult ones. For invoices, that might mean a clean digital PDF, a poor scan, multiple currencies, a credit note, a missing total, and a document that is not an invoice at all. Keep private data inside the approved environment or use synthetic examples that preserve the relevant difficulty.

A small set helps discover failure modes; it is not automatically a statistically reliable estimate of production performance. If one candidate passes 18 of 20 cases and another passes 19, inspect which case differs and repeat the experiment before declaring a winner. Larger samples and repeated trials may be necessary when small differences affect the deployment decision.

Separate cases used for prompt development from a holdout used for evaluation. When a holdout failure becomes a regression test you actively tune against, replenish the holdout with fresh cases. Otherwise the “unseen” evaluation gradually becomes another training worksheet.

## Use the right kind of grader

A deterministic check can validate JSON, required fields, allowed values, or a calculation. Human review can assess evidence quality and task-specific mistakes that are harder to formalize. An LLM judge can assist with scale, but its grades need calibration against human judgments and can depend on presentation and wording.

Anthropic's [guide to agent evaluations](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) describes evaluating complete outcomes and using different grading approaches. For an agent that operates tools, also inspect the resulting environment: a claim that a draft was saved is weaker evidence than reading the saved draft.

| Layer | Invoice example |
| --- | --- |
| Structure | The output parses and uses the required field types. |
| Correctness | Values match a labeled reference and the source document. |
| Uncertainty | Missing or ambiguous fields are flagged appropriately. |
| Workflow | No duplicate records or unintended external writes occurred. |
| Economics | Time and spend include every attempt and review step. |

## Record the conditions around the score

Save the model identifier, prompt version, context, tool versions, decoding settings, timeout, and retry allowance. A comparison loses meaning if the apparently better system received more context or many more attempts without that being recorded.

Include latency and cost for failed runs. Excluding failures can make an unreliable system look both fast and cheap. Keep a breakdown by task type; a strong aggregate score can hide a serious weakness on the small category that matters most.

For agentic work, distinguish “succeeded at least once across several trials” from “succeeds consistently in a single user attempt.” They answer different questions. A product usually needs to know what happens when an ordinary user asks once.

## Make the decision proportional to the evidence

For the invoice extractor, the first release might prepare a draft record for review. That allows useful automation while collecting evidence on errors. Automatic posting to an accounting system would require a different bar and stronger controls around side effects.

> **Field note:** Keep a failure notebook with the input, observed result, expected behavior, and likely cause. Five well-understood failures often suggest a better next experiment than one polished average score.

Use the findings to choose the next change: improve context, narrow the task, strengthen validation, switch models, or keep human review. Then rerun the same baseline as well as new cases. This makes improvement visible instead of relying on a memorable successful interaction.

A good demo earns curiosity. A good evaluation earns a specific, bounded claim about what the system can do. That is the kind of confidence worth building a product on.
