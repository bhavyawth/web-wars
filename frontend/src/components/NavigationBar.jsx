import React, { useEffect, useRef, useState } from 'react';
import { Menu, X, Home, ShoppingBag, Info, Phone, Sparkles, Heart, ShoppingBasket, Computer } from 'lucide-react';
import useAuthUser from '../hooks/useAuthUser';


export default function ArtisanPremiumNavbar({
  menuItems,
}) {
  const [open, setOpen] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const rootRef = useRef(null);

  const {isLoading,authUser,type}=useAuthUser()
  const menu = menuItems ?? [
    { label: 'Home', icon: <Home size={18} />, href: '/' },
    { label: 'Shop', icon: <ShoppingBag size={18} />, href: '/market' },
    { label: 'Cart', icon: <ShoppingBasket size={18} />, href: '/cart' },
    { label: `Explore`, icon: <Computer size={18} />, href: '/market' },
  ];


  useEffect(() => {
    function onEsc(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);


  const createSparkle = (x, y) => {
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
    };
    setSparkles(prev => [...prev, newSparkle]);
    
    setTimeout(() => {
      setSparkles(prev => prev.filter(sparkle => sparkle.id !== newSparkle.id));
    }, 800);
  };


  const handleButtonClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create sparkles around the button
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const angle = (i / 6) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        createSparkle(x, y);
      }, i * 50);
    }
    
    setOpen(v => !v);
  };


  return (
    <>
      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="fixed w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full pointer-events-none z-[60] animate-ping"
          style={{
            left: sparkle.x,
            top: sparkle.y,
          }}
        />
      ))}


      <div
        ref={rootRef}
        className="fixed bottom-8 right-8 z-50 flex items-end justify-end px-4"
      >
        {/* Expanding horizontal bar with artisan theme - now expands from right to left */}
        <div className={`absolute bottom-0 right-16 transition-all duration-500 ease-out origin-right ${
          open 
            ? 'opacity-100 scale-x-100 scale-y-100' 
            : 'opacity-0 scale-x-0 scale-y-75 pointer-events-none'
        }`}>
          <div className="relative rounded-full shadow-2xl px-8 py-3 flex items-center justify-center gap-6 backdrop-blur-xl bg-gradient-to-r from-indigo-600/90 via-purple-600/90 to-pink-600/90 border border-white/20">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 animate-pulse"></div>
            
            {/* Floating particles in navbar */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-8 w-1 h-1 bg-white/40 rounded-full animate-bounce"></div>
              <div className="absolute top-3 right-12 w-0.5 h-0.5 bg-pink-300/60 rounded-full animate-bounce delay-300"></div>
              <div className="absolute bottom-2 left-16 w-0.5 h-0.5 bg-purple-300/60 rounded-full animate-bounce delay-700"></div>
            </div>


            <nav className="relative z-10 flex gap-1 items-center">
              {menu.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className={`group relative flex items-center gap-2 font-medium rounded-full px-4 py-2.5 text-white/90 cursor-pointer overflow-hidden select-none transition-all duration-300 hover:text-white hover:bg-white/10 hover:shadow-lg hover:scale-105 ${
                    open ? `animate-fade-in-right delay-${i * 50}` : ''
                  }`}
                  style={{
                    animationDelay: `${(i * 0.05) + 0.1}s`
                  }}
                >
                  <span className="transition-all duration-300 group-hover:scale-110 group-hover:animate-pulse">
                    {item.icon}
                  </span>
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                  
                  {/* Premium shimmer effect */}
                  <div className="absolute inset-0 -top-px -bottom-px rounded-full overflow-hidden">
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 transition-all duration-700 group-hover:left-full"></div>
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-pink-400/20 group-hover:via-purple-400/20 group-hover:to-pink-400/20 transition-all duration-300"></div>
                </a>
              ))}
            </nav>
          </div>
        </div>


        {/* Premium floating trigger button - now positioned on the right */}
        <button
          onClick={handleButtonClick}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className={`relative z-20 h-16 w-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ease-out overflow-hidden group ${
            open ? '-translate-x-8 scale-75' : 'translate-x-0 scale-100 hover:scale-110'
          }`}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          }}
        >
          {/* Animated background layers */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          
          {/* Rotating ring */}
          <div className={`absolute inset-0 rounded-full border-2 border-white/30 transition-all duration-700 ${
            open ? 'animate-spin' : ''
          }`}></div>
          
          {/* Icon with smooth rotation */}
          <div className={`relative z-10 text-white transition-all duration-500 ${
            open ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
          }`}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </div>
          
          {/* Sparkle icon when closed */}
          {!open && (
            <div className="absolute top-1 right-1 text-white/60 animate-pulse">
              <Sparkles size={12} />
            </div>
          )}
          
          {/* Premium shine effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/20 rounded-full blur-sm animate-pulse"></div>
          </div>
        </button>
      </div>


      <style jsx>{`
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.4s ease-out forwards;
        }
        
        .delay-0 { animation-delay: 0ms; }
        .delay-50 { animation-delay: 50ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </>
  );
}
