"use strict";
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
  return new Promise((resolve, reject) => {
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
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  Outstatic: () => Outstatic,
  OutstaticApi: () => OutstaticApi,
  customFieldData: () => customFieldData,
  customFieldTypes: () => customFieldTypes,
  defaultPages: () => defaultPages,
  isArrayCustomField: () => isArrayCustomField
});
module.exports = __toCommonJS(src_exports);

// src/graphql/generated/index.ts
var import_client = require("@apollo/client");
var Apollo = __toESM(require("@apollo/client"));
var TreeDetailsFragmentDoc = import_client.gql`
  fragment TreeDetails on TreeEntry {
    path
    type
  }
`;
var BlobDetailsFragmentDoc = import_client.gql`
  fragment BlobDetails on Blob {
    oid
    commitUrl
  }
`;
var RecursiveTreeDetailsFragmentDoc = import_client.gql`
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
var CreateCommitDocument = import_client.gql`
  mutation createCommit($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      commit {
        oid
      }
    }
  }
`;
var CollectionsDocument = import_client.gql`
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
var DocumentDocument = import_client.gql`
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
var DocumentsDocument = import_client.gql`
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
var GetFileInformationDocument = import_client.gql`
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
var OidDocument = import_client.gql`
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

// src/utils/apollo.ts
var import_client2 = require("@apollo/client");
var import_context = require("@apollo/client/link/context");
var import_cross_fetch = __toESM(require("cross-fetch"));
var import_react = require("react");
var apolloClient;
var apolloCache = new import_client2.InMemoryCache({
  typePolicies: {}
});
function getSession() {
  return __async(this, null, function* () {
    const response = yield (0, import_cross_fetch.default)("/api/outstatic/user");
    return response.json();
  });
}
function createApolloClient(session) {
  const httpLink = (0, import_client2.createHttpLink)({
    uri: "https://api.github.com/graphql",
    // Prefer explicit `window.fetch` when available so that outgoing requests
    // are captured and deferred until the Service Worker is ready. If no window
    // or window.fetch, default to cross-fetch's ponyfill
    fetch: (...args) => (typeof window !== "undefined" && typeof window.fetch === "function" ? window.fetch : import_cross_fetch.default)(...args)
  });
  const authLink = (0, import_context.setContext)((_0, _1) => __async(this, [_0, _1], function* (_, { headers }) {
    var _a2;
    const data = session ? { session } : yield getSession();
    const modifiedHeader = {
      headers: __spreadProps(__spreadValues({}, headers), {
        authorization: ((_a2 = data.session) == null ? void 0 : _a2.access_token) ? `Bearer ${data.session.access_token}` : ""
      })
    };
    return modifiedHeader;
  }));
  return new import_client2.ApolloClient({
    ssrMode: typeof window === "undefined",
    link: (0, import_client2.from)([authLink, httpLink]),
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

// src/utils/auth/auth.ts
var Iron = __toESM(require("@hapi/iron"));
var import_headers2 = require("next/headers");

// src/utils/auth/auth-cookies.ts
var import_cookie = require("cookie");
var import_headers = require("next/headers");
var TOKEN_NAME = "ost_token";
var MAX_AGE = 60 * 60 * 8;
function setTokenCookie(token) {
  (0, import_headers.cookies)().set(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1e3),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax"
  });
}

// src/utils/auth/auth.ts
var _a;
var TOKEN_SECRET = (_a = process.env.OST_TOKEN_SECRET) != null ? _a : "";
function setLoginSession(session) {
  return __async(this, null, function* () {
    const obj = __spreadValues({}, session);
    const token = yield Iron.seal(obj, TOKEN_SECRET, Iron.defaults);
    setTokenCookie(token);
  });
}
function getLoginSession() {
  return __async(this, null, function* () {
    var _a2;
    const cookieStore = (0, import_headers2.cookies)();
    const token = (_a2 = cookieStore.get("ost_token")) == null ? void 0 : _a2.value;
    if (!token)
      return null;
    try {
      const session = yield Iron.unseal(token, TOKEN_SECRET, Iron.defaults);
      const expires = session.expires + MAX_AGE * 1e3;
      if (Date.now() > expires) {
        throw new Error("Session expired");
      }
      return session;
    } catch (e) {
      return null;
    }
  });
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

// src/app/index.tsx
var defaultPages = ["settings", "collections"];
function Outstatic() {
  return __async(this, null, function* () {
    var _a2, _b, _c, _d;
    if (envVars.hasMissingEnvVars) {
      return {
        missingEnvVars: envVars.envVars
      };
    }
    const session = yield getLoginSession();
    const apolloClient2 = session ? initializeApollo(null, session) : null;
    let collections = [];
    if (apolloClient2) {
      try {
        const { data: documentQueryData } = yield apolloClient2.query({
          query: CollectionsDocument,
          variables: {
            name: process.env.OST_REPO_SLUG || process.env.VERCEL_GIT_REPO_SLUG || "",
            contentPath: `${process.env.OST_REPO_BRANCH || "main"}:${process.env.OST_MONOREPO_PATH ? process.env.OST_MONOREPO_PATH + "/" : ""}${process.env.OST_CONTENT_PATH || "outstatic/content"}`,
            owner: process.env.OST_REPO_OWNER || ((_a2 = session == null ? void 0 : session.user) == null ? void 0 : _a2.login) || ""
          },
          fetchPolicy: "no-cache"
        });
        const documentQueryObject = (_b = documentQueryData == null ? void 0 : documentQueryData.repository) == null ? void 0 : _b.object;
        if ((documentQueryObject == null ? void 0 : documentQueryObject.__typename) === "Tree") {
          collections = (_c = documentQueryObject == null ? void 0 : documentQueryObject.entries) == null ? void 0 : _c.map((entry) => entry.type === "tree" ? entry.name : void 0).filter(Boolean);
        }
      } catch (error) {
        console.log({ error });
      }
    }
    return {
      repoOwner: process.env.OST_REPO_OWNER || ((_d = session == null ? void 0 : session.user) == null ? void 0 : _d.login) || "",
      repoSlug: process.env.OST_REPO_SLUG || process.env.VERCEL_GIT_REPO_SLUG || "",
      repoBranch: process.env.OST_REPO_BRANCH || "main",
      contentPath: process.env.OST_CONTENT_PATH || "outstatic/content",
      monorepoPath: process.env.OST_MONOREPO_PATH || "",
      session: session || null,
      initialApolloState: null,
      collections,
      pages: [...defaultPages, ...collections],
      missingEnvVars: false,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY
    };
  });
}

// src/app/api/auth/callback.ts
var import_next_connect = require("next-connect");
var import_next_session = __toESM(require("next-session"));
var import_server = require("next/server");
var router = (0, import_next_connect.createEdgeRouter)();
var getSession2 = (0, import_next_session.default)();
function GET(request) {
  return __async(this, null, function* () {
    return router.run(request, { params: { id: "1" } });
  });
}
function getAccessToken(code) {
  return __async(this, null, function* () {
    const request = yield fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.OST_GITHUB_ID,
        client_secret: process.env.OST_GITHUB_SECRET,
        code
      })
    });
    const text = yield request.text();
    const params = new URLSearchParams(text);
    return params.get("access_token");
  });
}
function fetchGitHubUser(token) {
  return __async(this, null, function* () {
    const request = yield fetch("https://api.github.com/user", {
      headers: {
        Authorization: "token " + token
      }
    });
    return yield request.json();
  });
}
function checkRepository(token, userName) {
  return __async(this, null, function* () {
    const repoOwner = process.env.OST_REPO_OWNER || userName;
    const repoSlug = process.env.OST_REPO_SLUG || process.env.VERCEL_GIT_REPO_SLUG || "";
    const response = yield fetch(
      `https://api.github.com/repos/${repoOwner}/${repoSlug}`,
      {
        headers: {
          Authorization: `token ${token}`
        }
      }
    );
    if (response.status === 200)
      return true;
    else
      return false;
  });
}
function checkCollaborator(token, userName) {
  return __async(this, null, function* () {
    const repoSlug = process.env.OST_REPO_SLUG || process.env.VERCEL_GIT_REPO_SLUG || "";
    if (process.env.OST_REPO_OWNER) {
      const response = yield fetch(
        `https://api.github.com/repos/${process.env.OST_REPO_OWNER}/${repoSlug}/collaborators/${userName}`,
        {
          headers: {
            Authorization: `token ${token}`
          }
        }
      );
      if (response.status !== 204)
        return false;
    }
    return true;
  });
}
router.use((req, res, next) => __async(void 0, null, function* () {
  yield getSession2(req, res);
  const response = yield next();
  if (response) {
    const url = req.nextUrl.clone();
    url.pathname = "/outstatic";
    url.search = "";
    if (response.status !== 200) {
      const data = yield response.json();
      url.searchParams.set("error", data.error);
    }
    return import_server.NextResponse.redirect(url);
  }
})).get((req) => __async(void 0, null, function* () {
  var _a2, _b;
  const error = (_a2 = req == null ? void 0 : req.nextUrl.searchParams) == null ? void 0 : _a2.get("error");
  if (error) {
    return import_server.NextResponse.json({ error }, { status: 403 });
  }
  const code = (_b = req == null ? void 0 : req.nextUrl.searchParams) == null ? void 0 : _b.get("code");
  const access_token = yield getAccessToken(code);
  req.session.token = access_token;
  const userData = yield fetchGitHubUser(access_token || "");
  const checks = Promise.all([
    checkRepository(req.session.token, userData.login),
    checkCollaborator(req.session.token, userData.login)
  ]);
  const [repoExists, isCollaborator] = yield checks;
  if (!repoExists) {
    return import_server.NextResponse.json(
      { error: "repository-not-found" },
      { status: 404, statusText: "Repository not found" }
    );
  }
  if (!isCollaborator) {
    return import_server.NextResponse.json(
      { error: "not-collaborator" },
      { status: 403, statusText: "Forbidden" }
    );
  }
  if (!userData.email) {
    const emails = yield (yield fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${access_token}`
      }
    })).json();
    if ((emails === null || emails === void 0 ? void 0 : emails.length) > 0) {
      var _emails$find;
      userData.email = (_emails$find = emails.find(
        (email) => email.primary
      )) === null || _emails$find === void 0 ? void 0 : _emails$find.email;
      if (!userData.email)
        userData.email = emails[0].email;
    }
  }
  if (userData && access_token) {
    const { name, login, email, avatar_url } = userData;
    yield setLoginSession({
      user: { name, login, email, image: avatar_url },
      access_token,
      expires: new Date(Date.now() + MAX_AGE * 1e3)
    });
    return new import_server.NextResponse("ok", { status: 200 });
  } else {
    return import_server.NextResponse.json({ error: "something" }, { status: 403 });
  }
}));

// src/app/api/auth/login.ts
var import_navigation = require("next/navigation");
function GET2() {
  return __async(this, null, function* () {
    var _a2, _b;
    const scopes = ["read:user", "user:email", "repo"];
    const url = new URL("https://github.com/login/oauth/authorize");
    url.searchParams.append("client_id", (_a2 = process.env.OST_GITHUB_ID) != null ? _a2 : "");
    url.searchParams.append("scope", scopes.join(","));
    url.searchParams.append("response_type", "code");
    if ((_b = process.env) == null ? void 0 : _b.OST_GITHUB_CALLBACK_URL) {
      url.searchParams.append("redirect_uri", process.env.OST_GITHUB_CALLBACK_URL);
    }
    (0, import_navigation.redirect)(url.toString());
  });
}

// src/app/api/auth/signout.ts
var import_headers3 = require("next/headers");
var import_server2 = require("next/server");
function GET3(req) {
  return __async(this, null, function* () {
    (0, import_headers3.cookies)().set(TOKEN_NAME, "", {
      maxAge: -1,
      path: "/"
    });
    const homeUrl = new URL("/", req.url);
    return import_server2.NextResponse.redirect(homeUrl);
  });
}

// src/app/api/auth/user.ts
var import_server3 = require("next/server");
function user() {
  return __async(this, null, function* () {
    try {
      const session = yield getLoginSession();
      return import_server3.NextResponse.json({ session });
    } catch (error) {
      return import_server3.NextResponse.json({ error });
    }
  });
}

// src/app/api/generate/index.tsx
var import_ai = require("ai");
var import_openai = __toESM(require("openai"));
var openai = new import_openai.default({
  apiKey: process.env.OPENAI_API_KEY || ""
});
function POST(req) {
  return __async(this, null, function* () {
    const session = yield getLoginSession();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    let { prompt } = yield req.json();
    const response = yield openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI writing assistant that autocompletes existing text based on context from prior text. Give more weight/priority to the later characters than the beginning ones.Limit your response to no more than 200 characters, but make sure to construct complete sentences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1
    });
    const stream = (0, import_ai.OpenAIStream)(response);
    return new import_ai.StreamingTextResponse(stream);
  });
}

// src/utils/constants.ts
var IMAGES_PATH = "images/";

// src/app/api/images/index.ts
var REPO_SLUG = process.env.OST_REPO_SLUG || process.env.VERCEL_GIT_REPO_SLUG;
var REPO_BRANCH = process.env.OST_REPO_BRANCH || "main";
var MONOREPO_PATH = process.env.OST_MONOREPO_PATH;
function GET4(req, res) {
  return __async(this, null, function* () {
    var _a2;
    const session = yield getLoginSession();
    const REPO_OWNER = process.env.OST_REPO_OWNER || ((_a2 = session == null ? void 0 : session.user) == null ? void 0 : _a2.login);
    if (session == null ? void 0 : session.access_token) {
      const response = yield fetch(
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_SLUG}/${REPO_BRANCH}/${MONOREPO_PATH ? MONOREPO_PATH + "/" : ""}public/${IMAGES_PATH}${req.nextUrl.pathname.split("/").pop()}`,
        {
          headers: {
            authorization: `token ${session.access_token}`
          }
        }
      );
      if (response.status === 200 && response.body) {
        const contentType = response.headers.get("Content-Type");
        const content = contentType === "image/svg+xml" ? yield response.blob() : Buffer.from(yield response.arrayBuffer());
        const newHeaders = new Headers(req.headers);
        newHeaders.set("Cache-Control", "max-age=300");
        return new Response(content, {
          status: 200,
          headers: { "Cache-Control": "max-age=300" }
        });
      }
      return new Response(response.statusText, {
        status: response.status
      });
    } else {
      return new Response("Unauthorized", {
        status: 401
      });
    }
  });
}

// src/app/api/index.tsx
var getPaths = {
  callback: GET,
  login: GET2,
  signout: GET3,
  user,
  images: GET4
};
var postPaths = {
  generate: POST
};
var OutstaticApi = {
  GET: (_0, _1) => __async(void 0, [_0, _1], function* (req, { params }) {
    const { ost } = params;
    const rsp = getPaths[ost[0]](req);
    return rsp;
  }),
  POST: (_0, _1) => __async(void 0, [_0, _1], function* (req, { params }) {
    const { ost } = params;
    const rsp = postPaths[ost[0]](req);
    return rsp;
  })
};

// src/types/index.ts
var customFieldTypes = ["String", "Text", "Number", "Tags"];
var customFieldData = ["string", "number", "array"];
function isArrayCustomField(obj) {
  return obj && obj.dataType === "array" && Array.isArray(obj.values);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Outstatic,
  OutstaticApi,
  customFieldData,
  customFieldTypes,
  defaultPages,
  isArrayCustomField
});
