import { GlobalProvider } from '@/context/GlobalContext'
import React, { ReactNode, Suspense } from 'react'

const CLayoutCharts = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <html lang="en" className="dark">
                <body className="bg-background text-foreground">
                    <Suspense>
                        <GlobalProvider>
                            {children}
                        </GlobalProvider>
                    </Suspense>
                </body>
            </html>
        </>
    )
}

export default CLayoutCharts