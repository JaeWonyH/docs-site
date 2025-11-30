import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  children: string;
}

export default function Mermaid({ children }: MermaidProps): JSX.Element {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isClient) {
      mermaid.contentLoaded();
    }
  }, [isClient]);

  if (!isClient) {
    return <pre>{children}</pre>;
  }

  return (
    <div className="mermaid">
      {children}
    </div>
  );
}
