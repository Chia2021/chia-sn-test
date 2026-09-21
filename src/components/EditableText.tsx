import React from 'react';
import { Edit3 } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface EditableTextProps {
  translationKey: string;
  label?: string;
  className?: string;
  children?: React.ReactNode;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

export function EditableText({
  translationKey,
  label,
  className = '',
  children,
  as: Component = 'span',
}: EditableTextProps) {
  const { isAdmin, isInlineEditActive, triggerQuickEdit } = useCMS();

  if (!isAdmin || !isInlineEditActive) {
    return <Component className={className}>{children}</Component>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerQuickEdit(translationKey, label || translationKey);
  };

  return (
    <Component
      onClick={handleClick}
      title={`Cliquer pour modifier "${label || translationKey}"`}
      className={`${className} group relative inline-block cursor-pointer outline-dashed outline-1 outline-amber-400/80 hover:outline-2 hover:outline-amber-500 rounded px-1 transition-all bg-amber-400/10 hover:bg-amber-400/20`}
    >
      {children}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-3 -right-3 z-30 p-1 bg-amber-500 text-slate-950 rounded-full shadow-md pointer-events-none">
        <Edit3 className="w-2.5 h-2.5" />
      </span>
    </Component>
  );
}
