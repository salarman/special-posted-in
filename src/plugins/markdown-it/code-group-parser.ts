import MarkdownIt from "markdown-it";
import StateBlock from "markdown-it/lib/rules_block/state_block";
import CodeGroupDecorator from "@/markup/decorator/implementation/code-group-decorator";

function codeGroupBlock(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
    const OPEN_MARKER = '::code-group';
    const CLOSE_MARKER = '::';

    if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
    }

    const pos = state.bMarks[startLine] + state.tShift[startLine];
    const max = state.eMarks[startLine];

    // Check if the start of a group
    if (state.src.slice(pos, max).trim() !== OPEN_MARKER) {
        return false;
    }

    let nextLine = startLine;

    // Search for the end of the block
    while (nextLine < endLine) {
        nextLine++;
        const endMarkerPos = state.bMarks[nextLine] + state.tShift[nextLine];
        const endMarkerMax = state.eMarks[nextLine];

        if (state.src.slice(endMarkerPos, endMarkerMax).trim() === CLOSE_MARKER) {
            break;
        }
    }

    if (nextLine >= endLine) {
        return false;
    }
    let token;
    if (!silent) {
        state.line = nextLine + 1;

        token = state.push('code_group_open', 'div', 1);
        token.map = [startLine, state.line];

        state.md.block.tokenize(state, startLine + 1, nextLine);

        token = state.push('code_group_close', 'div', -1);
    }

    state.line = nextLine + 1;
    return true;
}

export default (md: MarkdownIt) => {
    md.block.ruler.before('fence', 'code_group', codeGroupBlock, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
    });

    md.renderer.rules[CodeGroupDecorator.KEY_OPEN] = function(tokens, idx) {
        return `<div>\n`;
    };

    md.renderer.rules[CodeGroupDecorator.KEY_CLOSE] = function(tokens, idx) {
        return `</div>\n`;
    };
}