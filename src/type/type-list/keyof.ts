// keyof
{
    // あるTを型とすると、keyof Tという型の構文があります。
    // keyof Tは、「Tのプロパティ名全ての型」です。
    {
        interface MyObj {
			foo: string;
			bar: number;
		}

		let key: keyof MyObj;
		key = "foo";
		key = "bar";
		// エラー: Type '"baz"' is not assignable to type '"foo" | "bar"'.
		key = "baz";
    }

    // この例では、MyObj型のオブジェクトはプロパティfooとbarを持ちます。
    // なので、プロパティ名として可能な文字列は'foo'と'bar'のみであり、
    // keyof MyObjはそれらの文字列のみを受け付ける型、すなわち'foo' | 'bar'になります。
    // よって、keyof MyObj型の変数であるkeyに'baz'を代入しようとするとエラーとなります。
    // なお、JavaScriptではプロパティ名は文字列のほかにシンボルである可能性もあります。
    // よって、keyof型はシンボルの型を含む可能性もあります。
    {
		// 新しいシンボルを作成
		const symb = Symbol();

		const obj = {
			foo: "str",
			[symb]: "symb",
		};

		//ObjType = 'foo' | typeof symb
		type ObjType = keyof typeof obj;
	}

    // この例では、objのプロパティ名の型をkeyofで得ました。
    // ObjTypeは'foo' | typeof symbとなっています。
    // これは'foo' | symbolとはならない点に注意してください。
    // TypeScriptではシンボルはsymbol型ですが、プロパティ名としてはシンボルはひとつずつ異なるためsymbに入っている特定のシンボルでないといけないのです。
    // さらに、keyof型にはnumberの部分型が含まれる場合もあります。
    // それは、数値リテラルを使ってプロパティを宣言した場合です。
    {
        const obj = {
			foo: "str",
			0: "num",
		};

		// ObjType = 0 | 'foo'
		type ObjType = keyof typeof obj;
    }

    // JavaScriptではプロパティ名に数値は使えません（使おうとした場合文字列に変換されます）が、
    // TypeScriptでは数値をプロパティ名に使用した場合は型の上ではそれを保とうとするということです。
    // なお、インデックスシグネチャを持つオブジェクトの場合は少し特殊な挙動をします。
    {
        interface MyObj {
			[foo: string]: number;
		}

		// MyObjKey = string | number
		type MyObjKey = keyof MyObj;
    }

    // この例で定義したMyObj型は任意のstring型の名前に対してその名前のプロパティはnumber型を持つという意味になっています。
    // ということは、MyObj型のオブジェクトのキーとしてはstring型の値すべてが使用できます。
    // よって、keyof MyObjはstringになることが期待できますね。 しかし、実際にはこれはstring | numberとなります。
    // これは、数値の場合もどうせ文字列に変換されるのだからOKという意図が込められています。
    // 一方、インデックスシグネチャのキーの型はnumberの場合はkeyof MyObjはnumberのみとなります。
}
