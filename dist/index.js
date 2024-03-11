"use strict";var ce=Object.create;var m=Object.defineProperty,pe=Object.defineProperties,ye=Object.getOwnPropertyDescriptor,ue=Object.getOwnPropertyDescriptors,Se=Object.getOwnPropertyNames,L=Object.getOwnPropertySymbols,be=Object.getPrototypeOf,V=Object.prototype.hasOwnProperty,Ie=Object.prototype.propertyIsEnumerable;var j=(e,a,t)=>a in e?m(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t,A=(e,a)=>{for(var t in a||(a={}))V.call(a,t)&&j(e,t,a[t]);if(L)for(var t of L(a))Ie.call(a,t)&&j(e,t,a[t]);return e},z=(e,a)=>pe(e,ue(a));var de=(e,a)=>{for(var t in a)m(e,t,{get:a[t],enumerable:!0})},k=(e,a,t,n)=>{if(a&&typeof a=="object"||typeof a=="function")for(let r of Se(a))!V.call(e,r)&&r!==t&&m(e,r,{get:()=>a[r],enumerable:!(n=ye(a,r))||n.enumerable});return e};var R=(e,a,t)=>(t=e!=null?ce(be(e)):{},k(a||!e||!e.__esModule?m(t,"default",{value:e,enumerable:!0}):t,e)),Me=e=>k(m({},"__esModule",{value:!0}),e);var o=(e,a,t)=>new Promise((n,r)=>{var i=s=>{try{l(t.next(s))}catch(c){r(c)}},b=s=>{try{l(t.throw(s))}catch(c){r(c)}},l=s=>s.done?n(s.value):Promise.resolve(s.value).then(i,b);l((t=t.apply(e,a)).next())});var ke={};de(ke,{Outstatic:()=>xe,OutstaticApi:()=>Le,customFieldData:()=>Ve,customFieldTypes:()=>je,defaultPages:()=>Z,isArrayCustomField:()=>ze});module.exports=Me(ke);var p=require("@apollo/client"),D=R(require("@apollo/client"));var ge=p.gql`
  fragment TreeDetails on TreeEntry {
    path
    type
  }
`,me=p.gql`
  fragment BlobDetails on Blob {
    oid
    commitUrl
  }
`,Ae=p.gql`
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
  ${ge}
  ${me}
`,He=p.gql`
  mutation createCommit($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      commit {
        oid
      }
    }
  }
`;var q=p.gql`
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
`;var Qe=p.gql`
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
`;var We=p.gql`
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
`;var Ke=p.gql`
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
  ${Ae}
`;var Ye=p.gql`
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
`;var u=require("@apollo/client"),F=require("@apollo/client/link/context"),x=R(require("cross-fetch")),Re=require("react");var y,Ee=new u.InMemoryCache({typePolicies:{}});function Pe(){return o(this,null,function*(){return(yield(0,x.default)("/api/redevs/user")).json()})}function Ce(e){let a=(0,u.createHttpLink)({uri:"https://api.github.com/graphql",fetch:(...n)=>(typeof window!="undefined"&&typeof window.fetch=="function"?window.fetch:x.default)(...n)}),t=(0,F.setContext)((i,b)=>o(this,[i,b],function*(n,{headers:r}){var c;let l=e?{session:e}:yield Pe();return{headers:z(A({},r),{authorization:(c=l.session)!=null&&c.access_token?`Bearer ${l.session.access_token}`:""})}}));return new u.ApolloClient({ssrMode:typeof window=="undefined",link:(0,u.from)([t,a]),cache:Ee})}function G(e=null,a){let t=y!=null?y:Ce(a);return e&&t.cache.restore(e),typeof window=="undefined"?t:(y=y!=null?y:t,y)}var d=R(require("@hapi/iron")),K=require("next/headers");var De=require("cookie"),H=require("next/headers"),U="ost_token",g=60*60*8;function Q(e){(0,H.cookies)().set(U,e,{maxAge:g,expires:new Date(Date.now()+g*1e3),httpOnly:!0,secure:process.env.NODE_ENV==="production",path:"/",sameSite:"lax"})}var W,Y=(W=process.env.OST_TOKEN_SECRET)!=null?W:"";function $(e){return o(this,null,function*(){let a=A({},e),t=yield d.seal(a,Y,d.defaults);Q(t)})}function S(){return o(this,null,function*(){var t;let a=(t=(0,K.cookies)().get("ost_token"))==null?void 0:t.value;if(!a)return null;try{let n=yield d.unseal(a,Y,d.defaults),r=n.expires+g*1e3;if(Date.now()>r)throw new Error("Session expired");return n}catch(n){return null}})}var E={required:{OST_GITHUB_ID:!1,OST_GITHUB_SECRET:!1,OST_TOKEN_SECRET:!1},optional:{OST_CONTENT_PATH:!1,OST_REPO_OWNER:!1}},_=function(){let e={hasMissingEnvVars:!1,envVars:{required:{},optional:{}}};return process.env.OST_REPO_SLUG?E.required.OST_REPO_SLUG=!0:process.env.VERCEL_GIT_REPO_SLUG?E.required.VERCEL_GIT_REPO_SLUG=!0:E.required.OST_REPO_SLUG=!1,Object.entries(E.required).forEach(([a])=>{e.envVars.required[a]=!!process.env[a],process.env[a]||(e.hasMissingEnvVars=!0)}),Object.entries(E.optional).forEach(([a])=>{e.envVars.optional[a]=!!process.env[a]}),e}();var Z=["settings","collections"];function xe(){return o(this,null,function*(){var n,r,i,b;if(_.hasMissingEnvVars)return{missingEnvVars:_.envVars};let e=yield S(),a=e?G(null,e):null,t=[];if(a)try{let{data:l}=yield a.query({query:q,variables:{name:process.env.OST_REPO_SLUG||process.env.VERCEL_GIT_REPO_SLUG||"",contentPath:`${process.env.OST_REPO_BRANCH||"main"}:${process.env.OST_MONOREPO_PATH?process.env.OST_MONOREPO_PATH+"/":""}${process.env.OST_CONTENT_PATH||"outstatic/content"}`,owner:process.env.OST_REPO_OWNER||((n=e==null?void 0:e.user)==null?void 0:n.login)||""},fetchPolicy:"no-cache"}),s=(r=l==null?void 0:l.repository)==null?void 0:r.object;(s==null?void 0:s.__typename)==="Tree"&&(t=(i=s==null?void 0:s.entries)==null?void 0:i.map(c=>c.type==="tree"?c.name:void 0).filter(Boolean))}catch(l){console.log({error:l})}return{repoOwner:process.env.OST_REPO_OWNER||((b=e==null?void 0:e.user)==null?void 0:b.login)||"",repoSlug:process.env.OST_REPO_SLUG||process.env.VERCEL_GIT_REPO_SLUG||"",repoBranch:process.env.OST_REPO_BRANCH||"main",contentPath:process.env.OST_CONTENT_PATH||"outstatic/content",monorepoPath:process.env.OST_MONOREPO_PATH||"",session:e||null,initialApolloState:null,collections:t,pages:[...Z,...t],missingEnvVars:!1,hasOpenAIKey:!!process.env.OPENAI_API_KEY}})}var J=require("next-connect"),X=R(require("next-session")),M=require("next/server");var ee=(0,J.createEdgeRouter)(),Ue=(0,X.default)();function f(e){return o(this,null,function*(){return ee.run(e,{params:{id:"1"}})})}function _e(e){return o(this,null,function*(){let t=yield(yield fetch("https://github.com/login/oauth/access_token",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({client_id:process.env.OST_GITHUB_ID,client_secret:process.env.OST_GITHUB_SECRET,code:e})})).text();return new URLSearchParams(t).get("access_token")})}function fe(e){return o(this,null,function*(){return yield(yield fetch("https://api.github.com/user",{headers:{Authorization:"token "+e}})).json()})}function Te(e,a){return o(this,null,function*(){let t=process.env.OST_REPO_OWNER||a,n=process.env.OST_REPO_SLUG||process.env.VERCEL_GIT_REPO_SLUG||"";return(yield fetch(`https://api.github.com/repos/${t}/${n}`,{headers:{Authorization:`token ${e}`}})).status===200})}function ve(e,a){return o(this,null,function*(){let t=process.env.OST_REPO_SLUG||process.env.VERCEL_GIT_REPO_SLUG||"";return!(process.env.OST_REPO_OWNER&&(yield fetch(`https://api.github.com/repos/${process.env.OST_REPO_OWNER}/${t}/collaborators/${a}`,{headers:{Authorization:`token ${e}`}})).status!==204)})}ee.use((e,a,t)=>o(void 0,null,function*(){yield Ue(e,a);let n=yield t();if(n){let r=e.nextUrl.clone();if(r.pathname="/redevs",r.search="",n.status!==200){let i=yield n.json();r.searchParams.set("error",i.error)}return M.NextResponse.redirect(r)}})).get(e=>o(void 0,null,function*(){var c,w;let a=(c=e==null?void 0:e.nextUrl.searchParams)==null?void 0:c.get("error");if(a)return M.NextResponse.json({error:a},{status:403});let t=(w=e==null?void 0:e.nextUrl.searchParams)==null?void 0:w.get("code"),n=yield _e(t);e.session.token=n;let r=yield fe(n||""),i=Promise.all([Te(e.session.token,r.login),ve(e.session.token,r.login)]),[b,l]=yield i;if(!b)return M.NextResponse.json({error:"repository-not-found"},{status:404,statusText:"Repository not found"});if(!l)return M.NextResponse.json({error:"not-collaborator"},{status:403,statusText:"Forbidden"});if(!r.email){let I=yield(yield fetch("https://api.github.com/user/emails",{headers:{Authorization:`token ${n}`}})).json();if((I==null?void 0:I.length)>0){var s;r.email=(s=I.find(C=>C.primary))===null||s===void 0?void 0:s.email,r.email||(r.email=I[0].email)}}if(r&&n){let{name:I,login:C,email:ie,avatar_url:le}=r;return yield $({user:{name:I,login:C,email:ie,image:le},access_token:n,expires:new Date(Date.now()+g*1e3)}),new M.NextResponse("ok",{status:200})}else return M.NextResponse.json({error:"something"},{status:403})}));var ae=require("next/navigation");function T(){return o(this,null,function*(){var t,n;let e=["read:user","user:email","repo"],a=new URL("https://github.com/login/oauth/authorize");a.searchParams.append("client_id",(t=process.env.OST_GITHUB_ID)!=null?t:""),a.searchParams.append("scope",e.join(",")),a.searchParams.append("response_type","code"),(n=process.env)!=null&&n.OST_GITHUB_CALLBACK_URL&&a.searchParams.append("redirect_uri",process.env.OST_GITHUB_CALLBACK_URL),(0,ae.redirect)(a.toString())})}var te=require("next/headers"),re=require("next/server");function v(e){return o(this,null,function*(){(0,te.cookies)().set(U,"",{maxAge:-1,path:"/"});let a=new URL("/",e.url);return re.NextResponse.redirect(a)})}var h=require("next/server");function O(){return o(this,null,function*(){try{let e=yield S();return h.NextResponse.json({session:e})}catch(e){return h.NextResponse.json({error:e})}})}var P=require("ai"),ne=R(require("openai"));var he=new ne.default({apiKey:process.env.OPENAI_API_KEY||""});function B(e){return o(this,null,function*(){if(!(yield S()))return new Response("Unauthorized",{status:401});let{prompt:t}=yield e.json(),n=yield he.chat.completions.create({model:"gpt-3.5-turbo",messages:[{role:"system",content:"You are an AI writing assistant that autocompletes existing text based on context from prior text. Give more weight/priority to the later characters than the beginning ones.Limit your response to no more than 200 characters, but make sure to construct complete sentences."},{role:"user",content:t}],temperature:.7,top_p:1,frequency_penalty:0,presence_penalty:0,stream:!0,n:1}),r=(0,P.OpenAIStream)(n);return new P.StreamingTextResponse(r)})}var oe="images/";var Oe=process.env.OST_REPO_SLUG||process.env.VERCEL_GIT_REPO_SLUG,Be=process.env.OST_REPO_BRANCH||"main",se=process.env.OST_MONOREPO_PATH;function N(e,a){return o(this,null,function*(){var r;let t=yield S(),n=process.env.OST_REPO_OWNER||((r=t==null?void 0:t.user)==null?void 0:r.login);if(t!=null&&t.access_token){let i=yield fetch(`https://raw.githubusercontent.com/${n}/${Oe}/${Be}/${se?se+"/":""}public/${oe}${e.nextUrl.pathname.split("/").pop()}`,{headers:{authorization:`token ${t.access_token}`}});if(i.status===200&&i.body){let l=i.headers.get("Content-Type")==="image/svg+xml"?yield i.blob():Buffer.from(yield i.arrayBuffer());return new Headers(e.headers).set("Cache-Control","max-age=300"),new Response(l,{status:200,headers:{"Cache-Control":"max-age=300"}})}return new Response(i.statusText,{status:i.status})}else return new Response("Unauthorized",{status:401})})}var Ne={callback:f,login:T,signout:v,user:O,images:N},we={generate:B},Le={GET:(t,n)=>o(void 0,[t,n],function*(e,{params:a}){let{ost:r}=a;return Ne[r[0]](e)}),POST:(t,n)=>o(void 0,[t,n],function*(e,{params:a}){let{ost:r}=a;return we[r[0]](e)})};var je=["String","Text","Number","Tags"],Ve=["string","number","array"];function ze(e){return e&&e.dataType==="array"&&Array.isArray(e.values)}0&&(module.exports={Outstatic,OutstaticApi,customFieldData,customFieldTypes,defaultPages,isArrayCustomField});
