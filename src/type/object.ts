//オブジェクト型
{
	// この例でinterfaceという構文が出てきましたが、これはTypeScript独自の（JavaScriptには存在しない）構文であり、オブジェクト型に名前を付けることができます。
	// この例では、{foo: string; bar: number}という型にMyObjという名前を付けています。
	// また、分かりやすくするためにconstに型注釈を付けていますが、型注釈をしなくてもオブジェクト型を推論してくれます。
	interface MyObj {
		foo: string;
		bar: number;
	}

	const a: MyObj = {
		foo: "foo",
		bar: 3,
	};

	// エラー:
	// Type '{ foo: string; bar: string; }' is not assignable to type 'MyObj'.
	//  Types of property 'bar' are incompatible.
	//    Type 'string' is not assignable to type 'number'.
	const b: MyObj = {
		foo: "foo",
		bar: "BARBARBAR",
	};

	// エラー:
	// Type '{ foo: string; }' is not assignable to type 'MyObj'.
	//  Property 'bar' is missing in type '{ foo: string; }'.
	const c: MyObj = {
		foo: "foo",
	};

    {
		// 一方、TypeScriptでは構造的部分型を採用しているため、次のようなことが可能です。
		interface MyObj2 {
			foo: string;
		}

		const a: MyObj = { foo: "foo", bar: 3 };
		const b: MyObj2 = a;

		// エラー:
		// Type '{ foo: string; bar: number; }' is not assignable to type 'MyObj2'.
		//  Object literal may only specify known properties, and 'bar' does not exist in type 'MyObj2'.
		const c: MyObj2 = { foo: "foo", bar: 3 };

		// 変数cに代入しようとしている{foo: 'foo', bar: 3}はfooプロパティがstring型を持つため、先ほどの例で考えれた、barプロパティが余計であるもののMyObj2型の変数に代入できるはずです。
		// しかし、オブジェクトリテラルの場合は余計なプロパティを持つオブジェクトは弾かれてしまうのです。
		// どうしてもこのような操作をしたい場合はひとつ前の例のように別の変数に入れることになります。
		// 一度値を変数に入れるだけで挙動が変わるというのは直感的ではありませんが、TypeScriptでは入口だけ見ていてやるからあとは自己責任でということなのでしょう。

		// なお、上の例では変数bがMyObj2型であることを明示していましたが、関数引数の場合でも同じ挙動となります。
		// エラー:
		// Argument of type '{ foo: string; bar: number; }' is not assignable to parameter of type 'MyObj2'.
		//  Object literal may only specify known properties, and 'bar' does not exist in type 'MyObj2'.
		func({ foo: "foo", bar: 3 });

		function func(obj: MyObj2): void {}
	}
}
