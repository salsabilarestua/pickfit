const ootdData = [
    // --- FORMAL ---
    { 
        category: 'formal', 
        img: 'https://images.pexels.com/photos/1342609/pexels-photo-1342609.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Beige Power Suit' 
    },
    { 
        category: 'formal', 
        img: 'https://images.pexels.com/photos/7661203/pexels-photo-7661203.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Minimalist White Blazer' 
    },
    { 
        category: 'formal', 
        img: 'https://images.pexels.com/photos/713829/pexels-photo-713829.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Executive Navy Blue' 
    },
    { 
        category: 'formal', 
        img: 'https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Classic Business Set' 
    },

    // --- CASUAL ---
    { 
        category: 'casual', 
        img: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Weekend Vibes' 
    },
    { 
        category: 'casual', 
        img: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Street Style Nude' 
    },
    { 
        category: 'casual', 
        img: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Comfy Knitwear' 
    },
    { 
        category: 'casual', 
        img: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Minimalist Daily' 
    },

    // --- WEDDING ---
    { 
        category: 'wedding', 
        img: 'https://images.pexels.com/photos/2065195/pexels-photo-2065195.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Champagne Silk Guest' 
    },
    { 
        category: 'wedding', 
        img: 'https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Elegant Party Gown' 
    },
    { 
        category: 'wedding', 
        img: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Pastel Wedding Guest' 
    },

    // --- DATE NIGHT ---
    { 
        category: 'date', 
        img: 'https://images.pexels.com/photos/2739792/pexels-photo-2739792.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Romantic Night Look' 
    },
    { 
        category: 'date', 
        img: 'https://images.pexels.com/photos/1381553/pexels-photo-1381553.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Classy Black Date' 
    },
    { 
        category: 'date', 
        img: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=600', 
        label: 'Dreamy Dinner Out' 
    }
];

function filterKategori(selected) {
    const grid = document.getElementById('gallery-grid');
    const buttons = document.querySelectorAll('.btn-filter');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    grid.innerHTML = "";

    const filtered = selected === 'all' 
        ? ootdData 
        : ootdData.filter(item => item.category === selected);

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ootd-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.label}">
            <div class="ootd-info">
                <span>${item.category}</span>
                <p style="font-weight:600; margin-top:5px;">${item.label}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    filterKategori('all');
});