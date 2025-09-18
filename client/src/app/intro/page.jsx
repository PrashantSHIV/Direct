'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Intro() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showText, setShowText] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Start the animation sequence
    const timer1 = setTimeout(() => {
      setIsAnimating(true);
    }, 500);

    const timer2 = setTimeout(() => {
      setShowText(true);
    }, 1500);

    // Navigate to home after animation completes
    const timer3 = setTimeout(() => {
      router.push('/home');
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-elev-3 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-elev-3 rounded-full opacity-15 animate-bounce"></div>
        <div className="absolute bottom-32 left-40 w-40 h-40 bg-elev-3 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-elev-3 rounded-full opacity-15 animate-bounce"></div>
        
        {/* Subtle gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-accent-blue to-accent-blue rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-accent-blue to-accent-blue rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-accent-blue to-accent-blue rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo/Name Animation */}
        <div className="mb-8">
          <h1 
            className={`text-6xl md:text-8xl lg:text-9xl font-bold text-[#000000d9] transition-all duration-1000 ease-out ${
              isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: '900',
              letterSpacing: '-0.02em'
            }}
          >
            DIRECT
          </h1>
        </div>

        {/* Subtitle Animation */}
        <div 
          className={`transition-all duration-1000 ease-out delay-500 ${
            showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-xl md:text-2xl text-[#00000080] font-medium mb-4">
            Your Personal Life Management System
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-12 w-64 mx-auto">
          <div className="h-1 bg-elev-3 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent-blue rounded-full transition-all duration-3000 ease-out"
              style={{
                width: isAnimating ? '100%' : '0%'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
