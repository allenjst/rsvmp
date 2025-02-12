/**
 * @param {string} RSContent - *** html中content字符串。
 * @param {string} RSScript - *** 外链js代码 拼接上 html内js代码。
 * @param {string} RSURL - *** 会解析url生成后缀 必传。
 * @param {string} RSUA - UserAgent，建议使用 Windows 10 64 位 Chrome 以避免与环境不匹配。
 */

function RSSolve(RSContent, RSScript, RSURL, RSUA){
    if(!RSContent || !RSScript || !RSURL){
        throw new Error('Missing required parameters content, script or url.')
    };

    window = globalThis || global;
    window.sdbx = {
        open: false, // 关闭代理
        log: console.log,
        mouseEvent: [],
        timeEvent: [],
        memory: {},
        private: Symbol('private'),
        Opt: {},
    };

    sdbx.Opt.content = RSContent;  
    sdbx.Opt.url = RSURL;
    sdbx.Opt.platform = 'Win32';
    sdbx.Opt.userAgent = RSUA || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Version/8.0(Rs) Chrome/92.0.4515.131 Safari/537.36';
    sdbx.Opt.appVersion = sdbx.Opt.userAgent.substring(sdbx.Opt.userAgent.indexOf('/') + 1);
    sdbx.memory.url = new URL(sdbx.Opt.url);
    sdbx.memory.cookie = "";
    Object.defineProperty(sdbx, Symbol.toStringTag, {value: 'SDBX'});

    window.sdbx.memory.undetectable = {};

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

    sdbx.random = function(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min};
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

    // TODO 相互引用
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
    Object.setPrototypeOf(HTMLHtmlElement.prototype, HTMLElement.prototype);


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
            // 处理form.appendChild(input) vmp版本检测
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
                    debugger
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
                    debugger
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
                    debugger
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
                    debugger
                    newEle = new HTMLInputElement('new')
                    newEle.tagName = 'INPUT';
                    newEle.outerHTML= '<input>';
                    break;
                default:
                    debugger
                    throw new Error(`document.createElement.${ele} --> unndefined`)
                    break;
            }
            newEle = sdbx.proxy(newEle, `document.createElement.${ele}`);
            return newEle
        }
    });
    // vmp版本 document.all length 检测
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
            debugger;
            name = name.toLowerCase();
            let collection = [];
            switch (name) {
                case 'script':
                    debugger
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
                    debugger
                    let meta1 = new HTMLMetaElement('new');
                    let meta2 = new HTMLMetaElement('new');
                    function getAttribute(attr){
                        if(attr=='r'){return 'm'}else{debugger; return null};
                    };sdbx.safeFun(getAttribute, 'getAttribute');
                    meta1.getAttribute = getAttribute;
                    meta2.getAttribute = getAttribute;
                    meta1.parentNode = meta2.parentNode = new HTMLHeadElement('new');
                    // TODO 这里会获取首页content
                    meta2.content = sdbx.Opt.content;
                    meta1 = sdbx.proxy(meta1, `document.getElementsByTagName.${name}.${name}1`)
                    meta2 = sdbx.proxy(meta2, `document.getElementsByTagName.${name}.${name}2`)
                    collection.push(meta1);
                    collection.push(meta2);
                    break;
                case 'base':
                    debugger
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
    openDatabase = function openDatabase(key){debugger;
        let database = {version: '',transaction: function transaction(){}};sdbx.safeFun(database.transaction, 'transaction')
        return sdbx.proxy(database, `openDatabase.${key}`)
    };sdbx.renameFun(openDatabase, 'openDatabase');

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
    
    // 添加指纹数据 不需要补 可以sha算法直接生成
    localStorage.setItem('$_f0', "aLgA8TOYPn1iELzUjukvLhTtrZ3")
    localStorage.setItem('$_f1', "9A8xxdUh8hsBPnzATf5PvduBfPQ")
    localStorage.setItem('$_ff', "5rbsQU4nzL6wG1PTlzBf3SJsENa7TICLszqL0guOQa88vKEcYkbtWL.bk52fy8tz")
    localStorage.setItem('$_fh1', "abJRX5qGt_GW5Q3sOLAzug9aM7Q")
    debugger

    new Function('window', RSScript)(window);
    ret = {};
    ret['ck'] = document.cookie?.split(';')[0];  
    ret['url'] = XMLHttpRequest.prototype.open('GET', sdbx.Opt.url, true);
    return ret
};
function env(RSContent, RSScript, RSURL, RSUA){
    try {
        ret = RSSolve(RSContent, RSScript, RSURL, RSUA)
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
script4 = fs.readFileSync(`${__dirname}/src/script4.js`, encoding='utf-8')
script5 = fs.readFileSync(`${__dirname}/src/script5.js`, encoding='utf-8')

RSContent = content="{qQUKN.UCNFF2yzUK23FTT.1DpqRVx7q 0wR7HvJ6IsUC410DntKRngA;QyqA82EGtIB6ePNEeYo9NG;iEm6gdSTTpYiqU10OlvsnG;yMG8gk5okQ97gP4eb.IadA;T8F36FaS9AtR4sXBkRr0iG;RTlM3IYjAzboXbIiNSIFRA;t7_svh3Kc3.VU9jOjAJgdq;.8D9Zx78FrKF.Zn4xbfmIG;IMhCM7gXESIqShs5TNMo9A;pvBPF7OtrK6trS5vZYizwa;9qxqLXuEeDQeAlNfAL_l.A;VNeyFcNDtQZhV2sfCxyHqA;kT4JL2WRSOhvUIEcOjSrva;LpFhLGWYI8eFx_X999MLEq;NqssQaVItFB0TevtNxJrkG;AI3RN3R7lP0BBnYsoCO5KG;xrYRhwM6FYW7zCsPL.iecq;0kOXzZzt1eXLrlPo.QQ4xG;ApKNqLIRoybF5rIxSnabBG;hfgZrtz_KscdFC6a3f1wKA;q|[8y7c.rviDQTqy0uetQEhbf.7ANqnZVkLmXWW_O5sDxGavadZ1ezJZ9kJ1XpiSqnrkEA9PkhpcJ91Oph1cJA1GO5kt50H5u8Dhz2iSsFgAtEcNsogW3GcOPDjhtqPLGXwlE7EOGdTJ_W_epcZD.Lwzqnel.VpBAnaAxqLfkbFW.YtOSnfDRxW90kjt.0z2kj2D3a6zstoAta59p8VlLQW0fOlHRWS2Ou31_fYPSCY17wWSTKRcWZICuCiW30ZuVXdYRgwv9.tsWfY2qOlm2wHir2go2A7w9QSk9a_39NPW9Yxiqaat6ANF920cl7p8VQqqq{VcR04NuCXW5T70UuE8ZQvaDOo3QrN2kisWRxKCKohReebaKbIWyLZ2U.pMer4CnIkIWwf5CMc3JmGCCOJ3JYvqm26649qc80qDdfe167qik4l4Gu_DHLq6Gq!x7z,aac,amr,asm,avi,bak,bat,bmp,bin,c,cab,css,csv,com,cpp,dat,dll,doc,dot,docx,exe,eot,fla,flc,fon,fot,font,gdb,gif,gz,gho,hlp,hpp,htc,ico,ini,inf,ins,iso,js,jar,jpg,jpeg,json,java,lib,log,mid,mp4,mpa,m4a,mp3,mpg,mkv,mod,mov,mim,mpp,msi,mpeg,obj,ocx,ogg,olb,ole,otf,py,pyc,pas,pgm,ppm,pps,ppt,pdf,pptx,png,pic,pli,psd,qif,qtx,ra,rm,ram,rmvb,reg,res,rtf,rar,so,sbl,sfx,swa,swf,svg,sys,tar,taz,tif,tiff,torrent,txt,ttf,vsd,vss,vsw,vxd,woff,woff2,wmv,wma,wav,wps,xbm,xpm,xls,xlsx,xsl,xml,z,zip,apk,plist,ipa.pJJ.BcPaD40.Lu8nF4QLBpXnt_g6XpXShF0aZ1nVt30!2toVVol3DUAWEkmlxsVQtl0l3srfDUqGKsh0t6vIzpXeoyVuFw_AE_Vv2sMAtX25uMQ2bdDoLpQfkLv4418moNbv8UdxOaCdIUIwo_pByKXeJ0mOSABJt6mkBQxQFeborKXJtT25prNydg0dOVHzpapdP3NLw4p.tsWfS62kt87zXd0BnUZYDub.dMJm2nVuLoIfx4l60MJ2hGbXEK.J.GojKI3g3j2XmKteiNoX4RFYRPmtWpRwffS_LRjf3yr_WIEl3Ol4XF8pOO0XEDjS5v9kBVjeAPp6LRhfOb01NVJwB7lbqR3YqfljRMhJofVtxIExpTV1rUeGINK4cRLfla2ulV3RMfv53phpgbTn4AjW8jCt0sjS4bVTn1CWQ36TQAmwRY2rQDspcMKT38k9wppTYMup3F9piDb2R8Kmu3CWwMD0vU1mvKCYVMcT3Y2S.8VYW8f2nR2GFV9w13CTCpU0U3VTq30rcI0g8rTgEcYTEAmSEmqSzIKaosKft1SzpAUmAp0R2r6NgMre3caAqq{]iHfQ9VXJ1NJMOaUiky9hvT4WKCAJJmffUuRQE2f6UDQlEVez1CrIQ6w9rcNhFmyvYbllE2TTUnliEarSKvQWxTNucOyMwYRyV2Y3QYaGo6Tp82NhR9fUV9SUrDGqlDZqsVyVsAAHYVYF19TmY9Wlqqq|gRMppaG8MVJ91bssVVEqwTmo7lBg_41vIHZGWNrKuEg3ZXnFrtxatBOKqELW9BAbOmB7EfutxV3ZejfCkWFrsjmnqEEVYvODvEFlaBOC7cLZiPf8.14grXkt4x_9kOTFeoxqd6pF6Jh3KXqFFUM7GvYiskFWf6PPzmgV.XPngtRZd72t8tLASaP_IoJ30jA1.x_EUPct3kZSwbPxCrVZQwYwRc9apJkY9hKgxITx5lKSUQaa0V9L7EqfGhCrs3P2jJlavInpBYm7cYs2ycnaJFcfAtOEkxs3Lo9fYqK8AaUrXh74ULeRuWxML1KlqqlcUlbqr1qVr8q0TusYJwqe0OIwWeESq.FT2NLES2N6itqCUF1jaDnccIpf7YQwCHEVlLpdtcT39qqqr4qr0qr0ql3650qk162qt1074790432ql4096qhUsSouZWPYmTqhSpI_J70OyyjqYpbuX2qmizQ9zpcyTzFwS6qhxOHZY6uWxv8qr0q"
console.time('耗时')
result = env(
    RSContent=RSContent,
    RSScript=script4,
    RSURL='http://www.fangdi.com.cn/old_house/old_house_list.html?district=27d3af3bd45acf5e&area=&verifyNo=&region=2ddf3709ecb51cd3&blockName=&check_input=L95V&time=&location=',
    RSUA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Version/8.0(Rs) Chrome/92.0.4515.131 Safari/537.36',
);
console.timeEnd('耗时')
console.log(result);

RSContent = '{qk674r1H8_Jx29tKsRRk90gQKuY7rbLq3GePcD0hFaN.cDZxFapBqqqqt1083179040Vm.3vG18kxL9PO1_WhLGBLQMy8npkHU.WmLqK.lXawjSF7o59ejrFfo5QRBfnv,xMe30.V6yYgEj4TFGYLGg.uCCD_e8bpXDieqiamKgqRlkPViEDL7kSqDQqgRkfpjqqZlrbaikAygFvAiBAem8ukc0xRqvbk8LHglaBOPXxMWIzr8ysQV.MGYzocg8wfSLUD7mFfa.ov0QRYS9rKQQErygoDEzETxshTZ8wST_J6akMsyYtD0IKOSLoYGriVNoobGQQ2SSrVaQkpyUoleQ1GYxoqL8VfSlUlQmpfSCUqgZMrpPqULRwON0rAAVKryaqoZpVaxKVGE.YaYKorQ81pSpUmqmVSS7oOAQh2azr1GQFpguoc7zRmEoDG7fQugHWUAI8aEgWuyEH1QmAfQrw9LioPWQiTaCrsVQwfgXokrQWaVnooW8mpaJUqamkSayUlQ9c0lNlplMxPqqmkg4UpafqO9RYfE6V97.t1zph27omqrRlSGwcrZUlpAlYqAsWAGllsaAm598LTuCqB3YCYu8VzfI40Udm8zI_pdbqiW84r4_U5385AsqrIQc_Ou4mda86S4So4NQ4AhBmQRQSThkUdmcZcdimwRIaaUUo5GIafvEUZg8aAs2oZ0RSYtqrJZmnnCktyEXvfPore31baolrJ980mdImQ0vafh1ozGy0SMpVNWl7GK9h8g.g14.l_Awzf_3oj0oyfDdrtAZLS89oXlRLpb9HhgUXS4SUtqcLrKhhI78.pnTUhAmzSuaojGQ72nSr3aQup_UoEZznmteJWGb0c8_W3VwG0FxJFqOfrj8ELgS09jjoLQQvTnFrR9QCf_coxpQ2aKKoJQ8PpnpUxqm9STwU1WA1Vm1iT3yFTeJJblOR9pzcl0OAsYeVuQj3qpOosaIRrT5UU0l8r0yoCWw8TTCroVwJfeXoUq7WYJ6EmVqYrrhWoQdAf2rED0VsVf7J6GCc0zSoTgwAmTkrlEwqSemoYTwUqpIopGIArTFUY9lYrT9UpGkAnVmH9VnR0mmHaWdElq0paYxt090V6ajtAA9oKVIHS0vU1ElEpTPouLwHm0drkgwISZfos9782WOo1Z4WPyBHqAfHs3Llaa3MGVLmf9AAl7goSlwcY0Erq7wprZQoARwrAAqoVlIDS0kUpglop0BUYlDmS3uxVQVr0Atqs7VJ92hDSG8prVdV0Vj4GszoFgIef6LU87l_fC.od0wyY69riQwLrdgo8E7Z265rH0wu67qq|vHtlqnmh11wQQ0lUYKR78uTUWKWS1PrucKxl8ZbHrV7Js0YOX3yqQ6Y6RK3G8Sb.Ik7SnemBZpIWWOGUYMBmHPb531tpuz6btk3JhvK5LcNTYNVFBYyxObVbhKtwy2CXPQ3Nb9vbKILalvCnJkMxWb2_JF_TtOVXdVRmAPVFd1RRa9b_0rEL1Bm8SK3rhXYDSKLRl.6jvs3pTzm12rxSCGU8D1g9m70FPK.ZxzvdVoEmw2lbQqwfN.ocSRWf2jmkHVbYR3bYFplza3Uy0ouGql4608.7dhs0nT3TyxuTDEfS7G19iQHFgY.uLKTuRbOeIiE3dWq~RQHlDLrCMEy36SlX6J.lTGuPUDWEynsjPJ40lBlXalZQRASZyHO2mYfeEqK3.FVNwxbly3sQdDuqr8rYHtCQ5i9NmxoWVYpE9cnZ3sVryW6EuI9N5H6Gbwkwzq13VUAxUtTG619NTmmEwUp2wpvAnYArdWfrklAx91VQ4MPJgi00vUreKE22tpupZrVWbKSpKrv96qO2nAVlcQkTsqD3lMlLSDaVYWA79rPaFJpJeWuJcoPJeirLvHcWYU6TcwSr_AOJIiaxNDSLYoSWU11E0qAA6UC2c3SrXAOeIJax2Db0FrSWBqsqIYA9J1OZhhOEIJPVacnrRxTq_mspVpY3siGqFi9Aqqqqh0wThRaxO2dDqkH87qqqqqhDgxftFBXQLmr4qr0qqqqYd1Ym8ERO5bbYBH0OEHi7jr0c64r6qqqqhwCjQD.4H9q6r0c64XqSr.RowfQcfupsRXso34h6VBp0Ni30ma39gz89R7i1L6hqqqqqr0r7sKvwTqk7EwALXDng1iYWD039a53qqqq'
console.time('耗时')
result = env(
    RSContent=RSContent,
    RSScript=script5,
    RSURL='https://wap.hn.10086.cn/wap/static/login/Login.html',
    RSUA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Version/8.0(Rs) Chrome/92.0.4515.131 Safari/537.36',
);
console.timeEnd('耗时')
console.log(result);