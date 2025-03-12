type Modifiers = { [key: string]: boolean };

type BemClassNameUtil = (elementName?: string, modifiers?: Modifiers) => string;

// TODO: Use overloads to remove the need for clsx (e.g. add support for additional class names)

/**
 * Creates a reusable BEM class name generator for each element and provided modifiers.
 * @param blockName 
 * @returns Function to which accepts an element name and modifier object.
 */
export const bem = (blockName: string): BemClassNameUtil => (
  (elementName, modifiers) => {
    if (!elementName) {
      return blockName;
    }

    const elementClassName = `${blockName}_${elementName}`;

    if (modifiers) {
      const modifierClassNames = Object.entries(modifiers).filter(
        ([_key, value]) => value,
      ).map(
        ([key]) => `${elementClassName}-${key}`,
      );

      return modifierClassNames.reduce((acc, className) => `${acc} ${className}`, elementClassName);
    }

    return elementClassName;
  }
);
