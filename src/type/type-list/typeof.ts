// typeof
{
    // TypeScriptのちょっと便利な機能として、typeof型というのがあります。
    // これは、typeof 変数と書くと、その変数の型が得られるものです。
    let foo = "str";

	type FooType = typeof foo; // FooTypeはstringになる

	const str: FooType = "abcdef";
}
