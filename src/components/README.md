# The components folder
This folder is where you create your very own custom react components.

It is _recommended_ to dedicate one file to one component, so that the file has a clear purpose. Here's an example template that you can follow:

```js
// Strongly recommended to name your functions in UpperCamelCase

export default function MyComponent() {
  return (
    <div className="text-zinc-700">
        hello!
    </div>
  );
}
```

Once you create that file under the components folder, you can import it into your `page.js` file as follows:

```js
import MyComponent from "@/components/MyComponent";
```

Make sure that you substitute the name of MyComponent with the name of your file without the .js extension. E.g. If you have a file named "Card.js", then replace "MyComponent" with "Card".