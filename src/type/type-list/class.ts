// クラスの型
{
    // 最近のJavaScriptにはクラスを定義する構文があります。
    // TypeScriptでは、クラスを定義すると同時に同名の型も定義されます。
    class Foo {
		method(): void {
			console.log("Hello, world!");
		}
	}

	const obj: Foo = new Foo();

    // この例では、クラスFooを定義したことで、Fooという型も同時に定義されました。
    // Fooというのは、クラスFooのインスタンスの型です。
    // obj: FooのFooは型名のFooであり、new Foo()のFooはクラス（コンストラクタ）の実体としてのFooです。

    {
        // 注意すべきは、TypeScriptはあくまで構造的型付けを採用しているということです。
        // JavaScriptの実行時にはあるオブジェクトがあるクラスのインスタンスか否かということはプロトタイプチェーンによって特徴づけられますが、TypeScriptの型の世界においてはそうではありません。
        // 具体的には、ここで定義された型Fooというのは次のようなオブジェクト型で代替可能です。
        interface MyFoo {
			method: () => void;
		}

		class Foo {
			method(): void {
				console.log("Hello, world!");
			}
		}

		const obj: MyFoo = new Foo();
		const obj2: Foo = obj;

        // ここでMyFooという型を定義しました。これはmethodという関数型のプロパティ（すなわちメソッド）を持つオブジェクトの型です。
        // 実はFoo型というのはこのMyFoo型と同じです。クラスFooの定義から分かるように、Fooのインスタンス、すなわちFoo型の値の特徴はmethodというプロパティを持つことです。
        // よって、その特徴をオブジェクト型として表現したMyFoo型と同じと見なすことができるのです。
    }
}
