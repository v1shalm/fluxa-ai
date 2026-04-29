// Custom geometric icons. Stroke-based, 1.75px stroke, rounded line caps.
// Matches brand spec: minimal, geometric, line-or-solid, consistent stroke, rounded corners.

type IconProps = {
  size?: number;
  className?: string;
};

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function ArrowRight({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlayIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BlockIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function ConnectIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <rect x="2" y="9" width="6" height="6" rx="1.5" />
      <rect x="16" y="9" width="6" height="6" rx="1.5" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function DeployIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <path d="M5 16l7-7 7 7" />
      <path d="M12 9v12" />
      <path d="M5 4h14" />
    </svg>
  );
}

export function AgentIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <circle cx="9" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.25" fill="currentColor" stroke="none" />
      <path d="M12 2v4" />
    </svg>
  );
}

export function DocIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M10 13h6M10 17h4" />
    </svg>
  );
}

export function PipelineIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <circle cx="5" cy="6" r="2" />
      <circle cx="5" cy="18" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 6h6a4 4 0 014 4v0M7 18h6a4 4 0 004-4v0" />
    </svg>
  );
}

export function ToolIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <path d="M3 8h18" />
      <path d="M9 21h6" />
      <path d="M12 17v4" />
    </svg>
  );
}

export function ChatIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <path d="M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2h-7l-5 4v-4H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
    </svg>
  );
}

export function TerminalIcon({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </svg>
  );
}

export function CheckIcon({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

export function MenuIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} className={className} {...baseProps}>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </svg>
  );
}

export function GitHubIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.78 2.72 1.27 3.38.97.1-.75.4-1.27.74-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}
