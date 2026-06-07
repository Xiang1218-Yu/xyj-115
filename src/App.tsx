import { Suspense, lazy, ComponentType } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnimatedPage from "@/components/AnimatedPage";

const Home = lazy(() => import("@/pages/Home"));
const Market = lazy(() => import("@/pages/Market"));
const ToolDetail = lazy(() => import("@/pages/ToolDetail"));
const Subscriptions = lazy(() => import("@/pages/Subscriptions"));
const Team = lazy(() => import("@/pages/Team"));
const Profile = lazy(() => import("@/pages/Profile"));
const Referral = lazy(() => import("@/pages/Referral"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[400px]"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">加载中...</p>
      </div>
    </motion.div>
  );
}

function withAnimation<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AnimatedComponent(props: P) {
    return (
      <AnimatedPage>
        <WrappedComponent {...props} />
      </AnimatedPage>
    );
  };
}

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
                <AnimatedReferral />
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
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
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
