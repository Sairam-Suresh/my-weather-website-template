# The lib folder
This folder is where the logic backing the website's UI is stored. In this example, there is a file called `openMeteo.js` that contains a function that helps to obtain the weather. Check out that file to learn more!

You do not need to worry about modifying `openMeteo.js`, as the function has already been provided for you to use. It is just a matter of importing the function as follows:

```js
import { defaultCoords, dailyForecast } from "@/lib/openMeteo";
```

Then, you can use it as follows:
```js
const coords = { latitude: 40.7128, longitude: -74.0060 }; // New York
const forecast = await dailyForecast(dayNumber, coords);
```

Where you can omit the `coords` parameter to use the default coordinates (London, UK).