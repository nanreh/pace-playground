import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import App from './App';
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";

const Index = () => {
    const onSplits = useLocation().pathname === '/';
    // The splits are created on the first visit to them and then kept, hidden, while another page
    // is showing. That way the distance, time and any adjusted splits are still there on the way back.
    const [splitsStarted, setSplitsStarted] = useState(onSplits);
    if (onSplits && !splitsStarted) {
        setSplitsStarted(true);
    }

    return <>
        <Toolbar />
        {splitsStarted && (
            <div style={{ display: onSplits ? undefined : 'none' }}>
                <App />
            </div>
        )}
        <Outlet />
        <Footer />
    </>
}

export default Index;
