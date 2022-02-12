// プリミティブ型 (string, number, boolean, symbol, bigint, null and undefined)
{
    const a: number = 3;
    const b: string = a; // エラー: Type 'number' is not assignable to type 'string'.
}

// コンパイラオプションで--strictNullChecksをオンにしていないと、nullとundefinedは他の型の値として扱うことができてしまう。
// --strictNullChecksは常にオンにしておく
{
    const a: null = null;
    const b: string = a; // strictNullChecksがオンならエラー
}
