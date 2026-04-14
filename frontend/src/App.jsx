import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import CreateGame from "./pages/CreateGame.jsx";
import BrowseGames from "./pages/BrowseGames.jsx";
import PlayGame from "./pages/PlayGame.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><RedirectToSignIn /></SignedOut>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: "var(--vault-bg)" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<ProtectedRoute><CreateGame /></ProtectedRoute>} />
          <Route path="/browse" element={<ProtectedRoute><BrowseGames /></ProtectedRoute>} />
          <Route path="/play/:id" element={<ProtectedRoute><PlayGame /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
