import { toMap } from "@/utils/collection-util";

export default class FileAlias {

    private static readonly DOCS = new FileAlias("docs", "문서");
    private static readonly ALGORITHM = new FileAlias("algorithm", "알고리즘");
    private static readonly JAVA = new FileAlias("java", "자바");
    private static readonly JAVASCRIPT = new FileAlias("javascript", "자바스크립트");
    private static readonly TYPESCRIPT = new FileAlias("typescript", "타입스크립트");
    private static readonly FRAMEWORK = new FileAlias("framework", "프레임워크");
    private static readonly LANGUAGE = new FileAlias("language", "언어");
    private static readonly SPRING = new FileAlias("spring", "스프링");
    private static readonly SWIFT = new FileAlias("swift", "스위프트");
    private static readonly TOOL = new FileAlias("tool", "도구");
    private static readonly DATABASE = new FileAlias("database", "데이터베이스");
    private static readonly OS = new FileAlias("os", "운영체제");
    private static readonly COMPUTER = new FileAlias("computer", "컴퓨터");
    private static readonly HARDWARE = new FileAlias("hardware", "하드웨어");
    private static readonly SOFTWARE_DESIGN = new FileAlias("software-design", "소프트웨어 설계");
    private static readonly LIFE = new FileAlias("life", "일상");

    private static readonly CACHED = toMap(FileAlias.values(), (file) => file._value);

    private readonly _value: string;
    private readonly _name: string;

    private constructor(value: string, name: string) {
        this._value = value;
        this._name = name;
    }

    public static values(): Array<FileAlias> {
        return [this.DOCS, this.ALGORITHM, this.JAVA, this.JAVASCRIPT, this.TYPESCRIPT,
            this.FRAMEWORK, this.SPRING, this.LANGUAGE, this.SWIFT, this.TOOL, this.DATABASE,
            this.OS, this.COMPUTER, this.HARDWARE, this.SOFTWARE_DESIGN, this.LIFE];
    }

    get value(): string {
        return this._value;
    }

    get name(): string {
        return this._name;
    }

    public static toNameIfAbsent(value: string): string {
        return FileAlias.CACHED.get(value)?.name ?? value;
    }


}
