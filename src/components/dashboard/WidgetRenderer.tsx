import React from 'react';
import type { WidgetProps } from './types';
import { getWidgetComponent } from './registry';

interface WidgetRendererProps extends WidgetProps {
  fallback?: React.ComponentType<WidgetProps>;
}

const DefaultFallback: React.FC<WidgetProps> = ({ widget, className }) => {
  return (
    <div className={`p-4 bg-card border border-border rounded-xl ${className || ''}`}>
      <div className="text-sm font-medium text-foreground mb-2">{widget.title}</div>
      <div className="h-32 flex items-center justify-center border border-dashed border-border rounded-lg">
        <div className="text-center text-muted-foreground">
          <div className="text-lg mb-1">📦</div>
          <div className="text-sm">Unsupported Widget</div>
          <div className="text-xs mt-1">Type: {widget.type}</div>
        </div>
      </div>
    </div>
  );
};

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  data,
  className,
  fallback: FallbackComponent = DefaultFallback,
}) => {
  const WidgetComponent = getWidgetComponent(widget.type);

  if (!WidgetComponent) {
    return <FallbackComponent widget={widget} data={data} className={className} />;
  }

  return <WidgetComponent widget={widget} data={data} className={className} />;
};
