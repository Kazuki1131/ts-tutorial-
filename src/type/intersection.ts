// intersection型（交差型）
{
	// union型とある意味で対になるものとしてintersection型があります。2つの型T, Uに対してT & Uと書くと、TでもありUでもあるような型を表します。
	interface Hoge {
		foo: string;
		bar: number;
	}
	interface Piyo {
		foo: string;
		baz: boolean;
	}

	const obj: Hoge & Piyo = {
		foo: "foooooooo",
		bar: 3,
		baz: true,
	};

	// たとえばこの例では、Hoge & PiyoというのはHogeでもありPiyoでもある型を表します。
	// ですから、この型の値はstring型のプロパティfooとnumber型のプロパティbarを持ち、さらにboolean型のプロパティbazを持つ必要があります。

    {
        // ちなみに、union型とintersection型を組みあわせると楽しいです。次の例を見てください。
        interface Hoge {
            type: "hoge";
            foo: string;
        }
        interface Piyo {
            type: "piyo";
            bar: number;
        }
        interface Fuga {
            baz: boolean;
        }

        type Obj = (Hoge | Piyo) & Fuga;

        function func(obj: Obj) {
            // objはFugaなのでbazを参照可能
            console.log(obj.baz);
            if (obj.type === "hoge") {
                // ここではobjは Hoge & Fuga
                console.log(obj.foo);
            } else {
                // ここではobjはPiyo & Fuga
                console.log(obj.bar);
            }
        }

        // Obj型は(Hoge | Piyo) & Fugaですが、実はこれは(Hoge & Fuga) | (Piyo & Fuga)と同一視されます。
        // よって、union型のときと同様にif文で型を絞り込むことができるのです。

        // union型を持つ関数との関係
        {
            // 関数型を含むunion型というものも考えることができます。
            // 当然ながら、関数とそれ以外のunion型を作った場合はそれを関数として呼ぶことはできません。
            // 下の例では、Func | MyObj型の値objはMyObj型の可能性がある、つまり関数ではない可能性がありますので、obj(123)のように関数として使うことはできません。

            type Func = (arg: number) => number;
            interface MyObj {
                prop: string;
            }

            const obj: Func | MyObj = { prop: "" };

            // エラー: Cannot invoke an expression whose type lacks a call signature.
            //        Type 'MyObj' has no compatible call signatures.
            obj(123);

        }
    }
}
        // では、union型の構成要素が全部関数だったら呼べそうな気がします。次の例はどうでしょうか。
        type StrFunc = (arg: string) => string;
		type NumFunc = (arg: number) => string;

		declare const obj: StrFunc | NumFunc;
		// エラー: Argument of type '123' is not assignable to parameter of type 'string & number'.
		//        Type '123' is not assignable to type 'string'.
		obj(123);

        // この例では、StrFunc | NumFunc型の変数objを作っています。
        // StrFunc型は文字列を受け取って文字列を返す関数の型で、NumFunc型は数値を受け取って文字列を返す関数の型です。
        // しかし、objを呼ぶところでまだエラーが発生しています。
        // エラーメッセージから察しがついている方もいらっしゃると思いますが、このStrFunc | NumFunc型の関数を呼ぶことは実質できません。
        // なぜなら、objはStrFunc型かもしれないので引数は文字列でないといけません。
        // 一方、NumFunc型かもしれないので引数は数値でないといけません。
        // つまり、引数が文字列であることと数値であることが同時に要求されています。
        // エラーメッセージに出てくるstring & numberという型はこのことを表しています。
        // 文字列であると同時に数値であるような値（つまりstring & number型の値）は存在しないため、この関数を呼ぶことは実質的にできないのです。
        // このように、関数同士のunionを考えるとき、結果の関数の引数はもともとの引数同士のintersection型を持つ必要があります。
        // 難しい言葉でいうと、これは関数の引数の型が反変 (contravariant) の位置にあることが影響しています。

        // 引数の型がintersection型で表現されるということで、intersection型をとっても意味がある例を見てみます。
        interface Hoge {
            foo: string;
            bar: number;
        }
        interface Piyo {
            foo: string;
            baz: boolean;
        }

        type HogeFunc = (arg: Hoge) => number;
        type PiyoFunc = (arg: Piyo) => boolean;

        declare const func1: HogeFunc | PiyoFunc;

        // resは number | boolean 型
        const res = func1({
            foo: "foo",
            bar: 123,
            baz: false,
        });

        // この例ではfuncはHogeFunc | PiyoFunc型です。
        // HogeFuncの引数はHogeでPiyoFuncの引数はPiyoなので、funcの引数の型はHoge & Piyo型である必要があります。
        // よって、Hoge & Piyo型を持つオブジェクトを作ることでfuncを呼ぶことができます。
        // この例ではresの型はnumber | boolean型となります。
        // これは、funcの型がHogeFuncの場合は返り値がnumberであり、PiyoFuncの場合は返り値がbooleanであることから説明できます。
        // このように、関数同士のunion型を持つ関数を呼びたい場合にintersection型の知識が役に立ちます。
        // 特に、先ほど見たようにエラーメッセージにintersection型が現れますから、intersection型のことも覚えておいたほうがよいでしょう。（そんな機会がどれだけあるのかは聞いてはいけません。）
        // なお、この辺りの処理は扱いが難しいためか、現在のところ制限があります。
        // 具体的には関数のオーバーロードがある場合やジェネリクスが関わる場合に関数が呼べなかったり、引数の型が推論できなかったりする場合があります。
        // 一応例だけ示しておきますが、困る機会はそんなに無いのではないかと思います。
        const arr: string[] | number[] = [];
		// エラー: Parameter 'x' implicitly has an 'any' type.
		arr.forEach((x) => console.log(x));
		// エラー: Cannot invoke an expression whose type lacks a call signature.
		const arr2 = arr.map((x) => x);
