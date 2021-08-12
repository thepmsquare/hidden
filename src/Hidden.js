import React, { Component } from "react";
import { Text, PivotItem, Pivot } from "@fluentui/react";
import "./stylesheets/Hidden.css";
import Encode from "./Encode";
import Decode from "./Decode";

class Hidden extends Component {
  render = () => {
    return (
      <div className="Hidden">
        <Text variant="mega" color="black">
          hidden
        </Text>
        <Pivot>
          <PivotItem headerText="Encode">
            <Encode />
          </PivotItem>
          <PivotItem headerText="Decode">
            <Decode />
          </PivotItem>
        </Pivot>
      </div>
    );
  };
}

export default Hidden;
