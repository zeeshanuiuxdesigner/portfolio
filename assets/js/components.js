/*
 * Shared header / footer loader
 * ------------------------------------------------------------
 * Loads components/header.html into <div id="site-header"></div>
 * and components/footer.html into <div id="site-footer"></div>.
 *
 * Two ways of loading, so the site works everywhere:
 *   1. HTTP (Live Server, XAMPP, hosting): fetch() the .html files directly.
 *   2. file:// (page opened from Explorer): browsers block fetch(), so the
 *      generated components/header.js and components/footer.js are loaded
 *      with <script> tags instead. Regenerate them after editing the .html:
 *          python components/sync-components.py
 *
 * Paths resolve relative to THIS script's URL, so it works from any page
 * depth as long as the <script src> to components.js is correct.
 *
 * Fires "components:loaded" on document when both parts are in the DOM.
 */
(function () {
    'use strict';

    var script = document.currentScript;
    var base = script ? new URL('../../', script.src) : new URL('./', window.location.href);
    var isFile = window.location.protocol === 'file:';

    var PARTS = [
        { id: 'site-header', name: 'header' },
        { id: 'site-footer', name: 'footer' }
    ];

    var PAGE_FOR_ACTIVE = {
        '': 'index.html',
        'index.html': 'index.html',
        'about-me.html': 'about-me.html',
        'project.html': 'project.html',
        'service.html': 'service.html',
        'service-details.html': 'service.html',
        'contact.html': 'contact.html'
    };

    function currentPage() {
        var name = window.location.pathname.split('/').pop() || '';
        try { name = decodeURIComponent(name); } catch (e) {}
        return PAGE_FOR_ACTIVE.hasOwnProperty(name) ? PAGE_FOR_ACTIVE[name] : name;
    }

    function setActiveNav(container) {
        var page = currentPage();
        container.querySelectorAll('.main-menu-link').forEach(function (link) {
            var target = (link.getAttribute('href') || '').split(/[?#]/)[0].split('/').pop();
            link.classList.toggle('main-menu-active-link', target === page);
        });
    }

    function insert(part, html) {
        var holder = document.getElementById(part.id);
        if (!holder) return;
        holder.innerHTML = html;
        if (part.id === 'site-header') setActiveNav(holder);
    }

    /* Way 1: fetch the .html file (HTTP) */
    function viaFetch(part) {
        var url = new URL('components/' + part.name + '.html', base).href;
        return fetch(url, { cache: 'no-cache' }).then(function (res) {
            if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
            return res.text();
        });
    }

    /* Way 2: load the generated .js file (works on file://) */
    function viaScript(part) {
        return new Promise(function (resolve, reject) {
            var store = window.SITE_COMPONENTS || {};
            if (typeof store[part.name] === 'string') return resolve(store[part.name]);
            var s = document.createElement('script');
            s.src = new URL('components/' + part.name + '.js', base).href;
            s.onload = function () {
                var html = (window.SITE_COMPONENTS || {})[part.name];
                if (typeof html === 'string') {
                    resolve(html);
                } else {
                    reject(new Error(part.name + '.js did not define SITE_COMPONENTS.' + part.name));
                }
            };
            s.onerror = function () { reject(new Error('could not load components/' + part.name + '.js')); };
            document.head.appendChild(s);
        });
    }

    function load(part) {
        if (!document.getElementById(part.id)) return Promise.resolve();
        var first = isFile ? viaScript : viaFetch;
        var second = isFile ? viaFetch : viaScript;
        return first(part)
            .catch(function () { return second(part); })
            .then(function (html) { insert(part, html); })
            .catch(function (err) {
                console.error('[components] Could not load the ' + part.name + ': ' + err.message +
                    '. Check that components/' + part.name + '.html and components/' + part.name + '.js exist.');
            });
    }

    function init() {
        Promise.all(PARTS.map(load)).then(function () {
            if (window.AOS && typeof window.AOS.refreshHard === 'function') window.AOS.refreshHard();
            document.dispatchEvent(new CustomEvent('components:loaded'));
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
