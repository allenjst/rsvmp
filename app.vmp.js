/**
 * ruishu 补环境
 * @param {string} RSScript - 首页 HTML 内的 $_ts 对象加外链 JavaScript 代码。
 * @param {string} RSURL - 远程脚本的 URL。默认会给 URL 加密生成后缀，里面会使用 new URL 解析 URL。
 * @param {object} RSData - 提交的数据。如果不需要数据，则传入空字符串。
 * @param {string} RSUA - 浏览器 User-Agent 字符串，建议使用 Windows 10 64 位 Chrome 的 UA 以避免与环境不匹配。
 */


const v8 = require("v8");
const vm = require("vm");
console.time('耗时')

function RSSolve(RSScript, RSURL, RSData, RSUA, RSHook){
    if(!RSScript || !RSURL){
        throw new Error('Missing required parameters script or url.')
    };

    window = globalThis || global;
    debugger
    window.sdbx = {
        open: false,  // 关闭代理
        log: console.log,
        mouseEvent: [],
        timeEvent: [],
        memory: {},
        private: Symbol('private'),
        Opt: {},
    };
    sdbx.Opt.content = "_hGhW20j4HK8OwpK2DcnVyt1jFTqJ3lOazPjPNtDLYHZwP0mDmMZOv9n6cszaJ2FoBSdFA5K0e5BW0kGTZF0Ya"; // TODO 不影响cookie 不用替换
    sdbx.Opt.url = RSURL;
    sdbx.Opt.platform = 'Win32';
    sdbx.Opt.userAgent = RSUA || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Version/8.0(Rs) Chrome/92.0.4515.131 Safari/537.36';
    sdbx.Opt.appVersion = sdbx.Opt.userAgent.substring(sdbx.Opt.userAgent.indexOf('/') + 1);
    sdbx.memory.url = new URL(sdbx.Opt.url);
    sdbx.memory.cookie = "";
    Object.defineProperty(sdbx, Symbol.toStringTag, {value: 'SDBX'});

    !function(){
        const v8 = require('v8');
        const vm = require('vm');
        v8.setFlagsFromString('--allow-natives-syntax');
        window.sdbx.memory.undetectable = vm.runInThisContext('%GetUndetectable()')
        v8.setFlagsFromString('--no-allow-natives-syntax');
    }();

    !function(){
        const Fun2Str = Function.toString;
        const funMaps = new Map();
        Object.defineProperty(Function.prototype, 'toString', {
            value() {
                return typeof this === 'function' && funMaps.get(this) || Fun2Str.call(this);
            }
        });
        Object.defineProperty(Function.prototype.toString, 'name', { value: 'toString' });
        funMaps.set(Function.prototype.toString, 'function toString() { [native code] }')
        sdbx.safeFun = function(fun, funName){
            !funMaps.has(fun) && funMaps.set(fun, `function ${funName || fun.name || ""}() { [native code] }`)
        };
        sdbx.safeFun(Event, 'Event');
        sdbx.safeFun(console.log, 'log');
        sdbx.safeFun(URL, 'URL');
        sdbx.safeFun(TextDecoder, 'TextDecoder');
        sdbx.safeFun(TextEncoder, 'TextEncoder');
        sdbx.safeFun(URLSearchParams, 'URLSearchParams');
    }();
    sdbx.renameFun = function(fun, funName){
        sdbx.safeFun(fun, funName);
        Object.defineProperty(fun, 'name', {value: funName, writable: false, enumerable: false, configurable: true})
    };
    sdbx.renameClass = function(proto, protoName){
        sdbx.safeFun(proto, protoName);
        Object.defineProperty(proto.prototype, Symbol.toStringTag, {value: protoName, writable: false, enumerable: false, configurable: true})
    };
    sdbx.defineProperty = function(obj, prop, descriptor) {
        const { configurable, enumerable, value, writable, get, set } = descriptor;
        const descript = { configurable, enumerable };
        if ('value' in descriptor) {
            if (typeof value === 'function') {
                sdbx.renameFun(value, prop);
            }
            Object.assign(descript, { writable, value });
        } else if (set) {
            sdbx.renameFun(get, `get ${prop}`);
            sdbx.renameFun(set, `set ${prop}`);
            Object.assign(descript, { get, set });
        } else {
            sdbx.renameFun(get, `get ${prop}`);
            Object.assign(descript, { get, set: undefined });
        }
        Object.defineProperty(obj, prop, descript);
    };
    sdbx.setPrivate = function(k, v){
        if(!this[sdbx.private]){
            Object.defineProperty(this, sdbx.private, {value: {}, enumerable: false})
        }
        this[sdbx.private][k] = v;
    };
    sdbx.getPrivate = function(k){
        return this[sdbx.private][k];
    };
    sdbx.proxy = function(obj, name) {
        if(!sdbx.open){return obj};
        return new Proxy(obj, {
            get(target, property, receiver) {
                const result = Reflect.get(target, property, receiver);
                sdbx.log(`[*] [proxy get] ${name}`, property, result);
                return result;
            },
            set(target, property, value, receiver) {
                const result = Reflect.set(target, property, value, receiver);
                sdbx.log(`[*] [proxy set] ${name}`, property, value);
                return result;
            },
            apply(target, thisArg, argumentsList) {
                const result = Reflect.apply(target, thisArg, argumentsList);
                sdbx.log(`[*] [proxy apply] ${name}`, thisArg, result);
                return result;
            }
        });
    };
    sdbx.random = function(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min};


    class MimeType {
        constructor(type, plugin) {
            Object.defineProperty(this, sdbx.private, {
                value: { enabledPlugin: plugin, 'type': type },
                enumerable: false, configurable: true
            })

        }
        get enabledPlugin() { return this[sdbx.private]['enabledPlugin'] }

        get type() { return this[sdbx.private]['type'] }

        get description() { return "Portable Document Format" }

        get suffixes() { return "pdf" }

        get [Symbol.toStringTag]() { return 'MimeType' }

    };sdbx.renameClass(MimeType, 'MimeType');

    class Plugin{
        constructor(name) {

            this[0] = new MimeType("application/pdf", this);
            this[1] = new MimeType("text/pdf", this);

            Object.defineProperties(this, {
                "application/pdf": {
                    value: this[0],
                    writable: false, enumerable: false, configurable: true
                },
                "text/pdf": {
                    value: this[1],
                    writable: false, enumerable: false, configurable: true
                },
                [sdbx.private]: {
                    value: { name: name },
                    enumerable: false, configurable: true
                }
            });
        }

        get name() { return this[sdbx.private]['name'] }

        get description() { return "Portable Document Format" }

        get filename() { return "internal-pdf-viewer" }

        get length() { return 2 }

        get [Symbol.toStringTag]() { return 'Plugin' }

    };sdbx.renameClass(Plugin, 'Plugin');

    class PluginArray{
        constructor(key){
            if(key!='new'){throw new TypeError("Illegal constructor")}

            const nameList = ["PDF Viewer", "Chrome PDF Viewer", "Chromium PDF Viewer", "Microsoft Edge PDF Viewer", "WebKit built-in PDF"];

            nameList.map((value, index) => {

                let plugin = new Plugin(value);
                Object.defineProperties(this, {
                    [index]: {
                        value: plugin,
                        writable: false, enumerable: true, configurable: true
                    },
                    [plugin.name]: {
                        value: plugin,
                        writable: false, enumerable: false, configurable: true
                    },

                });

            })
        }

        get length() { return 5 }

        get [Symbol.toStringTag]() { return 'PluginArray' }

    };sdbx.renameClass(PluginArray, 'PluginArray');

    class MimeTypeArray{
        constructor(key){
            if(key!='new'){throw new TypeError("Illegal constructor")}

            this[0] = new MimeType("application/pdf", sdbx.memory.plugins[0][0].enabledPlugin);
            this[1] = new MimeType("text/pdf", sdbx.memory.plugins[0][0].enabledPlugin);

            Object.defineProperties(this, {
                ['application/pdf']: {
                    value: this[0] ,
                    writable: false, enumerable: false, configurable: true
                },
                ['text/pdf']: {
                    value: this[1] ,
                    writable: false, enumerable: false, configurable: true
                },
            });
        }

        get length() { return 2 }

        get [Symbol.toStringTag]() { return 'MimeTypeArray' }

    };sdbx.renameClass(MimeTypeArray, 'MimeTypeArray');

    // TODO 
    sdbx.memory.plugins = new PluginArray('new');
    sdbx.memory.mimeTypes = new MimeTypeArray('new');

    class Screen{
        constructor(key){
            if(key!='new'){throw new TypeError("Illegal constructor")}
            this.availHeight = 824;
            this.availLeft = 0;
            this.availTop = 0;
            this.availWidth = 1536;
            this.colorDepth = 24;
            this.height = 864;
            this.pixelDepth = 24;
            this.width = 1536;
        }

        get [Symbol.toStringTag]() { return 'Screen' }

    };sdbx.renameClass(Screen, 'Screen');

    class Storage{
        constructor(key){if(key!='new'){throw new TypeError("Illegal constructor")}}
        setItem(k, v){ this[k] = v }
        getItem(k){ return this[k] || null }
        removeItem(k){ delete this[k] }
        clear(){ Object.keys(this).forEach(key => { delete this[key] }) }
        key(i){ return Object.values(this)[i] || null }
        get length(){ return Object.keys(this).length }
        get [Symbol.toStringTag]() { return 'Storage' }
    };sdbx.renameClass(Storage, 'Storage');

    class NetworkInformation{
        constructor(key){
            if(key!='new'){throw new TypeError("Illegal constructor")}
            this.downlink = 8.6;
            this.effectiveType = "4g";
            this.onchange = null;
            this.rtt = 50;
            this.saveData = false;
        }

        get [Symbol.toStringTag]() { return 'NetworkInformation' }

    };sdbx.renameClass(NetworkInformation, 'NetworkInformation');

    class BatteryManager{
        constructor(key){
            if(key!='new'){throw new TypeError("Illegal constructor")}
            this.charging = true
            this.chargingTime = Infinity
            this.dischargingTime = Infinity
            this.level = 1
            this.onchargingchange = null
            this.onchargingtimechange = null
            this.ondischargingtimechange = null
            this.onlevelchange = null
        }
    };sdbx.safeFun(BatteryManager, 'BatteryManager');


    Navigator = function Navigator(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(Navigator, 'Navigator');
    sdbx.defineProperty(Navigator.prototype, 'webdriver', {get(){return false}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'productSub', {get(){return '20030107'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'vendorSub', {get(){return ''}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'vendor', {get(){return 'Google Inc.'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'language', {get(){return 'zh-CN'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'languages', {get(){return ['zh-CN']}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'userAgent', {get(){return sdbx.Opt.userAgent}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'plugins', {get(){return sdbx.memory.plugins}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'mimeTypes', {get(){return sdbx.memory.mimeTypes}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'platform', {get(){return sdbx.Opt.platform}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'product', {get(){return 'Gecko'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'cookieEnabled', {get(){return true}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'doNotTrack', {get(){return null}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'appName', {get(){return 'Netscape'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'appCodeName', {get(){return 'Mozilla'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'appVersion', {get(){return sdbx.Opt.appVersion}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'maxTouchPoints', {get(){return 0}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'deviceMemory', {get(){return 32}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'hardwareConcurrency', {get(){return 24}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'pdfViewerEnabled', {get(){return true}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'onLine', {get(){return true}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'webkitPersistentStorage', {get(){return sdbx.proxy(new class DeprecatedStorageQuota{}, 'navigator.webkitPersistentStorage')}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'connection', {get(){return sdbx.proxy(new NetworkInformation('new'), 'navigator.connection')}, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'vibrate', {value(){debugger},writable: true, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'javaEnabled', {value(){return false},writable: true, enumerable: true, configurable: true});
    sdbx.defineProperty(Navigator.prototype, 'getBattery', {value(){
        if (Object.getOwnPropertyDescriptor(this, 'constructor')) { throw new TypeError("Failed to execute 'getBattery' on 'Navigator': Illegal invocation") };
        const battery = sdbx.proxy(new BatteryManager('new'), 'navigator.getBattery');
        const result = {then: function then(callBack){return callBack(battery)}};
        sdbx.safeFun(result.then, 'then');Object.setPrototypeOf(result, Promise.prototype);
        return result
    },writable: true, enumerable: true, configurable: true});
    sdbx.renameClass(Navigator, 'Navigator');
    navigator = new Navigator('new');


    Location = function Location(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(Location, 'Location');
    location = new Location('new');
    sdbx.defineProperty(location, 'href', {get(){return sdbx.memory.url.href}, set(v){return sdbx.memory.url.href = v},enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'pathname', {get(){return sdbx.memory.url.pathname}, set(v){return sdbx.memory.url.pathname = v},enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'port', {get(){return sdbx.memory.url.port}, set(v){return sdbx.memory.url.port = v},enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'protocol', {get(){return sdbx.memory.url.protocol}, set(v){return sdbx.memory.url.protocol = v},enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'search', {get(){return sdbx.memory.url.search}, set(v){return sdbx.memory.url.search = v},enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'hash', {get(){return sdbx.memory.url.hash}, set(v){return sdbx.memory.url.hash = v},enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'host', {get(){return sdbx.memory.url.host}, set(v){return sdbx.memory.url.host = v},enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'hostname', {get(){return sdbx.memory.url.hostname}, set(v){return sdbx.memory.url.hostname = v},enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'origin', {get(){return sdbx.memory.url.origin}, enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'ancestorOrigins', {get(){return sdbx.proxy(new class DOMStringList{constructor(){this.length=0}}, 'location.ancestorOrigins')}, enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'reload', {value(){debugger; throw new Error('location.reload')}, writable: false, enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'replace', {value(){debugger;}, writable: false, enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'toString', {value(){debugger;}, writable: false, enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'assign', {value(){debugger;}, writable: false, enumerable: true, configurable: false});
    sdbx.defineProperty(location, 'valueOf', {value(){debugger;}, writable: false, enumerable: true, configurable: false});


    EventTarget = function EventTarget(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(EventTarget, 'EventTarget');
    Node = function Node(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(Node, 'Node');
    Element = function Element(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(Element, 'Element');
    HTMLElement = function HTMLElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLElement, 'HTMLElement');
    HTMLDivElement = function HTMLDivElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLDivElement, 'HTMLDivElement');
    HTMLAnchorElement = function HTMLAnchorElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLAnchorElement, 'HTMLAnchorElement');
    HTMLInputElement = function HTMLInputElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLInputElement, 'HTMLInputElement');
    HTMLFormElement = function HTMLFormElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLFormElement, 'HTMLFormElement');
    HTMLCanvasElement = function HTMLCanvasElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLCanvasElement, 'HTMLCanvasElement');
    HTMLCollection= function HTMLCollection(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLCollection, 'HTMLCollection');
    HTMLHtmlElement = function HTMLHtmlElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLHtmlElement, 'HTMLHtmlElement');
    HTMLHeadElement = function HTMLHeadElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLHeadElement, 'HTMLHeadElement');
    HTMLMetaElement = function HTMLMetaElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLMetaElement, 'HTMLMetaElement');
    HTMLAllCollection = function HTMLAllCollection(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLAllCollection, 'HTMLAllCollection');
    HTMLScriptElement = function HTMLScriptElement(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLScriptElement, 'HTMLScriptElement');
    Object.setPrototypeOf(Node.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Element.prototype, Node.prototype);
    Object.setPrototypeOf(HTMLElement.prototype, Element.prototype);
    Object.setPrototypeOf(HTMLDivElement.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(HTMLAnchorElement.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(HTMLInputElement.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(HTMLFormElement.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(HTMLCanvasElement.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(HTMLHeadElement.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(HTMLMetaElement.prototype, HTMLElement.prototype);
    Object.setPrototypeOf(HTMLScriptElement.prototype, HTMLElement.prototype);


    sdbx.defineProperty(EventTarget.prototype,'addEventListener', {value(type, listener){
        if(!sdbx['mouseEvent'][type]){
            sdbx['mouseEvent'][type] = {}
        };
        sdbx['mouseEvent'][type] = listener
    }});
    sdbx.defineProperty(EventTarget.prototype,'removeEventListener', {value(type, listener){delete sdbx['mouseEvent'][type]}});
    sdbx.defineProperty(EventTarget.prototype,'dispatchEvent', {value(event){debugger}});
    sdbx.defineProperty(Node.prototype,'appendChild', {writable: true, enumerable: true, configurable: true,
        value(aChild){
            // 处理form.appendChild(input)
            if(this instanceof HTMLFormElement && aChild instanceof HTMLInputElement){
                if (aChild.id) this[aChild.id] = aChild;
                if (aChild.name) this[aChild.name] = aChild;
                if (aChild.content) this[aChild.content] = aChild;
                if (aChild.type) this[aChild.type] = aChild;
            }
            return aChild
        }
    });
    sdbx.defineProperty(Node.prototype,'removeChild', {writable: true, enumerable: true, configurable: true,value(child){return child}})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'origin', {get(){return this[sdbx.private]['origin']},enumerable: true, configurable: true})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'protocol', {get(){return this[sdbx.private]['protocol']}, set(v){return this[sdbx.private]['protocol'] = v}, enumerable: true, configurable: true})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'host', {get(){return this[sdbx.private]['host']}, set(v){return this[sdbx.private]['host'] = v}, enumerable: true, configurable: true})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'port', {get(){return this[sdbx.private]['port']}, set(v){return this[sdbx.private]['port'] = v}, enumerable: true, configurable: true})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'hostname', {get(){return this[sdbx.private]['hostname']}, set(v){return this[sdbx.private]['hostname'] = v}, enumerable: true, configurable: true})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'pathname', {get(){return this[sdbx.private]['pathname']}, set(v){return this[sdbx.private]['pathname'] = v}, enumerable: true, configurable: true})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'search', {get(){return this[sdbx.private]['search']}, set(v){return this[sdbx.private]['search'] = v}, enumerable: true, configurable: true})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'hash', {get(){return this[sdbx.private]['hash']}, set(v){return this[sdbx.private]['hash'] = v}, enumerable: true, configurable: true})
    sdbx.defineProperty(HTMLAnchorElement.prototype, 'href', {get(){return this[sdbx.private]['href']}, set(v){
        let href;
        if(v.startsWith('http')){
            href = v;  // 完整的url
        }
        else if(v.startsWith('/')){
            href = sdbx.memory.url.origin + v   // 直接拼接
        }else{
            debugger; // const match = /\/([^\/.]+)(?:\.([^\/.]+))?$/.exec(v)
        }
        this[sdbx.private]['href'] = href;
        const parseURL = new URL(href);
        this[sdbx.private]['origin'] = parseURL.origin;
        this[sdbx.private]['protocol'] = parseURL.protocol;
        this[sdbx.private]['host'] = parseURL.host;
        this[sdbx.private]['port'] = parseURL.port;
        this[sdbx.private]['hostname'] = parseURL.hostname;
        this[sdbx.private]['pathname'] = parseURL.pathname;
        this[sdbx.private]['search'] = parseURL.search;
        this[sdbx.private]['hash'] = parseURL.hash;
    }, enumerable: true, configurable: true})


    HTMLDocument = function HTMLDocument(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(HTMLDocument, 'HTMLDocument');
    Document = function Document(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(Document, 'Document');
    Object.setPrototypeOf(Document.prototype, Node.prototype);
    Object.setPrototypeOf(HTMLDocument.prototype, Document.prototype);
    document = new HTMLDocument('new');
    sdbx.defineProperty(document, 'location', {get(){return location}, set(v){debugger; throw new Error(`jump to the rage ${v}`)}, enumerable: true, configurable: false});
    sdbx.defineProperty(Document.prototype, 'hidden', {get(){return true}, enumerable: true, configurable: true});
    sdbx.defineProperty(Document.prototype, 'wasDiscarded', {get(){return false}, enumerable: true, configurable: true});
    sdbx.defineProperty(Document.prototype, 'readyState', {get(){return 'interactive'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Document.prototype, 'visibilityState', {get(){return 'hidden'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Document.prototype, 'referrer', {get(){return ''}, enumerable: true, configurable: true});
    sdbx.defineProperty(Document.prototype, 'charset', {get(){return 'UTF-8'}, enumerable: true, configurable: true});
    sdbx.defineProperty(Document.prototype, 'characterSet', {get(){return 'UTF-8'}, enumerable: true, configurable: true});


    sdbx.defineProperty(Document.prototype, 'cookie', {get(){return sdbx.memory.cookie }, set(v){debugger;sdbx.memory.cookie = v}, enumerable: true, configurable: false});
    sdbx.defineProperty(Document.prototype, 'createElement', {writable: true, enumerable: true, configurable: true,
        value(ele){
            // 处理非法调用
            if (Object.getOwnPropertyDescriptor(this, 'constructor')) { throw new TypeError("Illegal invocation") };
            ele = ele.toLowerCase();
            let newEle;

            switch (ele) {
                case 'div':
                    // div.getElementsByTagName.i
                    // debugger
                    newEle = new HTMLDivElement('new')
                    newEle.tagName = "DIV";
                    newEle.innerHTML= "";
                    newEle.outerHTML = "<div></div>";
                    newEle.getElementsByTagName = function getElementsByTagName(name){
                        if(name != 'i'){debugger};
                        // 固定返回空collection, innerHTML数字++
                        let collection = [];
                        Object.setPrototypeOf(collection, HTMLCollection.prototype);
                        return sdbx.proxy(collection, `document.createElement.div.getElementsByTagName.${name}`);
                    };sdbx.renameFun(newEle.getElementsByTagName, 'getElementsByTagName');
                    break;
                case 'a':
                    // debugger
                    newEle = new HTMLAnchorElement('new')
                    newEle.tagName = 'A';
                    newEle.outerHTML = '<a></a>';
                    newEle[sdbx.private] = {
                        origin: '',
                        protocol: '',
                        host: '',
                        port: '',
                        hostname: '',
                        pathname: '',
                        search: '',
                        hash: '',
                        href: '',
                    };
                    break;
                case 'form':
                    // debugger
                    newEle = new HTMLFormElement('new')
                    newEle.tagName = 'FORM';
                    newEle.outerHTML = '<form></form>';
                    newEle[sdbx.private] = {id: ""};
                    // window下通过id拿到form元素
                    sdbx.defineProperty(newEle, 'id', {
                        get(){return this[sdbx.private]['id']},
                        set(v){this[sdbx.private]['id'] = v; Window.prototype.__proto__['id'] = this; /*挂载到 WindowProperties 下*/}
                    })
                    break;
                case 'input':
                    // debugger
                    newEle = new HTMLInputElement('new')
                    newEle.tagName = 'INPUT';
                    newEle.outerHTML= '<input>';
                    break;
                default:
                    // debugger
                    throw new Error(`document.createElement.${ele} --> unndefined`)
                    break;
            }
            newEle = sdbx.proxy(newEle, `document.createElement.${ele}`);
            return newEle
        }
    });
    Object.defineProperties(sdbx.memory.undetectable, {
        [0]:{
            get(){return sdbx.proxy(new HTMLHtmlElement('new'), 'document.all[0]')}
        },
        [1]:{
            get(){return sdbx.proxy(new HTMLHeadElement('new'), 'document.all[1]')}
        },
        [2]:{
            get(){return sdbx.proxy(new HTMLMetaElement('new'), 'document.all[2]')}
        }
    });
    sdbx.defineProperty(HTMLAllCollection.prototype, 'length', {enumerable: true, configurable: true, get(){return 3}});
    Object.setPrototypeOf(sdbx.memory.undetectable, HTMLAllCollection.prototype);
    sdbx.defineProperty(Document.prototype, 'all', {enumerable: true, configurable: true, get(){return sdbx.memory.undetectable}})

    sdbx.defineProperty(Document.prototype, 'createExpression', {writable: true, enumerable: true, configurable: true,
        value(xpathText, namespaceURLMapper){
            return sdbx.proxy(new class XPathExpression{}, `document.createExpression(${xpathText})`);
        }
    });
    sdbx.defineProperty(Document.prototype, 'body', {enumerable: true, configurable: true, get(){return null;}, set(v){debugger}});
    sdbx.defineProperty(Document.prototype, 'documentElement', {enumerable: true, configurable: true,
        get(){
            let htmlElement = new HTMLHtmlElement('new', 'document.documentElement');
            htmlElement.style = sdbx.proxy({}, 'document.documentElement.style')
            htmlElement.getAttribute = function getAttribute(name){
                if(['selenium', 'webdriver','driver'].includes(name)){
                    return null
                }else{
                   debugger
                }
            };sdbx.safeFun(htmlElement.getAttribute, 'getAttribute');
            return sdbx.proxy(htmlElement, 'document.documentElement');
        }
    });
    sdbx.defineProperty(Document.prototype, 'getElementById', {writable: true, enumerable: true, configurable: true,
        value(id){
            if(['root-hammerhead-shadow-ui'].includes(id)){
                return null
            }
            // debugger
            return null
        }
    });
    sdbx.defineProperty(Document.prototype, 'getElementsByTagName', {writable: true, enumerable: true, configurable: true,
        value(name){
            // debugger;
            name = name.toLowerCase();
            let collection = [];
            switch (name) {
                case 'script':
                    // debugger
                    let script1 = new HTMLScriptElement('new');
                    let script2 = new HTMLScriptElement('new');
                    function getAttribute(attr){
                        if(attr=='r'){return 'm'}else{debugger; return null};
                    };sdbx.safeFun(getAttribute, 'getAttribute');
                    script1.getAttribute = getAttribute;
                    script2.getAttribute = getAttribute;
                    script1.parentElement = script2.parentElement = new HTMLHeadElement('new');
                    script1 = sdbx.proxy(script1, `document.getElementsByTagName.${name}.${name}1`)
                    script2 = sdbx.proxy(script1, `document.getElementsByTagName.${name}.${name}2`)
                    collection.push(script1);
                    collection.push(script2);
                    break;
                case 'meta':
                    // debugger
                    let meta1 = new HTMLMetaElement('new');
                    let meta2 = new HTMLMetaElement('new');
                    function getAttribute(attr){
                        if(attr=='r'){return 'm'}else{debugger; return null};
                    };sdbx.safeFun(getAttribute, 'getAttribute');
                    meta1.getAttribute = getAttribute;
                    meta2.getAttribute = getAttribute;
                    meta1.parentNode = meta2.parentNode = new HTMLHeadElement('new');
                    // TODO 首页content
                    meta2.content = sdbx.Opt.content;
                    meta1 = sdbx.proxy(meta1, `document.getElementsByTagName.${name}.${name}1`)
                    meta2 = sdbx.proxy(meta2, `document.getElementsByTagName.${name}.${name}2`)
                    collection.push(meta1);
                    collection.push(meta2);
                    break;
                case 'base':
                    // debugger
                    // 空的
                    break;
                default:
                    debugger
                    throw new Error(`document.getElementsByTagName.${name} --> unndefined`)
                    break;
            }
            Object.setPrototypeOf(collection, HTMLCollection.prototype);
            return sdbx.proxy(collection, `document.getElementsByTagName.${name}`);
        }
    });

    History = function History(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(History, 'History');
    sdbx.defineProperty(History.prototype, 'back', {writable: true, enumerable: true, configurable: true, value(){throw new Error('jump to the page')}})
    sdbx.defineProperty(History.prototype, 'forward', {writable: true, enumerable: true, configurable: true, value(){throw new Error('jump to the page')}})
    sdbx.defineProperty(History.prototype, 'go', {writable: true, enumerable: true, configurable: true, value(){throw new Error('jump to the page')}})
    sdbx.defineProperty(History.prototype, 'replaceState', {writable: true, enumerable: true, configurable: true, value(){debugger}})
    sdbx.defineProperty(History.prototype, 'pushState', {writable: true, enumerable: true, configurable: true, value(){debugger}})
    sdbx.defineProperty(History.prototype, 'length', {enumerable: true, configurable: true, get(){return sdbx.random(1, 3)}})
    sdbx.defineProperty(History.prototype, 'state', {enumerable: true, configurable: true, get(){return null}})
    sdbx.defineProperty(History.prototype, 'scrollRestoration', {enumerable: true, configurable: true, get(){return 'auto'}, set(v){debugger}})

    structuredClone = function structuredClone(){debugger};sdbx.renameClass(structuredClone, 'structuredClone');
    DOMParser = function DOMParser(){debugger};sdbx.renameClass(DOMParser, 'DOMParser');
    sdbx.defineProperty(DOMParser.prototype, 'parseFromString', {writable: true, enumerable: false, configurable: true,value(a){debugger}})

    WindowProperties = function WindowProperties(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(WindowProperties, 'WindowProperties');
    Window = function Window(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(Window, 'Window');
    sdbx.defineProperty(Window.prototype, 'PERSISTENT', {value: 1, writable: false, enumerable: true, configurable: false})
    sdbx.defineProperty(Window.prototype, 'TEMPORARY', {value: 0, writable: false, enumerable: true, configurable: false})
    Object.setPrototypeOf(WindowProperties.prototype, EventTarget.prototype)
    Object.setPrototypeOf(Window.prototype, WindowProperties.prototype)
    Object.setPrototypeOf(window, Window.prototype)
    XMLHttpRequest = function XMLHttpRequest(){};sdbx.renameClass(XMLHttpRequest, 'XMLHttpRequest');
    Request = function Request(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(Request, 'Request');
    IDBFactory = function IDBFactory(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(IDBFactory, 'IDBFactory');
    IDBOpenDBRequest = function IDBOpenDBRequest(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameClass(IDBOpenDBRequest, 'IDBOpenDBRequest');
    MutationObserver = function MutationObserver(a,b,c,d){};sdbx.renameClass(MutationObserver, 'MutationObserver');
    fetch = function fetch(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameFun(fetch, 'fetch');
    open = function open(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameFun(open, 'open');
    webkitRequestFileSystem = function webkitRequestFileSystem(a, b, c, d){};sdbx.renameFun(webkitRequestFileSystem, 'webkitRequestFileSystem');
    openDatabase = function openDatabase(key){if(key!='new'){throw new TypeError("Illegal constructor")}};sdbx.renameFun(openDatabase, 'openDatabase');

    sdbx.defineProperty(IDBFactory.prototype, 'open', {writable: true, enumerable: true, configurable: true, value(name, version, options){
        // debugger;
        let openDB = new IDBOpenDBRequest('new');
        return sdbx.proxy(openDB, `window.indexedDB.open.${name}`)
    }});
    sdbx.defineProperty(IDBFactory.prototype, 'cmp', {writable: true, enumerable: true, configurable: true, value(a,b,c,d){debugger}});
    sdbx.defineProperty(IDBFactory.prototype, 'databases', {writable: true, enumerable: true, configurable: true, value(a,b,c,d){debugger}});
    sdbx.defineProperty(IDBFactory.prototype, 'deleteDatabase', {writable: true, enumerable: true, configurable: true, value(a,b,c,d){debugger}});
    sdbx.defineProperty(MutationObserver.prototype, 'disconnect', {writable: true, enumerable: false, configurable: true, value(a,b,c,d){debugger}});
    sdbx.defineProperty(MutationObserver.prototype, 'observe', {writable: true, enumerable: true, configurable: true, value(a,b,c,d){debugger}});
    sdbx.defineProperty(MutationObserver.prototype, 'takeRecords', {writable: true, enumerable: true, configurable: true, value(a,b,c,d){debugger}});
    sdbx.defineProperty(XMLHttpRequest.prototype, 'open', {writable: true, enumerable: true, configurable: true, value(method, url, async){;return url}});
    sdbx.defineProperty(XMLHttpRequest.prototype, 'send', {writable: true, enumerable: true, configurable: true, value(data){return data}});

    window.indexedDB = sdbx.proxy(new IDBFactory('new'), 'window.indexedDB');
    window.name = "";
    window.innerHeight = sdbx.random(532, 783);
    window.innerWidth = sdbx.random(932, 1068);
    window.outerHeight = sdbx.random(18, 26);
    window.outerWidth = sdbx.random(125, 186);
    window.chrome = {'runtime': {}};
    window.chrome.runtime = sdbx.proxy(window.chrome.runtime, 'window.chrome.runtime');
    window.chrome = sdbx.proxy(window.chrome, 'window.chrome');
    sdbx.defineProperty(window, 'setTimeout', {writable: true, enumerable: true, configurable: true,
        value(fun, time, ...args){
            const timer = {'fun': fun, 'delay': time,'args': [...args]};
            sdbx['timeEvent']['push'](timer)
        }
    });
    sdbx.defineProperty(window, 'setInterval', {writable: true, enumerable: true, configurable: true, value(fun, time, ...args){}});
    sdbx.defineProperty(window, 'clearInterval', {writable: true, enumerable: true, configurable: true, value(fun, time, ...args){}});

    delete WindowProperties;
    delete Window.prototype.__proto__.constructor;
    delete window[Symbol.toStringTag];
    module = global = Buffer = exports = clearImmediate = undefined;

    screen = sdbx.proxy(new Screen('new'), 'screen');
    history = sdbx.proxy(new History('new'), 'history');
    localStorage = sdbx.proxy(new Storage('new'), 'localStorage');
    sessionStorage = sdbx.proxy(new Storage('new'), 'sessionStorage');
    document = sdbx.proxy(document, 'document');
    navigator = sdbx.proxy(navigator, 'navigator');
    location = sdbx.proxy(location, 'location');
    window = sdbx.proxy(window, 'window');
    window.top = window.self = window;
    window.clientInformation = navigator;

    if(RSHook){
        sdbx.changeEnv = function(env){
            const newEnv = [];
            for (let i = 0; i < env.length;) {
                const fixedNum = env[i];      // 固定数字
                const len = env[i + 1];       // 当前环境数组的长度
                const value = env.slice(i + 2, i + 2 + len) // 当前环境值
                switch (fixedNum) {
                    case 3:
                        value[0] = 1;   // 1,0,33,128
                        const pb = 4 + 4 + 1 + value[8] + 4 + 1 + 1 + 1 + 1;
                        if(value[pb]){  // 167772116
                            value[pb] = 1;
                            value[pb + 1] = 0;
                            value[pb + 2] = 0;
                            value[pb + 3] = 0;
                        }
                        break;
                    case 7:
                        value[0] = 1;
                        value[1] = 0;
                        value[2] = 0;
                        value[3] = 0;
                        break;
                    default:
                        break;
                };
                newEnv.push(fixedNum);
                newEnv.push(len);
                newEnv.push(...value);
                // console.log(fixedNum, len, ...value)
                i = i + 2 + len;
            };
            return newEnv;
        };sdbx.safeFun(sdbx.changeEnv, 'RSChange');

        // 匹配call入口 hook替换compress函数
        sdbx.hookVM = function(vmjs){
            // function _$kq(_$_q){return _$hY(_$_q,_$id);} ==> 获取入参 修改环境数组结果
            const matchZip = />>=.*?function\s_\$..\((_\$..)\)\{(return\s_\$..\(_\$..\,_\$..\))/.exec(vmjs)
            const vmCode = vmjs.split(`${matchZip[2]}`).join(`debugger;${matchZip[1]}=sdbx.changeEnv(${matchZip[1]});${matchZip[2]}`)
            return vmCode
        };sdbx.safeFun(sdbx.hookVM, 'RSHook');
        // _$_a=_$jZ.call(_$d7,_$hu)  ==> _$_a=_$jZ.call(_$d7,hook(_$hu))
        const macthCall = /({_\$..=_\$..\.call\(_\$..,)(_\$..)\);?}/.exec(RSScript)
        RSScript = RSScript.split(`${macthCall[0]}`).join(`${macthCall[1]}sdbx.hookVM(${macthCall[2]}))}`)
    };

    new Function('window', RSScript)(window);
    ret = {};
    ret['ck'] = document.cookie?.split(';')[0];  // TODO 需要首先获取cookie 否则环境会出错
    ret['url'] = XMLHttpRequest.prototype.open('GET', sdbx.Opt.url, true);
    if(RSData){
        ret['data'] = XMLHttpRequest.prototype.send(RSData);
    };
    return ret
};

// 方式一
function env(RSScript, RSURL, RSData, RSUA){
    try {
        ret = RSSolve(RSScript, RSURL, RSData, RSUA, RSHook=false)
        return {
            'status': true,
            'data': ret,
        }
    } catch (error) {
        return {
            'status': false,
            'error': error.message,
            'data': null
        }
    }
};
// 方式二
function hook(RSScript, RSURL, RSData, RSUA){
    try {
        ret = RSSolve(RSScript, RSURL, RSData, RSUA, RSHook=true)
        return {
            'status': true,
            'data': ret,
        }
    } catch (error) {
        return {
            'status': false,
            'error': error.message,
            'data': null
        }
    }
};














fs = require('fs');
script = fs.readFileSync(`${__dirname}/src/script.vmp.js`, encoding='utf-8')
let tsnsd = parseInt(process.argv[2]) || 55472
let tscd = process.argv[3] || "qoyErrAlErWqmaqUqAgblaq2EAGsqcVfcpWtx1ltlaqUrPVfmAZEcqAODAqUrpQckP3sqrQqmalixf9qmaQUrqgblaqUqfQkkP3wqqGxrrVsqrQlmaVixfQqrkWmmaQiWaAUrqGtrrGsqr0qmalixfWqmaQUrqgbmaWiWyWUqqGLbAlTWAElWOKRE0P5j9Yhc0_eJaac3rIj9noKPCXYS0ah9Z1wp4Ks4MwNqaAurGArbcarS22exOsThUxiplmeswzt39T0JOE6auR1pbW9H2.cWnZvEcLCUWABEsSYsVRY.2wWsspVsKurJT3n8CNfszGfiYyRJPGOXnZnJYeMtciGRvmP1oJtR7rxQoTBKKfXZuw0QkN6xOBcKkWNEcALiWp8hnwqF02J0YA_UmxrF9U1KUrBwOxi35mcEseRUsAzXnlBJkJMK1C4Al0C82wS3XJ.sV3apsroakNmwlyap1iOKmGThPAbhFS8hTgntP3OzsY8Kcg9pT41wKzJsvauWZeohYwDslx8Loz9wcqZUTjNhnlvhOxRUhVfs2paVuQCjTJhAUJNIUI7ROrLF1fzp.7yKmgntP3Ozsz8Kcg93oo0smpkFkJm8eTcV6W4V0w6gCfbpcqZUTjNhnlvhORRhQEuhnQGtOYQScZf3ONGwUh8VUra1CpksdrEw0pLF2za_clyU29Ctci4hur3UnLbMzToK0eSW6w4z6YjYUrasK1NM0T1AnA5K7EuhnQGtOJQSogBF6wjFc6cKkWNMoJLMMYzwb2XtbN0eKZBF6wjFmnTKkWNMoJLMMYzwb2XtbN0eKZBF6wjFmnTKkWNMoJLMMYzwb2XtbN0eKZBF6wjFmnTKkWNMoJLMMYzwb2XtbN0eKZBF6wjFmnTKkWNMoJLMMYzwb2XtbN0eKZBF6wjFmnTKkWNMoJLMMY3KcQzR6pLzP0NxnynwvsZU2gNMoJLMMYzwb2XKnfFj1ezQDyjtm.cE1S9QbZ.h4Wfh6maQCmQScezQDyjtDd7MCe3h200hIwCMC9XFomze1ezQDyjtDd7MCe3h200hIwCMC9XFomze1ezQDyjtDd7MCe3h200hIwCMC9XFomze1ezQDyjtDd7MCe3h200hIwCMC9XFomze1ezQDyjtDd7MCe3h200hIwCMC9XFomze1ezQDyjtDd7MCe3UT7iqhmfi92OHvwauOfTwkwHR0HLROGSYlmSWimPYuyFWlyzTvN6Ak9CQVOhM6R1WuTOMzQ_w2ECMupL0v9gROw0IoBqQK2UYOp7iBxn1TpXplSXjYxCMO22pCUOAsNIFlxcFXLz3OEaHb3ujnTNwO2t3ChCAbYW8uxhw_lz3OEaHb3ujnTNwO2jYKurWYqS10JPQ8Lz3OEaHb3ujnTNwO2K36HeRoJsKCSbYH7zFU3yHCy4dT2tVbyYFTUpimzAV2pzW_Z_JspGVseS5lpyRlziM0HeQsQ5RsmQMeTHibWTRUr2zCE0JuN9JOi6FUq5QCmjQQrD3OrgH2r.zCE0JuN9JOi6FUq5hDQuW_mfWsQ7MoQ_4Vf_RmwcVmkAMCpniUmzWIRqwTYS1DqgeqWkrAWCrqcjqSRzwvx0QjWaWuW0Jk0a.sVaHu7nWktRrKEnWkybWy9qWOWarGga.uESJkLuWODzqaAeWsZCJj96qSKnZiVsL5qtscU9HP_DpeLlqfRYzHGf9DhOAAK3bGqDraAcrcm5M6bk7pK2133qyD08753HvNZdwGSsAcOhWQXWBQxpmR9xWOl6WkWyjkq6HAEoJqDsWOA0JkQZJt0aJqVcrGArbkQkrkEDrsF3ekpdhbw23.YPMvQXR6w7zKxTMcy9RKjT3KxShbpNQMYfFb7XR1fP5DlBRvmTtDhjw1ebMK7L3X2uhCmOQPf2eKZB3KT2tDUCwnefMKYZhIS4RP2vFUqzdCePtKpjRn6dMD0NRD2ahIe7MUlX3KrOzKpj3nyfIP65FCaNFbN0hImuQn2jQbQzZDr7tKzLM16aMKVNFCf6hIraMc2Lw1f.5olBM6xftDBNRbANFoY.M4YN3vJOtbfL5neBFbVjFKOehCyTJPNNQIGBMOmOtb2SjPeXwKVjFK.BhCyjRPNNMXZBMbSBtb2S_1eXwb7jFUoZRcej3DaLMBN4hCN231fXeKlBFbyOtD4zR1eT8nN08HLBQCpStvpbeceuwKZjwoojh6JTwPN0RIZBQ6YCIPfSeCABwKz2tooTFPeTQKELQHr2h6pCIPfu5ceSFcy0RKnTQKyu3cNCRHgBQKrStvRTdneSRoqjwC_TQDmNhvYP8MYawDAXwUJvzUrT3PyTIUtTwCx6hvx284Y6FbWXQbTvdne6Fvr03Kdzh6wewPNawIZBwURbtvxn_PeTwvVjQvveh6pjRDqLwBR2RsQXQK26zUpXRcySRU8TwoJChvybMhY4QCGXIbfnzUzBwvLjIohTh6zLMPN5h8JjQn2OwbZz_Kejwv3jMUogqaWmr29G3HgkrTLb3DarvYav3OQDqm_eRkWmqkVuqRGaqaAurGVabAWkrAEDrql"


qqq = `$_ts=window['$_ts'];if(!$_ts)$_ts={};$_ts.nsd=${tsnsd};$_ts.cd="${tscd}";`

script = qqq+script
rsurl = process.argv[4] || 'https://wcjs.sbj.cnipa.gov.cn/home'
RSData = process.argv[5] || ''


result = hook(
    RSScript=script,
    RSURL= rsurl,
    RSData=RSData,
    RSUA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Version/8.0(Rs) Chrome/92.0.4515.131 Safari/537.36',
);
// console.timeEnd('耗时')
console.log(JSON.stringify(result));