import React, { Component } from 'react';


class Person {
  constructor(x, y, r, canvasWidth, canvasHeight, infectionRadius) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.infectionRadius = infectionRadius; // New parameter for infection radius
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

  move(travellingSpeed) {
    const normalizedDx = this.dx / Math.sqrt(this.dx ** 2 + this.dy ** 2);
    const normalizedDy = this.dy / Math.sqrt(this.dx ** 2 + this.dy ** 2);
    const adjustedSpeed = travellingSpeed; // Adjust the speed based on the parameter

    this.x += normalizedDx * adjustedSpeed;
    this.y += normalizedDy * adjustedSpeed;

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
  
    // Check if circles collide within the infection radius
    if (distance < this.infectionRadius) {
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
      noOfInfections: 0,
      parameters: {
        noOfPeople: 2,
        travellingSpeed: 0.5,
        infectionRadius: 1,
      },
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
    this.setState({ noOfInfections: 0 });
  
    for (let i = 0; i < this.circles.length; i++) {
      const circle = this.circles[i];
      circle.draw(context);
      circle.move(this.state.parameters.travellingSpeed); // Pass the speed parameter here
  
      for (let j = i + 1; j < this.circles.length; j++) {
        const otherCircle = this.circles[j];
        circle.checkCollision(otherCircle);
      }
  
      if (circle.color === 'red') {
        // Update # of infections counter
        this.setState((prevState) => ({
          noOfInfections: prevState.noOfInfections + 1,
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
    const { parameters } = this.state;
  
    // Clear the existing circles
    this.circles = [];
  
    // Generate circles based on the parameters
    for (let i = 0; i < parameters.noOfPeople; i++) {
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
  
      // Create a new Person instance with updated parameters
      const circle = new Person(
        x,
        y,
        this.r,
        this.canvas.width,
        this.canvas.height,
        parameters.infectionRadius
      );
      this.circles.push(circle);
    }
  };
  

  handleParameterChange = (event) => {
    const { name, value } = event.target;
  
    this.setState((prevState) => ({
      parameters: {
        ...prevState.parameters,
        [name]: name === 'infectionRadius' ? parseInt(value) : parseFloat(value),
      },
    }));
  };
  

  handleSpeedChange = (event) => {
    const newSpeed = parseFloat(event.target.value);
    if (!isNaN(newSpeed)) {
      this.setState({ travellingSpeed: newSpeed });
    }
  };

  resetCanvas = () => {
    this.setupCanvas();
    this.circles = [];
    this.setState({ redCircleCount: 0 });
  };

  render() {
    const { width, height } = this.props;
    const { noOfInfections: redCircleCount, parameters } = this.state;

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
          <div>
            <label htmlFor="noOfPeopleSlider">Number of people:</label>
            <input
              id="noOfPeopleSlider"
              type="range"
              min="1"
              max="1000"
              name="noOfPeople"
              value={parameters.noOfPeople}
              onChange={this.handleParameterChange}
            />
            <span>{parameters.noOfPeople}</span>
          </div>
          <div>
            <label htmlFor="speedSlider">Speed:</label>
            <input
              id="speedSlider"
              type="range"
              min="0.5"
              max="2"
              step="0.5"
              name="travellingSpeed"
              value={parameters.travellingSpeed}
              onChange={this.handleParameterChange}
            />
            <span>{parameters.travellingSpeed}</span>
          </div>
          <div>
            <label htmlFor="infectionRadiusSlider">Infection radius:</label>
            <input
              id="infectionRadiusSlider"
              type="range"
              min="1"
              max="3"
              name="infectionRadius"
              value={parameters.infectionRadius}
              onChange={this.handleParameterChange}
            />
            <span>{parameters.infectionRadius}</span>
          </div>
          <button onClick={this.drawCircle}>Populate grid</button>
          <button onClick={this.resetCanvas}>Reset grid</button>
          <button onClick={this.toggleAnimation}>
            {this.isAnimating ? 'Pause' : 'Play'}
          </button>
        </div>
        <div className="counter">Total infections: {redCircleCount}</div>
      </div>
    );
  }
}

export default Canvas;
