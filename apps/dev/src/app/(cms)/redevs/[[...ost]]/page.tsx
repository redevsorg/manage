import 'redevs/outstatic.css'
import { Outstatic } from 'redevs'
import { OstClient } from 'redevs/client'

export default async function Page({ params }: { params: { ost: string[] } }) {
  const ostData = await Outstatic()
  return <OstClient ostData={ostData} params={params} />
}
