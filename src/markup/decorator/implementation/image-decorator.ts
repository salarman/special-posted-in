import type IMarkdownDecorator from "@/markup/decorator/i-markdown-decorator";
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import TemplateAttributes from "@/markup/template/TemplateAttributes";
import Renderer from "markdown-it/lib/renderer";
import StyleDecorator from "@/markup/decorator/style/style-decorator";
import {wrappingTokens} from "@/markup/utils/markdown-it-util";


export default class ImageDecorator implements IMarkdownDecorator {

    private readonly KEY_OPEN = 'paragraph_open';
    private readonly KEY_CLOSE = 'paragraph_close';

    private readonly ATTR_INNER_ALIGN = 'align';


    public decorate(markdownIt: MarkdownIt, isDebug: boolean = false): void {
        const proxy = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer) => self.renderToken(tokens, index, options);
        const fallbackRule = markdownIt.renderer.rules[this.KEY_OPEN] || proxy;

        markdownIt.renderer.rules[this.KEY_OPEN] = (
            tokens: Array<Token>,
            index: number,
            options: MarkdownIt.Options,
            env: any,
            self: Renderer
        ): string => {
            const wrapperClasses = ['flex', 'flex-col', 'not-prose', 'w-full'];
            try {
                const inline = tokens[index +1];
                inline.content = '';
                const imageToken = this.findChild(inline.children, 'image');
                if (!imageToken) {
                    //<p>
                    return fallbackRule(tokens, index, options, env, self);
                }

                if (imageToken.attrIndex('group-index') >= 0) {
                    return this.decorateOpenGroupImage(imageToken, tokens[index]);
                }

                const templateToken = this.findChild(inline.children, 'text');
                if (!templateToken) {
                    throw new Error('template token not found with inline children');
                }

                const attributes = TemplateAttributes.parse(templateToken.content).toMap();

                imageToken.attrJoin('data-description', attributes.get('description') ?? '');
                templateToken.content = '';

                this.addDefaultImageClass(imageToken);

                const styleDecorator = StyleDecorator.getInstance();
                styleDecorator.apply(imageToken, attributes);
                wrapperClasses.push(imageToken.meta.wrapperClasses);
            } catch (skip) {
                isDebug && console.error('[decorator]image:start error: ', skip);
            }
            return `<div class="${wrapperClasses.join(' ')}">
                       <a href="#" class="my-2 inline-flex">`;
        }

        markdownIt.renderer.rules[this.KEY_CLOSE] = (
            tokens: Array<Token>,
            index: number,
            options: MarkdownIt.Options,
            env: any,
            self: Renderer
        ): string => {
            try {
                const inline = tokens[index - 1];
                const imageToken = this.findChild(inline.children, 'image');
                if (!imageToken) {
                    return fallbackRule(tokens, index, options, env, self);
                }

                if (imageToken.attrIndex('group-index') >= 0) {
                    return this.decorateCloseGroupImage(imageToken, tokens[index]);
                }

                if ((imageToken.attrIndex('image-group-index') >= 0)) {
                    return '</div>';
                }

                if (imageToken.attrGet('data-description') === null) {
                    return `</a></div>`
                }

                return (
                    `</a>
                   <figcaption class="m-0 text-center text-sm text-gray-600 dark:text-gray-400 w-full">${imageToken.attrGet('data-description')}</figcaption>
                 </div>`
                );
            } catch(skip) {
                isDebug && console.error('[decorator]image:close error: ', skip);
            }
            return `</a></div>`;
        }
    }

    private findChild(children: Token[] | null, inlineName: string): Token | undefined {
        return children?.find((token) => token.type === inlineName)
    }

    private addDefaultImageClass(imageToken: Token) {
        imageToken.attrJoin('class', 'my-0 rounded-md');
        imageToken.attrJoin('style', 'cursor: zoom-in;');
    }

    private decorateOpenGroupImage(imageToken: Token, openToken: Token): string {
        //이미지 그룹의 인덱스
        const groupIndex = parseInt(imageToken.attrGet('group-index')!, 10);
        //이미지 그룹내 번호
        const groupNumber = parseInt(imageToken.attrGet('image-number')!, 10);
        //이미지 그룹내 이미지 갯수
        const groupImageCount = parseInt(imageToken.attrGet('group-image-count')!, 10);
        imageToken.attrJoin('class', 'object-cover m-0');

        switch (groupImageCount) {
            case 1:
            case 2: {
                //1, 2 시작 각각 wrapper
                return '<div class="flex w-full flex-col"><div>';
            }
            case 3: {
                //1 시작 wrapper
                if (groupNumber === 1 || groupNumber === 2) {
                    return '<div><div>';
                }
                //2 시작 wrapper else {
                return '<div>';
            }
            case 4: {
                //1 시작 wrapper
                if (groupNumber === 1 || groupNumber === 2) {
                    return '<div><div>';
                }
                return '<div>';
            }
            default: {
                //1 시작 wrapper
                if (groupNumber === 1) {
                    return `<div class="flex flex-col shrink-0 overflow-hidden w-2/3 h-full"><div class="h-1/2 overflow-hidden">`;
                }

                if (groupNumber === 2) {
                    return '<div class="h-1/2 overflow-hidden">'
                }

                if (groupNumber === 3) {
                    return `<div class="flex flex-col grow overflow-hidden" style="height: 100%;flex: 1 1 30%"><div class="h-1/3 overflow-hidden">`;
                }

                if (groupNumber === 4 || groupNumber === 5) {
                    return '<div class="h-1/3 overflow-hidden">';
                }

                //5번째 이후 이미지 히든
                else if (groupNumber > 5) {
                    imageToken.hidden = true;
                    return '';
                }

                return '<div>';
            }
        }
    }

    private decorateCloseGroupImage(imageToken: Token, closeToken: Token): string {
        //이미지 그룹의 인덱스
        const groupIndex = parseInt(imageToken.attrGet('group-index')!, 10);
        //이미지 그룹내 번호
        const groupNumber = parseInt(imageToken.attrGet('image-number')!, 10);
        //이미지 그룹내 이미지 갯수
        const groupImageCount = parseInt(imageToken.attrGet('group-image-count')!, 10);

        switch (groupImageCount) {
            case 1:
            case 2: {
                return '</div></div>';
            }
            case 3: {
                //1, 3. 종료 wrapper
                if (groupNumber === 1 || groupNumber === 3) {
                    return '</div></div>';
                }
                return '</div>';
            }
            case 4: {
                //1, 4. 종료 wrapper
                if (groupNumber === 1 || groupNumber === 4) {
                    return '</div></div>';
                }
                return '</div>';
            }
            default: {
                //2, 5. 종료 wrapper
                if (groupNumber === 2 || groupNumber === 5) {
                    return '</div></div>';
                }

                if (groupNumber > 5) {
                    return '';
                }
                return '</div>';
            }
        }

        return '</div>';
    }
}
