import type IMarkdownDecorator from "@/markup/decorator/i-markdown-decorator";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";
import Filename from "@/classes/implement/filename";
import {getLanguageCode} from "@/utils/markdown-utils";
import mermaid from "mermaid";
import type {RendererRuleArguments} from "@/markup/decorator/rederer-rule";

export default class CodeBlockDecorator implements IMarkdownDecorator {

    private readonly _number = /{([\d,-]+)}/;
    private readonly _wrapper = /^<pre .*?><code>/;

    public decorate(markdownIt: MarkdownIt, isDebug: boolean = false): void {
        const proxy = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer) => self.renderToken(tokens, index, options);
        const defaultFence = markdownIt.renderer.rules.fence || proxy;

        this.decorateHighlighting(markdownIt, defaultFence);
    }

    private decorateHighlighting(markdownIt: MarkdownIt, defaultFence: Renderer.RenderRule) {
        markdownIt.renderer.rules.fence = (
            tokens: Array<Token>,
            index: number,
            options: MarkdownIt.Options,
            env: any,
            self: Renderer
        ): string => {
            const token = tokens[index];
            const name = token.info;

            // @ts-ignore
            if (!token.lineNumber) {
                const rawInfo = token.info

                if (Filename.isFilename(rawInfo)) {
                    return this.filenameFence(tokens, index, options, env, self);
                }

                if (!rawInfo || !this.numberRE.test(rawInfo)) {
                    return this.languageFence(tokens, index, options, env, self);
                }

                // ensure the next plugin get the correct lang.
                token.info = rawInfo.replace(this.numberRE, '').trim();
                const executed: RegExpExecArray = this.numberRE.exec(rawInfo)!

                // @ts-ignore
                token.lineNumbers = executed[1]
                    .split(',')
                    .map(v => v.split('-').map(v => parseInt(v, 10)))

            }

            //Highlight for each languages.
            const code = options.highlight
                ? options.highlight(token.content, token.info, '')
                : token.content
            const lang = token.info ? token.info.trim() : 'text'

            return `<div class="relative language-${lang} extra-class">
                        <!--afterbegin-->
                        ${code}
                        <!--beforeend-->
                    </div>`;
        }
    }

    private decorateMermaid(token: Token, args: RendererRuleArguments): string {
        const code = (async () => {
            await mermaid.render(`mermaid-diagram-${args.index}`, token.content);
        })();

        code.then((success) => {
            console.log('Mermaid diagram rendered', success);
        });

        return `<div class="mermaid">${code}</div>`;
    }

    private decorateHighlightLines(token: Token, lang: string, rawCode: string): string {
        const highlightLinesCode = rawCode.split('\n').map((split: string, index: number) => {
            const lineNumber = index + 1
            // @ts-ignore
            const inRange = token.lineNumbers.some(([start, end]: number[]) => {
                if (start && end) {
                    return lineNumber >= start && lineNumber <= end
                }
                return lineNumber === start
            });
            if (inRange) {
                return `<div class="highlighted">&nbsp;</div>`
            }
            return '<br>'
        }).join('');

        return `<div class="highlight-lines">${highlightLinesCode}</div>`;
    }

    private decorateLineNumbers(rawCode: string): string {
        const code = rawCode?.slice(
            rawCode.indexOf('<code>'),
            rawCode.indexOf('</code>')
        )

        const lines = code?.split('\n')!;
        const lineNumbersCode = [...Array(lines.length - 1)]
            .map(() => `<div class="line-number"></div>`).join('');

        const lineNumbersWrapperCode
            = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNumbersCode}</div>`
        return rawCode
            .replace('<!--beforeend-->', `${lineNumbersWrapperCode}<!--beforeend-->`)
            .replace('extra-class', 'line-numbers-mode');
    }

    private filenameFence(tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer): string {
        const token = tokens[index];
        const filename = new Filename(token.info);

        return `<div class="relative [&>pre]:!rounded-t-none [&>pre]:!my-0 my-5">
                    <div class="flex items-center gap-1.5 border border-gray-200 dark:border-gray-700 border-b-0 relative rounded-t-md px-4 py-3 not-prose">
                        <span class="iconify i-vscode-icons:file-type-${getLanguageCode(filename.ext)}"></span>
                        <span class="text-gray-700 dark:text-gray-200 text-sm/6">${token.info}</span>
                    </div>
                    <button type="button" aria-label="Copy file code to clipbloard" tabindex="-1" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-xs gap-x-1.5 p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center absolute top-2.5 right-2.5">
                        <span class="iconify i-ph:copy flex-shrink-0 h-4 w-4" aria-hidden="true"></span>
                    </button>
                    ${options.highlight?.(token.content, getLanguageCode(filename.ext), '')}
               </div>`
    }

    private languageFence(tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer): string {
        const token = tokens[index];
        const lang = token.info ? token.info.trim() : 'text';

        return `<div class="relative">
                    <button type="button" aria-label="Copy code to clipbloard" tabindex="-1" class="focus:outline-none focus-visible:outline-0 disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:cursor-not-allowed aria-disabled:opacity-75 flex-shrink-0 font-medium rounded-md text-xs gap-x-1.5 p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline-offset-4 hover:underline focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center absolute top-2.5 right-2.5">
                        <span class="iconify i-ph:copy flex-shrink-0 h-4 w-4" aria-hidden="true"></span>
                    </button>
                    ${options.highlight?.(token.content, lang, '')}
               </div>`
    }


    get numberRE(): RegExp {
        this._number.lastIndex = 0;
        return this._number;
    }

    get wrapperRe(): RegExp {
        this._wrapper.lastIndex = 0;
        return this._wrapper;
    }
}
