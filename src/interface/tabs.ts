export interface Tab {
  url: string
  title: string
  group: string
  // open: boolean
}

export interface TabGroup {
  id: number
  title: string
  collapsed: boolean
  color: string
  windowId: number
  open: boolean
  tabs: Tab[]
}
