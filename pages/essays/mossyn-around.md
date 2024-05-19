# mossyn-around
I think I've never talked about moss anywere outside twitter and the [post about ecobos](https://mikumikudice.github.io/essays/ecobos-project), so now I'm giving an update.

# what changed
I really don't believe I'm using moss to write the bnuOS (formerly known as ecobos, more on that on a next essay) anymore. it got out of the systems development field a while ago. and that's not a bad thing! as I learned in the Peter Alvaro's essay ["three things I wish I knew when I started designing languages"](https://www.youtube.com/watch?v=oa0qq75i9oc), it's ok if you change your mind along the way; the important thing is put stakes on the ground, take hard goals and ideas to define what you want and where you're going. moss started as a older-grown take on the beg programming language, which in turn was my older-grown take on B++, which in turn was my take on how C should be/how I wish C was. from B++ to beg I dropped the idea of weak type system, from beg to moss I dropped the c-like syntax and addopted a go/rust-like one -- which comes from C, but have drifted away quite a lot -- for comparison, here is:

a hello world from the B++ repo:
```
extrn putc;

main(){
    putc('hi!*n');
};
```

in beg:
```
use "io";

exp fn[void] main = (){
    io:puts("am dhuit!\n")!;
};
```

and in moss:
```
use fmt;

pub main = fn() : unit \ fmt {
    fmt::putl("mornin' sailor!")!;
};
```

let's break down each one.

## B++
the `main()` function has no type notation, after all, there are no types. it was almost a 1 to 1 language with assembly, more than C was. even character literals were 4-byte/32-bits long, so `hi!*n` is a valid _character_ literal and not a string literal. then comes the `putc` function, which is required directly with the previous `extrn` statement. it simply writes down these bytes to stdout. back then I was already concerned about encapsulation, but my ideas were vage and I was cherry picking from many sources. for example, the original code in the repo didn't have the `extrn putc` statement, but the tutorial stated that every function should require _again_ every reference to global scope i.e. the `putc` function. ambiguous ideas that I didn't quite make work out, that's why I moved on to a new language idea.

## beg
I spend a few hours digging on google translate to find a word that beggined with B and represented what I meant with this language: conciseness, simplicity, correctness. "bég" in irish means "small", what I don't belive the language really was, looking in retrospect. I was way more mature in programming and in programming design when I started beg, and I also was studdying a lot about the topic. I was feeding myself a lot from rust back then, so I started making every variable/identifier/keyword 4 letters-long at max. so `extrn` became "export", which ended up being `exp`. I also added types. that reflected the fact that my journey with hare began, which brought me the idea of simple encapsulation with public/private fields. the main function must be callable from the OS level, so it must be exported. I also added types, so I had to create a concept of a function type. so how do I make the return type part of the function type? I came up with `fn[ <type> ]`, so a void function is `fn[void]`. hare also reforced what I was already familiarized: concise syntax. in B++, a name close to a value would define a constant, so `main(){};` was actually `main = (){};`. I dropped the syntax but kept the idea; hare, odin, and many other languages I respected the design(er) ideas used something simillar. hare goes `fn <name>() <return type> = {};`, odin goes `<name> :: proc() -> <return type> {}` and so on. in beg, I did `fn[<return type>] <name> = (){}`. beg also already had the concept of modules, so `use "io"` and `io:` for a standard CLI I/O interface. I also dropped the idea of 4 byte character literals.

## moss
notice how I added abstractions over time. typeless to weak type, then typed and now strongly typed. that reflected how I understood programming. back then I was _revolted_ by how languages lied to you. "it's not a pointer, it's just a number!!!" and "why make something private??? it's literally in memory, just access it!!!". I hated abstractions. but over time, I got it. programming **is** about abstraction; about getting rid of details that don't matter to your goal. languages are tools.

if I don't have to worry about which registers are being used, I can hide the details of how operations change my data at CPU instructions level. it brings us to C. if I don't care about how memory is allocated  and freed, only about speed and concurency, I can make an automatic memory management system and only worry about the data and logic. this brings us to languages like go and D. if I really don't care about anything but the transformations on my data, then I can abstract out everything behind functions and composition. this brings us to haskell and other functional programming languages. everything is about which stakes on the ground guides your lacing around your subject.

so, what is the subject of moss? programming! let me explain...

# what is now
moss is a functional programming language made by a systems programmer. I _care_ about mutation and side effects, but I also do understand how these are problematic. I'm not removing chaos and putting it on a box (_cof cof monads_), I'm _controlling_ chaos, defining how and where it should happen. so if a function may interact with the terminal, it should be tagged as such and any other function that calls the first one should be tagged as such as well. we then can compose effects or even derive them, like in a map function, which effects are derived from the predicate effects. for instance, such example could be done like that in moss:
```
use fmt;
use mem;

map = fn(t : type, data : @[]t, pred : fn(t) : t \ eff) : @[]t ! u32 \ eff & mem {
    mut idx = 0 : u64;
    mut res = mem::alloc([0...; data.len], []t)?;

    for i .. data {
        res[idx] = pred(i);
    };

    mem::free(data);
    return res;
};

print = fn(val : u32) : u32 \ fmt {
    fmt::putl(val)!;
    return val;
};

inc = fn(x : u32) : u32 {
    return x + 2;
};

pub main = fn() : unit \ fmt & mem {
    nums = mem::alloc([ 1, 2, 3, 5, 7 ], []u32);

    nums'  = map(u32, nums, inc)!;
    nums'' = map(u32, nums', print, 1)!;
    
    mem::free(nums'')!;
};
```
the main function produces two effects, `mem` and `fmt`, because it prints stuff with the fmt module and calls map, which allocates memory. the map function, on the other hand, produces the effect `eff`, which is the same effect of the predicate given to it, and `mem`, because it allocates memory for the mapped list. once the predicate must return the mapped value, we also wrap the `fmt::putl` function within the `print` function, which returns the same value, but also prints it. this function is also tagged with `fmt`.

the main function then allocates the array of nums, passes it to map with the `inc` predicate. then, `map` aplies the `inc` function to each of the items on the given list and returns a new linear type, consuming the original array and also freeing it. notice we can't free `nums` at the main function after passing it to map, because a linear type, indicated with the `@` prefix at the type notation, is consumed when passed to another function, which takes the onwership of it and must use it (in this case, freeing it). after that, we pass the new instance returned by the map function to it again, now printing it, once again returning a new copy and freeing the old one. at last, we free the third copy and finish the chain of linear objects.

this code would not compile if
- a:  any function produced (or had the chance to produce) any effect that it's not tagged with.
- b: any linear object returned by `map` or `mem::alloc` were not returned or passed to another function, such as map and `mem::free`, or if it were used after being consumed by a function call or if it were returned by a function that recieved it as an argument.
- c: the potential errors of `mem::alloc` and `fmt::putl` were not asserted (`!`) or bubbled up (`?`) to the higher function stack frame.

many functional languages would not allow you to produce any effects like that, but also would hide from you the allocations, moss does the opposite; it allows you to explicitly indicate where you want to produce an effect and also makes explicit where effects are being produced, no matter if directly or indirectly. no hidden allocations, no hidden effects. that's what moss is about; making low level operations explicit but also not making it too crude or dangerous to be done at a higher level of abstraction. you don't have to worry about heap fragmentation or data corruption, but you must be aware of where you're allocating memory and deal properly with it.

you may have noticed that a few things changed from the last example in the ecobos essay. the moss' syntax changed and also its semantics. and I'm still not sure if I keep the generics system with the first-class type objects or if I simply use the `raw` type everywhere. it would make the final code simpler (specially if map were implemented in a module), but also keep the type system fuzzy with lots of unsafe type casting, which again, could and should be kept behind a module, but I'm sure of the what I want, just not how. and like this goes the development of moss. at this point, I'm heading to the third milestone of the compiler, so if you wanna help me find bugs or simply develop it further, the repo is [here](https://git.sr.ht/~mikaela-md/mossy/).

# further reading
I highly recomend you watch the Peter's essay, but also these essays that taught me the ways of design for making moss:
- [Robert Virding - On Language Design (Lambda Days 2016)](https://www.youtube.com/watch?v=f3rP3JRq7Mw) - the dudes behind erlang/beam VM and how they came up with everything.
- [exceptions - and why odin will never have them](https://www.gingerbill.org/article/2018/09/05/exceptions-and-why-odin-will-never-have-them/) - why moss has no exceptions but rather error types.
- [Failure is Always an Option - Dylan Beattie - NDC Copenhagen 2022](https://www.youtube.com/watch?v=Vk2fi7NZ3OQ) - more on error handling.
- [Computer Science - Brian Kernighan on successful language design](https://www.youtube.com/watch?v=Sg4U4r_AgJU) - the co-creator of B and C on designing a programming language.
- [Linear types make performance more predictable](https://www.tweag.io/blog/2017-03-13-linear-types/) - description of how linear types work.
- [The Perfect Language • Bodil Stokke • YOW! 2017](https://www.youtube.com/watch?v=vnv8MGIN7A8) - more on what is to be a perfect language (or not).

that's all for today, folks. _bye bye!_
