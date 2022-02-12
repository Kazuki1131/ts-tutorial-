//void型
{
    // JavaScriptでは何も返さない関数（return文が無い、もしくは返り値の無いreturn文で返る）は
    // undefinedを返すことになっていますので、void型というのはundefinedのみを値にとる型となります。
    // 実際、void型の変数にundefinedを入れることができます。ただし、その逆はできません。
    // すなわち、void型の値をundefined型の変数に代入することはできません。
    const a: void = undefined;
	// エラー: Type 'void' is not assignable to type 'undefined'.
	const b: undefined = a;

    // void型の使いどころは、やはり関数の返り値としてです。
    // 何も返さない関数の返り値の型としてvoid型を使います。
    // void型はある意味特殊な型であり、返り値がvoid型である関数は、値を返さなくてもよくなります。
    // 逆に、それ以外の型の場合（any型を除く）は必ず返り値を返さなければいけません。
    function foo(): void {
		console.log("hello");
	}

	// エラー: A function whose declared type is neither 'void' nor 'any' must return a value.
	function bar(): undefined {
		console.log("world");
	}
}
