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
import CryptoJS from "crypto-js";
import "./stylesheets/Encode.css";

class Encode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImage: null,
      isTeachingBubbleVisible: false,
      message: "",
      password: "",
      result: null,
      messageBarMessage: "",
      isLoading: false,
      selectedImageName: null,
      selectedImageType: null,
      requestStatus: "",
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
    const name = e.target.getAttribute("name");
    this.setState(() => {
      return {
        [name]: e.target.value,
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

  readAllChunks = async (readableStream) => {
    const reader = readableStream.getReader();
    const chunks = [];

    let done, value;
    while (!done) {
      ({ value, done } = await reader.read());
      if (done) {
        return chunks;
      }
      chunks.push(value);
    }
  };

  sendAPIRequest = async (e) => {
    e.preventDefault();
    clearTimeout(this.timeoutid);
    if (this.state.selectedImage) {
      const url = "https://hiddenapi.herokuapp.com/encode";
      // const url = "http://127.0.0.1:8000/encode";
      let message = this.state.message;
      if (this.state.password) {
        message = CryptoJS.AES.encrypt(
          this.state.message,
          this.state.password
        ).toString();
      }

      let fd = new FormData();
      fd.append("message", message);
      fd.append("image", this.dataURLtoBlob(this.state.selectedImage));
      this.setState(() => {
        return {
          isLoading: true,
          requestStatus: "Sending Image... ",
        };
      });
      try {
        const response = await fetch(url, {
          method: "post",
          body: fd,
        });
        this.setState(() => {
          return {
            requestStatus: "Receiving processed image... ",
          };
        });
        let myArrays = await this.readAllChunks(response.body);
        let length = 0;
        myArrays.forEach((item) => {
          length += item.length;
        });

        let mergedArray = new Uint8Array(length);
        let offset = 0;
        myArrays.forEach((item) => {
          mergedArray.set(item, offset);
          offset += item.length;
        });
        const result = {
          blob: mergedArray,
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
              password: "",
              requestStatus: "",
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
            requestStatus: "",
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
    let blob = new Blob([this.state.result.blob.buffer], {
      type: "image/png",
    });
    let url = URL.createObjectURL(blob);
    window.open(url);
  };

  downloadImage = async () => {
    const link = document.createElement("a");

    let myblob = new Blob([this.state.result.blob.buffer], {
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
        autoComplete="off"
      >
        <input autoComplete="off" style={{ display: "none" }}></input>
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
          name="message"
          resizable={false}
          multiline
          value={this.state.message}
          onChange={this.onInputChange}
        ></TextField>
        <TextField
          disabled={this.state.isLoading}
          placeholder="Optional Password"
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.onInputChange}
        ></TextField>
        <PrimaryButton type="submit" disabled={this.state.isLoading}>
          {this.state.isLoading ? (
            <span className="Encode-submitButton">
              {this.state.requestStatus} <Spinner />
            </span>
          ) : (
            "Submit"
          )}
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
