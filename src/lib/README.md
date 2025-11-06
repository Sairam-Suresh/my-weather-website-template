# The lib folder
This folder is where the logic backing the website's UI is stored. In this example, there is a file called `openMeteo.js` that contains a function that helps to obtain the weather. Check out that file to learn more!

You do not need to worry about modifying `openMeteo.js`, as the function has already been provided for you to use. It is just a matter of importing the function as follows:

```js
import { defaultCoords, dailyForecast } from "@/lib/openMeteo";
```

Then, you can use it as follows:
```js
// The default coordinates are for Singapore.
// However, if you want to specify a different location, you can provide your own coordinates,
// By replacing defaultCoords with your own object like { latitude: XX.XXXX, longitude: YY.YYYY }
const forecast = await dailyForecast(dayNumber, defaultCoords);
```

Where you can omit the `coords` parameter to use the default coordinates for Singapore.