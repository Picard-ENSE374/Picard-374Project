const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const mushroomsSchema = new mongoose.Schema ({
    name: String,
    scientific: String,
    safe: Boolean,
    location: String,
    benefits: String,
    symptoms: String,
    facts: String,
    imageFile: String
});

var Mushrooms = mongoose.model ("Mushrooms", mushroomsSchema);

const favouritesSchema = new mongoose.Schema ({
    mushroom: String, 
    username: String
});

var Favourites = mongoose.model ("Favourites", favouritesSchema);

Mushrooms.insertMany(
[
    {
        "name":"Fly Agaric",
        "scientific":"Amanita Muscaria",
        "safe": false,
        "location": "Northern Hemisphere",
        "benefits": "None.",
        "symptoms": "Can cause hallucinations and psychotic reactions. Effects can range from nausea and twitching to drowsiness, sweating and salivation, auditory and visual distortions, mood changes, euphoria, relaxation, ataxia, and loss of equilibrium.",
        "facts": "Famous, enchanting and highly toxic. Fly agaric has a bright red cap with white spots and white gills. It grows on light souls among birch, pine, and spruce. Fly agaric has a long history of use in religious ceremonies. This toadstool has turned up in many fairy tale stories.",
        "imageFile": "fly-agaric-amanita-muscaria.jpg"
    },
    {
        "name":"Lion's Mane",
        "scientific":"Hericium Erinaceus",
        "safe": true,
        "location": "Northern Hemisphere",
        "benefits": "Nutritious and are rich in vitamins such as thiamine, riboflavin, and niacin.  Lion’s mane is also a good source of essential minerals such as manganese, zinc, and potassium. It has many anti-Inflammatory and antioxidant properties, may help with overcoming dementia, and can reduce anxiety and depression.",
        "symptoms": "None",
        "facts": "Lion’s mane can be identified by its long spines (greater than 1 cm length), occurrence on hardwoods, and tendency to grow a single clump of dangling spines. The fruit bodies can be harvested for culinary use. It is common in gourmet cooking. Its flavour can be compared to lobster.",
        "imageFile": "lions-mane.jpg"
    },
    {
        "name":"Reishi",
        "scientific":"Lingzhi",
        "safe": true,
        "location":"East Asia",
        "benefits": "The Lingzhi mushroom has been used in traditional Chinese medicine. There have been claims that the Lingzhi mushroom can help with sleep, anxiety, depression, and focus.  There is insufficient evidence to indicate that consuming lingzhi mushrooms or their extracts has any effect on human health or diseases.",
        "symptoms": "None",
        "facts": "Its reddish brown varnished kidney-shaped cap with bands and peripherally inserted stem gives it a distinct fan-like appearance. When fresh, the Lingzhi is soft, cork-like, and flat. It lacks gills on its underside, and instead releases its spores via fine pores in yellow colors.",
        "imageFile": "reishi-mushroom.jpg"
    },
    {
        "name": "Death Cap",
        "scientific": "Amanita Phalloides",
        "safe": false,
        "location": "Europe, West  Asia, North America",
        "benefits": "None",
        "symptoms": "Eating a death cap may lead to live and kidney damage as well as death. Some early symptoms include violent abdominal pain, vomiting, and bloody diarrhea appear, causing rapid loss of fluid from the tissues and intense thirst.",
        "facts": "Perhaps the deadliest of all mushrooms, the caps are generally greenish in colour with a white stipe and gills. The Death Cap Mushroom is responsible for 90% of all deaths related to mushroom consumption",
        "imageFile": "death-cap.jpg"
    },
    {
        "name": "Autumn Skullcap",
        "scientific":"Galerina Marginata",
        "safe": false,
        "location": "Northern Hemisphere, Austrailia",
        "benefits": "None",
        "symptoms": "Ingestion causes diarrhea, vomiting, hypothermia, and liver damage, and can result in death if left untreated.",
        "facts": "This mushroom has brown to yellow-brown caps that fade in color when drying. The gills are brownish and give a rusty spore print. A well-defined membranous ring is typically seen on the stems of young specimens but often disappears with age. Several deaths and poisonings have been attributed to collectors mistaking the autumn skullcap for hallucinogenic Psilocybe mushrooms.",
        "imageFile": "autumn-skullcap.png"
    },
    {
        "name":"Destroying Angel",
        "scientific":"Amanita Bisporigera",
        "safe": false,
        "location": "Europe, Asia",
        "benefits": "None",
        "symptoms": "Symptoms include vomiting, delirium, convulsions, diarrhea, liver and kidney failure, and often lead to death.",
        "facts": "The destroying angels are actually several species of all-white mushrooms in the genus Amanita. These incredibly toxic fungi are very similar in appearance to edible button mushrooms and the meadow mushrooms, and have been collected by mistake on numerous occasions.",
        "imageFile": "destroying-angel.jpg"
    },
    {
        "name": "Poison Fire Coral",
        "scientific":"Podostroma Cornu-damae",
        "safe": false,
        "location": "Asia",
        "benefits": "None",
        "symptoms": "Symptoms of poisoning include stomach pain, peeling skin, hair loss, low blood pressure, liver necrosis, acute kidney failure, and result in death if left untreated.",
        "facts": "This rare fungus is native to Asia and has been responsible for a number of fatalities in Japan and Korea. Its red fruiting bodies contain potent toxins known as trichothecene mycotoxins and can cause multiple organ failure in those unlucky enough to consume them.",
        "imageFile": "poison-fire-coral.jpg"
    },
    {
        "name": "White Button",
        "scientific":"Agaricus Bisporus",
        "safe": true,
        "location": "Europe, North America",
        "benefits": "This mushroom has several health benefits, including cancer-fighting properties, cholesterol-lowering effects, and improved gut health. They are also very low in calories and have a high protein content.",
        "symptoms": "None",
        "facts": "The white buttion is cultivated in more than seventy countries and is one of the most commonly and widely consumed mushrooms in the world.",
        "imageFile": "white-button.jpg"
    },
    {
        "name": "Turkey Tail",
        "scientific":"Coriolus Versicolor",
        "safe": true,
        "location": "North America",
        "benefits": "packed with antioxidants, immune-boosting polysaccharpeptides, improves immune function in people fighting cancer, and enchances gut health.",
        "symptoms": "None",
        "facts": "Turkey tail mushroom grows on stumps and the decomposing wood of trees. It contains polysaccharide peptide (PSP) and polysaccharide krestin (PSK), which are used as medicine. People use turkey tail mushroom to improve response to cancer medicines and radiation.",
        "imageFile": "turkey-tail.jpg"
    },
    {
        "name": "Chaga",
        "scientific":"Inonotus Obliquus",
        "safe": true,
        "location": "Canada, Russia, Alaska, Northern Europe",
        "benefits": "Boosts immune system and fights inflamation, prevents and fights cancer, lowers blood sugar, and lowers cholesteral.",
        "symptoms": "None",
        "facts": "Chaga produces a woody growth, or conk, which looks similar to a clump of burnt charcoal — roughly 10–15 inches in size. However, the inside reveals a soft core with an orange color. For centuries, chaga has been used as a traditional medicine in Russia and other Northern European countries, mainly to boost immunity and overall health.",
        "imageFile": "chaga.jpg"
    }
]
)


Favourites.insertMany(
[
    {
        "mushroom": "Chaga",
        "username": "admin"
    }
]
)
