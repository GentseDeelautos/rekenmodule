[![Actions Status](https://github.com/GentseDeelautos/rekenmodule/workflows/Node.js%20CI/badge.svg)](https://github.com/GentseDeelautos/rekenmodule/actions)
# Gentse Deelautos Rekenmodule

aspirant PWA om kosten van Gentse deelauto's in te schatten.

Om te gebruiken: ga naar https://gentsedeelautos.github.io/rekenmodule/

## Development

The project is directly hosted on github, so you don't have to compile anything
to start developing: simply open `index.html` in your browser. (You might need to allow loading of local files.)

They can be run in the terminal using node 14 by issuing the `npm test` command,
and that is also the way how they are ran in continuous integration.

Tests can be also be started manually by opening 'SpecRunner.html' in your browser,
but you have to disable CORS in your browser to run them.

### Fingerprinting

As this project doesn't have a building step, we need to change the name of the 
javascript modules manually each time something is changed about them to get
around the browser caching versions of these modules.
