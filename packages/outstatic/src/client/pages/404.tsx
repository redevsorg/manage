import Image from 'next/image'
export default function FourOhFour() {
  return (
    <>
      <div id="outstatic">
        <main className="relative flex h-screen flex-col items-center justify-center z-10 p-4 bg-black">
          <h1 className="mb-8 text-center text-xl font-semibold text-white border-2 px-6 p-2 rounded-full border-neutral-800">
            <Image
              src="https://redevs.org/redevs.svg"
              alt=""
              width={150}
              height={100}
              className="invert"
            />
          </h1>
          <div className="text-center mb-20 flex max-w-2xl flex-col items-center p-8 px-4 md:p-8 text-white bg-black rounded-lg border-2 border-neutral-800 shadow-md">
            <p className="text-2xl">404 - Nothing here...</p>
          </div>
        </main>
      </div>
    </>
  )
}
