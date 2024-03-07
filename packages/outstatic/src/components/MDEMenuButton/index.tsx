import { Editor } from '@tiptap/react'

type MDEMenuButtonProps = {
  editor: Editor
  onClick: () => void
  children: React.ReactNode
  name: string
  disabled?: boolean
  attributes?: {} | undefined
  tag?: keyof JSX.IntrinsicElements
  htmlFor?: string
}

const MDEMenuButton = ({
  onClick,
  editor,
  children,
  name,
  disabled = false,
  attributes = {},
  tag = 'button',
  htmlFor
}: MDEMenuButtonProps) => {
  const Tag = tag
  const inputProps = {} as any
  if (htmlFor) {
    inputProps.htmlFor = htmlFor
  }
  return (
    <Tag
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={name}
      className={`group border-r border-neutral-800 py-4 px-4 last-of-type:border-r-0 disabled:cursor-not-allowed disabled:hover:bg-neutral-700 ${
        editor.isActive(name, attributes)
          ? 'is-active bg-black'
          : 'bg-neutral-800 text-white hover:bg-neutral-900'
      }`}
      disabled={disabled}
      {...inputProps}
    >
      {children}
    </Tag>
  )
}

export default MDEMenuButton
