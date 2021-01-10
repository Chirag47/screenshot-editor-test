

[![NPM](https://img.shields.io/npm/v/lambdatest-screenshot-editor.svg)](https://www.npmjs.com/package/lambdatest-screenshot-editor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save screenshot-editor-test
```

## Usage

```jsx
import React, { Component } from "react";

import Editor from "screenshot-editor-test";

class Example extends Component {
  render() {
    return (
      <Editor
        imgSrc="https://i.imgur.com/aZO5Kol.jpeg"
        onDrawingEnd={this.onDrawingEnd}
        lineWidth={5}
      />
    );
  }
}
```


### Properties
| Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| `imgSrc` | `string` | &nbsp; | A string representing the source to screenshot . ( `Required` ) |
| `onDrawingEnd` | `function` |  &nbsp; | A mouseup listner on the image returns the updated image on every mouseup.( `Required` )|
| `lineWidth` | `Number` | `5` | A Number representing the line width of drawing |
| `configs` | `Array` | `[]` | An array representing the `editor controls`. and it must follow the `###config structure`|

### configs structure
 | Name | Type | Default | Description |
|:-----|:-----|:-----|:-----|
| `role` | `string` | &nbsp; | A string representing the role, should be from the list of [`rect`,`line`,`circle`,`pencil`,`text`,`undo`,`eraser`,`color`] . ( `Required` ) |
| `icon` | `image` |  &nbsp; | Imported icon, it will be rendered as an image in lib .( `Required` )|
| `colors` | `array` |  [] | An array for adding extra color in the color list.( `Required` )|


### role 

| role | operation |  
|:-----|:-----|
| `rect` | It will add a function for drawing `rectangle` | 
| `line` | It will add a function for drawing `line` | 
| `circle` | It will add a function for drawing `circle` | 
| `pencil` | It will add a function for drawing `pencil` | 
| `color` | It will add a function for selecting the `color` | 
| `text` | It will add a function for adding `text` | 
| `undo` | It will add a function for  `undo` | 
| `eraser` | It will add a function for  `eraser` | 

### Example configs prop
```jsx
const configData = [
  {
    icon: undoIcon,
    role: "undo"
  },
  {
    role: "rect",
    icon: squareIcon
  },
  {
    role: "line",
    icon: moveIcon
  },
  {
    role: "circle",
    icon: elipseIcon
  },
  {
    role: "color",
    icon: bucketIcon,
    extraColors: ["#ff0000", "#ff3333"]
  },
  {
    role: "pencil",
    icon: pencilIcon
  },
  {
    icon: textIcon,
    role: "text"
  },
  {
    icon: eraserIcon,
    role: "eraser"
  }
]; 
```
### with configs props

```jsx
import React from "react";

import Editor from "screenshot-editor-test";

const Example = () =>  {

    return (
      <Editor
        imgSrc="https://i.imgur.com/aZO5Kol.jpeg"
        onDrawingEnd={this.onDrawingEnd}
        lineWidth={5}
        configs={configData}
      />
    );
}
```

## License

MIT © [errorr404](https://github.com/errorr404)
