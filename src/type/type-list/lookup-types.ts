// Lookup Types T[K]
// keyofとセットで使われることが多いのがLookup Typesです。
// Kがプロパティ名の型であるとき、T[K]はTのそのプロパティの型となります。

interface MyObj {
	foo: string;
	bar: number;
}

// strの型はstringとなる
const str: MyObj["foo"] = "123";

/**
 * この例ではMyObj['foo']という型が登場しています。上で見たT[K]という構文と比べると、TがMyObj型でKが'foo'型となります。
 * よって、MyObj['foo']はMyObj型のオブジェクトのfooというプロパティの型であるstringとなります。
 *
 * 同様に、MyObj['bar']はnumberとなります。MyObj['baz']のようにプロパティ名ではない型を与えるとエラーとなります。
 * 厳密かつ大雑把に言えば、Kはkeyof Tの部分型である必要があります。
 *
 * 逆に言えば、MyObj[keyof MyObj]という型は可能です。
 * これはMyObj['foo' | 'bar']という意味になりますが、プロパティ名がfooまたはbarということは、
 * その値はstringまたはnumberになるということなので、MyObj['foo' | 'bar']はstring | numberになります。
 */

// keyofとLookup Typesを使うと例えばこんな関数を書けます。
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
	return obj[key];
}

{
    const obj = {
        foo: "string",
        bar: 123,
    };
}

{
    const str: string = pick(obj, "foo");
    const num: number = pick(obj, "bar");
    // エラー: Argument of type '"baz"' is not assignable to parameter of type '"foo" | "bar"'.
    pick(obj, "baz");
}

/**
 * この関数pickは、pick(obj, 'foo')とするとobj.fooを返してくれるような関数です。
 * 注目すべき点は、この関数にちゃんと型を付けることができているという点です。
 * pick(obj, 'foo')の返り値の型はobj.fooの型であるstring型になっています。
 * 同様にpick(obj, 'bar')の型はnumber型になっています。

 * pickは型変数を2つ持ち、2つ目はK extends keyof Tと書かれています。
 * これは初出の文法ですが、ここで宣言する型変数Kはkeyof Tの部分型でなければならないという意味です。
 * この条件が無いと、返り値の型T[K]が妥当でない可能性が生じるためエラーとなります。

 * pick(obj, 'foo')という呼び出しでは、Tが{ foo: string; bar: number; }型、Kが'foo'型となるため、
 * 返り値の型は({ foo: string; bar: number; })['foo']型、すなわちstring型となります。
 */
