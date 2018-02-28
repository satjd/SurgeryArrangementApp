export function export2Json(data, name) {
  const dataStr = JSON.stringify(data)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const dataUri = URL.createObjectURL(blob)

  if (navigator.msSaveOrOpenBlob) {
    // Works for Internet Explorer and Microsoft Edge
    navigator.msSaveOrOpenBlob(blob, name)
  } else {
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', name)
    linkElement.click()
  }
}
