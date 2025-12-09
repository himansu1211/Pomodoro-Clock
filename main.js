function toggleTheme() {
        document.body.classList.toggle('day-mode');
        isDayMode = document.body.classList.contains('day-mode');
        const moonIcon = document.getElementById('moon-icon');
        const sunIcon = document.getElementById('sun-icon');
        const bgColorPicker = document.getElementById('bg-color-picker');

        if (isDayMode) {
            if (moonIcon) moonIcon.classList.add('hidden');
            if (sunIcon) sunIcon.classList.remove('hidden');
            if (bgColorPicker) bgColorPicker.value = '#FFFFFF';
        } else {
            if (moonIcon) moonIcon.classList.remove('hidden');
            if (sunIcon) sunIcon.classList.add('hidden');
            if (bgColorPicker) bgColorPicker.value = '#0F0F19';
        }
        updateBackgroundColor(bgColorPicker ? bgColorPicker.value : '#0F0F19');
    }
