import { AdminLayout, Input } from '@/components'
import Alert from '@/components/Alert'
import Modal from '@/components/Modal'
import TagInput from '@/components/TagInput'
import { useCreateCommitMutation } from '@/graphql/generated'
import { CustomField, CustomFields, customFieldTypes } from '@/types'
import { createCommitApi } from '@/utils/createCommitApi'
import useFileQuery from '@/utils/hooks/useFileQuery'
import useOid from '@/utils/hooks/useOid'
import useOutstatic from '@/utils/hooks/useOutstatic'
import { yupResolver } from '@hookform/resolvers/yup'
import camelCase from 'camelcase'
import { useEffect, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

type AddCustomFieldProps = {
  collection: string
}

type CustomFieldForm = CustomField<'string' | 'number' | 'array'> & {
  name: string
}

const fieldDataMap = {
  Text: 'string',
  String: 'string',
  Number: 'number',
  Tags: 'array'
} as const

export default function AddCustomField({ collection }: AddCustomFieldProps) {
  const {
    contentPath,
    monorepoPath,
    session,
    repoSlug,
    repoBranch,
    repoOwner,
    setHasChanges
  } = useOutstatic()
  const [createCommit] = useCreateCommitMutation()
  const fetchOid = useOid()
  const [customFields, setCustomFields] = useState<CustomFields>({})
  const yupSchema = yup.object().shape({
    title: yup
      .string()
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field.')
      .required('Custom field name is required.'),
    fieldType: yup
      .string()
      .oneOf([...customFieldTypes])
      .required(),
    description: yup.string(),
    required: yup.boolean().required()
  })
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const methods = useForm<CustomFieldForm>({
    mode: 'onChange',
    resolver: yupResolver(yupSchema)
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { data: schemaQueryData, loading } = useFileQuery({
    file: `${collection}/schema.json`
  })
  const [selectedField, setSelectedField] = useState('')
  const [fieldName, setFieldName] = useState('')

  const capiHelper = async ({
    customFields,
    deleteField = false
  }: {
    customFields: any
    deleteField?: boolean
  }) => {
    const oid = await fetchOid()
    const customFieldsJSON = JSON.stringify(
      {
        title: collection,
        type: 'object',
        properties: { ...customFields }
      },
      null,
      2
    )

    const capi = createCommitApi({
      message: `feat(${collection}): ${
        deleteField ? 'delete' : 'add'
      } ${fieldName} field`,
      owner: repoOwner || session?.user?.login || '',
      oid: oid ?? '',
      name: repoSlug,
      branch: repoBranch
    })

    capi.replaceFile(
      `${
        monorepoPath ? monorepoPath + '/' : ''
      }${contentPath}/${collection}/schema.json`,
      customFieldsJSON + '\n'
    )

    const input = capi.createInput()

    return await createCommit({ variables: { input } })
  }

  const onSubmit: SubmitHandler<CustomFieldForm> = async (
    data: CustomFieldForm
  ) => {
    setAdding(true)
    const { title, fieldType, ...rest } = data
    const fieldName = camelCase(title)

    if (!selectedField && customFields[fieldName]) {
      methods.setError('title', {
        type: 'manual',
        message: 'Field name is already taken.'
      })
      setAdding(false)
      return
    }

    try {
      customFields[fieldName] = {
        ...rest,
        fieldType,
        dataType: fieldDataMap[fieldType],
        title: data.title
      }

      if (fieldDataMap[fieldType] === 'array') {
        customFields[fieldName] = {
          ...customFields[fieldName],
          // @ts-ignore
          values: data?.values || []
        }
      }

      const created = await capiHelper({ customFields })

      if (created) {
        setCustomFields({ ...customFields })
      }
    } catch (error) {
      // TODO: Better error treatment
      setError('add')
      console.log({ error })
    }

    setHasChanges(false)
    setSelectedField('')
    setShowAddModal(false)
    setAdding(false)
  }

  const deleteField = async (name: string) => {
    setDeleting(true)

    try {
      let newCustomFields = { ...customFields }
      delete newCustomFields[name]
      const deleted = await capiHelper({
        customFields: newCustomFields,
        deleteField: true
      })

      if (deleted) {
        setCustomFields(newCustomFields)
      }
    } catch (error) {
      // TODO: Better error treatment
      setError('delete')
      console.log({ error })
    }
    setSelectedField('')
    setShowDeleteModal(false)
    setDeleting(false)
    setHasChanges(false)
  }

  useEffect(() => {
    const documentQueryObject = schemaQueryData?.repository?.object
    if (documentQueryObject?.__typename === 'Blob') {
      const schema = JSON.parse(documentQueryObject?.text || '{}')
      setCustomFields(schema.properties)
    }
  }, [schemaQueryData])

  useEffect(() => {
    const subscription = methods.watch(() => setHasChanges(true))
    return () => subscription.unsubscribe()
  }, [methods])

  return (
    <AdminLayout title="Add Custom Fields">
      <FormProvider {...methods}>
        <div className="mb-8 flex h-12 items-center">
          <h1 className="mr-12 text-2xl">
            <span className="capitalize">{collection}</span> Fields
          </h1>
          {Object.keys(customFields).length > 0 ? (
            <button
              type="button"
              onClick={() => {
                methods.reset()
                setShowAddModal(true)
              }}
            >
              <div className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4 bg-neutral-800 hover:bg-neutral-800/90 text-white hover:border hover:border-neutral-800 focus:ring-neutral-700 no-underline">
                Add Custom Field
              </div>
            </button>
          ) : null}
        </div>
        {!loading ? (
          <>
            {Object.keys(customFields).length === 0 ? (
              <div className="max-w-2xl">
                <div className="relative">
                  <div className="mb-20 max-w-2xl p-8 px-4 md:p-8 text-white bg-black rounded-lg border-2 border-neutral-800 shadow-md prose prose-base">
                    <p>Here you can add Custom Fields to your collections.</p>
                    <p>
                      Create your first Custom Field by clicking the button
                      below.
                    </p>

                    <div
                      className="inline-block rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4  bg-neutral-800 text-white hover:scale-105 focus:ring-neutral-800 no-underline hover:cursor-pointer"
                      onClick={() => setShowAddModal(true)}
                    >
                      Add Custom Field
                    </div>
                    <p>
                      To learn more about how Custom Fields work checkout{' '}
                      <a
                        href="https://outstatic.com/docs/custom-fields"
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-300"
                      >
                        the docs
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="max-w-5xl w-full grid grid-cols-3 gap-6">
                  {customFields &&
                    Object.entries(customFields).map(([name, field]) => {
                      return (
                        <div
                          key={name}
                          className="relative flex p-6 justify-between items-center max-w-sm bg-neutral-900 rounded-lg border-2 border-neutral-800 shadow-md hover:bg-neutral-800 text-white"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              methods.reset()
                              setSelectedField(name)
                              setShowAddModal(true)
                            }}
                            className="text-left"
                          >
                            <span className="block text-xl cursor-pointer font-bold tracking-tight text-white capitalize mb-2">
                              {field.title}
                              {/* This span allows for full card click */}
                              <span className="absolute top-0 bottom-0 left-0 right-16"></span>
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                              {field.fieldType}
                            </span>
                            {field.required ? (
                              <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                                required
                              </span>
                            ) : null}
                          </button>
                          <button
                            className="z-10 inline-block text-neutral-500 hover:bg-black focus:outline-none focus:bg-neutral-950 rounded-lg text-sm p-1.5"
                            type="button"
                            onClick={() => {
                              setShowDeleteModal(true)
                              setSelectedField(name)
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
                      )
                    })}
                </div>
              </>
            )}
          </>
        ) : null}
        {error ? (
          <div className="mt-8">
            <Alert type="error">
              <>
                <span className="font-medium">Oops!</span> We are unable to{' '}
                {error} your custom field.
              </>
            </Alert>
          </div>
        ) : null}
        {showAddModal && (
          <Modal
            title={
              selectedField
                ? `Edit ${customFields[selectedField].title}`
                : `Add Custom Field to ${collection}`
            }
            close={() => {
              setHasChanges(false)
              setSelectedField('')
              setShowAddModal(false)
            }}
          >
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {!!selectedField ? (
                <div className="pt-6 pl-6">
                  <Alert type="info">
                    <>
                      <span className="font-medium">Field name</span> and{' '}
                      <span className="font-medium">Field type</span> editing is
                      disabled to avoid data conflicts.
                    </>
                  </Alert>
                </div>
              ) : null}
              <div
                key={selectedField}
                className={`flex p-6 text-left gap-4 ${
                  !!selectedField
                    ? 'pt-0 opacity-50 cursor-not-allowed pointer-events-none hidden'
                    : ''
                }`}
              >
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-300">
                    Field name
                  </label>
                  <Input
                    id="title"
                    inputSize="medium"
                    className="w-full max-w-sm md:w-80 focus:border-neutral-800"
                    placeholder="Ex: Category"
                    type="text"
                    helperText="The name of the field"
                    readOnly={!!selectedField}
                    autoFocus={!selectedField}
                    defaultValue={
                      selectedField ? customFields[selectedField].title : ''
                    }
                    registerOptions={{
                      onChange: (e) => {
                        setFieldName(camelCase(e.target.value))
                      }
                    }}
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="status"
                    className="block mb-2 text-sm font-medium text-neutral-300"
                  >
                    Field type
                  </label>
                  <select
                    {...methods.register('fieldType')}
                    name="fieldType"
                    id="fieldType"
                    className="block cursor-pointer appearance-none rounded-lg bg-gray-50 p-2 text-sm text-gray-900 outline-none focus:border-neutral-800"
                    defaultValue={
                      selectedField
                        ? customFields[selectedField].fieldType
                        : 'String'
                    }
                  >
                    {customFieldTypes.map((type) => {
                      return (
                        <option
                          key={type}
                          value={type}
                          disabled={!!selectedField}
                        >
                          {type}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>

              <div className="flex px-6 text-left gap-4 mb-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-neutral-300">
                    Description
                  </label>
                  <Input
                    id="description"
                    inputSize="medium"
                    className="w-full max-w-sm md:w-80 focus:border-neutral-800"
                    placeholder="Ex: Add a category"
                    type="text"
                    helperText="This will be the label of the field"
                    defaultValue={
                      selectedField
                        ? customFields[selectedField].description
                        : ''
                    }
                  />
                </div>
                <fieldset>
                  <div className="flex mt-7">
                    <div className="flex items-center h-5">
                      <input
                        {...methods.register('required')}
                        id="required"
                        type="checkbox"
                        className="cursor-pointer w-4 h-4 text-neutral-800 bg-neutral-100 rounded border-neutral-800 focus:ring-neutral-800 focus:ring-2"
                        defaultChecked={
                          selectedField
                            ? customFields[selectedField].required
                            : false
                        }
                      />
                    </div>
                    <div className="ml-2 text-sm">
                      <label
                        htmlFor="required"
                        className="cursor-pointer text-sm font-medium text-neutral-300"
                      >
                        Required field
                      </label>
                      <p
                        id="helper-checkbox-text"
                        className="text-xs font-normal text-gray-500"
                      >
                        <span className="capitalize">{collection}</span>{' '}
                        documents will only be saved if this field is not empty
                      </p>
                    </div>
                  </div>
                </fieldset>
              </div>
              {selectedField &&
              customFields[selectedField].fieldType === 'Tags' &&
              customFields[selectedField].dataType === 'array' ? (
                <div className="flex px-6 text-left gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-neutral-300">
                      Your tags
                    </label>
                    <TagInput
                      id="values"
                      helperText="Deleting tags will remove them from suggestions, not from existing documents."
                      //@ts-ignore
                      defaultValue={customFields[selectedField].values || []}
                      noOptionsMessage={() => null}
                      isClearable={false}
                      isSearchable={false}
                      components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null
                      }}
                    />
                  </div>
                </div>
              ) : null}
              <div className="space-x-2 rounded-b border-t-2 border-neutral-800 p-6 text-sm text-neutral-300">
                This field will be accessible on the frontend as:{'  '}
                <code className="text-neutral-400 font-semibold">
                  {selectedField ? selectedField : fieldName}
                </code>
              </div>
              <div className="flex items-center space-x-2 rounded-b border-t-2 border-neutral-800 p-6">
                <button
                  type="submit"
                  disabled={adding}
                  className="flex rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none"
                >
                  {adding ? (
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
                      {selectedField ? 'Editing' : 'Adding'}
                    </>
                  ) : selectedField ? (
                    'Edit'
                  ) : (
                    'Add'
                  )}
                </button>
                <button
                  type="button"
                  className="rounded-lg px-5 py-2.5 text-sm font-medium focus:z-10 focus:outline-none focus:ring-4 bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-700"
                  onClick={() => {
                    setHasChanges(false)
                    setSelectedField('')
                    setShowAddModal(false)
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}
        {showDeleteModal && (
          <Modal
            title={`Delete ${customFields[selectedField].title} Field`}
            close={() => {
              setShowDeleteModal(false)
              setSelectedField('')
            }}
          >
            <div className="space-y-6 p-6 text-left">
              <p className="text-base leading-relaxed text-gray-500">
                Are you sure you want to delete the{' '}
                {customFields[selectedField].title} field?
              </p>
              <p className="text-base leading-relaxed text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center space-x-2 rounded-b border-t-2 border-neutral-800 p-6">
              <button
                type="button"
                disabled={deleting}
                className="flex rounded-lg bg-red-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-800 focus:outline-none"
                onClick={() => {
                  setDeleting(true)
                  deleteField(selectedField)
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
                className="rounded-lg px-5 py-2.5 text-sm font-medium focus:z-10 focus:outline-none focus:ring-4 bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-700"
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedField('')
                }}
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </FormProvider>
    </AdminLayout>
  )
}
