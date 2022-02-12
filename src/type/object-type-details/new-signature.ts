// newシグネチャ
{
    // 類似のものとして、コンストラクタであることを表すシグネチャもあります。
    interface Ctor<T> {
		new (): T;
	}

	class Foo {
		public bar: number | undefined;
	}

	const f: Ctor<Foo> = Foo;

    // ここで作ったCtor<T>型は、0引数でnewするとT型の値が返るような関数を表しています。
    // ここで定義したクラスFooはnewするとFooのインスタンス（すなわちFoo型の値）が返されるので、Ctor<Foo>に代入可能です。
    // ちなみに、関数の型を(foo: string) => numberのように書けたのと同様に、newシグネチャしかない場合はコンストラクタの型をnew() => Fooのように書くこともできます。



}
