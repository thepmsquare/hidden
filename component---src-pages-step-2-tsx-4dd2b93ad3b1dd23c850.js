"use strict";(self.webpackChunkhidden=self.webpackChunkhidden||[]).push([[30],{9469:function(e,t,a){var i=a(4836);t.Z=void 0;var r=i(a(4938)),n=a(5893),l=(0,r.default)((0,n.jsx)("path",{d:"M21 10h-8.35C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H13l2 2 2-2 2 2 4-4.04L21 10zM7 15c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"}),"Key");t.Z=l},3595:function(e,t,a){var i=a(4836);t.Z=void 0;var r=i(a(4938)),n=a(5893),l=(0,r.default)((0,n.jsx)("path",{d:"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"}),"Lock");t.Z=l},9526:function(e,t,a){a.r(t),a.d(t,{Head:function(){return R},default:function(){return V}});var i=a(7294),r=a(4160),n=a(5295),l=a(245),o=a(2574),c=a(3366),s=a(7462),d=a(512),m=a(4780),g=a(1796),h=a(2077),p=a(6122),v=a(5097),u=a(5893);const f=["absolute","children","className","component","flexItem","light","orientation","role","textAlign","variant"],I=(0,h.ZP)("div",{name:"MuiDivider",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.root,a.absolute&&t.absolute,t[a.variant],a.light&&t.light,"vertical"===a.orientation&&t.vertical,a.flexItem&&t.flexItem,a.children&&t.withChildren,a.children&&"vertical"===a.orientation&&t.withChildrenVertical,"right"===a.textAlign&&"vertical"!==a.orientation&&t.textAlignRight,"left"===a.textAlign&&"vertical"!==a.orientation&&t.textAlignLeft]}})((({theme:e,ownerState:t})=>(0,s.Z)({margin:0,flexShrink:0,borderWidth:0,borderStyle:"solid",borderColor:(e.vars||e).palette.divider,borderBottomWidth:"thin"},t.absolute&&{position:"absolute",bottom:0,left:0,width:"100%"},t.light&&{borderColor:e.vars?`rgba(${e.vars.palette.dividerChannel} / 0.08)`:(0,g.Fq)(e.palette.divider,.08)},"inset"===t.variant&&{marginLeft:72},"middle"===t.variant&&"horizontal"===t.orientation&&{marginLeft:e.spacing(2),marginRight:e.spacing(2)},"middle"===t.variant&&"vertical"===t.orientation&&{marginTop:e.spacing(1),marginBottom:e.spacing(1)},"vertical"===t.orientation&&{height:"100%",borderBottomWidth:0,borderRightWidth:"thin"},t.flexItem&&{alignSelf:"stretch",height:"auto"})),(({ownerState:e})=>(0,s.Z)({},e.children&&{display:"flex",whiteSpace:"nowrap",textAlign:"center",border:0,"&::before, &::after":{content:'""',alignSelf:"center"}})),(({theme:e,ownerState:t})=>(0,s.Z)({},t.children&&"vertical"!==t.orientation&&{"&::before, &::after":{width:"100%",borderTop:`thin solid ${(e.vars||e).palette.divider}`}})),(({theme:e,ownerState:t})=>(0,s.Z)({},t.children&&"vertical"===t.orientation&&{flexDirection:"column","&::before, &::after":{height:"100%",borderLeft:`thin solid ${(e.vars||e).palette.divider}`}})),(({ownerState:e})=>(0,s.Z)({},"right"===e.textAlign&&"vertical"!==e.orientation&&{"&::before":{width:"90%"},"&::after":{width:"10%"}},"left"===e.textAlign&&"vertical"!==e.orientation&&{"&::before":{width:"10%"},"&::after":{width:"90%"}}))),w=(0,h.ZP)("span",{name:"MuiDivider",slot:"Wrapper",overridesResolver:(e,t)=>{const{ownerState:a}=e;return[t.wrapper,"vertical"===a.orientation&&t.wrapperVertical]}})((({theme:e,ownerState:t})=>(0,s.Z)({display:"inline-block",paddingLeft:`calc(${e.spacing(1)} * 1.2)`,paddingRight:`calc(${e.spacing(1)} * 1.2)`},"vertical"===t.orientation&&{paddingTop:`calc(${e.spacing(1)} * 1.2)`,paddingBottom:`calc(${e.spacing(1)} * 1.2)`}))),b=i.forwardRef((function(e,t){const a=(0,p.Z)({props:e,name:"MuiDivider"}),{absolute:i=!1,children:r,className:n,component:l=(r?"div":"hr"),flexItem:o=!1,light:g=!1,orientation:h="horizontal",role:b=("hr"!==l?"separator":void 0),textAlign:Z="center",variant:S="fullWidth"}=a,x=(0,c.Z)(a,f),y=(0,s.Z)({},a,{absolute:i,component:l,flexItem:o,light:g,orientation:h,role:b,textAlign:Z,variant:S}),N=(e=>{const{absolute:t,children:a,classes:i,flexItem:r,light:n,orientation:l,textAlign:o,variant:c}=e,s={root:["root",t&&"absolute",c,n&&"light","vertical"===l&&"vertical",r&&"flexItem",a&&"withChildren",a&&"vertical"===l&&"withChildrenVertical","right"===o&&"vertical"!==l&&"textAlignRight","left"===o&&"vertical"!==l&&"textAlignLeft"],wrapper:["wrapper","vertical"===l&&"wrapperVertical"]};return(0,m.Z)(s,v.V,i)})(y);return(0,u.jsx)(I,(0,s.Z)({as:l,className:(0,d.Z)(N.root,n),role:b,ref:t,ownerState:y},x,{children:r?(0,u.jsx)(w,{className:N.wrapper,ownerState:y,children:r}):null}))}));b.muiSkipListHighlight=!0;var Z=b,S=a(9617),x=a(9164),y=a(5991),N=a(8879),E=a(5677),k=a(7063),T=a(6693),A=a(3595),L=a(9469),C=a(4712);const z="undefined"!=typeof window,R=()=>i.createElement("title",null,"hidden");var V=e=>{let t;if(!(a=e.location.state)||null===a||!("selectedImageState"in a))return z&&(0,r.c4)("/"),"";var a;let c,s;t={selectedImage:URL.createObjectURL(e.location.state.selectedImageState.selectedImage),selectedImageName:e.location.state.selectedImageState.selectedImageName,selectedImageType:e.location.state.selectedImageState.selectedImageType},c=z?window.localStorage.getItem("theme"):null,null!==c?s="dark"===c?"dark":"light":(s=y.Z.defaultThemeState,z&&window.localStorage.setItem("theme",y.Z.defaultThemeState));const{0:d,1:m}=(0,i.useState)(s),{0:g,1:h}=(0,i.useState)({isOpen:!1,message:"",severity:"error"}),{0:p,1:v}=(0,i.useState)(t);let u=(0,S.Z)({palette:{mode:d},typography:{fontFamily:y.Z.defaultFont}});return i.createElement(x.Z,{theme:u},i.createElement("main",{className:"main",style:{backgroundImage:'url("'+(null==p?void 0:p.selectedImage)+'")'}},i.createElement(n.Z,{className:"inside-main"},i.createElement(l.Z,{align:"center"},"selected image:"," ",i.createElement(l.Z,{title:p.selectedImageName+"."+(null==p?void 0:p.selectedImageType),color:"primary",variant:"button"},p.selectedImageName.length>y.Z.step2FileNameLength.max?p.selectedImageName.slice(0,y.Z.step2FileNameLength.visibleEnds)+"..."+p.selectedImageName.slice(-y.Z.step2FileNameLength.visibleEnds)+"."+p.selectedImageType:p.selectedImageName+"."+p.selectedImageType)),i.createElement("div",{className:"button-group-container"},i.createElement(o.Z,{onClick:async()=>{p?await(0,r.c4)("/encode/",{state:{selectedImageState:{selectedImage:(0,C.Z)(p.selectedImage),selectedImageName:p.selectedImageName,selectedImageType:p.selectedImageType}}}):h({isOpen:!0,message:"Unexpected error.",severity:"error"})},variant:"contained",size:"large",startIcon:i.createElement(A.Z,null)},"hide text in image"),i.createElement(Z,{orientation:"vertical",className:"divider-vertical"},"or"),i.createElement(Z,{orientation:"horizontal",className:"divider-horizontal"},"or"),i.createElement(o.Z,{variant:"contained",onClick:async()=>{p?await(0,r.c4)("/decode/",{state:{selectedImageState:{selectedImage:(0,C.Z)(p.selectedImage),selectedImageName:p.selectedImageName,selectedImageType:p.selectedImageType}}}):h({isOpen:!0,message:"Unexpected error.",severity:"error"})},disabled:"png"!==p.selectedImageType,size:"large",startIcon:i.createElement(L.Z,null)},"get hidden text from image")),i.createElement(o.Z,{onClick:()=>{let e=document.createElement("input");e.setAttribute("type","file"),e.setAttribute("accept","image/png,image/jpeg,image/webp"),e.addEventListener("change",(e=>{(0,k.Z)(e,((e,t,a)=>{v({selectedImage:e,selectedImageName:t,selectedImageType:a})}),h)})),e.click()},variant:"outlined",startIcon:i.createElement(T.Z,null)},"change selected image"),i.createElement(N.Z,{themeState:d,customChangeThemeState:e=>{m(e),z&&window.localStorage.setItem("theme",e)}})),i.createElement(E.Z,{snackbarState:g,changeSnackbarState:h})))}}}]);
//# sourceMappingURL=component---src-pages-step-2-tsx-4dd2b93ad3b1dd23c850.js.map