Hello, if you are reading this chances are I am applying for a job.

This is a library of cross-ecma-compliant versions of standard
methods I've been working on for some time, for a few reasons.

First I need to clarify that while it functions as a polyfill, it
is not a true polyfill because I do not like the idea of altering
built-in prototypes or methods. Some people call these poyfills,
but I hesitate to use that term because I'm not sure how common it
is.

Anyways, the reasons:

  1)  It started because I was annoyed my code didn't run in some
      uncommon environments like stable GAS, nintendo browser, old IE,
      or in actionscript. So I wanted to create a sort of catch-all
      implementation of standard methods like String.trim or Array.map
      that aren't universally available.

  2)  It offers as a more secure alternative to potentially altered
      built-in methods if one is paranoid (because in JS values
      like "undefined" and Object.prototype can be redefined by other
      code before your code runs, and this disturbs me, so I wanted
      to create my own internal version of everything just for "fun").

  3)  It interests me as sort of a way for me to get more familiarized
      with all the more subtle parts of the language that I wanted to
      know more about like bitwise operators, the behavior of empty
      array slots, implicit type coercion, tagged loops, enumerability
      vs configurability vs writability for object keys/props, etc.
      It's been a good exercise so far.

Some things I learned recently while working on this:

  - in JS, whitespace strings coerce to 0 instead of NaN. I did not
    expect this, especially when it came to this also being true for
    newlines and vertical tabs. I decided to leverage this behavior
    to create a String.trim that uses what the environment "sees" as
    whitespace to decide what to remove, instead of a list of predefined
    characters. This was also after me being made aware that some older
    versions of ES did not recognize higher-unicode whitespace characters
    as valid whitespace.

  - in JS, -0 === 0., despite a negative zero actually being a distinct
    value from 0 since it's signed. The only way to find out if a zero is
    signed is by dividing 1 by it. 1/-0 returns -Infinity but 1/0 returns
    Infinity, and then you can determine if the 0 was negative or not.
    So doing this can allow you to determine if you are dealing with a
    positive or negative zero. How is this useful? I'm not sure. In the
    future, it could be useful for me perhaps, like when parsing user
    input or something. But I think it's cool.

  - Number.isNaN is more specific than isNaN because it checks to see
    if the input is a typeof number. isNaN implictly coerces the input
    to a number first. so isNaN will read a string as NaN, but Number.isNaN
    will read it as not NaN.

  - Many more things, if I think of any more noteworthy ones I will add
    them here.
