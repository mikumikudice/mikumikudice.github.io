# new takes on python
ok, my take on python, despite being mostly accurate, may have been too harsh. I mean, the point on versioning have been improved a lot. these problems continue on old distros like mint 18/18.3 and any equivalent debian-based linux distro to that. but the point is: lot have changed since April's 2 2022. me and my view on pyhon -- and basically all languages --, the python language itself, and other things have evolved since then. so let's start this new age of mikaela's essays with the left foot (this means good).

## introduction: the good
open your terminal. if you're on windows, fuck you. if you're on gnu+linux or any other unix-like operating system aside from Mac, run python3 using valgrind. open it on the interactive mode. once opened, type `print("mornin' sailor!")`. after printing the infamous `mornin' sailor!`, type `quit()`. valgrind should produce something like that:
```
==4114== 
==4114== HEAP SUMMARY:
==4114==     in use at exit: 698,473 bytes in 441 blocks
==4114==   total heap usage: 3,130 allocs, 2,689 frees, 4,963,812 bytes allocated
==4114== 
==4114== LEAK SUMMARY:
==4114==    definitely lost: 0 bytes in 0 blocks
==4114==    indirectly lost: 0 bytes in 0 blocks
==4114==      possibly lost: 0 bytes in 0 blocks
==4114==    still reachable: 698,473 bytes in 441 blocks
==4114==         suppressed: 0 bytes in 0 blocks
==4114== Rerun with --leak-check=full to see details of leaked memory
==4114== 
==4114== For lists of detected and suppressed errors, rerun with: -s
==4114== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
now, make a file named `main.py` with the same print command you typed. save and run it with `valgrind python3 main.py`. now, the final lines should look something like that:
```
==4376==
==4376== HEAP SUMMARY:
==4376==     in use at exit: 471,598 bytes in 83 blocks
==4376==   total heap usage: 1,372 allocs, 1,289 frees, 2,434,635 bytes allocated
==4376== 
==4376== LEAK SUMMARY:
==4376==    definitely lost: 0 bytes in 0 blocks
==4376==    indirectly lost: 0 bytes in 0 blocks
==4376==      possibly lost: 0 bytes in 0 blocks
==4376==    still reachable: 471,598 bytes in 83 blocks
==4376==         suppressed: 0 bytes in 0 blocks
==4376== Rerun with --leak-check=full to see details of leaked memory
==4376== 
==4376== For lists of detected and suppressed errors, rerun with: -s
==4376== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
cpython 3.10 for linux used almost 5MB of heap memory to run a fucking hello world on interactive mode on my machine. you can argue "it's the interactive mode, it gotta use a few more RAM to instantiate the environment!". ok, so let's take a look on the file execution case: 2.4MB. bitch, please. and in both cases there were memory leaks; nearly 700KB in the worst case and ~470KB on the best case. now, let's do the same with lua 5.3.6:

### interactive mode
```
==5614== 
==5614== HEAP SUMMARY:
==5614==     in use at exit: 208,208 bytes in 225 blocks
==5614==   total heap usage: 764 allocs, 539 frees, 257,834 bytes allocated
==5614== 
==5614== LEAK SUMMARY:
==5614==    definitely lost: 0 bytes in 0 blocks
==5614==    indirectly lost: 0 bytes in 0 blocks
==5614==      possibly lost: 0 bytes in 0 blocks
==5614==    still reachable: 208,208 bytes in 225 blocks
==5614==         suppressed: 0 bytes in 0 blocks
==5614== Rerun with --leak-check=full to see details of leaked memory
==5614== 
==5614== For lists of detected and suppressed errors, rerun with: -s
==5614== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
### running file directly
```
==5697== 
==5697== HEAP SUMMARY:
==5697==     in use at exit: 0 bytes in 0 blocks
==5697==   total heap usage: 325 allocs, 325 frees, 34,348 bytes allocated
==5697== 
==5697== All heap blocks were freed -- no leaks are possible
==5697== 
==5697== For lists of detected and suppressed errors, rerun with: -s
==5697== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
considering lua has no quit() function on interactive mode, I assume the ~208KB of memory leak is a result of a unexpected end of execution, which can be enforced by the fact that the file case has no memory leaks. in the worst case, almost 258 KB were used, and in the best case, a little bit more than 34KB. orders of magnitude of less resource consuming. "ok, mika, you already said in the first essay that lua is better." ok but now I'm saying both sucks.

yeah, bitch. both interpreted, dynamically scripting languages suck. perhaps because both are dynamically interpreted and both have automatic memory managements? perhaps, but take the [berry programming language](https://berry-lang.github.io/), for instance:
### interactive mode
```
==9048== HEAP SUMMARY:
==9048==     in use at exit: 208,466 bytes in 228 blocks
==9048==   total heap usage: 493 allocs, 265 frees, 233,373 bytes allocated
==9048== 
==9048== LEAK SUMMARY:
==9048==    definitely lost: 0 bytes in 0 blocks
==9048==    indirectly lost: 0 bytes in 0 blocks
==9048==      possibly lost: 0 bytes in 0 blocks
==9048==    still reachable: 208,466 bytes in 228 blocks
==9048==         suppressed: 0 bytes in 0 blocks
==9048== Rerun with --leak-check=full to see details of leaked memory
==9048== 
==9048== For lists of detected and suppressed errors, rerun with: -s
==9048== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
### running file directly
```
==9084== HEAP SUMMARY:
==9084==     in use at exit: 0 bytes in 0 blocks
==9084==   total heap usage: 26 allocs, 26 frees, 14,078 bytes allocated
==9084== 
==9084== All heap blocks were freed -- no leaks are possible
==9084== 
==9084== For lists of detected and suppressed errors, rerun with: -s
==9084== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
```
worst case used ~233KB, best case used only 14KB. not so a impressive jump as happened with python, but considerably better. it is, indeed, possible to create dynamically typed languages better than lua and undoubtedly better than python. it's just a matter of trying.

## development: the bad
the biggest problem with all of them is that all of them are dynamically typed. with that, I come with a hot take even foy my younger self: all languages suck (in specific cases). what do I mean? take javascript for instance. it is probably one of the worst programming languages ever created, this is because it was developed in 10 days. a rush to literally just make something capable of doing dumb stuff happen on web pages such as visit counting. it was never meant to make web servers and for sure not meant to be used as the lingua-franca of webdev. it is what it is because of the place and time it was created. same with C. it has such a loose typing system and is so filled with undefined behavior because its purpose was simply to make [B](<https://en.wikipedia.org/wiki/B_(programming_language)>) capable of taking advantage of different word length on new CPUs and still be somewhat cross-platform and add a few primitive type abstractions to make it more powerful, so instead of `u32` like rust, it uses `short` and `long`, leaving up to the compiler decide which integer size use. C was designed at bell labs in the 70's with the sole purpose of making system tools and operating systems in mind, not to build the whole infrastructure of modern technology. these problems cannot be solved easily, because you can't "fix" these languages anymore. it's simply too late. once something is released, people start using and rellying on it. and once they rely on it, the only thing worse than complains of the current state of a project, are complains about changes on this project. people get wildly mad. but tying to replace these, like rust desperately tries to do with C, is inefficient to say the least. rust has good points on most of its attempts to be modern, but fails miserably on being like C. C is damn easy to learn. its a gun with no safety guarantees. you most likely is going to shoot your feet with that, but it gets shit done. rust is ridiculously hard to learn to most people, slow at compile times and in practice, still keeping memory leaks and safety issues found in C happen. they're less common, sure, but once you have to make real-world shit, they appear again. modern technology is a giant spaghetti machine. you can't easily change anything in large scale without exploding everything.

## more development (?): the ugly
this brings me back to the starting point: all languages suck. the biggest mistake of languages like rust is trying to be and not to be something at the same time. you can't be critical-efficient in a completely safe environment. you can't be easy to learn if you try to cover as much space as you can imagine. rust tries to replace the most widely re-implemented language in the world at the same time it tries to cover webdev _and_ be type and memory safe _and_ be fast and easy to learn and use. that's impossible dude. there's no perfect language in the vacuum, but there can be perfect languages for specific jobs. python is perfect for quick scripting of repeating processes like filtering files and sorting data. lua is good for embeddable tech, I mean, it was designed for that. C is damn good for hardare specific needs for people that know what they are doing. but python is no good for webdev or gamedev (you can try, but it will suck), lua is not very suitable at all to kernel development and, for sure, C is not the best language for pattern matching and regex on strings.

## conclusion
the future is on specific domain languages. people are trying to take what's good about old tech -- learning from our past -- and using it with modern ideas, such as [hare](https://harelang.org) and [zig](https://ziglang.org), for instance. as Peter Alvaro stated in his essay [Three Things I Wish I Knew When I Started Designing Languages](https://www.youtube.com/watch?v=oa0qq75i9oc&t=525), all the future languages seems to be domainspecific languages, in the sense that the most efficient way to solve problems is using the best tools, and the best tools are the ones designed to specific problem domains. you sure can use a hammer to open a letter, but a knife is more suitable for the job, in the same sense the same knife can be used as a screw driver replacement, but won't work as well as a proper one. let's stop taking one said good programming language and try to make it good for everything, but most importantly, let's start designing new tech with its long-term purpose in mind and even more importantly, learning from our past mistakes. we got over 80 years of modern computing, let's not trow off all these mistakes to just take them back latter.