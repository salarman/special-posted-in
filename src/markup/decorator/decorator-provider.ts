import type IMarkdownDecorator from "@/markup/decorator/i-markdown-decorator";
import RuleType from "@/markup/constant/rule-type";
import BlockquoteDecorator from "@/markup/decorator/implementation/blockquote-decorator";
import HeadlineDecorator from "@/markup/decorator/implementation/headline-decorator";
import CodeBlockDecorator from "@/markup/decorator/implementation/code-block-decorator";
import ImageDecorator from "@/markup/decorator/implementation/image-decorator";
import LinkDecorator from "@/markup/decorator/implementation/link-decorator";
import TableDecorator from "@/markup/decorator/implementation/table-decorator";
import StyleDecorator from "@/markup/decorator/style/style-decorator";
import ImageGroupDecorator from "@/markup/decorator/implementation/image-group-decorator";
import CodeGroupDecorator from "@/markup/decorator/implementation/code-group-decorator";

export default class DecoratorProvider {

    private static _instance: DecoratorProvider;

    private readonly _decorators: Map<RuleType, IMarkdownDecorator>;
    private constructor() {
        const entries: [RuleType, IMarkdownDecorator][] = [
            [RuleType.BLOCK_QUOTE, new BlockquoteDecorator()],
            [RuleType.HEADLINE, new HeadlineDecorator()],
            [RuleType.CODE_BLOCK, new CodeBlockDecorator()],
            [RuleType.LINK, new LinkDecorator()],
            [RuleType.TABLE, new TableDecorator()],
            [RuleType.IMAGE_GROUP, new ImageGroupDecorator()],
            [RuleType.IMAGE, new ImageDecorator()],
            [RuleType.CODE_GROUP, new CodeGroupDecorator()]
        ]

        this._decorators = new Map<RuleType, IMarkdownDecorator>(entries);
        this.initStyleDecorator()
    }

    private static getInstance(): DecoratorProvider {
        if (!this._instance) {
            this._instance = new DecoratorProvider();
        }
        return this._instance;
    }

    public static provide(rule: RuleType): IMarkdownDecorator {
        if ( ! this.getInstance()._decorators.has(rule)) {
            throw Promise.reject(`Not found decorator which coupled with key: ${rule.name}`)
        }

        return this.getInstance()._decorators.get(rule)!;
    }

    public static provides(...rules: Array<RuleType>): Array<IMarkdownDecorator> {
        return rules.map(rule => this.provide(rule));
    }

    private initStyleDecorator() {
        StyleDecorator.getInstance().styles
            .add('align', (token, attributes) => {
                const align = attributes.get('align');
                token.meta = Object.assign({}, token.meta);
                token.meta.wrapperClasses = token.meta?.wrapperClasses ?? [];
                if (align === 'center') {
                    token.meta.wrapperClasses.push('items-center');
                } else if (align === 'right') {
                    token.meta.wrapperClasses.push('items-end');
                } else if (align === 'left') {
                    token.meta.wrapperClasses.push('items-start');
                }
            })
            .add('max-width', (token, attributes) => {
                const maxWidth = attributes.get('max-width');
                if (maxWidth) {
                    token.attrJoin('style', `max-width: ${maxWidth};`);
                }
            })
            .add('max-height', (token, attributes) => {
                const maxHeight = attributes.get('max-height');
                if (maxHeight) {
                    token.attrJoin('style', `max-height: ${maxHeight};`);
                }
            });
    }
}
