<div align="center">
<h1>Solo Composer</h1>
<p>Music notation software built with web technologies</p>

![CodeQL](https://github.com/aledgjones/solo-composer-ui/workflows/CodeQL/badge.svg)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=aledgjones_solo-composer-ui&metric=alert_status)](https://sonarcloud.io/dashboard?id=aledgjones_solo-composer-ui)

[Website](https://solo-composer.web.app)

</div>

| ⚠️ **WARNING**: This project is very much an experimental work in progress. Things will break, not exist, make no sense and crash! |
| ---------------------------------------------------------------------------------------------------------------------------------- |

## About

The aim of the project is:

- utilise web based technologies only.
- to produce scores that are beautiful, well balanced and clear.
- to produce convincing playback through the use of samples

This project is greatly inspired by the amazing work the people at Stienberg are doing on [Dorico](https://new.steinberg.net/dorico/)

## Technologies

- Parcel - _Bundling_
- React - _UI rendering as well as score rendering via SVGs_
- CSS - _Pure unadulterated Cascading Style Sheets_
- WebAudio - _Loading samples for playback_
- WebMidi - _External playback and note input_

## Notes

Taking inspiration from PDF.JS, the rendering layer is agnostic to the output method. Platform agnostic draw instructions are produced that can be plugged into any number of rendering layers. The idea is the same instructions could be used to produce the on-screen SVG rendered scores and PDF output.

## Development

After cloning the repository, start developing using the following commands in your terminal:

```
npm install
npm run dev
```

This will start up the parcel dev server on port 3000.

## License

[GNU General Public License v3.0](https://opensource.org/licenses/GPL-3.0)
