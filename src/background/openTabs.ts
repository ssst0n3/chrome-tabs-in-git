import { TabGroup } from "src/interface/tabs"

export function openGroupTabs(tabGroups: TabGroup[]): void {
  const windowIdMap = new Map<number, number>() // Map to track windowId for each tabGroup

  tabGroups.forEach(async (tabGroup) => {
    if (tabGroup.open) {
      let newWindowTabID: number = -1
      let windowID: number | undefined = windowIdMap.get(
        tabGroup.windowId || -1,
      )

      if (!windowID) {
        const windowExists =
          tabGroup.windowId !== undefined
            ? (await chrome.windows.getAll()).some(
                (window) => window.id === tabGroup.windowId,
              )
            : false

        if (windowExists) {
          windowID = tabGroup.windowId
        } else {
          ;(await chrome.windows.create())?.id
          const newWindow = await chrome.windows.create()
          newWindowTabID = newWindow?.tabs?.[0]?.id || -1
          windowID = newWindow?.id
        }

        if (windowID !== undefined && tabGroup.windowId !== undefined) {
          windowIdMap.set(tabGroup.windowId, windowID)
        }
      }

      const tabIds: number[] = []
      for (const tab of tabGroup.tabs) {
        const createdTab = await chrome.tabs.create({
          url: tab.url,
          windowId: windowID,
        })
        if (createdTab.id !== undefined) {
          tabIds.push(createdTab.id)
        }
      }
      if (tabIds.length > 0) {
        const groupId = await chrome.tabs.group({
          tabIds: tabIds as [number, ...number[]],
          createProperties: {
            windowId: windowID,
          },
        })
        await chrome.tabGroups.update(groupId, {
          title: tabGroup.title,
          collapsed: tabGroup.collapsed,
        })
      }
      if (newWindowTabID !== -1) {
        await chrome.tabs.remove(newWindowTabID)
      }
    }
  })
}
