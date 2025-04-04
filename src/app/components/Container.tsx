import { ReactNode } from 'react';

// Define props for the Container component
interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string; // Add the optional id prop
}

export default function Container({ children, className = '', id }: ContainerProps) {
  return (
    <div id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
