'use client'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from 'next/image'
import { ImgHTMLAttributes, useMemo } from 'react'
import { CustomCode, Pre } from './CustomCode'
import CustomLink from './CustomLink'

const MDXComponentsMap = {
  a: CustomLink,
  Image,
  img: ({ ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
    const src = props.src?.startsWith('http') ? props.src : `/docs/${props.src}`
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img {...props} alt={props.alt} src={src} />
    )
  },
  pre: Pre,
  code: CustomCode
}

export const MDXComponent = (content) => {
  const Component = useMemo(
    () => getMDXComponent(content.content),
    [content.content]
  )

  return (
    <Component
      components={
        {
          ...MDXComponentsMap
        } as any
      }
    />
  )
}

export default MDXComponent
