"use client";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve2, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve2(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/client/client.tsx
var client_exports = {};
__export(client_exports, {
  OstClient: () => OstClient
});
module.exports = __toCommonJS(client_exports);

// src/context/index.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var OutstaticContext = (0, import_react.createContext)(
  {}
);
var OutstaticProvider = ({
  children,
  repoOwner,
  repoSlug,
  repoBranch,
  contentPath,
  monorepoPath,
  session,
  collections,
  pages,
  addPage,
  removePage,
  hasOpenAIKey,
  hasChanges,
  setHasChanges
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    OutstaticContext.Provider,
    {
      value: {
        repoOwner: repoOwner || "",
        repoSlug: repoSlug || "",
        repoBranch: repoBranch || "main",
        contentPath: contentPath || "outstatic/content",
        monorepoPath: monorepoPath || "",
        session,
        collections,
        pages,
        addPage,
        removePage,
        hasOpenAIKey,
        hasChanges,
        setHasChanges
      },
      children
    }
  );
};
var DocumentContext = (0, import_react.createContext)(
  {}
);

// src/utils/apollo.ts
var import_client = require("@apollo/client");
var import_context = require("@apollo/client/link/context");
var import_cross_fetch = __toESM(require("cross-fetch"));
var import_react2 = require("react");
var apolloClient;
var apolloCache = new import_client.InMemoryCache({
  typePolicies: {}
});
function getSession() {
  return __async(this, null, function* () {
    const response = yield (0, import_cross_fetch.default)("/api/outstatic/user");
    return response.json();
  });
}
function createApolloClient(session) {
  const httpLink = (0, import_client.createHttpLink)({
    uri: "https://api.github.com/graphql",
    // Prefer explicit `window.fetch` when available so that outgoing requests
    // are captured and deferred until the Service Worker is ready. If no window
    // or window.fetch, default to cross-fetch's ponyfill
    fetch: (...args) => (typeof window !== "undefined" && typeof window.fetch === "function" ? window.fetch : import_cross_fetch.default)(...args)
  });
  const authLink = (0, import_context.setContext)((_0, _1) => __async(this, [_0, _1], function* (_, { headers }) {
    var _a;
    const data = session ? { session } : yield getSession();
    const modifiedHeader = {
      headers: __spreadProps(__spreadValues({}, headers), {
        authorization: ((_a = data.session) == null ? void 0 : _a.access_token) ? `Bearer ${data.session.access_token}` : ""
      })
    };
    return modifiedHeader;
  }));
  return new import_client.ApolloClient({
    ssrMode: typeof window === "undefined",
    link: (0, import_client.from)([authLink, httpLink]),
    cache: apolloCache
  });
}
function initializeApollo(initialState = null, session) {
  const apolloClientGlobal = apolloClient != null ? apolloClient : createApolloClient(session);
  if (initialState) {
    apolloClientGlobal.cache.restore(initialState);
  }
  if (typeof window === "undefined")
    return apolloClientGlobal;
  apolloClient = apolloClient != null ? apolloClient : apolloClientGlobal;
  return apolloClient;
}
function useApollo(initialState = null, session) {
  const store = (0, import_react2.useMemo)(
    () => initializeApollo(initialState, session),
    [initialState, session]
  );
  return store;
}

// src/client/pages/index.tsx
var import_client3 = require("@apollo/client");
var import_react41 = require("react");

// src/client/pages/404.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function FourOhFour() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_jsx_runtime2.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { id: "outstatic", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "absolute bottom-10 w-full left-0 overflow-hidden z-0 md:-top-10 bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "svg",
      {
        width: "100%",
        height: "100%",
        viewBox: "0 0 1200 365",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "path",
          {
            d: "M-276.32 159.182C-232.477 130.613 -193.037 95.4797 -149.142 66.8773C-123.398 50.1026 -99.0091 30.5473 -69.5694 19.7442C-38.5686 8.36831 -2.85928 -3.31376 37.4064 4.54405C65.5725 10.0406 93.927 20.2194 125.473 43.3305C150.292 61.5127 166.609 84.5943 185.936 114.255C220.569 167.405 225.81 223.228 224.615 265.934C223.2 316.536 198.5 341.652 158.621 340.382C121.027 339.185 71.9868 320.328 45.0005 250.638C8.63388 156.723 111.095 159.937 149.344 159.325C235.509 157.945 334.997 185.056 433.145 218.102C547.034 256.448 651.041 336.753 780 356C940 384.5 1235.5 330.311 1237.95 70.5232",
            stroke: "#1E293B",
            className: "stroke-2 md:stroke-1",
            strokeLinecap: "round"
          }
        )
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("main", { className: "relative flex h-screen flex-col items-center justify-center z-10 p-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("h1", { className: "mb-8 text-center text-xl font-semibold text-white", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "svg",
        {
          fill: "none",
          height: "32",
          viewBox: "0 0 775 135",
          width: "200",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-label": "Outstatic",
          children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("g", { fill: "#1e293b", children: [
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m63.9963 134.869c-11.3546 0-21.0957-1.913-29.2232-5.738-8.008-3.824-14.522-8.904-19.5419-15.239-5.02-6.454-8.72517-13.565-11.11562-21.3344-2.39045-7.769-3.585673-15.5379-3.585673-23.3069 0-7.5299 1.254983-15.1196 3.764953-22.769 2.62949-7.769 6.51394-14.8805 11.65344-21.3347 5.259-6.4543 11.773-11.6535 19.5419-15.59772 7.8885-3.94424 17.0917-5.91636 27.6097-5.91636 10.996 0 20.4383 1.97212 28.3268 5.91636 8.008 3.94422 14.5813 9.20322 19.7213 15.77692 5.139 6.4542 8.964 13.5061 11.474 21.1555 2.63 7.6494 3.944 15.2391 3.944 22.769 0 7.4104-1.314 15.0001-3.944 22.769-2.51 7.6495-6.394 14.7613-11.653 21.3343-5.14 6.455-11.5941 11.654-19.363 15.598-7.769 3.944-16.9722 5.917-27.6097 5.917zm.8964-9.323c6.9323 0 12.9084-1.554 17.9284-4.662 5.1394-3.107 9.3227-7.231 12.5498-12.37 3.3467-5.259 5.7971-10.9962 7.3511-17.2114 1.553-6.3347 2.33-12.6096 2.33-18.8248 0-7.6494-.896-15-2.689-22.0519-1.793-7.1713-4.5419-13.5658-8.2471-19.1833-3.5856-5.7371-8.0677-10.2192-13.4462-13.4463-5.3785-3.3466-11.5937-5.0199-18.6455-5.0199-6.9323 0-12.9682 1.6135-18.1077 4.8406-5.1394 3.2271-9.3227 7.4702-12.5498 12.7292-3.2271 5.1394-5.6773 10.8765-7.3506 17.2112-1.5538 6.2152-2.3307 12.4901-2.3307 18.8248 0 6.2151.8366 12.7889 2.5099 19.7212 1.6734 6.9323 4.2431 13.3865 7.7092 19.3626 3.4662 5.976 7.8885 10.817 13.267 14.522 5.4981 3.705 12.0718 5.558 19.7212 5.558z" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m179.299 134.869c-6.693 0-12.251-1.255-16.673-3.765-4.303-2.51-7.53-6.634-9.681-12.371-2.152-5.857-3.227-13.566-3.227-23.1276v-28.1475c0-2.0319 0-4.1235 0-6.2749.119-2.271.358-4.4821.717-6.6335-2.032.1195-4.183.239-6.454.3585-2.271 0-4.303.0598-6.096.1793v-9.502h4.303c5.976 0 10.458-.5379 13.446-1.6136s5.08-2.2111 6.275-3.4064h6.813v54.6815c0 9.4422 1.314 16.4942 3.944 21.1552 2.629 4.662 7.052 6.933 13.267 6.813 4.064 0 7.948-1.195 11.653-3.586 3.825-2.39 6.933-5.199 9.323-8.426v-42.4901c0-2.6295.06-5.0797.179-7.3507.12-2.3904.359-4.6613.718-6.8127-2.152.1195-4.363.239-6.634.3585-2.271 0-4.363.0598-6.275.1793v-9.502h5.199c5.259 0 9.383-.5379 12.371-1.6136s5.139-2.2111 6.454-3.4064h6.813l-.179 65.9767c0 1.912-.06 4.542-.18 7.888-.119 3.227-.298 6.096-.538 8.606 2.032-.12 4.124-.239 6.275-.359 2.271-.119 4.363-.179 6.275-.179v9.502h-28.506c-.239-1.912-.478-3.705-.717-5.379-.119-1.673-.299-3.286-.538-4.84-3.705 3.466-8.008 6.514-12.908 9.143-4.901 2.63-10.04 3.945-15.419 3.945z" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m283.918 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.426-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.435-4.422-2.152-10.279-2.152-17.57l.359-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.86-3.5857 3.347-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.427v25.0997h27.609v9.3227l-27.609.3586-.359 47.8687c0 4.5418.359 8.5458 1.076 12.0118.837 3.347 2.151 5.976 3.944 7.889 1.913 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.427-2.51 2.988-1.673 5.796-4.422 8.426-8.247l6.096 5.378c-2.869 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.618 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.152.358-3.885.538-5.2.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m358.946 134.869c-5.618 0-10.817-.777-15.598-2.331-4.781-1.434-8.605-3.168-11.474-5.199l.538 5.916h-9.502l-.897-30.837h7.53c.239 4.423 1.614 8.427 4.124 12.012 2.51 3.586 5.737 6.395 9.681 8.427 4.064 2.031 8.426 3.047 13.088 3.047 2.749 0 5.438-.418 8.068-1.255 2.629-.956 4.84-2.33 6.633-4.123 1.793-1.913 2.689-4.243 2.689-6.992 0-2.988-.956-5.439-2.868-7.351-1.793-2.032-4.303-3.825-7.53-5.378-3.108-1.5542-6.693-3.108-10.757-4.6618-3.586-1.4342-7.231-2.9282-10.936-4.482-3.586-1.5538-6.933-3.4064-10.04-5.5578-3.108-2.1514-5.558-4.7809-7.351-7.8885-1.793-3.2271-2.689-7.1714-2.689-11.8327 0-2.749.538-5.6773 1.613-8.7849 1.076-3.2271 2.809-6.1554 5.2-8.7849 2.39-2.749 5.617-4.9602 9.681-6.6335 4.064-1.7928 9.084-2.6893 15.06-2.6893 3.227 0 6.812.5379 10.757 1.6136 4.063 1.0757 7.828 2.9283 11.295 5.5578l-.18-6.2749h9.502v31.5539h-7.709c-.358-4.1833-1.494-8.0678-3.406-11.6535-1.793-3.5856-4.363-6.5139-7.709-8.7849-3.347-2.2709-7.411-3.4064-12.192-3.4064-4.661 0-8.486 1.1953-11.474 3.5857-2.868 2.2709-4.303 5.1395-4.303 8.6056 0 3.4662 1.076 6.275 3.227 8.4264 2.271 2.1514 5.2 4.004 8.785 5.5578 3.586 1.5537 7.47 3.1075 11.654 4.6613 5.02 2.0319 9.741 4.2431 14.163 6.6335 4.422 2.3905 8.008 5.3785 10.757 8.9642s4.124 8.1273 4.124 13.6253c0 5.976-1.554 10.996-4.662 15.06-2.988 3.944-6.872 6.873-11.653 8.785s-9.861 2.869-15.239 2.869z" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m439.216 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.427-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.434-4.422-2.151-10.279-2.151-17.57l.358-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.861-3.5857 3.346-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.426v25.0997h27.61v9.3227l-27.61.3586-.358 47.8687c0 4.5418.358 8.5458 1.075 12.0118.837 3.347 2.152 5.976 3.945 7.889 1.912 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.426-2.51 2.988-1.673 5.797-4.422 8.426-8.247l6.096 5.378c-2.869 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.617 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.151.358-3.884.538-5.199.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m528.944 132c-.239-1.912-.418-3.586-.537-5.02-.12-1.434-.299-2.928-.538-4.482-4.064 4.064-8.427 7.171-13.088 9.323-4.661 2.032-9.502 3.048-14.522 3.048-8.606 0-15.119-2.092-19.542-6.275-4.303-4.303-6.454-9.622-6.454-15.957 0-5.498 1.614-10.279 4.841-14.3423 3.227-4.0638 7.47-7.3507 12.729-9.8606 5.259-2.6295 10.996-4.5419 17.211-5.7371 6.215-1.3148 12.311-1.9721 18.287-1.9721v-10.5778c0-3.8247-.359-7.3506-1.076-10.5777-.717-3.3466-2.211-6.0359-4.482-8.0678-2.151-2.1514-5.558-3.2271-10.219-3.2271-3.108-.1195-6.215.4781-9.323 1.7929-3.107 1.1952-5.498 3.2271-7.171 6.0956.956.9562 1.554 2.0917 1.793 3.4064.358 1.1952.538 2.3307.538 3.4064 0 1.6733-.718 3.5857-2.152 5.7371-1.434 2.0318-3.884 2.988-7.35 2.8685-2.869 0-5.08-.9562-6.634-2.8685-1.434-2.0319-2.151-4.3626-2.151-6.9921 0-4.3028 1.553-8.1275 4.661-11.4741 3.227-3.3467 7.59-5.9762 13.088-7.8885 5.498-1.9124 11.653-2.8686 18.466-2.8686 10.279 0 17.928 2.6893 22.948 8.0678 5.14 5.3785 7.709 13.8646 7.709 25.4583v12.3705c0 3.9443-.059 7.8885-.179 11.8328v12.55c0 1.793-.06 3.825-.179 6.095-.12 2.271-.299 4.662-.538 7.172 2.032-.12 4.124-.239 6.275-.359 2.151-.119 4.183-.179 6.096-.179v9.502zm-1.613-43.0281c-3.825.2391-7.769.7769-11.833 1.6136-3.944.8366-7.53 2.0916-10.757 3.7649s-5.856 3.8247-7.888 6.4546c-1.913 2.629-2.869 5.796-2.869 9.502.239 4.063 1.554 7.051 3.944 8.964 2.51 1.912 5.439 2.868 8.785 2.868 4.184 0 7.889-.777 11.116-2.33 3.227-1.674 6.394-3.945 9.502-6.813-.12-1.315-.179-2.63-.179-3.944 0-1.435 0-2.929 0-4.482 0-1.076 0-3.048 0-5.9168.119-2.988.179-6.2151.179-9.6813z" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m602.217 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.427-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.434-4.422-2.151-10.279-2.151-17.57l.358-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.861-3.5857 3.346-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.426v25.0997h27.61v9.3227l-27.61.3586-.358 47.8687c0 4.5418.358 8.5458 1.075 12.0118.837 3.347 2.152 5.976 3.945 7.889 1.912 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.426-2.51 2.988-1.673 5.797-4.422 8.426-8.247l6.096 5.378c-2.868 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.617 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.151.358-3.884.538-5.199.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m639.057 124.47c3.585 0 6.095-.837 7.53-2.51 1.434-1.673 2.271-4.004 2.51-6.992.358-2.988.538-6.454.538-10.398v-37.1121c0-2.0319.059-4.0638.179-6.0957.119-2.1514.299-4.4223.538-6.8127-2.032.1195-4.184.239-6.455.3585-2.27 0-4.362.0598-6.275.1793v-9.502c5.379 0 9.622-.2391 12.73-.7172 3.227-.5976 5.677-1.2549 7.35-1.9721 1.793-.7171 3.108-1.494 3.945-2.3307h6.812v69.2037c0 2.151-.059 4.362-.179 6.633-.119 2.152-.299 4.363-.538 6.634 1.913-.12 3.825-.179 5.737-.179 2.032-.12 3.885-.24 5.558-.359v9.502h-39.98zm19.183-100.3988c-3.107 0-5.737-1.1354-7.888-3.4063-2.152-2.3905-3.227-5.259-3.227-8.6057 0-3.34658 1.135-6.15536 3.406-8.42628 2.271-2.39045 4.841-3.5856788 7.709-3.5856788 3.108 0 5.677 1.1952288 7.709 3.5856788 2.152 2.27092 3.227 5.0797 3.227 8.42628 0 3.3467-1.075 6.2152-3.227 8.6057-2.032 2.2709-4.601 3.4063-7.709 3.4063z" }),
            /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "m735.314 134.869c-8.008 0-15.359-1.793-22.052-5.379-6.693-3.705-12.072-8.964-16.136-15.777-3.944-6.813-5.916-15.0598-5.916-24.7411 0-6.4542 1.136-12.6096 3.407-18.4662 2.27-5.9761 5.438-11.2949 9.502-15.9562 4.183-4.6614 9.083-8.3068 14.701-10.9363 5.737-2.7491 12.072-4.1236 19.004-4.1236 7.052 0 13.088 1.0757 18.108 3.2271 5.019 2.1514 8.844 4.9602 11.474 8.4264 2.749 3.4661 4.123 7.2311 4.123 11.2948 0 2.8686-.837 5.3785-2.51 7.5299-1.673 2.1515-4.064 3.2272-7.171 3.2272-3.466.1195-5.917-.8965-7.351-3.0479-1.434-2.2709-2.151-4.3625-2.151-6.2749 0-1.0757.179-2.2709.538-3.5857.358-1.4342 1.016-2.6892 1.972-3.7649-.956-2.51-2.51-4.3626-4.662-5.5578-2.151-1.1952-4.362-1.9721-6.633-2.3307s-4.183-.5379-5.737-.5379c-7.291.1196-13.446 3.2869-18.466 9.5021-4.901 6.0956-7.351 14.9403-7.351 26.5339 0 7.4104 1.076 14.0439 3.227 19.9008 2.271 5.856 5.558 10.518 9.861 13.984s9.442 5.259 15.418 5.378c5.379 0 10.578-1.374 15.598-4.123 5.02-2.869 9.083-6.454 12.191-10.757l5.737 5.02c-3.466 5.378-7.47 9.621-12.012 12.729-4.422 3.107-8.964 5.319-13.625 6.633-4.542 1.315-8.905 1.973-13.088 1.973z" })
          ] })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-center mb-20 flex max-w-2xl flex-col items-center p-8 px-4 md:p-8 text-black bg-white rounded-lg border border-gray-200 shadow-md", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-2xl", children: "404 - Nothing here..." }) })
    ] })
  ] }) });
}

// src/utils/hooks/useOutstatic.tsx
var import_react3 = require("react");
function useOutstatic() {
  return (0, import_react3.useContext)(OutstaticContext);
}

// src/components/Link/index.tsx
var import_link = __toESM(require("next/link"));
var import_navigation = require("next/navigation");
var import_react4 = require("react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var Link = (_a) => {
  var _b = _a, {
    href,
    onClick,
    children
  } = _b, nextLinkProps = __objRest(_b, [
    "href",
    "onClick",
    "children"
  ]);
  const nextRouter = (0, import_navigation.useRouter)();
  const { hasChanges, setHasChanges } = useOutstatic();
  const handleLinkClick = (0, import_react4.useCallback)(
    (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
      if (hasChanges) {
        if (window.confirm(
          "You have unsaved changes. Are you sure you wish to leave this page?"
        )) {
          setHasChanges(false);
          nextRouter.push(href.toString());
        }
      } else {
        nextRouter.push(href.toString());
      }
    },
    [hasChanges, onClick, setHasChanges, nextRouter, href]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_link.default, __spreadProps(__spreadValues({ href, onClick: handleLinkClick }, nextLinkProps), { children }));
};
var Link_default = Link;

// src/utils/auth/hooks.tsx
var import_navigation2 = require("next/navigation");
var import_react5 = require("react");
var import_swr = __toESM(require("swr"));
var fetcher = (url) => fetch(url).then((r) => {
  return r.json();
}).then((data) => {
  return data || null;
});
var useOstSession = ({
  redirectTo,
  redirectIfFound
} = {}) => {
  const { data, error } = (0, import_swr.default)("/api/outstatic/user", fetcher);
  const session = data == null ? void 0 : data.session;
  const finished = Boolean(data);
  const hasUser = Boolean(session);
  const router = (0, import_navigation2.useRouter)();
  (0, import_react5.useEffect)(() => {
    if (!redirectTo || !finished)
      return;
    if (
      // If redirectTo is set, redirect if the user was not found.
      redirectTo && !redirectIfFound && !hasUser || // If redirectIfFound is also set, redirect if the user was found
      redirectIfFound && hasUser
    ) {
      router.push(redirectTo);
    }
  }, [redirectTo, redirectIfFound, finished, hasUser]);
  if (!data) {
    return {
      session: null,
      status: "loading"
    };
  }
  if (data && !hasUser || error) {
    return {
      session: null,
      status: "unauthenticated"
    };
  }
  return {
    session,
    status: "authenticated"
  };
};
function useOstSignOut() {
  const router = (0, import_navigation2.useRouter)();
  const signOut = () => {
    router.push("/api/outstatic/signout");
  };
  return { signOut };
}

// src/components/AdminHeader/index.tsx
var import_lucide_react = require("lucide-react");
var import_react6 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var AdminHeader = ({
  name,
  email,
  image,
  status,
  toggleSidebar
}) => {
  const [isOpen, setIsOpen] = (0, import_react6.useState)(false);
  const { signOut } = useOstSignOut();
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("nav", { className: "relative border-b border-gray-200 bg-white px-2 py-2.5 sm:px-4 h-14", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mx-auto flex flex-wrap items-center justify-between", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "button",
      {
        "data-collapse-toggle": "mobile-menu-2",
        type: "button",
        className: "ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden",
        "aria-controls": "mobile-menu-2",
        "aria-expanded": "false",
        onClick: toggleSidebar,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "sr-only", children: "Open main menu" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Menu, {})
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Link_default, { href: "/outstatic", "aria-label": "Outstatic", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "cursor-pointer flex items-center", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "svg",
      {
        fill: "none",
        height: "20",
        viewBox: "0 0 775 135",
        width: "115",
        xmlns: "http://www.w3.org/2000/svg",
        children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("g", { fill: "#1e293b", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m63.9963 134.869c-11.3546 0-21.0957-1.913-29.2232-5.738-8.008-3.824-14.522-8.904-19.5419-15.239-5.02-6.454-8.72517-13.565-11.11562-21.3344-2.39045-7.769-3.585673-15.5379-3.585673-23.3069 0-7.5299 1.254983-15.1196 3.764953-22.769 2.62949-7.769 6.51394-14.8805 11.65344-21.3347 5.259-6.4543 11.773-11.6535 19.5419-15.59772 7.8885-3.94424 17.0917-5.91636 27.6097-5.91636 10.996 0 20.4383 1.97212 28.3268 5.91636 8.008 3.94422 14.5813 9.20322 19.7213 15.77692 5.139 6.4542 8.964 13.5061 11.474 21.1555 2.63 7.6494 3.944 15.2391 3.944 22.769 0 7.4104-1.314 15.0001-3.944 22.769-2.51 7.6495-6.394 14.7613-11.653 21.3343-5.14 6.455-11.5941 11.654-19.363 15.598-7.769 3.944-16.9722 5.917-27.6097 5.917zm.8964-9.323c6.9323 0 12.9084-1.554 17.9284-4.662 5.1394-3.107 9.3227-7.231 12.5498-12.37 3.3467-5.259 5.7971-10.9962 7.3511-17.2114 1.553-6.3347 2.33-12.6096 2.33-18.8248 0-7.6494-.896-15-2.689-22.0519-1.793-7.1713-4.5419-13.5658-8.2471-19.1833-3.5856-5.7371-8.0677-10.2192-13.4462-13.4463-5.3785-3.3466-11.5937-5.0199-18.6455-5.0199-6.9323 0-12.9682 1.6135-18.1077 4.8406-5.1394 3.2271-9.3227 7.4702-12.5498 12.7292-3.2271 5.1394-5.6773 10.8765-7.3506 17.2112-1.5538 6.2152-2.3307 12.4901-2.3307 18.8248 0 6.2151.8366 12.7889 2.5099 19.7212 1.6734 6.9323 4.2431 13.3865 7.7092 19.3626 3.4662 5.976 7.8885 10.817 13.267 14.522 5.4981 3.705 12.0718 5.558 19.7212 5.558z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m179.299 134.869c-6.693 0-12.251-1.255-16.673-3.765-4.303-2.51-7.53-6.634-9.681-12.371-2.152-5.857-3.227-13.566-3.227-23.1276v-28.1475c0-2.0319 0-4.1235 0-6.2749.119-2.271.358-4.4821.717-6.6335-2.032.1195-4.183.239-6.454.3585-2.271 0-4.303.0598-6.096.1793v-9.502h4.303c5.976 0 10.458-.5379 13.446-1.6136s5.08-2.2111 6.275-3.4064h6.813v54.6815c0 9.4422 1.314 16.4942 3.944 21.1552 2.629 4.662 7.052 6.933 13.267 6.813 4.064 0 7.948-1.195 11.653-3.586 3.825-2.39 6.933-5.199 9.323-8.426v-42.4901c0-2.6295.06-5.0797.179-7.3507.12-2.3904.359-4.6613.718-6.8127-2.152.1195-4.363.239-6.634.3585-2.271 0-4.363.0598-6.275.1793v-9.502h5.199c5.259 0 9.383-.5379 12.371-1.6136s5.139-2.2111 6.454-3.4064h6.813l-.179 65.9767c0 1.912-.06 4.542-.18 7.888-.119 3.227-.298 6.096-.538 8.606 2.032-.12 4.124-.239 6.275-.359 2.271-.119 4.363-.179 6.275-.179v9.502h-28.506c-.239-1.912-.478-3.705-.717-5.379-.119-1.673-.299-3.286-.538-4.84-3.705 3.466-8.008 6.514-12.908 9.143-4.901 2.63-10.04 3.945-15.419 3.945z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m283.918 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.426-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.435-4.422-2.152-10.279-2.152-17.57l.359-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.86-3.5857 3.347-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.427v25.0997h27.609v9.3227l-27.609.3586-.359 47.8687c0 4.5418.359 8.5458 1.076 12.0118.837 3.347 2.151 5.976 3.944 7.889 1.913 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.427-2.51 2.988-1.673 5.796-4.422 8.426-8.247l6.096 5.378c-2.869 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.618 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.152.358-3.885.538-5.2.538z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m358.946 134.869c-5.618 0-10.817-.777-15.598-2.331-4.781-1.434-8.605-3.168-11.474-5.199l.538 5.916h-9.502l-.897-30.837h7.53c.239 4.423 1.614 8.427 4.124 12.012 2.51 3.586 5.737 6.395 9.681 8.427 4.064 2.031 8.426 3.047 13.088 3.047 2.749 0 5.438-.418 8.068-1.255 2.629-.956 4.84-2.33 6.633-4.123 1.793-1.913 2.689-4.243 2.689-6.992 0-2.988-.956-5.439-2.868-7.351-1.793-2.032-4.303-3.825-7.53-5.378-3.108-1.5542-6.693-3.108-10.757-4.6618-3.586-1.4342-7.231-2.9282-10.936-4.482-3.586-1.5538-6.933-3.4064-10.04-5.5578-3.108-2.1514-5.558-4.7809-7.351-7.8885-1.793-3.2271-2.689-7.1714-2.689-11.8327 0-2.749.538-5.6773 1.613-8.7849 1.076-3.2271 2.809-6.1554 5.2-8.7849 2.39-2.749 5.617-4.9602 9.681-6.6335 4.064-1.7928 9.084-2.6893 15.06-2.6893 3.227 0 6.812.5379 10.757 1.6136 4.063 1.0757 7.828 2.9283 11.295 5.5578l-.18-6.2749h9.502v31.5539h-7.709c-.358-4.1833-1.494-8.0678-3.406-11.6535-1.793-3.5856-4.363-6.5139-7.709-8.7849-3.347-2.2709-7.411-3.4064-12.192-3.4064-4.661 0-8.486 1.1953-11.474 3.5857-2.868 2.2709-4.303 5.1395-4.303 8.6056 0 3.4662 1.076 6.275 3.227 8.4264 2.271 2.1514 5.2 4.004 8.785 5.5578 3.586 1.5537 7.47 3.1075 11.654 4.6613 5.02 2.0319 9.741 4.2431 14.163 6.6335 4.422 2.3905 8.008 5.3785 10.757 8.9642s4.124 8.1273 4.124 13.6253c0 5.976-1.554 10.996-4.662 15.06-2.988 3.944-6.872 6.873-11.653 8.785s-9.861 2.869-15.239 2.869z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m439.216 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.427-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.434-4.422-2.151-10.279-2.151-17.57l.358-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.861-3.5857 3.346-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.426v25.0997h27.61v9.3227l-27.61.3586-.358 47.8687c0 4.5418.358 8.5458 1.075 12.0118.837 3.347 2.152 5.976 3.945 7.889 1.912 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.426-2.51 2.988-1.673 5.797-4.422 8.426-8.247l6.096 5.378c-2.869 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.617 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.151.358-3.884.538-5.199.538z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m528.944 132c-.239-1.912-.418-3.586-.537-5.02-.12-1.434-.299-2.928-.538-4.482-4.064 4.064-8.427 7.171-13.088 9.323-4.661 2.032-9.502 3.048-14.522 3.048-8.606 0-15.119-2.092-19.542-6.275-4.303-4.303-6.454-9.622-6.454-15.957 0-5.498 1.614-10.279 4.841-14.3423 3.227-4.0638 7.47-7.3507 12.729-9.8606 5.259-2.6295 10.996-4.5419 17.211-5.7371 6.215-1.3148 12.311-1.9721 18.287-1.9721v-10.5778c0-3.8247-.359-7.3506-1.076-10.5777-.717-3.3466-2.211-6.0359-4.482-8.0678-2.151-2.1514-5.558-3.2271-10.219-3.2271-3.108-.1195-6.215.4781-9.323 1.7929-3.107 1.1952-5.498 3.2271-7.171 6.0956.956.9562 1.554 2.0917 1.793 3.4064.358 1.1952.538 2.3307.538 3.4064 0 1.6733-.718 3.5857-2.152 5.7371-1.434 2.0318-3.884 2.988-7.35 2.8685-2.869 0-5.08-.9562-6.634-2.8685-1.434-2.0319-2.151-4.3626-2.151-6.9921 0-4.3028 1.553-8.1275 4.661-11.4741 3.227-3.3467 7.59-5.9762 13.088-7.8885 5.498-1.9124 11.653-2.8686 18.466-2.8686 10.279 0 17.928 2.6893 22.948 8.0678 5.14 5.3785 7.709 13.8646 7.709 25.4583v12.3705c0 3.9443-.059 7.8885-.179 11.8328v12.55c0 1.793-.06 3.825-.179 6.095-.12 2.271-.299 4.662-.538 7.172 2.032-.12 4.124-.239 6.275-.359 2.151-.119 4.183-.179 6.096-.179v9.502zm-1.613-43.0281c-3.825.2391-7.769.7769-11.833 1.6136-3.944.8366-7.53 2.0916-10.757 3.7649s-5.856 3.8247-7.888 6.4546c-1.913 2.629-2.869 5.796-2.869 9.502.239 4.063 1.554 7.051 3.944 8.964 2.51 1.912 5.439 2.868 8.785 2.868 4.184 0 7.889-.777 11.116-2.33 3.227-1.674 6.394-3.945 9.502-6.813-.12-1.315-.179-2.63-.179-3.944 0-1.435 0-2.929 0-4.482 0-1.076 0-3.048 0-5.9168.119-2.988.179-6.2151.179-9.6813z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m602.217 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.427-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.434-4.422-2.151-10.279-2.151-17.57l.358-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.861-3.5857 3.346-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.426v25.0997h27.61v9.3227l-27.61.3586-.358 47.8687c0 4.5418.358 8.5458 1.075 12.0118.837 3.347 2.152 5.976 3.945 7.889 1.912 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.426-2.51 2.988-1.673 5.797-4.422 8.426-8.247l6.096 5.378c-2.868 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.617 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.151.358-3.884.538-5.199.538z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m639.057 124.47c3.585 0 6.095-.837 7.53-2.51 1.434-1.673 2.271-4.004 2.51-6.992.358-2.988.538-6.454.538-10.398v-37.1121c0-2.0319.059-4.0638.179-6.0957.119-2.1514.299-4.4223.538-6.8127-2.032.1195-4.184.239-6.455.3585-2.27 0-4.362.0598-6.275.1793v-9.502c5.379 0 9.622-.2391 12.73-.7172 3.227-.5976 5.677-1.2549 7.35-1.9721 1.793-.7171 3.108-1.494 3.945-2.3307h6.812v69.2037c0 2.151-.059 4.362-.179 6.633-.119 2.152-.299 4.363-.538 6.634 1.913-.12 3.825-.179 5.737-.179 2.032-.12 3.885-.24 5.558-.359v9.502h-39.98zm19.183-100.3988c-3.107 0-5.737-1.1354-7.888-3.4063-2.152-2.3905-3.227-5.259-3.227-8.6057 0-3.34658 1.135-6.15536 3.406-8.42628 2.271-2.39045 4.841-3.5856788 7.709-3.5856788 3.108 0 5.677 1.1952288 7.709 3.5856788 2.152 2.27092 3.227 5.0797 3.227 8.42628 0 3.3467-1.075 6.2152-3.227 8.6057-2.032 2.2709-4.601 3.4063-7.709 3.4063z" }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "m735.314 134.869c-8.008 0-15.359-1.793-22.052-5.379-6.693-3.705-12.072-8.964-16.136-15.777-3.944-6.813-5.916-15.0598-5.916-24.7411 0-6.4542 1.136-12.6096 3.407-18.4662 2.27-5.9761 5.438-11.2949 9.502-15.9562 4.183-4.6614 9.083-8.3068 14.701-10.9363 5.737-2.7491 12.072-4.1236 19.004-4.1236 7.052 0 13.088 1.0757 18.108 3.2271 5.019 2.1514 8.844 4.9602 11.474 8.4264 2.749 3.4661 4.123 7.2311 4.123 11.2948 0 2.8686-.837 5.3785-2.51 7.5299-1.673 2.1515-4.064 3.2272-7.171 3.2272-3.466.1195-5.917-.8965-7.351-3.0479-1.434-2.2709-2.151-4.3625-2.151-6.2749 0-1.0757.179-2.2709.538-3.5857.358-1.4342 1.016-2.6892 1.972-3.7649-.956-2.51-2.51-4.3626-4.662-5.5578-2.151-1.1952-4.362-1.9721-6.633-2.3307s-4.183-.5379-5.737-.5379c-7.291.1196-13.446 3.2869-18.466 9.5021-4.901 6.0956-7.351 14.9403-7.351 26.5339 0 7.4104 1.076 14.0439 3.227 19.9008 2.271 5.856 5.558 10.518 9.861 13.984s9.442 5.259 15.418 5.378c5.379 0 10.578-1.374 15.598-4.123 5.02-2.869 9.083-6.454 12.191-10.757l5.737 5.02c-3.466 5.378-7.47 9.621-12.012 12.729-4.422 3.107-8.964 5.319-13.625 6.633-4.542 1.315-8.905 1.973-13.088 1.973z" })
        ] })
      }
    ) }) }),
    status === "loading" || /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center md:order-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "button",
        {
          type: "button",
          className: "mr-3 flex items-center rounded-full bg-gray-800 text-sm focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 md:mr-0",
          id: "user-menu-button",
          "aria-expanded": "false",
          "data-dropdown-toggle": "dropdown",
          onClick: () => setIsOpen(!isOpen),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "sr-only", children: "Open user menu" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "img",
              {
                className: "h-8 w-8 rounded-full",
                src: image || "",
                alt: "user"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
        "div",
        {
          className: `right-0 top-[60px] z-50 my-4 w-full list-none divide-y divide-gray-100 rounded-br rounded-bl bg-white text-base shadow md:-right-0 md:top-[52px] md:w-auto ${isOpen ? "block" : "hidden"}`,
          id: "dropdown",
          style: {
            position: "absolute",
            margin: "0px"
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "py-3 px-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "block text-sm text-gray-900", children: name }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "block truncate text-sm font-medium text-gray-500", children: email })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("ul", { className: "py-1", "aria-labelledby": "dropdown", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "a",
              {
                className: "block cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100",
                onClick: signOut,
                children: "Sign out"
              }
            ) }) })
          ]
        }
      )
    ] })
  ] }) }) });
};
var AdminHeader_default = AdminHeader;

// src/utils/constants.ts
var OUTSTATIC_VERSION = "1.4.0";
var IMAGES_PATH = "images/";
var API_IMAGES_PATH = "api/outstatic/images/";

// src/utils/generateUniqueId.ts
function generateUniqueId(_0) {
  return __async(this, arguments, function* ({
    repoOwner,
    repoSlug
  }) {
    const encoder = new TextEncoder();
    const data = encoder.encode(repoOwner + repoSlug);
    const hash = yield window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hash));
    const uniqueId = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return uniqueId;
  });
}
var generateUniqueId_default = generateUniqueId;

// src/components/Sidebar/index.tsx
var import_js_cookie = __toESM(require("js-cookie"));
var import_react7 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var initialBroadcast = () => {
  const broadcast = import_js_cookie.default.get("ost_broadcast");
  return broadcast ? JSON.parse(broadcast) : null;
};
var Sidebar = ({ isOpen = false }) => {
  const [broadcast, setBroadcast] = (0, import_react7.useState)(
    initialBroadcast()
  );
  const { collections, repoOwner, repoSlug } = useOutstatic();
  (0, import_react7.useEffect)(() => {
    const fetchBroadcast = () => __async(void 0, null, function* () {
      const url = new URL(`https://analytics.outstatic.com/`);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const uniqueId = yield generateUniqueId_default({ repoOwner, repoSlug });
      url.searchParams.append("timezone", timezone);
      url.searchParams.append("unique_id", uniqueId);
      url.searchParams.append("version", OUTSTATIC_VERSION);
      yield fetch(url.toString()).then((res) => res.json()).then((data) => {
        if (data == null ? void 0 : data.title) {
          setBroadcast(data);
          import_js_cookie.default.set("ost_broadcast", JSON.stringify(data), {
            expires: 1
            // 1 day
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    });
    if (!broadcast) {
      fetchBroadcast();
    }
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "aside",
    {
      className: `absolute top-[53px] z-20 h-full w-full md:relative md:top-0 lg:block md:w-64 md:min-w-[16rem] ${isOpen ? "block" : "hidden"}`,
      "aria-label": "Sidebar",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col py-4 px-3 h-full max-h-[calc(100vh-96px)] overflow-y-scroll scrollbar-hide bg-gray-50 justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("ul", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link_default, { href: "/outstatic", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 cursor-pointer", children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                "svg",
                {
                  className: "h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 24 24",
                  width: "24",
                  height: "24",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { fill: "none", d: "M0 0h24v24H0z" }),
                    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "path",
                      {
                        fill: "currentColor",
                        d: "M13 21V11h8v10h-8zM3 13V3h8v10H3zm6-2V5H5v6h4zM3 21v-6h8v6H3zm2-2h4v-2H5v2zm10 0h4v-6h-4v6zM13 3h8v6h-8V3zm2 2v2h4V5h-4z"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "ml-3", children: "Collections" })
            ] }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_jsx_runtime5.Fragment, { children: collections.map((collection) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link_default, { href: `/outstatic/${collection}`, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 cursor-pointer", children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "svg",
                {
                  className: "h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: "2",
                      d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    }
                  )
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "ml-3 capitalize", children: collection })
            ] }) }) }, collection)) }),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Link_default, { href: "/outstatic/settings", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 cursor-pointer", children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "svg",
                {
                  className: "h-6 w-6 shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg",
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                    "path",
                    {
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeWidth: 2,
                      d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    }
                  )
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "ml-3 flex-1 whitespace-nowrap", children: "Settings" })
            ] }) }) })
          ] }),
          broadcast ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "div",
            {
              className: "p-4 mt-6 rounded-lg bg-white border border-gray",
              role: "alert",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex items-center mb-3", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full", children: broadcast.title }) }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { className: "text-sm", children: broadcast.content }),
                (broadcast == null ? void 0 : broadcast.link) ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("a", { href: broadcast.link, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "mt-3 text-xs underline font-medium", children: "Learn more" }) }) : null
              ]
            }
          ) : null
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "h-10 bg-gray-50 py-2 px-4 border-t text-xs flex justify-between items-center w-full", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "a",
            {
              className: "font-semibold text-gray-500 hover:underline hover:text-gray-900",
              href: "https://outstatic.com/docs",
              target: "_blank",
              rel: "noreferrer",
              children: "Documentation"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "gap-2 flex items-center justify-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "a",
              {
                href: "https://github.com/avitorio/outstatic",
                target: "_blank",
                "aria-label": "GitHub",
                rel: "noreferrer",
                className: "group",
                children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    width: "20",
                    height: "20",
                    fill: "none",
                    "aria-label": "GitHub logo",
                    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "path",
                      {
                        fillRule: "evenodd",
                        clipRule: "evenodd",
                        d: "M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z",
                        transform: "scale(1.2)",
                        className: "fill-gray-400 group-hover:fill-gray-900"
                      }
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "a",
              {
                href: "https://x.com/outstatic",
                target: "_blank",
                "aria-label": "X.com",
                rel: "noreferrer",
                className: "group w-5 h-5 flex items-center justify-center",
                children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: "0 0 300 300.251",
                    width: "17",
                    height: "17",
                    fill: "none",
                    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "path",
                      {
                        className: "fill-gray-400 group-hover:fill-gray-900",
                        d: "M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"
                      }
                    )
                  }
                )
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              "a",
              {
                href: "https://discord.gg/cR33yCRY",
                target: "_blank",
                "aria-label": "Discord",
                rel: "noreferrer",
                className: "group w-5 h-5 flex items-center justify-center",
                children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "svg",
                  {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    width: "18",
                    height: "18",
                    viewBox: "0 -28.5 256 256",
                    version: "1.1",
                    preserveAspectRatio: "xMidYMid",
                    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "path",
                      {
                        className: "fill-gray-400 group-hover:fill-gray-900",
                        d: "M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z",
                        "fill-rule": "nonzero"
                      }
                    ) })
                  }
                )
              }
            )
          ] })
        ] })
      ]
    }
  );
};
var Sidebar_default = Sidebar;

// src/components/AdminLayout/index.tsx
var import_navigation3 = require("next/navigation");
var import_react8 = require("react");
var import_sonner = require("sonner");
var import_jsx_runtime6 = require("react/jsx-runtime");
function AdminLayout({
  children,
  error,
  settings,
  title
}) {
  const { session, status } = useOstSession();
  const { push } = (0, import_navigation3.useRouter)();
  const [openSidebar, setOpenSidebar] = (0, import_react8.useState)(false);
  const toggleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };
  (0, import_react8.useEffect)(() => {
    const pageTitle = title ? `${title} | Outstatic` : "Outstatic";
    document.title = pageTitle;
  }, [title]);
  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      push(`/outstatic`);
    }
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_jsx_runtime6.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { id: "outstatic", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_sonner.Toaster, { richColors: true }),
    status === "loading" ? null : /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex h-screen flex-col bg-white text-black", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        AdminHeader_default,
        __spreadProps(__spreadValues({}, session == null ? void 0 : session.user), {
          status,
          toggleSidebar
        })
      ),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex md:grow flex-col-reverse justify-between md:flex-row", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Sidebar_default, { isOpen: openSidebar }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("main", { className: "w-auto flex-auto p-5 md:p-10 bg-white h-dvh max-h-[calc(100vh-128px)] md:max-h-[calc(100vh-53px)] overflow-y-scroll scrollbar-hide", children: [
          error && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "mb-6 border border-red-500 p-2", children: [
            "Something went wrong",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { role: "img", "aria-label": "sad face", children: "\u{1F613}" })
          ] }),
          children
        ] }),
        settings && settings
      ] })
    ] })
  ] }) });
}

// src/components/Input/index.tsx
var import_react_hook_form = require("react-hook-form");
var import_jsx_runtime7 = require("react/jsx-runtime");
var sizes = {
  small: {
    label: "mb-1 block text-sm font-medium text-gray-900",
    input: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500"
  },
  medium: {
    label: "block mb-2 text-sm font-medium text-gray-900",
    input: "block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm outline-none focus:ring-blue-500 focus:border-blue-500"
  }
};
var InputField = (_a) => {
  var _b = _a, {
    label,
    placeholder = "",
    helperText,
    id,
    type = "text",
    readOnly = false,
    registerOptions,
    wrapperClass,
    className,
    inputSize = "medium"
  } = _b, rest = __objRest(_b, [
    "label",
    "placeholder",
    "helperText",
    "id",
    "type",
    "readOnly",
    "registerOptions",
    "wrapperClass",
    "className",
    "inputSize"
  ]);
  var _a2, _b2, _c, _d;
  const {
    register,
    formState: { errors }
  } = (0, import_react_hook_form.useFormContext)();
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: wrapperClass, children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "label",
      {
        htmlFor: id,
        className: `${sizes[inputSize].label} first-letter:capitalize`,
        children: label
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "input",
      __spreadProps(__spreadValues(__spreadValues({}, register(id, registerOptions)), rest), {
        className: `${sizes[inputSize].input} ${className}`,
        type,
        name: id,
        id,
        readOnly,
        placeholder,
        "aria-describedby": id
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_jsx_runtime7.Fragment, { children: (((_a2 = errors[id]) == null ? void 0 : _a2.message) || helperText) && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "mt-1 first-letter:capitalize", children: [
      helperText && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-xs text-gray-500", children: helperText }),
      ((_b2 = errors[id]) == null ? void 0 : _b2.message) && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("span", { className: "text-sm text-red-500", children: (_d = (_c = errors[id]) == null ? void 0 : _c.message) == null ? void 0 : _d.toString() })
    ] }) })
  ] });
};
var Input_default = InputField;

// src/components/MDEMenuButton/index.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var MDEMenuButton = ({
  onClick,
  editor,
  children,
  name,
  disabled = false,
  attributes = {},
  tag = "button",
  htmlFor
}) => {
  const Tag = tag;
  const inputProps = {};
  if (htmlFor) {
    inputProps.htmlFor = htmlFor;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    Tag,
    __spreadProps(__spreadValues({
      onClick: (e) => {
        e.preventDefault();
        onClick();
      },
      title: name,
      className: `group border-r border-slate-300 py-4 px-4 last-of-type:border-r-0 disabled:cursor-not-allowed disabled:hover:bg-gray-600 ${editor.isActive(name, attributes) ? "is-active bg-slate-200" : "bg-white text-black hover:bg-slate-100"}`,
      disabled
    }, inputProps), {
      children
    })
  );
};
var MDEMenuButton_default = MDEMenuButton;

// src/utils/hooks/useFileStore.tsx
var import_zustand = require("zustand");
var useFileStore = (0, import_zustand.create)((set) => ({
  // Initial state
  files: [],
  // Add file function
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  // Remove file function
  removeFile: (blob) => set((state) => ({
    files: state.files.filter((file) => file.blob !== blob)
  }))
}));

// src/components/MDEImageMenu/index.tsx
var import_react9 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
var MDEUImageMenu = ({ editor, setImageSelected }) => {
  const { removeFile } = useFileStore();
  const [showLink, setShowLink] = (0, import_react9.useState)(false);
  const [url, setUrl] = (0, import_react9.useState)("");
  const [showAltText, setShowAltText] = (0, import_react9.useState)(false);
  const [altText, setAltText] = (0, import_react9.useState)("");
  const setLink = (0, import_react9.useCallback)(() => {
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    if (url === "" || url === void 0) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setShowLink(false);
    editor.chain().blur().run();
    setUrl("");
  }, [editor, url]);
  const addAltText = (0, import_react9.useCallback)(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().updateAttributes("image", {
      alt: altText
    }).setLink({ href: editor.getAttributes("link").href }).run();
    setShowAltText(false);
    setImageSelected(true);
    editor.chain().blur().run();
    setUrl("");
    setAltText("");
  }, [editor, altText, setImageSelected]);
  const removeImage = () => {
    const blob = editor.getAttributes("image").src;
    removeFile(blob);
    editor.chain().focus().deleteSelection().run();
    setImageSelected(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    showAltText && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        MDEMenuButton_default,
        {
          onClick: () => {
            setShowAltText(false);
            setImageSelected(true);
          },
          editor,
          name: "back",
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              width: "24",
              height: "24",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { fill: "none", d: "M0 0h24v24H0z" }),
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "input",
        {
          id: "alt-text",
          name: "alt-text",
          required: true,
          className: "w-[500px] border-r border-black py-2 px-3 outline-none",
          placeholder: "Insert alt text here",
          onChange: (e) => {
            setAltText(e.target.value.trim());
          },
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              addAltText();
            }
            if (e.key === "Escape") {
              setShowAltText(false);
              setImageSelected(true);
            }
          },
          defaultValue: altText,
          autoFocus: true
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MDEMenuButton_default, { onClick: addAltText, editor, name: "addAltText", children: "Done" })
    ] }),
    showLink && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        MDEMenuButton_default,
        {
          onClick: () => {
            if (editor.isActive("image")) {
              setImageSelected(true);
            }
            setShowLink(false);
          },
          editor,
          name: "back",
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              width: "24",
              height: "24",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { fill: "none", d: "M0 0h24v24H0z" }),
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M7.828 11H20v2H7.828l5.364 5.364-1.414 1.414L4 12l7.778-7.778 1.414 1.414z" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "input",
        {
          id: "link",
          name: "link",
          type: "url",
          required: true,
          className: "w-[500px] border-r border-black py-2 px-3 outline-none",
          placeholder: "Insert link here",
          onChange: (e) => {
            setUrl(e.target.value.trim());
          },
          onKeyDown: (e) => {
            if (e.key === "Enter") {
              setLink();
            }
            if (e.key === "Escape") {
              setShowLink(false);
            }
          },
          autoFocus: true,
          defaultValue: url
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MDEMenuButton_default, { onClick: setLink, editor, name: "submitLink", children: "Done" })
    ] }),
    !showAltText && !showLink && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        MDEMenuButton_default,
        {
          onClick: () => {
            setUrl(editor.getAttributes("link").href);
            setShowLink(true);
          },
          editor,
          name: "link",
          children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 24 24",
              width: "24",
              height: "24",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { fill: "none", d: "M0 0h24v24H0z" }),
                /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("path", { d: "M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z" })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        MDEMenuButton_default,
        {
          onClick: () => {
            setAltText(editor.getAttributes("image").alt);
            setShowAltText(true);
          },
          editor,
          name: "image",
          attributes: editor.getAttributes("image").alt ? { alt: editor.getAttributes("image").alt } : { alt: false },
          children: "Alt Text"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        MDEMenuButton_default,
        {
          onClick: removeImage,
          editor,
          name: "remove-image",
          children: "Remove Image"
        }
      )
    ] })
  ] });
};
var MDEImageMenu_default = MDEUImageMenu;

// src/components/MDEMenu/index.tsx
var import_react10 = require("@tiptap/react");
var import_lucide_react2 = require("lucide-react");
var import_react11 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var MDEMenu = ({ editor }) => {
  const [imageSelected, setImageSelected] = (0, import_react11.useState)(false);
  const [showLink, setShowLink] = (0, import_react11.useState)(false);
  const [url, setUrl] = (0, import_react11.useState)("");
  const setLink = (0, import_react11.useCallback)(() => {
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    if (url === "" || url === void 0) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setShowLink(false);
    editor.chain().blur().run();
    setUrl("");
  }, [editor, url]);
  (0, import_react11.useEffect)(() => {
    const activeImage = () => {
      if (editor.isActive("image")) {
        setImageSelected(true);
      }
    };
    editor.on("selectionUpdate", activeImage);
    editor.on("focus", activeImage);
  }, [editor]);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    import_react10.BubbleMenu,
    {
      editor,
      tippyOptions: {
        duration: 100,
        maxWidth: 500,
        onHidden: () => {
          setImageSelected(false);
          setShowLink(false);
        }
      },
      shouldShow: ({ editor: editor2, view, state, from: from2, to }) => {
        const { doc, selection } = state;
        const { empty } = selection;
        const isEmptyTextBlock = !doc.textBetween(from2, to).length && (0, import_react10.isTextSelection)(state.selection);
        if (!view.hasFocus() || empty || isEmptyTextBlock || editor2.isActive("codeBlock")) {
          return false;
        }
        return true;
      },
      children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "flex prose-sm rounded-md border border-stone-200 bg-white shadow-md transition-all", children: [
        showLink && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => {
                setShowLink(false);
              },
              editor,
              name: "back",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.ArrowLeft, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            "input",
            {
              id: "link",
              name: "link",
              type: "url",
              required: true,
              className: "w-[500px] border-r border-slate-200 py-2 px-3 outline-none",
              placeholder: "Insert link here",
              onChange: (e) => {
                setUrl(e.target.value.trim());
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  setLink();
                }
                if (e.key === "Escape") {
                  setShowLink(false);
                }
              },
              autoFocus: true,
              defaultValue: url
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(MDEMenuButton_default, { onClick: setLink, editor, name: "submitLink", children: "Done" })
        ] }),
        imageSelected && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(MDEImageMenu_default, { editor, setImageSelected }),
        !imageSelected && !showLink && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(import_jsx_runtime10.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => editor.chain().focus().toggleBold().run(),
              editor,
              name: "bold",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.Bold, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => editor.chain().focus().toggleItalic().run(),
              editor,
              name: "italic",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.Italic, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => {
                setUrl(editor.getAttributes("link").href);
                setShowLink(true);
              },
              editor,
              name: "link",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.Link, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => editor.chain().focus().toggleCode().run(),
              editor,
              name: "code",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.Terminal, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
              editor,
              name: "heading",
              attributes: { level: 2 },
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.Heading2, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
              editor,
              name: "heading",
              attributes: { level: 3 },
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.Heading3, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => editor.chain().focus().toggleCodeBlock({ language: "javascript" }).run(),
              editor,
              name: "codeBlock",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.Code2, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => editor.chain().focus().toggleBlockquote().run(),
              editor,
              name: "blockquote",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.TextQuote, { size: 18 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
            MDEMenuButton_default,
            {
              onClick: () => editor.chain().focus().clearNodes().run(),
              editor,
              name: "clear",
              children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react2.Undo2, { size: 18 })
            }
          )
        ] })
      ] })
    }
  );
};
var MDEMenu_default = MDEMenu;

// src/components/MDEditor/index.tsx
var import_react12 = require("@tiptap/react");
var import_react_hook_form2 = require("react-hook-form");
var import_jsx_runtime11 = require("react/jsx-runtime");
var MDEditor = ({ id, editor }) => {
  var _a, _b, _c;
  const {
    watch,
    formState: { errors }
  } = (0, import_react_hook_form2.useFormContext)();
  const watchContent = watch("content");
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
    editor && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(MDEMenu_default, { editor }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(import_react12.EditorContent, { name: "content", value: watchContent, editor }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "mt-1", children: ((_a = errors[id]) == null ? void 0 : _a.message) && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-sm text-red-500", children: (_c = (_b = errors[id]) == null ? void 0 : _b.message) == null ? void 0 : _c.toString() }) })
  ] });
};
var MDEditor_default = MDEditor;

// src/components/Accordion/index.tsx
var import_react13 = require("react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var Accordion = ({
  title,
  callback,
  children,
  error = false
}) => {
  const [show, setShow] = (0, import_react13.useState)(false);
  const handleShow = () => {
    setShow(!show);
    if (callback) {
      callback();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "w-full border-b first:border-t", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h2", { id: "accordion-collapse-heading-1 bg-red-50 ", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "button",
      {
        type: "button",
        className: `flex items-center justify-between w-full text-sm font-medium text-gray-900 p-4 hover:bg-gray-50 focus:outline-none focus:outline-blue-300 focus:outline-offset-[-1px] ${error ? "bg-red-50" : ""}`,
        onClick: handleShow,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { className: "capitalize", children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "svg",
            {
              "data-accordion-icon": true,
              className: `w-6 h-6 shrink-0 ${show ? "" : "rotate-180"}`,
              fill: "currentColor",
              viewBox: "0 0 20 20",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                "path",
                {
                  fillRule: "evenodd",
                  d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
                  clipRule: "evenodd"
                }
              )
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: show ? "block" : "hidden", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "p-4 font-light border-gray-200 border-t", children }) })
  ] });
};
var Accordion_default = Accordion;

// src/components/DateTimePicker/index.tsx
var import_react14 = require("react");
var import_react_datepicker = __toESM(require("react-datepicker"));
var import_jsx_runtime13 = require("react/jsx-runtime");
var options = {
  year: "numeric",
  month: "long",
  day: "numeric"
};
var getYear = (date2) => {
  return date2.getFullYear();
};
var getMonth = (date2) => {
  return date2.getMonth();
};
var years = Array.from(
  { length: 100 },
  (_, i) => (/* @__PURE__ */ new Date()).getFullYear() - i
);
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
var DateTimePicker = ({ date: date2, setDate, id, label }) => {
  const DatePickerButton = (props, ref) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    "button",
    __spreadProps(__spreadValues({}, props), {
      ref,
      className: "block cursor-pointer appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500",
      disabled: !date2,
      children: date2 ? date2.toLocaleDateString("en-US", options) : "Loading"
    })
  );
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("label", { className: "block text-sm font-medium text-gray-900", htmlFor: id, children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      import_react_datepicker.default,
      {
        name: id,
        selected: date2,
        onChange: (date3) => {
          setDate(date3);
        },
        renderCustomHeader: ({
          date: date3,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled
        }) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "react-datepicker__header", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "select",
            {
              className: "react-datepicker__current-month appearance-none cursor-pointer hover:text-blue-500",
              value: getYear(date3),
              onChange: ({ target: { value } }) => changeYear(Number(value)),
              children: years.map((option) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: option, children: option }, option))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "select",
            {
              className: "react-datepicker__current-month appearance-none cursor-pointer hover:text-blue-500",
              value: months[getMonth(date3)],
              onChange: ({ target: { value } }) => changeMonth(months.indexOf(value)),
              children: months.map((option) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: option, children: option }, option))
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "button",
            {
              onClick: decreaseMonth,
              disabled: prevMonthButtonDisabled,
              type: "button",
              className: "react-datepicker__navigation react-datepicker__navigation--previous",
              "aria-label": "Previous Month",
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous", children: "Previous Month" })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "button",
            {
              onClick: increaseMonth,
              disabled: nextMonthButtonDisabled,
              type: "button",
              className: "react-datepicker__navigation react-datepicker__navigation--next",
              "aria-label": "Next Month",
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "react-datepicker__navigation-icon react-datepicker__navigation-icon--next", children: "Next Month" })
            }
          )
        ] }),
        customInput: (0, import_react14.createElement)((0, import_react14.forwardRef)(DatePickerButton)),
        showTimeInput: true,
        timeInputLabel: "Time:",
        withPortal: true,
        portalId: "__next"
      }
    ) })
  ] });
};
var DateTimePicker_default = DateTimePicker;

// src/components/Modal/index.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
var Modal = ({ children, title, close }) => /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "fixed inset-x-0 z-50 flex w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-[rgba(0,0,0,0.5)] inset-0 h-full", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "relative w-full max-w-2xl p-4 md:h-auto", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "relative rounded-lg bg-white shadow", children: [
  /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)("div", { className: "flex items-start justify-between rounded-t border-b p-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("h3", { className: "text-xl font-semibold text-gray-900 capitalize", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
      "button",
      {
        type: "button",
        className: "ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white",
        "data-modal-toggle": "defaultModal",
        onClick: close,
        children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
          "svg",
          {
            className: "h-5 w-5",
            fill: "currentColor",
            viewBox: "0 0 20 20",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
              "path",
              {
                fillRule: "evenodd",
                d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
                clipRule: "evenodd"
              }
            )
          }
        )
      }
    )
  ] }),
  children
] }) }) });
var Modal_default = Modal;

// src/graphql/generated/index.ts
var import_client2 = require("@apollo/client");
var Apollo = __toESM(require("@apollo/client"));
var defaultOptions = {};
var TreeDetailsFragmentDoc = import_client2.gql`
  fragment TreeDetails on TreeEntry {
    path
    type
  }
`;
var BlobDetailsFragmentDoc = import_client2.gql`
  fragment BlobDetails on Blob {
    oid
    commitUrl
  }
`;
var RecursiveTreeDetailsFragmentDoc = import_client2.gql`
  fragment RecursiveTreeDetails on Tree {
    entries {
      ...TreeDetails
      object {
        ... on Blob {
          ...BlobDetails
        }
        ... on Tree {
          entries {
            ...TreeDetails
            object {
              ... on Blob {
                ...BlobDetails
              }
              ... on Tree {
                entries {
                  ...TreeDetails
                  object {
                    ... on Blob {
                      ...BlobDetails
                    }
                    ... on Tree {
                      entries {
                        ...TreeDetails
                        object {
                          ... on Blob {
                            ...BlobDetails
                          }
                          ... on Tree {
                            entries {
                              ...TreeDetails
                              object {
                                ... on Blob {
                                  ...BlobDetails
                                }
                                ... on Tree {
                                  entries {
                                    ...TreeDetails
                                    object {
                                      ... on Blob {
                                        ...BlobDetails
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${TreeDetailsFragmentDoc}
  ${BlobDetailsFragmentDoc}
`;
var CreateCommitDocument = import_client2.gql`
  mutation createCommit($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      commit {
        oid
      }
    }
  }
`;
function useCreateCommitMutation(baseOptions) {
  const options3 = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useMutation(CreateCommitDocument, options3);
}
var CollectionsDocument = import_client2.gql`
  query Collections($owner: String!, $name: String!, $contentPath: String!) {
    repository(owner: $owner, name: $name) {
      id
      object(expression: $contentPath) {
        ... on Tree {
          entries {
            name
            type
          }
        }
      }
    }
  }
`;
var DocumentDocument = import_client2.gql`
  query Document($owner: String!, $name: String!, $filePath: String!) {
    repository(owner: $owner, name: $name) {
      id
      object(expression: $filePath) {
        ... on Blob {
          text
          commitUrl
        }
      }
    }
  }
`;
function useDocumentQuery(baseOptions) {
  const options3 = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useQuery(
    DocumentDocument,
    options3
  );
}
function useDocumentLazyQuery(baseOptions) {
  const options3 = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useLazyQuery(
    DocumentDocument,
    options3
  );
}
var DocumentsDocument = import_client2.gql`
  query Documents($owner: String!, $name: String!, $contentPath: String!) {
    repository(owner: $owner, name: $name) {
      id
      object(expression: $contentPath) {
        ... on Tree {
          entries {
            name
            object {
              ... on Blob {
                text
              }
            }
          }
        }
      }
    }
  }
`;
function useDocumentsQuery(baseOptions) {
  const options3 = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useQuery(
    DocumentsDocument,
    options3
  );
}
var GetFileInformationDocument = import_client2.gql`
  query GetFileInformation(
    $owner: String!
    $name: String!
    $expression: String!
  ) {
    repository(owner: $owner, name: $name) {
      id
      object(expression: $expression) {
        ... on Tree {
          commitUrl
          ...RecursiveTreeDetails
        }
      }
    }
  }
  ${RecursiveTreeDetailsFragmentDoc}
`;
function useGetFileInformationQuery(baseOptions) {
  const options3 = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useQuery(GetFileInformationDocument, options3);
}
var OidDocument = import_client2.gql`
  query Oid($owner: String!, $name: String!, $branch: String!) {
    repository(owner: $owner, name: $name) {
      id
      ref(qualifiedName: $branch) {
        target {
          ... on Commit {
            history(first: 1) {
              nodes {
                oid
              }
            }
          }
        }
      }
    }
  }
`;
function useOidLazyQuery(baseOptions) {
  const options3 = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useLazyQuery(OidDocument, options3);
}

// src/utils/createCommitApi.ts
var import_js_base64 = require("js-base64");
var createCommitApi = ({
  message,
  owner,
  oid,
  name,
  branch
}) => {
  const additions = [];
  const deletions = [];
  let commitMessage = message != null ? message : "chore: Outstatic commit";
  let commitBody = "Automatically created by Outstatic";
  const setMessage = (title, body) => {
    commitMessage = title != null ? title : commitMessage;
    commitBody = body != null ? body : commitBody;
  };
  const replaceFile = (file, contents, encode2 = true) => {
    const encoded = encode2 === true ? (0, import_js_base64.encode)(contents) : contents;
    additions.push({ path: file, contents: encoded });
  };
  const removeFile = (file) => {
    deletions.push({ path: file });
  };
  const createInput = () => ({
    branch: {
      repositoryNameWithOwner: `${owner}/${name}`,
      branchName: branch
    },
    message: {
      headline: commitMessage
    },
    fileChanges: {
      additions,
      deletions
    },
    expectedHeadOid: oid
  });
  return { setMessage, createInput, replaceFile, removeFile };
};

// src/utils/hashFromUrl.ts
var extractors = {
  "github.com": /.+\/([a-f0-9]+)$/
};
var hashFromUrl = (u) => {
  if (u.indexOf("github.com") >= 0) {
    return u.replace(extractors["github.com"], "$1");
  }
  return "";
};

// src/utils/hooks/useOid.tsx
var import_react15 = require("react");
var useOid = () => {
  var _a;
  const { repoSlug, repoBranch, repoOwner } = useOutstatic();
  const { session } = useOstSession();
  const [oidQuery] = useOidLazyQuery({
    variables: {
      owner: repoOwner || ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.login) || "",
      name: repoSlug,
      branch: repoBranch
    },
    fetchPolicy: "no-cache"
  });
  const fetchOid = (0, import_react15.useCallback)(() => __async(void 0, null, function* () {
    var _a2, _b, _c, _d, _e;
    const { data: oidData, error: oidError } = yield oidQuery();
    if (oidError) {
      throw oidError;
    }
    if (((_c = (_b = (_a2 = oidData == null ? void 0 : oidData.repository) == null ? void 0 : _a2.ref) == null ? void 0 : _b.target) == null ? void 0 : _c.__typename) !== "Commit") {
      throw new Error("No valid oid found");
    }
    if (typeof ((_e = (_d = oidData.repository.ref.target.history.nodes) == null ? void 0 : _d[0]) == null ? void 0 : _e.oid) !== "string") {
      throw new Error("Received a non-string oid");
    }
    return oidData.repository.ref.target.history.nodes[0].oid;
  }), [oidQuery]);
  return fetchOid;
};
var useOid_default = useOid;

// src/utils/metadata/stringify.ts
var import_thenby = require("thenby");
var import_json_stable_stringify = __toESM(require("json-stable-stringify"));
var stringifyMetadata = (m) => {
  m.metadata = m.metadata.sort((0, import_thenby.firstBy)("__outstatic.path"));
  const s = (0, import_json_stable_stringify.default)(m, { space: 2 });
  return s;
};

// src/components/DeleteDocumentButton/index.tsx
var import_lucide_react3 = require("lucide-react");
var import_react16 = require("react");
var import_jsx_runtime15 = require("react/jsx-runtime");
var DeleteDocumentButton = ({
  slug,
  disabled = false,
  onComplete = () => {
  },
  collection,
  className
}) => {
  var _a;
  const [showDeleteModal, setShowDeleteModal] = (0, import_react16.useState)(false);
  const [deleting, setDeleting] = (0, import_react16.useState)(false);
  const { session } = useOstSession();
  const [createCommit] = useCreateCommitMutation();
  const { repoOwner, repoSlug, repoBranch, contentPath, monorepoPath } = useOutstatic();
  const fetchOid = useOid_default();
  const { data: metadata } = useDocumentQuery({
    variables: {
      owner: repoOwner || ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.login) || "",
      name: repoSlug,
      filePath: `${repoBranch}:${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/metadata.json`
    },
    fetchPolicy: "network-only"
  });
  const deleteDocument = (slug2) => __async(void 0, null, function* () {
    var _a2, _b, _c, _d, _e;
    setDeleting(true);
    try {
      const oid = yield fetchOid();
      const owner = repoOwner || ((_a2 = session == null ? void 0 : session.user) == null ? void 0 : _a2.login) || "";
      const capi = createCommitApi({
        message: `feat(${collection}): remove ${slug2}`,
        owner,
        oid: oid != null ? oid : "",
        name: repoSlug,
        branch: repoBranch
      });
      capi.removeFile(
        `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}/${slug2}.md`
      );
      if (((_c = (_b = metadata == null ? void 0 : metadata.repository) == null ? void 0 : _b.object) == null ? void 0 : _c.__typename) === "Blob") {
        const m = JSON.parse(
          (_d = metadata.repository.object.text) != null ? _d : "{}"
        );
        m.generated = (/* @__PURE__ */ new Date()).toISOString();
        m.commit = hashFromUrl(metadata.repository.object.commitUrl);
        const newMeta = ((_e = m.metadata) != null ? _e : []).filter((post) => post.slug !== slug2);
        capi.replaceFile(
          `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/metadata.json`,
          stringifyMetadata(__spreadProps(__spreadValues({}, m), { metadata: newMeta }))
        );
      }
      const input = capi.createInput();
      yield createCommit({ variables: { input } });
      setShowDeleteModal(false);
      if (onComplete)
        onComplete();
    } catch (error) {
      console.log(error);
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(import_jsx_runtime15.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
      "button",
      {
        onClick: () => setShowDeleteModal(true),
        type: "button",
        disabled,
        className: `z-10 inline-block text-gray-500 hover:bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5 ${className}`,
        title: "Delete document",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "sr-only", children: "Delete document" }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react3.Trash2, {})
        ]
      }
    ),
    showDeleteModal && /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(Modal_default, { title: "Delete Document", close: () => setShowDeleteModal(false), children: [
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "space-y-6 p-6 text-left", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-base leading-relaxed text-gray-500", children: "Are you sure you want to delete this document?" }),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("p", { className: "text-base leading-relaxed text-gray-500", children: "This action cannot be undone." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex items-center space-x-2 rounded-b border-t p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          "button",
          {
            type: "button",
            className: "flex rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none",
            onClick: () => {
              deleteDocument(slug);
            },
            children: deleting ? /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(import_jsx_runtime15.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
                "svg",
                {
                  className: "mr-3 -ml-1 h-5 w-5 animate-spin text-white",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                      "circle",
                      {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
                      "path",
                      {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      }
                    )
                  ]
                }
              ),
              "Deleting"
            ] }) : "Delete"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          "button",
          {
            type: "button",
            className: "rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium focus:z-10 focus:outline-none focus:ring-4 order-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700",
            onClick: () => setShowDeleteModal(false),
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] });
};
var DeleteDocumentButton_default = DeleteDocumentButton;

// src/utils/editor/utils/addImage.ts
var import_sonner2 = require("sonner");
var addImage = (file) => {
  if (!file.type.includes("image/")) {
    import_sonner2.toast.error("File type not supported.");
    return;
  } else if (file.size / 1024 / 1024 > 20) {
    import_sonner2.toast.error("File size too big (max 20MB).");
    return;
  }
  const blob = URL.createObjectURL(file);
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  reader.onloadend = () => {
    const bytes = reader.result;
    const buffer = Buffer.from(bytes, "binary");
    useFileStore.getState().addFile({
      type: "image",
      blob,
      filename: file.name,
      content: buffer.toString("base64")
    });
  };
  return blob;
};

// src/components/DocumentSettingsImageSelection/index.tsx
var import_react17 = require("react");
var import_jsx_runtime16 = require("react/jsx-runtime");
function resolve(path, obj, separator = ".") {
  var properties = Array.isArray(path) ? path : path.split(separator);
  return [...properties].reduce(
    (prev, curr) => prev == null ? void 0 : prev[curr],
    obj
  );
}
var DocumentSettingsImageSelection = ({
  name,
  description,
  label
}) => {
  const { document: document2, editDocument } = (0, import_react17.useContext)(DocumentContext);
  const [showImage, setShowImage] = (0, import_react17.useState)(false);
  const [showImageOptions, setShowImageOptions] = (0, import_react17.useState)(false);
  const [showLink, setShowLink] = (0, import_react17.useState)(false);
  const [previewLoading, setPreviewLoading] = (0, import_react17.useState)(true);
  const [loadingError, setLoadingError] = (0, import_react17.useState)(false);
  const [image, setImage] = (0, import_react17.useState)("");
  const resolvedImage = resolve(name, document2);
  (0, import_react17.useEffect)(() => {
    const image2 = resolvedImage == null ? void 0 : resolvedImage.replace(
      `/${IMAGES_PATH}`,
      `/${API_IMAGES_PATH}`
    );
    setImage(image2 || "");
    setShowImageOptions(!resolvedImage);
    setShowImage(!!resolvedImage);
  }, [resolvedImage]);
  const addImageFile = (_0) => __async(void 0, [_0], function* ({
    currentTarget
  }) {
    var _a, _b;
    if (((_a = currentTarget.files) == null ? void 0 : _a.length) && ((_b = currentTarget.files) == null ? void 0 : _b[0]) !== null) {
      const file = currentTarget.files[0];
      const image2 = addImage(file);
      editDocument(name, image2);
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
    loadingError && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
      "div",
      {
        className: "p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800",
        role: "alert",
        children: "The image failed to load, try submitting again."
      }
    ),
    showImage && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "mb-1 block text-sm font-medium text-gray-900", children: description }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
        "div",
        {
          className: `w-full relative bg-slate-100 ${previewLoading ? "h-48" : ""}`,
          children: [
            previewLoading && /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
              "div",
              {
                className: `animate-pulse w-full h-48 bg-slate-200 absolute`
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
              "img",
              {
                src: image,
                className: "w-full max-h-48 object-contain",
                onLoad: () => {
                  setShowLink(false);
                  setPreviewLoading(false);
                  setLoadingError(false);
                },
                onError: () => {
                  setPreviewLoading(false);
                  setLoadingError(true);
                  editDocument(name, "");
                  setShowLink(false);
                },
                alt: description
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "w-full flex justify-between mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        "button",
        {
          onClick: () => {
            editDocument(name, "");
            setShowImage(false);
            setShowLink(false);
          },
          className: "rounded-lg border border-red-700 bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none",
          children: "Remove"
        }
      ) })
    ] }),
    showLink && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        Input_default,
        {
          label: `${description} URL`,
          name,
          id: name,
          defaultValue: resolvedImage,
          inputSize: "small",
          helperText: "Remember to save the document after adding the image URL",
          onBlur: (e) => {
            if (e.target.value) {
              setPreviewLoading(true);
              setShowLink(false);
              editDocument(name, e.target.value);
            }
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "w-full flex justify-between mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
        "button",
        {
          onClick: () => {
            setShowLink(false);
            setShowImageOptions(true);
          },
          type: "button",
          className: "rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-blue-300",
          children: "Cancel"
        }
      ) })
    ] }),
    showImageOptions && /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(import_jsx_runtime16.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "mb-1 block text-sm font-medium text-gray-900", children: label != null ? label : "Add an image" }),
      /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "w-full flex justify-between mt-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          "button",
          {
            onClick: () => {
              setShowLink(true);
              setShowImageOptions(false);
              setShowImage(false);
              setLoadingError(false);
            },
            type: "button",
            className: "flex rounded-lg border border-gray-600 bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-600 md:mb-2",
            children: "From link"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          "label",
          {
            htmlFor: `${name}-upload`,
            className: "flex cursor-pointer rounded-lg border border-gray-600 bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-600 md:mb-2",
            children: "From file"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          "input",
          {
            type: "file",
            accept: "image/*",
            id: `${name}-upload`,
            onChange: addImageFile,
            className: "hidden"
          }
        )
      ] })
    ] })
  ] });
};
var DocumentSettingsImageSelection_default = DocumentSettingsImageSelection;

// src/components/TagInput/index.tsx
var import_camelcase = __toESM(require("camelcase"));
var import_react18 = require("react");
var import_react_hook_form3 = require("react-hook-form");
var import_creatable = __toESM(require("react-select/creatable"));
var import_jsx_runtime17 = require("react/jsx-runtime");
var sizes2 = {
  small: {
    label: "mb-1 block text-sm font-medium text-gray-900",
    input: "w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500"
  },
  medium: {
    label: "block mb-2 text-sm font-medium text-gray-900",
    input: "w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm outline-none focus:ring-blue-500 focus:border-blue-500"
  }
};
var TagInput = (_a) => {
  var _b = _a, {
    label,
    helperText,
    id,
    wrapperClass,
    inputSize = "medium",
    suggestions = []
  } = _b, rest = __objRest(_b, [
    "label",
    "helperText",
    "id",
    "wrapperClass",
    "inputSize",
    "suggestions"
  ]);
  var _a2, _b2, _c, _d;
  const {
    control,
    getValues,
    setValue,
    formState: { errors }
  } = (0, import_react_hook_form3.useFormContext)();
  const [options3, setOptions] = (0, import_react18.useState)(suggestions);
  const createOption = (label2) => ({
    label: label2,
    value: (0, import_camelcase.default)(label2)
  });
  const handleCreate = (inputValue) => {
    const newOption = createOption(inputValue);
    setOptions((prev) => [...prev, newOption]);
    const values = getValues(id) || [];
    setValue(id, [...values, newOption]);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: wrapperClass, children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      "label",
      {
        htmlFor: id,
        className: `${sizes2[inputSize].label} first-letter:capitalize`,
        children: label
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
      import_react_hook_form3.Controller,
      {
        name: id,
        control,
        render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(
          import_creatable.default,
          __spreadValues(__spreadProps(__spreadValues({}, field), {
            options: options3,
            isMulti: true,
            className: errors.multiSelect ? "is-invalid" : "",
            styles: {
              control: (baseStyles, state) => __spreadProps(__spreadValues({}, baseStyles), {
                borderColor: state.isFocused ? "focus:ring-blue-500" : "border-gray-300 bg-gray-50",
                borderRadius: "0.375rem",
                backgroundColor: "#f9fafb",
                fontSize: "0.875rem"
              })
            },
            classNames: {
              menu: () => inputSize === "small" ? "text-sm" : "text-base",
              control: () => sizes2[inputSize].input,
              valueContainer: () => "p-2"
            },
            onCreateOption: handleCreate,
            isClearable: false
          }), rest)
        )
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("div", { className: "flex flex-wrap" }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_jsx_runtime17.Fragment, { children: (((_a2 = errors[id]) == null ? void 0 : _a2.message) || helperText) && /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "mt-1 first-letter:capitalize", children: [
      helperText && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("p", { className: "text-xs text-gray-500", children: helperText }),
      ((_b2 = errors[id]) == null ? void 0 : _b2.message) && /* @__PURE__ */ (0, import_jsx_runtime17.jsx)("span", { className: "text-sm text-red-500", children: (_d = (_c = errors[id]) == null ? void 0 : _c.message) == null ? void 0 : _d.toString() })
    ] }) })
  ] });
};
var TagInput_default = TagInput;

// src/components/TextArea/index.tsx
var import_react_hook_form4 = require("react-hook-form");
var import_jsx_runtime18 = require("react/jsx-runtime");
function TextArea(_a) {
  var _b = _a, {
    label,
    placeholder = "",
    helperText,
    id,
    type = "text",
    readOnly = false,
    registerOptions,
    wrapperClass
  } = _b, rest = __objRest(_b, [
    "label",
    "placeholder",
    "helperText",
    "id",
    "type",
    "readOnly",
    "registerOptions",
    "wrapperClass"
  ]);
  var _a2, _b2, _c;
  const {
    register,
    formState: { errors }
  } = (0, import_react_hook_form4.useFormContext)();
  return /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: wrapperClass, children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "label",
      {
        htmlFor: id,
        className: "mb-1 block text-sm font-medium text-gray-900",
        children: label
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime18.jsx)(
      "textarea",
      __spreadProps(__spreadValues(__spreadValues({}, register(id, registerOptions)), rest), {
        name: id,
        id,
        readOnly,
        placeholder,
        "aria-describedby": id,
        className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500"
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime18.jsxs)("div", { className: "mt-1", children: [
      helperText && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("p", { className: "text-xs text-gray-500", children: helperText }),
      ((_a2 = errors[id]) == null ? void 0 : _a2.message) && /* @__PURE__ */ (0, import_jsx_runtime18.jsx)("span", { className: "text-sm text-red-500", children: (_c = (_b2 = errors[id]) == null ? void 0 : _b2.message) == null ? void 0 : _c.toString() })
    ] })
  ] });
}

// src/types/index.ts
var customFieldTypes = ["String", "Text", "Number", "Tags"];
function isArrayCustomField(obj) {
  return obj && obj.dataType === "array" && Array.isArray(obj.values);
}

// src/components/DocumentSettings/index.tsx
var import_lucide_react4 = require("lucide-react");
var import_navigation4 = require("next/navigation");
var import_react19 = require("react");
var import_react_hook_form5 = require("react-hook-form");
var import_transliteration = require("transliteration");
var import_jsx_runtime19 = require("react/jsx-runtime");
var FieldDataMap = {
  String: { component: Input_default, props: { type: "text" } },
  Text: { component: TextArea, props: {} },
  Number: { component: Input_default, props: { type: "number" } },
  Tags: {
    component: TagInput_default,
    props: {
      suggestions: []
    }
  }
};
var DocumentSettings = ({
  saveFunc,
  loading,
  registerOptions,
  showDelete,
  customFields = {}
}) => {
  var _a, _b;
  const {
    register,
    formState: { errors }
  } = (0, import_react_hook_form5.useFormContext)();
  const router = (0, import_navigation4.useRouter)();
  const { document: document2, editDocument, hasChanges, collection } = (0, import_react19.useContext)(DocumentContext);
  const [isOpen, setIsOpen] = (0, import_react19.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "absolute w-full items-center justify-between flex p-4 border-t z-10 bottom-0 bg-white md:hidden", children: [
      /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
        "button",
        {
          onClick: () => setIsOpen(!isOpen),
          className: "ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden",
          children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react4.PanelRightClose, {}) : /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(import_lucide_react4.PanelRight, {})
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "flex flex-end w-full items-center justify-end gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("label", { htmlFor: "status", className: "sr-only", children: "Status" }),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
          "select",
          __spreadProps(__spreadValues({}, register("status", registerOptions)), {
            name: "status",
            id: "status",
            defaultValue: document2.status,
            className: "block cursor-pointer appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("option", { value: "draft", children: "Draft" }),
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("option", { value: "published", children: "Published" })
            ]
          })
        ),
        /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
          "button",
          {
            onClick: saveFunc,
            type: "button",
            disabled: loading || !hasChanges,
            className: "flex rounded-lg border border-gray-600 bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-600",
            children: loading ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
                "svg",
                {
                  className: "mr-3 -ml-1 h-5 w-5 animate-spin text-white",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                      "circle",
                      {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                      "path",
                      {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      }
                    )
                  ]
                }
              ),
              "Saving"
            ] }) : "Save"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
      "aside",
      {
        className: `${isOpen ? "block absolute" : "hidden relative"} md:block w-full border-b border-gray-300 bg-white md:w-64 md:flex-none md:flex-col md:flex-wrap md:items-start md:justify-start md:border-b-0 md:border-l py-6 h-full max-h-[calc(100vh-128px)] md:max-h-[calc(100vh-53px)] scrollbar-hide overflow-scroll`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("div", { className: "relative w-full items-center justify-between mb-4 flex px-4", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
            DateTimePicker_default,
            {
              id: "publishedAt",
              label: "Date",
              date: document2.publishedAt,
              setDate: (publishedAt) => editDocument("publishedAt", publishedAt)
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "hidden md:flex relative w-full items-center justify-between mb-4 px-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
              "label",
              {
                htmlFor: "status",
                className: "block text-sm font-medium text-gray-900",
                children: "Status"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
              "select",
              __spreadProps(__spreadValues({}, register("status", registerOptions)), {
                name: "status",
                id: "status",
                defaultValue: document2.status,
                className: "block cursor-pointer appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("option", { value: "draft", children: "Draft" }),
                  /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("option", { value: "published", children: "Published" })
                ]
              })
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
            "div",
            {
              className: `flex w-full pb-4 px-4 ${showDelete ? "justify-between items-center" : "justify-end"}`,
              children: [
                showDelete && /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                  DeleteDocumentButton_default,
                  {
                    disabled: loading,
                    slug: document2.slug,
                    onComplete: () => {
                      router.push(`/outstatic/${collection}`);
                    },
                    collection,
                    className: "hover:bg-slate-200 max-h-[2.25rem]"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                  "button",
                  {
                    onClick: saveFunc,
                    type: "button",
                    disabled: loading || !hasChanges,
                    className: "hidden md:flex rounded-lg border border-gray-600 bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-600",
                    children: loading ? /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(import_jsx_runtime19.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(
                        "svg",
                        {
                          className: "mr-3 -ml-1 h-5 w-5 animate-spin text-white",
                          xmlns: "http://www.w3.org/2000/svg",
                          fill: "none",
                          viewBox: "0 0 24 24",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                              "circle",
                              {
                                className: "opacity-25",
                                cx: "12",
                                cy: "12",
                                r: "10",
                                stroke: "currentColor",
                                strokeWidth: "4"
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                              "path",
                              {
                                className: "opacity-75",
                                fill: "currentColor",
                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              }
                            )
                          ]
                        }
                      ),
                      "Saving"
                    ] }) : "Save"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)("div", { className: "w-full", children: [
            /* @__PURE__ */ (0, import_jsx_runtime19.jsxs)(Accordion_default, { title: "Author", children: [
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                Input_default,
                {
                  label: "Name",
                  name: "author.name",
                  id: "author.name",
                  defaultValue: (_b = (_a = document2.author) == null ? void 0 : _a.name) != null ? _b : "",
                  inputSize: "small",
                  wrapperClass: "mb-4"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                DocumentSettingsImageSelection_default,
                {
                  label: "Add an avatar",
                  name: "author.picture",
                  description: "Author Avatar"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Accordion_default, { title: "URL Slug", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
              Input_default,
              {
                label: "Write a slug (optional)",
                name: "slug",
                id: "slug",
                defaultValue: document2.slug,
                inputSize: "small",
                registerOptions: {
                  onChange: (e) => {
                    const lastChar = e.target.value.slice(-1);
                    editDocument(
                      "slug",
                      lastChar === " " || lastChar === "-" ? e.target.value : (0, import_transliteration.slugify)(e.target.value, { allowedChars: "a-zA-Z0-9" })
                    );
                  }
                }
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Accordion_default, { title: "Description", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
              TextArea,
              {
                name: "description",
                type: "textarea",
                label: "Write a description (optional)",
                id: "description",
                rows: 5,
                className: "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(Accordion_default, { title: "Cover Image", children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
              DocumentSettingsImageSelection_default,
              {
                name: "coverImage",
                description: "Cover Image"
              }
            ) }),
            customFields && Object.entries(customFields).map(([name, field]) => {
              var _a2;
              const Field = FieldDataMap[field.fieldType];
              if (isArrayCustomField(field)) {
                Field.props.suggestions = field.values;
              }
              if (field.fieldType === "Number" && !field.required) {
                Field.props = __spreadProps(__spreadValues({}, Field.props), {
                  registerOptions: {
                    setValueAs: (value) => isNaN(value) ? void 0 : Number(value)
                  }
                });
              }
              return /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                Accordion_default,
                {
                  title: `${field.title}${field.required ? "*" : ""}`,
                  error: !!((_a2 = errors[name]) == null ? void 0 : _a2.message),
                  children: /* @__PURE__ */ (0, import_jsx_runtime19.jsx)(
                    Field.component,
                    __spreadValues({
                      id: name,
                      label: field.description
                    }, Field.props)
                  )
                },
                name
              );
            })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime19.jsx)("hr", { className: "pb-16" })
        ]
      }
    )
  ] });
};
var DocumentSettings_default = DocumentSettings;

// src/components/DocumentTitleInput/index.tsx
var import_react20 = require("react");
var import_react_hook_form6 = require("react-hook-form");
var import_react_textarea_autosize = __toESM(require("react-textarea-autosize"));
var import_transliteration2 = require("transliteration");
var import_jsx_runtime20 = require("react/jsx-runtime");
function DocumentTitle(_a) {
  var _b = _a, {
    label,
    placeholder = "",
    helperText,
    id,
    readOnly = false,
    wrapperClass
  } = _b, rest = __objRest(_b, [
    "label",
    "placeholder",
    "helperText",
    "id",
    "readOnly",
    "wrapperClass"
  ]);
  var _a2, _b2, _c;
  const {
    register,
    formState: { errors },
    setValue
  } = (0, import_react_hook_form6.useFormContext)();
  const { editor } = (0, import_react20.useContext)(DocumentContext);
  return /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: wrapperClass, children: [
    /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime20.jsx)(
      import_react_textarea_autosize.default,
      __spreadProps(__spreadValues(__spreadValues({}, register(id, {
        onChange: (e) => {
          const segments = new URL(document.location.href).pathname.split(
            "/"
          );
          const last = segments.pop() || segments.pop();
          if (last === "new") {
            setValue(
              "slug",
              (0, import_transliteration2.slugify)(e.target.value, { allowedChars: "a-zA-Z0-9" })
            );
          }
        }
      })), rest), {
        name: id,
        id,
        readOnly,
        placeholder,
        "aria-describedby": id,
        autoFocus: true,
        onKeyDown: (e) => {
          if (e.key.toLowerCase() === "enter") {
            e.preventDefault();
            editor.commands.focus("start");
          }
        }
      })
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime20.jsxs)("div", { className: "mt-1", children: [
      helperText && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("p", { className: "text-xs text-gray-500", children: helperText }),
      ((_a2 = errors[id]) == null ? void 0 : _a2.message) && /* @__PURE__ */ (0, import_jsx_runtime20.jsx)("span", { className: "text-sm text-red-500", children: (_c = (_b2 = errors[id]) == null ? void 0 : _b2.message) == null ? void 0 : _c.toString() })
    ] })
  ] });
}

// src/components/SortableSelect/index.tsx
var import_core = require("@dnd-kit/core");
var import_modifiers = require("@dnd-kit/modifiers");
var import_sortable = require("@dnd-kit/sortable");
var import_utilities = require("@dnd-kit/utilities");
var import_lucide_react5 = require("lucide-react");
var import_react_select = __toESM(require("react-select"));
var import_jsx_runtime21 = require("react/jsx-runtime");
var MultiValue = (props) => {
  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const innerProps = __spreadProps(__spreadValues({}, props.innerProps), { onMouseDown });
  const { attributes, listeners, setNodeRef, transform, transition } = (0, import_sortable.useSortable)({
    id: props.data.id
  });
  if (transform) {
    transform.scaleX = 1;
    transform.scaleY = 1;
  }
  const style = {
    transform: import_utilities.CSS.Transform.toString(transform),
    transition
  };
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", __spreadProps(__spreadValues(__spreadValues({ style, ref: setNodeRef }, attributes), listeners), { children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_react_select.components.MultiValue, __spreadProps(__spreadValues({}, props), { innerProps })) }));
};
var MultiValueLabel = (props) => {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsxs)("div", { className: "flex cursor-pointer items-center pl-1", children: [
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_lucide_react5.GripVertical, { size: 15 }),
    /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_react_select.components.MultiValueLabel, __spreadValues({}, props))
  ] });
};
var Control = (props) => {
  const { setNodeRef } = (0, import_core.useDroppable)({
    id: "droppable"
  });
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)("div", { ref: setNodeRef, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_react_select.components.Control, __spreadValues({}, props)) });
};
var MultiValueContainer = (props) => {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_react_select.components.MultiValueContainer, __spreadValues({}, props));
};
var MultiValueRemove = (props) => {
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    import_react_select.components.MultiValueRemove,
    __spreadProps(__spreadValues({}, props), {
      innerProps: __spreadValues({
        onPointerDown: (e) => e.stopPropagation()
      }, props.innerProps)
    })
  );
};
var SortableSelect = ({
  selected,
  setSelected,
  defaultValues,
  allOptions,
  onChangeList,
  onBlur
}) => {
  const onChange = (selectedOptions) => {
    setSelected([...selectedOptions]);
    onChangeList(selectedOptions);
  };
  const onSortEnd = (event) => {
    const { active, over } = event;
    if (!active || !over)
      return;
    setSelected((items3) => {
      const oldIndex = items3.findIndex((item) => item.id === active.id);
      const newIndex = items3.findIndex((item) => item.id === over.id);
      const newItems = (0, import_sortable.arrayMove)(items3, oldIndex, newIndex);
      onChangeList(newItems);
      return newItems;
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_core.DndContext, { modifiers: [import_modifiers.restrictToParentElement], onDragEnd: onSortEnd, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(import_sortable.SortableContext, { items: selected, strategy: import_sortable.rectSortingStrategy, children: /* @__PURE__ */ (0, import_jsx_runtime21.jsx)(
    import_react_select.default,
    {
      isMulti: true,
      defaultValue: defaultValues,
      options: allOptions,
      value: selected,
      onChange,
      components: {
        // @ts-ignore We're failing to provide a required index prop to SortableElement
        MultiValue,
        MultiValueLabel,
        MultiValueContainer,
        MultiValueRemove,
        Control
      },
      isClearable: false,
      escapeClearsValue: false,
      closeMenuOnSelect: false,
      onBlur,
      autoFocus: true,
      className: "border border-gray-200 rounded-md",
      styles: {
        control: (base) => __spreadProps(__spreadValues({}, base), {
          border: "none",
          boxShadow: "none",
          "&:hover": {
            border: "none"
          }
        })
      }
    }
  ) }) });
};
var SortableSelect_default = SortableSelect;

// src/components/DocumentsTable/index.tsx
var import_change_case = require("change-case");
var import_js_cookie2 = __toESM(require("js-cookie"));
var import_lucide_react6 = require("lucide-react");
var import_link2 = __toESM(require("next/link"));
var import_react21 = require("react");
var import_jsx_runtime22 = require("react/jsx-runtime");
var defaultColumns = [
  { id: "title", label: "Title", value: "title" },
  { id: "status", label: "Status", value: "status" },
  { id: "publishedAt", label: "Published at", value: "publishedAt" }
];
var DocumentsTable = (props) => {
  var _a;
  const allColumns = Object.keys(props.documents[0]).map((column) => ({
    id: column,
    label: (0, import_change_case.sentenceCase)(column),
    value: column
  }));
  const [documents, setDocuments] = (0, import_react21.useState)(props.documents);
  const [columns, setColumns] = (0, import_react21.useState)(
    (_a = JSON.parse(import_js_cookie2.default.get(`ost_${props.collection}_fields`) || "null")) != null ? _a : defaultColumns
  );
  const [showColumnOptions, setShowColumnOptions] = (0, import_react21.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("table", { className: "w-full text-left text-sm text-gray-500", children: [
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("thead", { className: "bg-gray-50 text-xs uppercase text-gray-700 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("tr", { children: [
        columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("th", { scope: "col", className: "px-6 py-3", children: column.label }, column.value)),
        /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          "th",
          {
            scope: "col",
            className: "px-8 py-2 text-right flex justify-end items-center",
            children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("button", { onClick: () => setShowColumnOptions(!showColumnOptions), children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_lucide_react6.Settings, {}) })
          }
        )
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("tbody", { children: documents && documents.map((document2) => /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)(
        "tr",
        {
          className: "border-b bg-white hover:bg-gray-50",
          children: [
            columns.map((column) => {
              return cellSwitch(column.value, document2, props.collection);
            }),
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("td", { className: "pr-6 py-4 text-right", children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
              DeleteDocumentButton_default,
              {
                slug: document2.slug,
                disabled: false,
                onComplete: () => setDocuments(
                  documents.filter((p) => p.slug !== document2.slug)
                ),
                collection: props.collection
              }
            ) })
          ]
        },
        document2.slug
      )) })
    ] }),
    showColumnOptions && /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
      "div",
      {
        className: `absolute -top-12 max-w-full min-w-min capitalize right-0`,
        children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
          SortableSelect_default,
          {
            selected: columns,
            setSelected: setColumns,
            allOptions: allColumns,
            defaultValues: defaultColumns,
            onChangeList: (e) => {
              import_js_cookie2.default.set(`ost_${props.collection}_fields`, JSON.stringify(e));
            },
            onBlur: () => setShowColumnOptions(false)
          }
        )
      }
    )
  ] });
};
var cellSwitch = (columnValue, document2, collection) => {
  const item = document2[columnValue];
  switch (columnValue) {
    case "title":
      return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        "th",
        {
          scope: "row",
          className: "relative whitespace-nowrap px-6 py-4 text-base font-semibold text-gray-900 group",
          children: /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(import_link2.default, { href: `/outstatic/${collection}/${document2.slug}`, children: /* @__PURE__ */ (0, import_jsx_runtime22.jsxs)("div", { className: "group-hover:text-blue-500", children: [
            item,
            /* @__PURE__ */ (0, import_jsx_runtime22.jsx)("div", { className: "absolute top-0 bottom-0 left-0 right-40 cursor-pointer" })
          ] }) })
        },
        "title"
      );
    default:
      return /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
        "td",
        {
          className: "px-6 py-4 text-base font-semibold text-gray-900",
          children: typeof item === "object" && item !== null ? item.map((item2) => /* @__PURE__ */ (0, import_jsx_runtime22.jsx)(
            "span",
            {
              className: "bg-gray-100 text-gray-800 font-medium me-2 px-2.5 py-0.5 rounded",
              children: item2.label
            },
            item2.label
          )) : item
        },
        columnValue
      );
  }
};
var DocumentsTable_default = DocumentsTable;

// src/components/Alert/index.tsx
var import_jsx_runtime23 = require("react/jsx-runtime");
var alertStyles = {
  success: "text-green-700 bg-green-100",
  info: "text-blue-700 bg-blue-100",
  error: "text-red-700 bg-red-100",
  warning: "text-yellow-700 bg-yellow-100"
};
var Alert = ({ type, children }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime23.jsx)(
    "div",
    {
      className: `inline-block p-4 mb-4 text-sm rounded-lg ${alertStyles[type]}`,
      role: "alert",
      children
    }
  );
};
var Alert_default = Alert;

// src/utils/hooks/useFileQuery.tsx
var useFileQuery = ({ file, skip = false }) => {
  var _a;
  const { repoOwner, repoSlug, repoBranch, contentPath, monorepoPath } = useOutstatic();
  const { session } = useOstSession();
  const data = useDocumentQuery({
    variables: {
      owner: repoOwner || ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.login) || "",
      name: repoSlug,
      filePath: `${repoBranch}:${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${file}`
    },
    fetchPolicy: "network-only",
    skip
  });
  return data;
};
var useFileQuery_default = useFileQuery;

// src/client/pages/add-custom-field/index.tsx
var import_yup = require("@hookform/resolvers/yup");
var import_camelcase2 = __toESM(require("camelcase"));
var import_react22 = require("react");
var import_react_hook_form7 = require("react-hook-form");
var yup = __toESM(require("yup"));
var import_jsx_runtime24 = require("react/jsx-runtime");
var fieldDataMap = {
  Text: "string",
  String: "string",
  Number: "number",
  Tags: "array"
};
function AddCustomField({ collection }) {
  const {
    contentPath,
    monorepoPath,
    session,
    repoSlug,
    repoBranch,
    repoOwner,
    setHasChanges
  } = useOutstatic();
  const [createCommit] = useCreateCommitMutation();
  const fetchOid = useOid_default();
  const [customFields, setCustomFields] = (0, import_react22.useState)({});
  const yupSchema = yup.object().shape({
    title: yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field.").required("Custom field name is required."),
    fieldType: yup.string().oneOf([...customFieldTypes]).required(),
    description: yup.string(),
    required: yup.boolean().required()
  });
  const [adding, setAdding] = (0, import_react22.useState)(false);
  const [error, setError] = (0, import_react22.useState)("");
  const methods = (0, import_react_hook_form7.useForm)({
    mode: "onChange",
    resolver: (0, import_yup.yupResolver)(yupSchema)
  });
  const [showAddModal, setShowAddModal] = (0, import_react22.useState)(false);
  const [showDeleteModal, setShowDeleteModal] = (0, import_react22.useState)(false);
  const [deleting, setDeleting] = (0, import_react22.useState)(false);
  const { data: schemaQueryData, loading } = useFileQuery_default({
    file: `${collection}/schema.json`
  });
  const [selectedField, setSelectedField] = (0, import_react22.useState)("");
  const [fieldName, setFieldName] = (0, import_react22.useState)("");
  const capiHelper = (_0) => __async(this, [_0], function* ({
    customFields: customFields2,
    deleteField: deleteField2 = false
  }) {
    var _a;
    const oid = yield fetchOid();
    const customFieldsJSON = JSON.stringify(
      {
        title: collection,
        type: "object",
        properties: __spreadValues({}, customFields2)
      },
      null,
      2
    );
    const capi = createCommitApi({
      message: `feat(${collection}): ${deleteField2 ? "delete" : "add"} ${fieldName} field`,
      owner: repoOwner || ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.login) || "",
      oid: oid != null ? oid : "",
      name: repoSlug,
      branch: repoBranch
    });
    capi.replaceFile(
      `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}/schema.json`,
      customFieldsJSON + "\n"
    );
    const input = capi.createInput();
    return yield createCommit({ variables: { input } });
  });
  const onSubmit = (data) => __async(this, null, function* () {
    setAdding(true);
    const _a = data, { title, fieldType } = _a, rest = __objRest(_a, ["title", "fieldType"]);
    const fieldName2 = (0, import_camelcase2.default)(title);
    if (!selectedField && customFields[fieldName2]) {
      methods.setError("title", {
        type: "manual",
        message: "Field name is already taken."
      });
      setAdding(false);
      return;
    }
    try {
      customFields[fieldName2] = __spreadProps(__spreadValues({}, rest), {
        fieldType,
        dataType: fieldDataMap[fieldType],
        title: data.title
      });
      if (fieldDataMap[fieldType] === "array") {
        customFields[fieldName2] = __spreadProps(__spreadValues({}, customFields[fieldName2]), {
          // @ts-ignore
          values: (data == null ? void 0 : data.values) || []
        });
      }
      const created = yield capiHelper({ customFields });
      if (created) {
        setCustomFields(__spreadValues({}, customFields));
      }
    } catch (error2) {
      setError("add");
      console.log({ error: error2 });
    }
    setHasChanges(false);
    setSelectedField("");
    setShowAddModal(false);
    setAdding(false);
  });
  const deleteField = (name) => __async(this, null, function* () {
    setDeleting(true);
    try {
      let newCustomFields = __spreadValues({}, customFields);
      delete newCustomFields[name];
      const deleted = yield capiHelper({
        customFields: newCustomFields,
        deleteField: true
      });
      if (deleted) {
        setCustomFields(newCustomFields);
      }
    } catch (error2) {
      setError("delete");
      console.log({ error: error2 });
    }
    setSelectedField("");
    setShowDeleteModal(false);
    setDeleting(false);
    setHasChanges(false);
  });
  (0, import_react22.useEffect)(() => {
    var _a;
    const documentQueryObject = (_a = schemaQueryData == null ? void 0 : schemaQueryData.repository) == null ? void 0 : _a.object;
    if ((documentQueryObject == null ? void 0 : documentQueryObject.__typename) === "Blob") {
      const schema = JSON.parse((documentQueryObject == null ? void 0 : documentQueryObject.text) || "{}");
      setCustomFields(schema.properties);
    }
  }, [schemaQueryData]);
  (0, import_react22.useEffect)(() => {
    const subscription = methods.watch(() => setHasChanges(true));
    return () => subscription.unsubscribe();
  }, [methods]);
  return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(AdminLayout, { title: "Add Custom Fields", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_react_hook_form7.FormProvider, __spreadProps(__spreadValues({}, methods), { children: [
    /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "mb-8 flex h-12 items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("h1", { className: "mr-12 text-2xl", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "capitalize", children: collection }),
        " Fields"
      ] }),
      Object.keys(customFields).length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        "button",
        {
          type: "button",
          onClick: () => {
            methods.reset();
            setShowAddModal(true);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 border-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700 no-underline", children: "Add Custom Field" })
        }
      ) : null
    ] }),
    !loading ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_jsx_runtime24.Fragment, { children: Object.keys(customFields).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "max-w-2xl", children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "absolute bottom-0 left-0 md:left-64 right-0 md:top-36", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
        "svg",
        {
          fill: "none",
          className: "h-full w-full",
          xmlns: "http://www.w3.org/2000/svg",
          children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
            "path",
            {
              d: "m1555.43 194.147c-100.14 46.518-204.72 78.763-313.64 96.841-78.16 12.972-282.29 0-291.79-143.988-1.58-23.948 1-89.4705 67-127 58-32.9805 115.15-13.36095 142.5 5.5 27.35 18.861 45.02 44.5 54 73 16.37 51.951-9.22 115.124-30.65 161.874-57.09 124.562-177.31 219.357-311.976 246.789-142.617 29.052-292.036-9.369-430.683-41.444-100.166-23.173-196.003-36.724-298.229-15.203-48.046 10.115-94.9295 24.91-139.962 44.112",
              className: "stroke-slate-900",
              strokeWidth: "2"
            }
          )
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "mb-20 max-w-2xl p-8 px-4 md:p-8 text-black bg-white rounded-lg border border-gray-200 shadow-md prose prose-base", children: [
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { children: "Here you can add Custom Fields to your collections." }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { children: "Create your first Custom Field by clicking the button below." }),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
          "div",
          {
            className: "inline-block rounded-lg border px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 border-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700 no-underline hover:cursor-pointer",
            onClick: () => setShowAddModal(true),
            children: "Add Custom Field"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { children: [
          "To learn more about how Custom Fields work checkout",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
            "a",
            {
              href: "https://outstatic.com/docs/custom-fields",
              target: "_blank",
              rel: "noreferrer",
              children: "the docs."
            }
          ),
          "."
        ] })
      ] }) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(import_jsx_runtime24.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "max-w-5xl w-full grid grid-cols-3 gap-6", children: customFields && Object.entries(customFields).map(([name, field]) => {
      return /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
        "div",
        {
          className: "relative flex p-6 justify-between items-center max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-slate-100",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
              "button",
              {
                type: "button",
                onClick: () => {
                  methods.reset();
                  setSelectedField(name);
                  setShowAddModal(true);
                },
                className: "text-left",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("span", { className: "block text-xl cursor-pointer font-bold tracking-tight text-gray-900 capitalize hover:text-blue-500 mb-2", children: [
                    field.title,
                    /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "absolute top-0 bottom-0 left-0 right-16" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded", children: field.fieldType }),
                  field.required ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded", children: "required" }) : null
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
              "button",
              {
                className: "z-10 inline-block text-gray-500 hover:bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5",
                type: "button",
                onClick: () => {
                  setShowDeleteModal(true);
                  setSelectedField(name);
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "sr-only", children: "Delete content" }),
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      viewBox: "0 0 24 24",
                      width: "24",
                      height: "24",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("path", { fill: "none", d: "M0 0h24v24H0z" }),
                        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("path", { d: "M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" })
                      ]
                    }
                  )
                ]
              }
            )
          ]
        },
        name
      );
    }) }) }) }) : null,
    error ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Alert_default, { type: "error", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "font-medium", children: "Oops!" }),
      " We are unable to",
      " ",
      error,
      " your custom field."
    ] }) }) }) : null,
    showAddModal && /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
      Modal_default,
      {
        title: selectedField ? `Edit ${customFields[selectedField].title}` : `Add Custom Field to ${collection}`,
        close: () => {
          setHasChanges(false);
          setSelectedField("");
          setShowAddModal(false);
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("form", { onSubmit: methods.handleSubmit(onSubmit), children: [
          !!selectedField ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "pt-6 pl-6", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(Alert_default, { type: "info", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "font-medium", children: "Field name" }),
            " and",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "font-medium", children: "Field type" }),
            " editing is disabled to avoid data conflicts."
          ] }) }) }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
            "div",
            {
              className: `flex p-6 text-left gap-4 ${!!selectedField ? "pt-0 opacity-50 cursor-not-allowed pointer-events-none hidden" : ""}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                  Input_default,
                  {
                    label: "Field name",
                    id: "title",
                    inputSize: "medium",
                    className: "w-full max-w-sm md:w-80",
                    placeholder: "Ex: Category",
                    type: "text",
                    helperText: "The name of the field",
                    readOnly: !!selectedField,
                    autoFocus: !selectedField,
                    defaultValue: selectedField ? customFields[selectedField].title : "",
                    registerOptions: {
                      onChange: (e) => {
                        setFieldName((0, import_camelcase2.default)(e.target.value));
                      }
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "mb-5", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                    "label",
                    {
                      htmlFor: "status",
                      className: "block mb-2 text-sm font-medium text-gray-900",
                      children: "Field type"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                    "select",
                    __spreadProps(__spreadValues({}, methods.register("fieldType")), {
                      name: "fieldType",
                      id: "fieldType",
                      className: "block cursor-pointer appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500",
                      defaultValue: selectedField ? customFields[selectedField].fieldType : "String",
                      children: customFieldTypes.map((type) => {
                        return /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                          "option",
                          {
                            value: type,
                            disabled: !!selectedField,
                            children: type
                          },
                          type
                        );
                      })
                    })
                  )
                ] })
              ]
            },
            selectedField
          ),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex px-6 text-left gap-4 mb-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              Input_default,
              {
                label: "description",
                id: "description",
                inputSize: "medium",
                className: "w-full max-w-sm md:w-80",
                placeholder: "Ex: Add a category",
                type: "text",
                helperText: "This will be the label of the field",
                defaultValue: selectedField ? customFields[selectedField].description : ""
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("fieldset", { children: /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex mt-7", children: [
              /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "flex items-center h-5", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                "input",
                __spreadProps(__spreadValues({}, methods.register("required")), {
                  id: "required",
                  type: "checkbox",
                  className: "cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2",
                  defaultChecked: selectedField ? customFields[selectedField].required : false
                })
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "ml-2 text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                  "label",
                  {
                    htmlFor: "required",
                    className: "cursor-pointer text-sm font-medium text-gray-900",
                    children: "Required field"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
                  "p",
                  {
                    id: "helper-checkbox-text",
                    className: "text-xs font-normal text-gray-500",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("span", { className: "capitalize", children: collection }),
                      " ",
                      "documents will only be saved if this field is not empty"
                    ]
                  }
                )
              ] })
            ] }) })
          ] }),
          selectedField && customFields[selectedField].fieldType === "Tags" && customFields[selectedField].dataType === "array" ? /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("div", { className: "flex px-6 text-left gap-4 mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
            TagInput_default,
            {
              label: "Your tags",
              id: "values",
              helperText: "Deleting tags will remove them from suggestions, not from existing documents.",
              defaultValue: customFields[selectedField].values || [],
              noOptionsMessage: () => null,
              isClearable: false,
              isSearchable: false,
              components: {
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null
              }
            }
          ) }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "space-x-2 rounded-b border-t p-6 text-sm text-gray-700", children: [
            "This field will be accessible on the frontend as:",
            "  ",
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("code", { className: "bg-gray-200 font-semibold", children: selectedField ? selectedField : fieldName })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex items-center space-x-2 rounded-b border-t p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              "button",
              {
                type: "submit",
                disabled: adding,
                className: "flex rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none",
                children: adding ? /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
                    "svg",
                    {
                      className: "mr-3 -ml-1 h-5 w-5 animate-spin text-white",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                          "circle",
                          {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                          "path",
                          {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          }
                        )
                      ]
                    }
                  ),
                  selectedField ? "Editing" : "Adding"
                ] }) : selectedField ? "Edit" : "Add"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              "button",
              {
                type: "button",
                className: "rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium focus:z-10 focus:outline-none focus:ring-4 order-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700",
                onClick: () => {
                  setHasChanges(false);
                  setSelectedField("");
                  setShowAddModal(false);
                },
                children: "Cancel"
              }
            )
          ] })
        ] })
      }
    ),
    showDeleteModal && /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
      Modal_default,
      {
        title: `Delete ${customFields[selectedField].title} Field`,
        close: () => {
          setShowDeleteModal(false);
          setSelectedField("");
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "space-y-6 p-6 text-left", children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("p", { className: "text-base leading-relaxed text-gray-500", children: [
              "Are you sure you want to delete the",
              " ",
              customFields[selectedField].title,
              " field?"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)("p", { className: "text-base leading-relaxed text-gray-500", children: "This action cannot be undone." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)("div", { className: "flex items-center space-x-2 rounded-b border-t p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              "button",
              {
                type: "button",
                disabled: deleting,
                className: "flex rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none",
                onClick: () => {
                  setDeleting(true);
                  deleteField(selectedField);
                },
                children: deleting ? /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(import_jsx_runtime24.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime24.jsxs)(
                    "svg",
                    {
                      className: "mr-3 -ml-1 h-5 w-5 animate-spin text-white",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                          "circle",
                          {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
                          "path",
                          {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          }
                        )
                      ]
                    }
                  ),
                  "Deleting"
                ] }) : "Delete"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime24.jsx)(
              "button",
              {
                type: "button",
                className: "rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium focus:z-10 focus:outline-none focus:ring-4 order-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700",
                onClick: () => {
                  setShowDeleteModal(false);
                  setSelectedField("");
                },
                children: "Cancel"
              }
            )
          ] })
        ]
      }
    )
  ] })) });
}

// src/client/pages/collections.tsx
var import_link3 = __toESM(require("next/link"));
var import_react23 = require("react");
var import_jsx_runtime25 = require("react/jsx-runtime");
function Collections() {
  var _a;
  const {
    repoOwner,
    collections,
    session,
    repoSlug,
    repoBranch,
    contentPath,
    monorepoPath,
    removePage
  } = useOutstatic();
  const [showDeleteModal, setShowDeleteModal] = (0, import_react23.useState)(false);
  const [selectedCollection, setSelectedCollection] = (0, import_react23.useState)("");
  const [deleting, setDeleting] = (0, import_react23.useState)(false);
  const [createCommit] = useCreateCommitMutation();
  const fetchOid = useOid_default();
  const [loadMetadata] = useDocumentLazyQuery({
    variables: {
      owner: repoOwner || ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.login) || "",
      name: repoSlug,
      filePath: `${repoBranch}:${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/metadata.json`
    },
    fetchPolicy: "network-only"
  });
  const deleteCollection = (collection) => __async(this, null, function* () {
    loadMetadata().then((_0) => __async(this, [_0], function* ({ data: metadata }) {
      var _a2, _b, _c, _d, _e;
      try {
        const oid = yield fetchOid();
        const owner = repoOwner || ((_a2 = session == null ? void 0 : session.user) == null ? void 0 : _a2.login) || "";
        const capi = createCommitApi({
          message: `feat(${collection}): remove ${collection}`,
          owner,
          oid: oid != null ? oid : "",
          name: repoSlug,
          branch: repoBranch
        });
        capi.removeFile(
          `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}`
        );
        if (((_c = (_b = metadata == null ? void 0 : metadata.repository) == null ? void 0 : _b.object) == null ? void 0 : _c.__typename) === "Blob") {
          const m = JSON.parse(
            (_d = metadata.repository.object.text) != null ? _d : "{}"
          );
          m.generated = (/* @__PURE__ */ new Date()).toISOString();
          m.commit = hashFromUrl(metadata.repository.object.commitUrl);
          const newMeta = ((_e = m.metadata) != null ? _e : []).filter(
            (post) => post.collection !== collection
          );
          capi.replaceFile(
            `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/metadata.json`,
            stringifyMetadata(__spreadProps(__spreadValues({}, m), { metadata: newMeta }))
          );
        }
        const input = capi.createInput();
        yield createCommit({ variables: { input } });
        setShowDeleteModal(false);
        setDeleting(false);
        removePage(collection);
      } catch (error) {
      }
    }));
  });
  return /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(AdminLayout, { title: "Collections", children: [
    collections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "max-w-2xl", children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "absolute bottom-0 left-0 md:left-64 right-0 md:top-36", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
        "svg",
        {
          fill: "none",
          className: "h-full w-full",
          xmlns: "http://www.w3.org/2000/svg",
          children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
            "path",
            {
              d: "m1555.43 194.147c-100.14 46.518-204.72 78.763-313.64 96.841-78.16 12.972-282.29 0-291.79-143.988-1.58-23.948 1-89.4705 67-127 58-32.9805 115.15-13.36095 142.5 5.5 27.35 18.861 45.02 44.5 54 73 16.37 51.951-9.22 115.124-30.65 161.874-57.09 124.562-177.31 219.357-311.976 246.789-142.617 29.052-292.036-9.369-430.683-41.444-100.166-23.173-196.003-36.724-298.229-15.203-48.046 10.115-94.9295 24.91-139.962 44.112",
              className: "stroke-slate-900",
              strokeWidth: "2"
            }
          )
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "relative", children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "mb-8 flex h-12 items-center", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("h1", { className: "mr-12 text-2xl", children: "Welcome to Outstatic!" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "mb-20 max-w-2xl p-8 px-4 md:p-8 text-black bg-white rounded-lg border border-gray-200 shadow-md prose prose-base", children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "To get started you will need to create a new Collection. Collections are the main building block of your Outstatic website." }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { children: "Create your first Collection by clicking the button below." }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_link3.default, { href: "/outstatic/collections/new", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "inline-block rounded-lg border px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 border-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700 no-underline", children: "New Collection" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("p", { children: [
            "To learn more about how Collections work",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              "a",
              {
                href: "https://outstatic.com/docs/introduction#what-are-collections",
                target: "_blank",
                rel: "noreferrer",
                children: "click here"
              }
            ),
            "."
          ] })
        ] })
      ] })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(import_jsx_runtime25.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "mb-8 flex h-12 items-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("h1", { className: "mr-12 text-2xl", children: "Collections" }),
        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(import_link3.default, { href: "/outstatic/collections/new", children: /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 border-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700 no-underline", children: "New Collection" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("div", { className: "max-w-5xl w-full grid md:grid-cols-3 gap-6", children: collections.map((collection) => /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
        "div",
        {
          className: "relative flex p-6 justify-between items-center max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-slate-100",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              import_link3.default,
              {
                href: `/outstatic/${collection}`,
                className: "focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg",
                children: /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("h5", { className: "text-2xl cursor-pointer font-bold tracking-tight text-gray-900 capitalize hover:text-blue-500", children: [
                  collection,
                  /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "absolute top-0 bottom-0 left-0 right-16" })
                ] })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "z-10 flex gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
                import_link3.default,
                {
                  href: `/outstatic/collections/${collection}`,
                  className: "inline-block text-gray-500 hover:bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "sr-only", children: "Edit collection" }),
                    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        width: "24",
                        height: "24",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("path", { fill: "none", d: "M0 0h24v24H0z" }),
                          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("path", { d: "M15.7279 9.57629L14.3137 8.16207L5 17.4758V18.89H6.41421L15.7279 9.57629ZM17.1421 8.16207L18.5563 6.74786L17.1421 5.33365L15.7279 6.74786L17.1421 8.16207ZM7.24264 20.89H3V16.6474L16.435 3.21233C16.8256 2.8218 17.4587 2.8218 17.8492 3.21233L20.6777 6.04075C21.0682 6.43128 21.0682 7.06444 20.6777 7.45497L7.24264 20.89Z" })
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
                "button",
                {
                  className: "z-10 inline-block text-gray-500 hover:bg-white focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm p-1.5",
                  type: "button",
                  onClick: () => {
                    setShowDeleteModal(true);
                    setSelectedCollection(collection);
                  },
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("span", { className: "sr-only", children: "Delete content" }),
                    /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        viewBox: "0 0 24 24",
                        width: "24",
                        height: "24",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("path", { fill: "none", d: "M0 0h24v24H0z" }),
                          /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("path", { d: "M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" })
                        ]
                      }
                    )
                  ]
                }
              )
            ] })
          ]
        },
        collection
      )) })
    ] }),
    showDeleteModal && /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
      Modal_default,
      {
        title: "Delete Collection",
        close: () => {
          setShowDeleteModal(false);
          setSelectedCollection("");
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "space-y-6 p-6 text-left", children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { className: "text-base leading-relaxed text-gray-500", children: "Are you sure you want to delete this collection?" }),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)("p", { className: "text-base leading-relaxed text-gray-500", children: "This action cannot be undone." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)("div", { className: "flex items-center space-x-2 rounded-b border-t p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              "button",
              {
                type: "button",
                className: "flex rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none",
                onClick: () => {
                  setDeleting(true);
                  deleteCollection(selectedCollection);
                },
                children: deleting ? /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(import_jsx_runtime25.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime25.jsxs)(
                    "svg",
                    {
                      className: "mr-3 -ml-1 h-5 w-5 animate-spin text-white",
                      xmlns: "http://www.w3.org/2000/svg",
                      fill: "none",
                      viewBox: "0 0 24 24",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
                          "circle",
                          {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
                          "path",
                          {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          }
                        )
                      ]
                    }
                  ),
                  "Deleting"
                ] }) : "Delete"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime25.jsx)(
              "button",
              {
                type: "button",
                className: "rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium focus:z-10 focus:outline-none focus:ring-4 order-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700",
                onClick: () => {
                  setShowDeleteModal(false);
                  setSelectedCollection("");
                },
                children: "Cancel"
              }
            )
          ] })
        ]
      }
    )
  ] });
}

// src/utils/deepReplace.ts
var deepReplace = (obj, key, value) => {
  const dates = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (!isNaN(new Date(v).getMonth())) {
      dates[k] = k === key ? value : v;
    }
  });
  const clone = JSON.parse(JSON.stringify(obj));
  const keys = key.split(".");
  const lastKey = keys.pop();
  const lastObj = keys.reduce((clone2, key2) => clone2[key2], clone);
  try {
    if (lastObj[lastKey] !== void 0) {
      lastObj[lastKey] = value;
    }
  } catch (e) {
    console.log(`Key ${key} not found`);
  }
  return __spreadValues(__spreadValues({}, clone), dates);
};

// src/utils/getLocalDate.ts
var getLocalDate = () => {
  const offDate = (/* @__PURE__ */ new Date()).valueOf() - (/* @__PURE__ */ new Date()).getTimezoneOffset() * 6e3;
  return new Date(offDate);
};

// src/utils/parseContent.ts
var parseContent = (content) => {
  let regex = new RegExp(
    `(\\!\\[[^\\]]*\\]\\()/${IMAGES_PATH.replace(/\//g, "\\/")}([^)]+)`,
    "g"
  );
  let result = content.replace(regex, `$1/${API_IMAGES_PATH}$2`);
  return result;
};

// src/utils/hooks/useDocumentUpdateEffect.tsx
var import_gray_matter = __toESM(require("gray-matter"));
var import_react24 = require("react");
var useDocumentUpdateEffect = ({
  collection,
  methods,
  slug,
  editor,
  session,
  setHasChanges,
  setShowDelete
}) => {
  const { data: documentQueryData } = useFileQuery_default({
    file: `${collection}/${slug}.md`,
    skip: slug === "new" || !slug
  });
  (0, import_react24.useEffect)(() => {
    var _a, _b, _c;
    const documentQueryObject = (_a = documentQueryData == null ? void 0 : documentQueryData.repository) == null ? void 0 : _a.object;
    if ((documentQueryObject == null ? void 0 : documentQueryObject.__typename) === "Blob") {
      let mdContent = documentQueryObject.text;
      const { data, content } = (0, import_gray_matter.default)(mdContent);
      const parsedContent = parseContent(content);
      const newDate = data.publishedAt ? new Date(data.publishedAt) : getLocalDate();
      const document2 = __spreadProps(__spreadValues({}, data), {
        publishedAt: newDate,
        content: parsedContent,
        slug
      });
      methods.reset(document2);
      editor.commands.setContent(parsedContent);
      editor.commands.focus("start");
      setShowDelete(slug !== "new");
    } else {
      if (slug) {
        const formData = methods.getValues();
        methods.reset(__spreadProps(__spreadValues({}, formData), {
          author: {
            name: (_b = session == null ? void 0 : session.user.name) != null ? _b : "",
            picture: (_c = session == null ? void 0 : session.user.image) != null ? _c : ""
          },
          coverImage: "",
          publishedAt: slug === "new" ? getLocalDate() : formData.publishedAt
        }));
      }
    }
    const subscription = methods.watch(() => setHasChanges(true));
    return () => subscription.unsubscribe();
  }, [documentQueryData, methods, slug, editor, session]);
};

// src/utils/assertUnreachable.ts
function assertUnreachable(_x) {
  throw new Error(
    `Reached a code that should be unreachable. This can happen, when a TS type is incorrectly defined.`
  );
}

// src/utils/mergeMdMeta.ts
var import_dompurify = __toESM(require("dompurify"));

// src/utils/replaceImagePath.ts
function replaceImagePath(markdownContent) {
  const regex = new RegExp(
    `!\\[([^\\]]*?)\\]\\((/${API_IMAGES_PATH})([^\\)]+?)\\)`,
    "g"
  );
  let updatedMarkdown = markdownContent.replace(
    regex,
    (match, altText, apiPath, filename) => `![${altText}](/${IMAGES_PATH}${filename})`
  );
  return updatedMarkdown;
}
var replaceImagePath_default = replaceImagePath;

// src/utils/mergeMdMeta.ts
var mergeMdMeta = (data) => {
  const meta = Object.entries(
    ((_a) => {
      var _b = _a, { content, publishedAt } = _b, meta2 = __objRest(_b, ["content", "publishedAt"]);
      return meta2;
    })(data)
  );
  if (data.publishedAt) {
    meta.push(["publishedAt", data.publishedAt.toISOString()]);
  }
  let merged = "---\n";
  Object.entries(meta).forEach(([_, value]) => {
    if (Array.isArray(value[1])) {
      merged += `${value[0]}: ${JSON.stringify(value[1])}
`;
    } else if (value[1] instanceof Object) {
      merged += `${value[0]}:
`;
      Object.entries(value[1]).forEach(([key, value2]) => {
        merged += `  ${key}: '${import_dompurify.default.sanitize(value2).replaceAll(
          "'",
          "''"
        )}'
`;
      });
    } else {
      merged += `${value[0]}: '${import_dompurify.default.sanitize(value[1]).replaceAll(
        "'",
        "''"
      )}'
`;
    }
  });
  merged += "---\n\n";
  const newContent = replaceImagePath_default(data.content);
  merged += newContent;
  return merged;
};

// src/utils/hooks/useSubmitDocument.tsx
var import_gray_matter2 = __toESM(require("gray-matter"));
var import_imurmurhash = __toESM(require("imurmurhash"));
var import_react25 = require("react");
function useSubmitDocument({
  session,
  slug,
  setSlug,
  setShowDelete,
  setLoading,
  files,
  methods,
  collection,
  customFields,
  setCustomFields,
  setHasChanges,
  editor
}) {
  const [createCommit] = useCreateCommitMutation();
  const { repoOwner, repoSlug, repoBranch, contentPath, monorepoPath } = useOutstatic();
  const fetchOid = useOid_default();
  const { data: metadata } = useFileQuery_default({
    file: `metadata.json`
  });
  const onSubmit = (0, import_react25.useCallback)(
    (data) => __async(this, null, function* () {
      var _a, _b, _c, _d, _e;
      setLoading(true);
      try {
        const document2 = methods.getValues();
        const mdContent = editor.storage.markdown.getMarkdown();
        let content = mergeMdMeta(__spreadProps(__spreadValues({}, data), { content: mdContent }));
        const oid = yield fetchOid();
        const owner = repoOwner || ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.login) || "";
        const newSlug = document2.slug;
        const oldSlug = slug !== newSlug && slug !== "new" ? slug : void 0;
        const capi = createCommitApi({
          message: oldSlug ? `chore: Updates ${newSlug} formerly ${oldSlug}` : `chore: Updates/Creates ${newSlug}`,
          owner,
          oid: oid != null ? oid : "",
          name: repoSlug,
          branch: repoBranch
        });
        if (oldSlug) {
          capi.removeFile(
            `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}/${oldSlug}.md`
          );
        }
        if (files.length > 0) {
          files.forEach(({ filename, blob, type, content: fileContents }) => {
            if (blob && content.search(blob) !== -1) {
              const randString = window.btoa(Math.random().toString()).substring(10, 6);
              const newFilename = filename.toLowerCase().replace(/[^a-zA-Z0-9-_\.]/g, "-").replace(/(\.[^\.]*)?$/, `-${randString}$1`);
              const filePath = (() => {
                switch (type) {
                  case "image":
                    return IMAGES_PATH;
                  default:
                    assertUnreachable(type);
                }
              })();
              capi.replaceFile(
                `${monorepoPath ? monorepoPath + "/" : ""}public/${filePath}${newFilename}`,
                fileContents,
                false
              );
              content = content.replace(blob, `/${filePath}${newFilename}`);
            }
          });
        }
        const { data: matterData } = (0, import_gray_matter2.default)(content);
        capi.replaceFile(
          `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}/${newSlug}.md`,
          content
        );
        let hasNewTag = false;
        Object.entries(customFields).forEach(([key, field]) => {
          const customField = customFields[key];
          let dataKey = data[key];
          if (isArrayCustomField(field) && isArrayCustomField(customField)) {
            if (!Array.isArray(dataKey)) {
              matterData[key] = [];
              return;
            }
            dataKey.forEach((selectedTag) => {
              const exists = field.values.some(
                (savedTag) => savedTag.value === selectedTag.value
              );
              if (!exists) {
                customField.values.push({
                  value: selectedTag.value,
                  label: selectedTag.label
                });
                customFields[key] = customField;
                setCustomFields(__spreadValues({}, customFields));
                hasNewTag = true;
              }
            });
          }
        });
        if (hasNewTag) {
          const customFieldsJSON = JSON.stringify(
            {
              title: collection,
              type: "object",
              properties: __spreadValues({}, customFields)
            },
            null,
            2
          );
          capi.replaceFile(
            `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}/schema.json`,
            customFieldsJSON + "\n"
          );
        }
        if (((_c = (_b = metadata == null ? void 0 : metadata.repository) == null ? void 0 : _b.object) == null ? void 0 : _c.__typename) === "Blob") {
          const m = JSON.parse(
            (_d = metadata.repository.object.text) != null ? _d : "{}"
          );
          m.generated = (/* @__PURE__ */ new Date()).toISOString();
          m.commit = hashFromUrl(metadata.repository.object.commitUrl);
          const newMeta = ((_e = m.metadata) != null ? _e : []).filter(
            (c) => !(c.collection === collection && (c.slug === oldSlug || c.slug === newSlug))
          );
          const state = (0, import_imurmurhash.default)(content);
          newMeta.push(__spreadProps(__spreadValues({}, matterData), {
            title: matterData.title,
            publishedAt: matterData.publishedAt,
            status: matterData.status,
            slug: newSlug,
            collection,
            __outstatic: {
              hash: `${state.result()}`,
              commit: m.commit,
              path: `${contentPath}/${collection}/${newSlug}.md`
            }
          }));
          capi.replaceFile(
            `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/metadata.json`,
            stringifyMetadata(__spreadProps(__spreadValues({}, m), { metadata: newMeta }))
          );
        }
        const input = capi.createInput();
        yield createCommit({
          variables: {
            input
          }
        });
        setLoading(false);
        setHasChanges(false);
        setSlug(newSlug);
        setShowDelete(true);
      } catch (error) {
        setLoading(false);
        console.log({ error });
      }
    }),
    [
      repoOwner,
      session,
      slug,
      setSlug,
      setShowDelete,
      setLoading,
      files,
      createCommit,
      fetchOid,
      methods,
      monorepoPath,
      contentPath,
      collection,
      customFields,
      setCustomFields,
      repoSlug,
      repoBranch,
      metadata,
      setHasChanges,
      editor
    ]
  );
  return onSubmit;
}
var useSubmitDocument_default = useSubmitDocument;

// src/utils/editor/extensions/index.tsx
var import_core4 = require("@tiptap/core");
var import_extension_code_block_lowlight = __toESM(require("@tiptap/extension-code-block-lowlight"));
var import_extension_highlight = __toESM(require("@tiptap/extension-highlight"));
var import_extension_horizontal_rule = __toESM(require("@tiptap/extension-horizontal-rule"));
var import_extension_image = __toESM(require("@tiptap/extension-image"));
var import_extension_link = __toESM(require("@tiptap/extension-link"));
var import_extension_underline = __toESM(require("@tiptap/extension-underline"));
var import_react32 = require("@tiptap/react");
var import_starter_kit = __toESM(require("@tiptap/starter-kit"));
var import_lowlight = __toESM(require("lowlight"));
var import_tiptap_markdown = require("tiptap-markdown");

// src/utils/editor/extensions/CodeBlock.tsx
var import_react26 = require("@tiptap/react");
var import_jsx_runtime26 = require("react/jsx-runtime");
var CodeBlock = ({
  node: {
    attrs: { language: defaultLanguage }
  },
  updateAttributes,
  extension
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(import_react26.NodeViewWrapper, { className: "relative", children: [
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("div", { className: "absolute top-0 right-6 rounded-b-md border border-t-0 border-gray-600 px-3 py-1", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsxs)(
      "select",
      {
        contentEditable: false,
        defaultValue: defaultLanguage,
        className: "select-none bg-gradient-to-tr from-primary-300 to-primary-400 bg-clip-text font-medium text-white outline-none text-sm",
        onChange: (event) => updateAttributes({ language: event.target.value }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("option", { value: "null", children: "auto" }),
          /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("option", { disabled: true, children: "\u2014" }),
          extension.options.lowlight.listLanguages().map((lang, index) => /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("option", { value: lang, children: lang }, index))
        ]
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime26.jsx)("pre", { className: "text-white bg-slate-900 rounded-md p-4 pt-12", children: /* @__PURE__ */ (0, import_jsx_runtime26.jsx)(import_react26.NodeViewContent, { as: "code" }) })
  ] });
};
var CodeBlock_default = CodeBlock;

// src/utils/editor/extensions/SlashCommand.tsx
var import_core2 = require("@tiptap/core");
var import_react30 = require("@tiptap/react");
var import_suggestion = __toESM(require("@tiptap/suggestion"));
var import_react31 = require("react");
var import_tippy = __toESM(require("tippy.js"));

// src/utils/editor/utils/slash-command/BaseCommandList.tsx
var import_react27 = require("ai/react");
var import_react28 = require("react");
var import_sonner3 = require("sonner");

// src/utils/editor/utils/getPrevText.ts
var getPrevText = (editor, {
  chars,
  offset = 0
}) => {
  return editor.state.doc.textBetween(
    Math.max(0, editor.state.selection.from - chars),
    editor.state.selection.from - offset,
    "\n"
  );
};

// src/utils/editor/utils/slash-command/BaseCommandList.tsx
var import_jsx_runtime27 = require("react/jsx-runtime");
var BaseCommandList = ({
  items: items3,
  command,
  setImageMenu,
  editor,
  range
}) => {
  const [selectedIndex, setSelectedIndex] = (0, import_react28.useState)(0);
  const { hasOpenAIKey } = useOutstatic();
  const { complete, isLoading } = (0, import_react27.useCompletion)({
    id: "outstatic",
    api: "/api/outstatic/generate",
    onResponse: () => {
      editor.chain().focus().deleteRange(range).run();
    },
    onFinish: (_prompt, completion) => {
      editor.commands.setTextSelection({
        from: range.from,
        to: range.from + completion.length
      });
    },
    onError: (e) => {
      import_sonner3.toast.error(e.message);
    }
  });
  const selectItem = (0, import_react28.useCallback)(
    (index) => {
      const item = items3[index];
      if (item) {
        if (item.title === "Continue writing") {
          if (isLoading)
            return;
          complete(
            getPrevText(editor, {
              chars: 5e3,
              offset: 1
            })
          );
        } else if (item.title === "Image") {
          setImageMenu(true);
        } else {
          command(item);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [complete, isLoading, command, editor, items3]
  );
  (0, import_react28.useEffect)(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items3.length - 1) % items3.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items3.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items3, selectItem, selectedIndex]);
  (0, import_react28.useEffect)(() => {
    setSelectedIndex(0);
  }, [items3]);
  const commandListContainer = (0, import_react28.useRef)(null);
  (0, import_react28.useLayoutEffect)(() => {
    const container = commandListContainer == null ? void 0 : commandListContainer.current;
    const item = container == null ? void 0 : container.children[selectedIndex];
    if (item && container)
      updateScrollView(container, item);
  }, [selectedIndex]);
  return items3.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { id: "outstatic", children: /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
    "div",
    {
      id: "slash-command",
      ref: commandListContainer,
      className: "z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all",
      children: items3.map((item, index) => {
        if (item.title === "Continue writing" && !hasOpenAIKey)
          return null;
        return /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
          "button",
          {
            className: `flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 ${index === selectedIndex ? "bg-stone-100 text-stone-900" : ""}`,
            onClick: () => selectItem(index),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { className: "flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white", children: item.title === "Continue writing" && isLoading ? /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)(
                "svg",
                {
                  className: "h-6 animate-spin text-black",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  width: "18",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                      "circle",
                      {
                        className: "opacity-25",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime27.jsx)(
                      "path",
                      {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      }
                    )
                  ]
                }
              ) }) : item.icon }),
              /* @__PURE__ */ (0, import_jsx_runtime27.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "font-medium", children: item.title }),
                /* @__PURE__ */ (0, import_jsx_runtime27.jsx)("p", { className: "text-xs text-stone-500", children: item.description })
              ] })
            ]
          },
          index
        );
      })
    }
  ) }) : null;
};

// src/utils/editor/utils/slash-command/ImageCommandList.tsx
var import_lucide_react7 = require("lucide-react");
var import_react29 = require("react");
var import_jsx_runtime28 = require("react/jsx-runtime");
var isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};
var items = [
  {
    title: "Image Upload",
    description: "Upload or embed with a link.",
    searchTerms: ["upload", "picture", "media"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react7.Upload, { size: 18 })
  },
  {
    title: "Image from URL",
    description: "Upload or embed with a link.",
    searchTerms: ["photo", "picture", "media"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(import_lucide_react7.Link, { size: 18 })
  }
];
var ImageCommandList = ({
  editor,
  range,
  setImageMenu
}) => {
  const [showLink, setShowLink] = (0, import_react29.useState)(false);
  const [imageUrl, setImageUrl] = (0, import_react29.useState)("");
  const [errors, setErrors] = (0, import_react29.useState)({ imageUrl: "", uploadImage: "" });
  const [selectedIndex, setSelectedIndex] = (0, import_react29.useState)(0);
  const addImageFile = () => __async(void 0, null, function* () {
    editor.chain().focus().deleteRange(range).run();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => __async(void 0, null, function* () {
      var _a;
      if ((_a = input.files) == null ? void 0 : _a.length) {
        const file = input.files[0];
        const image = addImage(file);
        if (image) {
          editor.chain().focus().setImage({ src: image, alt: "" }).run();
        }
      }
    });
    input.click();
  });
  const handleImageInput = (e) => {
    setImageUrl(e.target.value);
  };
  const addImageUrl = () => {
    if (!isValidUrl(imageUrl)) {
      setErrors((oldState) => __spreadProps(__spreadValues({}, oldState), { imageUrl: "Invalid URL" }));
      return null;
    }
    if (imageUrl) {
      editor.chain().focus().deleteRange(range).run();
      editor.chain().focus().setImage({ src: imageUrl, alt: "", title: "" }).insertContent("").run();
      editor.chain().blur().run();
    }
    setShowLink(false);
  };
  (0, import_react29.useEffect)(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter", "Escape"];
    const onKeyDown = (e) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          if (items[selectedIndex].title === "Image Upload") {
            addImageFile();
          } else {
            showLink ? addImageUrl() : setShowLink(true);
          }
          return true;
        }
        if (e.key === "Escape") {
          if (showLink) {
            setShowLink(false);
          } else {
            setImageMenu(false);
            editor.chain().focus().run();
          }
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedIndex, showLink]);
  (0, import_react29.useEffect)(() => {
    editor.chain().blur().run();
  }, []);
  (0, import_react29.useEffect)(() => {
    setSelectedIndex(0);
  }, [items]);
  const commandListContainer = (0, import_react29.useRef)(null);
  (0, import_react29.useLayoutEffect)(() => {
    const container = commandListContainer == null ? void 0 : commandListContainer.current;
    const item = container == null ? void 0 : container.children[selectedIndex];
    if (item && container)
      updateScrollView(container, item);
  }, [selectedIndex]);
  return /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { id: "outstatic", children: showLink ? /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { className: "flex w-[500px] rounded-sm border border-black outline-none", children: [
    /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
      "div",
      {
        className: `relative w-[500px] border-r outline-none border-black`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
            "input",
            {
              type: "text",
              className: `w-full h-full py-2 px-3 outline-none ${errors.imageUrl ? "bg-red-50" : "bg-white"}`,
              placeholder: "Insert link here",
              onChange: handleImageInput,
              value: imageUrl,
              onFocus: () => setErrors(__spreadProps(__spreadValues({}, errors), { imageUrl: "" })),
              autoFocus: true
            }
          ),
          errors.imageUrl && /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("span", { className: "absolute text-red-500 top-10 left-0", children: errors.imageUrl })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(MDEMenuButton_default, { onClick: addImageUrl, editor, name: "back", children: "Done" })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime28.jsx)(
    "div",
    {
      id: "slash-command",
      ref: commandListContainer,
      className: "z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-stone-200 bg-white px-1 py-2 shadow-md transition-all",
      children: items.map((item, index) => {
        return /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)(
          "button",
          {
            className: `flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-stone-900 hover:bg-stone-100 ${index === selectedIndex ? "bg-stone-100 text-stone-900" : ""}`,
            onClick: () => item.title === "Image Upload" ? addImageFile() : setShowLink(true),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                item.title === "Image Upload" ? addImageFile() : setShowLink(true);
              }
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("div", { className: "flex h-10 w-10 items-center justify-center rounded-md border border-stone-200 bg-white", children: item.icon }),
              /* @__PURE__ */ (0, import_jsx_runtime28.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "font-medium", children: item.title }),
                /* @__PURE__ */ (0, import_jsx_runtime28.jsx)("p", { className: "text-xs text-stone-500", children: item.description })
              ] })
            ]
          },
          index
        );
      })
    }
  ) });
};
var ImageCommandList_default = ImageCommandList;

// src/utils/editor/utils/slash-command/getSuggestionItems.tsx
var import_lucide_react8 = require("lucide-react");
var import_jsx_runtime29 = require("react/jsx-runtime");
var items2 = [
  {
    title: "Continue writing",
    description: "Use AI to expand your thoughts.",
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.Edit3, { size: 18 })
  },
  {
    title: "Text",
    description: "Just start typing with plain text.",
    searchTerms: ["p", "paragraph"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.Text, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").run();
    }
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large", "h1"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.Heading1, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run();
    }
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium", "h2"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.Heading2, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run();
    }
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small", "h3"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.Heading3, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run();
    }
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.List, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    }
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.ListOrdered, { size: 18 }),
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    }
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.TextQuote, { size: 18 }),
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleNode("paragraph", "paragraph").toggleBlockquote().run()
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.Code, { size: 18 }),
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
  },
  {
    title: "Image",
    description: "Upload or embed with a link.",
    searchTerms: ["photo", "picture", "media"],
    icon: /* @__PURE__ */ (0, import_jsx_runtime29.jsx)(import_lucide_react8.Image, { size: 18 })
  }
];
var filterItems = (items3, search) => {
  return items3.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(search);
    const descriptionMatch = item.description.toLowerCase().includes(search);
    const searchTermMatch = item.searchTerms && item.searchTerms.some((term) => term.includes(search));
    if (titleMatch || descriptionMatch || searchTermMatch) {
      return true;
    }
    return false;
  });
};
var getSuggestionItems = (props) => {
  const { query } = props;
  if (typeof query !== "string" || query.length === 0) {
    return items2;
  }
  const search = query.toLowerCase();
  const filteredItems = filterItems(items2, search);
  return filteredItems;
};

// src/utils/editor/extensions/SlashCommand.tsx
var import_jsx_runtime30 = require("react/jsx-runtime");
var Command = import_core2.Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props
        }) => {
          props.command({ editor, range });
        }
      }
    };
  },
  addProseMirrorPlugins() {
    return [
      (0, import_suggestion.default)(__spreadValues({
        editor: this.editor
      }, this.options.suggestion))
    ];
  }
});
var updateScrollView = (container, item) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;
  const top = item.offsetTop;
  const bottom = top + itemHeight;
  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};
var CommandList = ({
  items: items3,
  command,
  editor,
  range
}) => {
  const [imageMenu, setImageMenu] = (0, import_react31.useState)(false);
  return items3.length > 0 ? imageMenu ? /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
    ImageCommandList_default,
    {
      editor,
      setImageMenu,
      range
    }
  ) : /* @__PURE__ */ (0, import_jsx_runtime30.jsx)(
    BaseCommandList,
    {
      items: items3,
      command,
      setImageMenu,
      editor,
      range
    }
  ) : null;
};
var renderItems = () => {
  let component = null;
  let popup = null;
  return {
    onStart: (props) => {
      component = new import_react30.ReactRenderer(CommandList, {
        props,
        editor: props.editor
      });
      popup = (0, import_tippy.default)("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start"
      });
    },
    onUpdate: (props) => {
      component == null ? void 0 : component.updateProps(props);
      popup && popup[0].setProps({
        getReferenceClientRect: props.clientRect
      });
    },
    onKeyDown: (props) => {
      var _a;
      if (props.event.key === "Escape") {
        popup == null ? void 0 : popup[0].hide();
        return true;
      }
      return (_a = component == null ? void 0 : component.ref) == null ? void 0 : _a.onKeyDown(props);
    },
    onExit: () => {
      var _a;
      (_a = popup == null ? void 0 : popup[0]) == null ? void 0 : _a.destroy();
      component == null ? void 0 : component.destroy();
    }
  };
};
var SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems
  }
});
var SlashCommand_default = SlashCommand;

// src/utils/editor/extensions/ToggleClass.tsx
var import_core3 = require("@tiptap/core");
var toggleClass = (className) => ({ tr, state }) => {
  const { selection } = state;
  const { $anchor } = selection;
  const node = $anchor.node($anchor.depth);
  if (!node || node.isText) {
    return false;
  }
  const classes = node.attrs.class || "";
  const classArray = classes.split(" ");
  const classExists = classArray.includes(className);
  let newClasses;
  if (classExists) {
    newClasses = classArray.filter((item) => item !== className).join(" ");
  } else {
    newClasses = `${classes} ${className}`.trim();
  }
  const newAttrs = __spreadProps(__spreadValues({}, node.attrs), { class: newClasses });
  tr.setNodeMarkup($anchor.before($anchor.depth), null, newAttrs);
  return true;
};
var ToggleClass = import_core3.Extension.create({
  name: "toggleClass",
  addGlobalAttributes() {
    return [
      {
        // Extend the following extensions
        types: ["heading", "paragraph"],
        // … with those attributes
        attributes: {
          class: {
            default: "",
            // Take the attribute values
            renderHTML: (attributes) => {
              return {
                class: `${attributes.class}`
              };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      toggleClass: (className) => ({ commands }) => {
        return commands.command(toggleClass(className));
      }
    };
  }
});

// src/utils/editor/extensions/index.tsx
var TiptapExtensions = [
  import_starter_kit.default.configure({
    bulletList: {
      HTMLAttributes: {
        class: "list-disc list-outside leading-3 -mt-2"
      }
    },
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal list-outside leading-3 -mt-2"
      }
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal -mb-2"
      }
    },
    blockquote: {
      HTMLAttributes: {
        class: "border-l-4 border-stone-700"
      }
    },
    codeBlock: false,
    code: {
      HTMLAttributes: {
        class: "rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-stone-900",
        spellcheck: "false"
      }
    },
    horizontalRule: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4
    },
    gapcursor: false
  }),
  ToggleClass,
  // patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
  import_extension_horizontal_rule.default.extend({
    addInputRules() {
      return [
        new import_core4.InputRule({
          find: /^(?:---|—-|___\s|\*\*\*\s)$/,
          handler: ({ state, range }) => {
            const attributes = {};
            const { tr } = state;
            const start = range.from;
            let end = range.to;
            tr.insert(start - 1, this.type.create(attributes)).delete(
              tr.mapping.map(start),
              tr.mapping.map(end)
            );
          }
        })
      ];
    }
  }).configure({
    HTMLAttributes: {
      class: "mt-4 mb-6 border-t border-stone-300"
    }
  }),
  SlashCommand_default,
  import_extension_underline.default,
  import_extension_highlight.default.configure({
    multicolor: true
  }),
  import_tiptap_markdown.Markdown.configure({
    html: false,
    linkify: false,
    transformPastedText: true
  }),
  import_extension_image.default.extend({
    renderHTML({ HTMLAttributes: HTMLAttributes2 }) {
      return [
        "img",
        __spreadProps(__spreadValues({}, HTMLAttributes2), {
          onError: `this.classList.add("image-error");this.alt="Couldn't load image.";`
        })
      ];
    }
  }).configure({ inline: true }),
  import_extension_link.default.configure({ openOnClick: false }),
  import_extension_code_block_lowlight.default.extend({
    addNodeView() {
      return (0, import_react32.ReactNodeViewRenderer)(CodeBlock_default);
    }
  }).configure({
    lowlight: import_lowlight.default
  })
];

// src/utils/editor/props.ts
var TiptapEditorProps = {
  attributes: {
    class: `prose-lg prose-stone prose-headings:font-display font-default focus:outline-none max-w-full`
  },
  handleDOMEvents: {
    keydown: (_view, event) => {
      if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
        const slashCommand = document.querySelector("#slash-command");
        if (slashCommand) {
          return true;
        }
      }
    }
  },
  handlePaste: (view, event) => {
    var _a;
    if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
      event.preventDefault();
      const items3 = Array.from(((_a = event.clipboardData) == null ? void 0 : _a.items) || []);
      for (const item of items3) {
        if (item.type.indexOf("image") === 0) {
          const { schema } = view.state;
          const file = event.clipboardData.files[0];
          const image = addImage(file);
          const node = schema.nodes.image.create({ src: image, alt: "" });
          const transaction = view.state.tr.replaceSelectionWith(node);
          view.dispatch(transaction);
          return true;
        }
      }
    }
    return false;
  },
  handleDrop: (view, event, _slice, moved) => {
    if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
      event.preventDefault();
      if (event.dataTransfer.files[0] !== void 0) {
        const file = event.dataTransfer.files[0];
        const image = addImage(file);
        const { schema } = view.state;
        const node = schema.nodes.image.create({ src: image, alt: "" });
        const transaction = view.state.tr.replaceSelectionWith(node);
        view.dispatch(transaction);
        return true;
      }
      return false;
    }
  }
};

// src/utils/hooks/useTipTap.tsx
var import_extension_placeholder = __toESM(require("@tiptap/extension-placeholder"));
var import_react33 = require("@tiptap/react");
var import_react34 = require("ai/react");
var import_react35 = require("react");
var import_sonner4 = require("sonner");
var import_use_debounce = require("use-debounce");
var useTipTap = (_a) => {
  var rhfMethods = __objRest(_a, []);
  const { hasOpenAIKey } = useOutstatic();
  const { setValue, trigger } = rhfMethods;
  const editorRef = (0, import_react35.useRef)(null);
  const debouncedUpdates = (0, import_use_debounce.useDebouncedCallback)((_0) => __async(void 0, [_0], function* ({ editor: editor2 }) {
    const val = editor2.getHTML();
    setValue("content", val && !editor2.isEmpty ? val : "");
    (() => __async(void 0, null, function* () {
      return yield trigger("content");
    }))();
  }), 750);
  const editor = (0, import_react33.useEditor)({
    extensions: [
      ...TiptapExtensions,
      import_extension_placeholder.default.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return `Heading ${node.attrs.level}`;
          }
          return `Press '/' for commands${hasOpenAIKey ? ", or '++' for AI autocomplete..." : ""}`;
        },
        includeChildren: true
      })
    ],
    editorProps: TiptapEditorProps,
    onUpdate({ editor: editor2 }) {
      const selection = editor2.state.selection;
      const lastTwo = getPrevText(editor2, {
        chars: 2
      });
      if (hasOpenAIKey && lastTwo === "++" && !isLoading) {
        editor2.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from
        });
        const prevText = getPrevText(editor2, { chars: 5e3 });
        if (prevText === "") {
          import_sonner4.toast.error("Write some content so the AI can continue.");
        } else {
          complete(prevText);
        }
      } else {
        debouncedUpdates({ editor: editor2 });
      }
    }
  });
  (0, import_react35.useEffect)(() => {
    editorRef.current = editor;
  }, [editor]);
  const { complete, completion, isLoading, stop } = (0, import_react34.useCompletion)({
    id: "outstatic",
    api: "/api/outstatic/generate",
    onFinish: (_prompt, completion2) => {
      if (editorRef.current) {
        editorRef.current.commands.setTextSelection({
          from: editorRef.current.state.selection.from - completion2.length,
          to: editorRef.current.state.selection.from
        });
      }
    },
    onError: (err) => {
      import_sonner4.toast.error(err.message);
    }
  });
  const prev = (0, import_react35.useRef)("");
  (0, import_react35.useEffect)(() => {
    editor == null ? void 0 : editor.commands.toggleClass("completing");
  }, [isLoading]);
  (0, import_react35.useEffect)(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    try {
      editor == null ? void 0 : editor.commands.insertContent(diff);
    } catch (e) {
      console.log(`error adding content: ${diff}`);
    }
  }, [isLoading, editor, completion]);
  (0, import_react35.useEffect)(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" || e.metaKey && e.key === "z") {
        stop();
        if (e.key === "Escape") {
          editor == null ? void 0 : editor.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from
          });
          import_sonner4.toast.message("AI writing cancelled.");
        }
      }
    };
    const mousedownHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm("AI writing paused. Continue?")) {
        complete((editor == null ? void 0 : editor.getText()) || "");
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);
  return { editor };
};
var useTipTap_default = useTipTap;

// src/utils/yup.ts
var yup2 = __toESM(require("yup"));

// src/utils/slugRegex.ts
var slugRegex = /^([a-z0-9]+-)*[a-z0-9]+$/;

// src/utils/yup.ts
var documentShape = {
  title: yup2.string().required("Title is required."),
  publishedAt: yup2.date().required("Date is required."),
  content: yup2.string().required("Content is required."),
  status: yup2.string().equals(["published", "draft"]).required("Status is missing."),
  author: yup2.object().shape({
    name: yup2.string(),
    picture: yup2.string()
  }),
  slug: yup2.string().matches(/^(?!new$)/, 'The word "new" is not a valid slug.').matches(
    slugRegex,
    "Slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen."
  ).max(200, "Slugs can be a maximum of 200 characters.").required(),
  description: yup2.string(),
  coverImage: yup2.string()
};
var editDocumentSchema = yup2.object().shape(documentShape);
var convertSchemaToYup = (customFields) => {
  const shape = {};
  for (const [name, fields] of Object.entries(customFields.properties)) {
    shape[name] = yup2[fields.dataType]();
    if (fields.required) {
      shape[name] = shape[name].required(`${fields.title} is a required field.`);
    }
    if (fields.dataType === "number") {
      shape[name] = shape[name].typeError(
        `${fields.title} is a required field.`
      );
    }
    if (fields.dataType === "array" && fields.required) {
      shape[name] = shape[name].min(1, `${fields.title} is a required field.`);
    }
  }
  const mergedSchema = yup2.object().shape(__spreadValues(__spreadValues({}, documentShape), shape));
  return mergedSchema;
};

// src/client/pages/edit-document/index.tsx
var import_yup3 = require("@hookform/resolvers/yup");
var import_head = __toESM(require("next/head"));
var import_navigation5 = require("next/navigation");
var import_pluralize = require("pluralize");
var import_react36 = require("react");
var import_react_hook_form8 = require("react-hook-form");
var import_jsx_runtime31 = require("react/jsx-runtime");
function EditDocument({ collection }) {
  const pathname = (0, import_navigation5.usePathname)();
  const [slug, setSlug] = (0, import_react36.useState)(
    pathname.split("/").pop() || `/${collection}/new`
  );
  const { session } = useOstSession();
  const [loading, setLoading] = (0, import_react36.useState)(false);
  const { hasChanges, setHasChanges } = useOutstatic();
  const [showDelete, setShowDelete] = (0, import_react36.useState)(false);
  const [documentSchema, setDocumentSchema] = (0, import_react36.useState)(editDocumentSchema);
  const methods = (0, import_react_hook_form8.useForm)({ resolver: (0, import_yup3.yupResolver)(documentSchema) });
  const { editor } = useTipTap_default(__spreadValues({}, methods));
  const [customFields, setCustomFields] = (0, import_react36.useState)({});
  const files = useFileStore((state) => state.files);
  const editDocument = (property, value) => {
    const formValues = methods.getValues();
    const newValue = deepReplace(formValues, property, value);
    methods.reset(newValue);
  };
  const { data: schemaQueryData } = useFileQuery_default({
    file: `${collection}/schema.json`
  });
  const onSubmit = useSubmitDocument_default({
    session,
    slug,
    setSlug,
    setShowDelete,
    setLoading,
    files,
    methods,
    collection,
    customFields,
    setCustomFields,
    setHasChanges,
    editor
  });
  (0, import_react36.useEffect)(() => {
    window.history.replaceState({}, "", `/outstatic/${collection}/${slug}`);
  }, [slug]);
  useDocumentUpdateEffect({
    collection,
    methods,
    slug,
    editor,
    session,
    setHasChanges,
    setShowDelete
  });
  (0, import_react36.useEffect)(() => {
    var _a;
    const documentQueryObject = (_a = schemaQueryData == null ? void 0 : schemaQueryData.repository) == null ? void 0 : _a.object;
    if ((documentQueryObject == null ? void 0 : documentQueryObject.__typename) === "Blob") {
      const schema = JSON.parse((documentQueryObject == null ? void 0 : documentQueryObject.text) || "{}");
      const yupSchema = convertSchemaToYup(schema);
      setDocumentSchema(yupSchema);
      setCustomFields(schema.properties);
    }
  }, [schemaQueryData]);
  return /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(import_jsx_runtime31.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)(import_head.default, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        "link",
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: ""
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
        "link",
        {
          href: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap",
          rel: "stylesheet"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
      DocumentContext.Provider,
      {
        value: {
          editor,
          document: methods.getValues(),
          editDocument,
          hasChanges,
          collection
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(import_react_hook_form8.FormProvider, __spreadProps(__spreadValues({}, methods), { children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
          AdminLayout,
          {
            title: methods.getValues("title"),
            settings: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
              DocumentSettings_default,
              {
                loading,
                saveFunc: methods.handleSubmit(onSubmit),
                showDelete,
                customFields
              }
            ),
            children: /* @__PURE__ */ (0, import_jsx_runtime31.jsxs)("form", { className: "m-auto max-w-[700px] space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(
                DocumentTitle,
                {
                  id: "title",
                  className: "w-full resize-none outline-none bg-white text-5xl scrollbar-hide min-h-[55px] overflow-hidden",
                  placeholder: `Your ${(0, import_pluralize.singular)(collection)} title`
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime31.jsx)("div", { className: "min-h-full prose prose-xl", children: /* @__PURE__ */ (0, import_jsx_runtime31.jsx)(MDEditor_default, { editor, id: "content" }) })
            ] })
          }
        ) }))
      }
    )
  ] });
}

// src/client/pages/list.tsx
var import_gray_matter3 = __toESM(require("gray-matter"));
var import_link4 = __toESM(require("next/link"));
var import_navigation6 = require("next/navigation");
var import_pluralize2 = require("pluralize");
var import_jsx_runtime32 = require("react/jsx-runtime");
var options2 = {
  year: "numeric",
  month: "long",
  day: "numeric"
};
function List2({ collection }) {
  var _a, _b, _c, _d, _e;
  const router = (0, import_navigation6.useRouter)();
  const {
    repoOwner,
    repoSlug,
    repoBranch,
    contentPath,
    monorepoPath,
    session
  } = useOutstatic();
  const { data, error, loading } = useDocumentsQuery({
    variables: {
      owner: repoOwner || ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.login) || "",
      name: repoSlug || "",
      contentPath: `${repoBranch}:${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}` || ""
    },
    fetchPolicy: "network-only",
    onError: ({ graphQLErrors }) => {
      var _a2;
      if (graphQLErrors && ((_a2 = graphQLErrors == null ? void 0 : graphQLErrors[0]) == null ? void 0 : _a2.type) === "NOT_FOUND") {
        router.push("/api/outstatic/signout");
        return null;
      }
      return null;
    }
  });
  let documents = [];
  const entries = ((_c = (_b = data == null ? void 0 : data.repository) == null ? void 0 : _b.object) == null ? void 0 : _c.__typename) === "Tree" && ((_e = (_d = data == null ? void 0 : data.repository) == null ? void 0 : _d.object) == null ? void 0 : _e.entries);
  if (entries) {
    entries.forEach((document2) => {
      var _a2, _b2, _c2;
      if (document2.name.slice(-3) === ".md") {
        const { data: data2 } = (0, import_gray_matter3.default)(
          ((_a2 = document2 == null ? void 0 : document2.object) == null ? void 0 : _a2.__typename) === "Blob" && ((_b2 = document2 == null ? void 0 : document2.object) == null ? void 0 : _b2.text) ? (_c2 = document2 == null ? void 0 : document2.object) == null ? void 0 : _c2.text : ""
        );
        const listData = __spreadValues({}, data2);
        delete listData.coverImage;
        documents.push(__spreadProps(__spreadValues({}, listData), {
          author: listData.author.name || "",
          publishedAt: new Date(listData.publishedAt).toLocaleDateString(
            "en-US",
            options2
          ),
          slug: document2.name.replace(".md", "")
        }));
      }
    });
    documents.sort((a, b) => Number(b.publishedAt) - Number(a.publishedAt));
  }
  return /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)(
    AdminLayout,
    {
      error,
      title: collection[0].toUpperCase() + collection.slice(1),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "mb-8 flex h-12 items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("h1", { className: "mr-12 text-2xl capitalize", children: collection }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_link4.default, { href: `/outstatic/${collection}/new`, children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 border-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700 capitalize", children: [
            "New ",
            (0, import_pluralize2.singular)(collection)
          ] }) })
        ] }),
        documents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "relative shadow-md sm:rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(DocumentsTable_default, { documents, collection }) }),
        documents.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "absolute bottom-0 left-0 md:left-64 right-0 md:top-36", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
            "svg",
            {
              fill: "none",
              className: "h-full w-full",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                "path",
                {
                  d: "m1555.43 194.147c-100.14 46.518-204.72 78.763-313.64 96.841-78.16 12.972-282.29 0-291.79-143.988-1.58-23.948 1-89.4705 67-127 58-32.9805 115.15-13.36095 142.5 5.5 27.35 18.861 45.02 44.5 54 73 16.37 51.951-9.22 115.124-30.65 161.874-57.09 124.562-177.31 219.357-311.976 246.789-142.617 29.052-292.036-9.369-430.683-41.444-100.166-23.173-196.003-36.724-298.229-15.203-48.046 10.115-94.9295 24.91-139.962 44.112",
                  className: "stroke-slate-900",
                  strokeWidth: "2"
                }
              )
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("div", { className: "relative", children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "mb-20 max-w-2xl p-8 px-4 md:p-8 text-black bg-white rounded-lg border border-gray-200 shadow-md prose prose-base", children: [
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("p", { children: "This collection has no documents yet." }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("p", { children: [
              "Create your first",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)("span", { className: "capitalize", children: (0, import_pluralize2.singular)(collection) }),
              " by clicking the button below."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(import_link4.default, { href: `/outstatic/${collection}/new`, children: /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("div", { className: "inline-block cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 border-gray-600 bg-gray-800 text-white hover:border-gray-600 hover:bg-gray-700 focus:ring-gray-700 capitalize", children: [
              "New ",
              (0, import_pluralize2.singular)(collection)
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime32.jsxs)("p", { children: [
              "To learn more about how documents work",
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime32.jsx)(
                "a",
                {
                  href: "https://outstatic.com/docs/introduction#whats-a-document",
                  target: "_blank",
                  rel: "noreferrer",
                  children: "click here"
                }
              ),
              "."
            ] })
          ] }) })
        ] })
      ]
    }
  );
}

// src/utils/errors/loginErrors.tsx
var import_jsx_runtime33 = require("react/jsx-runtime");
var loginErrors = {
  something: "Something went wrong. Please try again.",
  "repository-not-found": /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(import_jsx_runtime33.Fragment, { children: [
    "We couldn't access your repository. ",
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("br", {}),
    "Please, check out our",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      "a",
      {
        className: "underline",
        target: "_blank",
        href: "https://outstatic.com/docs/faqs#troubleshooting-login-and-repository-access-issues",
        children: "troubleshooting guide"
      }
    ),
    "."
  ] }),
  "not-collaborator": /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(import_jsx_runtime33.Fragment, { children: [
    "You're not a collaborator of this repository. ",
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("br", {}),
    "Please, check out our",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      "a",
      {
        className: "underline",
        target: "_blank",
        href: "https://outstatic.com/docs/faqs#troubleshooting-login-and-repository-access-issues",
        children: "troubleshooting guide"
      }
    ),
    "."
  ] }),
  redirect_uri_mismatch: /* @__PURE__ */ (0, import_jsx_runtime33.jsxs)(import_jsx_runtime33.Fragment, { children: [
    "The redirect_uri MUST match the registered callback URL for this application. ",
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("br", {}),
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)("br", {}),
    "For more information:",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime33.jsx)(
      "a",
      {
        className: "underline",
        target: "_blank",
        href: "https://docs.github.com/apps/managing-oauth-apps/troubleshooting-authorization-request-errors/#redirect-uri-mismatch",
        children: "GitHub Apps troubleshooting"
      }
    ),
    "."
  ] })
};
var loginErrors_default = loginErrors;

// src/client/pages/login.tsx
var import_clsx = __toESM(require("clsx"));
var import_navigation7 = require("next/navigation");
var import_react37 = require("react");
var import_jsx_runtime34 = require("react/jsx-runtime");
function Login() {
  const searchParams = (0, import_navigation7.useSearchParams)();
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = (0, import_react37.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(import_jsx_runtime34.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { id: "outstatic", children: [
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "absolute w-full left-0 overflow-hidden z-0 md:-top-10 bg-white h-screen", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
      "svg",
      {
        width: "100%",
        height: "100%",
        viewBox: "0 0 1200 365",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
          "path",
          {
            d: "M-276.32 159.182C-232.477 130.613 -193.037 95.4797 -149.142 66.8773C-123.398 50.1026 -99.0091 30.5473 -69.5694 19.7442C-38.5686 8.36831 -2.85928 -3.31376 37.4064 4.54405C65.5725 10.0406 93.927 20.2194 125.473 43.3305C150.292 61.5127 166.609 84.5943 185.936 114.255C220.569 167.405 225.81 223.228 224.615 265.934C223.2 316.536 198.5 341.652 158.621 340.382C121.027 339.185 71.9868 320.328 45.0005 250.638C8.63388 156.723 111.095 159.937 149.344 159.325C235.509 157.945 334.997 185.056 433.145 218.102C547.034 256.448 651.041 336.753 780 356C940 384.5 1235.5 330.311 1237.95 70.5232",
            stroke: "#1E293B",
            className: (0, import_clsx.default)(
              "stroke-2 md:stroke-1",
              isLoading && "animate-draw"
            ),
            strokeLinecap: "round",
            strokeDasharray: "4000"
          }
        )
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("main", { className: "relative flex h-screen items-center justify-center z-10 p-4", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "relative flex flex-col items-center justify-center", children: [
      error && loginErrors_default[error] ? /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("div", { className: "absolute -top-4 -translate-y-full", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(Alert_default, { type: "error", children: loginErrors_default[error] }) }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("h1", { className: "mb-8 text-center text-xl font-semibold text-white", children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
        "svg",
        {
          fill: "none",
          height: "32",
          viewBox: "0 0 775 135",
          width: "200",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-label": "Outstatic",
          children: /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("g", { fill: "#1e293b", children: [
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m63.9963 134.869c-11.3546 0-21.0957-1.913-29.2232-5.738-8.008-3.824-14.522-8.904-19.5419-15.239-5.02-6.454-8.72517-13.565-11.11562-21.3344-2.39045-7.769-3.585673-15.5379-3.585673-23.3069 0-7.5299 1.254983-15.1196 3.764953-22.769 2.62949-7.769 6.51394-14.8805 11.65344-21.3347 5.259-6.4543 11.773-11.6535 19.5419-15.59772 7.8885-3.94424 17.0917-5.91636 27.6097-5.91636 10.996 0 20.4383 1.97212 28.3268 5.91636 8.008 3.94422 14.5813 9.20322 19.7213 15.77692 5.139 6.4542 8.964 13.5061 11.474 21.1555 2.63 7.6494 3.944 15.2391 3.944 22.769 0 7.4104-1.314 15.0001-3.944 22.769-2.51 7.6495-6.394 14.7613-11.653 21.3343-5.14 6.455-11.5941 11.654-19.363 15.598-7.769 3.944-16.9722 5.917-27.6097 5.917zm.8964-9.323c6.9323 0 12.9084-1.554 17.9284-4.662 5.1394-3.107 9.3227-7.231 12.5498-12.37 3.3467-5.259 5.7971-10.9962 7.3511-17.2114 1.553-6.3347 2.33-12.6096 2.33-18.8248 0-7.6494-.896-15-2.689-22.0519-1.793-7.1713-4.5419-13.5658-8.2471-19.1833-3.5856-5.7371-8.0677-10.2192-13.4462-13.4463-5.3785-3.3466-11.5937-5.0199-18.6455-5.0199-6.9323 0-12.9682 1.6135-18.1077 4.8406-5.1394 3.2271-9.3227 7.4702-12.5498 12.7292-3.2271 5.1394-5.6773 10.8765-7.3506 17.2112-1.5538 6.2152-2.3307 12.4901-2.3307 18.8248 0 6.2151.8366 12.7889 2.5099 19.7212 1.6734 6.9323 4.2431 13.3865 7.7092 19.3626 3.4662 5.976 7.8885 10.817 13.267 14.522 5.4981 3.705 12.0718 5.558 19.7212 5.558z" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m179.299 134.869c-6.693 0-12.251-1.255-16.673-3.765-4.303-2.51-7.53-6.634-9.681-12.371-2.152-5.857-3.227-13.566-3.227-23.1276v-28.1475c0-2.0319 0-4.1235 0-6.2749.119-2.271.358-4.4821.717-6.6335-2.032.1195-4.183.239-6.454.3585-2.271 0-4.303.0598-6.096.1793v-9.502h4.303c5.976 0 10.458-.5379 13.446-1.6136s5.08-2.2111 6.275-3.4064h6.813v54.6815c0 9.4422 1.314 16.4942 3.944 21.1552 2.629 4.662 7.052 6.933 13.267 6.813 4.064 0 7.948-1.195 11.653-3.586 3.825-2.39 6.933-5.199 9.323-8.426v-42.4901c0-2.6295.06-5.0797.179-7.3507.12-2.3904.359-4.6613.718-6.8127-2.152.1195-4.363.239-6.634.3585-2.271 0-4.363.0598-6.275.1793v-9.502h5.199c5.259 0 9.383-.5379 12.371-1.6136s5.139-2.2111 6.454-3.4064h6.813l-.179 65.9767c0 1.912-.06 4.542-.18 7.888-.119 3.227-.298 6.096-.538 8.606 2.032-.12 4.124-.239 6.275-.359 2.271-.119 4.363-.179 6.275-.179v9.502h-28.506c-.239-1.912-.478-3.705-.717-5.379-.119-1.673-.299-3.286-.538-4.84-3.705 3.466-8.008 6.514-12.908 9.143-4.901 2.63-10.04 3.945-15.419 3.945z" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m283.918 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.426-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.435-4.422-2.152-10.279-2.152-17.57l.359-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.86-3.5857 3.347-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.427v25.0997h27.609v9.3227l-27.609.3586-.359 47.8687c0 4.5418.359 8.5458 1.076 12.0118.837 3.347 2.151 5.976 3.944 7.889 1.913 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.427-2.51 2.988-1.673 5.796-4.422 8.426-8.247l6.096 5.378c-2.869 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.618 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.152.358-3.885.538-5.2.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m358.946 134.869c-5.618 0-10.817-.777-15.598-2.331-4.781-1.434-8.605-3.168-11.474-5.199l.538 5.916h-9.502l-.897-30.837h7.53c.239 4.423 1.614 8.427 4.124 12.012 2.51 3.586 5.737 6.395 9.681 8.427 4.064 2.031 8.426 3.047 13.088 3.047 2.749 0 5.438-.418 8.068-1.255 2.629-.956 4.84-2.33 6.633-4.123 1.793-1.913 2.689-4.243 2.689-6.992 0-2.988-.956-5.439-2.868-7.351-1.793-2.032-4.303-3.825-7.53-5.378-3.108-1.5542-6.693-3.108-10.757-4.6618-3.586-1.4342-7.231-2.9282-10.936-4.482-3.586-1.5538-6.933-3.4064-10.04-5.5578-3.108-2.1514-5.558-4.7809-7.351-7.8885-1.793-3.2271-2.689-7.1714-2.689-11.8327 0-2.749.538-5.6773 1.613-8.7849 1.076-3.2271 2.809-6.1554 5.2-8.7849 2.39-2.749 5.617-4.9602 9.681-6.6335 4.064-1.7928 9.084-2.6893 15.06-2.6893 3.227 0 6.812.5379 10.757 1.6136 4.063 1.0757 7.828 2.9283 11.295 5.5578l-.18-6.2749h9.502v31.5539h-7.709c-.358-4.1833-1.494-8.0678-3.406-11.6535-1.793-3.5856-4.363-6.5139-7.709-8.7849-3.347-2.2709-7.411-3.4064-12.192-3.4064-4.661 0-8.486 1.1953-11.474 3.5857-2.868 2.2709-4.303 5.1395-4.303 8.6056 0 3.4662 1.076 6.275 3.227 8.4264 2.271 2.1514 5.2 4.004 8.785 5.5578 3.586 1.5537 7.47 3.1075 11.654 4.6613 5.02 2.0319 9.741 4.2431 14.163 6.6335 4.422 2.3905 8.008 5.3785 10.757 8.9642s4.124 8.1273 4.124 13.6253c0 5.976-1.554 10.996-4.662 15.06-2.988 3.944-6.872 6.873-11.653 8.785s-9.861 2.869-15.239 2.869z" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m439.216 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.427-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.434-4.422-2.151-10.279-2.151-17.57l.358-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.861-3.5857 3.346-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.426v25.0997h27.61v9.3227l-27.61.3586-.358 47.8687c0 4.5418.358 8.5458 1.075 12.0118.837 3.347 2.152 5.976 3.945 7.889 1.912 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.426-2.51 2.988-1.673 5.797-4.422 8.426-8.247l6.096 5.378c-2.869 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.617 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.151.358-3.884.538-5.199.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m528.944 132c-.239-1.912-.418-3.586-.537-5.02-.12-1.434-.299-2.928-.538-4.482-4.064 4.064-8.427 7.171-13.088 9.323-4.661 2.032-9.502 3.048-14.522 3.048-8.606 0-15.119-2.092-19.542-6.275-4.303-4.303-6.454-9.622-6.454-15.957 0-5.498 1.614-10.279 4.841-14.3423 3.227-4.0638 7.47-7.3507 12.729-9.8606 5.259-2.6295 10.996-4.5419 17.211-5.7371 6.215-1.3148 12.311-1.9721 18.287-1.9721v-10.5778c0-3.8247-.359-7.3506-1.076-10.5777-.717-3.3466-2.211-6.0359-4.482-8.0678-2.151-2.1514-5.558-3.2271-10.219-3.2271-3.108-.1195-6.215.4781-9.323 1.7929-3.107 1.1952-5.498 3.2271-7.171 6.0956.956.9562 1.554 2.0917 1.793 3.4064.358 1.1952.538 2.3307.538 3.4064 0 1.6733-.718 3.5857-2.152 5.7371-1.434 2.0318-3.884 2.988-7.35 2.8685-2.869 0-5.08-.9562-6.634-2.8685-1.434-2.0319-2.151-4.3626-2.151-6.9921 0-4.3028 1.553-8.1275 4.661-11.4741 3.227-3.3467 7.59-5.9762 13.088-7.8885 5.498-1.9124 11.653-2.8686 18.466-2.8686 10.279 0 17.928 2.6893 22.948 8.0678 5.14 5.3785 7.709 13.8646 7.709 25.4583v12.3705c0 3.9443-.059 7.8885-.179 11.8328v12.55c0 1.793-.06 3.825-.179 6.095-.12 2.271-.299 4.662-.538 7.172 2.032-.12 4.124-.239 6.275-.359 2.151-.119 4.183-.179 6.096-.179v9.502zm-1.613-43.0281c-3.825.2391-7.769.7769-11.833 1.6136-3.944.8366-7.53 2.0916-10.757 3.7649s-5.856 3.8247-7.888 6.4546c-1.913 2.629-2.869 5.796-2.869 9.502.239 4.063 1.554 7.051 3.944 8.964 2.51 1.912 5.439 2.868 8.785 2.868 4.184 0 7.889-.777 11.116-2.33 3.227-1.674 6.394-3.945 9.502-6.813-.12-1.315-.179-2.63-.179-3.944 0-1.435 0-2.929 0-4.482 0-1.076 0-3.048 0-5.9168.119-2.988.179-6.2151.179-9.6813z" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m602.217 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.427-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.434-4.422-2.151-10.279-2.151-17.57l.358-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.861-3.5857 3.346-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.426v25.0997h27.61v9.3227l-27.61.3586-.358 47.8687c0 4.5418.358 8.5458 1.075 12.0118.837 3.347 2.152 5.976 3.945 7.889 1.912 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.426-2.51 2.988-1.673 5.797-4.422 8.426-8.247l6.096 5.378c-2.868 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.617 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.151.358-3.884.538-5.199.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m639.057 124.47c3.585 0 6.095-.837 7.53-2.51 1.434-1.673 2.271-4.004 2.51-6.992.358-2.988.538-6.454.538-10.398v-37.1121c0-2.0319.059-4.0638.179-6.0957.119-2.1514.299-4.4223.538-6.8127-2.032.1195-4.184.239-6.455.3585-2.27 0-4.362.0598-6.275.1793v-9.502c5.379 0 9.622-.2391 12.73-.7172 3.227-.5976 5.677-1.2549 7.35-1.9721 1.793-.7171 3.108-1.494 3.945-2.3307h6.812v69.2037c0 2.151-.059 4.362-.179 6.633-.119 2.152-.299 4.363-.538 6.634 1.913-.12 3.825-.179 5.737-.179 2.032-.12 3.885-.24 5.558-.359v9.502h-39.98zm19.183-100.3988c-3.107 0-5.737-1.1354-7.888-3.4063-2.152-2.3905-3.227-5.259-3.227-8.6057 0-3.34658 1.135-6.15536 3.406-8.42628 2.271-2.39045 4.841-3.5856788 7.709-3.5856788 3.108 0 5.677 1.1952288 7.709 3.5856788 2.152 2.27092 3.227 5.0797 3.227 8.42628 0 3.3467-1.075 6.2152-3.227 8.6057-2.032 2.2709-4.601 3.4063-7.709 3.4063z" }),
            /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("path", { d: "m735.314 134.869c-8.008 0-15.359-1.793-22.052-5.379-6.693-3.705-12.072-8.964-16.136-15.777-3.944-6.813-5.916-15.0598-5.916-24.7411 0-6.4542 1.136-12.6096 3.407-18.4662 2.27-5.9761 5.438-11.2949 9.502-15.9562 4.183-4.6614 9.083-8.3068 14.701-10.9363 5.737-2.7491 12.072-4.1236 19.004-4.1236 7.052 0 13.088 1.0757 18.108 3.2271 5.019 2.1514 8.844 4.9602 11.474 8.4264 2.749 3.4661 4.123 7.2311 4.123 11.2948 0 2.8686-.837 5.3785-2.51 7.5299-1.673 2.1515-4.064 3.2272-7.171 3.2272-3.466.1195-5.917-.8965-7.351-3.0479-1.434-2.2709-2.151-4.3625-2.151-6.2749 0-1.0757.179-2.2709.538-3.5857.358-1.4342 1.016-2.6892 1.972-3.7649-.956-2.51-2.51-4.3626-4.662-5.5578-2.151-1.1952-4.362-1.9721-6.633-2.3307s-4.183-.5379-5.737-.5379c-7.291.1196-13.446 3.2869-18.466 9.5021-4.901 6.0956-7.351 14.9403-7.351 26.5339 0 7.4104 1.076 14.0439 3.227 19.9008 2.271 5.856 5.558 10.518 9.861 13.984s9.442 5.259 15.418 5.378c5.379 0 10.578-1.374 15.598-4.123 5.02-2.869 9.083-6.454 12.191-10.757l5.737 5.02c-3.466 5.378-7.47 9.621-12.012 12.729-4.422 3.107-8.964 5.319-13.625 6.633-4.542 1.315-8.905 1.973-13.088 1.973z" })
          ] })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)("div", { className: "text-center mb-20 flex max-w-2xl flex-col items-center p-8 px-4 md:p-8 text-black bg-white rounded-lg border border-gray-200 shadow-md", children: [
        /* @__PURE__ */ (0, import_jsx_runtime34.jsx)("p", { className: "mb-5", children: "Sign in with GitHub to access your\xA0dashboard." }),
        /* @__PURE__ */ (0, import_jsx_runtime34.jsxs)(
          "a",
          {
            href: "/api/outstatic/login",
            onClick: () => setIsLoading(true),
            className: (0, import_clsx.default)(
              "mr-2 mb-2 inline-flex items-center rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90 focus:outline-none focus:ring-4 focus:ring-[#24292F]/50",
              isLoading && "animate-pulse"
            ),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
                "svg",
                {
                  className: "mr-2 -ml-1 h-4 w-4",
                  "aria-hidden": "true",
                  focusable: "false",
                  "data-prefix": "fab",
                  "data-icon": "github",
                  role: "img",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 496 512",
                  children: /* @__PURE__ */ (0, import_jsx_runtime34.jsx)(
                    "path",
                    {
                      fill: "currentColor",
                      d: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                    }
                  )
                }
              ),
              "Sign in with GitHub"
            ]
          }
        )
      ] })
    ] }) })
  ] }) });
}

// src/utils/collectionCommitInput.ts
var import_js_base642 = require("js-base64");
var collectionCommitInput = ({
  owner,
  oid,
  remove = false,
  repoSlug,
  repoBranch,
  contentPath,
  monorepoPath,
  collection
}) => {
  let fileChanges = {};
  const additions = [];
  const deletions = [];
  if (remove) {
    deletions.push({
      path: `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}`
    });
    fileChanges = __spreadProps(__spreadValues({}, fileChanges), { deletions });
  } else {
    additions.push({
      path: `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/${collection}/.gitkeep`,
      contents: (0, import_js_base642.encode)("")
    });
    fileChanges = { additions };
  }
  const headline = !remove ? `feat(content): create ${collection}` : `feat(content): remove ${collection}`;
  return {
    input: {
      branch: {
        repositoryNameWithOwner: `${owner}/${repoSlug}`,
        branchName: repoBranch
      },
      message: {
        headline
      },
      fileChanges,
      expectedHeadOid: oid
    }
  };
};

// src/client/pages/new-collection/index.tsx
var import_yup4 = require("@hookform/resolvers/yup");
var import_link5 = __toESM(require("next/link"));
var import_navigation8 = require("next/navigation");
var import_react38 = require("react");
var import_react_hook_form9 = require("react-hook-form");
var import_transliteration3 = require("transliteration");
var yup3 = __toESM(require("yup"));
var import_jsx_runtime35 = require("react/jsx-runtime");
function NewCollection() {
  const {
    pages,
    contentPath,
    monorepoPath,
    session,
    repoSlug,
    repoBranch,
    repoOwner,
    addPage,
    hasChanges,
    setHasChanges
  } = useOutstatic();
  const router = (0, import_navigation8.useRouter)();
  const [createCommit] = useCreateCommitMutation();
  const fetchOid = useOid_default();
  const [collectionName, setCollectionName] = (0, import_react38.useState)("");
  const pagesRegex = new RegExp(`^(?!${pages.join("$|")}$)`, "i");
  const createCollection = yup3.object().shape({
    name: yup3.string().matches(pagesRegex, `${collectionName} is already taken.`).required("Collection name is required.")
  });
  const [loading, setLoading] = (0, import_react38.useState)(false);
  const [error, setError] = (0, import_react38.useState)(false);
  const methods = (0, import_react_hook_form9.useForm)({
    resolver: (0, import_yup4.yupResolver)(createCollection)
  });
  const onSubmit = (_0) => __async(this, [_0], function* ({ name }) {
    var _a;
    setLoading(true);
    setHasChanges(false);
    try {
      const oid = yield fetchOid();
      const owner = repoOwner || ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.login) || "";
      const collection = (0, import_transliteration3.slugify)(name, { allowedChars: "a-zA-Z0-9" });
      const commitInput = collectionCommitInput({
        owner,
        oid,
        repoSlug,
        repoBranch,
        contentPath,
        monorepoPath,
        collection
      });
      const created = yield createCommit({ variables: commitInput });
      if (created) {
        addPage(collection);
        setLoading(false);
        router.push(`/outstatic/${collection}`);
      }
    } catch (error2) {
      setLoading(false);
      setHasChanges(false);
      setError(true);
      console.log({ error: error2 });
    }
  });
  (0, import_react38.useEffect)(() => {
    const subscription = methods.watch(() => setHasChanges(true));
    return () => subscription.unsubscribe();
  }, [methods]);
  return /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_react_hook_form9.FormProvider, __spreadProps(__spreadValues({}, methods), { children: /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(AdminLayout, { title: "New Collection", children: [
    /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("div", { className: "mb-8 flex h-12 items-center", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("h1", { className: "mr-12 text-2xl", children: "Create a Collection" }) }),
    error ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(Alert_default, { type: "error", children: [
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "font-medium", children: "Oops!" }),
      " We couldn't create your collection. Please, make sure your settings are correct by",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(import_link5.default, { href: "/outstatic/settings", children: /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "underline", children: "clicking here" }) }),
      " ",
      "."
    ] }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
      "form",
      {
        className: "max-w-5xl w-full flex mb-4 items-start",
        onSubmit: methods.handleSubmit(onSubmit),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
            Input_default,
            {
              label: "Collection Name",
              id: "name",
              inputSize: "medium",
              className: "w-full max-w-sm md:w-80",
              placeholder: "Ex: Posts",
              type: "text",
              helperText: "We suggest naming the collection in plural form, ex: Docs",
              registerOptions: {
                onChange: (e) => {
                  setCollectionName(e.target.value);
                },
                onBlur: (e) => {
                  methods.setValue("name", e.target.value);
                }
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
            "button",
            {
              type: "submit",
              disabled: loading || !hasChanges,
              className: "flex rounded-lg border border-gray-600 bg-gray-800 px-5 py-2 text-sm font-medium text-white hover:border-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-700 disabled:cursor-not-allowed disabled:bg-gray-600 ml-2 mt-7 mb-5",
              children: loading ? /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(import_jsx_runtime35.Fragment, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(
                  "svg",
                  {
                    className: "mr-3 -ml-1 h-5 w-5 animate-spin text-white",
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                        "circle",
                        {
                          className: "opacity-25",
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          strokeWidth: "4"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)(
                        "path",
                        {
                          className: "opacity-75",
                          fill: "currentColor",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }
                      )
                    ]
                  }
                ),
                "Saving"
              ] }) : "Save"
            }
          )
        ]
      }
    ),
    collectionName && /* @__PURE__ */ (0, import_jsx_runtime35.jsxs)(Alert_default, { type: "info", children: [
      "The collection will appear as",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime35.jsx)("span", { className: "font-semibold capitalize", children: collectionName }),
      " ",
      "on the sidebar."
    ] })
  ] }) }));
}

// src/utils/chunk.ts
var chunk = (arr, len) => {
  const chunks = [];
  const n = arr.length;
  let i = 0;
  while (i < n) {
    chunks.push(arr.slice(i, i += len));
  }
  return chunks;
};

// src/components/MetadataBuilder/index.tsx
var import_gray_matter4 = __toESM(require("gray-matter"));
var import_imurmurhash2 = __toESM(require("imurmurhash"));
var import_react39 = require("react");
var import_jsx_runtime36 = require("react/jsx-runtime");
var isIndexable = (s) => {
  return /\.md(x|oc)?$/.test(s);
};
var MetadataBuilder = (_a) => {
  var _b = _a, {
    rebuild,
    onComplete
  } = _b, rest = __objRest(_b, [
    "rebuild",
    "onComplete"
  ]);
  var _a2;
  const [total, setTotal] = (0, import_react39.useState)(0);
  const [processed, setProcessed] = (0, import_react39.useState)(0);
  const client = useApollo();
  const fetchOid = useOid_default();
  const [commit] = useCreateCommitMutation();
  const { repoOwner, repoSlug, repoBranch, contentPath, monorepoPath } = useOutstatic();
  const rootPath = [monorepoPath, contentPath].filter(Boolean).join("/");
  const { data } = useGetFileInformationQuery({
    variables: {
      owner: repoOwner,
      name: repoSlug,
      expression: `${repoBranch}:${rootPath}`
    },
    skip: !rebuild
  });
  const files = (0, import_react39.useMemo)(() => {
    var _a3, _b2, _c, _d, _e, _f;
    const o = JSON.parse(
      JSON.stringify((_b2 = (_a3 = data == null ? void 0 : data.repository) == null ? void 0 : _a3.object) != null ? _b2 : {})
    );
    const output = [];
    const queue = "entries" in o ? (_c = o.entries) != null ? _c : [] : [];
    while (queue.length > 0) {
      const next = queue.pop();
      if (((_d = next == null ? void 0 : next.object) == null ? void 0 : _d.__typename) === "Tree") {
        queue.push(...(_e = next.object.entries) != null ? _e : []);
      } else if (((_f = next == null ? void 0 : next.object) == null ? void 0 : _f.__typename) === "Blob" && isIndexable(next.path)) {
        output.push({
          path: next.path,
          oid: `${next.object.oid}`,
          commit: hashFromUrl(`${next.object.commitUrl}`)
        });
      }
    }
    return output;
  }, [data]);
  (0, import_react39.useEffect)(() => {
    const takeAndProcess = (o) => __async(void 0, null, function* () {
      var _a3, _b2, _c, _d, _e;
      const res = yield client.query({
        query: DocumentDocument,
        variables: {
          owner: repoOwner,
          name: repoSlug,
          filePath: `${repoBranch}:${o.path}`
        }
      });
      if (((_b2 = (_a3 = res.data.repository) == null ? void 0 : _a3.object) == null ? void 0 : _b2.__typename) === "Blob") {
        const m = (0, import_gray_matter4.default)((_c = res.data.repository.object.text) != null ? _c : "");
        const state = (0, import_imurmurhash2.default)((_d = res.data.repository.object.text) != null ? _d : "");
        const fmd = __spreadProps(__spreadValues({}, m.data), {
          slug: (_e = m.data.slug) != null ? _e : o.path.replace(/^.+\/(.+)\.(md|mdoc|mdx)?/, "$1"),
          __outstatic: {
            commit: o.commit,
            hash: `${state.result()}`,
            path: monorepoPath ? o.path.replace(monorepoPath, "") : o.path
          }
        });
        return fmd;
      }
      return void 0;
    });
    const fn = () => __async(void 0, null, function* () {
      var _a3, _b2;
      setTotal(Math.max(files.length, 1));
      const chunkSize = 5;
      const queue = chunk(files, chunkSize);
      const docs = [];
      const pendingOid = fetchOid();
      while (queue.length > 0) {
        const next = queue.pop();
        if (!next)
          continue;
        const all = Promise.allSettled(
          next.map((fd) => __async(void 0, null, function* () {
            const meta = yield takeAndProcess(fd);
            docs.push(__spreadProps(__spreadValues({}, meta), {
              collection: fd.path.replace(rootPath, "").replace(/^\/+/, "").replace(/\/.+$/, "")
              // strip all after 1st slash
            }));
            setProcessed((prev) => prev + 1);
          }))
        );
        yield all;
      }
      const oid = yield pendingOid;
      if (docs.length > 0 && oid) {
        const parentHash = hashFromUrl(
          ((_b2 = (_a3 = data == null ? void 0 : data.repository) == null ? void 0 : _a3.object) == null ? void 0 : _b2.__typename) === "Tree" ? data.repository.object.commitUrl : ""
        );
        const db = {
          commit: parentHash,
          generated: (/* @__PURE__ */ new Date()).toUTCString(),
          metadata: docs.filter(Boolean)
        };
        const capi = createCommitApi({
          message: "chore: Updates metadata DB",
          owner: repoOwner,
          name: repoSlug,
          branch: repoBranch,
          oid
        });
        capi.replaceFile(
          `${monorepoPath ? monorepoPath + "/" : ""}${contentPath}/metadata.json`,
          stringifyMetadata(db)
        );
        const payload = capi.createInput();
        try {
          yield commit({
            variables: {
              input: payload
            }
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
    fn().catch(console.error);
  }, [
    client,
    (_a2 = data == null ? void 0 : data.repository) == null ? void 0 : _a2.object,
    files,
    repoBranch,
    repoOwner,
    repoSlug,
    rootPath,
    fetchOid,
    contentPath,
    monorepoPath,
    commit
  ]);
  (0, import_react39.useEffect)(() => {
    if (processed === total && onComplete) {
      onComplete();
    }
  }, [onComplete, processed, total]);
  if (!rebuild) {
    return /* @__PURE__ */ (0, import_jsx_runtime36.jsx)("div", __spreadValues({}, rest));
  }
  return /* @__PURE__ */ (0, import_jsx_runtime36.jsxs)("div", __spreadProps(__spreadValues({}, rest), { children: [
    processed,
    "\xA0/\xA0",
    total
  ] }));
};

// src/client/pages/settings.tsx
var import_clsx2 = require("clsx");
var import_react40 = require("react");
var import_jsx_runtime37 = require("react/jsx-runtime");
function Settings2() {
  const [rebuild, setRebuilding] = (0, import_react40.useState)(false);
  const { repoSlug, repoBranch, contentPath } = useOutstatic();
  return /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)(AdminLayout, { title: "Settings", children: [
    /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("div", { className: "mb-8 flex h-12 items-center", children: /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h1", { className: "mr-12 text-2xl", children: "Settings" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "max-w-lg", children: [
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "mb-8 max-w-2xl p-8 px-4 md:p-8 text-black bg-white rounded-lg border border-gray-200 shadow-md prose prose-base", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h2", { children: "Metadata" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "flex flex-row items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            "button",
            {
              className: (0, import_clsx2.clsx)(
                "cursor-pointer rounded-lg border px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-gray-700 no-underline",
                "text-white",
                "border-gray-600 bg-gray-800",
                rebuild && "border-gray-400 bg-gray-500"
              ),
              onClick: () => setRebuilding(true),
              children: rebuild ? "Rebuilding..." : "Rebuild Metadata"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            MetadataBuilder,
            {
              className: "pl-2",
              rebuild,
              onComplete: () => setRebuilding(false)
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("p", { className: "text-sm", children: "If you've made changes outside of outstatic, or if you are seeing posts with incorrect metadata, you can rebuild your metadata and automatically deploy those changes to your site." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "mb-8 max-w-2xl p-8 px-4 md:p-8 text-black bg-white rounded-lg border border-gray-200 shadow-md prose prose-base", children: [
        /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("h2", { children: "Environment" }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { className: "block mb-2 text-sm font-medium text-gray-900", children: "Repository" }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            "input",
            {
              className: "cursor-not-allowed block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm outline-none",
              value: repoSlug,
              readOnly: true
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { className: "block mb-2 text-sm font-medium text-gray-900", children: "Branch" }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            "input",
            {
              className: "cursor-not-allowed block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm outline-none",
              value: repoBranch,
              readOnly: true
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)("label", { className: "block mb-2 text-sm font-medium text-gray-900", children: "Content Path" }),
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            "input",
            {
              className: "cursor-not-allowed block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm outline-none",
              value: `${contentPath}`,
              readOnly: true
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime37.jsxs)("p", { className: "text-sm", children: [
          "These values come from your Outstatic environment. To learn more about how to update these values,",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime37.jsx)(
            "a",
            {
              href: "https://outstatic.com/docs/environment-variables",
              target: "_blank",
              rel: "noreferrer",
              className: "underline font-semibold",
              children: "click here"
            }
          ),
          "."
        ] })
      ] })
    ] })
  ] });
}

// src/utils/envVarsCheck.ts
var initialEnvVars = {
  required: {
    OST_GITHUB_ID: false,
    OST_GITHUB_SECRET: false,
    OST_TOKEN_SECRET: false
  },
  optional: {
    OST_CONTENT_PATH: false,
    OST_REPO_OWNER: false
  }
};
var envVars = function() {
  const envVarsObj = {
    hasMissingEnvVars: false,
    envVars: {
      required: {},
      optional: {}
    }
  };
  if (process.env.OST_REPO_SLUG) {
    initialEnvVars.required.OST_REPO_SLUG = true;
  } else if (process.env.VERCEL_GIT_REPO_SLUG) {
    initialEnvVars.required.VERCEL_GIT_REPO_SLUG = true;
  } else {
    initialEnvVars.required.OST_REPO_SLUG = false;
  }
  Object.entries(initialEnvVars.required).forEach(([key]) => {
    envVarsObj.envVars.required[key] = !!process.env[key];
    if (!process.env[key]) {
      envVarsObj.hasMissingEnvVars = true;
    }
  });
  Object.entries(initialEnvVars.optional).forEach(([key]) => {
    envVarsObj.envVars.optional[key] = !!process.env[key];
  });
  return envVarsObj;
}();

// src/client/pages/welcome.tsx
var import_jsx_runtime38 = require("react/jsx-runtime");
function Welcome({ variables }) {
  return /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(import_jsx_runtime38.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { id: "outstatic", children: [
    /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("div", { className: "absolute bottom-10 w-full left-0 overflow-hidden z-0 md:-top-10 bg-white", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
      "svg",
      {
        width: "100%",
        height: "100%",
        viewBox: "0 0 1200 365",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
          "path",
          {
            d: "M-276.32 159.182C-232.477 130.613 -193.037 95.4797 -149.142 66.8773C-123.398 50.1026 -99.0091 30.5473 -69.5694 19.7442C-38.5686 8.36831 -2.85928 -3.31376 37.4064 4.54405C65.5725 10.0406 93.927 20.2194 125.473 43.3305C150.292 61.5127 166.609 84.5943 185.936 114.255C220.569 167.405 225.81 223.228 224.615 265.934C223.2 316.536 198.5 341.652 158.621 340.382C121.027 339.185 71.9868 320.328 45.0005 250.638C8.63388 156.723 111.095 159.937 149.344 159.325C235.509 157.945 334.997 185.056 433.145 218.102C547.034 256.448 651.041 336.753 780 356C940 384.5 1235.5 330.311 1237.95 70.5232",
            stroke: "#1E293B",
            className: "stroke-2 md:stroke-1",
            strokeLinecap: "round"
          }
        )
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("main", { className: "relative flex h-screen flex-col items-center justify-center z-10 p-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("h1", { className: "mb-8 text-center text-xl font-semibold text-white", children: /* @__PURE__ */ (0, import_jsx_runtime38.jsx)(
        "svg",
        {
          fill: "none",
          height: "32",
          viewBox: "0 0 775 135",
          width: "200",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-label": "Outstatic",
          children: /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("g", { fill: "#1e293b", children: [
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m63.9963 134.869c-11.3546 0-21.0957-1.913-29.2232-5.738-8.008-3.824-14.522-8.904-19.5419-15.239-5.02-6.454-8.72517-13.565-11.11562-21.3344-2.39045-7.769-3.585673-15.5379-3.585673-23.3069 0-7.5299 1.254983-15.1196 3.764953-22.769 2.62949-7.769 6.51394-14.8805 11.65344-21.3347 5.259-6.4543 11.773-11.6535 19.5419-15.59772 7.8885-3.94424 17.0917-5.91636 27.6097-5.91636 10.996 0 20.4383 1.97212 28.3268 5.91636 8.008 3.94422 14.5813 9.20322 19.7213 15.77692 5.139 6.4542 8.964 13.5061 11.474 21.1555 2.63 7.6494 3.944 15.2391 3.944 22.769 0 7.4104-1.314 15.0001-3.944 22.769-2.51 7.6495-6.394 14.7613-11.653 21.3343-5.14 6.455-11.5941 11.654-19.363 15.598-7.769 3.944-16.9722 5.917-27.6097 5.917zm.8964-9.323c6.9323 0 12.9084-1.554 17.9284-4.662 5.1394-3.107 9.3227-7.231 12.5498-12.37 3.3467-5.259 5.7971-10.9962 7.3511-17.2114 1.553-6.3347 2.33-12.6096 2.33-18.8248 0-7.6494-.896-15-2.689-22.0519-1.793-7.1713-4.5419-13.5658-8.2471-19.1833-3.5856-5.7371-8.0677-10.2192-13.4462-13.4463-5.3785-3.3466-11.5937-5.0199-18.6455-5.0199-6.9323 0-12.9682 1.6135-18.1077 4.8406-5.1394 3.2271-9.3227 7.4702-12.5498 12.7292-3.2271 5.1394-5.6773 10.8765-7.3506 17.2112-1.5538 6.2152-2.3307 12.4901-2.3307 18.8248 0 6.2151.8366 12.7889 2.5099 19.7212 1.6734 6.9323 4.2431 13.3865 7.7092 19.3626 3.4662 5.976 7.8885 10.817 13.267 14.522 5.4981 3.705 12.0718 5.558 19.7212 5.558z" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m179.299 134.869c-6.693 0-12.251-1.255-16.673-3.765-4.303-2.51-7.53-6.634-9.681-12.371-2.152-5.857-3.227-13.566-3.227-23.1276v-28.1475c0-2.0319 0-4.1235 0-6.2749.119-2.271.358-4.4821.717-6.6335-2.032.1195-4.183.239-6.454.3585-2.271 0-4.303.0598-6.096.1793v-9.502h4.303c5.976 0 10.458-.5379 13.446-1.6136s5.08-2.2111 6.275-3.4064h6.813v54.6815c0 9.4422 1.314 16.4942 3.944 21.1552 2.629 4.662 7.052 6.933 13.267 6.813 4.064 0 7.948-1.195 11.653-3.586 3.825-2.39 6.933-5.199 9.323-8.426v-42.4901c0-2.6295.06-5.0797.179-7.3507.12-2.3904.359-4.6613.718-6.8127-2.152.1195-4.363.239-6.634.3585-2.271 0-4.363.0598-6.275.1793v-9.502h5.199c5.259 0 9.383-.5379 12.371-1.6136s5.139-2.2111 6.454-3.4064h6.813l-.179 65.9767c0 1.912-.06 4.542-.18 7.888-.119 3.227-.298 6.096-.538 8.606 2.032-.12 4.124-.239 6.275-.359 2.271-.119 4.363-.179 6.275-.179v9.502h-28.506c-.239-1.912-.478-3.705-.717-5.379-.119-1.673-.299-3.286-.538-4.84-3.705 3.466-8.008 6.514-12.908 9.143-4.901 2.63-10.04 3.945-15.419 3.945z" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m283.918 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.426-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.435-4.422-2.152-10.279-2.152-17.57l.359-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.86-3.5857 3.347-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.427v25.0997h27.609v9.3227l-27.609.3586-.359 47.8687c0 4.5418.359 8.5458 1.076 12.0118.837 3.347 2.151 5.976 3.944 7.889 1.913 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.427-2.51 2.988-1.673 5.796-4.422 8.426-8.247l6.096 5.378c-2.869 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.618 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.152.358-3.885.538-5.2.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m358.946 134.869c-5.618 0-10.817-.777-15.598-2.331-4.781-1.434-8.605-3.168-11.474-5.199l.538 5.916h-9.502l-.897-30.837h7.53c.239 4.423 1.614 8.427 4.124 12.012 2.51 3.586 5.737 6.395 9.681 8.427 4.064 2.031 8.426 3.047 13.088 3.047 2.749 0 5.438-.418 8.068-1.255 2.629-.956 4.84-2.33 6.633-4.123 1.793-1.913 2.689-4.243 2.689-6.992 0-2.988-.956-5.439-2.868-7.351-1.793-2.032-4.303-3.825-7.53-5.378-3.108-1.5542-6.693-3.108-10.757-4.6618-3.586-1.4342-7.231-2.9282-10.936-4.482-3.586-1.5538-6.933-3.4064-10.04-5.5578-3.108-2.1514-5.558-4.7809-7.351-7.8885-1.793-3.2271-2.689-7.1714-2.689-11.8327 0-2.749.538-5.6773 1.613-8.7849 1.076-3.2271 2.809-6.1554 5.2-8.7849 2.39-2.749 5.617-4.9602 9.681-6.6335 4.064-1.7928 9.084-2.6893 15.06-2.6893 3.227 0 6.812.5379 10.757 1.6136 4.063 1.0757 7.828 2.9283 11.295 5.5578l-.18-6.2749h9.502v31.5539h-7.709c-.358-4.1833-1.494-8.0678-3.406-11.6535-1.793-3.5856-4.363-6.5139-7.709-8.7849-3.347-2.2709-7.411-3.4064-12.192-3.4064-4.661 0-8.486 1.1953-11.474 3.5857-2.868 2.2709-4.303 5.1395-4.303 8.6056 0 3.4662 1.076 6.275 3.227 8.4264 2.271 2.1514 5.2 4.004 8.785 5.5578 3.586 1.5537 7.47 3.1075 11.654 4.6613 5.02 2.0319 9.741 4.2431 14.163 6.6335 4.422 2.3905 8.008 5.3785 10.757 8.9642s4.124 8.1273 4.124 13.6253c0 5.976-1.554 10.996-4.662 15.06-2.988 3.944-6.872 6.873-11.653 8.785s-9.861 2.869-15.239 2.869z" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m439.216 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.427-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.434-4.422-2.151-10.279-2.151-17.57l.358-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.861-3.5857 3.346-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.426v25.0997h27.61v9.3227l-27.61.3586-.358 47.8687c0 4.5418.358 8.5458 1.075 12.0118.837 3.347 2.152 5.976 3.945 7.889 1.912 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.426-2.51 2.988-1.673 5.797-4.422 8.426-8.247l6.096 5.378c-2.869 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.617 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.151.358-3.884.538-5.199.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m528.944 132c-.239-1.912-.418-3.586-.537-5.02-.12-1.434-.299-2.928-.538-4.482-4.064 4.064-8.427 7.171-13.088 9.323-4.661 2.032-9.502 3.048-14.522 3.048-8.606 0-15.119-2.092-19.542-6.275-4.303-4.303-6.454-9.622-6.454-15.957 0-5.498 1.614-10.279 4.841-14.3423 3.227-4.0638 7.47-7.3507 12.729-9.8606 5.259-2.6295 10.996-4.5419 17.211-5.7371 6.215-1.3148 12.311-1.9721 18.287-1.9721v-10.5778c0-3.8247-.359-7.3506-1.076-10.5777-.717-3.3466-2.211-6.0359-4.482-8.0678-2.151-2.1514-5.558-3.2271-10.219-3.2271-3.108-.1195-6.215.4781-9.323 1.7929-3.107 1.1952-5.498 3.2271-7.171 6.0956.956.9562 1.554 2.0917 1.793 3.4064.358 1.1952.538 2.3307.538 3.4064 0 1.6733-.718 3.5857-2.152 5.7371-1.434 2.0318-3.884 2.988-7.35 2.8685-2.869 0-5.08-.9562-6.634-2.8685-1.434-2.0319-2.151-4.3626-2.151-6.9921 0-4.3028 1.553-8.1275 4.661-11.4741 3.227-3.3467 7.59-5.9762 13.088-7.8885 5.498-1.9124 11.653-2.8686 18.466-2.8686 10.279 0 17.928 2.6893 22.948 8.0678 5.14 5.3785 7.709 13.8646 7.709 25.4583v12.3705c0 3.9443-.059 7.8885-.179 11.8328v12.55c0 1.793-.06 3.825-.179 6.095-.12 2.271-.299 4.662-.538 7.172 2.032-.12 4.124-.239 6.275-.359 2.151-.119 4.183-.179 6.096-.179v9.502zm-1.613-43.0281c-3.825.2391-7.769.7769-11.833 1.6136-3.944.8366-7.53 2.0916-10.757 3.7649s-5.856 3.8247-7.888 6.4546c-1.913 2.629-2.869 5.796-2.869 9.502.239 4.063 1.554 7.051 3.944 8.964 2.51 1.912 5.439 2.868 8.785 2.868 4.184 0 7.889-.777 11.116-2.33 3.227-1.674 6.394-3.945 9.502-6.813-.12-1.315-.179-2.63-.179-3.944 0-1.435 0-2.929 0-4.482 0-1.076 0-3.048 0-5.9168.119-2.988.179-6.2151.179-9.6813z" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m602.217 134.869c-2.988 0-5.976-.419-8.964-1.255-2.988-.718-5.797-2.212-8.427-4.483-2.51-2.39-4.482-5.796-5.916-10.219-1.434-4.422-2.151-10.279-2.151-17.57l.358-48.9439h-13.267v-10.0399c3.227-.1196 6.514-1.3148 9.861-3.5857 3.346-2.2709 6.275-5.3187 8.785-9.1435 2.51-3.8247 4.243-7.9482 5.199-12.3705h8.426v25.0997h27.61v9.3227l-27.61.3586-.358 47.8687c0 4.5418.358 8.5458 1.075 12.0118.837 3.347 2.152 5.976 3.945 7.889 1.912 1.793 4.482 2.689 7.709 2.689 2.749 0 5.558-.837 8.426-2.51 2.988-1.673 5.797-4.422 8.426-8.247l6.096 5.378c-2.868 4.184-5.737 7.471-8.606 9.861-2.868 2.39-5.617 4.124-8.247 5.199-2.629 1.195-5.02 1.913-7.171 2.152-2.151.358-3.884.538-5.199.538z" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m639.057 124.47c3.585 0 6.095-.837 7.53-2.51 1.434-1.673 2.271-4.004 2.51-6.992.358-2.988.538-6.454.538-10.398v-37.1121c0-2.0319.059-4.0638.179-6.0957.119-2.1514.299-4.4223.538-6.8127-2.032.1195-4.184.239-6.455.3585-2.27 0-4.362.0598-6.275.1793v-9.502c5.379 0 9.622-.2391 12.73-.7172 3.227-.5976 5.677-1.2549 7.35-1.9721 1.793-.7171 3.108-1.494 3.945-2.3307h6.812v69.2037c0 2.151-.059 4.362-.179 6.633-.119 2.152-.299 4.363-.538 6.634 1.913-.12 3.825-.179 5.737-.179 2.032-.12 3.885-.24 5.558-.359v9.502h-39.98zm19.183-100.3988c-3.107 0-5.737-1.1354-7.888-3.4063-2.152-2.3905-3.227-5.259-3.227-8.6057 0-3.34658 1.135-6.15536 3.406-8.42628 2.271-2.39045 4.841-3.5856788 7.709-3.5856788 3.108 0 5.677 1.1952288 7.709 3.5856788 2.152 2.27092 3.227 5.0797 3.227 8.42628 0 3.3467-1.075 6.2152-3.227 8.6057-2.032 2.2709-4.601 3.4063-7.709 3.4063z" }),
            /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("path", { d: "m735.314 134.869c-8.008 0-15.359-1.793-22.052-5.379-6.693-3.705-12.072-8.964-16.136-15.777-3.944-6.813-5.916-15.0598-5.916-24.7411 0-6.4542 1.136-12.6096 3.407-18.4662 2.27-5.9761 5.438-11.2949 9.502-15.9562 4.183-4.6614 9.083-8.3068 14.701-10.9363 5.737-2.7491 12.072-4.1236 19.004-4.1236 7.052 0 13.088 1.0757 18.108 3.2271 5.019 2.1514 8.844 4.9602 11.474 8.4264 2.749 3.4661 4.123 7.2311 4.123 11.2948 0 2.8686-.837 5.3785-2.51 7.5299-1.673 2.1515-4.064 3.2272-7.171 3.2272-3.466.1195-5.917-.8965-7.351-3.0479-1.434-2.2709-2.151-4.3625-2.151-6.2749 0-1.0757.179-2.2709.538-3.5857.358-1.4342 1.016-2.6892 1.972-3.7649-.956-2.51-2.51-4.3626-4.662-5.5578-2.151-1.1952-4.362-1.9721-6.633-2.3307s-4.183-.5379-5.737-.5379c-7.291.1196-13.446 3.2869-18.466 9.5021-4.901 6.0956-7.351 14.9403-7.351 26.5339 0 7.4104 1.076 14.0439 3.227 19.9008 2.271 5.856 5.558 10.518 9.861 13.984s9.442 5.259 15.418 5.378c5.379 0 10.578-1.374 15.598-4.123 5.02-2.869 9.083-6.454 12.191-10.757l5.737 5.02c-3.466 5.378-7.47 9.621-12.012 12.729-4.422 3.107-8.964 5.319-13.625 6.633-4.542 1.315-8.905 1.973-13.088 1.973z" })
          ] })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("div", { className: "mb-20 max-w-2xl p-8 px-4 md:p-8 text-black bg-white rounded-lg border border-gray-200 shadow-md", children: [
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("p", { className: "mb-5", children: "Before you can access your admin area, make sure the following environment variables are set up:" }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("ul", { className: "mb-5", children: Object.entries(variables.required).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("li", { className: "mb-1", children: [
          `${value ? "\u2705" : "\u274C"} Variable`,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "font-semibold", children: key }),
          " ",
          `is ${value ? "set." : "missing!"}`
        ] }, key)) }),
        !variables.optional.OST_CONTENT_PATH && /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("p", { className: "mb-5 p-2 bg-blue-100 rounded", children: [
          "Optional variable",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "font-semibold", children: "OST_CONTENT_PATH" }),
          " defines where your content is saved.",
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("br", {}),
          "Defaulting to ",
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("code", { children: "outstatic/content" })
        ] }),
        !variables.optional.OST_REPO_OWNER && /* @__PURE__ */ (0, import_jsx_runtime38.jsxs)("p", { className: "mb-5 p-2 bg-blue-100 rounded", children: [
          "Optional variable",
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("span", { className: "font-semibold", children: "OST_REPO_OWNER" }),
          " is not set.",
          /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("br", {}),
          "Defaulting to your GitHub username."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime38.jsx)("p", { children: "You may need to restart Next.js to apply the changes." })
      ] })
    ] })
  ] }) });
}

// src/client/pages/index.tsx
var import_jsx_runtime39 = require("react/jsx-runtime");
var defaultPages = {
  settings: /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(Settings2, {}),
  collections: void 0
};
var OstClient = ({ ostData, params }) => {
  var _a, _b;
  const [pages, setPages] = (0, import_react41.useState)((ostData == null ? void 0 : ostData.pages) || []);
  const [collections, setCollections] = (0, import_react41.useState)((ostData == null ? void 0 : ostData.collections) || []);
  const client = useApollo(ostData == null ? void 0 : ostData.initialApolloState);
  const [hasChanges, setHasChanges] = (0, import_react41.useState)(false);
  (0, import_react41.useEffect)(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);
  if (ostData.missingEnvVars) {
    return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(Welcome, { variables: ostData.missingEnvVars });
  }
  const addPage = (page) => {
    if (pages.includes(page))
      return;
    if (collections.includes(page))
      return;
    setPages([...pages, page]);
    setCollections([...collections, page]);
  };
  const removePage = (page) => {
    setPages(pages.filter((p) => p !== page));
    setCollections(collections.filter((p) => p !== page));
    console.log("removePage", page);
  };
  const { session } = ostData;
  if (!session) {
    return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(Login, {});
  }
  const slug = ((_a = params == null ? void 0 : params.ost) == null ? void 0 : _a[0]) || "";
  const slug2 = ((_b = params == null ? void 0 : params.ost) == null ? void 0 : _b[1]) || "";
  if (slug && !pages.includes(slug)) {
    return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(FourOhFour, {});
  }
  const isContent = slug && collections.includes(slug);
  return /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(
    OutstaticProvider,
    __spreadProps(__spreadValues({}, ostData), {
      pages,
      collections,
      addPage,
      removePage,
      hasChanges,
      setHasChanges,
      children: /* @__PURE__ */ (0, import_jsx_runtime39.jsxs)(import_client3.ApolloProvider, { client, children: [
        !slug && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(Collections, {}),
        slug2 && isContent && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(EditDocument, { collection: slug }),
        !slug2 && isContent ? /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(List2, { collection: slug }) : defaultPages[slug],
        slug === "collections" && collections.includes(slug2) && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(AddCustomField, { collection: slug2 }) || !!slug2 && !isContent && /* @__PURE__ */ (0, import_jsx_runtime39.jsx)(NewCollection, {})
      ] })
    })
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OstClient
});
