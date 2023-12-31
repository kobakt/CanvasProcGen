# A Generative Art Tool
This is a generative art tool made using JavaScript and HTML Canvas. Users can create unique and detailed art-pieces with a highly configurable HTML settings menu.

## Dynamic Generation
Art is dynamically created in-browser with the use of Javascript. The art is generated recursively as the canvas is split up into smaller and smaller pieces. 
As the canvas is divided into smaller sections, The color of different sections will gradually shift. 
This gradual shifting maintains color cohesion across both the canvas and smaller sections.

## User Customization
The tool provides a comprehensive options menu that is dynamically generated when the page load.
This design enables options to be added, changed, or removed without having to change the root html file.

## Extensibility
The process of adding new shapes is designed to be extensible and flexible. 
A new shape only requires three simple functions:
- `isAvailable`: Determines whether the shape can be drawn. 
- `weight`: Determines how the shape should be weighted.
- `drawShape`: Draws the shape on the canvas.

## Performance
The tool is highly performant. Art generates instantly on dektop and within a second on mobile. 

## Documentation
Includes JSDoc type documentation. This integrates with Jvascript LSP support.

## Potential Features
The options menu can be improved for clarity and user experience by:
- Adding a reset button
- Implementing a close and open button for the sidebar
- Adding custom mobile support.

Additional options and shapes could be added to further increase customization and intricacy of the art. For example:
- Color change could be computed in HSL, HSV, or OKLAB color-space for smoother transitions.
- A seeded random generator could replace the unseeded default JavaScript generator for deterministic generation.

ALthough not currently necessary, code could be put through a minifier to improve loading times.
