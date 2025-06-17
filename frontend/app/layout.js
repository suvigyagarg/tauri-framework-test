import './globals.css'

export const metadata = {
  title: 'Setup Wizard',
  description: 'A wizard-like setup application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900">{children}</body>
    </html>
  )
}
