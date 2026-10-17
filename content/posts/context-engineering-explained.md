---
title: Context Engineering Explained
seoTitle: Context Engineering vs Prompt Engineering Explained
youtubeId: UjbE681aoXY
description: >-
  Learn how context engineering gives an AI the right instructions, history,
  facts and tools, using a complete customer-return example.
date: '2026-10-18'
category: Practical AI
tags:
  - Context Engineering
  - LLMs
  - AI Engineering
  - Tool Calling
  - RAG
cover: /illustrations/articles/context-engineering.png
coverAlt: >-
  Context engineering flow showing a headphone return question combined with
  relevant history, an authorized order lookup and the applicable policy.
coverWidth: 1200
coverHeight: 630
takeaway: >-
  Build each model request from the instructions, authorized facts, relevant
  history and tools the task needs, then test whether the system uses them
  correctly.
draft: false
seoDescription: >-
  Understand context engineering vs prompt engineering through an LLM
  customer-support example, tool calls, context windows, and practical tests.
ogTitle: Context Engineering vs Prompt Engineering Explained
ogDescription: >-
  See how an app builds the context an LLM needs, from conversation history
  to authorized order lookups and the right return policy.
---
“Can I return it?”

That sentence is clear to a person looking at the same order page. By itself, it tells an LLM almost nothing. What is “it”? Who owns the order? When was it delivered? Which return policy applies? Context engineering supplies the information needed to answer.

**Context engineering is the work of selecting, organizing and updating the information a model receives at each step.** The LLM processes the context it is given; the application builds that context. Anthropic describes context as the tokens present when an LLM is sampled and treats context engineering as the broader problem of choosing the configuration that produces the desired behavior ([Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)).

Day 6 of the AI Engineering Interview Series. [Day 5 covered LLM model routing](/blog/llm-model-routing): choosing a model. Here, we decide what that model gets to see.

## Follow one return request

Imagine a signed-in customer is viewing an order and asks, “Can I return it?” The application already has possible clues:

- login identifies the customer;
- the current order page may identify the purchase;
- an earlier message says the headphones are unopened.

If the page and conversation point to different orders, the assistant should ask which one the customer means. Context engineering does not turn ambiguity into a fact.

In this example, suppose the matching order was delivered 10 days ago and its applicable policy allows unopened headphones to be returned within 30 days. The application must retrieve those facts before the model can explain eligibility.

```diagram
{
  "title": "Build context for the return question",
  "layout": "flow",
  "input": {
    "label": "Customer asks",
    "detail": "Can I return it?"
  },
  "steps": [
    {
      "label": "Resolve the reference",
      "detail": "Use login, the current page and relevant conversation history."
    },
    {
      "label": "Fetch authorized facts",
      "detail": "Check this customer's order and the policy version that applies."
    },
    {
      "label": "Assemble the next request",
      "detail": "Include the question, unopened condition, delivery age and return rule."
    }
  ],
  "output": {
    "label": "Explain eligibility",
    "detail": "The unopened headphones are 10 days into a 30-day return window."
  },
  "caption": "The application supplies the missing facts. The assistant should ask a clarifying question when it cannot identify the order safely."
}
```

The answer could be: “Yes. Based on this order and what you told me, the unopened headphones are eligible for return.”

## What the model does and what the application does

The application can give the model an instruction such as “Check the order and its applicable return policy before answering.” It can also provide a tool definition that describes an order lookup and its input shape.

The model may then request a lookup. For a normal client-executed tool, it does not query the database itself. It returns a structured request; application code validates and executes it, then supplies the result in a later model request. That division is the documented Claude client-tool loop ([Claude Platform](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works)).

This simplified envelope illustrates the exchange; it is not a provider SDK payload.

```json
{
  "tool_request": {
    "name": "lookup_return_context",
    "order_id": "4182"
  },
  "tool_result": {
    "delivered_days_ago": 10,
    "policy": {
      "requires_unopened": true,
      "return_window_days": 30
    }
  }
}
```

The unopened condition still comes from the customer's earlier message. The lookup supplies the delivery age and the policy requirement against which that statement is checked.

Before the lookup, the backend must confirm that order `4182` belongs to the signed-in customer. The model's request is a suggestion, not authorization. The backend should return only the facts needed for this answer, for both accuracy and security. These checks also limit the harm from [prompt injection](/blog/prompt-injection-explained), where untrusted input tries to redirect the AI.

```diagram
{"title":"A client-tool round trip","layout":"flow","steps":[{"label":"Application sends context","detail":"Instructions, relevant history and the lookup tool definition."},{"label":"Model requests a tool","detail":"It proposes a tool name and structured arguments."},{"label":"Backend checks and runs","detail":"Authorize the exact customer and order, then fetch facts and policy."},{"label":"Application sends the result","detail":"The next model request includes the authorized tool result."}],"output":{"label":"Model answers","detail":"Explain eligibility from the returned evidence."},"caption":"The model can choose a tool, while application code owns permissions, execution and result selection."}
```

Not every workflow needs the model to choose. If every return question requires an order and policy lookup, the application can fetch them before the first model call. This is simpler and more predictable. Model-selected tools help when the necessary action depends on the conversation.

## Context engineering vs prompt engineering

Prompt engineering shapes instructions: what the assistant should do, which rules it must follow and how it should answer. Context engineering includes that work, then asks additional questions:

- Which records should retrieval bring in?
- Which earlier messages still matter?
- Should old history be summarized?
- Which tools are available for this step?
- Which policy version applies to this order?

Selection matters because tool definitions and tool results also use context-window space ([Claude Platform](https://platform.claude.com/docs/en/agents-and-tools/tool-use/manage-tool-context)). A summary can save space, but it can also remove a detail needed later. Keep source identifiers and versions with retrieved facts so the application can trace where an answer came from and avoid silently applying a newer policy to an older order.

## A bigger context window is only more capacity

If information fits in the window, the model can receive it. That does not prove the model will use it correctly. *Lost in the Middle* found that models tested on multi-document question answering and key-value retrieval often performed worse when relevant information appeared in the middle of a long input ([Liu et al.](https://aclanthology.org/2024.tacl-1.9/)). The result belongs to those models and tasks; it is a reason to test, not a rule that every current model always fails in the middle.

Evaluate the assembled system with concrete cases: one obvious order, two possible orders, a missing condition, a stale policy, a long conversation and an order that belongs to another customer. Check whether it asks when needed, uses the applicable policy, cites the right facts and never exposes unauthorized data. Run multiple trials because model output can vary, and grade the final outcome as well as the tool-call trace ([Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)).

## Context engineering interview answer

“Context engineering designs what an LLM receives at each step: instructions, relevant history, retrieved facts, tool definitions and tool results. The application builds and authorizes that context; the LLM processes it and may request tool calls. I keep the sources and versions traceable, summarize carefully, and evaluate whether the full system asks for missing details and uses the supplied evidence correctly.”
