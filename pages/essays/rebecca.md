# rebecca: a rebellious C compiler acronym
\* read [this](https://mikumikudice.github.io/essays/ecobos-project) essay for best understanding.

rebecca exists for two main reasons: C is still a goddamn good language and I want to play doom, quake and cavestory on ecobos. so let's split this article in two main sections: what's rebecca and how I plan to use it.

## the compiler
as I said on the previous essay, rebecca is the official C compiler for the ecobos virtual machine. it spits-out the pops byte-code, which is highly different from most of real-life assembly/cpu architectures. we'll discuss this in the second section, for now, let's dive a bit on the C language itself. the infamous hello world:

```c
#include <stdio.h>

int main(int argc, char** argv){
    printf("mornin' sailor!\n");
    return 0;
};
```

the infamous mikaela's `mornin' sailor!`. you can compile and run it in basically any C compiler, but you can't (or won't be able to) compile using rebecca due to some reasons. let's break it apart.

### the environment
the C standard for most operating systems pass the line arguments to the program through the `main` function arguments. there's no such thing in ecobos, once there's no command line; instead, you call programs as they were functions, passing arguments which will be parsed by the VM runtime, and passed to the program through the OS standard libray, which also implies in no libc for ecobos, so the `stdio.h` header file is not present as well. also, the main function of a program doesn't return anything to the OS runtime, which makes the main function being typed as `int` meaningless. so the equivalent would look like this:
```c
#include <libs/c/io.h>

void main(){
    println("mornin' sailor!");
    halt(0);
};
```

ok. pretty much the same. the point is that C is very solid in most things. for me, the most important modern features that C lacks are stronger typing system/no undefined behavior, module system and better error handling. so in rebecca, it would look something like this:
```cpp
import libs.c;

void main(){
    c.println("mornin' sailor!")!;
    c.halt(0);
};

void fail(c.err err){
    c.halt(err);
};

void kill(){
    c.halt(1);
};
```

and a few quality of life improvements, the final code would look like this:
```cpp
import libs.c;

void main(){
    c.println("mornin' sailor!")!;
    c.halt(0);
};

void fail(c.err err) c.halt(err);
void kill() c.halt(1);
```

> fine, what else is changing?

### the language differences
you noticed we got rid of the `#include` thing in favor of a module based system that uses `import`. this is a side-consequence of we removing all macros. yeah, bitch. no more spaghetti code and dependency hell. more than half of production level languages has no concept of macros (for instance, hare, go, zig, haskell, gleam, etc). that's why is a rebellious C compiler; we're making a soft-revolution with this old language. daring to do what none has ever dared before: fixing C. not making a successor or anything, simply improving the goods and removing the bads (actually, some tried, like Ginger Bill himself, but none succeed in my opinion). we also are including error types and error propagation, which implies in tagged unions. to check all of this, let's make a bigger example:
```cpp
import libs.c;
import libs.fs;

void main(){
    string[] args = c.args();

    string fname;
    if(string? arg = pop(args); arg != NULL){
        fname = (string)arg;
    } else {
        c.panic("missing arguments!\n");
    };

    fs.file? dummy = fs.fopen(fname, fs.FILE_RW)?;
    if(dummy == NULL){
        c.panic("cannot open the given file\n");
    };
    fs.file file = (fs.file)dummy;
    defer fs.close(file)!;
    
    fs.write(file, "mornin' sailor!")!;
    for(u32 c = 0; c < 12; c += 1){

    };
    c.halt(0);
};
```
rebecca's C is basically C11 with the type system of hare. that's it. also, `defer`, `append`, `include`, strings (with no null termination), slices, and no-null by default, no `int`, no implicit casting and all statements must end in semicolons. nothing that outstanding, but is a great improvement over the actual C we got. these ideas are probably going to change and new ones will appear once we reach a working ecobos system, but until there, that's what we got.

## how I'm using it
the similarities between moss and C are quite big, enough to easily reuse the moss parser to build the rebecca compiler. for instance, the biggest step is already done, it's a matter of changing the semantic rules and implement the mio code generation. then, we can start addapting existing C code to C-rbl (the rebecca standard).

these changes are mostly easy to fix. the ones that use graphical API or general I/O are probably the ones that will require most of the efforts, but the code loop itself only requires an adaptation of the error handling (non-existent) and the types, which in most cases are simply replacing `int` by `u32`.

and that's it. the rebecca compiler, at this moment, is basically this. stay tooned for the ecobos port of DOOM.