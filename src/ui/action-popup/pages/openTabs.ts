import { TabGroup } from "src/interface/tabs"

let uploadedConfig: TabGroup[] = []

// read a config file from user's upload and open the urls in the browser
function getConfigTabs(): TabGroup[] {
  return uploadedConfig.length > 0
    ? uploadedConfig
    : [
        {
          id: "example-group",
          title: "Example Group",
          collapsed: false,
          color: "blue",
          windowId: 1,
          open: true,
          tabs: [
            {
              title: "Example Tab",
              url: "https://example.com",
              group: "Example Group",
            },
          ],
        },
      ]
}

export async function handleFileUpload(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const result = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          resolve(e.target?.result as string)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })

    try {
      uploadedConfig = JSON.parse(result)
    } catch (error) {
      console.error("Invalid configuration file:", error)
    }
  }
}

export function openTabs(): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json"; // Accept only JSON files
  input.style.display = "none"; // Hide the input element
  input.onchange = async (event) => {
    await handleFileUpload(event);
    const tabs = getConfigTabs();
    // openGroupTabs(tabs);
    await chrome.runtime.sendMessage({ action: "open-tabs", data: tabs })
  };

  // Append the input to the body
  document.body.appendChild(input);

  // Trigger the file input click programmatically
  input.click();
}