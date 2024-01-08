import books from "./books";
import categories from "./categories";
import wishes from './wishes';
import authors from './authors';

export default { ...books, ...categories, ...wishes, ...authors };