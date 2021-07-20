import React, { Component } from "react";
import { getTheme, Text } from "@fluentui/react";
import "./stylesheets/Hidden.css";

class Hidden extends Component {
  constructor(props) {
    super(props);
    this.theme = getTheme();
  }

  render = () => {
    return (
      <div className="Hidden">
        <Text variant="mega" color="black">
          Hidden
        </Text>
      </div>
    );
  };
}

export default Hidden;
