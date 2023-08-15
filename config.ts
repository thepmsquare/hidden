interface Config {
  defaultThemeState: { theme: ["dark" | "light"] };
  step2FileNameLength: { max: number; visibleEnds: number };
}
const config: Config = {
  defaultThemeState: { theme: ["dark"] },
  step2FileNameLength: { max: 20, visibleEnds: 8 },
};

export default config;
