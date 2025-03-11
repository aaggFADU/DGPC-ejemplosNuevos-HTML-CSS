# Copilot Instructions

- Think in English but always use Argentinian Spanish in responses
- Indent code with 2 spaces
- Prioritize HTML and CSS solutions over JavaScript whenever possible, leveraging modern web capabilities, particularly for animations, transitions, and client-side validations


## HTML

- Use semantic HTML5 tags appropriate to content context
- Ensure accessibility with proper ARIA attributes, roles, and landmarks
- Use `class` attributes exclusively for styling purposes
- Use `id` attributes only for JavaScript interaction or anchor links
- Always include HTML5 DOCTYPE declaration (`<!DOCTYPE html>`)
- Include meta viewport tag for responsive design (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
- Structure documents with semantic elements (header, nav, main, section, article, footer)
- Provide descriptive alt text for all images
- Ensure all form elements have associated labels and appropriate ARIA attributes
- Validate HTML code against W3C standards
- Maintain consistent indentation (2 spaces) and add meaningful comments for complex sections

## CSS

- Use pure CSS without preprocessors or frameworks
- Organize styles using cascade layers with `@layer` in order from general to specific:
  - `@layer reset, base, layout, componentes, utilidades;`
  - Reset: normalize browser defaults
  - Base: element selectors, typography, colors
  - Layout: page structure, grid systems
  - Componentes: specific UI components
  - Utilidades: helper classes
- Apply logical properties (margin-block, padding-inline) for better internationalization
- Use relative units (rem, em, %, vh, vw) instead of fixed pixels when possible
- Implement layouts primarily with CSS Grid, with Flexbox for simpler components
- Utilize modern CSS features:
  - Custom properties (variables) for reusable values
  - Nesting for better selector organization
  - Container queries for component-based responsiveness
  - Feature queries (@supports) for progressive enhancement
- Design with mobile-first approach, adding complexity at larger breakpoints
- Group related styles by component or functionality
- Follow BEM naming methodology (Block__Element--Modifier)
- Avoid !important declarations except for utility classes
- Define theme colors, typography, and spacing as CSS custom properties
- Maintain low specificity for better maintainability
- Wrap animations and transitions in `@media (prefers-reduced-motion: no-preference)` queries to respect user motion preferences
- Implement View Transitions API for page transitions using CSS only with @property and view-transition-name properties where supported
- Optimize performance by minimizing selector complexity and redundant rules

## JS

- Use vanilla JavaScript without external libraries or frameworks
- Define models as classes with singular naming (e.g., class `Product` for products data)
- Follow naming conventions consistently:
  - `camelCase` for variables and functions
  - `UPPER_SNAKE_CASE` for constants
  - `PascalCase` for classes
- Use file naming conventions:
  - JavaScript files: lowercase with underscores (e.g., `user_authentication.js`)
  - Markdown files: lowercase with hyphens (e.g., `code-standards.md`)
- Utilize ES6+ features (arrow functions, destructuring, modules, etc.)
- Structure code modularly with encapsulated, reusable functions
- Begin all files with `'use strict';` directive
- Add explanatory comments for complex logic, not obvious operations
- Implement comprehensive error handling with try/catch and appropriate error messages
- Use event delegation for groups of similar elements
- Write asynchronous code with Promises or async/await for all operations that might delay execution
- Validate all user inputs both client-side and prepare for server-side validation
- Use template literals (`${variable}`) instead of string concatenation
- Prevent memory leaks by removing event listeners when elements are removed from DOM