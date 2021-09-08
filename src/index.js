import React from 'react'
import PropTypes from 'prop-types'
require('./styles.css')
class Editor extends React.Component {
  constructor(props) {
    super(props)

    this.editorCanvasRef = React.createRef()
    this.canvasContainerRef = React.createRef()
    this.baseCanvas = React.createRef()
    this.permanentCanvas = React.createRef()
    this.imageAndDrawingMixingCanvas = React.createRef()
    this.linkRef = React.createRef()
    const { configs } = props
    const editorControls =
      configs &&
      configs.length > 0 &&
      configs.map(drawing => {
        // if role is text or color or undo
        let tempObj = {}
        if (drawing.role === 'color') {
          tempObj = {
            onClick: null,
            colors: drawing.colors ? [...drawing.colors] : ['#000000']
          }
        } else if (drawing.role === 'text') {
          tempObj = { onClick: this.handleText }
        } else if (drawing.role === 'erase') {
          tempObj = { onClick: this.handleErase }
        } else if (drawing.role === 'undo') {
          tempObj = { onClick: this.handleUndo }
        } else {
          tempObj = {
            onClick: () => this.setState({ drawingShape: drawing.role })
          }
        }

        return {
          ...drawing,
          ...tempObj
        }
      })
    this.state = {
      startX: null,
      startY: null,
      canvasWidth: 400,
      canvasHeight: 400,
      drawingShape: 'rect',
      drawnImages: [],
      currentImageIndex: null,
      isImageLoaded: false,
      isMouseDown: false,
      textValue: '',
      lineWidth: props.lineWidth,
      drawingColor: '#000',
      screenshotControls: configs ? [...editorControls] : []
    }
  }
  fillTextOnCanvas = (ctx) => {
    const { textValue, startX, startY } = this.state
    let lines = textValue.split('\n');
    let offset = 0;
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    ctx.font = '14px Arial'
    ctx.fillStyle = this.state.drawingColor;
    let textEditor = document.querySelector('.screenshotEditor__text');
    if(textEditor){
      let charWidth = 8, textEditorWidth = textEditor.offsetWidth - 10, 
        charLimit = textEditorWidth/charWidth;
      for(let line of lines){
        let subLines = Math.ceil(line.length/charLimit);
        for(let i=0;i<subLines;i++){
          let subLine = line.substr(i*charLimit,charLimit);
          ctx.fillText(subLine, startX, startY+offset)
          offset += 20
        }
        offset += 10;
      }
    }
  }
  drawRectangle = e => {
    const { startX, startY, canvasWidth, canvasHeight } = this.state
    const ctx = this.editorCanvasRef.current.getContext('2d')
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const width = x - startX
    const height = y - startY
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.beginPath()
    ctx.rect(startX, startY, width, height)
    ctx.stroke()
  };
  // circle
  drawCircle = e => {
    const { startX, startY, canvasWidth, canvasHeight } = this.state

    const ctx = this.editorCanvasRef.current.getContext('2d')
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const circleX = (x + startX) / 2
    const circleY = (y + startY) / 2
    const radius = Math.max(Math.abs(x - startX), Math.abs(y - startY)) / 2
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.beginPath()
    ctx.arc(circleX, circleY, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.closePath()
  };
  // draw line
  drawLine = e => {
    const { startX, startY, canvasWidth, canvasHeight } = this.state

    const ctx = this.editorCanvasRef.current.getContext('2d')
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.closePath()
  };

  // drawPencil
  drawPencil = e => {
    const ctx = this.editorCanvasRef.current.getContext('2d')
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.closePath()
  };
  // onEraseCanvasDrawing
  onErasae = e => {
    const ctx = this.baseCanvas.current.getContext('2d')
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  };

  // event handlers
  handleMouseDown = e => {
    const {
      drawingShape,
      textValue,
      startX,
      startY,
      canvasWidth,
      canvasHeight,
      lineWidth,
      drawingColor
    } = this.state
    const baseImageCavnas = this.imageAndDrawingMixingCanvas.current.getContext(
      '2d'
    )
    const ctx = this.editorCanvasRef.current.getContext('2d')
    const downCtx = this.baseCanvas.current.getContext('2d')
    baseImageCavnas.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.strokeStyle = drawingColor
    ctx.fillStyle = drawingColor

    if (drawingShape === 'text') {
      this.fillTextOnCanvas(ctx);
      this.setState({ textValue: '', hideTextBox: false })
    } else {
      this.setState({ hideTextBox: true })
    }

    if (drawingShape === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      downCtx.globalCompositeOperation = 'destination-out'
      downCtx.fillStyle = 'rgba(0,0,0,1)'
      downCtx.strokeStyle = 'rgba(0,0,0,1)'
      downCtx.lineWidth = lineWidth * 2
    } else {
      ctx.globalCompositeOperation = 'source-over'
      downCtx.globalCompositeOperation = 'source-over'
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
    }
    downCtx.beginPath()
    ctx.beginPath()

    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    this.setState({ startX: x, startY: y, isMouseDown: true })
  };
  handleMouseMove = e => {
    const { isMouseDown, startX, startY, drawingShape } = this.state
    if (isMouseDown && startX && startY) {
      switch (drawingShape) {
        case 'rect':
          this.drawRectangle(e)
          break
        case 'circle':
          this.drawCircle(e)
          break
        case 'line':
          this.drawLine(e)
          break
        case 'pencil':
          this.drawPencil(e)
          break
        case 'eraser':
          this.onErasae(e)
          break
        default:
          break
      }
    }
  };

  getFinalCanvasUrl = cb => {
    const { drawnImages, currentImageIndex } = this.state
    const permanentCanvas = this.permanentCanvas.current
    const canvas = this.imageAndDrawingMixingCanvas.current
    const context = canvas.getContext('2d')
    context.drawImage(permanentCanvas, 0, 0)
    const image = new Image()
    image.src =
      drawnImages[currentImageIndex <= 0 ? null : currentImageIndex - 1]
    image.onload = () => {
      context.drawImage(image, 0, 0)
      cb(canvas.toDataURL('image/png'))
    }
    image.crossOrigin = 'anonymous'
  };
  copyEditorCanvasToFinalCanvas = () => {
    let editorCanvas = this.editorCanvasRef.current // upper canvas
    const bottomCanvas = this.baseCanvas.current.getContext('2d')
    bottomCanvas.drawImage(editorCanvas, 0, 0)
  };
  saveTheCurrentImageInstance = () => {
    const { currentImageIndex, drawnImages } = this.state
    let imageIndex = currentImageIndex
    if (currentImageIndex <= 0) imageIndex = 0
    let tempDrawnImages = [...drawnImages]
    tempDrawnImages = tempDrawnImages.slice(0, imageIndex)
    const dataUrl = this.baseCanvas.current.toDataURL('image/png')
    this.setState({
      drawnImages: [...tempDrawnImages, dataUrl],
      currentImageIndex: imageIndex + 1
    })
  };
  clearEditorCanvas = () => {
    const { canvasHeight, canvasWidth } = this.state
    const editorCanvasCtx = this.editorCanvasRef.current.getContext('2d')
    editorCanvasCtx.clearRect(0, 0, canvasWidth, canvasHeight)
  };
  handleMouseUp = e => {
    const { onDrawingEnd } = this.props
    // copy the drawen image to the final canvas
    // generate the data url of final canvas and store it in the reference array
    // clear the editor canvas
    this.copyEditorCanvasToFinalCanvas()
    this.saveTheCurrentImageInstance()
    this.clearEditorCanvas()
    this.setState({
      isMouseDown: false
    })
    this.getFinalCanvasUrl(function name(params) {
      onDrawingEnd(params)
    })
  };
  handleMouseOut = e => {
    // handler for mouse out
  };
  // handler for image loading
  handleImageLoad = e => {
    const { imgSrc } = this.props
    const { offsetHeight, offsetWidth } = e.target
    const finalBottomImageRef = this.permanentCanvas.current.getContext('2d')
    const image = new Image()
    image.onload = () => {
      finalBottomImageRef.drawImage(image, 0, 0, offsetWidth, offsetHeight)
    }
    // image.crossOrigin = "anonymous";
    image.crossOrigin = 'anonymous'
    image.src = imgSrc
    this.setState({
      isImageLoaded: true,
      canvasHeight: offsetHeight,
      canvasWidth: offsetWidth
    })
  };

  handleUndo = () => {
    // handle the logic for undo here
    const {
      canvasWidth,
      canvasHeight,
      drawnImages,
      currentImageIndex
    } = this.state
    const { onDrawingEnd } = this.props
    if(currentImageIndex<=0) return;


    // this.setState({ drawingShape: null })
    const oImg = new Image()
    const bottomCanvas = this.baseCanvas.current.getContext('2d')
    const upperCanvas = this.editorCanvasRef.current.getContext('2d')
    bottomCanvas.globalCompositeOperation = 'source-over'
    upperCanvas.globalCompositeOperation = 'source-over'

    bottomCanvas.clearRect(0, 0, canvasWidth, canvasHeight)
    upperCanvas.clearRect(0, 0, canvasWidth, canvasHeight)
    oImg.onload = () => {
      bottomCanvas.drawImage(oImg, 0, 0)
    }
    oImg.src = drawnImages[currentImageIndex - 2]
    this.setState({ currentImageIndex: currentImageIndex - 1 }, () => {
      this.getFinalCanvasUrl(function name(params) {
        onDrawingEnd(params)
      })
    })
  };

  // handle erase
  handleErase = () => {
    this.setState({ drawingShape: 'eraser' })
  };
  handleText = () => {
    this.setState({
      drawingShape: 'text',
      startX: null,
      startY: null
    })
  };
  // add textarea
  handleAddText = e => {
    const { onDrawingEnd } = this.props
    const { textValue, startX, startY } = this.state
    if (e.keyCode === 13 && !e.shiftKey) {
      const ctx = this.editorCanvasRef.current.getContext('2d');
      this.fillTextOnCanvas(ctx);
      this.copyEditorCanvasToFinalCanvas()
      this.saveTheCurrentImageInstance()
      this.clearEditorCanvas()
      this.setState({
        textValue: '',
        startX: null,
        startY: null
      })
      // delay, state updation is taking time here. 
      setTimeout(() => {
        this.getFinalCanvasUrl(function name(params) {
          onDrawingEnd(params)
        })
      },1000)
    }
  };
  componentDidMount() {
    this.editorCanvasRef.current.addEventListener(
      'mousedown',
      this.handleMouseDown
    )
    this.editorCanvasRef.current.addEventListener(
      'mousemove',
      this.handleMouseMove
    )
    this.editorCanvasRef.current.addEventListener(
      'mouseup',
      this.handleMouseUp
    )
    this.editorCanvasRef.current.addEventListener(
      'mouseout',
      this.handleMouseOut
    )
  }
  componentWillUnmount() {
    this.editorCanvasRef.current.removeEventListener(
      'mousedown',
      this.handleMouseDown
    )
    this.editorCanvasRef.current.removeEventListener(
      'mousemove',
      this.handleMouseMove
    )
    this.editorCanvasRef.current.removeEventListener(
      'mouseup',
      this.handleMouseUp
    )
    this.editorCanvasRef.current.removeEventListener(
      'mouseout',
      this.handleMouseOut
    )
  }

  handleSelectColor = color => this.setState({ drawingColor: color });
  render() {
    const editorControls = [
      {
        icon: '╲',
        title: 'Move',
        role: 'line',
        onClick: () => this.setState({ drawingShape: 'line' })
      },
      {
        icon: '⊡',
        title: 'Square',
        role: 'rect',
        onClick: () => this.setState({ drawingShape: 'rect' })
      },
      {
        icon: '⊙',
        title: 'Elipse',
        role: 'circle',
        onClick: () => this.setState({ drawingShape: 'circle' })
      },
      {
        icon: '🎨',
        title: 'Bucket',
        onClick: null,
        colors: ['#ff6565', '#ffa000', '#cddc39', '#50e3c2', '#000', '#fff']
      },
      {
        icon: '✎',
        title: 'Pencil',
        role: 'pencil',
        onClick: () => this.setState({ drawingShape: 'pencil' })
      },
      {
        icon: '𝐓',
        title: 'Text',
        role: 'text',
        onClick: this.handleText
      },
      {
        icon: '⎚',
        title: 'Eraser',
        role: 'eraser',
        onClick: this.handleErase
      },
      {
        icon: '↺',
        title: 'Undo',
        onClick: this.handleUndo
      }
    ]
    const {
      isImageLoaded,
      canvasWidth,
      canvasHeight,
      drawingShape,
      startX,
      startY,
      textValue,
      hideTextBox,
      screenshotControls,
      drawingColor
    } = this.state
    const { imgSrc, configs } = this.props
    const finalDrawingControls =
      configs && configs.length > 0 ? screenshotControls : editorControls
    return (
      <div className='screenshotEditor_wrapper'>
        <div className='screenshotEditorMenu_left border-right'>
          <div className='screenshotEditorMenu'>
            {finalDrawingControls.map(({ icon, onClick, colors, role }) => (
              <button
                key={role}
                className={`screenshotEditorMenu__item ${
                  role === drawingShape
                    ? 'screenshotEditorMenu__item--active'
                    : undefined
                }`}
                onClick={onClick}
              >
                {configs ? (
                  <img
                    src={icon}
                    alt='...'
                    className='screenshotEditorMenu__item__icon'
                  />
                ) : (
                  <span>{icon}</span>
                )}
                {colors && (
                  <div className='screenshotEditorMenu__item__icon__colorWrapper'>
                    {colors.map(color => (
                      <div
                        style={{ backgroundColor: color }}
                        className={`screenshotEditorMenu__item__icon__colorWrapper__colorBox ${
                          drawingColor === color
                            ? 'screenshotEditorMenu__item__icon__colorWrapper__colorBox--active'
                            : ''
                        }`}
                        onClick={() => this.handleSelectColor(color)}
                      />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className='screenshotEditorImgWrapper'>
          <div className='screenshotEditorArea ' ref={this.canvasContainerRef}>
            {!isImageLoaded && <span className='loading'>Loading</span>}
            <div className='screenshotEditorArea_child'>
              <img
                src={imgSrc}
                alt=''
                onLoad={this.handleImageLoad}
                className='baseScreenshotimg'
              />
              <canvas
                ref={this.permanentCanvas}
                width={canvasWidth}
                height={canvasHeight}
                className='screenshotEditorArea__permanentBottomcanvas'
              />
              <canvas
                ref={this.imageAndDrawingMixingCanvas}
                width={canvasWidth}
                height={canvasHeight}
                className='screenshotEditorArea__finalBottomcanvas'
              />
              <canvas
                ref={this.baseCanvas}
                className='screenshotEditorArea__canvas'
                width={canvasWidth}
                height={canvasHeight}
              />
              <canvas
                ref={this.editorCanvasRef}
                style={{cursor: this.state.drawingShape == "text" ? 'text' : 'crosshair'}}
                className='screenshotEditorArea__editorCanvas'
                width={canvasWidth}
                height={canvasHeight}
              />
              {drawingShape === 'text' && startX && startY && !hideTextBox && (
                <textarea
                  className='screenshotEditor__text'
                  style={{ top: startY, left: startX }}
                  value={textValue}
                  placeholder='Enter text to add'
                  onChange={e => this.setState({ textValue: e.target.value })}
                  onKeyDown={this.handleAddText}
                />
              )}
            </div>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

Editor.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  onDrawingEnd: PropTypes.func.isRequired,
  lineWidth: PropTypes.number,
  configs: PropTypes.oneOfType(Array),
  children: PropTypes.node
}
Editor.defaultProps = {
  lineWidth: 5,
  configs: null
}

export default Editor
