import Input from '@/components/Input'
import { DocumentContext } from '@/context'
import { Document } from '@/types'
import { API_IMAGES_PATH, IMAGES_PATH } from '@/utils/constants'
import { addImage } from '@/utils/editor/utils/addImage'
import { ChangeEvent, useContext, useEffect, useState } from 'react'

type DocumentSettingsImageSelectionProps = {
  name: 'coverImage' | 'author.picture'
  label?: string
  description: string
}

function resolve(path: string, obj: Document, separator = '.') {
  var properties = Array.isArray(path) ? path : path.split(separator)
  return [...properties].reduce(
    (prev: { [x: string]: any }, curr: string | number) => prev?.[curr],
    obj
  )
}

const DocumentSettingsImageSelection = ({
  name,
  description,
  label
}: DocumentSettingsImageSelectionProps) => {
  const { document, editDocument } = useContext(DocumentContext)
  const [showImage, setShowImage] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(true)
  const [loadingError, setLoadingError] = useState(false)
  const [image, setImage] = useState('')
  const resolvedImage = resolve(name, document)

  useEffect(() => {
    const image = resolvedImage?.replace(
      `/${IMAGES_PATH}`,
      `/${API_IMAGES_PATH}`
    )
    setImage(image || '')
    setShowImageOptions(!resolvedImage)
    setShowImage(!!resolvedImage)
  }, [resolvedImage])

  const addImageFile = async ({
    currentTarget
  }: ChangeEvent<HTMLInputElement>) => {
    if (currentTarget.files?.length && currentTarget.files?.[0] !== null) {
      const file = currentTarget.files[0]
      const image = addImage(file)
      editDocument(name, image)
    }
  }

  return (
    <>
      {loadingError && (
        <div
          className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
          role="alert"
        >
          The image failed to load, try submitting again.
        </div>
      )}
      {showImage && (
        <>
          <div className="mb-1 block text-sm font-medium text-white">
            {description}
          </div>
          <div
            className={`w-full relative bg-slate-100 ${
              previewLoading ? 'h-48' : ''
            }`}
          >
            {previewLoading && (
              <div
                className={`animate-pulse w-full h-48 bg-slate-200 absolute`}
              ></div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              className="w-full max-h-48 object-contain"
              onLoad={() => {
                setShowLink(false)
                setPreviewLoading(false)
                setLoadingError(false)
              }}
              onError={() => {
                setPreviewLoading(false)
                setLoadingError(true)
                editDocument(name, '')
                setShowLink(false)
              }}
              alt={description}
            />
          </div>
          <div className="w-full flex justify-between mt-2">
            <button
              onClick={() => {
                editDocument(name, '')
                setShowImage(false)
                setShowLink(false)
              }}
              className="rounded-lg border border-red-700 bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none"
            >
              Remove
            </button>
          </div>
        </>
      )}
      {showLink && (
        <>
          <label className="text-white text-sm mb-1 font-medium">{`${description} URL`}</label>
          <Input
            name={name}
            id={name}
            defaultValue={resolvedImage}
            inputSize="small"
            helperText="Remember to save the document after adding the image URL"
            onBlur={(e) => {
              if (e.target.value) {
                setPreviewLoading(true)
                setShowLink(false)
                editDocument(name, e.target.value)
              }
            }}
          />
          <div className="w-full flex justify-between mt-2">
            <button
              onClick={() => {
                setShowLink(false)
                setShowImageOptions(true)
              }}
              type="button"
              className="rounded-lg bg-neutral-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-neutral-700"
            >
              Cancel
            </button>
          </div>
        </>
      )}
      {showImageOptions && (
        <>
          <span className="mb-1 block text-sm font-medium text-white">
            {label ?? 'Add an image'}
          </span>
          <div className="w-full flex justify-between mt-2">
            <button
              onClick={() => {
                setShowLink(true)
                setShowImageOptions(false)
                setShowImage(false)
                setLoadingError(false)
              }}
              type="button"
              className="flex rounded-lg bg-neutral-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-600 md:mb-2"
            >
              From link
            </button>

            <label
              htmlFor={`${name}-upload`}
              className="flex rounded-lg bg-neutral-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 focus:outline-none focus:ring-4 focus:ring-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-600 md:mb-2"
            >
              From file
            </label>
            <input
              type="file"
              accept="image/*"
              id={`${name}-upload`}
              onChange={addImageFile}
              className="hidden"
            />
          </div>
        </>
      )}
    </>
  )
}

export default DocumentSettingsImageSelection
