// リテラル型
{
    const a: 'foo' = 'foo';
    const b: 'bar' = 'foo'; // エラー: Type '"foo"' is not assignable to type '"bar"'.

    // 文字列のリテラル型はstringの部分型であり、文字列のリテラル型を持つ値はstring型として扱うことができます。他の型も同様です。
    {
        const a: "foo" = "foo";
        const b: string = a;
        const c: 0 = 0;
        const d: number = c;
        const e: true = true;
        const f: boolean = e;
    }
}


// リテラル型と型推論
{
    // 上の例では変数に全て型注釈を付けていましたが、これを省略してもちゃんと推論されます。
	const a = "foo"; // aは'foo'型を持つ
	const b: "bar" = a; // エラー: Type '"foo"' is not assignable to type '"bar"'.

    // これは、'foo'というリテラルの型が'foo'型であると推論されることによります。変数aは'foo'が代入されているので、aの型も'foo'型となります。
    // ただし、これはconstを使って変数を宣言した場合です。JavaScriptにおけるconstは変数に再代入されないことを保証するものですから、aにはずっと'foo'が入っていることが保証され、aの型を'foo'とできます。
    // 一方、constではなくletやvarを使って変数を宣言した場合は変数をのちのち書き換えることを意図していると考えられますから、最初に'foo'が入っていたからといって変数の型を'foo'型としてしまっては、他の文字列を代入することができなくて不便になってしまいます。
    // そこで、letやvarで変数が宣言される場合、推論される型はリテラル型ではなく対応するプリミティブ型全体に広げられます。

    {
        // 以下では、aはletで宣言されているのでstring型と推論されます。そのため、'foo'型を持つcに代入することはできなくなります。
		let a = "foo"; // aはstring型に推論される
		const b: string = a;
		const c: "foo" = a; // エラー: Type 'string' is not assignable to type '"foo"'.
	}

    {
        // letで宣言する場合も型注釈をつければリテラル型を持たせることができます。
		let a: "foo" = "foo";
		a = "bar"; // エラー: Type '"bar"' is not assignable to type '"foo"'.
	}
}
