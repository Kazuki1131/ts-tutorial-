// readonly
{
    // プロパティに対してもうひとつ可能な修飾子はreadonlyです。
    // これを付けて宣言されたプロパティは再代入できなくなります。
    interface MyObj {
		readonly foo: string;
	}

	const obj: MyObj = {
		foo: "Hey!",
	};

	// エラー: Cannot assign to 'foo' because it is a constant or a read-only property.
	obj.foo = "Hi";

    // つまるところ、constのプロパティ版であると思えばよいでしょう。
    // 素のJavaScriptではプロパティのwritable属性が相当しますが、プロパティの属性を型システムに組み込むのは筋が悪くて厳しいためTypeScriptではこのような独自の方法をとっているのでしょう。
    // ただし、readonlyは過信してはいけません。次の例に示すように、readonlyでない型を経由して書き換えできるからです。
    {
		interface MyObj {
			readonly foo: string;
		}
		interface MyObj2 {
			foo: string;
		}

		const obj: MyObj = { foo: "Hey!" };

		const obj2: MyObj2 = obj;

		obj2.foo = "Hi";

		console.log(obj.foo); // 'Hi'
	}
}
