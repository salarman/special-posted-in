import type IMarkdownDecorator from "@/markup/decorator/i-markdown-decorator";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";
import {TokenNesting} from "@/markup/constant/token-nesting";

export default class CodeGroupDecorator implements IMarkdownDecorator {

    public static readonly KEY_OPEN: string = 'code_group_open';
    public static readonly KEY_CLOSE: string = 'code_group_close';

    public decorate(markdownIt: MarkdownIt, isDebug: boolean = false): void {
        const proxy = (tokens: Array<Token>, index: number, options : MarkdownIt.Options, env: any, self: Renderer) => self.renderToken(tokens, index, options);
        const fallbackRule = markdownIt.renderer.rules[CodeGroupDecorator.KEY_OPEN] || proxy;
        console.log('markdownIt.renderer.rules', markdownIt.renderer.rules);

        markdownIt.renderer.rules[CodeGroupDecorator.KEY_OPEN] = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {
            console.log(`[${index}]tokens`, tokens);
            const startToken = tokens[index];
            const range = tokens.slice(index, tokens.length);
            const endIndex = range.findIndex(token => token.type === CodeGroupDecorator.KEY_CLOSE) + index;


            const codes = tokens.slice(index +1, endIndex);
            console.log(`[${index}, ${endIndex}]codes.length: ${codes.length}`);
            codes.forEach((token, idx) => {
                console.log(`token ${idx + index}:`, token);
            })


            return `<div class="relative [&>div:last-child]:!my-0 [&>div:last-child]:!static my-5">`;
        }
    }

}