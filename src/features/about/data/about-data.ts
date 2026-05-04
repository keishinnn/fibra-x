export const projectPurpose = {
  title: "FibraX: Bitcoin Cycle Ratio Visualizer",
  summary:
    "FibraX is a Bitcoin cycle research dashboard built to visualize phase behavior, Fibonacci ratio zones, and historical analog structure. It maps how each market cycle - from bear bottom to bull peak - relates to prior cycles through ratio-based projections, giving researchers a structured way to explore cycle repetition without relying on deterministic price targets.",
  details: [
    "Visualizes Fibonacci retracement and extension zones across historical BTC cycles.",
    "Maps cycle phases - accumulation, expansion, distribution, and contraction - to ratio-based timelines.",
    "Pulls live BTC price from Coinbase every 60 seconds to position current price within active projection zones.",
    "Presents scenarios as research bands, not guaranteed forecasts.",
  ],
};

export const projectLimitations = [
  {
    title: "Cycle analogs can fail",
    body: "Bitcoin's market structure evolves with each cycle. Institutional adoption, ETF inflows, and macro regime shifts can break historical ratio patterns entirely.",
  },
  {
    title: "Projection zones are scenarios",
    body: "Every band on the chart is a research scenario derived from prior cycle ratios - not a price target, not a trading signal, and not a guarantee of future behavior.",
  },
  {
    title: "Invalidation is always possible",
    body: "Any projection must be re-evaluated when price action breaks outside established zones. FibraX does not auto-invalidate; human review is required.",
  },
  {
    title: "Not financial advice",
    body: "FibraX is a portfolio and research tool. Nothing on this dashboard constitutes investment advice, and it should never be used as the sole basis for financial decisions.",
  },
];

export const developer = {
  name: "Tenshin Ponteres",
  role: "Full-Stack / Frontend Developer",
  bio: "I like building web app projects that make technical ideas easier to explore. FibraX came from my personal interest in Bitcoin cycles, Fibonacci ratios, and market patterns, then turned into a project where I could combine data visualization, clean UI, and feature-based frontend architecture.",
  github: {
    label: "github.com/keishinnn",
    url: "https://github.com/keishinnn",
  },
  builtWith: [
    "Next.js App Router",
    "TypeScript",
    "Tailwind CSS 4",
    "TanStack Query",
    "Coinbase API",
    "Feature-based architecture",
  ],
};
