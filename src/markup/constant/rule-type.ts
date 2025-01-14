export default class RuleType {

    public static readonly BLOCK_QUOTE = new RuleType('blockquote');
    public static readonly HEADLINE = new RuleType('headline');
    public static readonly CODE_BLOCK = new RuleType('code_block');
    public static readonly PARAGRAPH = new RuleType('paragraph');
    public static readonly LINK = new RuleType('link');
    public static readonly TABLE = new RuleType('table');
    public static readonly IMAGE_GROUP = new RuleType('image_group');
    public static readonly CODE_GROUP = new RuleType('code_group');
    public static readonly IMAGE = new RuleType('image');

    private readonly _name: string;
    private constructor(name: string) {
        this._name = name
    }

    get name(): string {
        return this._name;
    }
}
