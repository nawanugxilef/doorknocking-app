export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-AU', {
    hour: '2-digit', minute: '2-digit',
  })
}
