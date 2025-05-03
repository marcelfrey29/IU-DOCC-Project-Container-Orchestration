import { Route, Routes } from "react-router-dom";

import AboutPage from "@/pages/about";
import IndexPage from "@/pages/index";
import NotFoundPage from "./pages/404";
import ImprintPage from "./pages/imprint";
import PrivacyPage from "./pages/privacy";
import TravelGuideDetailPage from "./pages/travel-guide";
import TravelGuidesListPage from "./pages/travel-guides-list";

function App() {
    return (
        <Routes>
            <Route element={<IndexPage />} path="/" />
            <Route element={<TravelGuidesListPage />} path="/travel-guides" />
            <Route
                element={<TravelGuideDetailPage />}
                path="/travel-guides/:id"
            />
            <Route element={<AboutPage />} path="/about" />
            {/* 404 Fallback */}
            <Route element={<PrivacyPage />} path="/privacy" />
            <Route element={<ImprintPage />} path="/imprint" />
            {/* 404 Fallback */}
            <Route element={<NotFoundPage />} path="/*" />
        </Routes>
    );
}

export default App;
