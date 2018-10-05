"use strict";function _objectWithoutProperties(a,b){if(null==a)return{};var c,d,e=_objectWithoutPropertiesLoose(a,b);if(Object.getOwnPropertySymbols){var f=Object.getOwnPropertySymbols(a);for(d=0;d<f.length;d++)c=f[d],!(0<=b.indexOf(c))&&Object.prototype.propertyIsEnumerable.call(a,c)&&(e[c]=a[c])}return e}function _objectWithoutPropertiesLoose(a,b){if(null==a)return{};var c,d,e={},f=Object.keys(a);for(d=0;d<f.length;d++)c=f[d],0<=b.indexOf(c)||(e[c]=a[c]);return e}var app={rootElem:null};function testApp(){var a="\n    ".concat(createInformationTile({title:"<img src=\"logo.svg\" />",backgroundImg:"https://source.unsplash.com/random/800x800",texts:[{content:"\n                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\n                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\n                        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,\n                        no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum \n                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\n                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\n                        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,\n                        no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum \n                    "},{content:"\n                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\n                        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\n                        At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,\n                        no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum \n                    ",img:"https://source.unsplash.com/random/500x500"}]}),"\n    ").concat(createButton({text:"Start"}),"\n  ");$app.innerHTML=a}function onShowPlaceInformation(a){app.rootElem.innerHTML="\n    ".concat(createInformationTile(a),"\n    ").concat(createButton({text:"Next hint"}),"\n  ")}function onShowHint(a){app.rootElem.innerHTML="\n    ".concat(createInformationTile(a),"\n    ").concat(createButton({text:"Scan QR"}),"\n  ")}function onNotify(a){var b=a.action,c=void 0===b?function(){}:b,d=_objectWithoutProperties(a,["action"]);return new Promise(function(a){var b=createNotification(d);app.rootElem.insertAdjacentHTML("beforeend",b);var e=document.querySelector("#notificationBtn");e.addEventListener("click",function(){var b=document.querySelector("#notificationContainer");c(),b.remove(),a()})})}function waitForBtnClick(){return new Promise(function(a,b){var c=document.querySelector("#mainButton");return c?void c.addEventListener("click",a):void b("No button found!")})}window.addEventListener("load",function(){app.rootElem=document.querySelector("#app"),new ScavengerHunt({onShowPlaceInformation:onShowPlaceInformation,onShowHint:onShowHint,waitForBtnClick:waitForBtnClick,onNotify:onNotify,qrCameraContainer:"#camera",dataFolder:"data"})});