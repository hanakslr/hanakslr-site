title: Rust -> WASM -> React: A speed run
subtitle: 4 hour timebox, because why not
date: 3/14/25

Today I think it would be fun to change things up. Lately I have been working on a variety of things- contracting, osm2rail, witwat, and more - and all of them cool. But I'm feeling its time for a condensed learning burst on something new, very low stakes, and kind of silly.

Today - lets build a rust utility that fetches my strava mileage by activity, renders it in a chart - and then compile that into WASM - and then import it into a react app (this website).

There are a number of practical considerations that I'm throwing out the window here - namely that displaying a chart is frankly much easier to do nicely in React itself, and it would be more practical to just hit the Strava API directly and do it all in the front end. Or if I **must** use rust - make it just a separate backend server. But I already know how to do that, and today we are learning something new. So lets get started.

## The starting point

10:22am

I don't know much about WASM - other than Rust can compile to it, and Javascript can execute it. It can get a lot better performance than javascript - and is beneficial for computationally expensive stuff that you want to do in the browser. We won't be doing anything computationally expensive today, but thats the primary motivator for exploring this.

According to the docs: https://webassembly.org/

| Wasm is designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.
| WebAssembly describes a memory-safe, sandboxed execution environment

Great - basically our wasm compiler is going to take the rust code, and compile it into a lower level, assembly like language, that the browser can execute. It isn't that Javascript itself with execute it - our React app will **invoke** it and then the browser will execute it. I'm curious to find out how our WASM compiled code actually gets compiled into the app (where does it go, what does the call site end up looking like).

Some resources I'm using
This video is helpful! https://www.youtube.com/watch?v=qQMc3C1tJgw
This blog: https://surma.dev/things/rust-to-webassembly/ (a++ love the styling, interesting context)

10:51am
As I'm researching there are two questions that have come up -

1. WASM is a sandboxed execution environment. If I have my rust code hit an external API, does this execution environment have access to the outside world?
   The answer appears to be yes, with some caveats. Synchronous networking (like `reqwest` relies on) isn't supported in WASM. Along the same reasoning, `tokio` isn't supported in WASM because it doesn't support async natively. But we can use `wasm-bindgen-futures` to rely on the browsers `fetch` and Javascript promises.
2. WASM has no acces to the DOM. According to a random stack overflow post - this is because the cretors of WASM didn't want the efficiency of WASM to have to interact with the inefficency of the DOM. Amazing - I love a strong principled design decision.
   What this means is, I can either render the charts from the rust binary as like a PNG or SVG and hand it to the front, and then have the front render it, or just return the raw data in a format that I like, so that front end could do nicer things with it.

   To start off I am going to have the binary just return the chart - if this were a real project, that is not the decision I would make. But right now, I would like to just write more rust code.

11:04
Coffee refill - then lets start writing code.

## The plumbing

Pipelines are always interesting to me. Given that we are on a timebox, lets start with a super dumb rust util and get it talking to a react app.

Hmm given that this is the react app we will be talking to - there is an additional layer of complexity. I'm writing this blog in markdown and this is the first one. There are ways to render react code inside of markdown, but I haven't set them up yet... brief detour.
