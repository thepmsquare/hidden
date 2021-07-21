import React, { Component } from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react";
import "./stylesheets/Decode.css";

class Decode extends Component {
  render = () => {
    return (
      <div className="Decode">
        <form className="Decode-form">
          <DefaultButton>Upload Photo</DefaultButton>
          <PrimaryButton>Submit</PrimaryButton>
        </form>
      </div>
    );
  };
}

export default Decode;
