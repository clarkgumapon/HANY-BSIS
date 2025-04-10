import type React from "react"

export function PantsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 3h10l-1 16h-8L7 3z" />
      <path d="M12 3v16" />
      <path d="M7 19h4" />
      <path d="M13 19h4" />
    </svg>
  )
}

