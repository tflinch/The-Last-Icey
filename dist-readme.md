# The Last IceyPop

A Flappy Bird-inspired endless survival game. Dodge melting monsters, build a near-miss combo, and chase your best time.

## Running

Double-click `the-last-icey.exe`, or let the Aurora launcher spawn it. The game is fully self-contained — no installer, no external runtime files required beyond what Windows already ships.

## Controls

| Action  | Input                                |
| ------- | ------------------------------------ |
| Flap    | Space, W, S, ↑, ↓, click, or tap     |
| Pause   | P (or auto-pause on window blur)     |
| Resume  | Any flap input, or P                 |
| Restart | R (after game over)                  |
| Mute    | 🔊 / 🔇 button, top-left of window   |

## System requirements

- **Windows 10 22H2 or newer, or Windows 11.** The game runs in Microsoft Edge WebView2, which is preinstalled on those versions.
- **Older Windows 10 builds:** WebView2 Runtime is required. Tauri will prompt to download it on first launch. Manual install: <https://developer.microsoft.com/microsoft-edge/webview2/>.
- No GPU driver requirements. No .NET / VC++ redistributables. No network access.

## Save data

High score (best time, best dodge count) and mute preference are stored in the WebView2 user-data folder:

```
%LOCALAPPDATA%\com.tflinch.thelasticey\EBWebView\Default\Local Storage\
```

Delete that folder to reset progress. The game folder itself is read-only — relocating or copying the install folder will not affect saves.

## Telemetry

None. The game does not make network requests during play. Background music is bundled in the executable.

## Reporting issues

Source: <https://github.com/tflinch/The-Last-Icey>
