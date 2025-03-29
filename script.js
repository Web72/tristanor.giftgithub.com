document.addEventListener('DOMContentLoaded', () => {
    const sourceLanguage = document.getElementById('sourceLanguage');
    const targetLanguage = document.getElementById('targetLanguage');
    const sourceText = document.getElementById('sourceText');
    const targetText = document.getElementById('targetText');
    const translateButton = document.getElementById('translateButton');
    const swapButton = document.getElementById('swapButton');
    const charCounts = document.querySelectorAll('.char-count');

    // Liste des langues principales
    const languages = [
        { code: 'auto', name: 'Détecter la langue' },
        { code: 'fr', name: 'Français' },
        { code: 'en', name: 'Anglais' },
        { code: 'es', name: 'Espagnol' },
        { code: 'de', name: 'Allemand' },
        { code: 'it', name: 'Italien' },
        { code: 'pt', name: 'Portugais' },
        { code: 'nl', name: 'Néerlandais' },
        { code: 'pl', name: 'Polonais' },
        { code: 'ru', name: 'Russe' },
        { code: 'ja', name: 'Japonais' },
        { code: 'zh', name: 'Chinois' },
        { code: 'ko', name: 'Coréen' },
        { code: 'ar', name: 'Arabe' },
        { code: 'hi', name: 'Hindi' },
        { code: 'tr', name: 'Turc' }
    ];

    // Fonction de traduction
    async function translate() {
        const text = sourceText.value.trim();
        if (!text) return;

        setLoading(true);
        targetText.value = 'Traduction en cours...';
        
        try {
            const sourceLang = sourceLanguage.value;
            const targetLang = targetLanguage.value;
            
            // Construire l'URL de l'API MyMemory
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang === 'auto' ? 'fr' : sourceLang}|${targetLang}`;
            
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.responseData?.translatedText) {
                targetText.value = data.responseData.translatedText;
                updateCharCount(targetText, charCounts[1]);
            } else {
                throw new Error('Erreur de traduction');
            }
        } catch (error) {
            console.error('Erreur:', error);
            targetText.value = `Erreur: ${error.message}. Veuillez réessayer.`;
        } finally {
            setLoading(false);
        }
    }

    // Mettre à jour le compteur de caractères
    function updateCharCount(textarea, counter) {
        counter.textContent = `${textarea.value.length} caractères`;
    }

    // Fonction pour échanger les langues
    function swapLanguages() {
        if (sourceLanguage.value === 'auto') return;
        
        const tempLang = sourceLanguage.value;
        sourceLanguage.value = targetLanguage.value;
        targetLanguage.value = tempLang;

        // Échanger aussi les textes
        const tempText = sourceText.value;
        sourceText.value = targetText.value;
        targetText.value = tempText;

        // Mettre à jour les compteurs
        updateCharCount(sourceText, charCounts[0]);
        updateCharCount(targetText, charCounts[1]);
    }

    // Fonction pour remplir les sélecteurs de langue
    function populateLanguageSelectors() {
        // Vider les sélecteurs
        sourceLanguage.innerHTML = '';
        targetLanguage.innerHTML = '';

        // Remplir avec les langues
        languages.forEach(lang => {
            const sourceOption = new Option(lang.name, lang.code);
            const targetOption = new Option(lang.name, lang.code);

            sourceLanguage.add(sourceOption);
            if (lang.code !== 'auto') { // Ne pas ajouter 'auto' dans le sélecteur cible
                targetLanguage.add(targetOption);
            }
        });

        // Définir les valeurs par défaut
        sourceLanguage.value = 'auto';
        targetLanguage.value = 'en'; 
    }

    // Fonction pour gérer l'état de chargement
    function setLoading(isLoading) {
        translateButton.disabled = isLoading;
        sourceText.disabled = isLoading;
        sourceLanguage.disabled = isLoading;
        targetLanguage.disabled = isLoading;
        swapButton.disabled = isLoading;
        
        translateButton.innerHTML = isLoading ? 
            '<i class="fas fa-spinner fa-spin"></i> Traduction...' : 
            '<i class="fas fa-language"></i> Traduire';
    }

    // Initialisation
    populateLanguageSelectors();
    updateCharCount(sourceText, charCounts[0]);
    updateCharCount(targetText, charCounts[1]);

    // Événements
    translateButton.addEventListener('click', translate);
    swapButton.addEventListener('click', swapLanguages);
    sourceText.addEventListener('input', () => updateCharCount(sourceText, charCounts[0]));
    targetText.addEventListener('input', () => updateCharCount(targetText, charCounts[1]));
});
