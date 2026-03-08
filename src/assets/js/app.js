import $ from 'jquery';
import 'what-input';

// Foundation JS relies on a global variable. In ES6, all imports are hoisted
// to the top of the file so if we used `import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$(document).foundation();

document.querySelectorAll('.mobile-sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = document.querySelector(btn.dataset.panel);
    const isOpen = panel.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen);
    document.querySelectorAll('.sidebar-left, .sidebar-right').forEach(p => {
      if (p !== panel) p.classList.remove('is-open');
    });
  });
});
