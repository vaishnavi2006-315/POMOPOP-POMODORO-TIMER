import { useFocus } from "./store";
import { environments } from "./environments";

export function AmbientBackground() {
  const { settings, env, running, mode } = useFocus();
  const dim = running && mode === "focus";
  const intensity = settings.intensity / 100;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {environments.map((e) => {
        const active = e.id === env.id && !settings.customBg;
        return (
          <div
            key={e.id}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
            style={{ opacity: active ? 1 : 0 }}
          >
            <div className="absolute inset-0" style={{ background: e.gradient }} />
            {e.image ? (
              <div
                className="absolute inset-0 bg-cover bg-center animate-drift"
                style={{ backgroundImage: `url(${e.image})` }}
              />
            ) : null}
          </div>
        );
      })}

      {settings.customBg ? (
        <div
          className="absolute inset-0 bg-cover bg-center animate-drift"
          style={{ backgroundImage: `url(${settings.customBg})` }}
        />
      ) : null}

      {/* brightness + mood veil */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `linear-gradient(180deg, var(--veil-a), var(--veil-b))`,
          opacity: (1 - settings.brightness / 100) * 1.5 + (dim ? 0.25 : 0),
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: `radial-gradient(70% 55% at 50% 45%, ${env.glow}, transparent 70%)`,
          opacity: dim ? 0.9 : 0.55,
        }}
      />

      {/* rain */}
      {settings.rain ? (
        <div
          className="absolute -inset-[10%] animate-[rainfall_1.1s_linear_infinite]"
          style={{
            opacity: 0.22 * intensity + 0.08,
            backgroundImage:
              "repeating-linear-gradient(102deg, oklch(1 0 0 / 0.5) 0px, oklch(1 0 0 / 0.5) 1px, transparent 1px, transparent 7px)",
            maskImage: "linear-gradient(180deg, transparent, black 20%, black 80%, transparent)",
          }}
        />
      ) : null}

      {/* floating particles / motes */}
      {settings.particles && env.particles !== "none" ? (
        <div
          className="absolute -inset-[20%] animate-[motes_38s_linear_infinite]"
          style={{
            opacity: 0.5 * intensity,
            backgroundImage:
              "radial-gradient(2px 2px at 12% 22%, oklch(1 0 0 / 0.7), transparent), radial-gradient(2px 2px at 68% 12%, oklch(1 0 0 / 0.5), transparent), radial-gradient(3px 3px at 34% 74%, oklch(1 0 0 / 0.45), transparent), radial-gradient(2px 2px at 82% 62%, oklch(1 0 0 / 0.6), transparent), radial-gradient(2px 2px at 52% 44%, oklch(1 0 0 / 0.4), transparent)",
            backgroundSize: "600px 600px",
          }}
        />
      ) : null}

      {/* window reflection / lamp flicker */}
      <div
        className="absolute inset-0 animate-flicker"
        style={{
          background:
            "radial-gradient(45% 35% at 82% 12%, oklch(0.9 0.12 70 / 0.16), transparent 70%)",
        }}
      />

      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_45%,oklch(0_0_0/0.55))]" />
    </div>
  );
}
