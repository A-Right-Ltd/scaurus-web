import scaurusMarkUrl from "@/assets/images/scaurus-mark.png";

interface MarkProps {
  size?: number;
  dark?: boolean;
  className?: string;
}

const BRAND_FONT = "'Outfit', sans-serif";

/**
 * The official SCAURUS mark. Source artwork is white line-work with dark
 * isometric faces on a transparent background. On dark surfaces it is shown
 * as-is (white); on light surfaces it is inverted to a clean black mark.
 */
export function ScaurusMark({ size = 40, dark = true, className }: MarkProps) {
  return (
    <img
      src={scaurusMarkUrl}
      alt="SCAURUS"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        filter: dark ? "none" : "invert(1)",
      }}
    />
  );
}

/**
 * Engine sub-mark (Q / D / P). A refined isometric hexagon frame with corner
 * nodes — echoing the SCAURUS mark's hexagon-and-nodes structure — wrapped
 * around a bold engine letter.
 */
export function HexMark({
  letter,
  size = 56,
  dark = true,
  className,
}: MarkProps & { letter: string }) {
  const ink = dark ? "#f5f5f5" : "#0a0a0a";
  const outer = "32,5 55,18.5 55,45.5 32,59 9,45.5 9,18.5";
  const inner = "32,14.5 46.5,23 46.5,41 32,49.5 17.5,41 17.5,23";
  const nodes: [number, number][] = [
    [32, 5],
    [55, 18.5],
    [55, 45.5],
    [32, 59],
    [9, 45.5],
    [9, 18.5],
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`SCAURUS ${letter}`}
    >
      {/* outer hexagon frame */}
      <polygon
        points={outer}
        fill="none"
        stroke={ink}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* inner hexagon for isometric depth */}
      <polygon
        points={inner}
        fill="none"
        stroke={ink}
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.22"
      />
      {/* corner nodes */}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill={ink} />
      ))}
      {/* engine letter */}
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fill={ink}
        fontFamily={BRAND_FONT}
        fontWeight="800"
        fontSize="23"
        letterSpacing="-0.5"
      >
        {letter}
      </text>
    </svg>
  );
}

export function ScaurusWordmark({
  size = 28,
  dark = true,
  className,
}: MarkProps) {
  const ink = dark ? "#f5f5f5" : "#0a0a0a";
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <ScaurusMark size={size} dark={dark} />
      <span
        style={{
          fontFamily: BRAND_FONT,
          color: ink,
          fontWeight: 800,
          letterSpacing: "0.18em",
        }}
        className="text-base"
      >
        SCAURUS
      </span>
    </div>
  );
}
