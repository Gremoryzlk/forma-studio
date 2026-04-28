// Filter functionality
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('tag--accent');
          // Clear inline overrides so CSS :hover can take over again
          b.style.background  = '';
          b.style.borderColor = '';
          b.style.color       = '';
        });
        btn.classList.add('tag--accent');
        btn.style.background = 'var(--accent-dim)';

        const filter = btn.dataset.filter;
        document.querySelectorAll('.case-item').forEach(item => {
          const show = filter === 'all' || item.dataset.category.includes(filter);
          if (show) {
            item.style.display  = '';
            item.style.opacity  = '0';
            item.style.transition = 'opacity .35s';
            requestAnimationFrame(() => { item.style.opacity = '1'; });
          } else {
            item.style.transition = 'opacity .25s';
            item.style.opacity  = '0';
            setTimeout(() => { item.style.display = 'none'; }, 260);
          }
        });
      });
    });