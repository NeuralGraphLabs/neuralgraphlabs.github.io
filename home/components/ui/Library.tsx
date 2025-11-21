import React from 'react';
import { useInView } from '../../hooks/useAnimation';

// -- Animation Wrapper --
interface FadeProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'none';
}

export const FadeIn: React.FC<FadeProps> = ({ children, delay = 0, className = "", direction = 'up' }) => {
  const [ref, isVisible] = useInView({ threshold: 0.1 });

  const translateClass = direction === 'up' ? 'translate-y-8' : 'translate-y-0';
  
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : `opacity-0 ${translateClass}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

// -- Button --
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-full text-sm tracking-wide font-medium transition-all duration-300 ease-in-out";
  
  const variants = {
    primary: "bg-sunflower-500 text-white hover:bg-sunflower-600 hover:shadow-lg shadow-sunflower-500/30",
    outline: "border border-gray-300 text-gray-600 hover:border-sunflower-500 hover:text-sunflower-500",
    ghost: "text-gray-500 hover:text-sunflower-500"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// -- Pill --
interface PillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const Pill: React.FC<PillProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-2 rounded-full text-sm transition-all duration-500
        ${isActive 
          ? 'bg-gray-900 text-white shadow-xl scale-105' 
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900'
        }
      `}
    >
      {label}
    </button>
  );
};

// -- Card --
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white p-8 border border-gray-100 hover:border-sunflower-500/30 transition-colors duration-500 ${className}`}>
      {children}
    </div>
  );
};