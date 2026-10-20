---
title: Production RAG Explained
seoTitle: 'Production RAG Pipeline: Chunking, Hybrid Search and Reranking'
youtubeId: sbBbtV1DqYQ
description: >-
  Build a production RAG pipeline: prepare linked chunks, combine semantic and
  keyword search, enforce access, rerank passages and generate cited answers.
date: '2026-10-19'
updated: '2026-10-20'
category: Practical AI
tags:
  - RAG
  - Retrieval
  - LLMs
  - AI Engineering
cover: /illustrations/articles/production-rag-pipeline.png
coverAlt: >-
  A support question passes through scoped hybrid search and reranking to reach
  an answer linked to a troubleshooting source.
coverWidth: 1200
coverHeight: 630
takeaway: >-
  A useful RAG answer starts with relevant, authorized, current sources.
  Retrieve broadly, rerank carefully and check whether the evidence supports the
  answer.
draft: false
---
When an AI agent hallucinates on internal company data, teams usually swap models or consider fine-tuning.The problem though is almost always noisy retrieval and poor context formatting. Instead, build a production-ready RAG pipeline.Retrieval-Augmented Generation (RAG) supplies external context to an LLM at inference time, avoiding expensive fine-tuning. But while it expands the model's working memory, it doesn't clean messy source data or eliminate comprehension errors on its own.

This is Day 8 of the AI Engineering Interview Series. While the video above provides a high-level overview, here we’ll break down the architectural decisions behind making a RAG pipeline production-ready.

Let's anchor this with a concrete support query:

**“How do I fix ERR_404_NULL in version 2.4?”**

The exact fix lives in our `runbook.pdf`. However, our knowledge base also contains similar error codes, deprecated v2.1 documentation, and customer-specific configs. Here is how to ensure the model retrieves the exact answer without hallucinating.

```diagram
{"title":"From source documents to an answer with evidence","layout":"flow","steps":[{"label":"Prepare sources offline","detail":"Keep each searchable passage linked to its parent and source."},{"label":"Search within access scope","detail":"Combine semantic and keyword candidates for the right product version."},{"label":"Expand and rerank","detail":"Fetch allowed parent passages; score each with the question."},{"label":"Answer or abstain","detail":"Use supported context, cite the source, or explain what is missing."}],"caption":"Access checks apply throughout."}
```

## 1. Index small, retrieve enough context

Chunking determines which document fragments can be searched independently. A setting like “500 tokens with 50-token overlap” is easy to configure, but it doesn't tell you whether a fragment contains enough information to answer a question.

There are two competing needs: **a precise search match** and **enough context to explain the answer**.

- **Too small:** The chunk mentions the error code, but the fix, prerequisites or warning sit in another chunk.
- **Too large:** The fix shares a chunk with unrelated procedures. That can make the relevant passage harder to retrieve and adds noise to the model's context.

Let's follow the same `ERR_404_NULL` question through flat retrieval and parent-child retrieval.

### The runbook we're searching

For this example, imagine `runbook.pdf` contains the following section. The error and recovery procedure are fictional; they let us compare what each pipeline actually passes to the model.

> **Section 4.2: Handling ERR_404_NULL**
>
> **Prerequisites:** Docker v24+ and Cluster Admin permissions.
>
> In version 2.4, this error occurs when the connection pool drops before the handshake finishes.
>
> **Fix:** Set `POOL_TIMEOUT=30` in `/etc/app.conf`, then restart the app-worker service with `systemctl restart app-worker`.
>
> **Warning:** Do not execute this while active sync jobs are running.

The user asks: **“How do I fix ERR_404_NULL in version 2.4?”** An answer needs the procedure and its conditions, not just a passage that repeats the error code.

### A. Flat retrieval: the matching chunk can miss the fix

In a flat setup, the text you index is also the text you send to the model. Suppose fixed-size splitting cuts the section into three independently searchable chunks:

Now suppose search returns chunk 1, but chunks 2 and 3 don't make the final context.

```diagram
{
  "title": "Flat retrieval: the fix is in a different chunk",
  "layout": "comparison",
  "input": {
    "label": "Source: runbook section 4.2",
    "detail": "One section is split into three independently searchable chunks."
  },
  "steps": [
    {
      "label": "Chunk 1: kept",
      "detail": "Error heading and prerequisites. This is the only chunk sent to the model."
    },
    {
      "label": "Chunk 2: omitted",
      "detail": "The version 2.4 condition and connection-pool cause."
    },
    {
      "label": "Chunk 3: omitted",
      "detail": "The configuration change, restart command and active-sync warning."
    }
  ],
  "caption": "In this example, retrieval finds the error heading but leaves the procedure out of the prompt."
}
```

The prompt now contains:

```text
Context [S1]:
Section 4.2: Handling ERR_404_NULL.
Prerequisites: Docker v24+ and Cluster Admin permissions.

Question: How do I fix ERR_404_NULL in version 2.4?
```

The model has no source-backed fix to give. It should say the evidence is incomplete; if it invents a generic recovery command, that's an unsupported answer.

Flat retrieval can work when chunks are self-contained or when several retrieved chunks supply the missing context. The problem here is the split plus the context selection. Mentioning an exact error code doesn't guarantee the highest vector-similarity score, either; we'll add a lexical signal in section 2.

Increasing chunk size can keep the procedure together, but it also brings more text into search and generation. Bigger chunks aren't automatically worse, and smaller ones aren't automatically more accurate. Test the tradeoff on questions that require the surrounding conditions.

### B. Parent-child retrieval: search the fragment, fetch the section

**Parent-child retrieval separates the search unit from the answer context.** A short child helps locate the relevant passage. Its parent supplies the larger, coherent section behind that match. The [LlamaIndex recursive-retrieval example](https://developers.llamaindex.ai/python/framework/integrations/retrievers/recursive_retriever_nodes/) shows how references connect smaller indexed nodes to larger nodes.

- **Children:** Small searchable fragments, each linked to its parent. One child can describe the error and version; another can describe the fix.
- **Parent:** The bounded section containing the prerequisites, cause, procedure and warning.
- **Storage:** Keep child text, embeddings and metadata available to the vector and lexical indexes, and parent text in a document store. Redis, MongoDB or SQLite are possible choices; a single system can also hold both if it supports the required lookups.

For a starting experiment, children might contain 30–60 words and parents 150–500 words. Those are illustrative ranges, not requirements. Our short runbook section can stay smaller. Preserve a coherent procedure and measure retrieval quality instead of padding text to reach a number.

The error child might look like this:

```json
{
  "chunk_id": "child_runbook_402_error",
  "parent_id": "parent_runbook_sec_402",
  "source_id": "runbook.pdf",
  "source_revision": "rev-17",
  "product_version": "2.4"
}
```

The fix child has its own `chunk_id` but shares that `parent_id` and revision. Tenant and document permissions must travel with these records too.

At query time:

1. **Retrieve a child.** Search finds an allowed fragment relevant to the error and version.
2. **Read its parent reference.** Use `parent_id` and `source_revision` to identify the matching section.
3. **Fetch the allowed parent.** Recheck access and revision, then retrieve section 4.2. If multiple children point to it, include the parent once.
4. **Assemble the context.** Use that bounded parent in place of the isolated child. In the pipeline below, rerank the expanded passages before selecting the final context.

```diagram
{
  "title": "Parent-child retrieval: two children, one section",
  "layout": "comparison",
  "steps": [
    {
      "label": "Matched child",
      "detail": "ERR_404_NULL in version 2.4. Links to section 4.2, rev-17."
    },
    {
      "label": "Sibling child",
      "detail": "POOL_TIMEOUT=30 and app-worker restart. Links to section 4.2, rev-17."
    }
  ],
  "output": {
    "label": "Shared parent: section 4.2, rev-17",
    "detail": "Fetch the prerequisites, cause, complete fix and active-sync warning together."
  },
  "caption": "Search the children. Follow parent_id from a matching child to fetch its allowed parent; include that section once."
}
```

The question stays the same. The context now includes the complete runbook section above, so an answer can preserve the conditions around the fix:

> “For version 2.4, first confirm Docker v24+, Cluster Admin permissions and that no sync jobs are active. Set `POOL_TIMEOUT=30` in `/etc/app.conf`, then run `systemctl restart app-worker` [S1].”

Parent expansion makes the missing evidence available. It doesn't guarantee the answer will use it correctly; citation and claim checks still matter.

### A related option: sentence-window retrieval

**Sentence-window retrieval** indexes individual sentences and expands a match to nearby sentences before generation. For example, a window might include three sentences before and three after the match. The [LlamaIndex sentence-window example](https://developers.llamaindex.ai/python/examples/node_postprocessor/metadatareplacementdemo/) demonstrates replacing a retrieved sentence with its stored surrounding context.

This is useful for continuous prose, such as transcripts or reports, where headings don't reliably identify complete answer sections. Parent-child retrieval is a useful fit for structured runbooks, manuals and API documentation. Test both against the shape of your documents.

A sentence window can still cross a section boundary or miss a distant warning. Keep it within the permitted document revision and cap its size.

### Production rules that keep the relationship intact

| Rule | What to do | What it prevents |
| --- | --- | --- |
| Preserve semantic boundaries | Split around headings, paragraphs, code blocks and tables. Keep warnings with their procedures and table headers with their rows. | A matching fragment loses the conditions needed to interpret it. |
| Keep stable IDs and explicit revisions | Store child, parent and source IDs, source revision, location, product version and access metadata. Resolve the parent from the same revision as the child. | An old search hit is paired with a new procedure or the wrong customer's section. |
| Publish a complete revision | Stage the new parents and child records, verify their links, then switch the active revision. Use a transaction where the storage supports one; separate databases don't necessarily share a transaction. Propagate updates and deletions to both indexes and caches. | Missing parents, stale children and answers assembled from mixed revisions. |
| Bound the expansion | Fetch the relevant parent section, deduplicate it and enforce per-passage and total context budgets. | Every small hit expands into an entire PDF and crowds out useful evidence. |

Tune child size, parent size and overlap together. Overlap can preserve a boundary, but it can also repeat text. The test is whether the allowed context contains the complete answer, including the version, prerequisites and warning.


## 2. Search by meaning and by the words that matter

An embedding model turns each passage into a vector, and a vector database finds nearby ones using a configured similarity measure. That lets “The worker keeps losing its connection” match a runbook section about a connection pool dropping during a handshake, even when the wording differs.

Identifiers need extra care. A passage about `ERR_404_NULL` and one about `ERR_404_AUTH` can look similar while requiring different fixes. Dense retrieval can find exact codes, but it may not rank the right one first.

### Combine the rankings

**Hybrid search** combines semantic retrieval with a lexical signal such as BM25. The semantic branch finds related meaning; the keyword branch helps distinctive names, codes and IDs surface. [Pinecone documents several hybrid-search approaches](https://docs.pinecone.io/guides/search/hybrid-search); the storage and fusion details depend on the system.

BM25 scores matching tokens, not guaranteed literal-string equality. Check how your analyzer handles underscores, hyphens and casing. If an identifier must match exactly, store a separate exact-match field and query it explicitly; [Elasticsearch's term-query documentation](https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-term-query) explains why analyzed text needs care.

Don't blindly add a cosine-similarity score to a BM25 score. Their ranges and meanings differ. One option is **reciprocal rank fusion (RRF)**, which combines rank positions rather than raw scores. A passage appearing near the top of both lists gets support from both. [Elasticsearch's RRF reference](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion) gives the calculation and ranking-window controls.

For each list containing a passage, add `1 / (c + rank)` to its fusion score, where rank starts at 1 and `c` is a fixed ranking constant. A missing passage contributes zero. Changing the candidate window changes which passages can compete.

Keep shared record IDs across both branches, merge duplicate hits and rerank a smaller set of unique parents. For an initial experiment, you might take 20 candidates from each branch and rerank 10 parents; tune those counts against recall, latency and cost.

### Apply access scope before retrieval

The question text must not decide which customer's documents are searchable. Derive the tenant and permissions from authenticated identity, then apply that scope to both search branches and every parent fetch.

[Pinecone's namespace-per-tenant pattern](https://docs.pinecone.io/guides/index-data/implement-multitenancy) is one isolation approach. Within a tenant, document permissions may still differ. The application must select an allowed namespace and enforce any finer access rules.

Filtering only after a global top-k search has two problems: protected material has already reached part of your application, and unauthorized hits may have pushed useful allowed documents out of the shortlist.

For our question, another customer's matching runbook stays outside the search scope. Check version compatibility too: a guide covering 2.x may apply to 2.4, while a 2.1-only fix may not. If the user's version is unknown, ask for it rather than inventing one.

Apply the same access rules to caches. Recheck permissions when serving a cached answer or parent passage, and invalidate entries after permission or source changes. [OWASP's RAG security guidance](https://cheatsheetseries.owasp.org/cheatsheets/RAG_Security_Cheat_Sheet.html) covers access metadata, document lifecycle and deletion propagation. A filter field alone is not authorization.

## 3. Rerank the passages against the actual question

The first retrieval stage aims to find plausible candidates quickly. It may return the correct runbook, a general glossary and a troubleshooting section for a similar error.

A **bi-encoder** embeds the question and passages independently, then compares their vectors. Document embeddings can be prepared ahead of time, which makes this useful for searching a large collection.

A **cross-encoder** processes the question and one candidate together. It can examine their wording jointly and assign a relevance score. Repeat that for the shortlist, then reorder it. The [Sentence Transformers retrieve-and-rerank guide](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html) explains this two-stage setup.

For `ERR_404_NULL`, the version 2.4 recovery section should beat a glossary that merely repeats the code. Keep the source IDs attached while ranking so the winning text still points to the right document.

Parent expansion and reranking have to line up. If you score a short child and then send a much larger parent, the reranker never judged most of what the model will read. Here, fetch and deduplicate the allowed parents first, then rerank those bounded passages. If you rank children first, check the expanded context before generation too.

Watch the reranker's input limit. [Sentence Transformers documents truncation beyond the cross-encoder's maximum length](https://sbert.net/docs/package_reference/cross_encoder/model.html). A long parent may lose the useful sentence before scoring. Shorter sections or a passage-selection step may work better than increasing the candidate count.

**A relevance score is not a truth score.** It isn't a portable probability that the answer is correct. A high-scoring passage can be stale or wrong, and a reranker cannot recover a document that retrieval never returned. Tune any rejection threshold on your own labelled examples.

## 4. Give the model evidence it can actually use

Now select the passages that fit the model's context budget. Leave space for the instructions, question, conversation history and generated answer. Count tokens after formatting the complete request, not just the raw document text.

Remove duplicate or heavily overlapping passages. Five copies of the same paragraph take space without adding evidence. Keep any conditions, warnings and version details needed to interpret the fix.

A source block can look like this; the content is illustrative:

```text
Source: S1
Document: runbook.pdf
Revision: rev-17
Product version: 2.4
Section: 4.2 — Handling ERR_404_NULL

Prerequisites: Docker v24+ and Cluster Admin permissions.
Cause: The connection pool drops before the handshake finishes.
Fix: Set POOL_TIMEOUT=30 in /etc/app.conf, then run
systemctl restart app-worker.
Warning: Do not execute while active sync jobs are running.
```

Keep the source content separate from application instructions. Tell the model to answer the question using the supplied evidence, cite source IDs beside supported claims and say when the evidence is insufficient. If two sources conflict, have it report the conflict rather than quietly choosing a convenient answer.

For this example, a citation should cover both the recovery procedure and its conditions: “Once the prerequisites are met and no sync jobs are active, set `POOL_TIMEOUT=30` and restart `app-worker` \[S1].” If no retrieved passage explains the fix, “I couldn't find a supported fix for version 2.4” is more useful than a confident guess.

### Check the citation, then check the claim

First validate that `S1` is one of the sources supplied for this request. Resolve its link from your own source records rather than accepting a URL invented by the model.

Then check whether the cited passage supports the claim. A valid source ID attached to an unsupported sentence is still a bad answer. Automated checks or a second model can help find mistakes, but they can miss them; evaluate those checks too.

Retrieved documents remain untrusted input. A PDF can contain text that tries to change the assistant's instructions or trigger a tool call. [OWASP's prompt-injection guidance](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) explains why retrieval and fine-tuning do not eliminate that risk. A source-only prompt is useful guidance, not an enforced security boundary. Tool access and consequential actions still need application-side controls.

## Put the stages together

Here is the full request path in pseudocode:

```text
scope = authorize(authenticated_user)
version = resolve_version(question)

semantic = dense_search(
    question, scope, version
)
lexical = keyword_search(
    question, scope, version
)
hits = fuse_rankings(semantic, lexical)

parents = fetch_allowed_parents(
    hits, scope, version
)
parents = deduplicate(parents)
ranked = rerank(question, parents)
sources = fit_context_budget(ranked)

if missing_evidence(sources, question):
    return ask_or_abstain()

answer = generate(question, sources)
return validate_or_abstain(
    answer, sources
)
```

The evidence check needs a policy too. A missing compatible source, conflicting passages or an unsupported recovery step can be reasons to ask for more information or abstain. A rerank cutoff alone can't establish that the evidence is sufficient.

Define what happens when retrieval returns nothing, times out or loses the reranker. Never drop permission filters or fall back to an unrestricted answer. Retry, ask a clarifying question or return a temporary failure, and test that path.

## Test the retrieval and the answer separately

If the answer is wrong, first ask whether the right passage ever reached the model. Changing the prompt won't repair a missing source, and improving retrieval won't fix every unsupported claim made after it.

Build a small labelled set from real support questions, with the expected source and acceptable answer or abstention. Keep tuning examples separate from your final evaluation set. Microsoft's guidance separates [retrieval evaluation](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-information-retrieval) from [end-to-end answer evaluation](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-llm-evaluation-phase), which helps locate the failure.

| Test case                          | What it should catch                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Correct code and version           | The applicable recovery passage reaches the final context and supports the answer.         |
| Similar-looking code               | The system distinguishes `ERR_404_NULL` from a different error.                            |
| Different wording                  | Semantic retrieval finds the runbook without requiring the exact document sentence.        |
| Missing answer                     | The assistant says what is missing or asks a useful question.                              |
| Old product version                | A stale fix doesn't silently become current guidance.                                      |
| Another tenant's matching document | No unauthorized content appears in candidates, parent fetches, cache responses or answers. |
| Revoked or deleted source          | Old permissions and removed passages stop being usable through indexes and caches.         |
| Instruction hidden in a document   | Retrieved text cannot grant tool permissions or override application controls.             |

Measure different parts of the path:

- **Retrieval recall at k:** the fraction of labelled relevant passages found in the first k results. Compare stages using the same source or parent IDs so a change in chunk size doesn't confuse the measurement.
- **Ranking quality:** whether useful evidence appears early enough to survive shortlist and context limits.
- **Answer correctness and citation support:** whether the response answers the question and its claims are supported by the passages cited.
- **Abstention:** whether the system declines unsupported answers without unnecessarily rejecting answerable questions.
- **Access isolation:** whether deliberately forbidden matches stay excluded, including after permission changes.
- **Latency and cost:** include embedding, both searches, parent fetches, reranking, generation, validation and retries. Record stage timings and end-to-end p50 and p95, the median and 95th-percentile request times, so averages don't hide slow requests.

Change one part at a time: chunking, the lexical signal, fusion settings or reranking. Run the same held-out questions after each change. This tells you which part helped instead of crediting a bigger model for a retrieval fix.

For our support bot, success means finding the allowed version 2.4 runbook, keeping its recovery steps intact and giving an answer those steps support. If that evidence is missing, the pipeline should make that visible.
