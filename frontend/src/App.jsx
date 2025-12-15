import { GoogleOAuthProvider } from "@react-oauth/google";
import { Route, Routes } from "react-router-dom";

import { Login } from "./components";
import Home from "./container/Home";

export default function App() {

  // Allow guest browsing - no redirect needed

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_API_TOKEN}
    >
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}
