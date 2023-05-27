import React from 'react';
import Canvas from './js/Canvas';
import "../src/css/app.css";


const App = () => {
  return (
    <div className="App">
      <h1>Epidemic simulator</h1>
      <Canvas width={400} height={400}/>
    </div>
  );
};

export default App;
