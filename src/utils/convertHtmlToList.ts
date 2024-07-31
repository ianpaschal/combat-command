import { customAlphabet } from 'nanoid';

const NUMERIC_VALUE_KEYS = ['cssPts', 'cssUPts', 'cssCP'];
const ENTITY_KEYS = ['cssFrm', 'cssUnit'];
const LIST_ROOT_KEY = 'cssReport';

type ParsedNode = { key?: string, children: ParsedNode[], content?: string };

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

const parseEl = (el: Element): ParsedNode => {
  const children = [];
  if (el.children.length > 0) {
    for (let i = 0; i < el.children.length; i += 1) {
      const child = el.children[i];
      children.push(parseEl(child));
    }
  }
  return {
    key: el.classList[0], // Battlefront "cssReport" lists use one class per div
    children,
    content: !children.length ? el.innerHTML : undefined,
  };
};

export interface HtmlFormationRow {
  id: string;
  cssFrm: string;
  cssPts: number;
  cssCard: string;
  cssNat: string;
}

function isHtmlFormationRow(obj: unknown): obj is HtmlFormationRow {
  return typeof obj === 'object' && obj !== null && 'cssFrm' in obj;
}

export interface HtmlUnitRow {
  id: string;
  cssUnit: string;
  cssUCard: string;
  cssUPts: number;
  cssUCard2: string;
}

function isHtmlUnitRow(obj: unknown): obj is HtmlUnitRow {
  return typeof obj === 'object' && obj !== null && 'cssUnit' in obj;
}

export interface HtmlOptionsRow {
  id: string;
  cssOptL: string;
  cssCP: number; // Points
}

function isHtmlOptionsRow(obj: unknown): obj is HtmlOptionsRow {
  return typeof obj === 'object' && obj !== null && 'cssOptL' in obj;
}

export type HtmlRow = HtmlFormationRow | HtmlUnitRow | HtmlOptionsRow;

export const convertHtmlToListRows = (html: Document): HtmlRow[] => {
  console.log(html);
  const parsed = parseEl(html.getElementsByClassName(LIST_ROOT_KEY)[0]);
  const rows: HtmlRow[] = [];

  const addChildToRows = (child: ParsedNode): void => {
    rows.push(
      child.children.reduce((acc, subChild) => {
        if (subChild.key && subChild.content) {
          return {
            ...acc,
            [subChild.key]: NUMERIC_VALUE_KEYS.includes(subChild.key) ? parseInt(subChild.content, 10) : subChild.content,
          };
        }
        return acc;
      }, { id: nanoid() } as HtmlRow),
    );
  };

  parsed.children.forEach((child) => {
    if (child.children.length) {
      let isFormationOrUnit = false;
      child.children.forEach((subChild) => {
        if (subChild.key && ENTITY_KEYS.includes(subChild.key)) {
          isFormationOrUnit = true;
        }
      });
      if (isFormationOrUnit) {
        addChildToRows(child);
      }
    }
    if (child.key === 'cssO') {
      addChildToRows(child);
    }
  });
  return rows;
};

export interface v4ListBasic {
  formations: {
    id: string;
    type: string;
    faction: string;
    points: number;
  }[];
  units: {
    id: string;
    formationId: string;
    type: string;
    card: string;
    points: number;
    options?: string;
  }[];
  commandCards: {
    id: string;
    type: string;
    points: number;
    options?: string;
  }[];
}

export const convertRowsToV4ListBasic = (rows: HtmlRow[]) => {
  const list: v4ListBasic = {
    formations: [],
    units: [],
    commandCards: [],
  };
  let lastFormationId: string | null = null;
  let lastUnitId: string | null = null;
  let lastCommandCardId: string | null = null;

  rows.forEach((row) => {
    if (isHtmlFormationRow(row)) {
      console.log('Sorting row', row, 'as Formation');
      list.formations.push({
        id: row.id,
        type: row.cssFrm,
        faction: row.cssNat,
        points: row.cssPts,
      });
      lastFormationId = row.id;
    }
    if (isHtmlUnitRow(row)) {
      if (!lastFormationId) {
        throw Error('Cannot attach unit, no lastFormationId found!');
      }
      const formation = list.formations.find((formation) => formation.id === lastFormationId);
      if (!formation) {
        throw Error('Cannot attach unit, no formation found with given lastFormationId!');
      }
      if (formation.type.toLowerCase().includes('command cards')) {
        console.log('Sorting row', row, 'as Command Card in', lastFormationId);
        list.commandCards.push({
          id: row.id,
          type: row.cssUnit,
          points: row.cssUPts,
        });
        lastCommandCardId = row.id;
      } else {
        console.log('Sorting row', row, 'as unit in', lastFormationId);
        list.units.push({
          id: row.id,
          formationId: lastFormationId,
          type: row.cssUnit,
          card: row.cssUCard,
          points: row.cssUPts,
        });
        lastUnitId = row.id;
      }
    }
    if (isHtmlOptionsRow(row)) {
      const formation = list.formations.find((formation) => formation.id === lastFormationId);
      if (!formation) {
        throw Error('Cannot apply options, no formation found with given lastFormationId!');
      }
      if (formation.type.toLowerCase().includes('command cards')) {
        if (!lastCommandCardId) {
          throw Error('Cannot apply options, no lastCommandCardId found!');
        }
        const index = list.commandCards.findIndex((commandCard) => commandCard.id === lastCommandCardId);
        if (index >= 0) {
          list.commandCards[index].options = row.cssOptL;
        } else {
          throw Error('Cannot apply options, no command card found with given ID!');
        }
      } else {
        if (!lastUnitId) {
          throw Error('Cannot apply options, no lastUnitId found!');
        }
        const index = list.units.findIndex((unit) => unit.id === lastUnitId);
        if (index >= 0) {
          list.units[index].options = row.cssOptL;
        } else {
          throw Error('Cannot apply options, no unit found with given ID!');
        }
      }
    }
  });

  return list;
};

export const createListFromHtmlString = (input: string) => {
  const htmlDoc = new DOMParser().parseFromString(
    // Sanitize input (remove <br> and excess whitespace)
    input.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g, ' ').replace(/ +/g, ' ').trim(),
    'text/html',
  );
  const rows = convertHtmlToListRows(htmlDoc);
  return convertRowsToV4ListBasic(rows);
};