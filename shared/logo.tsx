// Brand mark — real asset (public/logo.png), not a redrawn approximation.
import Image from "next/image";

const WIDTH_PX = { sm: 112, md: 160, lg: 260 };

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const width = WIDTH_PX[size];
  return (
    <Image
      src="/logo.png"
      alt="Copero Análise"
      width={459}
      height={163}
      className="brand-logo"
      style={{ width, height: "auto", display: "block" }}
      priority={size === "lg"}
      data-testid="logo"
    />
  );
}
