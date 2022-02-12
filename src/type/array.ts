//配列型
{
    // JavaScriptでは配列はオブジェクトの一種ですが、配列の型を表すために特別な文法が用意されています。
    // 配列の型を表すためには[]を用います。例えば、number[]というのは数値の配列を表します。
    const foo: number[] = [0, 1, 2, 3];
    foo.push(4);
    // TypeScriptにジェネリクスが導入されて以降はArray<number>と書くことも可能です。
}
