// readonlyな配列とタプル
{
    // オブジェクトの場合はプロパティごとにreaodnlyか否かを制御できましたが、配列やタプルは要素ごとの制御はできません。
    // 配列やタプル全体がreadonlyか否かという区別をすることになります。
    // readonlyな配列型はreadonly T[]のように書きます（Tは要素の型）。次の例はreadonly number[]型の配列の例です。
    {
		// arrは readonly number[] 型
		const arr: readonly number[] = [1, 2, 3];

		// arrの要素を書き換えるのは型エラー
		// エラー: Index signature in type 'readonly number[]' only permits reading.
		arr[0] = 100;

		// readonly配列型にはpushなどの書き換えメソッドは存在しない
		// エラー: Property 'push' does not exist on type 'readonly number[]'
		arr.push(4);
	}
    // reaodnlyなプロパティと同じく、readonlyな配列のプロパティを書き換えようとするとエラーとなります。
    // また、readonlyな配列は、pushなどの配列を破壊的に書き換えるメソッドは除去されており使うことができません。
    // この2つの機能により、readonly配列の書き換え不可能性を型システム上で担保しています。
    // なお、T[]型をArray<T>と書くことができるのと同様に、readonly T[]型はReadonlyArray<T>と書けます。

    // readonlyなタプルについても同様に、タプル型の前にreadonlyを付けて表現します。
    {
        const tuple: readonly [string, number] = ["foo", 123];
		// エラー: Cannot assign to '0' because it is a read-only property.
		tuple[0] = "bar";
    }
    // この例では、tupleはreadonly [string, number]型の変数となり、タプルの各要素を書き換えることはできなくなります。
}
