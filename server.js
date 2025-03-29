const express = require('express');
const cors = require('cors');
const ApertiumTranslator = require('apertium-translator');

const app = express();
app.use(cors());
app.use(express.json());

const translator = new ApertiumTranslator();

// Liste des langues supportées
const languages = [
    { code: 'af', name: 'Afrikaans' }, { code: 'sq', name: 'Albanais' },
    { code: 'am', name: 'Amharique' }, { code: 'ar', name: 'Arabe' },
    { code: 'hy', name: 'Arménien' }, { code: 'az', name: 'Azerbaïdjanais' },
    { code: 'eu', name: 'Basque' }, { code: 'be', name: 'Biélorusse' },
    { code: 'bn', name: 'Bengali' }, { code: 'bs', name: 'Bosniaque' },
    { code: 'bg', name: 'Bulgare' }, { code: 'ca', name: 'Catalan' },
    { code: 'ceb', name: 'Cebuano' }, { code: 'ny', name: 'Chichewa' },
    { code: 'zh', name: 'Chinois' }, { code: 'co', name: 'Corse' },
    { code: 'hr', name: 'Croate' }, { code: 'cs', name: 'Tchèque' },
    { code: 'da', name: 'Danois' }, { code: 'nl', name: 'Néerlandais' },
    { code: 'en', name: 'Anglais' }, { code: 'eo', name: 'Espéranto' },
    { code: 'et', name: 'Estonien' }, { code: 'tl', name: 'Filipino' },
    { code: 'fi', name: 'Finnois' }, { code: 'fr', name: 'Français' },
    { code: 'fy', name: 'Frison' }, { code: 'gl', name: 'Galicien' },
    { code: 'ka', name: 'Géorgien' }, { code: 'de', name: 'Allemand' },
    { code: 'el', name: 'Grec' }, { code: 'gu', name: 'Gujarati' },
    { code: 'ht', name: 'Créole haïtien' }, { code: 'ha', name: 'Haoussa' },
    { code: 'haw', name: 'Hawaïen' }, { code: 'iw', name: 'Hébreu' },
    { code: 'hi', name: 'Hindi' }, { code: 'hmn', name: 'Hmong' },
    { code: 'hu', name: 'Hongrois' }, { code: 'is', name: 'Islandais' },
    { code: 'ig', name: 'Igbo' }, { code: 'id', name: 'Indonésien' },
    { code: 'ga', name: 'Irlandais' }, { code: 'it', name: 'Italien' },
    { code: 'ja', name: 'Japonais' }, { code: 'jw', name: 'Javanais' },
    { code: 'kn', name: 'Kannada' }, { code: 'kk', name: 'Kazakh' },
    { code: 'km', name: 'Khmer' }, { code: 'ko', name: 'Coréen' },
    { code: 'ku', name: 'Kurde' }, { code: 'ky', name: 'Kirghize' },
    { code: 'lo', name: 'Lao' }, { code: 'la', name: 'Latin' },
    { code: 'lv', name: 'Letton' }, { code: 'lt', name: 'Lituanien' },
    { code: 'lb', name: 'Luxembourgeois' }, { code: 'mk', name: 'Macédonien' },
    { code: 'mg', name: 'Malgache' }, { code: 'ms', name: 'Malais' },
    { code: 'ml', name: 'Malayalam' }, { code: 'mt', name: 'Maltais' },
    { code: 'mi', name: 'Maori' }, { code: 'mr', name: 'Marathi' },
    { code: 'mn', name: 'Mongol' }, { code: 'my', name: 'Myanmar' },
    { code: 'ne', name: 'Népalais' }, { code: 'no', name: 'Norvégien' },
    { code: 'ps', name: 'Pachtô' }, { code: 'fa', name: 'Persan' },
    { code: 'pl', name: 'Polonais' }, { code: 'pt', name: 'Portugais' },
    { code: 'pa', name: 'Pendjabi' }, { code: 'ro', name: 'Roumain' },
    { code: 'ru', name: 'Russe' }, { code: 'sm', name: 'Samoan' },
    { code: 'gd', name: 'Gaélique écossais' }, { code: 'sr', name: 'Serbe' },
    { code: 'st', name: 'Sesotho' }, { code: 'sn', name: 'Shona' },
    { code: 'sd', name: 'Sindhi' }, { code: 'si', name: 'Cinghalais' },
    { code: 'sk', name: 'Slovaque' }, { code: 'sl', name: 'Slovène' },
    { code: 'so', name: 'Somali' }, { code: 'es', name: 'Espagnol' },
    { code: 'su', name: 'Soundanais' }, { code: 'sw', name: 'Swahili' },
    { code: 'sv', name: 'Suédois' }, { code: 'tg', name: 'Tadjik' },
    { code: 'ta', name: 'Tamoul' }, { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thaï' }, { code: 'tr', name: 'Turc' },
    { code: 'uk', name: 'Ukrainien' }, { code: 'ur', name: 'Ourdou' },
    { code: 'uz', name: 'Ouzbek' }, { code: 'vi', name: 'Vietnamien' },
    { code: 'cy', name: 'Gallois' }, { code: 'xh', name: 'Xhosa' },
    { code: 'yi', name: 'Yiddish' }, { code: 'yo', name: 'Yoruba' },
    { code: 'zu', name: 'Zoulou' }
];

// Routes API
app.post('/translate', async (req, res) => {
    try {
        const { text, source, target } = req.body;
        
        if (!text || !target) {
            return res.status(400).json({
                success: false,
                error: 'Texte et langue cible requis'
            });
        }

        // Effectuer la traduction
        const translation = await translator.translate(text, source === 'auto' ? 'en' : source, target);

        res.json({
            success: true,
            translation: translation,
            detected_language: source === 'auto' ? 'en' : null
        });
    } catch (error) {
        console.error('Erreur de traduction:', error);
        res.status(500).json({
            success: false,
            error: 'Erreur de traduction'
        });
    }
});

app.get('/languages', (req, res) => {
    res.json({
        success: true,
        languages: languages
    });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
