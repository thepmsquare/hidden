import React, { Component } from "react";
import {
  PrimaryButton,
  TextField,
  DefaultButton,
  TeachingBubble,
  Dialog,
  MessageBar,
  MessageBarType,
  Spinner,
  Text,
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
      result: null,
      messageBarMessage: "",
      isLoading: false,
      selectedImageName: null,
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
    const indexOfPath = e.target.files[0].name.lastIndexOf(".");
    const filename = e.target.files[0].name.substr(0, indexOfPath);
    fReader.readAsDataURL(e.target.files[0]);
    fReader.onloadend = (event) => {
      this.setState(() => {
        return {
          selectedImage: event.target.result,
          selectedImageName: filename,
        };
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
    clearTimeout(this.timeoutid);
    if (this.state.selectedImage) {
      const url = "https://hiddenapi.herokuapp.com/encode";
      // const url = "http://127.0.0.1:8000/encode";
      const params = {
        image: this.state.selectedImage,
        message: this.state.message,
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
        if (response.status === 200) {
          this.setState(() => {
            return {
              result: data,
              isLoading: false,
              selectedImage: null,
              message: "",
            };
          });
        } else {
          throw new Error(data.detail);
        }
      } catch (error) {
        this.setState(() => {
          return {
            messageBarMessage: error.message,
            isLoading: false,
          };
        });
        this.timeoutid = setTimeout(() => {
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
        selectedImageName: null,
      };
    });
  };

  openImageInNewTab = () => {
    window.open(this.state.result.image, "Image");
  };

  downloadImage = () => {
    const link = document.createElement("a");
    link.href = this.state.result.image;
    link.download = this.state.selectedImageName + "-encoded.png";
    link.click();
  };
  render = () => {
    return (
      <form
        className="Encode"
        onSubmit={this.sendAPIRequest}
        acceptCharset="utf-8"
      >
        {this.state.messageBarMessage && (
          <MessageBar messageBarType={MessageBarType.error}>
            {this.state.messageBarMessage}
          </MessageBar>
        )}
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
        <DefaultButton
          onClick={this.uploadPhoto}
          id="uploadPhotoButton"
          disabled={this.state.isLoading}
        >
          {this.state.selectedImage ? "Change" : "Upload"} Photo
        </DefaultButton>
        <TextField
          disabled={this.state.isLoading}
          required
          placeholder="Message"
          className="Encode-messageInput"
          resizable={false}
          multiline
          value={this.state.message}
          onChange={this.onInputChange}
        ></TextField>
        <PrimaryButton
          className="Encode-submitButton"
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
            headline="Upload a Photo to encode message."
          ></TeachingBubble>
        )}
        <Dialog hidden={!this.state.result} onDismiss={this.hideDialog}>
          <div className="Encode-dialog">
            <Text variant="xLarge">Message Encoded</Text>
            <Text variant="large">
              Note: Message cannot get decoded if image is further compressed.
            </Text>
            <Text variant="xLarge">
              Number of Pixels Modified:{" "}
              {this.state.result && this.state.result.noOfPixelsModified}
            </Text>
            <Text variant="xLarge">
              Percentage of Image Modified: ≈
              {this.state.result &&
                this.state.result.percentOfImageModified.toFixed(2)}
              %
            </Text>
            <PrimaryButton onClick={this.openImageInNewTab} text="Open Image" />
            <PrimaryButton
              onClick={this.downloadImage}
              text="Download Image (.png)"
            />
            <DefaultButton onClick={this.hideDialog} text="Close" />
          </div>
        </Dialog>
      </form>
    );
  };
}

export default Encode;
