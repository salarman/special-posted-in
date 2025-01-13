import MarkdownIt from "markdown-it";
import {DEFAULT_MARKDOWN_IT_OPTIONS} from "@/utils/markdown-utils";
import DecoratorProvider from "@/markup/decorator/decorator-provider";
import RuleType from "@/markup/constant/rule-type";
import shiki from "@shikijs/markdown-it";

export default defineNuxtPlugin(async (nuxtApp) => {
    if (nuxtApp.$md) return;
    const markdownIt = new MarkdownIt(DEFAULT_MARKDOWN_IT_OPTIONS);

    DecoratorProvider.provides(
        RuleType.BLOCK_QUOTE,
        RuleType.HEADLINE,
        RuleType.CODE_BLOCK,
        RuleType.IMAGE,
        RuleType.LINK,
        RuleType.TABLE,
        RuleType.IMAGE_GROUP
    ).forEach(decorator => decorator.decorate(markdownIt));

    const shikiExtension = await shiki({
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
            light: 'material-theme-lighter',
            dark: 'material-theme-palenight'
        },
    });
    markdownIt.use(shikiExtension);

    nuxtApp.provide('md', markdownIt);
});
