import React, { useState, useEffect } from 'react';
import { TimelineLoading } from '@/components/ui/timeline-loading';

export function withPageLoading<P extends object>(Component: React.ComponentType<P>) {
  return function WithPageLoading(props: P) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // This is just a fallback in case onComplete fails to trigger
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Increased timeout to ensure animation completes

      return () => clearTimeout(timer);
    }, []);

    const handleLoadingComplete = () => {
      setIsLoading(false);
    };

    if (isLoading) {
      return <TimelineLoading fullScreen={true} onComplete={handleLoadingComplete} duration={800} />;
    }

    return <Component {...props} />;
  };
}