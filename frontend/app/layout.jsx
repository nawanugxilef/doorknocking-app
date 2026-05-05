import '../src/index.css'

export const metadata = {
  title: 'Doorknock PWA',
  description: 'Door-knocking campaign management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
