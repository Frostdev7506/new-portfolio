---
title: "Production RAG Explained"
seoTitle: "Production RAG Pipeline: Chunking, Hybrid Search and Reranking"
youtubeId: "sbBbtV1DqYQ"
description: "Build a production RAG pipeline: prepare linked chunks, combine semantic and keyword search, enforce access, rerank passages and generate cited answers."
date: "2026-10-19"
updated: "2026-10-20"
category: "Practical AI"
tags: ["RAG", "Retrieval", "LLMs", "AI Engineering"]
cover: "/illustrations/articles/production-rag-pipeline.png"
coverAlt: "A support question passes through scoped hybrid search and reranking to reach an answer linked to a troubleshooting source."
coverWidth: 1200
coverHeight: 630
takeaway: "A useful RAG answer starts with relevant, authorized, current sources. Retrieve broadly, rerank carefully and check whether the evidence supports the answer."
---
Your support bot gives a confident fix. You try it. It doesn't work because the bot used a runbook for the wrong product version.

Before swapping the model, check what it was given to read.

**Retrieval-augmented generation (RAG) retrieves source material and puts it into the model's context before it generates an answer.** It can give the model information from your documents without training that information into its weights. It doesn't make those documents correct, or guarantee that the model will use them correctly.

This is Day 8 of the AI Engineering Interview Series. The video above covers the pipeline; here we'll work through the decisions behind it.

Let's use one fictional support case: **“How do I fix `ERR_404_NULL` in version 2.4?”** Our `runbook.pdf` has the relevant section. Other documents mention similar errors, older versions and another customer's configuration.

```diagram
{"title":"From source documents to an answer with evidence","layout":"flow","steps":[{"label":"Prepare sources offline","detail":"Keep each searchable passage linked to its parent and source."},{"label":"Search within access scope","detail":"Combine semantic and keyword candidates for the right product version."},{"label":"Expand and rerank","detail":"Fetch allowed parent passages; score each with the question."},{"label":"Answer or abstain","detail":"Use supported context, cite the source, or explain what is missing."}],"caption":"Access checks apply throughout."}
```

## 1. Index small, retrieve enough context

Chunking decides which pieces of a document can be found independently. If a chunk contains only an error code, search may find it but miss the condition or fix beside it. If the chunk is an entire manual, unrelated content competes with the useful passage.

Start with the document's structure: headings, paragraphs, code blocks and tables. Keep a table header with its values and a warning with the procedure it qualifies. A token count alone won't tell you whether a passage makes sense.

### Keep the child linked to its parent

With **parent-document retrieval**, you search small child chunks, then fetch the larger passage behind a match. The child may mention `ERR_404_NULL`; its parent holds the explanation, version requirement and recovery steps. That parent can be a paragraph or section rather than the whole PDF. The [LlamaIndex recursive-retrieval example](https://developers.llamaindex.ai/python/framework/integrations/retrievers/recursive_retriever_nodes/) shows this pattern. Sentence-window retrieval is similar: return the matching sentence with its neighbours.

Store enough metadata to preserve that relationship:

| Metadata | Why it matters |
| --- | --- |
| Chunk ID and parent ID | Find the matching child, fetch its parent and remove duplicate parent results. |
| Source ID, revision and location | Trace an answer to a specific document version and section or page. |
| Tenant and permission metadata | Apply the same access rules to indexed chunks and fetched parents. |
| Product version and update time | Distinguish the applicable fix from an old or unrelated one. |

Use stable IDs so an update can replace the right records. When a source changes, update its children, parents and search indexes together. If old chunks remain searchable beside a new parent, the pipeline can assemble an answer from mismatched revisions.

Test chunk size, parent size and overlap on real questions. Overlap can preserve a boundary, but it also creates repeated text. Expanding every hit to a whole document can undo the benefit of precise retrieval.

## 2. Search by meaning and by the words that matter

An embedding model turns each passage into a vector, and a vector database finds nearby ones using a configured similarity measure. That lets “The app can't find my record” match a runbook section about failed lookups even when the wording differs.

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
Section: Lookup failures

ERR_404_NULL:
No active mapping exists.
Create an active mapping, then retry.
```

Keep the source content separate from application instructions. Tell the model to answer the question using the supplied evidence, cite source IDs beside supported claims and say when the evidence is insufficient. If two sources conflict, have it report the conflict rather than quietly choosing a convenient answer.

For this example, an answer might be: “In version 2.4, check for an active mapping before retrying the lookup [S1].” If no retrieved passage explains the fix, “I couldn't find a supported fix for version 2.4” is more useful than a confident guess.

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

| Test case | What it should catch |
| --- | --- |
| Correct code and version | The applicable recovery passage reaches the final context and supports the answer. |
| Similar-looking code | The system distinguishes `ERR_404_NULL` from a different error. |
| Different wording | Semantic retrieval finds the runbook without requiring the exact document sentence. |
| Missing answer | The assistant says what is missing or asks a useful question. |
| Old product version | A stale fix doesn't silently become current guidance. |
| Another tenant's matching document | No unauthorized content appears in candidates, parent fetches, cache responses or answers. |
| Revoked or deleted source | Old permissions and removed passages stop being usable through indexes and caches. |
| Instruction hidden in a document | Retrieved text cannot grant tool permissions or override application controls. |

Measure different parts of the path:

- **Retrieval recall at k:** the fraction of labelled relevant passages found in the first k results. Compare stages using the same source or parent IDs so a change in chunk size doesn't confuse the measurement.
- **Ranking quality:** whether useful evidence appears early enough to survive shortlist and context limits.
- **Answer correctness and citation support:** whether the response answers the question and its claims are supported by the passages cited.
- **Abstention:** whether the system declines unsupported answers without unnecessarily rejecting answerable questions.
- **Access isolation:** whether deliberately forbidden matches stay excluded, including after permission changes.
- **Latency and cost:** include embedding, both searches, parent fetches, reranking, generation, validation and retries. Record stage timings and end-to-end p50 and p95, the median and 95th-percentile request times, so averages don't hide slow requests.

Change one part at a time: chunking, the lexical signal, fusion settings or reranking. Run the same held-out questions after each change. This tells you which part helped instead of crediting a bigger model for a retrieval fix.

For our support bot, success means finding the allowed version 2.4 runbook, keeping its recovery steps intact and giving an answer those steps support. If that evidence is missing, the pipeline should make that visible.
