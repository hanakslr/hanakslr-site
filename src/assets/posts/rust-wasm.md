---
title: "Spirographs: Rust, WebAssembly, and React"
subtitle: Math is fun and learning new things is fun so let's do both.
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

Okay, so WASM is lower level browser-speak. Our WASM compiler is going to take the Rust code, and compile it into a lower level, assembly like language, that the browser can execute. It isn't that Javascript itself with execute it - our React app will **invoke** it and then the browser will execute it.

### Some resources I'm using

- [This video](https://www.youtube.com/watch?v=qQMc3C1tJgw) is helpful! Walks through the basic plumbing of getting some Rust code to render Hello World from React.
- [This blog](https://surma.dev/things/Rust-to-webassembly/) is interesting, though I'm going to go a different direction. (But, as an aside a++ love the styling, interesting context)

## Bindings

As I'm researching an over-arching question that has come up:

_WASM is a sandboxed execution environment. What do I and don't I have access to?_

A lot of it comes down to bindings. As the name suggests, bindings _bind_ to external functionality. This isn't unique to Rust and WASM. There are bindings to c++ libs, and javascript libraries, and more. Its just a way to interact with non-native code.

As a basic example, in standard Rust we might use the `println` macro to print something to the terminal.

```Rust
println!("Spirographs are fun!");
```

But when we are running in the browser, there is no terminal - here's where bindings come in.

In our case, the `web-sys` crate provides bindings to the APIs that browers have. So knowing that we are going to be running in the terminal, we can use the `web-sys` crate to access the _browsers_ console.

We also need to pass the browser something that it can comprehend - hence the construction of `JsValue`. It's constructing the string in a way Javascript comprehends, not the WASM/Rust version we have in memory.

```rust
use wasm_bindgen::JsValue;
use web_sys::{console};

#[wasm_bindgen]
pub fn greet(name: &str) {
   console::log_1(&JsValue::from_str(&format!(
      "Hello, {}!",
      name
   )));
}
```

If we needed to do anything async, we could use `wasm-bindgen-futures` to hook into Javascript Promises.

## The plumbing

First, we make our new package, At this point, I'm just following the YouTube tutorial linked above.

```sh
cargo new spirograph-wasm --lib
```

We add `wasm-bindings` as a dependency and we set the library type to be `cdylib` and populate a basic greet function. The `#[wasm_bindgen]` is the glue between our Rust WASM and JS. It makes what it is applied to exposed in the end library.

```github
{
  "commit": "6bb87c70c9ca7d6a61a386b0029b3670cf1b1935",
  "repo": "hanakslr/spirograph-wasm",
  "files": [
    {
      "file": "src/lib.rs",
      "entryFile": true
    },
    {
      "file": "Cargo.toml"
    }
  ]
}
```

Building the package with `wasm-pack build --target web`, a `pkg/` directory is generated with everything we need inside of it. Copying it to a place accesible to the React code, it's simple to bring it in and consume. The library even comes typed!\*

```github
{
  "commit": "e80d51362ade0a81db8ad5dac5b1933895502ed0",
  "repo": "hanakslr/hanakslr-site",
  "files": [
    {
      "file": "src/pages/Wasm/HelloWorldWasm.tsx"
    }
  ]
}
```

Results in:

[[HelloWasm]]

In just a couple steps, we've linked up our Rust code to React.

## Spirographs

At this point, I take a brief detour into math and refresh my memory on parametric equations. Surely something that I have not thought about since college.

The concept behind a spirograph is that there is a single fixed circle, and then a smaller circle rotating inside of it. If you stray from these reality-based contraints, you can indeed get some [very cool results](https://www.eddaardvark.co.uk/python_patterns/spirograph.html). But to keep the math as simple as possible, we will stick with 2 gears - a larger fixed, and smaller one inside.

#### Equations

Ultimately, after consulting blogs and articles from those much wiser than I (and who have done real math much more recently) I use the following equations.

I think one of the interesting parts about this is determining the number of rotations that are needed to make the pattern repeat in on itself, and what combinations require few rotations (those with a low common factor between them) and those that require many (prime numbers!).

For example -
1 rotation

4 rotations

a bunch of rotations

#### Rendering

There are a couple options for rendering. We could:

- Generate an SVG and return that for the front end to render
- Interact with a canvas element directly

```github
{
  "commit": "cfbf882b2a935dc554e4f2d3a2f074b1988517d6",
  "repo": "hanakslr/spirograph-wasm",
  "files": [
    {
      "file": "src/lib.rs",
      "entryFile": true,
      "foldRanges": [
        [14,29],[32,60],[62,66],[74,113]
      ]
    },
    {
      "file": "Cargo.toml"
    }
  ]
}
```

Spirographs

Workflow stickiness

- Compiling the package and then using it is a pretty slow turn around in the era of hot reloading. Even with having a basic HTML alongside the library and serving up wiht a simple Python server makes it faster, and I'm sure tweaks could be made to always put the newest version of the library where its being used. It still feels like a clunky workflow.
- Types are not exported. Methods on classes and such are, but typed structs (as all structs with named fields are in Rust) are not exported. There may be a way to get these to export, but the compiler doesn't include them just for the consumer to have them.
