import Token from "markdown-it/lib/token";
import {TokenNesting} from "@/markup/constant/token-nesting";

export function findCloseIndex(closeName: string, tokens: Array<Token>, index: number): number {
    const range = tokens.slice(index, tokens.length);
    return range.findIndex(token => token.type === closeName) + index;
}

/**
 * tokens의 인덱스를 이용해 내부 요소들의 실제 인덱스를 찾는다.
 * @param tokens to be rendered tokens
 * @param start index of parent start token
 * @param end index of parent end token
 */
export function findChildrenIndexes(tokens: Array<Token>, start: number, end: number): Array<number> {
    return tokens.slice(start +1, end).map((token, index) => start + index +1);
}

export function findTokens(tokens: Array<Token>, type: string): Array<Token> {
    return tokens.reduce((acc, pre) => {
        if (pre.type === type) {
            acc.push(pre);
        } else if (pre.children) {
            const tokens = findTokens(pre.children, type)
            acc.push(...tokens);
        }

        return acc;
    }, new Array<Token>());
}

export function wrappingTokens(tokens: Array<Token>, tag: string) {
    return [
        new Token('', tag, TokenNesting.OPEN),
        ...tokens,
        new Token('', tag, TokenNesting.CLOSE)
    ]
}
