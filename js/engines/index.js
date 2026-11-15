// Pendaftaran semua enjin mekanik permainan
import { choice } from './choice.js';
import { match, sort, slots } from './dnd.js';
import { memory, recall, simon } from './memory.js';
import { puzzle } from './puzzle.js';
import { maze } from './maze.js';
import { color, dots, trace, draw } from './art.js';
import { find, diff } from './find.js';

export const ENGINES = { choice, match, sort, slots, memory, recall, simon, puzzle, maze, color, dots, trace, draw, find, diff };
