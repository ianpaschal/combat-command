import { ChangeEvent, useState } from 'react';

import { bookmarklet } from '../../utils/bookmarklet';
import { createListFromHtmlString } from '../../utils/convertHtmlToList';

export const ListsImportPage = (): JSX.Element => {

  const [list, setList] = useState({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const result = createListFromHtmlString(e.target.value);
    setList(result);
  };

  return (
    <>
      <p>Drag the link below to your Bookmarks toolbar:</p>
      <a href={`javascript:(${bookmarklet.toString()})()`}>Copy FoW List HTML</a>
      <div>
        <label htmlFor="input">Input</label>
        <input id="input" type="text" onChange={handleInputChange} />
      </div>
      <div>
        <pre style={{ textAlign: 'left', fontFamily: 'monospace' }}>
          {JSON.stringify(list, null, 4)}
        </pre>
      </div>
    </>
  );
};
