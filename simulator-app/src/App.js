import React from 'react';
import Canvas from './js/Canvas';
import 'bootstrap/dist/css/bootstrap.css';
// import "../src/css/app.css";
import "../src/css/app.scss";


const App = () => {
  return (
    <div className="App">
      <h2>Epidemic simulator</h2>
      <Canvas width={400} height={400}/>
      <div>
        <p>Model assumptions</p>
        <ul>
          <li>People can move freely within the fixed square box only.</li>
          <li>Each person follows a random walk throughout the simulation.</li>
          <li>An infected person gains immunity after the first infection (cannot be infected again).</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
