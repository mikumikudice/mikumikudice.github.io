# The ecobos project

## introduction
in the past I talked about my attempts on making [VM-interpreted languages](https://mikumikudice.github.io/archive/blog/061221), [system programming languages](https://mikumikudice.github.io/archive/blog/092421) and even [operating systems](https://mikumikudice.github.io/archive/blog/031422). I wouldn't consider either lowy, B++ or pxdevOS failures. they had to at least be at an useable state to be considered as such. even on the matter of projects or joy of learning, it was not a failure. developing (or at least, trying to) them lead me to get the deepest I ever had on knowing a field. despite not being very mature, my knowledge is already capable of sustaining me on kernel and compiler contexts. I know how these work and how to create one for real. actually, I plan to do so. this is the ecobos project.

## the eco brutalist OS
ecobos stands for eco-brutalist os, or in full, extended concepts on brutalist operating systems. it's a nested, double-acronym. the main inspirations for it are [this video](https://www.youtube.com/watch?v=L9v4Mg8wi4U), [this operating system](https://brutal.smnx.sh) and [this project](https://100r.co/site/home.html). from the first, the main reason to make it so out-of-rails on the matter of integrating the already existing ecosystem of operating systems. the second, the reason for the name and a taste of the direction I'll take on its looks. and lastly, the main idea of its structure and design. an operating system without users, all programs sandboxed by default, a microkernel environment that only deals with a non-so-hierarchical filesystem and a clean, aesthetic interface with no terminal emulation or shellscript. all user-space programs will be a byte-code program interpreted by the kernel virtual machine, ensuring sandboxing.

### the ecobos web browser
one small quirk I'm adding to ecobos is some kind of underweb, in the sense I'm hosting webpages that (currently) no other browser will be capable of processing. the current web development is too tightly duck-taped with HTML, CSS and javascript and, for me, these are very outdated (in the case of js, it was a bad idea back in its origins). so I'm making a browser with its custom runtime language, DOM and interaction mechanisms. literally reinventing internet as a codespace. there'll be only one language, more or less like elm, that executes all user I/O and UI/UX processing. this is a very raw idea and I'm letting it cook for now until I reach a working stage of the ecobos system itself.

but how am I going to implement all of it? we'll need a couple of plants and a very smart brain.

## the moss programming language
\* please address to [this section](#moss) for reference.

moss: a compiled, statically typed, imperatively functional, effect-driven, systems programming language, or moss: a simple, small, impure functional systems lang, for short. moss is a highly experimental language that uses ratios instead of floating point numbers, linear types for memory management instead of garbage collectors or borrow checkers, use effect tags to control which interactions and states a function can make and have and yet a very simple, small, concise grammar and syntax. here's a hello world in moss:
```moss
    mod demo;
    io := use lime.io;

    pub main := fn() nil => io:cli {
        io:putl("mornin', sailor!")!;
    };
```
for briefly explaining every bit before diving in the explanations, we define de module name with `mod demo`, require the linux runtime IO module and store it on `io`, define a publically accessible function called `main` which the OS runtime will call as an entry point, which also takes no parameters (`fn()`), returns nothing (`nil`) and the whole function is tagged with the effect `cli` from the `io` module. in `main`, we call the `putl` function (which stands for "put line") with a string argument and a bang in the end, telling the compiler that if this function returns an error, it should crash. note that all namespaces are first-class objects. actually, everything despite the `mod` directive is considered a valid expression in moss. that's why both `io` module and the `main` function are assigned using the `:=` operator.

now you know how it looks, let's see it in action:
```moss
mod lime.io;

cli :: eff;
err :: !u32;

pub puts := fn(src := str) res := u32 | err => cli {
    mio src => eax, edx {
        eax = 4;
        ebx = 1;
        ecx = src + 4;
        edx = [src];
        int;
    };
    if eax {
        res = err eax;
    } else {
        res = u32 edx;
    };
    ret;
};
```
this is a simplified version of the `puts` function implementation from the lime module, the linux api. let's break down this code:

### assignment and definition
one of the main ideas that guides the moss syntax is that "if it looks similar, it does something similar". the `:` symbol means type (except when accessing module fields). so the `:=` operators means "define as this type and assign". the `src := str` defines a string-typed namespace and assigns the default zeroed-value to it, in the case of a string, `""`. the `cli :: eff` expression defines a custom type, in this case, a new instace of an effect type.

### tagged unions and first-class errors
theres no exceptions in moss. there are lots of reasons for that, which some people like Ginger Bill already addressed. moss does something very similar to hare, it's current hosting language: return values that are tagged unions. every function that may fail, returns an union which is either the result you expect or an error, but never both. to define an error type, we use the bang signal, as shown in the `err :: !u32` expression, that defines a error type that can carry an unsigned 32 bit integer as a value. for instance, any type can be aliased as an error type. so then, in our `puts` function, we define a named return value called `res` with an tagged union which can be either an `u32` or `!u32` using the `|` operator. the functionality of this function is "we try to print something to the standard output using a syscall, if it fails, the error code is returned, if it succeeds, it returns the length of the given string." how does that work? we use a mio code snippet to call directly the syscall. mio is the sister programming language of moss. it is a high-level assembler which, in the present moment, compiles down to flat assembly. mio is the only way to directly interact with the operating system. you can't do FFI without doing it with mio, for example.

### control flow and named returns
after calling the syscall 4 of the x86/i386 linux api, reading the length of the string at the first 32 bits of its address and then the following content, we get the read length from edx and the error code from eax, which both were explicitly required in the mio statement. after that, we check if the value in the `eax` register is non-zero and if so, we cast the value to an `err` type and assign it to `res`, if not, we assign `edx` to `res` as a `u32` instead. then, we halt the function with `ret`, which will return the value in `res`, once it's a named return value.

all functions that call `puts` must be tagged with the `cli` effect type. this is ensured at compile-time. the function itself is also forced to be tagged to something once it uses mio code. all functions that use mio snippets must has a effect tag, and all functions that call it must have the same tags.

please note that all statemends and expressions end with semicolons, even functions and control flow blocks. also note that there is no boolean type. instead, if blocks evaluate any non-zero value as true and anything else (which include `nil`, `""` and `0/1`) as false.

### diving on side-effects
another feature that moss has is an inverted situation of OOP. instead of data having behavior, behaviors have data. moss allows you to define function properties that works like static namespaces in languages such as C, but which are visible outside the function scope, but the only code chunk allowed to write on it is the function itself, as shown in the following example:
```moss
mod dop;

fldr :: eff; # field read effect

iota := fn { count := u32, cstep := i32 1 } (start := u32, reset := u8, step := i32) u32 => fldr {
    if step {
        ctxt.cstep = step;
    };
    if start {
        ctxt.count = start;
        if !step {
            ctxt.cstep = 1;
        };
    };
    defer ctxt.count += 1 * cstep; # increpented only after returning
    ret ctxt.count;
};

dummy_flag_0 := iota(1, 1, 2); # equals to 1
dummy_flag_1 := iota(); # equals to 2
dummy_flag_2 := iota(); # equals to 4
dummy_flag_3 := iota(); # equals to 8

num_0 := iota(0, 1); # equals to 0
num_1 := iota(); # equals to 1
num_2 := iota(); # equals to 2
num_3 := iota(); # equals to 3
n_max := iota.count; # equals to 4
```

an mostly equivalent functionality of the `iota` function can be found in the go standard library ([here](https://go.dev/wiki/Iota)), but it's part of the language and there's no configuration available. by doing this way, we can make a function with state that in each interaction, applies a user-defined interval to the current value evaluated from also an user-defined starting point. and after using it, we can even check for the current value without triggering the next interaction. for this example, the effect, despite being mandatory in the `iota` function, is not needed elsewhere once we are calling it at global scope, which is always evaluated at compile time. the only functions that can be called at global scope are the ones that may or may not produce side effects, but they have no mio snippets and calls no impure functions despite itself (for recursion cases).

### other nuances
there is even more moss features to talk about, but it could be out-dated once the language is not even close to its 1.0 version. also, it would be too long. so I'll address another two essential features of moss: linear types and ratios:

```moss
mod circle;

unit := use core.unit;
buff := use lime.buff;
memf := use lime.memf;
io   := use pine;

efx :: buff:fio & memf:mem & io:cli;
pi  := r32 355 / 113;

pub main := fn() nil => efx {
    args := io:args();

    if memf:len(args) < 3 {
        io:panic("missing arguments!");
    };

    fname, args := str io:arg_pop(args, str)!; # returns itself once its a pure function
    fdata, args := str io:arg_pop(args, u32)?;

    file := match(buff:fopen(fname, buff:fread)){ # match return type
        buff:stream ok => {
            eval ok;
        };
        buff:err err => {
            io:panic(buff:etos(err));
        };
    };

    out := unit:r32tos(pi * fdata * fdata, 4);

    data := memf:alloc(out)!;
    file', data' := buff:write(file, data)!;

    memf:free(data');
    buff:close(file')!;
};
```

this program takes two command line parameters, a filename and a number. it opens the given file, calculates the area of a circle from the given number and writes it down with 4 decimal places of precision. there's no precision loss despite the missing decimal places and the value of pi because there are no literal decimal representation internally. moss stores the ratio of the given dividend and divisor and deals the arithmetic with these, never losing its initial precision. hence, the better the rational approximation of pi, the best the final result. another interesting thing shown in this code are linear types. file and data are a file descriptor and a dynamically allocated string, respectively. but both are linear types, which means once they move from scopes, they may be moved again once, only once at least once. this guarantees that the file is opened and closed and that the heap pointer is allocated and freed without being used before or after these two. the logic is that the linear objects are created in `alloc` and `fopen` functions and returned. once this happens, the file is considered "read". its value can be read from and written to in case of structures, but the namespace itself is considered immutable. the whole point is: it's been read, so it must be passed to another function. this must finally finish the data, deallocating or closing it, for example. the compiler will ensure linear types once instantiated are returned, then after moving, are passed to another stackframe, which is put in charge of finishing it. this semantic assurance of usage completely avoids errors such as unclosed web sockets or files, memory leaks or use-after-free memory bugs without garbage collection or incomprehensible borrowing dynamics. simple, concise and easy to understand and get used to.

ok, we got the systems programming language for writing the kernel and the VM, but which language is going to run on this VM?

## mio and pops
there's not much to talk about mio itself. its name is a pun with the world miolo, a colloquial name for brain in portuguese. once its extention is `.lo`, if mio is ever going to be written in itself, the main file would be called `mio.lo`. that name comes from its purpose: a program that _thinks_ (or rather, _miola_) the hard parts of assembly for us, abstracting its syntax behind some kind of sugar code. it's still pretty much i386 assembly, just with a new frontend. the whole point of mio is that once moss outputs mio code, it's already cross-platform. the only thing needed to be updated is mio itself, more or less like compiler backends like [LLVM](https://llvm.org/) and [QBE](https://c9x.me/compile/). the main inspiration for mio is [battlestar](https://github.com/xyproto/battlestar/). the major significant differences are that mio allows chains of operators, while battlestar only processes one operator per assignment. the following code:
```
eax = 4 + eax * 2
```
is pretty much valid in mio, but not in battlestar.

now, considering that mio is going to target to different architectures and platforms, we can talk about the ecobos' VM byte-code language: pops.

### the concatenative assembly
\* please address to [this section](#pops) for reference.

just like the hundred rabbits virtual machine language, uxntal, pops is a stack-based assembly abstraction for a byte-code language. the similarities ends here. a hello world in uxntal looks like this:
```
|10 @Console &vector $2 &read $1 &pad $5 &write $1 &error $1

|0100 ( -> )
	;hello-word
	&while
		( send ) LDAk .Console/write DEO
		( loop ) INC2 LDAk ?&while
	POP2
BRK

@hello-word "Hello 20 "World! 00
```

while a hello world in pops looks like this:
```
init 256 0 1

:init main fail kill

:main
    2 hello sysc pop
    0 halt

:fail 1 halt
:kill 1 halt

:hello "mornin' sailor!\n"
```

so, what's happening here? ecobos sticks with the idea that the only way programs should talk to each other are messages and responses. in the first line, `init 256 0 1`, we're pushing the initial configuration of the program. the entry point is the label `init`, the minimum required memory for the execution of this program is `256` bytes and `0 1` defines the stream id's for standard input and output, respectively.

the line bellow, `:init main fail kill`, is the entry point label definition, which pushes the labels of the basic message-based callbacks. these are the labels the os runtime should jump-to in case of a syscall failure, such as the given file descriptor is invalid, and the label where it should jump-to in case of a forced quit, so, for example, if your program is stuck in a infinite loop and it's an image editor, you can place a last save-function in this section when the user decides to forcedly close the program.

then, the actual program within the `main` label is defined. it pushes `2`, the syscall id for write, then the memory address for the string literal, which actually is in the program itself, like the `.data` section on common assemblers. this string address actually points to a 32 bit integer, the length of the string, followed by the actual content, just like moss does. then the `sysc` keyword consumes the last 2 pushed values to the stack and pushes the current address in memory, so in case of a failure, the `fail` label can jump back. that's why there's a `pop` right after it; for cleaning the unused address. after that, we push our ok exit code of `0` and call the halt directive. finally, we define the said message/error labels, which just halts the program with exit code of `1` and finally actual string value.

pops is designed for the ecobos architecture. all of its semantics is built bottom to top and optimized for this specific target. most people are probably going to write programs using moss that will generate mio code, which will generate the actual byte-code, but it's interesting to have a higher-level abstraction for the byte-code, both for people using it directly or for their own backends and for debugging purposes. we also are going to have a dedicated C compiler targeting ecobos and with the option to spit-out pops code, called rebecca, which we'll cover in its [dedicated essay](https://mikumikudice.github.io/essays/rebecca).

## conclusion
this is an ambitious project. a life-long worth efford. despite I'm truly aware the fact most of this work, after 10 years from now, is likely to have one user (me), I'm doing it anyway. it's worth doing it anyway, as Peter Alvaro said in his essay. this is, indeed, a large project that may end be used by someone else, specially moss once it's pretty well structured. but, specially for ecobos itself, I'm developing it because it's how I think things should be. my take on literally everything there is to be in programming. kernels, operating systems, compilers, virtual machines, programming languages. all in one single ambitious yet minimalistic project.

the current milestones are:
- [ ] finish moss
- [ ] set up a working VM for linux that emulates the one to be run in the ecobos kernel
- [ ] set mio for targeting pops
- [ ] develop the ecobos kernel
- [ ] develop the browser specification
- [ ] sit down and watch the sun rise in a grateful universe

I'll come back here to update these. in the meanwhile, I'm developing side projects, such as an educative language that compiles down to C called folklang and a java killer intended to be a VM-powered language that seaminglessly interops with python, lua and C.

that's it for today. enjoy the further reading section. don't forget to drink water and eat well. I'll be back with more news soon.

## further reading

### moss
- [flix programming language](https://flix.dev/).
- [hare programming language](https://harelang.org/).
- [pony programming language](https://www.ponylang.io/)
- [zig programming language](https://ziglang.org/).
- [elm programming language](https://elm-lang.org/).
- [essay on language design by Peter Alvaro](https://www.youtube.com/watch?v=oa0qq75i9oc).
- [essay on exceptions by Bill Hall](ttps://www.gingerbill.org/article/2018/09/05/exceptions-and-why-odin-will-never-have-them/).

### pops
- [uxntal](https://wiki.xxiivv.com/site/uxntal.html).
- [concatenative programming](https://concatenative.org/wiki/view/Front%20Page).

### mio
- [fasm](https://flatassembler.net/).

### trivia
the name moss was given before its later meaning; moss is a kind of simple, primitive plants that runs on very simple rules that most plants don't use. they are stand-alone beings in the sense they are not like flowers that grown from other plants neither are some kind of parasite plant. moss are tiny bits that form a collective without interacting with each other directly. also, moss grows anywere, a parallel with the fact that moss is theoretically able to run in any OS if there's an API library written for it. lime, for instance, is the linux limestone i.e. the platform where the moss code will grow.

mio originally targeted nasm, which was my first contact with assembly. later on, I got aware of the flat assembler, or fasm, which is way more _cute_ if may I say, and way more aligned with the design principles of mio and the whole ecobos project, actually. for example, fasm is written in itself. an assembler written in assembly. and it has such nice features as there's no configuration at the command line call level, only at source code level, which comes to be very handy for another language compilers to use it.

pops' name comes from the fact that the idea of poping something from the stack is essential for both assemblers and concatenative languages, and the word itself can be either the "pop" verb conjugated in singular third-person or a nickname for an older, father figure.