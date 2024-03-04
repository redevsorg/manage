import { O as OstDocument } from '../public-43e6365e.js';
import { Query } from 'sift';

type Projection = Record<string, number> | string[];
type OutstaticSchema<TSchema extends {
    [key: string]: unknown;
} = {
    [key: string]: unknown;
}> = TSchema & OstDocument & {
    __outstatic: {
        hash: string;
        path: string;
        commit: string;
    };
};
type SortDeclaration = {
    [key: string]: number;
};
type FindAPI<T, P> = {
    /**
     * Sort the results using the following options for `sort`
     *   * As an array of strings - sorted using ascending sort
     *   * As an object in key-order - {publishedAt: 1, slug: -1} using `1` for ascending and `-1` for descending
     *   * An array containing a mix of the above values
     */
    sort: (sort: SortDeclaration | (keyof T)[] | SortDeclaration | keyof T) => FindAPI<T, P>;
    /** Limit the fields returned before running the find operation */
    project: (projection: Projection) => FindAPI<T, P>;
    /** Skip the specified number of entries from the result */
    skip: (skip: number) => FindAPI<T, P>;
    /** Limit the find results to the specified number of results */
    limit: (limit: number) => FindAPI<T, P>;
    /** Take the first result from the query, disregarding others. Populates additional data from the filesystem */
    first: () => Promise<P>;
    /** Return the results as an array, populating additional data from the filesystem as needed */
    toArray: () => Promise<P[]>;
};

declare const load: <TSchema extends {} = {}>() => Promise<{
    /**
     * Find a post matching a provided query, with options for sorting and limiting
     * @template <TProjection> The returned fields described by the optional Projection
     */
    find: <TProjection = OutstaticSchema<TSchema>>(query: Query<OutstaticSchema<TSchema>>, projection?: Projection) => FindAPI<OutstaticSchema<TSchema>, TProjection>;
}>;

declare function getDocumentSlugs(collection: string): string[];
declare function getDocumentBySlug(collection: string, slug: string, fields?: string[]): OstDocument | null;
declare function getDocuments(collection: string, fields?: string[]): OstDocument<{
    [key: string]: unknown;
}>[];
declare const getDocumentPaths: (collection: string) => {
    params: {
        slug: string;
    };
}[];
declare const getCollections: () => string[];

export { getCollections, getDocumentBySlug, getDocumentPaths, getDocumentSlugs, getDocuments, load };
