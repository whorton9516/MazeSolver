(()=>{"use strict";var e={157:e=>{e.exports=require("electron")},927:function(e,t,r){var n,o=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var o=Object.getOwnPropertyDescriptor(t,r);o&&!("get"in o?!t.__esModule:o.writable||o.configurable)||(o={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,o)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),i=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),a=this&&this.__importStar||(n=function(e){return n=Object.getOwnPropertyNames||function(e){var t=[];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[t.length]=r);return t},n(e)},function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r=n(e),a=0;a<r.length;a++)"default"!==r[a]&&o(t,e,r[a]);return i(t,e),t});Object.defineProperty(t,"__esModule",{value:!0});const u=r(157),c=a(r(928));function l(){new u.BrowserWindow({width:750,height:900,webPreferences:{nodeIntegration:!0,contextIsolation:!1}}).loadFile(c.join(__dirname,"index.html"))}u.app.whenReady().then((()=>{l(),u.app.on("activate",(()=>{0===u.BrowserWindow.getAllWindows().length&&l()}))})),u.app.on("window-all-closed",(()=>{"darwin"!==process.platform&&u.app.quit()}))},928:e=>{e.exports=require("path")}},t={};!function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,r),i.exports}(927)})();