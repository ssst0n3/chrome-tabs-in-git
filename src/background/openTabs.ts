import { TabGroup } from "src/interface/tabs"

export async function openGroupTabs(tabGroups: TabGroup[]): Promise<void> {
  const windowIdMap = new Map<number, number>()

  for (const tabGroup of tabGroups) {
    if (tabGroup.open) {
      let newWindowTabID: number = -1
      let windowID: number | undefined = windowIdMap.get(tabGroup.windowId)
      if (windowID === undefined) {
        const windowExists =
          tabGroup.windowId !== undefined
            ? (await chrome.windows.getAll()).some(
                (window) => window.id === tabGroup.windowId,
              )
            : false

        if (windowExists) {
          windowID = tabGroup.windowId
        } else {
          const newWindow = await chrome.windows.create()
          newWindowTabID = newWindow?.tabs?.[0]?.id || -1
          windowID = newWindow?.id
        }

        if (windowID !== undefined && tabGroup.windowId !== undefined) {
          windowIdMap.set(tabGroup.windowId, windowID)
        }
      }

      if (tabGroup.id === -1) {
        await createTabsUngrouped(tabGroup, windowID)
      } else {
        await createTabsGroup(tabGroup, windowID)
      }
      if (newWindowTabID !== -1) {
        await chrome.tabs.remove(newWindowTabID)
      }
    }
  }
}

async function createTabsGroup(
  tabGroup: TabGroup,
  windowID: number | undefined,
) {
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
      color: tabGroup.color,
    })
  }
}

async function createTabsUngrouped(
  tabGroup: TabGroup,
  windowID: number | undefined,
) {
  for (const tab of tabGroup.tabs) {
    await chrome.tabs.create({
      url: tab.url,
      windowId: windowID,
    })
  }
}
