This is a cross-ecmascript implementation of some standard built-in methods,
written by me in 2024. I'm still currently working on it, so everything here
is a WIP, but I hope reading the code and comments in this repository offers
some insights into my coding process and my overall understanding of javascript
as a language and its "quirks". And yes, I am aware, the code here uses the old
ES "var" and has no arrow functions or "async" funcs because for this specific
project it needs to work in legacy environments just as well as modern ones.
For this library in particular it's written to be as widely supported as possible
and should work in places like GAS stable version, nintendo browser, IE, and in
actionscript somewhat. (I occasionally use an old version of flash for animating
and wanted to write some extensions for it).
