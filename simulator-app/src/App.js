import React from 'react';
import Canvas from './js/Canvas';
import "../src/css/app.css";
import 'bootstrap/dist/css/bootstrap.css';


const App = () => {
  return (
    <div className="App">
      <h1>Epidemic simulator</h1>
      <Canvas width={400} height={400}/>
      <div>
        This simulator visualises the impact of various environmental factors and human behaviour on the rate of spread of epidemics.
      </div>
      <div>
        <p>Notes</p>
        <ul>
          <li>Number of people can be varied, but the size of the environment (square box) will remain unchanged</li>
          <li>Speed controls movement speed of people (can be used to speed up simulation)</li>
          <li>Infection radius is a multiplier of each person's radius</li>
        </ul>
        <p>Model assumptions</p>
        <ul>
          <li>A person gains immunity after infection (cannot be infected again)</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
