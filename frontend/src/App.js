import React, { useContext, useEffect } from 'react';
import Router from './components/router';
import "./static/style.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { Context } from './components/context';




function App() {

  const context = useContext(Context);

  useEffect(() => {
    context.validateTokenWithServer();
  }, [])
  return (
    <div className="App">
      
      <Router />
    </div>
  );
}

export default App;
