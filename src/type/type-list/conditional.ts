/**
 * conditional types
 * これは型レベルの条件分岐が可能な型です。
 * 4つの型を用いてT extends U ? X : Yという構文で表現される型です。
 * いわゆる条件演算子を彷彿とさせる記法で、意味もその直感に従います。
 * すなわち、この型はTがUの部分型ならばXに、そうでなければYになります。
 */

/**
 * mapped typesの限界
 * mapped typeが導入された当初から指摘されていた問題として、deepなマッピングができないという問題がありました。
 * 先ほど組み込みのReadonly<T>を紹介しましたが、これはプロパティをshallowにreadonly化します。
 */
{
    interface Obj {
        foo: string;
        bar: {
            hoge: number;
        };
    }
}
/**
 * このような型に対してReadonly<Obj>は{ readonly foo: string; readonly bar: { hoge: number; }; }となります。
 * つまり、barの中のhogeはreadonlyになりません。
 * これはこれで役に立つかもしれませんが、ネストしているオブジェクトも含めて全部readonlyにしてくれるようなもの、すなわちDeepReadonly<T>のほうが需要がありました。
 * 少し考えると、これは再帰的な定義にしなければならないことが分かります。しかし、次のような素朴な定義はうまくいきません。
 */
{
    type DeepReadonly<T> = {
        readonly [P in keyof T]: DeepReadonly<T[P]>;
    };
}

//次に示すように、これは一見うまくいくように見えます。
{
    type DeepReadonly<T> = {
        readonly [P in keyof T]: DeepReadonly<T[P]>;
    };

    interface Obj {
        foo: string;
        bar: {
            hoge: number;
        };
    }

    type ReadonlyObj = DeepReadonly<Obj>;

    const obj: ReadonlyObj = {
        foo: "foo",
        bar: {
            hoge: 3,
        },
    };

    // エラー: Cannot assign to 'hoge' because it is a constant or a read-only property.
    obj.bar.hoge = 3;
}

// しかし、これはDeepReadonly<T>のTの型が何か判明しているからであり、次のような状況ではうまくいかなくなります。
{
    type DeepReadonly<T> = {
        readonly [P in keyof T]: DeepReadonly<T[P]>;
    };

    function readonlyify<T>(obj: T): DeepReadonly<T> {
        // エラー: Excessive stack depth comparing types 'T' and 'DeepReadonly<T>'.
        return obj as DeepReadonly<T>;
    }
}
// つまり、あのような単純な再帰では一般のTに対してどこまでもmapped typeを展開してしまうことになり、それを防ぐためにconditional typeが必要となるわけです。

/**
 * conditional typeによるDeepReadonly<T>
 * では、conditional typeを用いたDeepReadonly<T>をhttps://github.com/Microsoft/TypeScript/pull/21316 から引用します。
 */
{
    type DeepReadonly<T> = T extends any[]
        ? DeepReadonlyArray<T[number]>
        : T extends object
        ? DeepReadonlyObject<T>
        : T;

    interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

    type DeepReadonlyObject<T> = {
        readonly [P in NonFunctionPropertyNames<T>]: DeepReadonly<T[P]>;
    };

    type NonFunctionPropertyNames<T> = {
        [K in keyof T]: T[K] extends Function ? never : K;
    }[keyof T];
}
/**
 * DeepReadonly<T>がconditional typeになっており、Tが配列の場合、配列以外のオブジェクトの場合、それ以外の場合（すなわちプリミティブの場合）に分岐しています。
 * 配列の場合はDeepReadonlyArray<T>で処理し、それ以外のオブジェクトはDeepReadonlyObject<T>で処理しています。
 * プリミティブの場合はそのプロパティを考える必要はないため単にTを返しています。
 *
 * DeepReadonlyArray<T>は、要素の型であるTをDeepReadonly<T>で再帰的に処理し、配列自体の型はReadonlyArray<T>により表現しています。
 * ReadonlyArray<T>というのは標準ライブラリにある型で、各要素がreadonlyになっている配列です。
 * T[number]というのは配列であるTに対してnumber型のプロパティ名でアクセスできるプロパティの型ですから、すなわち配列Tの要素の型ですね。
 *
 * DeepReadonlyObject<T>は上の素朴な場合と同様にmapped typeを用いて各プロパティを処理しています。
 * ただし、NonFunctionPropertyNames<T>というのはTのプロパティ名のうち関数でないものです。
 * よく見るとこれもconditional typeで実装されています。さっき記事を紹介したDiffとアイデアは同じですが、conditional typeにより簡単に書けています。
 *
 * つまり、このDeepReadonlyObject<T>は実はTからメソッド（関数であるようなプロパティ）を除去します。
 * これにより、メソッドが自己を書き換える可能性を排除しているのでしょう。
 *
 * 実のところ、DeepReadonly<T>の本質は、conditional typeが遅延評価されるところにあります。
 * DeepReadonly<T>の分岐条件はTが何なのかわからないと判定できないので必然的にそうなりますが。これにより、評価時に無限に再帰することを防いでいます。
 */
{
    type List<T> = {
        value: T;
        next: List<T>;
    } | undefined;
}
// のような再帰的な型にもDeepReadonly<T>を適用することができました。

/**
 * conditional typeにおける型マッチング
 * 実はconditional typeにはさらに強力な機能があります。
 * それは、conditional typeの条件部で新たな型変数を導入できるという機能です。
 * https://github.com/Microsoft/TypeScript/pull/21496 から例を引用します。
 */
{
    type ReturnType<T> = T extends (...args: any[]) => infer R ? R : T;
}
/**
 * ReturnType<T>は、Tが関数の型のとき、その返り値の型となります。
 * ポイントは、関数の型の返り値部分にあるinfer Rです。
 * このようにinferキーワードを用いることでconditional typeの条件部分で型変数を導入することができます。
 * 導入された型変数は分岐のthen側で利用可能になります。

 * つまり、このReturnType<T>は、Tが(...args: any[]) => R（の部分型）であるときRに評価されるということです。
 * then側でしか型変数が使えないのは、else側ではTが(... args: any[]) => Rの形をしていないかもしれないことを考えると当然ですね。
 * このことから分かるように、この機能は型に対するパターンマッチと見ることができます。

 * 実は同じ型変数に対するinferが複数箇所に現れることも可能です。
 * その場合、推論される型変数にunion型やintersection型が入ることもあります。人為的な例ですが、次の例で確かめられます。
 */
type Foo<T> =
    T extends {
        foo: infer U;
        bar: infer U;
        hoge: (arg: infer V)=> void;
        piyo: (arg: infer V)=> void;
    } ? [U, V] : never;

interface Obj {
    foo: string;
    bar: number;
    hoge: (arg: string)=> void;
    piyo: (arg: number)=> void;
}

declare let t: Foo<Obj>; // tの型は[string | number, string & number]
/**
 * 部分型関係を考えれば、Uがunion型で表現されてVがintersection型で表現される理由が分かります。
 * Uはcovariantな位置に、Vはcontravariantな位置に出現しているからです。
 * ちなみに、試しに両方の位置に出現させてみたところ、Foo<Obj>が解決されなくなりました。

 * ちなみに、ReturnType<T>など、conditional typesを使った型がいくつか標準ライブラリに組み込まれるようです。自分でconditional typesと戦わなくても恩恵を得られる場面が多いと思います。
 */

/**
 * Conditional Typesによる文字列操作
 * inferとテンプレートリテラル型を組み合わせることで、型レベルの文字列操作が可能になります。例えば、"Hello, world!"型というリテラル型からworld部分を抜き出すには次のようにします。
 */
type ExtractHelloedPart<S extends string> = S extends `Hello, ${infer P}!`
	? P
	: unknown;

// type T1 = "world"
type T1 = ExtractHelloedPart<"Hello, world!">;
// type T2 = unknown
type T2 = ExtractHelloedPart<"Hell, world!">;
/**
 * TypeScript 4.1のリリース前後には、これを活用して型レベルパーサーや型レベルインタプリタといった様々な作品が作られました。非常に大きな可能性を秘めた機能です。
 */
