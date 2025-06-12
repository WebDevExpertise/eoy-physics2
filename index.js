import { SuperpositionDemo } from './demonstrations/SuperpositionDemo.js';
import { EntanglementDemo } from './demonstrations/EntanglementDemo.js';
import { DecoherenceDemo } from './demonstrations/DecoherenceDemo.js';
import { InterferenceDemo } from './demonstrations/InterferenceDemo.js';
import { MazeDemo } from './demonstrations/MazeDemo.js';

document.addEventListener('DOMContentLoaded', () => {
    new SuperpositionDemo();
    new EntanglementDemo();
    new DecoherenceDemo();
    new InterferenceDemo();
    new MazeDemo();
});