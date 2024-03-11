import { AdminLayout } from '@/components'
import Modal from '@/components/Modal'
import {
  useCreateCommitMutation,
  useDocumentLazyQuery
} from '@/graphql/generated'
import { createCommitApi } from '@/utils/createCommitApi'
import { hashFromUrl } from '@/utils/hashFromUrl'
import useOid from '@/utils/hooks/useOid'
import useOutstatic from '@/utils/hooks/useOutstatic'
import { stringifyMetadata } from '@/utils/metadata/stringify'
import { MetadataSchema } from '@/utils/metadata/types'
import Link from 'next/link'
import { useState } from 'react'

export default function Collections() {
  const {
    repoOwner,
    collections,
    session,
    repoSlug,
    repoBranch,
    contentPath,
    monorepoPath,
    removePage
  } = useOutstatic()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [createCommit] = useCreateCommitMutation()
  const fetchOid = useOid()

  const [loadMetadata] = useDocumentLazyQuery({
    variables: {
      owner: repoOwner || session?.user?.login || '',
      name: repoSlug,
      filePath: `${repoBranch}:${
        monorepoPath ? monorepoPath + '/' : ''
      }${contentPath}/metadata.json`
    },
    fetchPolicy: 'network-only'
  })

  const deleteCollection = async (collection: string) => {
    loadMetadata().then(async ({ data: metadata }) => {
      try {
        const oid = await fetchOid()
        const owner = repoOwner || session?.user?.login || ''

        const capi = createCommitApi({
          message: `feat(${collection}): remove ${collection}`,
          owner,
          oid: oid ?? '',
          name: repoSlug,
          branch: repoBranch
        })

        capi.removeFile(
          `${
            monorepoPath ? monorepoPath + '/' : ''
          }${contentPath}/${collection}`
        )

        // remove collection from metadata.json
        if (metadata?.repository?.object?.__typename === 'Blob') {
          const m = JSON.parse(
            metadata.repository.object.text ?? '{}'
          ) as MetadataSchema
          m.generated = new Date().toISOString()
          m.commit = hashFromUrl(metadata.repository.object.commitUrl)
          const newMeta = (m.metadata ?? []).filter(
            (post) => post.collection !== collection
          )
          capi.replaceFile(
            `${
              monorepoPath ? monorepoPath + '/' : ''
            }${contentPath}/metadata.json`,
            stringifyMetadata({ ...m, metadata: newMeta })
          )
        }

        const input = capi.createInput()

        await createCommit({ variables: { input } })
        setShowDeleteModal(false)
        setDeleting(false)
        removePage(collection)
      } catch (error) {}
    })
  }

  return (
    <AdminLayout title="Collections">
      {collections.length === 0 ? (
        <div className="max-w-2xl">
          <div className="relative">
            <div className="mb-8 flex h-12 items-center">
              <h1 className="mr-12 text-2xl">Welcome to Redevs!</h1>
            </div>
            <div className="mb-20 max-w-2xl p-8 px-4 md:p-8 text-white bg-black rounded-lg border-2 border-neutral-800 shadow-md prose prose-base">
              <p>
                To get started you will need to create a new Collection.
                Collections are the main building block of your Redevs
                website.
              </p>
              <p>Create your first Collection by clicking the button below.</p>

              <Link href="/redevs/collections/new">
                <div className="inline-block rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 bg-neutral-800 hover:bg-neutral-800/90 text-white hover:border-2 hover:border-neutral-800 focus:ring-neutral-700 no-underline">
                  New Collection
                </div>
              </Link>
              <p>
                To learn more about how Collections work{' '}
                <a
                  href="https://outstatic.com/docs/introduction#what-are-collections"
                  target="_blank"
                  rel="noreferrer"
                >
                  click here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8 flex h-12 items-center">
            <h1 className="mr-12 text-2xl">Collections</h1>
            <Link href="/redevs/collections/new">
              <div className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 bg-neutral-800 hover:bg-neutral-800/90 text-white hover:border hover:border-neutral-800 focus:ring-neutral-700 no-underline">
                New Collection
              </div>
            </Link>
          </div>
          <div className="max-w-5xl w-full grid md:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection}
                className="relative flex p-6 justify-between items-center max-w-sm bg-neutral-900 rounded-lg border-2 border-neutral-800 shadow-md hover:bg-neutral-800"
              >
                <Link
                  href={`/redevs/${collection}`}
                  className="focus:ring-4 focus:outline-none focus:ring-neutral-700 rounded-lg"
                >
                  <h5 className="text-2xl cursor-pointer font-bold tracking-tight text-white capitalize hover:text-neutral-100">
                    {collection}
                    <span className="absolute top-0 bottom-0 left-0 right-16"></span>
                  </h5>
                </Link>
                <div className="z-10 flex gap-2">
                  <Link
                    href={`/redevs/collections/${collection}`}
                    className="inline-block text-neutral-200 hover:bg-neutral-900 focus:ring-4 focus:outline-none focus:ring-neutral-700 rounded-lg text-sm p-1.5"
                  >
                    <span className="sr-only">Edit collection</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        fill="#e5e5e5"
                        d="M15.7279 9.57629L14.3137 8.16207L5 17.4758V18.89H6.41421L15.7279 9.57629ZM17.1421 8.16207L18.5563 6.74786L17.1421 5.33365L15.7279 6.74786L17.1421 8.16207ZM7.24264 20.89H3V16.6474L16.435 3.21233C16.8256 2.8218 17.4587 2.8218 17.8492 3.21233L20.6777 6.04075C21.0682 6.43128 21.0682 7.06444 20.6777 7.45497L7.24264 20.89Z"
                      ></path>
                    </svg>
                  </Link>
                  <button
                    className="z-10 inline-block text-neutral-200 hover:bg-neutral-900 focus:ring-4 focus:outline-none focus:ring-neutral-700 rounded-lg text-sm p-1.5"
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(true)
                      setSelectedCollection(collection)
                    }}
                  >
                    <span className="sr-only">Delete content</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path
                        fill="#e5e5e5"
                        d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {showDeleteModal && (
        <Modal
          title="Delete Collection"
          close={() => {
            setShowDeleteModal(false)
            setSelectedCollection('')
          }}
        >
          <div className="space-y-6 p-6 text-left">
            <p className="text-base leading-relaxed text-neutral-500">
              Are you sure you want to delete this collection? This may break
              your website.
            </p>
            <p className="text-base leading-relaxed text-neutral-500">
              This action cannot be undone.
            </p>
          </div>

          <div className="flex items-center space-x-2 rounded-b border-t-2 border-neutral-800 p-6">
            <button
              type="button"
              className="flex rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none"
              onClick={() => {
                setDeleting(true)
                deleteCollection(selectedCollection)
              }}
            >
              {deleting ? (
                <>
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Deleting
                </>
              ) : (
                'Delete'
              )}
            </button>
            <button
              type="button"
              className="rounded-lg border-2 border-neutral-800 px-5 py-2.5 text-sm font-medium focus:z-10 focus:outline-none focus:ring-4 bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-700"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedCollection('')
              }}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
