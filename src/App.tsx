import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnimatedPage from "@/components/AnimatedPage";
import withAnimation from "@/components/withAnimation";
import Home from "@/pages/Home";
import Market from "@/pages/Market";
import ToolDetail from "@/pages/ToolDetail";
import Subscriptions from "@/pages/Subscriptions";
import Team from "@/pages/Team";
import Profile from "@/pages/Profile";
import Referral from "@/pages/Referral";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/NotFound";

const AnimatedHome = withAnimation(Home);
const AnimatedMarket = withAnimation(Market);
const AnimatedToolDetail = withAnimation(ToolDetail);
const AnimatedReferral = withAnimation(Referral);
const AnimatedLogin = withAnimation(Login);
const AnimatedRegister = withAnimation(Register);
const AnimatedNotFound = withAnimation(NotFound);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedHome />} />
        <Route path="/market" element={<AnimatedMarket />} />
        <Route path="/tool/:id" element={<AnimatedToolDetail />} />
        <Route 
          path="/subscriptions" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <Subscriptions />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/team" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <Team />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <Profile />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/referral" 
          element={
            <ProtectedRoute>
              <AnimatedPage>
                <Referral />
              </AnimatedPage>
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<AnimatedLogin />} />
        <Route path="/register" element={<AnimatedRegister />} />
        <Route path="*" element={<AnimatedNotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function Layout() {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register'];
  const showLayout = !noLayoutRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      {showLayout && <Navbar />}
      <main className={showLayout ? 'pt-20' : ''}>
        <AnimatedRoutes />
      </main>
      {showLayout && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
