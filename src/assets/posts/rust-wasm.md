---
title: Rust, WASM, and React with spirographs
subtitle: Math is fun and learning new things is fun so let's do both
publishedOn: 2025-03-27
---

Today I'm feeling its time for a condensed learning burst on something new, very low stakes, and kind of silly.

When I was a kid I had a spirograph toy. The circle with the different size gears with the offset holes that make the spinny designs. Let's build a rust utility that makes a spirograph, and then compile that into WASM, and then use it in a react app (this website).

There are a number of practical considerations that I'm throwing out the window here - namely that this type of drawing is frankly much easier to do nicely in Javascript and React itself, given it's not that computationally expensive. But I already know how to do that, and today we are learning something new.

## The starting point

I don't know much about WASM - other than Rust can compile to it, and Javascript can execute it. It can get a lot better performance than Javascript and is beneficial for computationally expensive stuff that you want to do in the browser. We won't be doing any heavy lifting today, but thats the primary motivator for exploring this.

According to the docs: https://webassembly.org/

> Wasm is designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.

> WebAssembly describes a memory-safe, sandboxed execution environment

Basically our wasm compiler is going to take the rust code, and compile it into a lower level, assembly like language, that the browser can execute. It isn't that Javascript itself with execute it - our React app will **invoke** it and then the browser will execute it.

#### Some resources I'm using

- [This video](https://www.youtube.com/watch?v=qQMc3C1tJgw) is helpful!
- [This blog](https://surma.dev/things/rust-to-webassembly/) is interesting, though I'm going to go a different direction. (But, as an aside a++ love the styling, interesting context)

## Bindings

As I'm researching an over-arching question that has come up -

_WASM is a sandboxed execution environment. What do I and don't I have access to?_

It all seems to come down to bindings. As the name suggests, bindings _bind_ to external functionality. For example, in standard Rust you might use the `println` macro to print something to the terminal.

```rust
println!("Spirographs are fun!");
```

But when you are running in the browser, you don't have a terminal - here's where bindings come in.

In our case, the `web-sys` crate provides bindings to the APIs that browers have. So knowing that we are going to be running in the terminal, we can use the `web-sys` crate to access the _browsers_ console.

We also need to pass the browser something that it can comprehend - hence the construction of `JsValue`.

## TODO put cargo.toml here in a separate file and make this actually runnable.

```rust
// Imports
// use wasm_bindgen::JsValue;
// use web_sys::{console};

console::log_1(&JsValue::from_str(&format!(
   "Parameters - inner_r: {}, offset: {}, phase_angle: {}",
   inner_r, offset, phase_angle
)));

---

cargo.toml things here
```

Along the same reasoning, WASM because it doesn't support async natively. But we can use `wasm-bindgen-futures` to rely on Javascript promises through the provided bindings if we need to do anything async.

## The plumbing

`cargo new strava-stats --lib`

I'm just following the youtube tutorial at this point - we add `wasm-bindings` as a dependency, this creates the bindings for WASM. And we set the library type to be `cdylib.
commit - strava-stats:11a87c57f283eb80d2b71dd62761d64e7b3449d3

Once we have built the package we can pull it in.
here we can see that we have our Hello, World! hanakslr-site:70394e8ddd19c731cc5fe7cd1896f9d89d6ec3f3

Easy peasy! Onto the guts.

## After a pause

Spirographs https://www.eddaardvark.co.uk/python_patterns/spirograph.html
