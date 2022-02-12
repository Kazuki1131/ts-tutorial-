// asによるダウンキャスト
{
    // ここで型に関連する話題として、asによるダウンキャストを紹介します。
    // これはTypeScript独自の構文で、式 as 型と書きます。
    // ダウンキャストなので当然型安全ではありませんが、TypeScriptを書いているとたまに必要になる場面があります。
    // なお、ダウンキャストというのは、派生型の値を部分型として扱うためのものです。
    const value = rand();

	const str = value as number;
	console.log(str * 10);

	function rand(): string | number {
		if (Math.random() < 0.5) {
			return "hello";
		} else {
			return 123;
		}
	}

    // この例でvalueはstring | number型の値ですが、value as numberの構文によりnumber型として扱っています。
    // よって変数strはnumber型となります。これは安全ではありません。
    // なぜなら、valueは実際にはstring型、すなわち文字列かもしれないので、変数strに文字列が入ってしまう可能性があるからです。
    // なお、asを使っても全く関係ない2つの値を変換することはできません。
    {
        const value = "foo";
        // エラー: Type 'string' cannot be converted to type 'number'.
        const str = value as number;
    }

    // その場合、any型か後述のunknown型を経由すれば変換できます。
    {
        const value = "foo";
        const str = value as unknown as number;

        // ちなみに、この例に見えるように、asはアップキャストもできます。
        // 最初のas unknownで行われているのはダウンキャストではなくアップキャストであり、その後as numberでダウンキャストしています。
        // 他のアップキャストの例としては、const foo: string = 'foo'; とする代わりにconst foo = 'foo' as string;とするような場合が挙げられます（'foo'型をstring型にアップキャストしている）。
        // アップキャスト自体はasを使わなくてもできる安全な操作です。アップキャストにasを使うのは、危険なダウンキャストと見分けがつかないのでやめたほうがよいでしょう。
    }
}
