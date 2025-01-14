import type IMarkdownDecorator from "@/markup/decorator/i-markdown-decorator";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";
import Filename from "@/classes/implement/filename";
import {getLanguageCode} from "@/utils/markdown-utils";

export default class CodeGroupDecorator implements IMarkdownDecorator {

    public static readonly KEY_OPEN: string = 'code_group_open';
    public static readonly KEY_CLOSE: string = 'code_group_close';

    public decorate(markdownIt: MarkdownIt, isDebug: boolean = false): void {
        const proxy = (tokens: Array<Token>, index: number, options : MarkdownIt.Options, env: any, self: Renderer) => self.renderToken(tokens, index, options);
        const fallbackRule = markdownIt.renderer.rules[CodeGroupDecorator.KEY_OPEN] || proxy;

        markdownIt.renderer.rules[CodeGroupDecorator.KEY_OPEN] = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {
            const startToken = tokens[index];
            const range = tokens.slice(index, tokens.length);
            const endIndex = range.findIndex(token => token.type === CodeGroupDecorator.KEY_CLOSE) + index;

            const indexes = tokens.slice(index + 1, endIndex)
                .filter(token => token.type === 'fence')
                .map((token, idx) => index + idx + 1);

            const buttons = this.generateButtons(indexes, tokens);

            //code-block-decorator에서 처리하기 위해 그룹 내 인덱스값을 넣어준다.
            indexes.forEach((tokenIndex, idx) => {
                const codeBlock = tokens[tokenIndex];
                codeBlock.attrSet('code-group-index', idx.toString());
                codeBlock.attrSet(`code-group-number`, index.toString())
            });

            return `<div class="relative [&>div:last-child]:!my-0 [&>div:last-child]:!static my-5">
                        <div class="code-group-${index}-buttons flex items-center gap-1 border border-gray-200 dark:border-gray-700 border-b-0 rounded-t-md overflow-x-auto p-2">
                            ${buttons}
                        </div>
                        <div class="code-group relative [&>pre]:!rounded-t-none [&>pre]:!my-0 my-5" id="code-group-${index}" data-group-number="${index}">`;
        }
        markdownIt.renderer.rules[CodeGroupDecorator.KEY_CLOSE] = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {
            return `</div></div>`;
        }
    }

    private generateButtons(tokenIndexes: Array<number>, tokens: Array<Token>): string {
        const activateClasses = 'bg-gray-100 dark:bg-gray-800';
        const deactivateClasses = 'hover:bg-gray-50 dark:hover:bg-gray-800/50';

        return tokenIndexes.map(index => tokens[index]).map((token, idx) => {
            return `<button tabindex="-1" class="px-2 py-1.5 focus:outline-none text-gray-700 dark:text-gray-200 text-sm rounded-md flex items-center gap-1.5 ${idx === 0 ? activateClasses : deactivateClasses}">
                        <span class="iconify i-vscode-icons:file-type-${getLanguageCode(new Filename(token.info).ext)} size-4" aria-hidden="true"></span>
                        <span>${token.info}</span>  
                    </button>`;
        }).join('\n');
    }

}
