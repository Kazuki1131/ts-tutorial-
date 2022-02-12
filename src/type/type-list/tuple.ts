// タプル型
{
	//TypeScriptはタプル型という型も用意しています。
	// ただし、JavaScriptにはタプルという概念はありません。
	// そこで、TypeScriptでは配列をタプルの代わりとして用いることにしています。
	// これは、関数から複数の値を返したい場合に配列に入れてまとめて返すみたいなユースケースを想定していると思われます。
	//タプル型は[string, number]のように書きます。
	// これは実際のところ、長さが2の配列で、0番目に文字列が、1番目に数値が入ったようなものを表しています。
	const foo: [string, number] = ["foo", 5];

	const str: string = foo[0];

	function makePair(x: string, y: number): [string, number] {
		return [x, y];
	}

	{
		// ただし、タプル型の利用は注意する必要があります。
		// TypeScriptがタプルと呼んでいるものはあくまで配列ですから、配列のメソッドで操作できます。
		const tuple: [string, number] = ["foo", 3];

		tuple.pop();
		tuple.push("Hey!");

		const num: number = tuple[1];

		// 上記コードはTypeScriptでエラー無くコンパイルできますが、実際に実行すると変数numに入るのは数値ではなく文字列です。
		// このあたりはTypeScriptの型システムの限界なので、タプル型を使用するときは注意するか、あるいはそもそもこのようにタプル型を使うのは避けたほうがよいかもしれません。
	}

	{
		// また、TypeScriptのタプル型は、可変長のタプル型の宣言が可能です。
		// それはもはやタプルなのかという疑問が残りますが、これは実質的には最初のいくつかの要素の型が特別扱いされたような配列の型となります。
		// ちなみに、...を使えるのはタプル型のどこかに1回だけです。
		// 例えば「まず数値が並んで次に文字列が並ぶ配列の型」として[...number[], ...string[]]のような型を考えたくなるかもしれませんが、これは...を2回使っているのでだめです。
		type NumAndStrings = [number, ...string[]];

		const a1: NumAndStrings = [3, "foo", "bar"];
		const a2: NumAndStrings = [5];
		// エラー: Type 'string' is not assignable to type 'number'.
		const a3: NumAndStrings = ["foo", "bar"];

		// このように、可変長タプル型は最後に...(配列型)という要素を書いたタプル型として表されます。
		// ここで定義したNumAndStrings型は、最初の要素が数値で、残りは文字列であるような配列の型となります。
		// 変数a3は、最初の要素が数値でないのでエラーとなります。
		// もちろん、[number, string, ...any[]]のように型を指定された要素が複数あっても構いません。
	}

	{
		// 例えば、最後の要素だけnumber型で他はstring型の配列は次のように書けます。
		type StrsAndNumber = [...string[], number];

		const b1: StrsAndNumber = ["foo", "bar", "baz", 0];
		const b2: StrsAndNumber = [123];
		// エラー:
		// Type '[string, string]' is not assignable to type 'StrsAndNumber'.
		//   Type at position 1 in source is not compatible with type at position 1 in target.
		//     Type 'string' is not assignable to type 'number'.
		const b3: StrsAndNumber = ["foo", "bar"];
	}

	{
		//さらに、オプショナルな要素を持つタプル型もあります。
		// これは、[string, number?]のように型に?が付いた要素を持つタプル型です。
		// この場合、2番目の要素はあってもいいし無くてもいいという意味になります。
		// ある場合はnumber型でなければなりません。
		type T = [string, number?];

		const t1: T = ["foo"];
		const t2: T = ["foo", 3];

		// オプショナルな要素は複数あっても構いませんが、そうでない要素より後に来なければいけません。
		// 例えば[string?, number]のような型はだめです。
	}

	//タプル型と可変長引数
	{
		// 最近（TypeScript 3.0）になってタプル型の面白い使い道が追加されました。
		// それは、タプル型を関数の可変長引数の型を表すのに使えるというものです。
		type Args = [string, number, boolean];

		const func = (...args: Args) => args[1];

		// vの型はnumber
		const v = func("foo", 3, true);

		// 上の例では、可変長引数argsの型はArgs、すなわち[string, number, boolean]です。
		// これに合わせるために、すなわち引数の列argsが型Argsを持つようにするためには、関数funcの最初の引数の型はstring、次はnumber、その次はbooleanでなければいけません。
		// もはや可変長という名前が嘘っぱちになっていますが、このようにタプル型を型の列として用いることによって、複数の引数の型をまとめて指定することができるのです。

		{
			// ここで可変長タプルを用いた場合、引数の可変長性が保たれることになります。
			type Args = [string, ...number[]];

			const func = (f: string, ...args: Args) => args[0];

			const v1 = func("foo", "bar");
			const v2 = func("foo", "bar", 1, 2, 3);
		}
	}

	// 関数呼び出しのspreadとタプル型
	{
		// ...という記法は関数呼び出しのときにも使うことができます。
		const func = (...args: string[]) => args[0];

		const strings: string[] = ["foo", "bar", "baz"];

		func(...strings);

		// func(...strings)の意味は、配列stringsの中身をfuncの引数に展開して呼び出すということです。
		// つまり、funcの最初の引数はstringsの最初の要素になり、2番目の引数は2番目の要素に……となります。

		{
			// タプル型はここでも使うことができます。
			// 適切なタプル型の配列を...で展開することで、型の合った関数を呼び出すことができるのです。
			const func = (str: string, num: number, b: boolean) =>
				args[0] + args[1];

			const args: [string, number, boolean] = ["foo", 3, false];

			func(...args);
		}
	}

	// タプル型と可変長引数とジェネリクス
    {
        // ジェネリクスを組み合わせることによって、面白いことができるようになります。タプル型をとるような型変数を用いることで、関数の引数列をジェネリクスで扱うことができるのです。
        // 例として、関数の最初の引数があらかじめ決まっているような新しい関数を作る関数bindを書いてみます。
        function bind<T, U extends any[], R>(
			func: (arg1: T, ...rest: U) => R,
			value: T
		): (...args: U) => R {
			return (...args: U) => func(value, ...args);
		}

		const add = (x: number, y: number) => x + y;

		const add1 = bind(add, 1);

		console.log(add1(5)); // 6

		// Argument of type '"foo"' is not assignable to parameter of type 'number'.
		add1("foo");

        // 関数bindは2つの引数funcとvalueを取り、新しい関数(...args: U) => func(value, ...args)を返します。
        // この関数は、受け取った引数列argsに加えて最初の引数としてvalueをfuncに渡して呼び出した返り値をそのまま返す関数です。
        // ポイントは、まずU extends any[]の部分ですね。
        // これは新しい記法ですが、型引数Uはany[]の部分型でなければならないという意味です。
        // string[]などの配列型に加えてタプル型も全部any[]の部分型です。
        // この制限を加えることにより、...rest: Uのように可変長引数の型としてUを使うことができます。
        // 加えて、bind(add, 1)の呼び出しでは型変数はそれぞれT = number, U = [number], R = numberと推論されます。
        // 返り値の型は(...args: U) => Rすなわち(arg: number) => numberとなります。
        // 特に、Uがタプル型に推論されるのが偉いですね。これにより、addの引数の情報が失われずにadd1に引き継がれています。

    }
}
