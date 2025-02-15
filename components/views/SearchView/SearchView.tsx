'use client'

// react:
import {
    // react:
    default as React,
}                           from 'react'

// styles:
import {
    useSearchViewStyleSheets,
}                           from './styles/loader'

// internal components:
import {
    SearchExplorerQuery,
}                           from '@/components/explorers/SearchExplorer/SearchExplorerQuery'



// react components:
const SearchView = (): JSX.Element|null => {
    // styles:
    const styles = useSearchViewStyleSheets();
    
    
    
    // jsx:
    return (
        <div className={styles.main}>
            <SearchExplorerQuery
                // appearances:
                showPaginationTop    = {true}
                showPaginationBottom = {true}
                autoHidePagination   = {true}
                
                
                
                // accessibilities:
                scrollable = {false}
            />
        </div>
    );
};
export {
    SearchView,            // named export for readibility
    SearchView as default, // default export to support React.lazy
}