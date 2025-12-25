import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  image?: string;
  imageAlt?: string;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  title,
  subtitle,
  children,
  className,
  header,
  footer,
  image,
  imageAlt,
}) => {
  const baseClasses = 'bg-white dark:bg-neutral-900 transition-all duration-200';

  const variantClasses = {
    default: 'border border-neutral-200 dark:border-neutral-800',
    elevated: 'border border-transparent',
    outlined: 'border-2 border-neutral-300 dark:border-neutral-700'
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg'
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const classes = twMerge(
    clsx(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      roundedClasses[rounded],
      shadowClasses[shadow],
      className
    )
  );

  return (
    <div className={classes}>
      {image && (
        <div className={`overflow-hidden ${roundedClasses[rounded]}`}>
          <img 
            src={image} 
            alt={imageAlt || ''} 
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      
      {header && (
        <div className={`border-b border-neutral-200 dark:border-neutral-700 ${paddingClasses[padding]}`}>
          {header}
        </div>
      )}

      {(title || subtitle) && (
        <div className={paddingClasses[padding]}>
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className={paddingClasses[padding]}>
        {children}
      </div>

      {footer && (
        <div className={`border-t border-neutral-200 dark:border-neutral-700 ${paddingClasses[padding]}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

// Card with status indicator (like the "By John" with colored dot)
export interface StatusCardProps extends Omit<CardProps, 'footer' | 'children'> {
  status?: {
    color: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
    text: string;
  };
  children?: React.ReactNode;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status, children, ...props }) => {
  const statusColorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };

  const footer = status ? (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${statusColorClasses[status.color]}`} />
      <span className="text-sm text-neutral-600">{status.text}</span>
    </div>
  ) : undefined;

  return <Card {...props} footer={footer}>{children}</Card>;
};

export default Card;
