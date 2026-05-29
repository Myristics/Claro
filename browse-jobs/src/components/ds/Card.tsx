import React from 'react';
import styles from './Card.module.css';

type CardPadding = 'none' | 'sm' | 'md';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  padding?: CardPadding;
  hoverable?: boolean;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function Card({
  children,
  className,
  padding = 'none',
  hoverable = false,
  style,
  onClick,
}: CardProps) {
  const classes = [
    styles.card,
    styles[`padding-${padding}`],
    hoverable ? styles.hoverable : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={[styles.header, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

interface CardBodyProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return (
    <div className={[styles.body, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export default Card;
