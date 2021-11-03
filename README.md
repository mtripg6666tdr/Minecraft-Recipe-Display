# Minecraft Recipe Display
Easily create a webpage that will display all your recipes!

## Table of Contents
- [Gettings started](#getting-started) 
- [Debugging](#debugging)
- [Docs](docs/README.md)

## Getting Started
1. First you must create a JSON file that will contain all the recipes. [read more](docs/syntax.md)
1. Now you need to upload the JSON file and all its resrouces to GitHub or your website of choise.
1. Get the JSON url from the place that you uploaded the JSON to. Make sure it is just the raw data/file. The url will usually end in `.json`
1. Finally go to the [main page](index.html). at the end of the url add `?json=<JSON URL>`, but replace `<JSON URL>` with the url from the step above. Example full url: `http://127.0.0.1:5555/index.html?json=./examples/recipes.json`
1. Refresh the tab with the new url to see your loaded recipes.

## Debugging
If there is any syntax errors with the JSON use develiper tools, press `f12`, and nagivate to the "Console" tab. If there is any issues they will be in red or yellow.