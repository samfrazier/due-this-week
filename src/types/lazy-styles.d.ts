// Stylesheets loaded with style-loader's `lazyStyleTag` (see webpack.config.js).
// The <style> tag is added on use() and removed after the matching unuse().
declare module 'react-day-picker/dist/style.css' {
  const styles: { use: () => void; unuse: () => void };
  export default styles;
}
