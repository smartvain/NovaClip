export interface VideoSidebarProps {
  isOpen: boolean
  isLoading: boolean
  videoList: string[]
  onToggle: () => void
  onRefresh: () => void
  onSelectVideo: (url: string) => void
}
