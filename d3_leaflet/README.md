# D3 com Crossfilter, DC.js e Leaflet

https://observablehq.com/@asleylc/d3-com-crossfilter-e-dc-js-parte-2@308

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
python -m SimpleHTTPServer
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@4
npm install https://api.observablehq.com/d/7bd36d974dc6f950.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "@asleylc/d3-com-crossfilter-e-dc-js-parte-2";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
