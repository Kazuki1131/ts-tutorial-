// ?: 省略可能なプロパティ
{
    // ?を付けて宣言したプロパティは省略可能になります。
    interface MyObj {
		foo: string;
		bar?: number;
	}

	let obj: MyObj = {
		foo: "string",
	};

	obj = {
		foo: "foo",
		bar: 100,
	};

    // この例ではbarが省略可能なプロパティです。
    // barは省略可能なので、fooだけを持つオブジェクトと、fooとbarを両方持つオブジェクトはどちらもMyObj型の値として認められます。

    // オプショナルなプロパティに対するアクセス
    {
        // 実際のJavaScriptでは存在しないプロパティにアクセスするとundefinedが返ります。
        // ということは、MyObj型の値に対してbarプロパティを取得しようとすると、undefinedの可能性があるということです。
        // このことを反映して、MyObjのbarプロパティにアクセスした場合に得られる型はnumber | undefinedとなります。
        // このように、?修飾子を付けられたプロパティを取得する場合は自動的にundefined型とのunion型になります。
        // よって、それを使う側はこのようにundefinedチェックを行う必要があります。
        function func(obj: MyObj): number {
			return obj.bar !== undefined ? obj.bar * 100 : 0;
		}

        // なお、?を使わずに自分でbarの型をnumber | undefinedとしても同じ意味にはなりません。
        interface MyObj {
			foo: string;
			bar: number | undefined;
		}

		// エラー:
		// Type '{ foo: string; }' is not assignable to type 'MyObj'.
		//  Property 'bar' is missing in type '{ foo: string; }'.
		let obj: MyObj = {
			foo: "string",
		};

        // ?修飾子を使わない場合は、たとえundefinedが許されているプロパティでもきちんと宣言しないといけないのです。
        // 多くの場合、bar?: number;よりもbar: number | undefinedを優先して使用することをお勧めします。
        // 前者はbarが無い場合に本当に無いのか書き忘れなのか区別ができず、ミスの原因になります。
        // 後者の場合は書き忘れを防ぐことができます。 本当に「無くても良い」場面は関数にオプションオブジェクトを渡すくらいしか無く、
        // 以下に紹介する記事でも「その他のオブジェクトが長期間生存するようなケースでは, そもそもオプショナルなプロパティ自体を避けましょう」とされています。
        // 筆者もこれに同意しており、「便利さ」よりも「安全性」を取りたい多くの場面ではオプショナルなプロパティではなくundefinedなどとのユニオン型としたほうが賢明です。
    }

    // exactOptionalPropertyTypesコンパイラオプションとの関係;
    {
		// オプショナルなプロパティの挙動は、exactOptionalPropertyTypesコンパイラオプションが有効かどうかによって変わります。
		// デフォルトではこのオプションは無効で、比較的最近 (TypeScript 4.4) 追加されたオプションということもあり、無効にしているプロジェクトの方が多いでしょう。
		// このオプションが無効の場合は、bar?: number;というのはbar?: number | undefined;と書いたのと同じ意味になります。
		// つまり、オプショナルなプロパティには明示的にundefinedを入れることができます。

        {
            // exactOptionalPropertyTypesが無効の場合
            interface MyObj {
                foo: string;
                bar?: number;
            }

            // 全部OK
            const obj1: MyObj = { foo: "pichu" };
            const obj2: MyObj = { foo: "pikachu", bar: 25 };
            const obj3: MyObj = { foo: "raichu", bar: undefined };
        }

        // 一方で、exactOptionalPropertyTypesが有効の場合、オプショナルなプロパティにundefinedを入れることができなくなります。
        {
			// exactOptionalPropertyTypesが有効の場合
			interface MyObj {
				foo: string;
				bar?: number;
			}

			const obj1: MyObj = { foo: "pichu" };
			const obj2: MyObj = { foo: "pikachu", bar: 25 };
			// エラー: Type 'undefined' is not assignable to type 'number'.
			const obj3: MyObj = { foo: "raichu", bar: undefined };

            // これまでbar?: number;と書いたら自動的にbar: undefinedが可能になるのはあまり直感的な挙動ではありませんでしたが、
            // exactOptionalPropertyTypesを有効にすることでこれが改善されます。
            // また、このオプションが有効な状態ではbar?: number;と宣言されたプロパティに対しては「number型の値が入っている」か「プロパティが存在しない」のどちらかになります。
            // よって、in演算子（プロパティが存在するかどうか判定する演算子」を用いて型の絞り込みが行えるようになります。
            {
				// exactOptionalPropertyTypesが有効の状態で
				interface MyObj {
					foo: string;
					bar?: number;
				}

				function func(obj: MyObj) {
					if ("bar" in obj) {
						// ここでは obj.bar は number 型
						console.log(obj.bar.toFixed(1));
					}
				}
                // ただし、別のライブラリから提供された型定義にオプショナルなプロパティがある場合は注意が必要です。
                // なぜなら、そちらのライブラリはexactOptionalPropertyTypesが無効の状態で作られているかもしれず、
                // そうなるとこちらの設定では有効だとしても、「undefined型の値が入っている」という状態になる可能性があるからです。
			}
		}

	}

}
