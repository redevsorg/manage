import { AdminLayout } from '@/components'
import { MetadataBuilder } from '@/components/MetadataBuilder'
import useOutstatic from '@/utils/hooks/useOutstatic'
import { clsx } from 'clsx'
import { useState } from 'react'

export default function Settings() {
  const [rebuild, setRebuilding] = useState(false)
  const { repoSlug, repoBranch, contentPath } = useOutstatic()

  return (
    <AdminLayout title="Settings">
      <div className="mb-8 flex h-12 items-center">
        <h1 className="mr-12 text-2xl">Settings</h1>
      </div>
      <div className="max-w-lg">
        <div className="mb-8 max-w-2xl p-8 px-4 md:p-8 text-white bg-black rounded-lg border-2 border-neutral-800 shadow-md prose prose-base">
          <h2 className="text-white">Metadata</h2>
          <div className="flex flex-row items-center">
            <button
              className={clsx(
                'cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-neutral-800 no-underline',
                'text-white',
                'bg-neutral-800',
                rebuild && 'bg-neutral-700'
              )}
              onClick={() => setRebuilding(true)}
            >
              {rebuild ? 'Rebuilding...' : 'Rebuild Metadata'}
            </button>
            <MetadataBuilder
              className="pl-2"
              rebuild={rebuild}
              onComplete={() => setRebuilding(false)}
            />
          </div>
          <p className="text-sm">
            If you&apos;ve made changes outside of outstatic, or if you are
            seeing posts with incorrect metadata, you can rebuild your metadata
            and automatically deploy those changes to your site.
          </p>
        </div>

        <div className="mb-8 max-w-2xl p-8 px-4 md:p-8 text-white bg-black rounded-lg border-2 border-neutral-800 shadow-md prose prose-base">
          <h2 className="text-white">Environment</h2>
          <div>
            <label className="block mb-2 text-sm font-medium text-neutral-500">
              Repository
            </label>
            <input
              className="cursor-not-allowed block p-2 w-full text-neutral-200 bg-neutral-950 rounded-lg border border-neutral-800 sm:text-sm outline-none"
              value={repoSlug}
              readOnly
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-neutral-500">
              Branch
            </label>
            <input
              className="cursor-not-allowed block p-2 w-full text-neutral-200 bg-neutral-950 rounded-lg border border-neutral-800 sm:text-sm outline-none"
              value={repoBranch}
              readOnly
            />
          </div>
          <div className="mt-4">
            <label className="block mb-2 text-sm font-medium text-neutral-500">
              Content Path
            </label>
            <input
              className="cursor-not-allowed block p-2 w-full text-neutral-200 bg-neutral-950 rounded-lg border border-neutral-800 sm:text-sm outline-none"
              value={`${contentPath}`}
              readOnly
            />
          </div>
          <p className="text-sm">
            These values come from your Redevs environment. To learn more
            about how to update these values,{' '}
            <a
              href="https://outstatic.com/docs/environment-variables"
              target="_blank"
              rel="noreferrer"
              className="underline font-semibold text-neutral-300"
            >
              click here
            </a>
            .
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
