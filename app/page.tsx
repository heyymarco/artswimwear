import type { Metadata } from 'next'
import { PAGE_HOME_TITLE, PAGE_HOME_DESCRIPTION } from '@/website.config'
import HomePageContent from './pageContent'



export const metadata: Metadata = {
    title       : PAGE_HOME_TITLE,
    description : PAGE_HOME_DESCRIPTION,
}



export default function HomePage() {
    // jsx:
    return (
        <>
            <HomePageContent />
        </>
    )
}
