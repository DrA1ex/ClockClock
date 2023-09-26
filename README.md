# The Clock Clock Experience

![clock_clock](https://user-images.githubusercontent.com/1194059/152324919-765dd671-aa98-4011-9d2a-2d5697b66ba9.gif)

## Themes
### Light
![image](https://user-images.githubusercontent.com/1194059/152494158-8b449207-ae1b-4536-926f-0f6cbf6394c3.png)

#### Demo: [link](https://dra1ex.github.io/ClockClock/?theme=light)

### Dark
![image](https://user-images.githubusercontent.com/1194059/152494182-cc4ba084-1494-43d0-8d4d-d094d9e61a99.png)

#### Demo: [link](https://dra1ex.github.io/ClockClock/?theme=dark)

### Dark Gold
![image](https://user-images.githubusercontent.com/1194059/152494228-072d7ce2-f51e-435f-8fb4-b69db3300fc7.png)

#### Demo: [link](https://dra1ex.github.io/ClockClock/?theme=dark-gold)

### Light Gold
![image](https://user-images.githubusercontent.com/1194059/152494264-d1e4f9e0-029f-46be-87a5-ee5af130b545.png)

#### Demo: [link](https://dra1ex.github.io/ClockClock/?theme=light-gold)

### Dark Noir
![image](https://user-images.githubusercontent.com/1194059/152494434-ebc764b5-098d-4d9b-b68b-685d20272909.png)

#### Demo: [link](https://dra1ex.github.io/ClockClock/?theme=dark-noir)

### Blue Coated
![image](https://user-images.githubusercontent.com/1194059/152494320-ae606e04-c460-4f8a-b806-a590c536d996.png)

#### Demo: [link](https://dra1ex.github.io/ClockClock/?theme=blue-coated)

### OLED
![image](https://user-images.githubusercontent.com/1194059/152494355-a20a9272-164b-44e7-b9d0-d06dd677f379.png)

#### Demo: [link](https://dra1ex.github.io/ClockClock/?theme=oled)

### Glass
<img width="1645" alt="image" src="https://user-images.githubusercontent.com/1194059/184614057-3f1fe4cb-c472-4bf8-bb9c-56d87706d19a.png">

#### Demo: [link](https://dra1ex.github.io/ClockClock/?theme=glass&bg=windows_light&clock_size=50&clock_margin=10&clock_width=5&clock_hour=18&clock_minute=22&fps=100)

## Desktop background

To install ClockClock as your wallpaper on Windows, you can use Wallpaper Engine. Follow these steps:

1. Download and install Wallpaper Engine from the [Steam store](https://store.steampowered.com/app/431960/Wallpaper_Engine/).
2. Once installed, open Wallpaper Engine and navigate to the Workshop tab.
3. Search for "ClockClock" or go directly to the [ClockClock page](https://steamcommunity.com/sharedfiles/filedetails/?id=2806476496).
4. Subscribe to the ClockClock wallpaper and wait for it to download.
5. Once the download is complete, the ClockClock wallpaper will be available in your Wallpaper Engine library.
6. Select the ClockClock wallpaper from your library and choose "Apply" to set it as your background.

For MacOS users, you can use a tool called Plash to set ClockClock as your wallpaper. Here's how:

1. Start by installing Plash. You can find the installation instructions on its GitHub page: [Plash](https://github.com/sindresorhus/Plash).
2. Launch Plash and access the menu by clicking on the toolbar icon.
3. In the menu, select "Add Website" to add ClockClock as your wallpaper. You can choose any theme you like. To find different themes, refer to the [Themes](#Themes) section for links.
4. That's it! Your wallpaper will now display ClockClock. If you wish, you can customize certain parameters. For example, you can reduce the frames per second (FPS) to minimize resource usage. Refer to the [Settings](#Settings) section for more details.

Additionally, you can further customize the appearance of ClockClock using CSS code. For instance, if you want to center the clock with your Dock panel by moving clock higher on the screen:

1. Click Plash icon and go to the "Edit" menu.
2. In the "Edit" dialog, paste the following CSS code:

```css
.clock-panel {
    margin-bottom: 80px !important;
}
```

By applying this code, the clock will be moved upward by 80 pixels.

## Settings
- **theme** – theme configuration (one of above)
- **time_format** - time format 12/24 (default: 24)
- **clock_size** – diameter of a clock circe in px (default: _36_)
- **clock_margin** – margin beetween each clock in px (default: _8_)
- **clock_hour** – height of a hour arrow in px (default: <_clock_size_ - 2>)
- **clock_minute** – height of a minute arrow in px (default: <_clock_size_>)
- **clock_width** – width of arrows in px (default: _theme specific_)
- **bg** – special backgroud mode. Supported values: oled, [other...](assets/bg/) (default: _none_)
- **bg-color** - custom background color (any valid css color, e.g. #aaffbb), **required bg=color**
- **bg-image** - custom background image (any valid url, e.g. http://example.com/image.jpg), **required bg=image**
- **mode** – special display mode. Supported values: fullscreen (default: _none_)
- **speed** - animation speed in degrees/second (default: _60_)
- **fps** - animation frequency in renders/second (default: _60_)
- **flex** - flex mode (idle animation). Supported values: on, off (default: _on_)

**Example**: [link](https://dra1ex.github.io/ClockClock/?theme=dark-gold&clock_size=64&clock_margin=24&clock_hour=12&clock_minute=24&mode=fullscreen&bg=color&bg-color=%237b6345)
