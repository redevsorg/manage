import{a as t,b as S,d as c}from"./chunk-MIGENICT.mjs";var N=["String","Text","Number","Tags"],L=["string","number","array"];function w(e){return e&&e.dataType==="array"&&Array.isArray(e.values)}import{gql as r}from"@apollo/client";import*as n from"@apollo/client";var s={};var M=r`
  fragment TreeDetails on TreeEntry {
    path
    type
  }
`,g=r`
  fragment BlobDetails on Blob {
    oid
    commitUrl
  }
`,m=r`
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
  ${M}
  ${g}
`,A=r`
  mutation createCommit($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      commit {
        oid
      }
    }
  }
`;function z(e){let a=t(t({},s),e);return n.useMutation(A,a)}var k=r`
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
`;var b=r`
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
`;function q(e){let a=t(t({},s),e);return n.useQuery(b,a)}function F(e){let a=t(t({},s),e);return n.useLazyQuery(b,a)}var R=r`
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
`;function G(e){let a=t(t({},s),e);return n.useQuery(R,a)}var E=r`
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
  ${m}
`;function H(e){let a=t(t({},s),e);return n.useQuery(E,a)}var P=r`
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
`;function Q(e){let a=t(t({},s),e);return n.useLazyQuery(P,a)}import{ApolloClient as C,InMemoryCache as D,createHttpLink as x,from as U}from"@apollo/client";import{setContext as _}from"@apollo/client/link/context";import I from"cross-fetch";import{useMemo as f}from"react";var o,T=new D({typePolicies:{}});function v(){return c(this,null,function*(){return(yield I("/api/redevs/user")).json()})}function h(e){let a=x({uri:"https://api.github.com/graphql",fetch:(...p)=>(typeof window!="undefined"&&typeof window.fetch=="function"?window.fetch:I)(...p)}),i=_((ce,pe)=>c(this,[ce,pe],function*(p,{headers:d}){var u;let y=e?{session:e}:yield v();return{headers:S(t({},d),{authorization:(u=y.session)!=null&&u.access_token?`Bearer ${y.session.access_token}`:""})}}));return new C({ssrMode:typeof window=="undefined",link:U([i,a]),cache:T})}function O(e=null,a){let i=o!=null?o:h(a);return e&&i.cache.restore(e),typeof window=="undefined"?i:(o=o!=null?o:i,o)}function ee(e=null,a){return f(()=>O(e,a),[e,a])}var l={required:{OST_GITHUB_ID:!1,OST_GITHUB_SECRET:!1,OST_TOKEN_SECRET:!1},optional:{OST_CONTENT_PATH:!1,OST_REPO_OWNER:!1}},re=function(){let e={hasMissingEnvVars:!1,envVars:{required:{},optional:{}}};return process.env.OST_REPO_SLUG?l.required.OST_REPO_SLUG=!0:process.env.VERCEL_GIT_REPO_SLUG?l.required.VERCEL_GIT_REPO_SLUG=!0:l.required.OST_REPO_SLUG=!1,Object.entries(l.required).forEach(([a])=>{e.envVars.required[a]=!!process.env[a],process.env[a]||(e.hasMissingEnvVars=!0)}),Object.entries(l.optional).forEach(([a])=>{e.envVars.optional[a]=!!process.env[a]}),e}();var oe="1.4.1";var ie="images/",se="api/redevs/images/";export{z as a,k as b,b as c,q as d,F as e,G as f,H as g,Q as h,O as i,ee as j,re as k,oe as l,ie as m,se as n,N as o,L as p,w as q};
