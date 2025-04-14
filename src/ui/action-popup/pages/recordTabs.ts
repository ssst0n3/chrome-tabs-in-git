import { Tab, TabGroup } from "src/interface/tabs"
import {download} from "src/utils/file"


export async function recordTabs(): Promise<void> {
  try {
    // Retrieve tabs grouped by Chrome's tab groups
    const tabs = await chrome.tabs.query({})
    const groups = await chrome.tabGroups.query({})

    const tabGroups: TabGroup[] = groups.map((group) => {
      return {
        id: group.id,
        title: group.title,
        collapsed: group.collapsed,
        color: group.color,
        windowId: group.windowId,
        open: true,
        tabs: tabs
          .filter((tab) => tab.groupId === group.id)
          .map((tab) => ({
            title: tab.title || "",
            url: tab.url || "",
            group: group.title || "Ungrouped",
          } as Tab)),
      } as TabGroup;
    })

    const jsonContent = JSON.stringify(tabGroups, null, 2)
    await download(jsonContent, "tabs.json")
  } catch (error) {
    console.error("Failed to record tabs:", error)
  }
}
