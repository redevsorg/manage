export { C as Collection, h as CustomField, g as CustomFieldArrayValue, i as CustomFields, c as DeepNonNullable, D as Document, b as DocumentContextType, F as FileType, a as Outstatic, O as OutstaticData, j as SchemaShape, S as Session, f as customFieldData, e as customFieldTypes, d as defaultPages, k as isArrayCustomField } from './index-1641e914.js';
import { Session } from 'next-session/lib/types';
import { NextRequest } from 'next/server';
export { O as OstDocument } from './public-43e6365e.js';
import '@tiptap/react';

interface Request extends NextRequest {
    session: Session;
}
type GetParams = {
    params: {
        ost: ['callback', 'login', 'signout', 'user', 'images'];
    };
};
type PostParams = {
    params: {
        ost: ['generate'];
    };
};
declare const OutstaticApi: {
    GET: (req: Request, { params }: GetParams) => Promise<Response>;
    POST: (req: Request, { params }: PostParams) => Promise<Response>;
};

export { GetParams, OutstaticApi, PostParams, Request };
