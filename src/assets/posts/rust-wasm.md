---
title: "Spirographs: Rust, WebAssembly, and React"
subtitle: Math is fun and learning new things is fun so let's do both
publishedOn: 2025-03-27
coverImage:
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Spirograph_Salesman_in_Kochi.jpg/1920px-Spirograph_Salesman_in_Kochi.jpg"
  alt: "Spirograph toy"
  source: "Image by Jay.Jarosz"
---

Today I'm feeling its time for a condensed learning burst on something new and I've been curious about Rust and WASM for awhile.

When I was a kid I had a spirograph toy. The circle with the different size gears with the offset holes that make the spinny designs. Let's build a Rust library that makes a spirograph, and then compile that into WASM, and then use it in a React app (this website).

There are a number of practical considerations that I'm throwing out the window here - namely that this type of drawing is nicer in Javascript and React itself, given it's not that computationally expensive. But I already know how to do that, and today we are learning something new.

## About WebAssembly (WASM)

I don't know much about WASM other than Rust can compile to it, and Javascript can execute it. It can get a lot better performance than Javascript and is beneficial for doing computationally expensive stuff in the browser. We won't be doing any heavy lifting today, but thats the primary motivator for exploring this.

According to the docs: https://webassembly.org/

> Wasm is designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.

> WebAssembly describes a memory-safe, sandboxed execution environment

Okay, so WASM is lower level browser-speak. Our wasm compiler is going to take the rust code, and compile it into a lower level, assembly like language, that the browser can execute. It isn't that Javascript itself with execute it - our React app will **invoke** it and then the browser will execute it.

### Some resources I'm using

- [This video](https://www.youtube.com/watch?v=qQMc3C1tJgw) is helpful! Walks through the basic plumbing of getting some Rust code to render Hello World from React.
- [This blog](https://surma.dev/things/rust-to-webassembly/) is interesting, though I'm going to go a different direction. (But, as an aside a++ love the styling, interesting context)

## Bindings

As I'm researching an over-arching question that has come up:

_WASM is a sandboxed execution environment. What do I and don't I have access to?_

A lot of it comes down to bindings. As the name suggests, bindings _bind_ to external functionality. This isn't unique to rust and wasm. There are bindings to c++ libs, and javascript libraries, and more. Its just a way to interact with non-rust code inside of rust.

As a basic example, in standard Rust we might use the `println` macro to print something to the terminal.

```rust
println!("Spirographs are fun!");
```

But when we are running in the browser, there is no terminal - here's where bindings come in.

In our case, the `web-sys` crate provides bindings to the APIs that browers have. So knowing that we are going to be running in the terminal, we can use the `web-sys` crate to access the _browsers_ console.

We also need to pass the browser something that it can comprehend - hence the construction of `JsValue`.

```rust|plaintext
#@title=lib.rs
use wasm_bindgen::JsValue;
use web_sys::{console};

#[wasm_bindgen]
pub fn greet(name: &str) {
   console::log_1(&JsValue::from_str(&format!(
      "Hello, {}!",
      name
   )));
}


---

#@title=cargo.toml
// ...

[dependencies]
wasm-bindgen = "0.2"
web-sys = { version = "0.3.77", features=["console"]}
```

Along the same reasoning, WASM because it doesn't support async natively. But we can use `wasm-bindgen-futures` to rely on Javascript promises through the provided bindings if we need to do anything async.

## The plumbing

First, we make our new package, At this point, I'm just following the Youtube tutorial linked above.

```sh
cargo new spirograph-wasm --lib
```

We add `wasm-bindings` as a dependency and we set the library type to be `cdylib`.

Once we have built the package we can pull it in.
here we can see that we have our Hello, World! hanakslr-site:70394e8ddd19c731cc5fe7cd1896f9d89d6ec3f3

Easy peasy! Onto the guts.

## After a pause

Spirographs https://www.eddaardvark.co.uk/python_patterns/spirograph.html
