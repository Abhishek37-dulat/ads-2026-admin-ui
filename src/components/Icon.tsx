// Ops console icon set (ported from admin-shell.jsx). Multi-subpath icons split on 'M'.

const PATHS: Record<string, string> = {
  pulse: "M3 12h3l2-6 4 12 2-6h7",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  tenants: "M3 21V9l6-4 6 4M3 21h18M15 21V11l4-2 2 1.3V21M7 12h2m-2 4h2",
  plug: "M9 3v6m6-6v6M6 9h12v3a6 6 0 0 1-12 0V9Zm6 9v3",
  flow: "M4 5h5v5H4zM15 14h5v5h-5zM9 7h6a2 2 0 0 1 2 2v5M9 7l2-2M9 7l2 2",
  logs: "M5 3h11l3 3v15H5zM9 9h7M9 13h7M9 17h4",
  bell: "M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  flag: "M4 22V4m0 0 4-1 6 2 5-1v10l-5 1-6-2-4 1",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 12h2m14 0h2M12 3v2m0 14v2M5.6 5.6l1.4 1.4m10 10 1.4 1.4m0-13.8-1.4 1.4m-10 10-1.4 1.4",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
  chevron: "M9 6l6 6-6 6",
  collapse: "M11 6l-6 6 6 6M19 6l-6 6 6 6",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
  ext: "M14 3h7v7M21 3l-9 9M10 5H5v14h14v-5",
  refresh: "M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5",
  pause: "M8 5v14M16 5v14",
  play: "M6 4l14 8-14 8V4Z",
  retry: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
  check: "M5 12l5 5L20 6",
  x: "M6 6l12 12M18 6 6 18",
  alert: "M12 9v4m0 4h.01M10.3 4 3.6 16a2 2 0 0 0 1.7 3h13.4a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z",
  filter: "M3 5h18l-7 8v6l-4 2v-8L3 5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2",
  db: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Zm8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3V6m16 6c0 1.7-3.6 3-8 3s-8-1.3-8-3",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  cpu: "M6 6h12v12H6zM9 9h6v6H9zM2 9h4M2 15h4m12-6h4m-4 6h4M9 2v4m6-4v4M9 18v4m6-4v4",
};

export function Icon({ name, size = 17, stroke = 1.6, style }: { name: string; size?: number; stroke?: number; style?: React.CSSProperties }) {
  const d = PATHS[name] || "";
  const subpaths = d.split("M").filter(Boolean).map((s) => "M" + s);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
      {subpaths.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}
