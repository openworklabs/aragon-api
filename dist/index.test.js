"use strict";var _interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault"),_ava=_interopRequireDefault(require("ava")),_sinon=_interopRequireDefault(require("sinon")),_proxyquire=_interopRequireDefault(require("proxyquire")),_rxjs=require("rxjs");const Index=_proxyquire.default.noCallThru().load("./index",{"@aragon/rpc-messenger":{}});async function sleep(time){return new Promise(resolve=>setTimeout(resolve,time))}function createDeferredStub(observable){return _sinon.default.stub().returns((0,_rxjs.defer)(()=>observable))}function subscribe(observable,handler){// Mimic an async delay to test the deferred behaviour
sleep(10),observable.subscribe(handler)}_ava.default.afterEach.always(()=>{_sinon.default.restore()}),(0,_ava.default)("should send intent when the method does not exist in target",t=>{t.plan(2);// arrange
const observable=(0,_rxjs.of)({id:"uuid1",result:10}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponse:createDeferredStub(observable)}// act
},result=Index.AppProxyHandler.get(instanceStub,"add")(5);// assert
subscribe(result,value=>{t.is(value,10)}),t.true(instanceStub.rpc.sendAndObserveResponse.calledOnceWith("intent",["add",5]))}),(0,_ava.default)("should return the network details as an observable",t=>{t.plan(2);// arrange
const networkDetails={id:4,type:"rinkeby"},networkFn=Index.AppProxy.prototype.network,observable=(0,_rxjs.of)({jsonrpc:"2.0",id:"uuid1",result:networkDetails}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponses:createDeferredStub(observable)}// act
},result=networkFn.call(instanceStub);// assert
subscribe(result,value=>{t.deepEqual(value,networkDetails)}),t.truthy(instanceStub.rpc.sendAndObserveResponses.calledOnceWith("network"))}),(0,_ava.default)("should return the accounts as an observable",t=>{t.plan(2);// arrange
const accountsFn=Index.AppProxy.prototype.accounts,observable=(0,_rxjs.of)({jsonrpc:"2.0",id:"uuid1",result:["accountX","accountY","accountZ"]}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponses:createDeferredStub(observable)}// act
},result=accountsFn.call(instanceStub);// assert
subscribe(result,value=>{t.deepEqual(value,["accountX","accountY","accountZ"])}),t.truthy(instanceStub.rpc.sendAndObserveResponses.calledOnceWith("accounts"))}),(0,_ava.default)("should send a getApps request for the current app and observe the single response",t=>{t.plan(3);const currentApp={appAddress:"0x456",appId:"counterApp",appImplementationAddress:"0xcounterApp",identifier:"counter",isForwarder:!1,kernelAddress:"0x123",name:"Counter"// arrange
},currentAppFn=Index.AppProxy.prototype.currentApp,observable=(0,_rxjs.of)({jsonrpc:"2.0",id:"uuid1",result:currentApp}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponse:createDeferredStub(observable)}// act
},result=currentAppFn.call(instanceStub);// assert
subscribe(result,value=>{t.is(value.icon(),void 0),delete value.icon,t.deepEqual(value,currentApp)}),t.true(instanceStub.rpc.sendAndObserveResponse.calledOnceWith("get_apps"))}),(0,_ava.default)("should send a getApps request for installed apps and observe the response",t=>{const initialApps=[{appAddress:"0x123",appId:"kernel",appImplementationAddress:"0xkernel",identifier:void 0,isForwarder:!1,kernelAddress:void 0,name:"Kernel"}],endApps=[].concat(initialApps,{appAddress:"0x456",appId:"counterApp",appImplementationAddress:"0xcounterApp",identifier:"counter",isForwarder:!1,kernelAddress:"0x123",name:"Counter"}),installedAppsFn=Index.AppProxy.prototype.installedApps,observable=(0,_rxjs.of)({jsonrpc:"2.0",id:"uuid1",result:initialApps},{jsonrpc:"2.0",id:"uuid1",result:endApps}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponses:createDeferredStub(observable)}// act
},result=installedAppsFn.call(instanceStub);// assert
let emitIndex=0;subscribe(result,value=>{value.forEach(app=>{t.is(app.icon(),void 0),delete app.icon}),0==emitIndex?t.deepEqual(value,initialApps):1==emitIndex?t.deepEqual(value,endApps):t.fail("too many emissions"),emitIndex++}),t.true(instanceStub.rpc.sendAndObserveResponses.calledOnceWith("get_apps"))}),(0,_ava.default)("should send an identify request",t=>{t.plan(1);// arrange
const identifyFn=Index.AppProxy.prototype.identify,instanceStub={rpc:{send:_sinon.default.stub()}// act
};// assert
identifyFn.call(instanceStub,"ANT"),t.true(instanceStub.rpc.send.calledOnceWith("identify",["ANT"]))}),(0,_ava.default)("should send a path request and observe the response",t=>{t.plan(3);// arrange
const pathFn=Index.AppProxy.prototype.path,observable=(0,_rxjs.of)({jsonrpc:"2.0",id:"uuid1",result:"path1"},{jsonrpc:"2.0",id:"uuid1",result:"path2"}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponses:createDeferredStub(observable)}// act
},result=pathFn.call(instanceStub);// assert
let emitIndex=0;subscribe(result,value=>{0==emitIndex?t.deepEqual(value,"path1"):1==emitIndex?t.deepEqual(value,"path2"):t.fail("too many emissions"),emitIndex++}),t.true(instanceStub.rpc.sendAndObserveResponses.calledOnceWith("path",["observe"]))}),(0,_ava.default)("should send a path modification request",t=>{t.plan(2);// arrange
const requestPathFn=Index.AppProxy.prototype.requestPath,observable=(0,_rxjs.of)({jsonrpc:"2.0",id:"uuid1",result:null}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponse:createDeferredStub(observable)}// act
},result=requestPathFn.call(instanceStub,"new_path");// assert
subscribe(result,value=>t.is(value,null)),t.true(instanceStub.rpc.sendAndObserveResponse.calledOnceWith("path",["modify","new_path"]))}),(0,_ava.default)("should send a trigger emission",t=>{t.plan(1);// arrange
const eventData={testprop:"123abc"},emitTriggerFn=Index.AppProxy.prototype.emitTrigger,instanceStub={rpc:{send:_sinon.default.stub()}// act
};// assert
emitTriggerFn.call(instanceStub,"TestTrigger",eventData),t.true(instanceStub.rpc.send.calledOnceWith("trigger",["emit","TestTrigger",eventData]))}),(0,_ava.default)("should return the triggers observable",t=>{t.plan(2);// arrange
const triggersFn=Index.AppProxy.prototype.triggers,observable=(0,_rxjs.of)({id:"uuid1",result:["eventA","eventB"]}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponses:createDeferredStub(observable)}// act
},result=triggersFn.call(instanceStub);// TODO
// assert
subscribe(result,value=>{// TODO
t.deepEqual(value,["eventA","eventB"])}),t.true(instanceStub.rpc.sendAndObserveResponses.calledOnceWith("trigger",["observe"]))}),(0,_ava.default)("should return the events observable",t=>{t.plan(2);// arrange
const eventsFn=Index.AppProxy.prototype.events,observable=(0,_rxjs.of)({id:"uuid1",result:["eventA","eventB"]}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponses:createDeferredStub(observable)}// act
},result=eventsFn.call(instanceStub);// assert
subscribe(result,value=>{t.deepEqual(value,["eventA","eventB"])}),t.true(instanceStub.rpc.sendAndObserveResponses.calledOnceWith("events",["allEvents",{}]))}),(0,_ava.default)("should return an handle for an external contract events",t=>{t.plan(2);const externalFn=Index.AppProxy.prototype.external,observableEvents=(0,_rxjs.of)({id:"uuid1",result:{name:"eventA",value:3e3}}),jsonInterfaceStub=[{type:"event",name:"SetPermission"}],instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponses:createDeferredStub(observableEvents)}// act
},result=externalFn.call(instanceStub,"0xextContract",jsonInterfaceStub),eventsObservable=result.events({fromBlock:2});// arrange
// assert
subscribe(eventsObservable,value=>{t.deepEqual(value,{name:"eventA",value:3e3})}),t.true(instanceStub.rpc.sendAndObserveResponses.calledOnceWith("external_events",["0xextContract",[jsonInterfaceStub[0]],"allEvents",{fromBlock:2}]))}),(0,_ava.default)("should return a handle for creating external calls",t=>{t.plan(2);// arrange
const externalFn=Index.AppProxy.prototype.external,observableCall=(0,_rxjs.of)({id:"uuid4",result:"bob was granted permission for the counter app"}),jsonInterfaceStub=[{type:"function",name:"grantPermission",constant:!0}],instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponse:createDeferredStub(observableCall)}// act
},result=externalFn.call(instanceStub,"0xextContract",jsonInterfaceStub),callResult=result.grantPermission("0xbob","0xcounter");// assert
subscribe(callResult,value=>{t.is(value,"bob was granted permission for the counter app")}),t.true(instanceStub.rpc.sendAndObserveResponse.calledOnceWith("external_call",["0xextContract",jsonInterfaceStub[0],"0xbob","0xcounter"]))}),(0,_ava.default)("should return a handle for creating external transaction intents",t=>{t.plan(2);// arrange
const externalFn=Index.AppProxy.prototype.external,observableIntent=(0,_rxjs.of)({id:"uuid4",result:10}),jsonInterfaceStub=[{type:"function",name:"add",constant:!1}],instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponse:createDeferredStub(observableIntent)}// act
},result=externalFn.call(instanceStub,"0xextContract",jsonInterfaceStub),intentResult=result.add(10);// assert
subscribe(intentResult,value=>{t.is(value,10)}),t.true(instanceStub.rpc.sendAndObserveResponse.calledOnceWith("external_intent",["0xextContract",jsonInterfaceStub[0],10]))}),(0,_ava.default)("should return the state from cache",t=>{t.plan(3);// arrange
const stateFn=Index.AppProxy.prototype.state,stateObservable=new _rxjs.Subject,instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponses:createDeferredStub(stateObservable)}// act
},result=stateFn.call(instanceStub);t.true(instanceStub.rpc.sendAndObserveResponses.calledOnceWith("cache",["observe","state"]));let counter=0;// send state events
subscribe(result,value=>{0==counter?t.deepEqual(value,{counter:5}):1==counter&&t.deepEqual(value,{counter:6}),counter++}),stateObservable.next({id:"uuid1",result:{counter:5}}),stateObservable.next({id:"uuid1",result:{counter:6}})}),(0,_ava.default)("should create a store and reduce correctly without previously cached state",async t=>{t.plan(2);// arrange
const storeFn=Index.AppProxy.prototype.store,observableEvents=new _rxjs.Subject,instanceStub={accounts:()=>(0,_rxjs.from)([["0x0000000000000000000000000000000000000abc"]]),cache:()=>(0,_rxjs.of)(),events:createDeferredStub(observableEvents),getCache:()=>(0,_rxjs.from)([null]),pastEvents:()=>(0,_rxjs.of)([]),triggers:()=>(0,_rxjs.of)(),web3Eth:_sinon.default.stub().withArgs("getBlockNumber").returns((0,_rxjs.from)(["4385398"]))},result=storeFn.call(instanceStub,(state,action)=>{switch(null===state&&(state={actionHistory:[],counter:0}),action.event){case"Add":return state.actionHistory.push(action),state.counter+=action.payload,state;case"Subtract":return state.actionHistory.push(action),state.counter-=action.payload,state;}return state});// assert
// send events; wait to avoid grouping through debounce
subscribe(result,value=>{2===value.counter&&t.deepEqual(value.actionHistory,[{event:"Add",payload:2}]),12===value.counter&&t.deepEqual(value.actionHistory,[{event:"Add",payload:2},{event:"Add",payload:10}])}),await sleep(250),observableEvents.next({event:"Add",payload:2}),await sleep(1200),observableEvents.next({event:"Add",payload:10}),await sleep(1200)}),(0,_ava.default)("should create a store and reduce correctly with previously cached state",async t=>{t.plan(2);// arrange
const storeFn=Index.AppProxy.prototype.store,observableEvents=new _rxjs.Subject,instanceStub={accounts:()=>(0,_rxjs.from)([["0x0000000000000000000000000000000000000abc"]]),cache:()=>(0,_rxjs.of)(),events:createDeferredStub(observableEvents),getCache:()=>(0,_rxjs.of)({state:{actionHistory:[{event:"Add",payload:5}],counter:5},blockNumber:1}),pastEvents:()=>(0,_rxjs.of)([]),triggers:()=>(0,_rxjs.of)(),web3Eth:_sinon.default.stub().withArgs("getBlockNumber").returns((0,_rxjs.from)(["4385398"]))},result=storeFn.call(instanceStub,(state,action)=>{switch(null===state&&(state={actionHistory:[],counter:0}),action.event){case"Add":return state.actionHistory.push(action),state.counter+=action.payload,state;case"Subtract":return state.actionHistory.push(action),state.counter-=action.payload,state;}return state});// assert
// send events; wait to avoid grouping through debounce
subscribe(result,value=>{5===value.counter&&t.deepEqual(value.actionHistory,[{event:"Add",payload:5}]),7===value.counter&&t.deepEqual(value.actionHistory,[{event:"Add",payload:5},{event:"Add",payload:2}]),17===value.counter&&t.deepEqual(value.actionHistory,[{event:"Add",payload:5},{event:"Add",payload:2},{event:"Add",payload:10}])}),await sleep(250),observableEvents.next({event:"Add",payload:2}),await sleep(1200),observableEvents.next({event:"Add",payload:10}),await sleep(1200)}),(0,_ava.default)("should perform a call to the contract and observe the response",t=>{t.plan(2);// arrange
const callFn=Index.AppProxy.prototype.call,observable=(0,_rxjs.of)({id:"uuid1",result:"success"}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponse:createDeferredStub(observable)}// act
},result=callFn.call(instanceStub,"transferEth",10);// assert
subscribe(result,value=>{t.deepEqual(value,"success")}),t.true(instanceStub.rpc.sendAndObserveResponse.calledOnceWith("call",["transferEth",10]))}),(0,_ava.default)("should send a describeScript request and observe the response",t=>{t.plan(2);// arrange
const describeScriptFn=Index.AppProxy.prototype.describeScript,observable=(0,_rxjs.of)({id:"uuid1",result:"script executed"}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponse:createDeferredStub(observable)}// act
},result=describeScriptFn.call(instanceStub,"goto fail");// assert
subscribe(result,value=>{t.deepEqual(value,"script executed")}),t.true(instanceStub.rpc.sendAndObserveResponse.calledOnceWith("describe_script",["goto fail"]))}),(0,_ava.default)("should send a web3Eth function request and observe the response",t=>{t.plan(2);// arrange
const web3EthFn=Index.AppProxy.prototype.web3Eth,observable=(0,_rxjs.of)({id:"uuid1",result:["accountA","accountB"]}),instanceStub={rpc:{// Mimic behaviour of @aragon/rpc-messenger
sendAndObserveResponse:createDeferredStub(observable)}// act
},result=web3EthFn.call(instanceStub,"getAccounts",5);// assert
subscribe(result,value=>{t.deepEqual(value,["accountA","accountB"])}),t.true(instanceStub.rpc.sendAndObserveResponse.calledOnceWith("web3_eth",["getAccounts",5]))});
//# sourceMappingURL=index.test.js.map