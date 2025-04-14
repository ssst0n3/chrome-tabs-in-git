import { TabGroup } from "src/interface/tabs"

export function openGroupTabs(tabGroups: TabGroup[]): void {
  tabGroups.forEach(async (tabGroup) => {
    if (tabGroup.open) {
      const tabIds: number[] = []
      for (const tab of tabGroup.tabs) {
        const createdTab = await chrome.tabs.create({ url: tab.url })
        if (createdTab.id !== undefined) {
          tabIds.push(createdTab.id)
        }
      }
      if (tabIds.length > 0) {
        const groupId = await chrome.tabs.group({
          tabIds: tabIds as [number, ...number[]],
        })
        await chrome.tabGroups.update(groupId, {
          title: tabGroup.title,
          collapsed: tabGroup.collapsed,
        })
      }
    }
  })
}
