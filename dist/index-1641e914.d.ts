import { Editor } from '@tiptap/react';

type Document = {
    author: {
        name?: string;
        picture?: string;
    };
    title: string;
    publishedAt: Date;
    content: string;
    status: 'published' | 'draft';
    slug: string;
    description?: string;
    coverImage?: string;
};
type FileType = {
    type: 'image';
    blob?: string;
    filename: string;
    content: string;
};
type DocumentContextType = {
    editor: Editor;
    document: Document;
    editDocument: (property: string, value: any) => void;
    hasChanges: boolean;
    collection: string;
};
type Session = {
    user: {
        name: string;
        login: string;
        email: string;
        image: string;
    };
    access_token: string;
    expires: Date;
};
type Collection = {
    name: string;
};
type DeepNonNullable<T> = {
    [P in keyof T]-?: DeepNonNullable<NonNullable<T[P]>>;
};
declare const customFieldTypes: readonly ["String", "Text", "Number", "Tags"];
declare const customFieldData: readonly ["string", "number", "array"];
type CustomFieldArrayValue = {
    label: string;
    value: string;
};
type CustomField<T extends 'string' | 'number' | 'array'> = {
    title: string;
    fieldType: (typeof customFieldTypes)[number];
    dataType: T;
    description?: string;
    required?: boolean;
} & (T extends 'array' ? {
    values: CustomFieldArrayValue[];
} : {});
type CustomFields = {
    [key: string]: CustomField<'string' | 'number' | 'array'>;
};
type SchemaShape = Document | {
    [key: string]: any;
};
declare function isArrayCustomField(obj: any): obj is CustomField<'array'>;

type EnvVarsType = {
    required: {
        [key: string]: boolean;
    };
    optional: {
        [key: string]: boolean;
    };
};

type OutstaticData = {
    repoOwner: string;
    repoSlug: string;
    repoBranch: string;
    contentPath: string;
    monorepoPath: string;
    session: Session | null;
    initialApolloState?: null;
    collections: string[];
    pages: string[];
    missingEnvVars: EnvVarsType | false;
    hasOpenAIKey: boolean;
};
declare const defaultPages: string[];
declare function Outstatic(): Promise<OutstaticData>;

export { Collection as C, Document as D, FileType as F, OutstaticData as O, Session as S, Outstatic as a, DocumentContextType as b, DeepNonNullable as c, defaultPages as d, customFieldTypes as e, customFieldData as f, CustomFieldArrayValue as g, CustomField as h, CustomFields as i, SchemaShape as j, isArrayCustomField as k };
