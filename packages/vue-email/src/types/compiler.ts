export interface Options {
  dir: string;
  verbose?: boolean;
  output?: {
    /**
     * Output directory
     * @default {dir}/.vuemail
     */
    dir?: string;
    /**
     * Instantly generate all templates found in the templates directory.
     * If this is set to false, generate your templates with:
     *   - vuemail.compile(directory: string) - Generates all templates in directory.
     *     or
     *   - vuemail.compileTemplate(filename: string) - Generates a single template.
     * @default true
     */
    auto?: boolean;
  };
}

export interface RenderOptions {
  props?: Record<string, unknown>;
}
