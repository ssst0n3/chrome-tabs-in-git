export async function download(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  await chrome.downloads.download({
    url,
    filename: filename,
    saveAs: true,
  })

  // Revoke the object URL to free up memory
  URL.revokeObjectURL(url)
}