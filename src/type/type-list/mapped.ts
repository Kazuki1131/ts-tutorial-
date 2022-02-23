/**
 * mapped typeは{[P in K]: T}という構文を持つ型です。ここでPは型変数、KとTは何らかの型です。
 * ただし、Kはstringの部分型である必要があります。例えば、{[P in 'foo' | 'bar']: number}という型が可能です。
 *
 * {[P in K]: T}という型の意味は、「K型の値として可能な各文字列Pに対して、型Tを持つプロパティPが存在するようなオブジェクトの型」です。
 * 上の例ではKは'foo' | 'bar'なので、Pとしては'foo'と'bar'が可能です。
 * よってこの型が表わしているのはnumber型を持つプロパティfooとbarが存在するようなオブジェクトです。
 *
 * すなわち、{[P in 'foo' | 'bar']: number} というのは{ foo: number; bar: number; }と同じ意味です。
 */
type Obj1 = { [P in "foo" | "bar"]: number };
interface Obj2 {
	foo: number;
	bar: number;
}

const obj1: Obj1 = { foo: 3, bar: 5 };
const obj2: Obj2 = obj1;
const obj3: Obj1 = obj2;

// 実は、{[P in K]: T}という構文において、型Tの中でPを使うことができるのです。例えば次の型を見てください。
{
    type PropNullable<T> = { [P in keyof T]: T[P] | null };

    interface Foo {
        foo: string;
        bar: number;
    }

    const obj: PropNullable<Foo> = {
        foo: "foobar",
        bar: null,
    };
}
/**
 * ここでは型変数Tを持つ型PropNullable<T>を定義しました。
 * この型は、T型のオブジェクトの各プロパティPの型が、T[P] | null、すなわち元の型であるかnullであるかのいずれかであるようなオブジェクトの型です。
 * 具体的には、PropNullable<Foo>というのは{foo: string | null; bar: number | null; }という型になります。

 * また、mapped typeでは[P in K]の部分に以前紹介した修飾子（?とreadonly）を付けることができます。
 * 例えば、次の型Partial<T>はTのプロパティを全てオプショナルにした型です。
 * この型は便利なのでTypeScriptの標準ライブラリに定義されており、自分で定義しなくても使うことができます。
 * 全てのプロパティをreadonlyにするReadonly<T>もあります。
 */
{
    type Partial<T> = { [P in keyof T]?: T[P] };
}
// これの使用例はこんな感じです。ReqFooでは、barの?が無くなっていることが分かります。
interface Foo {
	foo: string;
	bar?: number;
}

// ReqFoo = { foo: string; bar: number; }
type ReqFoo = Required<Foo>;
// このRequired<T>も標準ライブラリに入っています。

// もう少し実用的な例として、実際にmapped typeを使う関数を定義する例も見せておきます。
function propStringify<T>(obj: T): { [P in keyof T]: string } {
	const result = {} as { [P in keyof T]: string };
	for (const key in obj) {
		result[key] = String(obj[key]);
	}
	return result;
}
/**
 * この例ではasを使ってresultの型を{[P in keyof T]: string}にしてから実際にひとつずつプロパティを追加していっています。
 * asやanyなどを使わずにこの関数を書くのは難しい気がします。
 * そのため、mapped typeはどちらかというと関数が使われる側の利便性のために使われるのが主でしょう。
 * ライブラリの型定義ファイルを書く場合などは使うかもしれません。
 */

// ちなみに、mapped typeを引数の位置に書くこともできます。
{
    function pickFirst<T>(obj: {[P in keyof T]: Array<T[P]>}): {[P in keyof T]: T[P] | undefined} {
        const result: any = {};
        for (const key in obj) {
            result[key] = obj[key][0];
        }
        return result;
    }

    const obj = {
        foo: [0, 1, 2],
        bar: ['foo', 'bar'],
        baz: [],
    };

    const picked = pickFirst(obj);
    picked.foo; // number | undefined型
    picked.bar; // string | undefined型
    picked.baz; // undefined型
}
/**
 * この例のすごいところは、pickFirstの型引数Tが推論できているところです。
 * objは{ foo: number[]; bar: string[]; baz: never[]; }という型を持っており、
 * それが{[P in keyof T]: Array<T[P]>}の部分型であることを用いて、Tを{ foo: number; bar: string; baz: never; }とできることを推論できています。
 * これをさらにmapped typeで移して、返り値の型は{ foo: number | undefined; bar: string | undefined; baz: undefined; }となります。
 * なお、bazの型はnever | undefinedですが、neverはunion型の中では消えるのでこれはundefinedとなります。

 * mapped typeは他にも色々な応用が出来るようです。実践的な例としては、Diff型をmapped typeなどを用いて実現することができます。ここまでの内容を理解していればこの記事も理解できると思います。
 */
