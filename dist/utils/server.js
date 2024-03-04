"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
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

// src/utils/server.ts
var server_exports = {};
__export(server_exports, {
  getCollections: () => getCollections,
  getDocumentBySlug: () => getDocumentBySlug,
  getDocumentPaths: () => getDocumentPaths,
  getDocumentSlugs: () => getDocumentSlugs,
  getDocuments: () => getDocuments,
  load: () => load
});
module.exports = __toCommonJS(server_exports);
var import_fs = __toESM(require("fs"));
var import_gray_matter2 = __toESM(require("gray-matter"));
var import_path2 = require("path");

// src/utils/metadata/load.ts
var import_promises = require("fs/promises");
var import_path = require("path");
var import_gray_matter = __toESM(require("gray-matter"));
var import_sift = __toESM(require("sift"));
var import_thenby = require("thenby");
var CONTENT_PATH = (0, import_path.join)(
  process.cwd(),
  process.env.OST_CONTENT_PATH || "outstatic/content"
);
var METADATA_PATH = (0, import_path.resolve)(CONTENT_PATH, "./metadata.json");
var load = () => __async(void 0, null, function* () {
  var _a;
  const m = yield (0, import_promises.readFile)(METADATA_PATH);
  const metadata = JSON.parse(m.toString());
  const mdb = (_a = metadata == null ? void 0 : metadata.metadata) != null ? _a : [];
  return {
    /**
     * Find a post matching a provided query, with options for sorting and limiting
     * @template <TProjection> The returned fields described by the optional Projection
     */
    find: (query, projection) => {
      const subset = mdb.filter((0, import_sift.default)(query));
      let prj = projection != null ? projection : [];
      let skp = 0;
      let lmt = void 0;
      const api = {
        sort: (sort) => {
          const applyKeys = (obj, tb) => {
            let next = tb;
            for (const [s, dir] of Object.entries(obj)) {
              next = next.thenBy(s, { direction: dir >= 0 ? "asc" : "desc" });
            }
            return next;
          };
          const applyString = (s, tb) => {
            return tb.thenBy(s);
          };
          if (typeof sort === "number" || typeof sort === "symbol") {
            throw new Error(
              "sort must be either an array of fields or an object containing field keys and sort directions"
            );
          }
          if (typeof sort === "string") {
            subset.sort((0, import_thenby.firstBy)(sort, { direction: "asc" }));
            return api;
          }
          if (!Array.isArray(sort)) {
            let fn2 = (0, import_thenby.firstBy)("\0");
            fn2 = applyKeys(sort, fn2);
            subset.sort(fn2);
            return api;
          }
          let fn;
          for (const entry of sort) {
            if (!fn) {
              if (typeof entry === "string") {
                fn = (0, import_thenby.firstBy)(entry, { direction: "asc" });
                continue;
              } else {
                fn = (0, import_thenby.firstBy)("\0");
              }
            }
            if (!fn) {
              throw new Error("Unreachable condition: !fn");
            }
            if (typeof entry === "string") {
              fn = applyString(entry, fn);
            } else if (typeof entry === "number" || typeof entry === "symbol") {
              throw new Error(
                "sort must be either an array of fields or an object containing field keys and sort directions"
              );
            } else {
              fn = applyKeys(entry, fn);
            }
          }
          if (fn) {
            subset.sort(fn);
          }
          return api;
        },
        project: (projection2) => {
          prj = projection2;
          return api;
        },
        skip: (skip) => {
          skp = skip;
          return api;
        },
        limit: (limit) => {
          lmt = limit;
          return api;
        },
        first: () => __async(void 0, null, function* () {
          const arr = yield api.toArray();
          return arr == null ? void 0 : arr[0];
        }),
        toArray: () => __async(void 0, null, function* () {
          const copied = JSON.parse(JSON.stringify(subset)).slice(skp, lmt ? skp + lmt : void 0);
          const finalProjection = Array.isArray(prj) ? prj : Object.keys(prj);
          const projected = yield Promise.all(
            copied.map((m2) => __async(void 0, null, function* () {
              if (finalProjection.length === 0 || finalProjection.includes("content")) {
                const cleanPath = process.env.OST_MONOREPO_PATH ? m2.__outstatic.path.replace(
                  process.env.OST_MONOREPO_PATH,
                  ""
                ) : m2.__outstatic.path;
                const buf = yield (0, import_promises.readFile)(
                  (0, import_path.resolve)(process.cwd(), `./${cleanPath}`)
                );
                const { content } = (0, import_gray_matter.default)(buf.toString());
                m2.content = content;
              }
              const result = {};
              for (const p of finalProjection) {
                if (typeof m2[p] !== "undefined") {
                  result[p] = m2[p];
                }
              }
              return result;
            }))
          );
          return projected;
        })
      };
      return api;
    }
  };
});

// src/utils/server.ts
var CONTENT_PATH2 = (0, import_path2.join)(
  process.cwd(),
  process.env.OST_CONTENT_PATH || "outstatic/content"
);
var MD_MDX_REGEXP = /\.mdx?$/i;
function getDocumentSlugs(collection) {
  const collectionsPath = (0, import_path2.join)(CONTENT_PATH2, collection);
  const mdMdxFiles = readMdMdxFiles(collectionsPath);
  const slugs = mdMdxFiles.map((file) => file.replace(MD_MDX_REGEXP, ""));
  return slugs;
}
function getDocumentBySlug(collection, slug, fields = []) {
  try {
    const realSlug = slug.replace(MD_MDX_REGEXP, "");
    const collectionsPath = (0, import_path2.join)(CONTENT_PATH2, collection);
    const fullPath = (0, import_path2.join)(collectionsPath, `${realSlug}.md`);
    if (!import_fs.default.existsSync(fullPath)) {
      console.error("File does not exist:", fullPath);
      return null;
    }
    const fileContents = import_fs.default.readFileSync(fullPath, "utf8");
    const { data, content } = (0, import_gray_matter2.default)(fileContents);
    const items = {};
    if (data["status"] === "draft") {
      return null;
    }
    fields.forEach((field) => {
      if (field === "slug") {
        items[field] = realSlug;
      }
      if (field === "content") {
        items[field] = content;
      }
      if (typeof data[field] !== "undefined") {
        items[field] = data[field];
      }
    });
    return items;
  } catch (error) {
    console.error({ getDocumentBySlug: error });
    return null;
  }
}
function getDocuments(collection, fields = []) {
  const slugs = getDocumentSlugs(collection);
  const documents = slugs.map(
    (slug) => getDocumentBySlug(collection, slug, [
      ...fields,
      "publishedAt",
      "status"
    ])
  ).filter(
    (document) => document !== null && document.status === "published"
  ).sort(
    (document1, document2) => document1.publishedAt > document2.publishedAt ? -1 : 1
  );
  return documents;
}
var getDocumentPaths = (collection) => {
  try {
    const documentFilePaths = import_fs.default.readdirSync(CONTENT_PATH2 + "/" + collection).filter((path) => MD_MDX_REGEXP.test(path));
    const publishedPaths = documentFilePaths.filter((path) => {
      const collectionsPath = (0, import_path2.join)(CONTENT_PATH2, collection);
      const fullPath = (0, import_path2.join)(collectionsPath, `${path}`);
      const fileContents = import_fs.default.readFileSync(fullPath, "utf8");
      const { data } = (0, import_gray_matter2.default)(fileContents);
      return data["status"] === "published";
    });
    const paths = publishedPaths.map((path) => path.replace(MD_MDX_REGEXP, "")).map((slug) => ({ params: { slug } }));
    return paths;
  } catch (error) {
    console.error({ getDocumentPaths: error });
    return [];
  }
};
var getCollections = () => {
  try {
    const collections = import_fs.default.readdirSync(CONTENT_PATH2).filter((f) => !/\.json$/.test(f));
    return collections;
  } catch (error) {
    console.error({ getCollections: error });
    return [];
  }
};
function readMdMdxFiles(path) {
  try {
    const dirents = import_fs.default.readdirSync(path, { withFileTypes: true });
    const mdMdxFiles = dirents.filter((dirent) => dirent.isFile() && MD_MDX_REGEXP.test(dirent.name)).map((dirent) => dirent.name);
    return mdMdxFiles;
  } catch (error) {
    console.error({ readMdMdxFiles: error });
    return [];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getCollections,
  getDocumentBySlug,
  getDocumentPaths,
  getDocumentSlugs,
  getDocuments,
  load
});
