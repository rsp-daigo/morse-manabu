(function(t){function e(e){for(var o,u,s=e[0],c=e[1],a=e[2],f=0,p=[];f<s.length;f++)u=s[f],Object.prototype.hasOwnProperty.call(r,u)&&r[u]&&p.push(r[u][0]),r[u]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(t[o]=c[o]);l&&l(e);while(p.length)p.shift()();return i.push.apply(i,a||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],o=!0,s=1;s<n.length;s++){var c=n[s];0!==r[c]&&(o=!1)}o&&(i.splice(e--,1),t=u(u.s=n[0]))}return t}var o={},r={app:0},i=[];function u(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.m=t,u.c=o,u.d=function(t,e,n){u.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},u.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},u.t=function(t,e){if(1&e&&(t=u(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)u.d(n,o,function(e){return t[e]}.bind(null,o));return n},u.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return u.d(e,"a",e),e},u.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},u.p="/morse-manabu/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var a=0;a<s.length;a++)e(s[a]);var l=c;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("2b0e"),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[t._v(" モールス信号のお勉強"),n("br"),n("button",{on:{click:t.startClick}},[t._v("Start")]),n("br"),n("span",[t._v(t._s(t.morseText))]),n("br"),t._l(t.alphabetItems,(function(e){return n("button",{key:e,on:{click:function(n){return t.resultClick(e)}}},[t._v(" "+t._s(e)+" ")])})),n("br"),t._l(t.numberItems,(function(e){return n("button",{key:e,on:{click:function(n){return t.resultClick(e)}}},[t._v(" "+t._s(e)+" ")])}))],2)},i=[],u=(n("d81d"),n("a434"),n("4fad"),n("3835")),s=(n("dca8"),Object.freeze({A:{morseText:"・－"},B:{morseText:"－・・"}})),c={components:{},data:function(){return{morseText:"",alphabetItems:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],numberItems:["0","1","2","3","4","5","6","7","8","9"],questionList:[],currentQuestion:null}},methods:{startClick:function(){this.initQuestion(),this.showNextQuestion()},initQuestion:function(){this.questionList=Object.entries(s).map((function(t){var e=Object(u["a"])(t,2),n=e[0],o=e[1];return{key:n,value:o}})),console.log(this.questionList)},showNextQuestion:function(){this.currentQuestion=this.getNextQuestion(),this.showQuestion(this.currentQuestion),this.playMorseSignal(this.currentQuestion.value.morseText)},getNextQuestion:function(){var t=this.questionList.length;0===t&&(this.initQuestion(),t=this.questionList.length);var e=Math.floor(Math.random()*Math.floor(t)),n=this.questionList[e];return this.questionList.splice(e),n},showQuestion:function(t){this.morseText=t.value.morseText},playMorseSignal:function(t){this.playAudio(t)},playAudio:function(){try{var t=new(window.AudioContext||window.webkitAudioContext),e=t.createOscillator();e.type="sine",e.frequency.value=440;var n=t.createGain();e.connect(n),n.gain.value=1,n.connect(t.destination),e.start()}catch(o){alert(o)}},resultClick:function(t){t===this.currentQuestion.key?(console.log("OK"),this.showNextQuestion()):console.log("NG")}}},a=c,l=n("2877"),f=Object(l["a"])(a,r,i,!1,null,null,null),p=f.exports;o["a"].config.productionTip=!1,new o["a"]({render:function(t){return t(p)}}).$mount("#app")}});
//# sourceMappingURL=app.dbd82f71.js.map