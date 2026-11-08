# Woof article evidence

Article: `content/posts/underdog-woof-review.md`.

The latest voice-specific files found in the user's local Woof folder were used as the paired recordings:

| Voice | Original file | Original duration | Separate upload filename |
| --- | --- | --- | --- |
| Juno | `/Users/neeraj/neeraj/projects/underdog-woof/juno-truth.wav` | 25.28 s | `juno-underdog-woof.mp3` |
| Mira | `/Users/neeraj/neeraj/projects/underdog-woof/mira-truth.wav` | 31.84 s | `mira-underdog-woof.mp3` |

MP3 copies use FFmpeg/libmp3lame at 128 kbps. No trimming, loudness adjustment, music, or other processing was applied. Original WAVs remain in the separate Woof folder. Both transcripts were generated locally with the already-installed `whisper-cli` and cached `ggml-small.en.bin`; their words agree. The article supplies one shared transcript and preserves the recordings' wording.

The original setup run used `try-juno.wav` and `try-mira.wav`, a different, shorter greeting. The timing table refers only to those initial CLI observations. It does not claim measured synthesis time for the newer recordings. Official references and timing provenance are in `official-sources.md`.

Artwork uses RMS waveform envelopes from the two originals. The editable SVG and 1200 × 630 PNG live at `public/illustrations/articles/underdog-woof.*`.

Audio is prepared for separate hosting via Netlify Drop. The upload folder and ZIP are outside Git at `/Users/neeraj/neeraj/projects/underdog-woof/blog-audio-host` and `blog-audio-host.zip`. No WAV, MP3, or upload ZIP is included in the article branch. The user requested remote hosting to avoid media bloat in the repository. Uploaded with the official Netlify CLI and claimed into Frostdev7506’s existing Netlify team on 2026-11-08. Public host: https://unique-mermaid-13d924.netlify.app. Both MP3s returned HTTP 200 with audio/mpeg, matched their local SHA-256 hashes, and supported HTTP 206 byte-range requests.
