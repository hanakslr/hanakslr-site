---
title: "Spirographs: Rust, WebAssembly, and React"
subtitle: Math is fun and learning new things is fun so let's do both.
publishedOn: 2025-03-27
coverImage:
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Spirograph_Salesman_in_Kochi.jpg/1920px-Spirograph_Salesman_in_Kochi.jpg"
  alt: "Spirograph toy"
  source: "Image by Jay.Jarosz"
---

Today I'm feeling its time for a condensed learning burst on something new and I've been curious about Rust and Wasm for awhile.

When I was a kid I had a spirograph toy. The circle with the different size gears with the offset holes that make the spinny designs. Let's build a Rust library that makes a spirograph, and then compile that into Wasm, and then use it in a React app (this website).

There are a number of practical considerations that I'm throwing out the window here - namely that this type of drawing is nicer in Javascript and React itself, given it's not that computationally expensive. But I already know how to do that, and today we are learning something new.

## About WebAssembly (Wasm)

I don't know much about Wasm other than Rust can compile to it, and Javascript can execute it. It can get a lot better performance than Javascript and is beneficial for doing computationally expensive stuff in the browser. We won't be doing any heavy lifting today, but thats the primary motivator for exploring this.

According to the docs: https://webassembly.org/

> Wasm is designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.

> WebAssembly describes a memory-safe, sandboxed execution environment

Okay, so Wasm is lower level browser-speak. Our Wasm compiler is going to take the Rust code, and compile it into a lower level, assembly like language, that the browser can execute. It isn't that Javascript itself with execute it - our React app will **invoke** it and then the browser will execute it.

### Some resources I'm using

- [This video](https://www.youtube.com/watch?v=qQMc3C1tJgw) is helpful! Walks through the basic plumbing of getting some Rust code to render Hello World from React.
- [This blog](https://surma.dev/things/Rust-to-webassembly/) is interesting, though I'm going to go a different direction. (But, as an aside a++ love the styling, interesting context)

## Bindings

As I'm researching an over-arching question has come up:

_Wasm is a sandboxed execution environment. What do I and don't I have access to?_

A lot of it comes down to bindings. As the name suggests, bindings _bind_ to external functionality. This isn't unique to Rust and Wasm. There are bindings to C++ libs, and Javascript libraries, and more. Its just a way to interact with non-native code.

As a basic example, in standard Rust we might use the `println` macro to print something to the terminal.

```Rust
println!("Spirographs are fun!");
```

But when running in the browser, there is no terminal - here's where bindings come in.

The `web-sys` crate provides bindings to the functionality that browers have. So knowing that we are going to be running in the browser, we can use the `web-sys` crate to access the _browsers_ console and print the message there.

We also need to pass the browser something that it can comprehend - hence the construction of `JsValue`. It's constructing the string in a way Javascript comprehends, not the Wasm/Rust version we have in memory.

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

We add `wasm-bindings` as a dependency and we set the library type to be `cdylib` and populate a basic greet function. The `#[wasm_bindgen]` is the glue between our Rust Wasm and JS. It makes what it is applied to exposed in the end library.

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

After building the package with `wasm-pack build --target web`, a `pkg/` directory is generated with everything we need inside of it. Copying it to a place accesible to the React code, it's simple to bring in and consume (though, see [a fun memory gotcha](#a-fun-memory-gotcha)). The library even comes mostly typed!

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

At this point, I take a brief detour into math and refresh my memory on parametric equations.

The concept behind a spirograph is that there is a single fixed circle, and then a smaller circle rotating inside of it. If you stray from these reality-based contraints, you can indeed get some [very cool results](https://www.eddaardvark.co.uk/python_patterns/spirograph.html). But to keep the math as simple as possible, we will stick with 2 gears - a larger fixed, and smaller one inside.

#### Equations

After consulting blogs and articles from those much wiser than I (and who have done real math more recently) I use the following equations.

$$
x(\theta) = (R - r) \cdot \cos(\theta) + p \cdot \cos\left(\left(\frac{R - r}{r}\right)(\theta + \phi)\right)
$$

$$
y(\theta) = (R - r) \cdot \sin(\theta) + p \cdot \sin\left((\theta + \phi) \cdot \frac{R - r}{r}\right)
$$

Where:
| Symbol | Meaning |
|---------------|-------------------------------------------------------------------------|
| **R** | Radius of the fixed outer circle |
| **r** | Radius of the rolling circle |
| **p** | Offset from the center of the inner rolling circle to the tracing point |
| **θ** | Angle of rotation |
| **φ** | Phase angle - angular offset that adds rotation to the starting point

I think one of the interesting parts about this is determining the number of rotations that are needed to make the pattern repeat on itself.

The number of rotations is related to the ratio between $R$ (big fixed radius) and $r$ (little moving radius). When the ratio $(r + R) / r$ as a fraction has a whole number on the denominator, that denominator is the number of rotations.

So, for the example below $r = 20, R=150$ (the big circle is not displayed).

$$
ratio = (r + R) / r
$$

$$
ratio = (20 + 150) / 20 = 170 / 20 = 17 / 2
$$

$$
ratio = 17 / 2
$$

The denominator is 2, so it takes 2 rotations.

[[SpirographGallery]]

#### Rendering to canvas

There are a couple options for rendering. We could:

- Generate an SVG and return that for the front end to render
- Interact with a canvas element directly

I chose to interact with a canvas element directly because I had future thoughts of exploring animation.

Note in `Cargo.toml` that when working with `web-sys`, there is nearly nothing included in the default package - everything is behind a feature.

This code is really only specific to drawing spirographs and is pretty compact so I don't have much more to say about it.

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

### Test it out :)

This is interactive - test out some numbers! Draw some fun patterns!

[[Spirograph]]

<br />

### A fun memory gotcha

Writing this page and having multiple spirograph components embedded, each which attempted to initialize the spirograph package, revealed and interesting memory gotcha. While our library is appropriately isolated and the spirograph instance refers to a particular `<canvas />`, when there were multiple instances on the same page they started interacting with each other in odd ways. Drawing a spirograph in one instance ended up putting it on the last canvas that was initialized, always.

This has to do with how the module initialization is handled. The `spirogrpah-wasm` module is initialized into a _shared global state_ (this is just how ESM works). So it turns out, that reinitializing the module multiple times in the same page led to memory clobbering - each instance was sharing the same module and JS state, instead of having a single module with all the JS states. Moving to a shared initialization function, that returns the previous value if it had already be called resolved this issue.

```github
{
  "commit": "fa4b28fc02f02d188c5b067cb7d0a1724a9b69a5",
  "repo": "hanakslr/hanakslr-site",
  "files": [
    {
      "file": "src/pages/Wasm/initSpirographWasm.ts",
      "entryFile": true,
      "foldRanges": [
        [8,15]
      ]
    }
  ]
}
```

thx chatgpt for helping debug :)

### Considerations

**Performance**

Wasm compiled Rust _can_ be faster than standard JS, but it isn't always. If the Rust code is constantly calling into the JS functionality, there wasn't anything gained performance-wise, and it would be faster to execute in pure JS. In the current implementation of the spirograph code, at each step, the canvas element is directly interacted with and we are crossing the Wasm/JS boundary for _every single point_.

This is wildly inefficient. There is some batching and parallelizing that could be done, but if there is no way to create a line that isn't point by point, this amount of crosing of the Wasm/JS barrier thats needed makes this absolutely the worst way to do this (which I recognized at the begining, but seem worth mentioning again).

For performance, I could chose to construct an SVG string (with batching and parallelization), and hand back the whole string. But again, this isn't really the type of task that requires any heavy lifting.

**Workflow stickiness**

- Compiling the package and then using it is a pretty slow turn around in the era of hot reloading. Even with having a basic HTML alongside the library and serving up wiht a simple Python server makes it faster, and I'm sure tweaks could be made to always put the newest version of the library where its being used. It still feels like a clunky workflow.
- Types are not exported. Methods on classes and such are, but typed structs (as all structs with named fields are in Rust) are not exported. There may be a way to get these to export, but the compiler doesn't include them just for the consumer to have them.

**Final thoughts**

A fun and pretty quick exploration. Being my inaugural blog post on this site, it took longer to get the blog looking nice with all the components and styling and code than to get the spirograph spirograph-ing! But I think its an interesting tool to be aware of.

In a previous life, I worked on a product that [rendered neurons and vessel networks](https://www.mbfbioscience.com/products/neurolucida-explorer) with thousands to millions of points, and ran analysis on them. This was all desktop based, but it is interesting to think about the bridge to local hardware in a time where aboslutely everything is cloud based and hosted, as well as options for doing highly intensive work in the browser.
