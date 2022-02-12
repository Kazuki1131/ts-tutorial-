// テンプレートリテラル型;
{
    // テンプレートリテラル型は、特定の形の文字列のみを受け入れる型です。
    // この記事のはじめの方で見た文字列のリテラル型はただ一種類の文字列のみを受け入れる型でしたが、テンプレートリテラル型はもう少し柔軟です。
    // テンプレートリテラル型の構文はテンプレート文字列リテラルと類似しており、基本的には`なんらかの文字列`という形で、その通りの文字列のみが受け入れられます。
    // この中に混ぜて${ 型 }という構文を入れることがで、その型に当てはまる任意の値（の文字列表現）をそこに当てはめることができます。
    // 例えば、次の例で定義するHelloStr型はHello,の後に任意のstring型の値がくる文字列という意味です。
    // これは実質、Hello,で始まる文字列だけを受け入れる型となります。
    {
        type HelloStr = `Hello, ${string}`;
        const str1: HelloStr = "Hello, world!";
        const str2: HelloStr = "Hello, uhyo";
        // エラー: Type '"Hell, world!"' is not assignable to type '`Hello, ${string}`'.
        const str3: HelloStr = "Hell, world!";
    }

    // ${string}以外にもいくつかの型が使用可能です。例えば${number}とすると数値のみが入れられるようになります。
    // 次の例のように、数値（number型の値）を文字列に変換したときに可能な文字列が${number}の位置に入るものとして受け入れられます。
    // ただし、InfinityとNaNは${number}に含まれないようです。このため、${number}はあまり実用的ではありません。
    // 実用に耐えるのは、${string}や、あるいは文字列のリテラル型のユニオン型といったものを${ }の中に入れる場合です。
    {
        type PriceStr = `${number}円`;

        const str1: PriceStr = "100円";
        const str2: PriceStr = "-50円";
        const str3: PriceStr = "3.14円"
        const str4: PriceStr = "1e100円";
        // ここから下は全部エラー
        const str5: PriceStr = "1_000_000円";
        const str6: PriceStr = "円";
        const str7: PriceStr = "1,234円";
        const str8: PriceStr = "NaN円";
        const str9: PriceStr = "Infinity円":
    }

    // テンプレートリテラル型はTypeScript 4.1 で導入された際に大きな話題になりました。
    // それは、conditional types（infer）と組み合わせることで型レベル計算における文字列操作が可能となったからです。
}
