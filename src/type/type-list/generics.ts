// ジェネリクス
{
    // 型名をFoo<S, T>のようにする、すなわち名前のあとに< >で囲った名前の列を与えることで、
    // 型の定義の中でそれらの名前を型変数として使うことができます。
    interface Foo<S, T> {
		foo: S;
		bar: T;
	}

	const obj: Foo<number, string> = {
		foo: 3,
		bar: "hi",
	};

    // この例ではFooは2つの型変数S, Tを持ちます。
    // Fooを使う側ではFoo<number, string>のように、SとTに当てはまる型を指定します。

    {
        // 他に、クラス定義や関数定義でも型変数を導入できます。
        class Foo<T> {
			constructor(obj: T) {}
		}

		const obj1 = new Foo<string>("foo");

		function func<T>(obj: T): void {}

		func<number>(3);

        {
            // ところで、上の例でfuncの型はどうなるでしょうか。
            // 実は、<T>(obj: T)=> voidという型になります。
            function func<T>(obj: T): void {}

            const f: <T>(obj: T) => void = func;
        }

        {
            // 余談ですが、型引数（func<number>(3)の<number>部分）は省略できます。
            function identity<T>(value: T): T {
				return value;
			}

			const value = identity(3);
			// エラー: Type '3' is not assignable to type 'string'.
			const str: string = value;

            // この例ではidentityは型変数Tを持ちますが、identityを呼び出す側ではTの指定を省略しています。
            // この場合引数の情報からTが推論されます。
            // 実際、今回引数に与えられている3は3型の値なので、Tが3に推論されます。
            // identityの返り値の型はTすなわち3なので、変数valueの型は3となります。
            // 3型の値はstring型の変数に入れることができないので最終行ではエラーになっています。
            // この例からTが正しく推論されていることが分かります。
            // ただし、複雑なことをする場合は型変数が推論できないこともあります。
        }
    }
}
