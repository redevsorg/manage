import { envVars } from '@/utils/envVarsCheck'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Image from 'next/image'

type WelcomeProps = {
  variables: {
    required: {
      [key: string]: boolean
    }
    optional: {
      [key: string]: boolean
    }
  }
}

export default function Welcome({ variables }: WelcomeProps) {
  return (
    <>
      <div id="outstatic">
        <main className="relative flex h-screen bg-black flex-col items-center justify-center z-10 p-4">
          <h1 className="mb-8 text-center text-xl font-semibold text-white border-2 px-6 p-2 rounded-full border-neutral-800">
            <Image
              src="https://redevs.org/redevs.svg"
              alt=""
              width={150}
              height={100}
              className="invert"
            />
          </h1>
          <div className="mb-20 max-w-2xl p-8 px-4 md:p-8 text-white bg-black rounded-lg border-2 border-neutral-800 shadow-md">
            <p className="mb-5">
              Before you can access the Redevs Panel, make sure the following
              environment variables are set up:
            </p>
            <ul className="mb-5">
              {Object.entries(variables.required).map(([key, value]) => (
                <li key={key} className="mb-1">
                  {`${value ? '✅' : '❌'} Variable`}{' '}
                  <span className="font-semibold">{key}</span>{' '}
                  {`is ${value ? 'set.' : 'missing!'}`}
                </li>
              ))}
            </ul>
            {!variables.optional.OST_CONTENT_PATH && (
              <p className="mb-5 p-2 bg-neutral-800 rounded">
                Optional variable{' '}
                <span className="font-semibold">OST_CONTENT_PATH</span> defines
                where your content is saved.
                <br />
                Defaulting to <code>outstatic/content</code>
              </p>
            )}
            {!variables.optional.OST_REPO_OWNER && (
              <p className="mb-5 p-2 bg-neutral-800 rounded">
                Optional variable{' '}
                <span className="font-semibold">OST_REPO_OWNER</span> is not
                set.
                <br />
                Defaulting to your GitHub username.
              </p>
            )}
            <p>You may need to restart Next.js to apply the changes.</p>
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  if (!envVars.hasMissingEnvVars) {
    context.res.writeHead(302, {
      Location: '/outstatic'
    })
    context.res.end()
  }

  return {
    props: {
      variables: envVars.envVars
    }
  }
}
