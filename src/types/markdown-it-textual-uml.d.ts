declare module 'markdown-it-textual-uml' {
    import MarkdownIt from 'markdown-it';
    import { PluginWithOptions } from 'markdown-it';

    export interface TextualUMLOptions {
        /**
         * The name of the opening fence
         * @default 'plantuml'
         */
        openMarker?: string;

        /**
         * The name of the closing fence
         * @default 'plantuml'
         */
        closeMarker?: string;

        /**
         * The server URL for PlantUML
         * @default 'http://www.plantuml.com/plantuml'
         */
        server?: string;

        /**
         * The image format to use
         * @default 'img'
         */
        imageFormat?: 'img' | 'svg';

        /**
         * Additional attributes to add to the image tag
         */
        imageAttributes?: Record<string, string>;

        /**
         * Whether to use kroki.io instead of PlantUML server
         * @default false
         */
        useKroki?: boolean;

        /**
         * The kroki.io server URL
         * @default 'https://kroki.io'
         */
        krokiServer?: string;

        /**
         * Additional diagram types to support
         */
        diagramTypes?: {
            [key: string]: {
                server?: string;
                format?: string;
            };
        };
    }

    /**
     * markdown-it plugin for rendering UML diagrams using PlantUML or Kroki
     * @param md MarkdownIt instance
     * @param options Configuration options
     */
    const textualUML: PluginWithOptions<TextualUMLOptions>;

    export default textualUML;

    // Additional type for the rendered token
    export interface TextualUMLToken {
        type: 'textual_uml';
        tag: 'img' | 'svg';
        attrs: [string, string][];
        content: string;
        markup: string;
        info: string;
        map: [number, number];
        level: number;
        children: null;
        hidden: boolean;
    }
}

// Usage example:
/*
import MarkdownIt from 'markdown-it';
import textualUML from 'markdown-it-textual-uml';

const md = new MarkdownIt();
md.use(textualUML, {
  openMarker: 'plantuml',
  server: 'http://www.plantuml.com/plantuml',
  imageFormat: 'svg',
  imageAttributes: {
    class: 'uml-diagram'
  }
});
*/
