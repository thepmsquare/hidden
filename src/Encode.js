import React, { Component } from "react";
import {
  PrimaryButton,
  TextField,
  DefaultButton,
  TeachingBubble,
} from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import "./stylesheets/Encode.css";

class Encode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      isTeachingBubbleVisible: false,
      message: "",
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

  hideTeachingBubble = () => {
    this.setState(() => {
      return {
        isTeachingBubbleVisible: false,
      };
    });
  };

  onInputChange = (e) => {
    this.setState(() => {
      return {
        message: e.target.value,
      };
    });
  };

  sendAPIRequest = async (e) => {
    e.preventDefault();
    if (this.state.selectedImage) {
      // const url = "https://hiddenapi.herokuapp.com/encode/";
      const url = "http://127.0.0.1:8000/encode";
      const params = {
        image: this.state.selectedImage,
        message: this.state.message,
      };

      const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });
      const data = await response.json();
      console.log(data);
    } else {
      this.setState(() => {
        return {
          isTeachingBubbleVisible: true,
        };
      });
    }
  };

  render = () => {
    return (
      <form
        className="Encode"
        onSubmit={this.sendAPIRequest}
        acceptCharset="utf-8"
      >
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

        <DefaultButton onClick={this.uploadPhoto} id="uploadPhotoButton">
          {this.state.selectedImage ? "Change" : "Upload"} Photo
        </DefaultButton>
        <TextField
          required
          placeholder="Message"
          className="Encode-messageInput"
          resizable={false}
          multiline
          value={this.state.message}
          onChange={this.onInputChange}
        ></TextField>

        <PrimaryButton className="Encode-submitButton" type="submit">
          Submit
        </PrimaryButton>

        {this.state.isTeachingBubbleVisible && (
          <TeachingBubble
            target="#uploadPhotoButton"
            hasSmallHeadline={true}
            onDismiss={this.hideTeachingBubble}
            headline="Upload a Photo to encode message."
          ></TeachingBubble>
        )}
      </form>
    );
  };
}

export default Encode;
