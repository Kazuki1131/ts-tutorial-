// object型と{}型
{
    // あまり目にすることがない型のひとつにobject型があります。
    // これは「プリミティブ以外の値の型」です。
    // JavaScriptにはオブジェクトのみを引数に受け取る関数があり、そのような関数を表現するための型です。
    // 例えば、Object.createは引数としてオブジェクトまたはnullのみを受け取る関数です。
    {
		// エラー: Argument of type '3' is not assignable to parameter of type 'object | null'.
		Object.create(3);
	}

    // ところで、{}という型について考えてみてください。
    // これは、何もプロパティがないオブジェクト型です。
    // プロパティが無いといっても、構造的部分型により、{foo: string}のような型を持つオブジェクトも{}型として扱うことができます。
    {
        const obj = { foo: 'foo' };
        const obj2: {} = obj;
    }

    // となると、任意のオブジェクトを表す型として{}ではだめなのでしょうか。
    // もちろん、答えはだめです。じつは、{}という型はオブジェクト以外も受け付けてしまうのです。ただし、undefinedとnullはだめです。
    {
        const o: {} = 3;
    }

    // これは、JavaScriptの仕様上、プリミティブに対してもプロパティアクセスができることと関係しています。
    // 例えばプリミティブのひとつである文字列に対してlengthというプロパティを見るとその長さを取得できます。
    // ということで、次のようなコードが可能になります。
    {
        interface Length {
            length: number;
        }

        const o: Length = "foobar";
    }
    // このことから、{}というのはundefinedとnull以外は何でも受け入れてしまうようなとても弱い型であるということが分かります。

    // weak type
    {
        // ところで、オプショナルなプロパティ（?修飾子つきで宣言されたプロパティ）しかない型にも同様の問題があることがお分かりでしょうか。
        // そのような型は、関数に渡すためのオプションオブジェクトの型としてよく登場します。
        // そこで、そのような型はweak typeと呼ばれ5、特殊な処理が行われます。
        interface Options {
			foo?: string;
			bar?: number;
		}

		const obj1 = { hoge: 3 };
		// エラー: Type '{ hoge: number; }' has no properties in common with type 'Options'
		const obj2: Options = obj1;
		// エラー: Type '5' has no properties in common with type 'Options'.
		const obj3: Options = 5;

        // 最後の2行に対するエラーはweak typeに特有のものです。
        // obj2の行は、{ hoge: number; }型の値をOptions型の値として扱おうとしていますがエラーとなっています。
        // 構造的部分型の考えに従えば、{ hoge: number; }型のオブジェクトはfooとbarが省略されており、
        // 余計なプロパティhogeを持ったOptions型のオブジェクトと見なせそうですが、weak type特有のルールによりこれは認められません。
        // 具体的には、weak typeの値として認められるためにはエラーメッセージにある通りweak typeが持つプロパティを1つ以上持った型である必要があります。
        // 実際、そうでない値をOptions型のオブジェクトとして扱いたい場面はほとんど無いためこういうのはエラーとして弾きたいところ、
        // weak typeは値に対する制限が弱すぎるためこのような追加のルールが導入されているのです。ただし例外として、{}はOptions型の値として扱えるようです。
        // また、weak typeはオブジェクトではないものも同様に弾いてくれます。
    }
}
