---
title: "Optimistic uploads: make the wait happen earlier"
description: "Start transferring a selected file while someone writes the caption. The speedup is simple; the lifecycle deserves more thought."
date: "2026-10-10"
category: "Web engineering"
tags: ["System design", "UX", "Uploads"]
cover: "/illustrations/articles/optimistic-uploads.png"
coverAlt: "A selected photo travels to storage while a pencil writes a caption."
source: "https://lnkd.in/p/dJMEXBC9"
takeaway: "Overlap file transfer with editing, but keep publication explicit. Temporary uploads need ownership checks, cancellation, and cleanup."
---
A person selects a photo, spends a few seconds writing a caption, and presses Publish. Only then does the progress bar start moving. The application had a useful head start available, but left the network idle.

That is the small observation behind my LinkedIn note on optimistic preloading. Begin the upload as soon as the file is selected, while the user is doing something else. By the time they publish, some or all of the transfer may already be finished.

The useful distinction is between **moving bytes** and **making a post public**. Moving bytes early can improve the experience. Publishing early would change what the button promises.

## Draw the two timelines

Consider an illustrative example: transferring a file takes eight seconds, writing the caption takes twelve, and committing the post takes one. A sequential implementation takes twenty-one seconds from selection to completion, including nine seconds after Publish. Overlapping transfer with caption editing takes thirteen seconds overall, with one second after Publish.

Those are example timings, not a benchmark. The relationship is what matters:

```text
Sequential: editing + upload + commit
Overlapped: max(editing, upload) + commit
Wait after Publish: max(0, upload - editing) + commit
```

If the person finishes editing in two seconds, six seconds of upload still remain. The optimization hides available work; it cannot make a slow connection disappear.

```diagram
{"title":"Upload early. Publish deliberately.","layout":"flow","steps":[{"label":"Select a file","detail":"Create a private upload session and begin transferring."},{"label":"Write the caption","detail":"Editing and transfer progress at the same time."},{"label":"Publish the post","detail":"Validate the completed asset and attach it to the post."}],"caption":"The upload may finish before editing does. The final publication boundary stays explicit."}
```

## Give the upload its own lifecycle

A robust implementation needs a temporary object rather than a public post with missing text. The server creates an upload session tied to the authenticated user and an opaque asset ID. It constrains the expected size and accepted content types. A short-lived upload URL, if used, belongs to that session.

The browser uploads into private staging storage. Once transfer finishes, the server verifies the stored object and performs whatever processing the product requires. Client-provided MIME types and filenames are hints, not proof of safe content.

When Publish arrives, the server checks that the asset belongs to this user, is ready, and has not expired. It then associates the asset with the new post. Repeating that request should return the same result when the client retries with the same idempotency key. A slow response must not create duplicate posts.

This separation also gives the interface honest states: uploading, processing, ready, failed, and published. A transfer at 100% is not necessarily a processed asset ready for use.

## Handle the boring paths first

The happy path is short. Most of the engineering lives around it.

| Event | Expected behavior |
| --- | --- |
| The user selects another file | Cancel the old request where possible; use a new upload session. |
| The user closes the editor | Leave the staged object private; expire abandoned sessions. |
| Transfer fails | Keep the caption and offer an upload retry. |
| Publish arrives during upload | Wait visibly for readiness, or disable submission with a clear reason. |
| The response gets lost | Retry the commit using the same idempotency key. |

Browser requests can be cancelled through [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController). Cancellation stops the client waiting and may interrupt transfer, but it does not prove the server has removed any bytes already received. Cleanup must also happen on the server.

A file replacement introduces another subtle race. Upload A might finish after Upload B has started. Associate callbacks with a session ID and ignore results that no longer belong to the active selection. Otherwise an old success response can accidentally mark the new file as ready.

> **Field note:** Give abandoned uploads a documented retention window and a scheduled cleanup process. “The user probably finished” is not a storage lifecycle policy.

## Measure the experience and its cost

Track time from Publish to completion separately from total upload duration. The first measures the waiting the user notices. The second tells you whether the network path changed at all.

Also record failure rate, abandoned bytes, retries, and how often uploads finish before Publish. If most people discard their selection, speculative transfer may consume considerable bandwidth for little benefit. Large videos, metered connections, and sensitive files deserve a more deliberate start point and a clear indication that transfer has begun.

Start with one frequent workflow, keep the server state machine small, and compare real completion times before expanding the pattern. For small attachments and a meaningful editing interval, moving work earlier can be more valuable than adding another service.

That same habit—examining where time is actually spent—comes up again in [latency before scaling](/blog/latency-before-scaling).
