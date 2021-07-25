import React, { Component } from "react";
import { PrimaryButton, DefaultButton, TeachingBubble } from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import "./stylesheets/Decode.css";

class Decode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      isTeachingBubbleVisible: false,
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
  sendAPIRequest = async (e) => {
    e.preventDefault();
    if (this.state.selectedImage) {
      // const url = "https://hiddenapi.herokuapp.com/encode/";
      const url = "http://127.0.0.1:8000/decode";
      const params = {
        image: this.state.selectedImage,
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
      <form className="Decode" onSubmit={this.sendAPIRequest}>
        {this.state.selectedImage ? (
          <img
            src={this.state.selectedImage}
            alt="plain input to be decoded"
            className="Decode-photo"
          />
        ) : (
          <div className="Decode-photoPlaceHolder">
            <Icon
              iconName="FileImage"
              onClick={this.uploadPhoto}
              className="Decode-photoPlaceHolderIcon"
            />
          </div>
        )}
        <DefaultButton onClick={this.uploadPhoto} id="uploadPhotoButton">
          {this.state.selectedImage ? "Change" : "Upload"} Photo
        </DefaultButton>
        <PrimaryButton className="Decode-submitButton" type="submit">
          Submit
        </PrimaryButton>

        {this.state.isTeachingBubbleVisible && (
          <TeachingBubble
            target="#uploadPhotoButton"
            hasSmallHeadline={true}
            onDismiss={this.hideTeachingBubble}
            headline="Upload a Photo to decode message."
          ></TeachingBubble>
        )}
      </form>
    );
  };
}

export default Decode;
