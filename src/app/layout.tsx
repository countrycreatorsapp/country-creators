import './globals.css'

export const metadata = {
  title: 'Country Creators',
  description: 'Gamified Classroom Economy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
