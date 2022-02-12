// never型
{
    // never型は「属する値が存在しない型」であり、部分型関係の一番下にある（任意の型の部分型となっている）型です。
    // どんな値もnever型の変数に入れることはできません。
    // エラー: Type '0' is not assignable to type 'never'.
    const n: never = 0;
}

// 一方、never型の値はどんな型にも入れることができます。

// never型の値を作る方法が無いのでdeclareで宣言だけする
declare const n: never;

const foo: string = n;

{
    // こう聞くとany型のように危険な型であるように思えるかもしれませんが、そんなことはありません。
    // never型に当てはまる値は存在しないため、never型の値を実際に作ることはできません。
    // よって、（TypeScriptの型システムを欺かない限りは）never型の値を持っているという状況があり得ないので、
    // never型の値を他の型の変数に入れるということがソースコード上であったとしても、実際には起こりえないのです。
    // 何を言っているのか分からない人もいるかもしれませんが、型システムを考える上ではこのような型はけっこう自然に出てきます。
    // とりあえず具体例を見てみましょう。これは先ほどのOption<T>の例を少し変更したものです。
    interface Some<T> {
        type: "Some";
        value: T;
    }
    interface None {
        type: "None";
    }
    type Option<T> = Some<T> | None;

    function map<T, U>(obj: Option<T>, f: (obj: T) => U): Option<U> {
        switch (obj.type) {
            case "Some":
                return {
                    type: "Some",
                    value: f(obj.value),
                };
            case "None":
                return {
                    type: "None",
                };
            default:
                // ここでobjはnever型になっている
                return obj;
        }
    }

    // switch文にdefaultケースが追加されました。
    // 実はこの中でobjの型はneverになっています。
    // なぜなら、それまでのcase文によってobjの可能性が全て調べ尽くされてしまったからです。
    // これが意味することは、実際にはdefault節が実行される可能性は無く、この中ではobjの値の候補が全く無いということです。
    // そのような状況を、objにnever型を与えることで表現しています。
}

// また、もうひとつnever型が出てくる可能性があるのは、関数の返り値です。
function func(): never {
	throw new Error("Hi");
}

const result: never = func();

// 関数の返り値の型がnever型となるのは、関数が値を返す可能性が無いときです。
// これは返り値が無いことを表すvoid型とは異なり、そもそも関数が正常に終了して値が返ってくるということがあり得ない場合を表します。
// 上の例では、関数funcは必ずthrowします。ということは、関数の実行は中断され、値を返すことなく関数を脱出します。
// 特に、上の例でfuncの返り値を変数resultに代入していますが、実際にはresultに何かが代入されることはあり得ません。
// ゆえに、resultにはnever型を付けることができるのです。
// なお、上の例ではfuncの返り値に型注釈でneverと書いていますが、省略すると返り値の型はvoidに推論されます。
// これは値を返さないぞということを明示したい場合はneverと型註釈で明示する必要があります。
// もし返り値をnever型とすることが不可能（何か値が返る可能性を否定できない）な場合はちゃんと型エラーになるので安心です。
