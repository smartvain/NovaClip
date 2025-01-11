import { Provider } from '@/components/ui/provider'
import { VideoConverter } from '@/components/ui/video-converter'

export default function Home() {
  return (
    <Provider>
      <VideoConverter />
    </Provider>
  )
}
