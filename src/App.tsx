import { Component } from "react";
import Hidden from "./Hidden";
import "./stylesheets/App.css";

class App extends Component {
  render = () => {
    return (
      <div className="App">
        <Hidden />
      </div>
    );
  };
}

export default App;
