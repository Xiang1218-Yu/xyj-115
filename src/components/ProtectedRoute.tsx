import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, navigate, location]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md w-full mx-4 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">需要登录</h3>
          <p className="text-gray-400 mb-6">请登录后访问此页面</p>
          <button
            onClick={() => navigate('/login', { state: { from: location.pathname } })}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            去登录
          </button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
