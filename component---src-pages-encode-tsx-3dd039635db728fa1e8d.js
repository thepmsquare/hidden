"use strict";(self.webpackChunkhidden=self.webpackChunkhidden||[]).push([[487],{9780:function(e,t,a){a.r(t),a.d(t,{Head:function(){return y}});var l=a(7294),n=a(4160),s=a(5295),c=a(245),r=a(7129),i=a(2574),m=a(9617),o=a(9164),d=a(1354),g=a.n(d),h=a(5991),u=a(8879),p=a(5677),I=a(7063),S=a(4712),w=a(6693),E=a(1023),f=a(2143);const Z="undefined"!=typeof window,y=()=>l.createElement("title",null,"encode | hidden");t.default=e=>{let t;if(!(a=e.location.state)||null===a||!("selectedImageState"in a))return Z&&(0,n.c4)("/"),"";var a;let d,y;t={selectedImage:URL.createObjectURL(e.location.state.selectedImageState.selectedImage),selectedImageName:e.location.state.selectedImageState.selectedImageName,selectedImageType:e.location.state.selectedImageState.selectedImageType},d=Z?window.localStorage.getItem("theme"):null,null!==d?y="dark"===d?"dark":"light":(y=h.Z.defaultThemeState,Z&&window.localStorage.setItem("theme",h.Z.defaultThemeState));const{0:b,1:v}=(0,l.useState)(y),{0:N,1:k}=(0,l.useState)({isOpen:!1,message:"",severity:"error"}),{0:T,1:C}=(0,l.useState)(t),{0:x,1:A}=(0,l.useState)(""),{0:F,1:L}=(0,l.useState)(""),D=e=>{let t="",a="";try{for(let l=0;l<e.length;l++){const n=e.charCodeAt(l);let s=n.toString(2);if(a="",n<128)a=s.padStart(8,"0");else if(n<2048)s=s.padStart(11,"0"),a="110"+s.slice(0,5)+"10"+s.slice(5,12);else if(n<65536)s=s.padStart(16,"0"),a="1110"+s.slice(0,4)+"10"+s.slice(4,10)+"10"+s.slice(10,16);else{if(!(n<=1114111))throw new Error;s=s.padStart(21,"0"),a="11110"+s.slice(0,3)+"10"+s.slice(3,9)+"10"+s.slice(9,15)+"10"+s.slice(15,21)}t+=a}return t}catch(l){throw new Error("Unexpected error while processing the message text.")}};let R=(0,m.Z)({palette:{mode:b},typography:{fontFamily:h.Z.defaultFont}});return l.createElement(o.Z,{theme:R},l.createElement("main",{className:"main",style:{backgroundImage:'url("'+(null==T?void 0:T.selectedImage)+'")'}},l.createElement(s.Z,{className:"inside-main"},l.createElement(c.Z,null,"selected image:"," ",l.createElement(c.Z,{title:T.selectedImageName+"."+(null==T?void 0:T.selectedImageType),color:"primary",variant:"button"},T.selectedImageName.length>h.Z.step2FileNameLength.max?T.selectedImageName.slice(0,h.Z.step2FileNameLength.visibleEnds)+"..."+T.selectedImageName.slice(-h.Z.step2FileNameLength.visibleEnds)+"."+T.selectedImageType:T.selectedImageName+"."+T.selectedImageType)),l.createElement("form",{className:"form",onSubmit:async e=>{e.preventDefault();try{const e=new Image;e.src=T.selectedImage;const t=document.createElement("canvas");t.width=e.width,t.height=e.height;const a=t.getContext("2d",{colorSpace:"srgb"});if(null===a)throw Error("unexpected error.");let l;a.drawImage(e,0,0),l=D(F?g().AES.encrypt(x,F).toString():x);const s=a.getImageData(0,0,t.width,t.height);let c,r,i=new ImageData(t.width,t.height);[i,c,r]=((e,t,a,l,n)=>{let s=e.data,c=n.data,r=t+h.Z.messageAppendedAtEnd,i=r.length;if(i>a*l*3*2)throw new Error("Image with more pixels needed for encoding current message.");let m=Math.ceil(i/6),o=m/(a*l)*100,d=0;for(let g=0;g<r.length;g+=6){const e=r.slice(g,g+2),t=r.slice(g+2,g+4),a=r.slice(g+4,g+6);let l=parseInt(c[d].toString(),10).toString(2).padStart(8,"0").slice(0,6)+e,n=""!==t?parseInt(c[d+1].toString(),10).toString(2).padStart(8,"0").slice(0,6)+t:c[d+1].toString(),i=""!==a?parseInt(c[d+2].toString(),10).toString(2).padStart(8,"0").slice(0,6)+a:c[d+2].toString(),m=parseInt(l,2),o=parseInt(n,2),h=parseInt(i,2);s[d]=m,s[d+1]=o,s[d+2]=h,s[d+3]=c[d+3],d+=4}for(;d<c.length;d++)s[d]=c[d];return[e,m,o]})(i,l,e.width,e.height,s),a.putImageData(i,0,0);const m=t.toDataURL("image/png");await(0,n.c4)("/encode_share/",{state:{selectedImageName:T.selectedImageName,newDataBlob:(0,S.Z)(m),numPixelsToChange:c,percentImageChange:r}})}catch(t){k({isOpen:!0,message:t.message,severity:"error"})}}},l.createElement(r.Z,{placeholder:"enter text to hide in selected image",value:x,onChange:e=>A(e.target.value),required:!0,rows:3,multiline:!0,autoFocus:!0,label:"message"}),l.createElement(f.Z,{value:F,onChange:e=>L(e.target.value),uniqueIdForARIA:"encode-password",variant:"outlined",label:"optional password",others:{}}),l.createElement(i.Z,{type:"submit",size:"large",variant:"contained"},"submit")),l.createElement(i.Z,{onClick:()=>{let e=document.createElement("input");e.setAttribute("type","file"),e.setAttribute("accept","image/png,image/jpeg,image/webp"),e.addEventListener("change",(e=>{(0,I.Z)(e,((e,t,a)=>{C({selectedImage:e,selectedImageName:t,selectedImageType:a})}),k)})),e.click()},variant:"outlined",startIcon:l.createElement(w.Z,null)},"change selected image"),l.createElement(u.Z,{themeState:b,customChangeThemeState:e=>{v(e),Z&&window.localStorage.setItem("theme",e)}}),l.createElement(i.Z,{onClick:async()=>{await(0,n.c4)("/step2/",{state:{selectedImageState:{selectedImage:(0,S.Z)(T.selectedImage),selectedImageName:T.selectedImageName,selectedImageType:T.selectedImageType}}})},variant:"outlined",size:"small",startIcon:l.createElement(E.Z,null)},"go back")),l.createElement(p.Z,{snackbarState:N,changeSnackbarState:k})))}}}]);
//# sourceMappingURL=component---src-pages-encode-tsx-3dd039635db728fa1e8d.js.map