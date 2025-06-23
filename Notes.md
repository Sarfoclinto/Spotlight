# ScrollView vs Flatlist

## use Flatlist when:

- Performance is critical: Flatlist only renders items currently visible on screen, saving memory and improving performance
- Long list of data: When rendering potentially large sets of data(feeds,search results, message lists).
- Unknown content length: When you don't kknow in advance how many items you'll need to display
- Same kind of content: WHen displaying many items with the same structure

## use ScrollView when:

- All content fit in memory: When you're displaying a small, fixed amount of content that won't cause performance issues.
- Static content: For screens with perdetermined, limited content like forms, profile pages, detail views.
- Mixed content types: When you need to display different YI compnents in a specify layout that doesn't follow a list pattern
- Horizontal carousel-like elements: Small horizontal scrolling components like image carousels with limited items

# Pressable vs TouchableOpacity

## use Pressable when:

- More customization is needed: Pressable offer more customization options for different states(pressed, hovered, focused).
- Complex intereactions states: When you need to handle multiple interaction states with fine-grained control
- Future-proofing behaviour: WHen you want to customize behavior across different platforms.
- Nested press handlers: When you need to handle nested intereactive elements

## use TouchableOpacity when:

- Simple fade effect: When you just need a simple opacity chande on press
- Backwards compatibility: When working with older codebases that already use TouchableOpacity
- Simple API: When you prefer a more straightforward API with fewer options to configure
- Specify opacity animation: When you need precise control over the opacity value on press.
- Legacy support: For maintaining consistency with existing components.

## Expo Image vs React Native Image Component

## Use Expo Image when:

- Performance: Expo image uses native image libraries that can offer better performance
- Caching: Built-in caching system in more robust and configurable.
- Modern image capabilities: Need for advanced features like content-aware resizing, blurhash placeholders, and progressive loading.
- Transitions: When you need smooth transitions between image loading states.
- Cross-platform consistency: More consistency behavior across iOS and Android.
- Adaptivity: Better support for adaptive images based on screen size and resolution.

## Use React Native Image when:

- Simplicity: When you need basic image display with minimal configuration.
- Bundle size: When you're trying to keep you app's bundle size smaller.
- No Expo dependency: When you're not using Expo or want to minimize dependenciest.
- Legacy support: When maintaining compatibility with existing code that uses React Native Image.
- Basic requirement: When advanced image features aren't needed for your use case.


## For other PKGs (check out from ReactNative Directory)
- For other third-party libraries: https://reactnative.directory

## React Native Gestures
-Gestures are a great way to provide an intuitive user experience in an app.
- The **React Native Gesture Handler** library provides built-in native components that can handle gestures
- It recognizes pan, tap, rotation, and other gestures using the platform's native touch handling system
- Learn more: https://docs.swmansion.com/react-native-gesture-handler/docs/

## React Native Reanimated
- Create smooth animations with an excellent developer experience.
- Learn more: https://docs.swmansion.com/react-native-reanimated/