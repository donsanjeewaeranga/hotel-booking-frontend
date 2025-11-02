# Styles Directory

This directory contains global CSS files for the application.

## Structure

- `main.css` - Global styles, CSS variables, and utility classes
- `components.css` - Reusable component styles
- `utilities.css` - Additional utility classes (optional)

## Import in main.js

```js
import './styles/main.css';
import './styles/components.css';
```

## CSS Variables

Use CSS variables defined in `main.css` for consistent theming:

```css
.my-element {
  color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
}
```

## Component-Scoped Styles

For component-specific styles, use `<style scoped>` in your `.vue` files.

