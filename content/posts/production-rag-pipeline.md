---
title: "Production RAG Explained"
seoTitle: "Production RAG Explained"
description: "Build a RAG pipeline with parent-document retrieval, hybrid search, tenant isolation, cross-encoder reranking and answers grounded in cited sources."
date: "2026-10-19"
category: "Practical AI"
tags: ["RAG", "Retrieval", "LLMs", "AI Engineering"]
cover: "/illustrations/articles/production-rag-pipeline.png"
coverAlt: "A support question passes through scoped hybrid search and reranking to reach an answer linked to a troubleshooting source."
coverWidth: 1200
coverHeight: 630
takeaway: "Retrieve relevant, authorized context before generating an answer. Ranking finds useful passages; it does not verify that they are true."
---
Suppose a support assistant gives a confident fix for `ERR_404_NULL`. The fix belongs to a different product version.

A stronger model might still answer from the wrong information. **Retrieval-augmented generation (RAG) fetches source material and includes it in the model's context before it answers.** The retrieval path needs as much care as the prompt.

Here is one way to build it, following the same error-code question through four steps.

## 1. Search small, return enough context

A sentence containing `ERR_404_NULL` is easy to locate, but the next sentence might say which versions the fix applies to. Cutting them apart can lose the condition that makes the answer correct.

With **parent-document retrieval**, index smaller chunks and keep a reference to their parent passage. After a match, fetch that parent for context. A related [LlamaIndex sentence-window pattern](https://docs.llamaindex.ai/en/v0.10.34/examples/node_postprocessor/MetadataReplacementDemo/) replaces a retrieved sentence with surrounding sentences before generation.

Test paragraph- and section-sized parents against real questions from your corpus.

## 2. Combine meaning, keywords and permissions

An embedding model converts text into vectors for a database to store and search. Dense retrieval can match “the app cannot find my record” to a passage phrased differently.

Add a lexical signal such as BM25 and combine the rankings. This [hybrid search](https://docs.pinecone.io/guides/search/hybrid-search) helps distinctive strings like `ERR_404_NULL` surface too. Dense search can find them, but may rank the wrong passage higher. BM25 is token-based, so it does not guarantee exact-string matching.

Derive tenant and access scope from authenticated identity, then apply it to both searches and every parent lookup. Metadata filters do not replace authorization. Pinecone documents [a namespace per tenant](https://docs.pinecone.io/guides/index-data/implement-multitenancy) as one isolation approach. Recheck current permissions and [propagate revocation or deletion](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) to chunks, parents and derived indexes. Check product version too, so an old fix does not win.

```diagram
{"title":"From error code to an answer with a source","layout":"flow","steps":[{"label":"Prepare linked chunks","detail":"Index small passages; retain parent and source references."},{"label":"Search within access scope","detail":"Combine dense and keyword candidates for ERR_404_NULL."},{"label":"Expand and rerank","detail":"Fetch allowed parent passages; score each with the question."},{"label":"Answer or abstain","detail":"Use supported context, cite the source, or say it is missing."}],"caption":"Scope applies throughout. A high relevance score does not establish that a source is correct."}
```

## 3. Rerank the candidates

The first search may return several plausible fixes. A [cross-encoder reranker](https://www.sbert.net/examples/cross_encoder/training/rerankers/README.html) processes the question and each candidate together, then scores their relevance.

For our question, a version-specific troubleshooting paragraph may outrank a general error-code glossary. Run this more expensive step on a shortlist, not the whole corpus.

**Relevance is not truth.** A high score does not verify the fix, and a reranker cannot recover a passage the first search missed.

## 4. Generate from the selected sources

Send the useful passages with source identifiers and versions. Ask the model to explain the supported fix, cite the passage and say when the evidence is insufficient. If the selected sources contain no fix for this version of `ERR_404_NULL`, the model should say so.

Validate citation IDs against the supplied sources, then check whether the cited passages support the claims. Citations alone do not make an answer correct. Documents can be stale, wrong or contain [prompt-injection attempts](https://genai.owasp.org/llmrisk/llm01-prompt-injection/). Retrieved text remains untrusted input.

Before shipping, test the correct fix, a similar code, a missing answer, an old version and another tenant's matching document. Check retrieval, citation support, abstention, access isolation and end-to-end latency separately.
