import React, { Component } from 'react';

class Circle {
  constructor(x, y, r, canvasWidth, canvasHeight) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.color = 'grey';
    this.dx = Math.random() * 2 - 1; // Random value between -1 and 1 for x-axis movement
    this.dy = Math.random() * 2 - 1; // Random value between -1 and 1 for y-axis movement
  }

  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    // Check collision with canvas boundaries
    if (this.x - this.r <= 0 || this.x + this.r >= this.canvasWidth) {
      this.dx *= -1; // Reverse the direction on collision
    }
    if (this.y - this.r <= 0 || this.y + this.r >= this.canvasHeight) {
      this.dy *= -1; // Reverse the direction on collision
    }
  }

  checkCollision(otherCircle) {
    const dx = this.x - otherCircle.x;
    const dy = this.y - otherCircle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Check if circles collide
    if (distance < this.r + otherCircle.r) {
      this.color = 'red';
      otherCircle.color = 'red';
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
    this.animationFrameId = null;
    this.isAnimating = true;
    this.state = {
      redCircleCount: 0
    };
  }

  componentDidMount() {
    this.setupCanvas();
    this.animate();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationFrameId);
  }

  setupCanvas = () => {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
    // Clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  animate = () => {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.setState({ redCircleCount: 0 });

    for (let i = 0; i < this.circles.length; i++) {
      const circle = this.circles[i];
      circle.draw(context);
      circle.move();
      for (let j = i + 1; j < this.circles.length; j++) {
        const otherCircle = this.circles[j];
        circle.checkCollision(otherCircle);
      }
      if (circle.color === 'red') {
        this.setState(prevState => ({
          redCircleCount: prevState.redCircleCount + 1
        }));
      }
    }

    if (this.isAnimating) {
      this.animationFrameId = requestAnimationFrame(this.animate);
    }
  };

  toggleAnimation = () => {
    this.isAnimating = !this.isAnimating;
    if (this.isAnimating) {
      this.animate();
    } else {
      cancelAnimationFrame(this.animationFrameId);
    }
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
      const circle = new Circle(x, y, this.r, this.canvas.width, this.canvas.height);
      this.circles.push(circle);
    }
  };

  resetCanvas = () => {
    this.setupCanvas();
    this.circles = [];
    this.setState({ redCircleCount: 0 });
  };

  render() {
    const { width, height } = this.props;
    const { redCircleCount } = this.state;

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
          <button onClick={this.toggleAnimation}>
            {this.isAnimating ? 'Pause Animation' : 'Play Animation'}
          </button>
        </div>
        <div className="counter">
          Red Circles: {redCircleCount}
        </div>
      </div>
    );
  }
}

export default Canvas;
