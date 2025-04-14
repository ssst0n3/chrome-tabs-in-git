import { Tab } from "src/interface/tabs"
import {download} from "src/utils/file"

export async function recordTabs(): Promise<void> {
  try {
    // Retrieve tabs grouped by Chrome's tab groups
    const tabs = await chrome.tabs.query({})
    const groups = await chrome.tabGroups.query({})
    const tabInfos:Tab[] = tabs.map((tab) => {
      const group = groups.find((g) => g.id === tab.groupId)
      return {
        title: tab.title || "",
        url: tab.url || "",
        group: group ? group.title : "Ungrouped",
        open: true,
      } as Tab
    })
    const jsonContent = JSON.stringify(tabInfos, null, 2)
    await download(jsonContent, "tabs.json")
  } catch (error) {
    console.error("Failed to record tabs:", error)
  }
}
