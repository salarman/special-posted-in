---
layout: post
title: markdown-it의 Renderer Rule
categories: [tool]
tags: [markdown-it, typescript]
date: 2023-07-14 19:17:00 +0900
thumbnail: "/post/tool/customize-markdown-it.webp"
current-company: Herit Corporation
current-position: Backend Server Developer
summary: Markdown it 규칙 파헤치기
excerpt-separator: <!--more-->
hide: false
---
javascript의 마크다운 파서인 markdown-it 라이브러리를 커스텀해서 사용해보자. 
<!--more-->

## 개요::overview

`markdown-it`은 대중적으로 많이 알려진 javascript markdown parser library이다.

이글은 마크다운이 무엇 인지에 대해서는 설명하지 않는다. 그저 개인 블로그를 직접 만드는 입장에서 골치덩이인 마크다운 파서를 어떻게하면 조금더 유용하게 쓸수 있을까 고민해보며 만들면서 작성하였다.

예를 들어 `> BlockQuote`를 작성한다고 가정했을때. 단순히 블럭으로 묶는 것보다 `> BlockQuote {{ "type": "warning" }}`과 같이 추가적인 템플릿 구문을 추가하여, 경고 스타일의 블럭으로 보여 줄 수도 있을 것이다. 이를 하기 위해서는 기존 `markdown` 해석 형식에서 더 나아가 새로운 템플릿 해석 로직을 추가해야한다. 아래 코드를 보고 좀 더 쉽게 이해해보자.



### 적용 전::before-customize

*Markdown*

```markdown
> 준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.
```

*HTML*

```html
<blockquote>
  준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.
</blockquote>
```



### 적용 후::after-customize

*Markdown*

```markdown
> 준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.
:{ "type": "warning" }
```

*HTML*

```html
<blockquote class="warning">
  <p>준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.</p>
</blockquote>
```

이는 더 많은 정보를 담을수 있으며, 동시에 추가적인 스타일로 시각적인 효과를 주어, 더 나은 가독성을 만들 수 있다.

물론 이렇게 만드려면 사용하려는 markdown 구문마다 모두 규칙을 만들어 줘야한다.

`Markdown-it` 같은 경우 많은 사람들이 블로그 제작시 사용하지만, 실제로 커스텀할 수 있는 `Renderer Rule(랜더링을 하기 위한 규칙)` 같은 기능은 사용하지 않는다. 사실 잘 알려져 있지도 않기 때문에, 많이 사용하지 않는것 일 수 있다.  자신의 블로그를 대충 꾸미고 싶은 사람은 없을테니 이런 방식을 알려 조금이라도 쉽게 이해를 돕고, 나 또한 정리를 하며 다시한번 정립하고 싶다.



## 분석::analysis

### Render Rule (규칙)::renderer-rule

`Renderer Rule(이하 *규칙)` 같은 경우는 `Markdown-it`에서 제공하는 내부적인 규칙의 흐름이다.

```typescript
import MarkdownIt from 'mardown-it';

const markdown = new MarkdownIt();
console.log('rules: ', Object.keys(markdown.renderer.rules));
// Output
// rules: ['code_inline', 'code_block', 'fence', 'image', 'hardbreak', 'softbreak', 'text', 'html_block', 'html_inline']
```

위는 기본적으로 제공하는 규칙이며, 대략적으로 9개로 볼 수 있다. 이 배열에 명시적으로 있지 않은 요소는 기본규칙이 적용 된다. 예를 들어 `bullet_list_opend` 규칙이 정의 되어 있지 않았으므로, `markdown-it`은 `HTML`로 해석을 시도할 때, `Renderer.prototype.renderToken`이라는 일반 렌더러가 사용된다.



새로운 마크다운 문법을 창시하지 않는한, 아마 기존 문법에서 조금 수정하는 정도 일 것이다.

따라서 만약 `blockquote_open`이라는 규칙을 수정한다고하면 아래와 같이 할수 있다.

```typescript
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";

const md = new MarkdownIt();
md.renderer.rules.blockquote_open = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {

  return '';
}
```

위에서 받아오는 규칙 함수같은 경우 아래와 같이 타입으로 정의 되어있다.

```typescript
declare namespace Renderer {
    type RenderRule = (tokens: Token[], idx: number, options: MarkdownIt.Options, env: any, self: Renderer) => string;

    interface RenderRuleRecord {
        [type: string]: RenderRule | undefined;
        code_inline?: RenderRule | undefined;
        code_block?: RenderRule | undefined;
        fence?: RenderRule | undefined;
        image?: RenderRule | undefined;
        hardbreak?: RenderRule | undefined;
        softbreak?: RenderRule | undefined;
        text?: RenderRule | undefined;
        html_block?: RenderRule | undefined;
        html_inline?: RenderRule | undefined;
    }
}
```

| 인자      | 의미                                         |
| --------- | -------------------------------------------- |
| *tokens*  | 해석되는 모든 토큰 목록 (각 태그에대한 토큰) |
| *index*   | 현재 토큰의 키에 해당하는 인덱스             |
| *options* | `markdown-it`객체가 생성될 때, 정의된 옵션   |
| *env*     | ???                                          |
| *self*    | 렌더러 자체에대한 참조                       |

규칙을 수정할 때, 실패한다면 기존 규칙으로 `fallback` 시켜줄수 있는 로직도 추가한다면 아래와 같다.

```typescript
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";

const md = new MarkdownIt();
const proxy = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer) => self.renderToken(tokens, index, options);
//기본 fallback 규칙
const defaultBlockquoteOpenRule = md.renderer.rules.blockquote_open || proxy;

md.renderer.rules.blockquote_open = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {
  return defaultBlockquoteOpenRule(tokens, index, options, env, self);
}

const markdownText = '뜨거운 태양아래 시원한 계곡물에 잠수!\n> 준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.';
//HTML 렌더링
const html = md.render(markdownText);
/* html 
<p>뜨거운 태양아래 시원한 계곡물에 잠수!</p>
<blockquote>
	<p>준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.</p>
</blockquote>
*/
```

*tokens*  인자를 출력해보면 다음과 같다.

```
[
	{ "type": "paragraph_open", "tag": "p" ...},
	{ "type": "inline" "tag": '' ...},
	{ "type": "paragraph_close", "tag": "p" ...},
	{ "type": "blockquote_open", "tag": "blockquote" ...},
	{ "type": "paragraph_open", "tag": "p" ...},
	{ "type": "inline", "tag": '' ...},
	{ "type": "paragragh_close", "tag": 'p' ...},
	{ "type": "blockquote_close", "tag": "blockquote" ...}
]
```

어떤 패턴이 보인다. 그렇다. `tokens`는 위에서부터 순서대로 html 을 랜더링할 정보를 가지고 있다.

랜더링 된 `HTML`과 비교하면 직관적으로 알 수 있다.

```html
<!-- paragraph_open, inline, paragraph_close -->
<p>뜨거운 태양아래 시원한 계곡물에 잠수!</p>
<!-- blockquote_open, paragraph_open, inline, paragragh_close, blockquote_close -->
<blockquote>
	<p>준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.</p>
</blockquote>
```



위와 같이 규칙은 랜더링 되어야할 순서대로 생성되기 때문에, 이미 랜더링 된 토큰을 수정할수 없다.

```html
<blockquote>
	<p>준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.</p>
</blockquote>
```

이런 코드를 보면 순서로 봤을 때 [`blockquote_open` ,`paragraph_open`, `inline`, `paragragh_close`, `blockquote_close`] 로 진행된다.

만약 내가 `blockquote` 태그에 `class="waring"` 이라는 속성을 추가 해주고 싶다면. 이 정보를 전달해야한다.

```markdown
> 준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다.
> 또는 심장마비가 올수도 있다.
:{ "type": "warning" }
```

이런 마크다운이 있을때 별다른 처리가 없다면 아래와 같이 전달하는 속성정보가 그대로 전달되어 출력될 것이다.

```markdown
<blockquote>
	<p>준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다. 또는 심장마비가 올수도 있다. :{ "type": "warning" }</p>
</blockquote>
```

따라서 `inline` 토큰에서 "warning" 값을 추출해서 `blockquote` 토큰에 `class` 속성으로 추가해줘야한다. 또한 `inline` 토큰에는 실제 노출이 필요한 문자열인 `준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다. 또는 심장마비가 올수도 있다.`만 아래와 같이 남아야한다.

```markdown
<blockquote class="warning">
	<p>준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다. 또는 심장마비가 올수도 있다.<p>
</bloackquote>
```



위에서 이미 랜더링된 토큰은 수정할 수 없다고 했다. 그 말은 현재 상황에서 보면 [`blockquote_open` ,`paragraph_open`, `inline`, `paragragh_close`, `blockquote_close`]  순서로 진행될때 `inline`토큰에서 `blockquote_open` 토큰에 `class` 속성을 주입해도 이미 랜더링된 `blockquote_open` 토큰에는 적용이 안된다는 말이다. 따라서 `blockquote_open` 에서 뒤에 랜더링될 `inline` 토큰을 수정해야 정상적으로 노출될 수 있다.

## 템플릿 규칙 적용::apply-template-rule



### 규칙 수정::modify-rule

```typescript
import MarkdownIt from "markdown-it";
import Token from "markdown-it/lib/token";
import Renderer from "markdown-it/lib/renderer";

const md = new MarkdownIt();
const proxy = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer) => self.renderToken(tokens, index, options);
//기본 fallback 규칙
const defaultBlockquoteOpenRule = md.renderer.rules.blockquote_open || proxy;

md.renderer.rules.blockquote_open = (tokens: Array<Token>, index: number, options: MarkdownIt.Options, env: any, self: Renderer): string => {
  try {
    const templateRE = /^([\s\S]*?)\s*:\s*(\{[\s\S]*\})\s*$/mg;
    const inlineIndex = index +2;

    if (inlineIndex >= tokens.length) throw new Error(`Index out of range from tokens: ${inlineIndex}`);
    const inline = tokens[inlineIndex];
    const content = inline.content;
    const noneMatch = !templateRE.test(content);
    templateRE.lastIndex = 0;
    if (!inline.map || noneMatch) {
      return defaultBlockquoteOpen(tokens, index, options, env, self);
    }
    /*
    * 준비운동을 하지 않고 물에 들어간다면, 다리에 쥐가 날 수 있다. 두번째 줄이지! - executed[1]
    * :{ "type": "warning" } - executed[2]
    */
    const executed = templateRE.exec(content);
    const text = executed?.[1] ?? '';
    const attributesStr = executed?.[2];
    const attributes = JSON.parse(attributesStr ?? '{}');
    //type = "warning"
    const type = attributes['type'];

		//children은 inline내부에서 랜더링될 자식 토큰들의 목록이다.
    //여기서 slice는 text값 뒤에 템플릿은 필요없기 때문에 제거해주기 위함이다.
    const lfCount = countNewline(text);
    const lineCount = lfCount +1;
    inline.children = inline.children?.slice(0, lfCount + lineCount) ?? inline.children;
    inline.content = text ?? inline.content;

    //현재 토큰에 class 속성을 부여한다.
    const blockquoteOpen = tokens[index];
    if (type) {
      blockquoteOpen.attrJoin('class', type);
    }

    return defaultBlockquoteOpen(tokens, index, options, env, self);
  } catch (e: Error) {
    console.error(`Error occurred at parsing token: "${e.message}"`);
    return '';
  }
}
```

---

`:{ "type" : "warning" }` 템플릿은 뭔가 급조해서 만들어서 만들었기 때문에 자신만의 템플릿을 만들어 더 나은 parser를 구현할 수 있을듯 하다.

사실 기존에도 `chirpy` 같은 Jekyll 테마 같은 경우에는 커스텀 템플릿을 만들어 공유되고 있었다.

