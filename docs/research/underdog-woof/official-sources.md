# Underdog Woof: sources for the hands-on article

Checked **2026-11-08**. Official revision: `be702960539777fc3f698e54335276a8391b00f9`, also recorded by the local setup in `/Users/neeraj/neeraj/projects/underdog-woof/DOWNLOAD-SOURCE.json`. Links below pin the reviewed source; live `main` may change. This research subtask did not change the runtime, article, UI, or recordings.

## Verified product facts

| Topic | Supported wording | Primary source |
| --- | --- | --- |
| What it does | Local English text-to-speech on CPU, with Juno and Mira built in; Juno is the default. No GPU, server, or API key is required for inference. | [Model card][card], [public API][api] |
| Two-voice size | The downloaded weights file is **40,595,426 bytes**, advertised as **40.6 MB**, containing both voices. This is the weights download, not the whole checkout or runtime memory. | [File metadata][files], [model card][card] |
| One-voice size | The publisher separately describes a **31.7 MB one-voice model**, used in its browser demo. This repository is the two-voice variant. We did not download or measure the one-voice model. | [Model card][card] |
| Dependencies | The inference code uses NumPy and Python's standard library. The requirements file declares `numpy>=1.24`. Hugging Face's `hf` CLI is download tooling, separate from the inference dependency. | [Requirements][requirements], [runtime][runtime], [download example][card] |
| Text handling | Write ordinary English, including digits and dates. The default normalizer rewrites numbers, dates, times, money, codes, and symbols into spoken forms and respells difficult names from its lexicon. Python can disable it using `Woof(normalize=False)`. This is rule-based preprocessing, not a guarantee that every sentence is pronounced correctly. | [Model card][card], [public API][api] |
| Long text | Text is split into sentences; sentences over 120 characters can be split at clause punctuation. Suspect takes can be regenerated up to three additional times. | [Model card][card], [public API][api] |
| Output | The Python API returns float32 mono audio at **24 kHz**; `save()` writes **16-bit PCM WAV**. Renaming the output extension does not convert its format. | [Public API][api], [WAV writer][runtime] |
| Language / cloning limits | English is the documented language. The released public API and CLI select stored Juno/Mira voices and expose no reference-audio input, cloning workflow, or language selector. Other-language quality, accent labels, and voice gender are not specified in the reviewed documentation. | [Model card][card], [public API][api], [CLI][cli] |

## Documented usage

The publisher's download/run pattern is:

```bash
pip install numpy
hf download ConwayResearch/Underdog-Woof --local-dir underdog-woof
cd underdog-woof
python -m underdog_woof "Your order ships on March 3rd." -o hello.wav
python -m underdog_woof "Your order ships on March 3rd." --voice mira -o mira.wav
```

Actual CLI options: required positional `text`; `-o` / `--out` (default `woof.wav`); `--voice {juno,mira}` (default `juno`); `--seed` integer (default `0`); `--temp` float (default `0.5`); standard `-h` / `--help`. Temperature controls sampling, not speech speed. No CLI flag disables normalization. [Source: CLI][cli]

## Publisher performance claims versus our observation

The publisher reports **13.8× real time for Juno** and **7.2× for Mira**, measured on one Apple M5 Max CPU thread as the median of three rounds over 200 everyday sentences. Its separate one-voice **18×** claim uses a different PyTorch runtime at 16 steps. These are **author-reported results**, not benchmarks we reproduced. [Source: model card][card]

The initial setup observed the following short local test of the same text, one run per voice:

| Voice | Generated audio | Reported synthesis time | Audio/time ratio |
| --- | --- | --- | --- |
| Juno | 8.88 s | 1.53 s | About 5.8× real time |
| Mira | 15.96 s | 4.48 s | About 3.6× real time |

The input was: "Hello Neeraj. This is Underdog Woof running locally on your Mac. Your order arrives on March 3rd at 5:30 p.m."

Evidence retained outside the portfolio: `/Users/neeraj/neeraj/projects/underdog-woof/VERIFICATION.json` records the duration/format of `try-juno.wav` and `try-mira.wav`; `TRY-IT.md` records the input and observed CLI times. Original command output is in the setup chat, without a separate command-log file. The ratios above are calculated from rounded observations. The CLI starts its timer **after model construction** and stops **before saving the WAV**, so these are not full command startup times. [Timer implementation][cli]

These samples establish successful generation, not repeatable throughput, word-error rate, naturalness, or a universal voice-speed comparison. The newer user recordings `juno-truth.wav` (25.28 s) and `mira-truth.wav` (31.84 s) are separate listening/transcription evidence; do not attach the initial short-test timings to them. The article-authoring session reports matching local Whisper `small.en` transcripts for both; those transcripts do not establish subjective voice quality.

## Publication and license wording

The overall release uses **Underdog Non-Commercial License 1.0**. Non-commercial audio may be published with **Underdog Woof** or **underdog.ai** in the title or description where posted. Apps/products must visibly show **Voice by Underdog Woof** linked to underdog.ai. Local use of the model or its audio for monetized/sponsored content, advertising, a company's work, internal business operations, or other direct/indirect revenue support requires a separate written commercial license from **license@conway.tech**. Owning an output does not remove these usage conditions. [License, sections 1–5][license]

The license has a distinct exception for free use through publisher-operated Underdog products, including commercial use; that exception does not cover extracting and running the model locally. It also allows companies up to 30 days of internal purchase-evaluation testing without production/customer use. No commercial pricing was found in the reviewed files. [License, section 2][license]

Do not call the release unrestricted open source or commercially free. The license also restricts training other speech/audio models on its model/outputs and nonconsensual voice imitation. Redistribution requires unchanged `LICENSE` and `NOTICE` plus a statement of changes. The decoder/training-data attributions in `NOTICE` are distinct from the overall Woof license. [License, sections 4–7][license], [NOTICE][notice]

[card]: https://huggingface.co/ConwayResearch/Underdog-Woof/blob/be702960539777fc3f698e54335276a8391b00f9/README.md
[files]: https://huggingface.co/api/models/ConwayResearch/Underdog-Woof/tree/be702960539777fc3f698e54335276a8391b00f9?recursive=true
[requirements]: https://huggingface.co/ConwayResearch/Underdog-Woof/blob/be702960539777fc3f698e54335276a8391b00f9/requirements.txt
[api]: https://huggingface.co/ConwayResearch/Underdog-Woof/blob/be702960539777fc3f698e54335276a8391b00f9/underdog_woof/__init__.py
[runtime]: https://huggingface.co/ConwayResearch/Underdog-Woof/blob/be702960539777fc3f698e54335276a8391b00f9/underdog_woof/runtime.py
[cli]: https://huggingface.co/ConwayResearch/Underdog-Woof/blob/be702960539777fc3f698e54335276a8391b00f9/underdog_woof/__main__.py
[license]: https://huggingface.co/ConwayResearch/Underdog-Woof/blob/be702960539777fc3f698e54335276a8391b00f9/LICENSE
[notice]: https://huggingface.co/ConwayResearch/Underdog-Woof/blob/be702960539777fc3f698e54335276a8391b00f9/NOTICE
