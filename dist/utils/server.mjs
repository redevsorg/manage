import {
  __async
} from "../chunk-HIDP27A7.mjs";

// src/utils/server.ts
import fs from "fs";
import matter2 from "gray-matter";
import { join as join2 } from "path";

// src/utils/metadata/load.ts
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import matter from "gray-matter";
import sift from "sift";
import { firstBy } from "thenby";
var CONTENT_PATH = join(
  process.cwd(),
  process.env.OST_CONTENT_PATH || "outstatic/content"
);
var METADATA_PATH = resolve(CONTENT_PATH, "./metadata.json");
var load = () => __async(void 0, null, function* () {
  var _a;
  const m = yield readFile(METADATA_PATH);
  const metadata = JSON.parse(m.toString());
  const mdb = (_a = metadata == null ? void 0 : metadata.metadata) != null ? _a : [];
  return {
    /**
     * Find a post matching a provided query, with options for sorting and limiting
     * @template <TProjection> The returned fields described by the optional Projection
     */
    find: (query, projection) => {
      const subset = mdb.filter(sift(query));
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
            subset.sort(firstBy(sort, { direction: "asc" }));
            return api;
          }
          if (!Array.isArray(sort)) {
            let fn2 = firstBy("\0");
            fn2 = applyKeys(sort, fn2);
            subset.sort(fn2);
            return api;
          }
          let fn;
          for (const entry of sort) {
            if (!fn) {
              if (typeof entry === "string") {
                fn = firstBy(entry, { direction: "asc" });
                continue;
              } else {
                fn = firstBy("\0");
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
                const buf = yield readFile(
                  resolve(process.cwd(), `./${cleanPath}`)
                );
                const { content } = matter(buf.toString());
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
var CONTENT_PATH2 = join2(
  process.cwd(),
  process.env.OST_CONTENT_PATH || "outstatic/content"
);
var MD_MDX_REGEXP = /\.mdx?$/i;
function getDocumentSlugs(collection) {
  const collectionsPath = join2(CONTENT_PATH2, collection);
  const mdMdxFiles = readMdMdxFiles(collectionsPath);
  const slugs = mdMdxFiles.map((file) => file.replace(MD_MDX_REGEXP, ""));
  return slugs;
}
function getDocumentBySlug(collection, slug, fields = []) {
  try {
    const realSlug = slug.replace(MD_MDX_REGEXP, "");
    const collectionsPath = join2(CONTENT_PATH2, collection);
    const fullPath = join2(collectionsPath, `${realSlug}.md`);
    if (!fs.existsSync(fullPath)) {
      console.error("File does not exist:", fullPath);
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter2(fileContents);
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
    const documentFilePaths = fs.readdirSync(CONTENT_PATH2 + "/" + collection).filter((path) => MD_MDX_REGEXP.test(path));
    const publishedPaths = documentFilePaths.filter((path) => {
      const collectionsPath = join2(CONTENT_PATH2, collection);
      const fullPath = join2(collectionsPath, `${path}`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter2(fileContents);
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
    const collections = fs.readdirSync(CONTENT_PATH2).filter((f) => !/\.json$/.test(f));
    return collections;
  } catch (error) {
    console.error({ getCollections: error });
    return [];
  }
};
function readMdMdxFiles(path) {
  try {
    const dirents = fs.readdirSync(path, { withFileTypes: true });
    const mdMdxFiles = dirents.filter((dirent) => dirent.isFile() && MD_MDX_REGEXP.test(dirent.name)).map((dirent) => dirent.name);
    return mdMdxFiles;
  } catch (error) {
    console.error({ readMdMdxFiles: error });
    return [];
  }
}
export {
  getCollections,
  getDocumentBySlug,
  getDocumentPaths,
  getDocumentSlugs,
  getDocuments,
  load
};
