import React, { Component } from "react";
import {
  PrimaryButton,
  DefaultButton,
  TeachingBubble,
  MessageBar,
  MessageBarType,
  Spinner,
  Dialog,
  Text,
} from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import "./stylesheets/Decode.css";

class Decode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      isTeachingBubbleVisible: false,
      messageBarMessage: "",
      isLoading: false,
      result: null,
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
      const url = "https://hiddenapi.herokuapp.com/decode/";
      // const url = "http://127.0.0.1:8000/decode";
      const params = {
        image: this.state.selectedImage,
      };
      this.setState(() => {
        return {
          isLoading: true,
        };
      });
      try {
        const response = await fetch(url, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });
        const data = await response.json();
        this.setState(() => {
          return {
            isLoading: false,
            result: data,
          };
        });
      } catch (error) {
        this.setState(() => {
          return {
            messageBarMessage: error.message,
            isLoading: false,
          };
        });
        setTimeout(() => {
          this.setState(() => {
            return {
              messageBarMessage: "",
            };
          });
        }, 6000);
      }
    } else {
      this.setState(() => {
        return {
          isTeachingBubbleVisible: true,
        };
      });
    }
  };

  hideDialog = () => {
    this.setState(() => {
      return {
        result: null,
      };
    });
  };

  render = () => {
    return (
      <form className="Decode" onSubmit={this.sendAPIRequest}>
        {this.state.messageBarMessage && (
          <MessageBar messageBarType={MessageBarType.error}>
            {this.state.messageBarMessage}
          </MessageBar>
        )}
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
        <DefaultButton
          onClick={this.uploadPhoto}
          disabled={this.state.isLoading}
          id="uploadPhotoButton"
        >
          {this.state.selectedImage ? "Change" : "Upload"} Photo
        </DefaultButton>
        <PrimaryButton
          className="Decode-submitButton"
          type="submit"
          disabled={this.state.isLoading}
        >
          {this.state.isLoading ? <Spinner /> : "Submit"}
        </PrimaryButton>

        {this.state.isTeachingBubbleVisible && (
          <TeachingBubble
            target="#uploadPhotoButton"
            hasSmallHeadline={true}
            onDismiss={this.hideTeachingBubble}
            headline="Upload a Photo to decode message."
          ></TeachingBubble>
        )}
        <Dialog hidden={!this.state.result} onDismiss={this.hideDialog}>
          <div className="Decode-dialog">
            <Text variant="xLarge">Message Decoded</Text>
            <Text className="Decode-dialogResult">
              {this.state.result ? this.state.result.message : ""}
            </Text>
            <DefaultButton onClick={this.hideDialog} text="Close" />
          </div>
        </Dialog>
      </form>
    );
  };
}

export default Decode;
