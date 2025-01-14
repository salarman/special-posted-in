import MarkdownIt from "markdown-it";
import {DEFAULT_MARKDOWN_IT_OPTIONS} from "@/utils/markdown-utils";
import DecoratorProvider from "@/markup/decorator/decorator-provider";
import RuleType from "@/markup/constant/rule-type";
import shiki from "@shikijs/markdown-it";
import codeGroupParser from "@/plugins/markdown-it/code-group-parser";
import imageGroupParser from "@/plugins/markdown-it/image-group-parser";


export default defineNuxtPlugin(async (nuxtApp) => {
    if (nuxtApp.$md) return;
    const markdownIt = new MarkdownIt(DEFAULT_MARKDOWN_IT_OPTIONS);

    markdownIt.use(codeGroupParser);
    markdownIt.use(imageGroupParser);
    markdownIt.use(crateShikiExtension);

    DecoratorProvider.provides(
        RuleType.BLOCK_QUOTE,
        RuleType.HEADLINE,
        RuleType.CODE_BLOCK,
        RuleType.IMAGE,
        RuleType.LINK,
        RuleType.TABLE,
        RuleType.IMAGE_GROUP,
        RuleType.CODE_GROUP
    ).forEach(decorator => decorator.decorate(markdownIt));

    nuxtApp.provide('md', markdownIt);
});

const crateShikiExtension = await shiki({
    transformers: [
        {
            code(hast: any) {
                const original: string = hast.properties['class'] as string;
                const classes = original?.split(' ');
                classes.push('text-nowrap');
                hast.properties['class'] = classes.join(' ');
                return hast;
            }
        }
    ],
    themes: {
        light: 'min-light',
        dark: 'dracula-soft'
    },
});
