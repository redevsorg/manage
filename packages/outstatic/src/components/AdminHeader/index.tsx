import Link from '@/components/Link'
import { useOstSignOut } from '@/utils/auth/hooks'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
type AdminHeaderProps = {
  name?: string | null | undefined
  email?: string | null | undefined
  image?: string | null | undefined
  status?: 'authenticated' | 'unauthenticated' | 'loading'
  toggleSidebar: () => void
}

const AdminHeader = ({
  name,
  email,
  image,
  status,
  toggleSidebar
}: AdminHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useOstSignOut()

  return (
    <>
      <nav className="relative border-b-2 border-neutral-800 bg-black px-2 py-2.5 sm:px-4 h-14">
        <div className="mx-auto flex flex-wrap items-center justify-between">
          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            className="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-neutral-100 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 lg:hidden"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open main menu</span>
            <Menu />
          </button>
          <Link href="/outstatic" aria-label="Outstatic">
            <div className="cursor-pointer flex items-center">
              <Image
                src="https://redevs.org/redevs.svg"
                alt=""
                width={100}
                height={70}
                className="invert"
              />
            </div>
          </Link>
          {status === 'loading' || (
            <div className="flex items-center md:order-2">
              <button
                type="button"
                className="mr-3 flex items-center rounded-full bg-neutral-800 text-sm focus:ring-4 focus:ring-neutral-800 md:mr-0"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="dropdown"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-8 w-8 rounded-full"
                  src={image || ''}
                  alt="user"
                />
              </button>
              <div
                className={`right-0 top-[60px] z-50 my-4 w-full list-none divide-y-2 divide-neutral-800 rounded-br rounded-bl bg-black text-base shadow md:-right-0 md:top-[52px] md:w-auto ${
                  isOpen ? 'block' : 'hidden'
                }`}
                id="dropdown"
                style={{
                  position: 'absolute',
                  margin: '0px'
                }}
              >
                <div className="py-3 px-4">
                  <span className="block text-sm text-white">{name}</span>
                  <span className="block truncate text-sm font-medium text-neutral-400">
                    {email}
                  </span>
                </div>
                <ul className="py-1" aria-labelledby="dropdown">
                  <li>
                    <a
                      className="block cursor-pointer py-2 px-4 text-sm text-neutral-400 hover:bg-neutral-800"
                      onClick={signOut}
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default AdminHeader
