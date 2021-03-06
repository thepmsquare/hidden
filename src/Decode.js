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
	TextField,
} from "@fluentui/react";
import { Icon } from "@fluentui/react/lib/Icon";
import CryptoJS from "crypto-js";
import "./stylesheets/Decode.css";

class Decode extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedImage: null,
			password: "",
			isTeachingBubbleVisible: false,
			messageBarMessage: "",
			isLoading: false,
			result: null,
			copied: false,
			requestStatus: "",
		};
	}
	uploadPhoto = () => {
		let input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/png");
		input.click();
		input.onchange = this.getSelectedImage;
	};
	onInputChange = (e) => {
		const name = e.target.getAttribute("name");
		this.setState(() => {
			return {
				[name]: e.target.value,
			};
		});
	};
	getSelectedImage = (e) => {
		clearTimeout(this.timeoutid);
		const indexOfPath = e.target.files[0].name.lastIndexOf(".");
		const filetype = e.target.files[0].name
			.substr(indexOfPath + 1)
			.toLowerCase();
		if (filetype === "png") {
			const fReader = new FileReader();
			fReader.readAsDataURL(e.target.files[0]);
			fReader.onloadend = (event) => {
				this.setState(() => {
					return { selectedImage: event.target.result };
				});
			};
		} else {
			this.setState(() => {
				return {
					messageBarMessage:
						"Unsupported image format. Currently supported formats: image/png.",
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
			const url = "https://hiddenapi.herokuapp.com/decode";
			// const url = "http://127.0.0.1:8000/decode";
			let fd = new FormData();
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
						isLoading: true,
						requestStatus: "Processing... ",
					};
				});
				const data = await response.json();
				if (response.status === 200) {
					let message = data.message;
					if (this.state.password) {
						try {
							let bytes = CryptoJS.AES.decrypt(
								data.message,
								this.state.password
							);
							message = bytes.toString(CryptoJS.enc.Utf8);
						} catch (error) {
							throw new Error("Wrong Password.");
						}

						if (message === "") {
							throw new Error("Wrong Password.");
						}
					}

					this.setState(() => {
						return {
							isLoading: false,
							result: message,
							selectedImage: null,
							password: "",
							requestStatus: "",
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
				copied: false,
			};
		});
	};

	copyToClipboard = async () => {
		await navigator.clipboard.writeText(this.state.result);
		this.setState(() => {
			return { copied: true };
		});
	};
	hideTeachingBubble = () => {
		this.setState(() => {
			return {
				isTeachingBubbleVisible: false,
			};
		});
	};
	render = () => {
		return (
			<form
				className="Decode"
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
						<span className="Decode-submitButton">
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
						headline="Upload a Photo to decode message."
					></TeachingBubble>
				)}
				<Dialog hidden={!this.state.result} onDismiss={this.hideDialog}>
					<div className="Decode-dialog">
						<Text variant="xLarge">Message Decoded</Text>
						<Text className="Decode-dialogResult">
							{this.state.result ? this.state.result : ""}
						</Text>
						<DefaultButton
							onClick={this.copyToClipboard}
							text={this.state.copied ? "Copy Again?" : "Copy to clipboard"}
						/>
						<DefaultButton onClick={this.hideDialog} text="Close" />
					</div>
				</Dialog>
			</form>
		);
	};
}

export default Decode;
