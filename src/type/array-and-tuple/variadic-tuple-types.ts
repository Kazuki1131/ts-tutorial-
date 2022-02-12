// Variadic Tuple Types
{
    // 少し前に出てきた可変長タプル型の構文では、タプル型の中に...配列と書くことができました。
    // 実は、ここに別のタプル型を与える機能もあります。
    // これを利用すると、配列のスプレット構文のように、タプル型に要素を付け加えた別のタプル型を作ることができます。
    {
        type SNS = [string, number, string];
        // [string, string, number, string, number];
        type SSNSN = [string, ...SNS, number];
    }

    // この機能はVariadic Tuple Typesと呼ばれるもので、TypeScript 4.0で導入されました。
    // この機能のすごい点は、...型変数の形で使うことができ、型推論の材料にできることです。
    {
        function removeFirst<T, Rest extends readonly unknown[]>(
            arr: [T, ...Rest]
        ): Rest {
            const [, ...rest] = arr;
            return rest;
        }

        // const arr: [number, number, string]
        const arr = removeFirst([1, 2, 3, "foo"]);

        // この例では、変数arrの型が[number, number, string]であることが型推論されます。
        // これは、removeFirstの型引数TおよびRestがそれぞれnumberおよび[number, number, string]であることがTypeScriptに理解されたことを意味しています。
        // 特に、引数[1, 2, 3, "foo"]を引数の型[T, ...Rest]に当てはめるという推論をTypeScriptが行なっています。
        // これが...型変数の型変数が推論の対象になるということです。
        // Variadic Tuple Typesの導入により、タプル型の操作に関するTypeScriptの推論能力が強化されました。
        // 上の例で言えば、removeFirst内の変数restの型が自動的にRestと推論されている点も注目に値します。
        // また、少し前に見たように、タプル型は関数の可変長引数の制御にも使われます。ここでもVariadic Tuple Typesが活躍するでしょう。
        // なお、型引数を...Tの形で使う場合はその型引数が配列型またはタプル型であるという制約をこちらで宣言してあげる必要があります。
        // 上の例のようにextends readonly unknown[]とすると良いでしょう。
    }

    // [...T]とTの違い
    {
        // [...T]は一見Tと全く同じ意味であるように見えますが、ジェネリクスと組み合わされた場合はちょっとした違いを生みます。
        function func1<T extends readonly unknown[]>(arr: T): T {
			return arr;
		}
		function func2<T extends readonly unknown[]>(arr: [...T]): T {
			return arr;
		}
		// const arr1: number[]
		const arr1 = func1([1, 2, 3]);
		// const arr2: [number, number, number]
		const arr2 = func2([1, 2, 3]);

        // この例のように、型引数の推論時に配列がT型の引数に当てはめられた場合は配列型が推論されますが、[...T]型の引数に当てはめられた場合はタプル型が推論されます。
        // 関数に渡された配列の各要素の型を得たいのに配列型になってしまうという場面で活用できるかもしれません。
    }
}
