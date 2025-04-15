import { Tab, TabGroup } from "src/interface/tabs"
import {download} from "src/utils/file"


export async function recordTabs(): Promise<void> {
  try {
    // Retrieve tabs grouped by Chrome's tab groups
    const tabs = await chrome.tabs.query({})
    const groups = await chrome.tabGroups.query({})

    // Handle tabs that are not grouped
    const ungroupedTabs: TabGroup = {
      id: -1, // Use a special ID for ungrouped tabs
      title: "Ungrouped",
      collapsed: false,
      color: "grey",
      windowId: tabs[0]?.windowId || -1,
      open: true,
      tabs: tabs
        .filter((tab) => tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE)
        .map((tab) => ({
          title: tab.title || "",
          url: tab.url || "",
          group: "Ungrouped",
        } as Tab)),
    };

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

    // Include ungrouped tabs if any exist
    if (ungroupedTabs.tabs.length > 0) {
      tabGroups.push(ungroupedTabs);
    }

    const jsonContent = JSON.stringify(tabGroups, null, 2)
    await download(jsonContent, "tabs.json")
  } catch (error) {
    console.error("Failed to record tabs:", error)
  }
}
