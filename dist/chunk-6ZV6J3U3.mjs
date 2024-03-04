import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-HIDP27A7.mjs";

// src/types/index.ts
var customFieldTypes = ["String", "Text", "Number", "Tags"];
var customFieldData = ["string", "number", "array"];
function isArrayCustomField(obj) {
  return obj && obj.dataType === "array" && Array.isArray(obj.values);
}

// src/graphql/generated/index.ts
import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
var defaultOptions = {};
var TreeDetailsFragmentDoc = gql`
  fragment TreeDetails on TreeEntry {
    path
    type
  }
`;
var BlobDetailsFragmentDoc = gql`
  fragment BlobDetails on Blob {
    oid
    commitUrl
  }
`;
var RecursiveTreeDetailsFragmentDoc = gql`
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
var CreateCommitDocument = gql`
  mutation createCommit($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      commit {
        oid
      }
    }
  }
`;
function useCreateCommitMutation(baseOptions) {
  const options = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useMutation(CreateCommitDocument, options);
}
var CollectionsDocument = gql`
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
var DocumentDocument = gql`
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
  const options = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useQuery(
    DocumentDocument,
    options
  );
}
function useDocumentLazyQuery(baseOptions) {
  const options = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useLazyQuery(
    DocumentDocument,
    options
  );
}
var DocumentsDocument = gql`
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
  const options = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useQuery(
    DocumentsDocument,
    options
  );
}
var GetFileInformationDocument = gql`
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
  const options = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useQuery(GetFileInformationDocument, options);
}
var OidDocument = gql`
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
  const options = __spreadValues(__spreadValues({}, defaultOptions), baseOptions);
  return Apollo.useLazyQuery(OidDocument, options);
}

// src/utils/apollo.ts
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import fetch from "cross-fetch";
import { useMemo } from "react";
var apolloClient;
var apolloCache = new InMemoryCache({
  typePolicies: {}
});
function getSession() {
  return __async(this, null, function* () {
    const response = yield fetch("/api/outstatic/user");
    return response.json();
  });
}
function createApolloClient(session) {
  const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql",
    // Prefer explicit `window.fetch` when available so that outgoing requests
    // are captured and deferred until the Service Worker is ready. If no window
    // or window.fetch, default to cross-fetch's ponyfill
    fetch: (...args) => (typeof window !== "undefined" && typeof window.fetch === "function" ? window.fetch : fetch)(...args)
  });
  const authLink = setContext((_0, _1) => __async(this, [_0, _1], function* (_, { headers }) {
    var _a;
    const data = session ? { session } : yield getSession();
    const modifiedHeader = {
      headers: __spreadProps(__spreadValues({}, headers), {
        authorization: ((_a = data.session) == null ? void 0 : _a.access_token) ? `Bearer ${data.session.access_token}` : ""
      })
    };
    return modifiedHeader;
  }));
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: from([authLink, httpLink]),
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
  const store = useMemo(
    () => initializeApollo(initialState, session),
    [initialState, session]
  );
  return store;
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

// src/utils/constants.ts
var OUTSTATIC_VERSION = "1.4.0";
var IMAGES_PATH = "images/";
var API_IMAGES_PATH = "api/outstatic/images/";

export {
  useCreateCommitMutation,
  CollectionsDocument,
  DocumentDocument,
  useDocumentQuery,
  useDocumentLazyQuery,
  useDocumentsQuery,
  useGetFileInformationQuery,
  useOidLazyQuery,
  initializeApollo,
  useApollo,
  envVars,
  OUTSTATIC_VERSION,
  IMAGES_PATH,
  API_IMAGES_PATH,
  customFieldTypes,
  customFieldData,
  isArrayCustomField
};
