# Drover dog flasher

The web flasher for the C5 wardrive fleet's node firmware (Seeed XIAO ESP32-C5):
<https://handclasp-raven.github.io/drover-flasher/>

Everything in this repository is generated and pushed by a workflow in the firmware's
own repository. Do not edit it here: a change made here is overwritten by the next
publish.

| Path | What |
|---|---|
| `release/` | Firmware images of the latest tagged release, with `manifest.json` and `info.json` (version, commit, sizes, SHA-256) |
| `main/` | The same for the newest commit on main; untested |
| `vendor/esp-web-tools/` | [ESP Web Tools](https://github.com/esphome/esp-web-tools), unmodified, Apache-2.0 (`LICENSE` beside it) |
| `fonts/` | Chakra Petch and JetBrains Mono, both under the SIL Open Font License 1.1 (texts beside them) |

The firmware only listens: it never transmits an 802.11 frame.
