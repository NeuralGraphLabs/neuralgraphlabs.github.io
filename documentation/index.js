// ------------------------------------------------------------------
// Configuration
// ------------------------------------------------------------------
const DOCS_ROOT = 'documentation/docs';

// ------------------------------------------------------------------
// State
// ------------------------------------------------------------------
let state = {
  sidebarTree: [],
  searchIndex: [],
  currentPath: '',
};

// ------------------------------------------------------------------
// Utilities
// ------------------------------------------------------------------
const stripHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const normalizePath = (path) => {
  if (!path) return '';
  return path.startsWith('/') ? path : '/' + path;
};

// ------------------------------------------------------------------
// Sidebar Parser & Renderer
// ------------------------------------------------------------------

// 1. Parse Markdown into a Tree
const parseSidebarMarkdown = (markdown) => {
  const lines = markdown.split('\n');
  const root = [];
  const stack = [];

  lines.forEach((line) => {
    const indentMatch = line.match(/^(\s*)/);
    const indentLevel = indentMatch ? indentMatch[1].replace(/\t/g, '  ').length : 0;
    
    const trimmed = line.trim();
    if (!trimmed || (!trimmed.startsWith('*') && !trimmed.startsWith('-'))) return;

    const contentMatch = trimmed.match(/^[\*\-]\s+(\[.*?\]\(.*?\)|.*)/);
    if (!contentMatch) return;
    
    const content = contentMatch[1];
    const linkMatch = content.match(/\[(.*?)\]\((.*?)\)/);
    
    const title = linkMatch ? linkMatch[1] : content;
    const path = linkMatch ? linkMatch[2] : null;

    const newItem = { 
      title, 
      path: normalizePath(path), 
      children: [], 
      level: 0 
    };

    if (stack.length === 0) {
      root.push(newItem);
      stack.push({ item: newItem, indent: indentLevel });
    } else {
      while (stack.length > 0 && stack[stack.length - 1].indent >= indentLevel) {
        stack.pop();
      }
      if (stack.length > 0) {
        const parent = stack[stack.length - 1].item;
        parent.children.push(newItem);
        newItem.level = parent.level + 1;
        stack.push({ item: newItem, indent: indentLevel });
      } else {
        root.push(newItem);
        stack.push({ item: newItem, indent: indentLevel });
      }
    }
  });

  return root;
};

// 2. Render Tree Recursively
const createSidebarDOM = (items) => {
  const ul = document.createElement('ul');
  ul.className = 'space-y-1 ml-1';
  if (items[0] && items[0].level > 0) {
      // Nested list styling
      ul.className = 'nested-ul hidden ml-1'; 
  } else {
      ul.className += ' border-l border-gray-200';
  }

  items.forEach(item => {
    const li = document.createElement('li');
    li.className = 'my-1 select-none';

    // Container for the row
    const div = document.createElement('div');
    div.className = `sidebar-link flex items-center justify-between group cursor-pointer pr-4 text-gray-500 hover:text-gray-900 border-transparent hover:border-gray-300`;
    div.style.paddingLeft = `${(item.level * 12) + 16}px`;
    div.dataset.path = item.path || ''; // Store path for active state check

    // Logic for click
    const handleClick = (e) => {
        // If it's a folder (has children), toggle
        if (item.children.length > 0) {
            const childUl = li.querySelector('ul');
            const icon = div.querySelector('svg');
            
            if (childUl) {
                const isHidden = childUl.classList.contains('hidden');
                if (isHidden) {
                    childUl.classList.remove('hidden');
                    childUl.classList.add('visible');
                    icon.classList.add('rotate-90');
                } else {
                    childUl.classList.remove('visible');
                    childUl.classList.add('hidden');
                    icon.classList.remove('rotate-90');
                }
            }
        }
        
        // If it's a link, allow default navigation (hash change will trigger load)
        if (!item.path) {
            e.preventDefault();
        }
    };

    // Label or Link
    const label = document.createElement(item.path ? 'a' : 'span');
    if (item.path) {
        const isExternal = item.path.startsWith('http');
        label.href = isExternal ? item.path : `#${item.path}`;
        if (isExternal) label.target = '_blank';
        label.className = "flex-1 py-1.5 block";
    } else {
        label.className = "flex-1 py-1.5 block";
    }
    label.textContent = item.title;
    label.addEventListener('click', handleClick);

    div.appendChild(label);

    // Folder Icon
    if (item.children.length > 0) {
        const btn = document.createElement('button');
        btn.className = "p-1 text-gray-400 hover:text-sunflower-500 focus:outline-none";
        btn.innerHTML = `<svg class="w-3 h-3 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>`;
        btn.addEventListener('click', (e) => {
             e.preventDefault();
             e.stopPropagation();
             handleClick(e);
        });
        div.appendChild(btn);
    }

    li.appendChild(div);

    // Recursion
    if (item.children.length > 0) {
        li.appendChild(createSidebarDOM(item.children));
    }

    ul.appendChild(li);
  });

  return ul;
};

// ------------------------------------------------------------------
// Core Logic
// ------------------------------------------------------------------

async function init() {
  // 1. Fetch Sidebar
  try {
    const res = await fetch(`${DOCS_ROOT}/_sidebar.md`);
    if (!res.ok) throw new Error('Sidebar not found');
    const text = await res.text();
    
    state.sidebarTree = parseSidebarMarkdown(text);
    
    const navContainer = document.getElementById('sidebar-nav');
    navContainer.innerHTML = '';
    navContainer.appendChild(createSidebarDOM(state.sidebarTree));
    navContainer.classList.add('fade-in-visible');

    // 2. Start Search Indexing
    buildSearchIndex(state.sidebarTree);

  } catch (e) {
    console.error(e);
  }

  // 3. Handle Initial Hash
  loadContentFromHash();
  
  // 4. Listeners
  window.addEventListener('hashchange', loadContentFromHash);
  
  // Mobile Menu
  document.getElementById('mobile-toggle').addEventListener('click', () => {
      document.getElementById('mobile-menu').classList.toggle('hidden');
  });

  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
      handleSearch(e.target.value);
  });

  // Navbar Scroll
  window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      if (window.scrollY > 20) {
          nav.classList.add('bg-white/90', 'backdrop-blur-md', 'border-gray-200', 'shadow-sm', 'py-3');
          nav.classList.remove('border-transparent', 'py-5');
      } else {
          nav.classList.remove('bg-white/90', 'backdrop-blur-md', 'border-gray-200', 'shadow-sm', 'py-3');
          nav.classList.add('border-transparent', 'py-5');
      }
  });
}

// Fetch Content
async function loadContentFromHash() {
  const contentArea = document.getElementById('content-area');
  
  // Animation reset
  contentArea.classList.remove('fade-in-visible');
  
  // Get Path
  let path = location.hash.slice(1);
  if (!path || path === '/') path = '/README.html';
  
  // Normalize
  if (!path.endsWith('.html')) path += '.html';
  state.currentPath = normalizePath(path);

  // Update Sidebar Active States
  updateSidebarActiveState();

  try {
      // Fix relative path issue by stripping leading slash for fetch
      const fetchPath = `${DOCS_ROOT}${state.currentPath}`;
      const res = await fetch(fetchPath);
      
      if (!res.ok) throw new Error('404');
      const html = await res.text();
      
      // Delay slightly for transition effect
      setTimeout(() => {
          contentArea.innerHTML = html;
          contentArea.classList.add('fade-in-visible');
          window.scrollTo(0, 0);
      }, 200);

  } catch (e) {
      contentArea.innerHTML = `<h1>404 Not Found</h1><p>The requested document <code>${state.currentPath}</code> could not be found.</p>`;
      contentArea.classList.add('fade-in-visible');
  }
}

function updateSidebarActiveState() {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(div => {
        const linkPath = div.dataset.path;
        const icon = div.querySelector('svg');
        const ul = div.nextElementSibling; // The nested UL

        // Reset
        div.classList.remove('active', 'border-sunflower-500', 'text-gray-900', 'font-medium');
        div.classList.add('border-transparent', 'text-gray-500');

        // Check Match
        if (linkPath === state.currentPath || (linkPath === '/' && state.currentPath === '/README.html')) {
            div.classList.add('active');
            div.classList.remove('border-transparent', 'text-gray-500');
            
            // Auto Expand Parents
            let parent = div.parentElement.parentElement; // li -> ul
            while (parent && parent.tagName === 'UL') {
                if (parent.classList.contains('hidden')) {
                    parent.classList.remove('hidden');
                    parent.classList.add('visible');
                    // Rotate the icon of the parent folder
                    const parentDiv = parent.previousElementSibling; // div (folder header)
                    if (parentDiv) {
                        const parentIcon = parentDiv.querySelector('svg');
                        if (parentIcon) parentIcon.classList.add('rotate-90');
                    }
                }
                parent = parent.parentElement.parentElement;
            }
        }
    });
}

// ------------------------------------------------------------------
// Search Logic
// ------------------------------------------------------------------

function extractPaths(items) {
    let paths = [];
    items.forEach(item => {
        if (item.path && !item.path.startsWith('http')) {
            paths.push({ path: item.path, title: item.title });
        }
        if (item.children) {
            paths = [...paths, ...extractPaths(item.children)];
        }
    });
    return paths;
}

async function buildSearchIndex(tree) {
    const paths = extractPaths(tree);
    const promises = paths.map(async (p) => {
        try {
            const res = await fetch(`${DOCS_ROOT}${p.path}`);
            if (res.ok) {
                const text = await res.text();
                state.searchIndex.push({
                    path: p.path,
                    title: p.title,
                    content: stripHtml(text).toLowerCase()
                });
            }
        } catch(e) {}
    });
    await Promise.all(promises);
    const icon = document.getElementById('search-icon');
    if (icon) icon.classList.add('text-gray-400'); // Stop any loading state if we had one
}

function handleSearch(query) {
    const lowerQ = query.toLowerCase();
    const lis = document.querySelectorAll('#sidebar-nav li');
    
    // Simplistic view logic: Re-evaluate visibility based on DOM tree is hard.
    // Easier: Re-render the tree passing the query filter?
    // Let's use the DOM references directly.
    
    if (!query) {
        // Reset visibility
        document.querySelectorAll('.nested-ul').forEach(ul => {
            ul.classList.add('hidden');
            ul.classList.remove('visible');
        });
        document.querySelectorAll('.rotate-90').forEach(icon => icon.classList.remove('rotate-90'));
        document.querySelectorAll('#sidebar-nav li').forEach(li => li.style.display = 'block');
        updateSidebarActiveState(); // Restore open state of current page
        return;
    }

    // Filter
    const matchedPaths = new Set();
    state.searchIndex.forEach(item => {
        if (item.title.toLowerCase().includes(lowerQ) || item.content.includes(lowerQ)) {
            matchedPaths.add(item.path);
        }
    });

    // Walk the DOM
    const walk = (li) => {
        const div = li.querySelector('.sidebar-link');
        const path = div.dataset.path;
        const title = div.innerText.toLowerCase();
        
        const isMatch = title.includes(lowerQ) || matchedPaths.has(path);
        
        let hasVisibleChild = false;
        const childUl = li.querySelector('ul');
        if (childUl) {
            // Check children
            Array.from(childUl.children).forEach(childLi => {
                if (walk(childLi)) hasVisibleChild = true;
            });
        }

        if (isMatch || hasVisibleChild) {
            li.style.display = 'block';
            if (childUl) {
                childUl.classList.remove('hidden');
                childUl.classList.add('visible');
            }
            return true;
        } else {
            li.style.display = 'none';
            return false;
        }
    };

    const rootUl = document.querySelector('#sidebar-nav > ul');
    if (rootUl) {
        Array.from(rootUl.children).forEach(li => walk(li));
    }
}

// Start
init();