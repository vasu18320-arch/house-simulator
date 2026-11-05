const KEY='house-simulator-save-v1';
export function saveGame(data){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch(e){console.warn('Save failed',e);return false}}
export function loadGame(){try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw):null}catch(e){console.warn('Load failed',e);return null}}
