import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Wellness from "./pages/Wellness";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0d1a] text-white font-sans">
        <Navigation />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/wellness" element={<Wellness />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
