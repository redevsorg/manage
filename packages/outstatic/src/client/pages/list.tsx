import { AdminLayout, DocumentsTable } from '@/components'
import { useDocumentsQuery } from '@/graphql/generated'
import { OstDocument } from '@/types/public'
import useOutstatic from '@/utils/hooks/useOutstatic'
import { GraphQLError } from 'graphql'
import matter from 'gray-matter'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { singular } from 'pluralize'

type GQLErrorExtended = GraphQLError & { type: string }

type ListProps = {
  collection: string
}

const options = {
  year: 'numeric' as const,
  month: 'long' as const,
  day: 'numeric' as const
}

export default function List({ collection }: ListProps) {
  const router = useRouter()

  const {
    repoOwner,
    repoSlug,
    repoBranch,
    contentPath,
    monorepoPath,
    session
  } = useOutstatic()
  const { data, error, loading } = useDocumentsQuery({
    variables: {
      owner: repoOwner || session?.user?.login || '',
      name: repoSlug || '',
      contentPath:
        `${repoBranch}:${
          monorepoPath ? monorepoPath + '/' : ''
        }${contentPath}/${collection}` || ''
    },
    fetchPolicy: 'network-only',
    onError: ({ graphQLErrors }) => {
      if (
        graphQLErrors &&
        (graphQLErrors?.[0] as GQLErrorExtended)?.type === 'NOT_FOUND'
      ) {
        router.push('/api/outstatic/signout')
        return null
      }
      return null
    }
  })

  let documents: OstDocument[] = []

  const entries =
    data?.repository?.object?.__typename === 'Tree' &&
    data?.repository?.object?.entries

  if (entries) {
    entries.forEach((document) => {
      if (document.name.slice(-3) === '.md') {
        const { data } = matter(
          document?.object?.__typename === 'Blob' && document?.object?.text
            ? document?.object?.text
            : ''
        )

        const listData = { ...data }
        delete listData.coverImage

        documents.push({
          ...(listData as OstDocument),
          author: listData.author.name || '',
          publishedAt: new Date(listData.publishedAt).toLocaleDateString(
            'en-US',
            options
          ),
          slug: document.name.replace('.md', '')
        })
      }
    })

    documents.sort((a, b) => Number(b.publishedAt) - Number(a.publishedAt))
  }

  return (
    <AdminLayout
      error={error}
      title={collection[0].toUpperCase() + collection.slice(1)}
    >
      <div className="mb-8 flex h-12 items-center">
        <h1 className="mr-12 text-2xl capitalize">{collection}</h1>
        <Link href={`/outstatic/${collection}/new`}>
          <div className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 bg-neutral-800 hover:bg-neutral-800/90 text-white hover:border-2 hover:border-neutral-800 focus:ring-neutral-700 capitalize">
            New {singular(collection)}
          </div>
        </Link>
      </div>
      {documents.length > 0 && (
        <div className="relative shadow-md sm:rounded-lg">
          <DocumentsTable documents={documents} collection={collection} />
        </div>
      )}
      {documents.length === 0 && !loading && (
        <div className="max-w-2xl">
          <div className="relative">
            <div className="mb-20 max-w-2xl p-8 px-4 md:p-8 text-white bg-black rounded-lg border-2 border-neutral-800 shadow-md prose prose-base">
              <p>This collection has no documents yet.</p>
              <p>
                Create your first{' '}
                <span className="capitalize">{singular(collection)}</span> by
                clicking the button below.
              </p>

              <Link href={`/outstatic/${collection}/new`}>
                <div className="inline-block cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 bg-neutral-800 hover:bg-neutral-800/90 text-white hover:scale-105 focus:ring-neutral-700 capitalize">
                  New {singular(collection)}
                </div>
              </Link>
              <p>
                To learn more about how documents work{' '}
                <a
                  href="https://outstatic.com/docs/introduction#whats-a-document"
                  target="_blank"
                  rel="noreferrer"
                  className="text-neutral-300"
                >
                  click here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
