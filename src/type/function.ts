//関数型
{
    // 関数型は例えば(foo: string, bar: number)=> booleanのように表現されます。
    // これは、第1引数としてstring型の、第2引数としてnumber型の引数をとり、返り値としてboolean型の値を返す関数の型です。
    // 型に引数の名前が書いてありますが、これは型の一致等の判定には関係ありません。
    // よって、(foo: number)=> string型の値を(arg1: number)=> string型の変数に代入するようなことは問題なく行えます。
    const f: (foo: string) => number = func;

    function func(arg: string): number {
        return Number(arg);
    }

    // 関数の部分型関係
    {
        // 関数型に対しては、普通の部分型関係があります。
        interface MyObj {
            foo: string;
            bar: number;
        }

        interface MyObj2 {
            foo: string;
        }

        const a: (obj: MyObj2) => void = () => {};
        const b: (obj: MyObj) => void = a;

        // また、関数の場合、引数の数に関しても部分型関係が発生します。
        {
            const f1: (foo: string) => void = () => {};
            const f2: (foo: string, bar: number) => void = f1;
        }

        // ただし、関数を呼び出す側で余計な引数を付けて呼び出すことはできないので注意してください。
        // これは先のオブジェクトリテラルの例と同じくミスを防止するためでしょう。
        {
            const f1: (foo: string) => void = () => {};

            // エラー: Expected 1 arguments, but got 2.
            f1("foo", 3);
        }
    }

    //可変長引数
    {
        // TypeScriptでもJS同様、可変長引数の関数を宣言できます。
        // その場合、可変長引数の部分の型は配列にします。
        // 次の例では...barにnumber[]型が付いているため、2番目以降の引数は全て数値でなければいけません。
        const func = (foo: string, ...bar: number[]) => bar;

		func("foo");
		func("bar", 1, 2, 3);
		// エラー: Argument of type '"hey"' is not assignable to parameter of type 'number'.
		func("baz", "hey", 2, 3);
	}
}
