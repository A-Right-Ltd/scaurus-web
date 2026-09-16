import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const ensureDeclSource = {
  postcssPlugin: "ensure-decl-source",
  Once(root) {
    const fallback = root.source;
    root.walk((node) => {
      if (!node.source?.input?.file) {
        node.source = node.parent?.source ?? fallback;
      }
    });
  },
};

export default {
  plugins: [tailwindcss, autoprefixer, ensureDeclSource],
};
