import React, { Component } from 'react';

class Circle {
  constructor(x, y, r, context) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.context = context;
    this.vx = Math.random() - 0.5; // Random velocity in x-axis
    this.vy = Math.random() - 0.5; // Random velocity in y-axis
  }

  draw() {
    const { x, y, r, context } = this;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
    context.closePath();
  }

  move() {
    const { x, y, vx, vy, r, context } = this;

    // Update position
    this.x += vx;
    this.y += vy;

    // Reverse direction if circle hits canvas boundaries
    if (x + r >= context.canvas.width || x - r <= 0) {
      this.vx *= -1;
    }
    if (y + r >= context.canvas.height || y - r <= 0) {
      this.vy *= -1;
    }
  }
}

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.canvas = null;
    this.context = null;
    this.r = 2;
    this.circles = [];
  }

  componentDidMount() {
    this.setupCanvas();
    this.animate();
  }

  setupCanvas = () => {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  animate = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.circles.length; i++) {
      const circle = this.circles[i];
      circle.draw();
      circle.move();
    }
    requestAnimationFrame(this.animate);
  };

  drawCircle = () => {
    if (!this.context) {
      this.setupCanvas();
    }
    // Generate 100 random circles
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;

      // Create a new Circle instance with radius
      const circle = new Circle(x, y, this.r, this.context);
      this.circles.push(circle);
    }
  };

  resetCanvas = () => {
    this.setupCanvas();
    this.circles = [];
  };

  render() {
    const { width, height } = this.props;

    return (
      <div className="simulator">
        <canvas
          className="simulator-canvas"
          ref={this.canvasRef}
          width={width}
          height={height}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: '1px solid black',
            boxSizing: 'content-box',
          }}
        />
        <div className="control-panel">
          <button onClick={this.drawCircle}>Draw Circles</button>
          <button onClick={this.resetCanvas}>Reset Canvas</button>
        </div>
      </div>
    );
  }
}

export default Canvas;
