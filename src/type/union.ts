// union型（合併型）
{
	// union型は値が複数の型のどれかに当てはまるような型を表しています。
	// 記法としては、複数の型を|でつなぎます。
	// 例えば、string | numberという型は「文字列または数値の型」となります。
	let value: string | number = "foo";
	value = 100;
	value = "bar";
	// エラー: Type 'true' is not assignable to type 'string | number'.
	value = true;

	{
		// もちろん、プリミティブ型だけでなくオブジェクトの型でもunion型を作ることができます。
		interface Hoge {
			foo: string;
			bar: number;
		}
		interface Piyo {
			foo: number;
			baz: boolean;
		}

		type HogePiyo = Hoge | Piyo;

		const obj: HogePiyo = {
			foo: "hello",
			bar: 0,
		};

		// ここでtype文というのが登場していますが、これはTypeScript独自の文であり、新しい型を定義して名前を付けることができる文です。
		// この例ではHogePiyoという型をHoge | Piyoとして定義しています。
	}

	// union型の絞り込み
	{
		// union型の値というのはそのままでは使いにくいものです。
		// 例えば、上で定義したHogePiyo型のオブジェクトは、barプロパティを参照することができません。
		// なぜなら、HogePiyo型の値はHogeかもしれないしPiyoかもしれないところ、barプロパティはHogeにはありますがPiyoには無いからです。
		// 無い可能性があるプロパティを参照することはできません。
		// 同様に、bazプロパティも参照できません。fooプロパティは両方にあるので参照可能です（後述）。
		// 普通は、Hoge | Piyoのような型の値が与えられる場合、まずその値が実際にはどちらなのかを実行時に判定する必要があります。
		// そこで、TypeScriptではそのような判定を検出して適切に型を絞り込んでくれる機能があります。
		interface Hoge {
			foo: string;
			bar: number;
		}

		interface Piyo {
			foo: number;
			baz: boolean;
		}

		function useHogePiyo(obj: Hoge | Piyo): void {
			// ここではobjはHoge | Piyo型
			if ("bar" in obj) {
				// barプロパティがあるのはHoge型なのでここではobjはHoge型
				console.log("Hoge", obj.bar);
			} else {
				// barプロパティがないのでここではobjはPiyo型
				console.log("Piyo", obj.baz);
			}
		}
		// この例ではin演算子を使った例です。
		// 'bar' in objというのはbarというプロパティがobjに存在するならtrueを返し、そうでないならfalseを返す式です。
		// in演算子を使ったif文を書くことで、if文のthen部分とelse部分でobjの型がそれぞれHogeやPiyoとして扱われます。
		// このようにして変数の型を絞り込むことができます。
		// ただし、この例は注意が必要です。なぜなら、次のようなコードを書くことができるからです。
		const obj: Hoge | Piyo = {
			foo: 123,
			bar: "bar",
			baz: true,
		};
		useHogePiyo(obj);

		// objに代入されているのはPiyo型のオブジェクトに余計なbarプロパティが付いたものです。
		// ということはこれはPiyo型のオブジェクトとみなせるので、Hoge | Piyo型の変数にも代入可能です。
		// これをuseHogePiyoに渡すと良くないことが起こりますね。
		// objは実際Piyo型なのに、これを実行すると'bar' in objが成立するのでobjがHoge型と見なされているところに入ってしまいます。
		// obj.barを参照していますが、これはHoge型のプロパティなのでnumber型が期待されているところ、実際は文字列が入っています。
		// このようにin演算子を用いた型の絞り込みは比較的最近 (TypeScript 2.7)入った機能ですが、ちょっと怖いので自分はあまり使いたくありません。
	}

	// typeofを用いた絞り込み
    {
        // もっと単純な例として、string | number型を考えましょう。
        // これに対する絞り込みはtypeof演算子でできます。
        // typeof演算子は与えられた値の型を文字列で返す演算子です。
        function func(value: string | number): number {
			if ("string" === typeof value) {
				// valueはstring型なのでlengthプロパティを見ることができる
				return value.length;
			} else {
				// valueはnumber型
				return value;
			}
		}
    }

    // nullチェック
    {
        // もうひとつunion型がよく使われる場面があります。それはnullableな値を扱いたい場合です。
        // 例えば、文字列の値があるかもしれないしnullかもしれないという状況はstring | nullという型で表すことができます。
        // string | null型の値はnullかもしれないので、文字列として扱ったりプロパティを参照したりすることができません。
        // これに対し、nullでなければ処理したいという場面はよくあります。
        // JavaScriptにおける典型的な方法はvalue != nullのようにif文でnullチェックを行う方法ですが、TypeScriptはこれを適切に解釈して型を絞り込んでくれます。
        function func(value: string | null): number {
			if (value != null) {
				// valueはnullではないのでstring型に絞り込まれる
				return value.length;
			} else {
				return 0;
			}
		}

        {
            // また、&&や||が短絡実行するという挙動を用いたテクニックもJavaScriptではよく使われますが、これもTypeScriptは適切に型検査してくれます。
            // 上の関数funcは次のようにも書くことができます。
            function func(value: string | null): number {
                return (value != null && value.length) || 0;
            }
        }
    }

    // 代数的データ型っぽいパターン
    {
        // これまで見たように、プリミティブ型ならunion型の絞り込みはけっこういい感じに動いてくれます。
        // しかし、やはりオブジェクトに対してもいい感じにunion型を使いたいという需要はあります。
        // そのような場合に推奨されているパターンとして、リテラル型とunion型を組み合わせることでいわゆる代数的データ型（タグ付きunion）を再現する方法があります。
        interface Some<T> {
			type: "Some";
			value: T;
		}
		interface None {
			type: "None";
		}
		type Option<T> = Some<T> | None;

		function map<T, U>(obj: Option<T>, f: (obj: T) => U): Option<U> {
			if (obj.type === "Some") {
				// ここではobjはSome<T>型
				return {
					type: "Some",
					value: f(obj.value),
				};
			} else {
				return {
					type: "None",
				};
			}
		}

        // これは値があるかもしれないし無いかもしれないことを表すいわゆるoption型をTypeScriptで表現した例です。
        // Option<T>型は、ある場合のオブジェクトの型であるSome<T>型と無い場合の型であるNone型のunionとして表現されています。
        // ポイントは、これらに共通のプロパティであるtypeです。
        // typeプロパティには、このオブジェクトの種類（SomeかNoneか）を表す文字列が入っています。
        // ここでtypeプロパティの型としてリテラル型を使うことによって、Option<T>型の値objに対して、
        // obj.typeが'Some'ならばobjの型はSome<T>で'None'ならばobjの型はNoneであるという状況を作っています。
        // 関数mapの中ではobj.typeの値によって分岐することにより型の絞り込みを行っています。
        // この方法はTypeScriptで推奨されている方法らしく、コンパイラのサポートも厚いです。

        {
            // 次のようにswitch文でも同じことができます。大抵はどちらでも良いですが、こちらのほうが良い挙動を示す場合があります。
            function map<T, U>(obj: Option<T>, f: (obj: T) => U): Option<U> {
				switch (obj.type) {
					case "Some":
						return {
							type: "Some",
							value: f(obj.value),
						};
					case "None":
						return {
							type: "None",
						};
				}
			}

            // このmap関数の場合はこちらのほうが拡張に対して強くて安全です。
            // 例えばOption<T>に第3の種類の値を追加した場合、if文のバージョンではその値に対してもNoneが返るのに対し、
            // switch文のバージョンではそのままではコンパイルエラーが出ます（第3の値に対する処理が定義されておらずmap関数が値を返さない可能性が生じてしまうため）。
            // そのため、関数の変更の必要性にすぐ気づくことができます。
            // このパターンはTypeScriptプログラミングにおいて頻出です。
            // オブジェクトで真似をしているため本物の代数的データ型に比べると記法が重いのが難点ですが仕方ありません。
        }
    }

    // union型オブジェクトのプロパティ
    {
        // オブジェクト同士のunion型を作った場合、そのプロパティアクセスの挙動は概ね期待通りの結果となります。
        // 少し前の例に出てきたHogePiyo型を思い出しましょう。
        interface Hoge {
			foo: string;
			bar: number;
		}
		interface Piyo {
			foo: number;
			baz: boolean;
		}

		type HogePiyo = Hoge | Piyo;

		function getFoo(obj: HogePiyo): string | number {
			// obj.foo は string | number型
			return obj.foo;
		}

        // Hoge | Piyo型の変数objのfooプロパティはアクセス可能であると述べましたが、実はその型はstring | number型となります。
        // これは、objがHoge型の場合にobj.fooはstring型であり、objがPiyo型の場合はobj.fooはnumber型となることから、obj.fooはstring型である場合とnumber型である場合があるという説明ができます。
        // 一方、barやbazはHoge | Piyo型には存在しない可能性があるためアクセスできません。この挙動は実情に合っているし直感的ですね。

        {
            // 配列の要素もオブジェクトのプロパティの一種なので、同じ挙動となります。
            const arr: string[] | number[] = [];

            // string[] | number[] 型の配列の要素は string | number 型
            const elm = arr[0];
        }
    }
}
