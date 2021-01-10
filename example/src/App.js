import React, { Component } from "react";

import ExampleComponent from "lambdatest-screenshot-editor";
const bucketIcon = require("./assets/images/bucket-icon.svg");
const elipseIcon = require("./assets/images/elipse-icon.svg");
const eraserIcon = require("./assets/images/eraser-icon.svg");
const moveIcon = require("./assets/images/move-icon.svg");
const pencilIcon = require("./assets/images/pencil-icon.svg");
const squareIcon = require("./assets/images/square-icon.svg");
const textIcon = require("./assets/images/text-icon.svg");
const undoIcon = require("./assets/images/undo-icon.svg");

const dataJson = [
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
    colors: ["#ff0000", "#ff3333",'#000']
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
export default class App extends Component {
  onDrawingEnd = val => console.log(val);
  render() {
    return (
      <div>
        <ExampleComponent
          imgSrc="https://miro.medium.com/max/700/1*IXj6F6TiST3LK9r50a-MLw.jpeg"
          onDrawingEnd={this.onDrawingEnd}
          lineWidth={5}
          configs={dataJson}
        />
      </div>
    );
  }
}
