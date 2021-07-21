import React, { Component } from "react";
import { PrimaryButton, TextField, DefaultButton } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import "./stylesheets/Encode.css";

class Encode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
    };
  }

  uploadPhoto = () => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = this.getSelectedImage;
  };

  getSelectedImage = (e) => {
    const fReader = new FileReader();
    fReader.readAsDataURL(e.target.files[0]);
    fReader.onloadend = (event) => {
      this.setState(() => {
        return { selectedImage: event.target.result };
      });
    };
  };

  render = () => {
    return (
      <form className="Encode">
        {this.state.selectedImage ? (
          <img
            src={this.state.selectedImage}
            alt="plain input to be encoded"
            className="Encode-photo"
          />
        ) : (
          <div className="Encode-photoPlaceHolder">
            <Icon
              iconName="FileImage"
              onClick={this.uploadPhoto}
              className="Encode-photoPlaceHolderIcon"
            />
          </div>
        )}

        <DefaultButton onClick={this.uploadPhoto}>
          {this.state.selectedImage ? "Change" : "Upload"} Photo
        </DefaultButton>
        <TextField
          required
          placeholder="Message"
          className="Encode-messageInput"
          resizable={false}
          multiline
        ></TextField>

        <PrimaryButton className="Encode-submitButton">Submit</PrimaryButton>
      </form>
    );
  };
}

export default Encode;
