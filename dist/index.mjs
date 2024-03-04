import {
  CollectionsDocument,
  IMAGES_PATH,
  customFieldData,
  customFieldTypes,
  envVars,
  initializeApollo,
  isArrayCustomField
} from "./chunk-6ZV6J3U3.mjs";
import {
  __async,
  __spreadValues
} from "./chunk-HIDP27A7.mjs";

// src/utils/auth/auth.ts
import * as Iron from "@hapi/iron";
import { cookies as cookies2 } from "next/headers";

// src/utils/auth/auth-cookies.ts
import { parse } from "cookie";
import { cookies } from "next/headers";
var TOKEN_NAME = "ost_token";
var MAX_AGE = 60 * 60 * 8;
function setTokenCookie(token) {
  cookies().set(TOKEN_NAME, token, {
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
    const cookieStore = cookies2();
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
    const apolloClient = session ? initializeApollo(null, session) : null;
    let collections = [];
    if (apolloClient) {
      try {
        const { data: documentQueryData } = yield apolloClient.query({
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
import { createEdgeRouter } from "next-connect";
import nextSession from "next-session";
import { NextResponse } from "next/server";
var router = createEdgeRouter();
var getSession = nextSession();
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
  yield getSession(req, res);
  const response = yield next();
  if (response) {
    const url = req.nextUrl.clone();
    url.pathname = "/outstatic";
    url.search = "";
    if (response.status !== 200) {
      const data = yield response.json();
      url.searchParams.set("error", data.error);
    }
    return NextResponse.redirect(url);
  }
})).get((req) => __async(void 0, null, function* () {
  var _a2, _b;
  const error = (_a2 = req == null ? void 0 : req.nextUrl.searchParams) == null ? void 0 : _a2.get("error");
  if (error) {
    return NextResponse.json({ error }, { status: 403 });
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
    return NextResponse.json(
      { error: "repository-not-found" },
      { status: 404, statusText: "Repository not found" }
    );
  }
  if (!isCollaborator) {
    return NextResponse.json(
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
    return new NextResponse("ok", { status: 200 });
  } else {
    return NextResponse.json({ error: "something" }, { status: 403 });
  }
}));

// src/app/api/auth/login.ts
import { redirect } from "next/navigation";
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
    redirect(url.toString());
  });
}

// src/app/api/auth/signout.ts
import { cookies as cookies3 } from "next/headers";
import { NextResponse as NextResponse2 } from "next/server";
function GET3(req) {
  return __async(this, null, function* () {
    cookies3().set(TOKEN_NAME, "", {
      maxAge: -1,
      path: "/"
    });
    const homeUrl = new URL("/", req.url);
    return NextResponse2.redirect(homeUrl);
  });
}

// src/app/api/auth/user.ts
import { NextResponse as NextResponse3 } from "next/server";
function user() {
  return __async(this, null, function* () {
    try {
      const session = yield getLoginSession();
      return NextResponse3.json({ session });
    } catch (error) {
      return NextResponse3.json({ error });
    }
  });
}

// src/app/api/generate/index.tsx
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
var openai = new OpenAI({
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
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  });
}

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
export {
  Outstatic,
  OutstaticApi,
  customFieldData,
  customFieldTypes,
  defaultPages,
  isArrayCustomField
};
