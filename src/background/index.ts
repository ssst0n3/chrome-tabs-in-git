// Sample code if using extensionpay.com
// import { extPay } from 'src/utils/payment/extPay'
// extPay.startBackground()

import { openGroupTabs } from "src/background/openTabs"

chrome.action.onClicked.addListener((tab) => {
  chrome.runtime.openOptionsPage()
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("[DEBUG] message=", message)
  if (message.action === "open-tabs") {
    openGroupTabs(message.data).then((r) => sendResponse())
    return true // Ensure the listener returns a boolean
  }
  return false // Return false if the message type doesn't match
})

chrome.runtime.onInstalled.addListener(async (opt) => {
  // Check if reason is install or update. Eg: opt.reason === 'install' // If extension is installed.
  // opt.reason === 'update' // If extension is updated.
  if (opt.reason === "install") {
    chrome.tabs.create({
      active: true,
      // Open the setup page and append `?type=install` to the URL so frontend
      // can know if we need to show the install page or update page.
      // url: chrome.runtime.getURL("src/ui/setup/index.html#/setup/install"),
      url: chrome.runtime.getURL("src/ui/action-popup/index.html"),
    })

    return
  }

  if (opt.reason === "update") {
    chrome.tabs.create({
      active: true,
      // url: chrome.runtime.getURL("src/ui/setup/index.html#/setup/update"),
      url: chrome.runtime.getURL("src/ui/action-popup/index.html"),
    })

    return
  }
})

self.onerror = function (message, source, lineno, colno, error) {
  console.info("Error: " + message)
  console.info("Source: " + source)
  console.info("Line: " + lineno)
  console.info("Column: " + colno)
  console.info("Error object: " + error)
}

console.info("hello world from background")

export {}
