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
import { downloadZip } from "client-zip";
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
      selectedImageType: null,
    };
  }

  uploadPhoto = () => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png,image/jpeg");
    input.click();
    input.onchange = this.getSelectedImage;
  };

  getSelectedImage = (e) => {
    const fReader = new FileReader();
    const indexOfPath = e.target.files[0].name.lastIndexOf(".");
    const filename = e.target.files[0].name.substr(0, indexOfPath);
    const filetype = e.target.files[0].name.substr(indexOfPath + 1);
    fReader.readAsDataURL(e.target.files[0]);
    fReader.onloadend = (event) => {
      this.setState(() => {
        return {
          selectedImage: event.target.result,
          selectedImageName: filename,
          selectedImageType: filetype,
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

  dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  sendAPIRequest = async (e) => {
    e.preventDefault();
    clearTimeout(this.timeoutid);
    if (this.state.selectedImage) {
      const url = "https://hiddenapi.herokuapp.com/encode";
      // const url = "http://127.0.0.1:8000/encode";
      let fd = new FormData();
      fd.append("message", this.state.message);
      fd.append("image", this.dataURLtoBlob(this.state.selectedImage));
      this.setState(() => {
        return {
          isLoading: true,
        };
      });
      try {
        const response = await fetch(url, {
          method: "post",
          body: fd,
        });
        let blob = await response.body.getReader().read();
        const result = {
          blob,
          noofpixelsmodified: parseInt(
            response.headers.get("noofpixelsmodified")
          ),
          percentofimagemodified: parseFloat(
            response.headers.get("percentofimagemodified")
          ).toFixed(2),
        };
        if (response.status === 200) {
          this.setState(() => {
            return {
              result,
              isLoading: false,
              selectedImage: null,
              message: "",
            };
          });
        } else {
          let data = await response.json();
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

  openImageInNewTab = async () => {
    let blob = new Blob([this.state.result.blob.value.buffer], {
      type: "image/png",
    });
    let url = URL.createObjectURL(blob);
    window.open(url);
  };

  downloadImage = async () => {
    const link = document.createElement("a");

    let myblob = new Blob([this.state.result.blob.value.buffer], {
      type: "image/png",
    });

    const blob = await downloadZip([
      {
        name: this.state.selectedImageName + "-encoded.png",
        lastModified: new Date(),
        input: myblob,
      },
    ]).blob();
    link.href = URL.createObjectURL(blob);
    link.download = this.state.selectedImageName + "-encoded.zip";
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
              {this.state.result && this.state.result.noofpixelsmodified}
            </Text>
            <Text variant="xLarge">
              Percentage of Image Modified: ≈
              {this.state.result && this.state.result.percentofimagemodified}%
            </Text>
            <PrimaryButton onClick={this.openImageInNewTab} text="Open Image" />
            <PrimaryButton
              onClick={this.downloadImage}
              text="Download Image (.zip -> .png)"
            />
            <DefaultButton onClick={this.hideDialog} text="Close" />
          </div>
        </Dialog>
      </form>
    );
  };
}

export default Encode;
