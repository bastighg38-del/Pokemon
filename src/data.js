// data.js – Alle Pokémon- und Attacken-Daten, Items, Hilfsfunktionen
function getPokemonTsv() {
    return `Rang	Nr.	Pokémon	Typ(en)	KP	Ang.	Vert.	Sp.-A.	Sp.-V.	Init.	Summe
4.	0150	Mewtu	Psycho	106	110	90	154	90	130	680
12.	0149	Dragoran	DracheFlug	91	134	95	100	100	80	600
12.	0151	Mew	Psycho	100	100	100	100	100	100	600
23.	0144	Arktos	EisFlug	90	85	100	95	125	85	580
23.	0145	Zapdos	ElektroFlug	90	90	85	125	90	100	580
23.	0146	Lavados	FeuerFlug	90	100	90	125	85	90	580
27.	0059	Arkani	Feuer	90	110	80	100	80	95	555
28.	0130	Garados	WasserFlug	95	125	79	60	100	81	540
28.	0143	Relaxo	Normal	160	110	65	65	110	30	540
30.	0131	Lapras	WasserEis	130	85	80	85	95	60	535
31.	0006	Glurak	FeuerFlug	78	84	78	109	85	100	534
32.	0009	Turtok	Wasser	79	83	100	85	105	78	530
32.	0103	Kokowei	PflanzePsycho	95	95	85	125	75	55	530
34.	0003	Bisaflor	PflanzeGift	80	82	83	100	100	80	525
34.	0091	Austos	WasserEis	50	95	180	85	45	70	525
34.	0134	Aquana	Wasser	130	65	60	110	95	65	525
34.	0135	Blitza	Elektro	65	65	60	110	95	130	525
34.	0136	Flamara	Feuer	65	130	60	95	110	65	525
39.	0121	Starmie	WasserPsycho	60	75	85	100	85	115	520
40.	0073	Tentoxa	WasserGift	80	70	65	80	120	100	515
40.	0142	Aerodactyl	GesteinFlug	80	105	65	60	75	130	515
42.	0062	Quappo	WasserKampf	90	95	95	70	90	70	510
43.	0031	Nidoqueen	GiftBoden	90	92	87	75	85	76	505
43.	0034	Nidoking	GiftBoden	81	102	77	85	75	85	505
43.	0038	Vulnona	Feuer	73	76	75	81	100	100	505
43.	0068	Machomei	Kampf	90	130	80	65	85	55	505
47.	0055	Entoron	Wasser	80	82	78	95	80	85	500
47.	0065	Simsala	Psycho	55	50	45	135	95	120	500
47.	0078	Gallopa	Feuer	65	100	70	80	80	105	500
47.	0089	Sleimok	Gift	105	105	75	65	100	50	500
47.	0094	Gengar	GeistGift	60	65	60	130	75	110	500
47.	0123	Sichlor	KäferFlug	70	110	80	55	80	105	500
47.	0127	Pinsir	Käfer	65	125	100	55	70	85	500
54.	0076	Geowaz	GesteinBoden	80	120	130	55	65	45	495
54.	0126	Magmar	Feuer	65	95	57	100	85	93	495
54.	0139	Amoroso	GesteinWasser	70	60	125	115	70	55	495
54.	0141	Kabutops	GesteinWasser	60	115	105	65	70	80	495
59.	0045	Giflor	PflanzeGift	75	80	85	110	90	50	490
59.	0071	Sarzenia	PflanzeGift	80	105	65	100	70	70	490
59.	0080	Lahmus	WasserPsycho	95	75	110	100	80	30	490
59.	0101	Lektrobal	Elektro	60	50	70	80	80	150	490
59.	0110	Smogmog	Gift	65	90	120	85	70	60	490
59.	0115	Kangama	Normal	105	95	80	40	80	90	490
59.	0125	Elektek	Elektro	65	83	57	95	85	105	490
59.	0128	Tauros	Normal	75	100	95	40	70	110	490
67.	0026	Raichu	Elektro	60	90	55	90	80	110	485
67.	0112	Rizeros	BodenGestein	105	130	120	45	45	40	485
69.	0036	Pixi	Fee	95	70	73	95	90	60	483
69.	0097	Hypno	Psycho	85	73	70	73	115	67	483
71.	0018	Tauboss	NormalFlug	83	80	75	70	70	101	479
72.	0087	Jugong	WasserEis	90	70	80	70	95	70	475
72.	0099	Kingler	Wasser	55	130	115	50	50	75	475
74.	0085	Dodri	NormalFlug	60	110	70	60	60	110	470
75.	0082	Magneton	ElektroStahl	50	60	95	120	70	70	465
76.	0122	Pantimos	PsychoFee	40	45	65	100	120	90	460
77.	0042	Golbat	GiftFlug	75	80	70	65	75	90	455
77.	0057	Rasaff	Kampf	65	105	60	60	70	95	455
77.	0106	Kicklee	Kampf	50	120	53	35	110	87	455
77.	0107	Nockchan	Kampf	50	105	79	35	110	76	455
77.	0124	Rossana	EisPsycho	65	50	35	115	95	95	455
82.	0028	Sandamer	Boden	75	100	110	45	55	65	450
82.	0049	Omot	KäferGift	70	65	60	90	75	90	450
82.	0113	Chaneira	Normal	250	5	5	35	105	50	450
82.	0119	Golking	Wasser	80	92	65	65	80	68	450
86.	0024	Arbok	Gift	60	95	69	65	79	80	448
87.	0022	Ibitak	NormalFlug	65	90	65	61	61	100	442
88.	0053	Snobilikat	Normal	65	70	60	65	65	115	440
88.	0117	Seemon	Wasser	55	65	95	95	45	85	440
90.	0040	Knuddeluff	NormalFee	140	70	45	85	50	45	435
90.	0114	Tangela	Pflanze	65	55	115	100	40	60	435
92.	0051	Digdri	Boden	35	100	50	50	70	120	425
92.	0105	Knogga	Boden	60	80	110	50	80	45	425
94.	0148	Dragonir	Drache	61	84	65	70	70	70	420
95.	0020	Rattikarl	Normal	55	81	60	50	70	97	413
96.	0077	Ponita	Feuer	50	85	55	65	65	90	410
97.	0002	Bisaknosp	PflanzeGift	60	62	63	80	80	60	405
97.	0005	Glutexo	Feuer	58	64	58	80	65	80	405
97.	0008	Schillok	Wasser	59	63	80	65	80	58	405
97.	0047	Parasek	KäferPflanze	60	95	80	60	80	30	405
97.	0067	Maschock	Kampf	80	100	70	50	60	45	405
97.	0093	Alpollo	GeistGift	45	50	45	115	55	95	405
103.	0064	Kadabra	Psycho	40	35	30	120	70	105	400
104.	0012	Smettbo	KäferFlug	60	45	50	90	80	70	395
104.	0015	Bibor	KäferGift	65	90	40	45	80	75	395
104.	0044	Duflor	PflanzeGift	60	65	70	85	75	40	395
104.	0137	Porygon	Normal	65	60	70	85	75	40	395
108.	0070	Ultrigaria	PflanzeGift	65	90	50	85	45	55	390
108.	0075	Georok	GesteinBoden	55	95	115	45	45	35	390
110.	0061	Quaputzi	Wasser	65	65	65	50	50	90	385
110.	0095	Onix	GesteinBoden	35	45	160	30	45	70	385
110.	0108	Schlurp	Normal	90	55	75	60	75	30	385
113.	0083	Porenta	NormalFlug	52	90	55	58	62	60	377
114.	0030	Nidorina	Gift	70	62	67	55	55	56	365
114.	0033	Nidorino	Gift	61	72	57	55	55	65	365
116.	0138	Amonitas	GesteinWasser	35	40	100	90	55	35	355
116.	0140	Kabuto	GesteinWasser	30	80	90	55	45	55	355
118.	0058	Fukano	Feuer	55	70	45	70	50	60	350
119.	0017	Tauboga	NormalFlug	63	60	55	50	50	71	349
120.	0111	Rihorn	BodenGestein	80	85	95	30	30	25	345
121.	0109	Smogon	Gift	40	65	95	60	45	35	340
121.	0120	Sterndu	Wasser	30	45	55	70	55	85	340
123.	0072	Tentacha	WasserGift	40	40	35	50	100	70	335
124.	0100	Voltobal	Elektro	40	30	50	55	55	100	330
125.	0096	Traumato	Psycho	60	48	45	43	90	42	328
126.	0081	Magnetilo	ElektroStahl	25	35	70	95	55	45	325
126.	0086	Jurob	Wasser	65	45	55	45	70	45	325
126.	0088	Sleima	Gift	80	80	50	40	50	25	325
126.	0098	Krabby	Wasser	30	105	90	25	25	50	325
126.	0102	Owei	PflanzePsycho	60	40	80	60	45	40	325
126.	0133	Evoli	Normal	55	55	50	45	65	55	325
132.	0035	Piepi	Fee	70	45	48	60	65	35	323
133.	0025	Pikachu Alle Formen	Elektro	35	55	40	50	50	90	320
133.	0043	Myrapla	PflanzeGift	45	50	55	75	65	30	320
133.	0054	Enton	Wasser	50	52	48	65	50	55	320
133.	0104	Tragosso	Boden	50	50	95	40	50	35	320
133.	0118	Goldini	Wasser	45	67	60	35	50	63	320
138.	0001	Bisasam	PflanzeGift	45	49	49	65	65	45	318
139.	0079	Flegmon	WasserPsycho	90	65	65	40	40	15	315
140.	0007	Schiggy	Wasser	44	48	65	50	64	43	314
141.	0063	Abra	Psycho	25	20	15	105	55	90	310
141.	0084	Dodu	NormalFlug	35	85	45	35	35	75	310
141.	0092	Nebulak	GeistGift	30	35	30	100	35	80	310
144.	0004	Glumanda	Feuer	39	52	43	60	50	65	309
145.	0048	Bluzuk	KäferGift	60	55	50	40	55	45	305
145.	0056	Menki	Kampf	40	80	35	35	45	70	305
145.	0066	Machollo	Kampf	70	80	50	35	35	35	305
145.	0090	Muschas	Wasser	30	65	100	45	25	40	305
149.	0027	Sandan	Boden	50	75	85	20	30	40	300
149.	0060	Quapsel	Wasser	40	50	40	40	40	90	300
149.	0069	Knofensa	PflanzeGift	50	75	35	70	30	40	300
149.	0074	Kleinstein	GesteinBoden	40	80	100	30	30	20	300
149.	0147	Dratini	Drache	41	64	45	50	50	50	300
154.	0037	Vulpix	Feuer	38	41	40	50	65	65	299
155.	0116	Seeper	Wasser	30	40	70	70	25	60	295
156.	0052	Mauzi	Normal	40	45	35	40	40	90	290
157.	0023	Rettan	Gift	35	60	44	40	54	55	288
157.	0132	Ditto	Normal	48	48	48	48	48	48	288
159.	0046	Paras	KäferPflanze	35	70	55	45	55	25	285
160.	0029	Nidoran♀	Gift	55	47	52	40	40	41	275
161.	0032	Nidoran♂	Gift	46	57	40	40	40	50	273
162.	0039	Pummeluff	NormalFee	115	45	20	45	25	20	270
163.	0050	Digda	Boden	10	55	25	35	45	95	265
164.	0021	Habitak	NormalFlug	40	60	30	31	31	70	262
165.	0019	Rattfratz	Normal	30	56	35	25	35	72	253
166.	0016	Taubsi	NormalFlug	40	45	40	35	35	56	251
167.	0041	Zubat	GiftFlug	40	45	45	30	40	55	245
168.	0011	Safcon	Käfer	50	20	55	25	25	30	205
168.	0014	Kokuna	KäferGift	45	25	50	25	25	35	205
170.	0129	Karpador	Wasser	20	10	55	15	20	80	200
171.	0010	Raupy	Käfer	45	30	35	20	20	45	195
171.	0013	Hornliu	KäferGift	40	35	30	20	20	50	195`;
}

function getMovesTsv() {
    return `ID	Name	Typ	Kategorie	Stärke	Genauigkeit in %	AP	Priorität
001	Pfund	Normal	Physisch	40	100	35	0
002	Karateschlag	Kampf	Physisch	50	100	25	0
003	Duplexhieb	Normal	Physisch	15	85	10	0
004	Kometenhieb	Normal	Physisch	18	85	15	0
005	Megahieb	Normal	Physisch	80	85	20	0
006	Zahltag	Normal	Physisch	40	100	20	0
007	Feuerschlag	Feuer	Physisch	75	100	15	0
008	Eishieb	Eis	Physisch	75	100	15	0
009	Donnerschlag	Elektro	Physisch	75	100	15	0
010	Kratzer	Normal	Physisch	40	100	35	0
011	Klammer	Normal	Physisch	55	100	30	0
012	Guillotine	Normal	Physisch	K.O.	30	5	0
013	Klingensturm	Normal	Spezial	80	100	10	0
014	Schwerttanz	Normal	Status	—	—	20	0
015	Zerschneider	Normal	Physisch	50	95	30	0
016	Windstoß	Flug	Spezial	40	100	35	0
017	Flügelschlag	Flug	Physisch	60	100	35	0
018	Wirbelwind	Normal	Status	—	—	20	-6
019	Fliegen	Flug	Physisch	90	95	15	0
020	Klammergriff	Normal	Physisch	15	85	20	0
021	Slam	Normal	Physisch	80	75	20	0
022	Rankenhieb	Pflanze	Physisch	45	100	25	0
023	Stampfer	Normal	Physisch	65	100	20	0
024	Doppelkick	Kampf	Physisch	30	100	30	0
025	Megakick	Normal	Physisch	120	75	5	0
026	Sprungkick	Kampf	Physisch	100	95	10	0
027	Fegekick	Kampf	Physisch	60	85	15	0
028	Sandwirbel	Boden	Status	—	100	15	0
029	Kopfnuss	Normal	Physisch	70	100	15	0
030	Hornattacke	Normal	Physisch	65	100	25	0
031	Furienschlag	Normal	Physisch	15	85	20	0
032	Hornbohrer	Normal	Physisch	K.O.	30	5	0
033	Tackle	Normal	Physisch	50	100	35	0
034	Bodyslam	Normal	Physisch	85	100	15	0
035	Wickel	Normal	Physisch	15	90	20	0
036	Bodycheck	Normal	Physisch	90	85	20	0
037	Fuchtler	Normal	Physisch	120	100	10	0
038	Risikotackle	Normal	Physisch	120	100	15	0
039	Rutenschlag	Normal	Status	—	100	30	0
040	Giftstachel	Gift	Physisch	15	100	35	0
041	Duonadel	Käfer	Physisch	25	100	20	0
042	Nadelrakete	Käfer	Physisch	25	95	20	0
043	Silberblick	Normal	Status	—	100	30	0
044	Biss	Unlicht	Physisch	60	100	25	0
045	Heuler	Normal	Status	—	100	40	0
046	Brüller	Normal	Status	—	—	20	-6
047	Gesang	Normal	Status	—	55	15	0
048	Superschall	Normal	Status	—	55	20	0
049	Ultraschall	Normal	Spezial	20 (KP)	90	20	0
050	Aussetzer	Normal	Status	—	100	20	0
051	Säure	Gift	Spezial	40	100	30	0
052	Glut	Feuer	Spezial	40	100	25	0
053	Flammenwurf	Feuer	Spezial	90	100	15	0
054	Weißnebel	Eis	Status	—	—	30	0
055	Aquaknarre	Wasser	Spezial	40	100	25	0
056	Hydropumpe	Wasser	Spezial	110	80	5	0
057	Surfer	Wasser	Spezial	90	100	15	0
058	Eisstrahl	Eis	Spezial	90	100	10	0
059	Blizzard	Eis	Spezial	110	70	5	0
060	Psystrahl	Psycho	Spezial	65	100	20	0
061	Blubbstrahl	Wasser	Spezial	65	100	20	0
062	Aurorastrahl	Eis	Spezial	65	100	20	0
063	Hyperstrahl	Normal	Spezial	150	90	5	0
064	Schnabel	Flug	Physisch	35	100	35	0
065	Bohrschnabel	Flug	Physisch	80	100	20	0
066	Überroller	Kampf	Physisch	80	80	25	0
067	Fußkick	Kampf	Physisch	Variiert (Gewicht)	100	20	0
068	Konter	Kampf	Physisch	—	100	20	-1
069	Geowurf	Kampf	Physisch	Variiert (Level)	100	20	0
070	Stärke	Normal	Physisch	80	100	15	0
071	Absorber	Pflanze	Spezial	40	100	15	0
072	Megasauger	Pflanze	Spezial	75	100	10	0
073	Egelsamen	Pflanze	Status	—	90	10	0
074	Wachstum	Normal	Status	—	—	20	0
075	Rasierblatt	Pflanze	Physisch	55	95	25	0
076	Solarstrahl	Pflanze	Spezial	200	100	10	0
077	Giftpuder	Gift	Status	—	75	35	0
078	Stachelspore	Pflanze	Status	—	75	30	0
079	Schlafpuder	Pflanze	Status	—	75	15	0
080	Blättertanz	Pflanze	Spezial	120	100	10	0
081	Fadenschuss	Käfer	Status	—	95	40	0
082	Drachenwut	Drache	Spezial	40 (KP)	100	10	0
083	Feuerwirbel	Feuer	Spezial	35	85	15	0
084	Donnerschock	Elektro	Spezial	40	100	30	0
085	Donnerblitz	Elektro	Spezial	90	100	15	0
086	Donnerwelle	Elektro	Status	—	100	20	0
087	Donner	Elektro	Spezial	110	70	10	0
088	Steinwurf	Gestein	Physisch	50	90	15	0
089	Erdbeben	Boden	Physisch	100	100	10	0
090	Geofissur	Boden	Physisch	K.O.	30	5	0
091	Schaufler	Boden	Physisch	80	100	10	0
092	Toxin	Gift	Status	—	90	10	0
093	Konfusion	Psycho	Spezial	50	100	25	0
094	Psychokinese	Psycho	Spezial	90	100	10	0
095	Hypnose	Psycho	Status	—	60	20	0
096	Meditation	Psycho	Status	—	—	40	0
097	Agilität	Psycho	Status	—	—	30	0
098	Ruckzuckhieb	Normal	Physisch	40	100	30	1
099	Raserei	Normal	Physisch	20	100	20	0
100	Teleport	Psycho	Status	—	—	20	0
101	Nachtnebel	Geist	Spezial	Variiert (Level)	100	15	0
102	Mimikry	Normal	Status	—	—	10	0
103	Kreideschrei	Normal	Status	—	85	40	0
104	Doppelteam	Normal	Status	—	—	15	0
105	Genesung	Normal	Status	—	—	10	0
106	Härtner	Normal	Status	—	—	30	0
107	Komprimator	Normal	Status	—	—	10	0
108	Rauchwolke	Normal	Status	—	100	20	0
109	Konfustrahl	Geist	Status	—	100	10	0
110	Panzerschutz	Wasser	Status	—	—	40	0
111	Einigler	Normal	Status	—	—	40	0
112	Barriere	Psycho	Status	—	—	20	0
113	Lichtschild	Psycho	Status	—	—	30	0
114	Dunkelnebel	Eis	Status	—	—	30	0
115	Reflektor	Psycho	Status	—	—	20	0
116	Energiefokus	Normal	Status	—	—	30	0
117	Geduld	Normal	Physisch	—	100	10	0
118	Metronom	Normal	Status	—	—	10	0
119	Spiegeltrick	Flug	Status	—	—	20	0
120	Finale	Normal	Spezial	200	100	5	0
121	Eierbombe	Normal	Physisch	100	75	10	0
122	Schlecker	Geist	Physisch	30	100	30	0
123	Smog	Gift	Spezial	30	70	20	0
124	Schlammbad	Gift	Spezial	65	100	20	0
125	Knochenkeule	Boden	Physisch	65	85	20	0
126	Feuersturm	Feuer	Spezial	110	85	5	0
127	Kaskade	Wasser	Physisch	80	100	15	0
128	Schnapper	Wasser	Physisch	35	85	15	0
129	Sternschauer	Normal	Spezial	60	—	20	0
130	Schädelwumme	Normal	Physisch	130	100	10	0
131	Dornkanone	Normal	Physisch	20	100	15	0
132	Umklammerung	Normal	Physisch	10	100	35	0
133	Amnesie	Psycho	Status	—	—	20	0
134	Psykraft	Psycho	Status	—	80	15	0
135	Weichei	Normal	Status	—	—	10	0
136	Turmkick	Kampf	Physisch	130	90	10	0
137	Giftblick	Normal	Status	—	100	30	0
138	Traumfresser	Psycho	Spezial	100	100	15	0
139	Giftwolke	Gift	Status	—	90	40	0
140	Stakkato	Normal	Physisch	15	85	20	0
141	Blutsauger	Käfer	Physisch	20	100	15	0
142	Todeskuss	Normal	Status	—	75	10	0
143	Himmelsfeger	Flug	Physisch	200	90	5	0
144	Wandler	Normal	Status	—	—	10	0
145	Blubber	Wasser	Spezial	40	100	30	0
146	Irrschlag	Normal	Physisch	70	100	10	0
147	Pilzspore	Pflanze	Status	—	100	15	0
148	Blitz	Normal	Status	—	100	20	0
149	Psywelle	Psycho	Spezial	Variiert	100	15	0
150	Platscher	Normal	Status	—	—	40	0
151	Säurepanzer	Gift	Status	—	—	20	0
152	Krabbhammer	Wasser	Physisch	100	90	10	0
153	Explosion	Normal	Physisch	250	100	5	0
154	Kratzfurie	Normal	Physisch	18	80	15	0
155	Knochmerang	Boden	Physisch	50	90	10	0
156	Erholung	Psycho	Status	—	—	10	0
157	Steinhagel	Gestein	Physisch	75	90	10	0
158	Hyperzahn	Normal	Physisch	80	90	15	0
159	Schärfer	Normal	Status	—	—	30	0
160	Umwandlung	Normal	Status	—	—	30	0
161	Triplette	Normal	Spezial	80	100	10	0
162	Superzahn	Normal	Physisch	Variiert	90	10	0
163	Schlitzer	Normal	Physisch	70	100	20	0
164	Delegator	Normal	Status	—	—	10	0
165	Verzweifler	Normal	Physisch	50	—	1	0
182	Schutzschild	Normal	Status	—	—	10	4
197	Scanner	Kampf	Status	—	—	5	4
201	Sandsturm	Gestein	Status	—	—	10	0
240	Regentanz	Wasser	Status	—	—	5	0
241	Sonnentag	Feuer	Status	—	—	5	0
258	Hagelsturm	Eis	Status	—	—	10	0`;
}

function splitTypes(s) {
    return s.match(/[A-ZÄÖÜ][a-zäöüß]*/g) || [s];
}

function parsePokemonTSV(tsv) {
    const lines = tsv.split('\n');
    const headers = lines[0].split('\t').map(h => h.trim());
    const colMap = {
        'Nr.': 'nr', 'Pokémon': 'name', 'Typ(en)': 'typesRaw', 'KP': 'hp',
        'Ang.': 'atk', 'Vert.': 'def', 'Sp.-A.': 'spa', 'Sp.-V.': 'spd',
        'Init.': 'spe', 'Summe': 'sum'
    };
    const list = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split('\t');
        if (cols.length < headers.length) continue;
        const p = {};
        for (let j = 0; j < headers.length; j++) {
            const prop = colMap[headers[j]];
            if (!prop) continue;
            let val = cols[j] ? cols[j].trim() : '';
            if (prop !== 'name' && prop !== 'typesRaw') {
                val = Number(val);
                if (isNaN(val)) val = 0;
            }
            p[prop] = val;
        }
        if (p.spd === undefined) p.spd = 0;
        p.types = p.typesRaw ? splitTypes(p.typesRaw) : [];
        delete p.typesRaw;
        p.nr = p.nr ? p.nr.toString().padStart(4, '0') : '0000';
        list.push(p);
    }
    return list;
}

function parseMoves(raw) {
    const lines = raw.split('\n'), headers = lines[0].split('\t');
    const moves = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split('\t');
        if (parts.length < headers.length) continue;
        const move = {};
        for (let j = 0; j < headers.length; j++) {
            let val = parts[j] ? parts[j].trim() : '';
            const h = headers[j];
            if (h === 'Genauigkeit in %') {
                if (val === '—' || val === '') val = null;
                else if (val.includes('%')) val = parseInt(val);
                else if (!isNaN(parseFloat(val))) val = parseFloat(val);
                else val = null;
            } else if (h === 'Stärke') {
                if (val === '—' || val === '') val = null;
                else if (val === 'K.O.') val = 'K.O.';
                else if (val.includes('Variiert')) val = val.replace(/\*$/, '');
                else if (!isNaN(parseFloat(val))) val = parseFloat(val);
            } else if (h === 'AP') val = parseInt(val);
            else if (h === 'Priorität') val = parseInt(val) || 0;
            move[h] = val;
        }
        move.Priorität = move.Priorität || 0;
        moves.push(move);
    }
    return moves;
}

// Globale Arrays
window.allPokemon = parsePokemonTSV(getPokemonTsv());
window.allMoves = parseMoves(getMovesTsv());

window.getMoveById = function(id) {
    return window.allMoves.find(m => parseInt(m.ID) === parseInt(id));
};

window.getNormalGifUrl = function(nr) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${parseInt(nr)}.gif`;
};

window.getTypeClass = function(t) {
    const types = {
        normal: 'type-normal', feuer: 'type-feuer', wasser: 'type-wasser', elektro: 'type-elektro',
        pflanze: 'type-pflanze', eis: 'type-eis', kampf: 'type-kampf', gift: 'type-gift', boden: 'type-boden',
        flug: 'type-flug', psycho: 'type-psycho', käfer: 'type-kaefer', gestein: 'type-gestein', geist: 'type-geist',
        drache: 'type-drache', unlicht: 'type-unlicht', stahl: 'type-stahl', fee: 'type-fee'
    };
    return types[t?.toLowerCase()] || 'type-normal';
};

window.getPokemonImageUrl = function(nr) {
    return `https://shinyhunters.com/images/regular/${parseInt(nr)}.gif`;
};

window.getShinyImageUrl = function(nr) {
    return `https://shinyhunters.com/images/shiny/${parseInt(nr)}.gif`;
};

// TM/VM und Tutor-Daten
window.fixedTMVM = new Map();
const officialTM = {
    5: "TM01", 13: "TM02", 86: "TM03", 18: "TM04", 25: "TM05", 92: "TM06", 32: "TM07", 36: "TM08",
    38: "TM09", 24: "TM10", 61: "TM11", 135: "TM12", 58: "TM13", 59: "TM14", 63: "TM15", 16: "TM16", 7: "TM17",
    68: "TM18", 89: "TM19", 146: "TM20", 37: "TM21", 76: "TM22", 82: "TM23", 85: "TM24", 87: "TM25", 89: "TM26",
    90: "TM27", 91: "TM28", 94: "TM29", 122: "TM30", 31: "TM31", 104: "TM32", 115: "TM33", 34: "TM34", 53: "TM35",
    124: "TM36", 28: "TM37", 126: "TM38", 88: "TM39", 65: "TM40", 50: "TM41", 70: "TM42", 103: "TM43", 105: "TM44",
    45: "TM45", 46: "TM46", 12: "TM47", 148: "TM48", 118: "TM49", 153: "TM50"
};
const vmMapping = { 15: "VM01", 19: "VM02", 57: "VM03", 70: "VM04", 85: "VM05", 127: "VM06" };
for (let [id, val] of Object.entries(officialTM)) window.fixedTMVM.set(parseInt(id), val);
for (let [id, val] of Object.entries(vmMapping)) window.fixedTMVM.set(parseInt(id), val);

window.fireRedTutors = {
    7:  { name: 'Feuerschlag', learners: ['Glurak','Arkani','Magmar','Flamara','Mew'] },
    8:  { name: 'Eishieb', learners: ['Turtok','Lapras','Aquana','Mew'] },
    9:  { name: 'Donnerschlag', learners: ['Raichu','Elektek','Blitza','Mew'] },
    14: { name: 'Schwerttanz', learners: ['Bisaflor','Glurak','Sichlor','Pinsir','Mew'] },
    164:{ name: 'Delegator', learners: ['Mewtu','Dragoran','Mew','Relaxo','Arkani','Gengar','Simsala'] },
    104:{ name: 'Doppelteam', learners: ['Mewtu','Dragoran','Mew','Relaxo','Gengar'] },
    105:{ name: 'Genesung', learners: ['Mewtu','Mew','Chaneira','Knuddeluff','Pixi'] },
    135:{ name: 'Weichei', learners: ['Chaneira','Mew'] },
    156:{ name: 'Erholung', learners: ['Mewtu','Dragoran','Mew','Relaxo','Lapras','Gengar'] },
    63: { name: 'Hyperstrahl', learners: ['Mewtu','Dragoran','Mew','Relaxo','Arkani','Garados'] },
    118:{ name: 'Metronom', learners: ['Mew','Pixi','Piepi','Chaneira','Knuddeluff'] },
    134:{ name: 'Psykraft', learners: ['Mewtu','Mew','Simsala','Hypno'] },
    107:{ name: 'Komprimator', learners: ['Mew','Pixi','Chaneira'] },
    28: { name: 'Sandwirbel', learners: ['Digdri','Sandamer','Geowaz','Onix','Rizeros'] },
    148:{ name: 'Blitz', learners: ['Pikachu','Raichu','Voltobal','Lektrobal','Elektek'] },
    182:{ name: 'Schutzschild', learners: ['Mewtu','Mew','Pixi','Piepi','Chaneira','Knuddeluff','Turtok','Bisaflor','Glurak'] },
    240:{ name: 'Regentanz', learners: ['Mew','Lapras','Aquana','Turtok','Garados','Entoron','Golking','Starmie'] },
    241:{ name: 'Sonnentag', learners: ['Mew','Bisaflor','Glurak','Arkani','Vulnona','Magmar','Kokowei'] },
    201:{ name: 'Sandsturm', learners: ['Mew','Geowaz','Onix','Rizeros','Aerodactyl','Sandamer','Digdri'] },
    258:{ name: 'Hagelsturm', learners: ['Mew','Arktos','Lapras','Jugong','Aquana','Rossana'] },
    197:{ name: 'Scanner', learners: ['Mew','Mewtu','Sichlor','Machomei','Kicklee','Nockchan'] }
};

// Effekt-Definitionen
window.getMoveEffect = function(moveId) {
    const id = parseInt(moveId);
    const effects = {
        3: { multiHit: [2,5] }, 4: { multiHit: [2,5] }, 24: { multiHit: [2,2] }, 31: { multiHit: [2,5] },
        42: { multiHit: [2,5] }, 140: { multiHit: [2,5] }, 154: { multiHit: [2,5] },
        12: { ko: true }, 32: { ko: true }, 90: { ko: true },
        7: { secondary: { effect: 'burn', chance:10 } }, 8: { secondary: { effect: 'freeze', chance:10 } },
        9: { secondary: { effect: 'paralyze', chance:10 } }, 34: { secondary: { effect: 'paralyze', chance:30 } },
        44: { secondary: { effect: 'flinch', chance:10 } }, 51: { secondary: { effect: 'defenseDown', chance:10 } },
        52: { secondary: { effect: 'burn', chance:10 } }, 53: { secondary: { effect: 'burn', chance:10 } },
        58: { secondary: { effect: 'freeze', chance:10 } }, 59: { secondary: { effect: 'freeze', chance:10 } },
        60: { secondary: { effect: 'confusion', chance:10 } }, 61: { secondary: { effect: 'speedDown', chance:10 } },
        62: { secondary: { effect: 'attackDown', chance:10 } }, 83: { secondary: { effect: 'burn', chance:10 } },
        84: { secondary: { effect: 'paralyze', chance:10 } }, 85: { secondary: { effect: 'paralyze', chance:10 } },
        87: { secondary: { effect: 'paralyze', chance:30 } }, 93: { secondary: { effect: 'confusion', chance:10 } },
        94: { secondary: { effect: 'specialDown', chance:10 } }, 122: { secondary: { effect: 'paralyze', chance:30 } },
        123: { secondary: { effect: 'poison', chance:40 } }, 124: { secondary: { effect: 'poison', chance:30 } },
        126: { secondary: { effect: 'burn', chance:30 } },
        138: { healPercent:50 }, 71: { healPercent:50 }, 72: { healPercent:50 }, 105: { healPercent:50 },
        135: { healPercent:50 }, 141: { healPercent:50 },
        36: { recoilPercent:25 }, 38: { recoilPercent:25 }, 130: { recoilPercent:33 }, 136: { recoilPercent:33 },
        98: { priority:1 }, 68: { priority:-1 }, 18: { priority:-6 }, 46: { priority:-6 },
        182: { protect:true, priority:4 }, 197: { protect:true, priority:4 },
        14: { statusMove: 'attackUp', target: 'self', stages:2 },
        28: { statusMove: 'accuracyDown', target: 'enemy', stages:1 },
        39: { statusMove: 'defenseDown', target: 'enemy', stages:1 },
        43: { statusMove: 'defenseDown', target: 'enemy', stages:1 },
        45: { statusMove: 'attackDown', target: 'enemy', stages:1 },
        46: { statusMove: 'roar', target: 'enemy' }, 47: { statusMove: 'sleep', target: 'enemy' },
        48: { statusMove: 'confusion', target: 'enemy' }, 50: { statusMove: 'disable', target: 'enemy' },
        54: { statusMove: 'mist', target: 'self' }, 73: { statusMove: 'leechSeed', target: 'enemy' },
        74: { statusMove: 'specialUp', target: 'self', stages:1 }, 77: { statusMove: 'poison', target: 'enemy' },
        78: { statusMove: 'paralyze', target: 'enemy' }, 79: { statusMove: 'sleep', target: 'enemy' },
        81: { statusMove: 'speedDown', target: 'enemy', stages:1 }, 86: { statusMove: 'paralyze', target: 'enemy' },
        92: { statusMove: 'toxic', target: 'enemy' }, 95: { statusMove: 'sleep', target: 'enemy' },
        96: { statusMove: 'attackUp', target: 'self', stages:1 }, 97: { statusMove: 'speedUp', target: 'self', stages:2 },
        100: { statusMove: 'teleport', target: 'self' }, 102: { statusMove: 'mimic', target: 'enemy' },
        103: { statusMove: 'defenseDown', target: 'enemy', stages:1 },
        104: { statusMove: 'evasionUp', target: 'self', stages:1 },
        106: { statusMove: 'defenseUp', target: 'self', stages:1 },
        107: { statusMove: 'evasionUp', target: 'self', stages:2 },
        108: { statusMove: 'accuracyDown', target: 'enemy', stages:1 },
        109: { statusMove: 'confusion', target: 'enemy' }, 110: { statusMove: 'defenseUp', target: 'self', stages:1 },
        111: { statusMove: 'defenseUp', target: 'self', stages:1 }, 112: { statusMove: 'defenseUp', target: 'self', stages:2 },
        113: { statusMove: 'lightScreen', target: 'self' }, 114: { statusMove: 'haze', target: 'field' },
        115: { statusMove: 'reflect', target: 'self' }, 116: { statusMove: 'criticalUp', target: 'self' },
        118: { statusMove: 'metronome', target: 'self' }, 119: { statusMove: 'mirrorMove', target: 'self' },
        133: { statusMove: 'specialUp', target: 'self', stages:2 },
        134: { statusMove: 'accuracyDown', target: 'enemy', stages:1 },
        137: { statusMove: 'paralyze', target: 'enemy' }, 139: { statusMove: 'poison', target: 'enemy' },
        142: { statusMove: 'sleep', target: 'enemy' }, 147: { statusMove: 'sleep', target: 'enemy' },
        148: { statusMove: 'accuracyDown', target: 'enemy', stages:1 }, 150: { statusMove: 'splash', target: 'self' },
        151: { statusMove: 'defenseUp', target: 'self', stages:2 },
        156: { statusMove: 'heal', target: 'self', healStatus: true },
        159: { statusMove: 'attackUp', target: 'self', stages:1 },
        160: { statusMove: 'conversion', target: 'self' }, 164: { statusMove: 'substitute', target: 'self' },
        20: { bind:true }, 35: { bind:true }, 83: { bind:true }, 128: { bind:true }, 132: { bind:true },
        144: { statusMove: 'transform', target: 'self' },
        201: { statusMove: 'sandstorm', target: 'field' }, 240: { statusMove: 'raindance', target: 'field' },
        241: { statusMove: 'sunnyday', target: 'field' }, 258: { statusMove: 'hail', target: 'field' }
    };
    return effects[id] || null;
};

window.getMoveDescription = function(move) {
    const id = parseInt(move.ID);
    const cat = (move.Kategorie || '').toLowerCase();
    const power = move.Stärke;
    const eff = window.getMoveEffect(id);
    if (eff) {
        if (eff.ko) return 'K.O.-Attacke – besiegt das Ziel bei Erfolg sofort.';
        if (eff.multiHit) return `Greift ${eff.multiHit[0]}- bis ${eff.multiHit[1]}-mal in einer Runde an.`;
        if (eff.bind) return 'Hält das Ziel fest und verursacht über mehrere Runden Schaden.';
        if (eff.recoilPercent) return `Verursacht Rückstoß-Schaden (${eff.recoilPercent}% des angerichteten Schadens).`;
        if (eff.healPercent) {
            const h = eff.healPercent;
            if (id === 71 || id === 72 || id === 141) return `Saugt dem Ziel KP ab und heilt den Anwender um ${h}% des Schadens.`;
            if (id === 138) return 'Funktioniert nur bei schlafenden Zielen – heilt Anwender um 50% des Schadens.';
            return `Heilt den Anwender um ${h}% des angerichteten Schadens.`;
        }
        if (eff.priority > 0) return `Erhöhte Priorität (+${eff.priority}) – schlägt fast immer zuerst zu.`;
        if (eff.priority < 0) return `Verringerte Priorität (${eff.priority}) – schlägt fast immer zuletzt zu.`;
        if (eff.protect) return 'Schützt den Anwender vollständig vor allen Attacken dieser Runde.';
        if (eff.statusMove) {
            const s = eff.statusMove;
            if (s === 'protect') return 'Schützt den Anwender vollständig vor allen Attacken dieser Runde.';
            if (s === 'substitute') return 'Erzeugt einen Delegator mit 25% der max. KP, der Schaden absorbiert.';
            if (s === 'heal') {
                if (eff.healStatus) return 'Stellt alle KP und Status wieder her. Anwender schläft danach 2 Runden.';
                return 'Heilt den Anwender um 50% der maximalen KP.';
            }
            if (s === 'roar') return 'Zwingt das gegnerische Pokémon zum Austausch / beendet den Kampf.';
            if (s === 'teleport') return 'Beendet den Kampf sofort (Flucht).';
            if (s === 'transform') return 'Verwandelt sich vollständig in das gegnerische Pokémon.';
            if (s === 'conversion') return 'Ändert den eigenen Typ in den Typ einer zufälligen eigenen Attacke.';
            if (s === 'mimic') return 'Kopiert eine zufällige Attacke des Gegners temporär.';
            if (s === 'disable') return 'Deaktiviert die zuletzt eingesetzte Attacke des Gegners für 2–5 Runden.';
            if (s === 'leechSeed') return 'Pflanzt Egelsamen – entzieht dem Ziel jede Runde 1/8 KP.';
            if (s === 'mist') return 'Verhindert 5 Runden lang Status-Senkungen des eigenen Teams.';
            if (s === 'lightScreen') return 'Halbiert 5 Runden lang den erlittenen Spezial-Schaden.';
            if (s === 'reflect') return 'Halbiert 5 Runden lang den erlittenen physischen Schaden.';
            if (s === 'haze') return 'Setzt alle Statusänderungen beider Pokémon auf 0 zurück.';
            if (s === 'metronome') return 'Wählt eine zufällige (wählbare) Schadens-Attacke aus.';
            if (s === 'mirrorMove') return 'Kontert mit der zuletzt vom Gegner eingesetzten Schadens-Attacke.';
            if (s === 'sandstorm') return 'Löst 5 Runden Sandsturm aus – schädigt Nicht-Gestein/Boden/Stahl Pokémon.';
            if (s === 'raindance') return 'Löst 5 Runden Regen aus – verstärkt Wasser, schwächt Feuer.';
            if (s === 'sunnyday') return 'Löst 5 Runden Sonne aus – verstärkt Feuer, schwächt Wasser.';
            if (s === 'hail') return 'Löst 5 Runden Hagel aus – schädigt alle Nicht-Eis Pokémon.';
            if (s === 'splash') return 'Tut nichts. Wirklich gar nichts.';
            if (s === 'criticalUp') return 'Erhöht die Volltreffer-Chance des Anwenders auf 25%.';
            if (s === 'sleep') return 'Versetzt das Ziel in Schlaf für 1–4 Runden.';
            if (s === 'paralyze') return 'Paralysiert das Ziel (25% Aussetzer, Initiative ×¼).';
            if (s === 'poison') return 'Vergiftet das Ziel (1/8 KP-Verlust pro Runde).';
            if (s === 'toxic') return 'Vergiftet das Ziel schwer – Schaden steigt jede Runde (1/16 → 2/16 → …).';
            if (s === 'burn') return 'Verursacht Verbrennung (1/16 KP-Verlust, Angriff ×½).';
            if (s === 'freeze') return 'Friert das Ziel ein (kann nicht angreifen, taut selten auf).';
            if (s === 'confusion') return 'Verwirrt das Ziel – 50% Chance sich selbst zu verletzen.';
            if (s === 'attackUp') return `Erhöht Angriff um ${eff.stages||1} Stufe(n).`;
            if (s === 'attackDown') return `Senkt Angriff des Ziels um ${Math.abs(eff.stages||1)} Stufe(n).`;
            if (s === 'defenseUp') return `Erhöht Verteidigung um ${eff.stages||1} Stufe(n).`;
            if (s === 'defenseDown') return `Senkt Verteidigung des Ziels um ${Math.abs(eff.stages||1)} Stufe(n).`;
            if (s === 'speedUp') return `Erhöht Initiative um ${eff.stages||1} Stufe(n).`;
            if (s === 'speedDown') return `Senkt Initiative des Ziels um ${Math.abs(eff.stages||1)} Stufe(n).`;
            if (s === 'specialUp') return `Erhöht Spezial um ${eff.stages||1} Stufe(n).`;
            if (s === 'specialDown') return `Senkt Spezial des Ziels um ${Math.abs(eff.stages||1)} Stufe(n).`;
            if (s === 'accuracyDown') return `Senkt Genauigkeit des Ziels um ${Math.abs(eff.stages||1)} Stufe(n).`;
            if (s === 'evasionUp') return `Erhöht den Fluchtwert um ${eff.stages||1} Stufe(n).`;
        }
        if (eff.secondary) {
            const sec = eff.secondary;
            const effText = { burn:'Verbrennung', paralyze:'Paralyse', poison:'Vergiftung', freeze:'Einfrieren',
                flinch:'Zurückschrecken', confusion:'Verwirrung', defenseDown:'Vert.↓',
                attackDown:'Ang.↓', speedDown:'Init.↓', specialDown:'Spez.↓' };
            return `${sec.chance}% Chance: ${effText[sec.effect] || sec.effect}.`;
        }
    }
    if (cat === 'physisch' || cat === 'spezial') {
        if (power === 'K.O.') return 'K.O.-Attacke – besiegt das Ziel bei Erfolg sofort.';
        if (typeof power === 'string' && power.includes('Variiert')) {
            if (power.includes('Gewicht')) return 'Schaden variiert je nach Gewicht des Ziels.';
            if (power.includes('Level')) return 'Schaden entspricht dem Level des Anwenders.';
            if (power.includes('Superzahn')) return 'Reduziert die aktuellen KP des Ziels um 50%.';
            return 'Schaden variiert je nach Situation.';
        }
        if (typeof power === 'string' && power.includes('KP')) return `Verursacht festen Schaden von ${power}.`;
        if (id === 49) return 'Verursacht 20 KP Schaden, unabhängig von Typen und Statuswerten.';
        if (id === 82) return 'Verursacht immer genau 40 KP Schaden.';
        if (id === 101) return 'Verursacht Schaden in Höhe des Anwender-Levels.';
        if (id === 149) return 'Variabler Psycho-Schaden (20–100).';
        return 'Standard-Schadensattacke ohne Zusatzeffekt.';
    }
    return 'Status-Attacke – Effekt siehe Spiel.';
};

window.getAccuracyForMove = function(move) {
    const acc = move['Genauigkeit in %'];
    if (acc === null || acc === undefined) return '— (immer)';
    if (typeof acc === 'number') return acc + '%';
    return acc || '— (immer)';
};

// ---------------------- Items Daten ----------------------
window.itemApiMap = {
    "Pokéball": "poke-ball",
    "Superball": "great-ball",
    "Hyperball": "ultra-ball",
    "Meisterball": "master-ball",
    "Amrenabeere (Aguav Berry)": "aguav-berry",
    "Apikobeere (Apicot Berry)": "apicot-berry",
    "Fragiabeere (Aspear Berry)": "aspear-berry",
    "Prunusbeere (Cheri Berry)": "cheri-berry",
    "Maronbeere (Chesto Berry)": "chesto-berry",
    "Enigmabeere (Enigma Berry)": "enigma-berry",
    "Figybeere (Figy Berry)": "figy-berry",
    "Ganlobeere (Ganlon Berry)": "ganlon-berry",
    "Yapabeere (Iapapa Berry)": "iapapa-berry",
    "Lansatbeere (Lansat Berry)": "lansat-berry",
    "Leppabeere (Leppa Berry)": "leppa-berry",
    "Lydzibeere (Liechi Berry)": "liechi-berry",
    "Prunibeere (Lum Berry)": "lum-berry",
    "Magobeere (Mago Berry)": "mago-berry",
    "Orangbeere (Oran Berry)": "oran-berry",
    "Pirsifbeere (Pecha Berry)": "pecha-berry",
    "Persimbeere (Persim Berry)": "persim-berry",
    "Petayabeere (Petaya Berry)": "petaya-berry",
    "Tsitrubeere (Rawst Berry)": "rawst-berry",
    "Sananabeere (Razz Berry)": "razz-berry",
    "Sinelbeere (Sitrus Berry)": "sitrus-berry",
    "Sternfbeere (Starf Berry)": "starf-berry",
    "Wikibeere (Wiki Berry)": "wiki-berry",
    "Schwarzgurt": "black-belt",
    "Schwarze Brille": "black-glasses",
    "Blendpuder": "bright-powder",
    "Holzkohle": "charcoal",
    "Fokusband": "focus-band",
    "Überreste": "leftovers",
    "Glücks-Ei": "lucky-egg",
    "Magnet": "magnet",
    "Mentalkraut": "mental-herb",
    "Metallmantel": "metal-coat",
    "Wunderkern": "miracle-seed",
    "Mystikwasser": "mystic-water",
    "Niemals-Eis": "never-melt-ice",
    "Giftstich": "poison-barb",
    "Schnellklaue": "quick-claw",
    "Scope-Linse": "scope-lens",
    "Seegesang": "sea-incense",
    "Spitzschnabel": "sharp-beak",
    "Muschelglocke": "shell-bell",
    "Seidenschal": "silk-scarf",
    "Silberstaub": "silver-powder",
    "Weicher Sand": "soft-sand",
    "Sanftglocke": "soothe-bell",
    "Spuktafel": "spell-tag",
    "Zauberlöffel": "twisted-spoon",
    "Weißkraut": "white-herb"
};

window.getItemSpriteUrl = function(itemName) {
    const apiName = window.itemApiMap[itemName];
    if (apiName) {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${apiName}.png`;
    }
    return '';
};

window.allItems = [
    { name: "Pokéball", category: "Pokébälle", desc: "Standardball zum Fangen wilder Pokémon." },
    { name: "Superball", category: "Pokébälle", desc: "Ball mit höherer Fangrate als ein Pokéball." },
    { name: "Hyperball", category: "Pokébälle", desc: "Ball mit höherer Fangrate als ein Superball." },
    { name: "Meisterball", category: "Pokébälle", desc: "Fängt jedes wilde Pokémon garantiert." },
    { name: "Amrenabeere (Aguav Berry)", category: "Beeren", desc: "Stellt KP in einer Notsituation wieder her, kann aber Verwirrung verursachen." },
    { name: "Apikobeere (Apicot Berry)", category: "Beeren", desc: "Erhöht die Spezial-Verteidigung bei niedrigen KP." },
    { name: "Fragiabeere (Aspear Berry)", category: "Beeren", desc: "Heilt Vereisung." },
    { name: "Prunusbeere (Cheri Berry)", category: "Beeren", desc: "Heilt Paralyse." },
    { name: "Maronbeere (Chesto Berry)", category: "Beeren", desc: "Heilt Schlaf." },
    { name: "Enigmabeere (Enigma Berry)", category: "Beeren", desc: "Stellt KP nach einem sehr effektiven Treffer wieder her." },
    { name: "Figybeere (Figy Berry)", category: "Beeren", desc: "Stellt KP in einer Notsituation wieder her, kann aber Verwirrung verursachen." },
    { name: "Ganlobeere (Ganlon Berry)", category: "Beeren", desc: "Erhöht die Verteidigung bei niedrigen KP." },
    { name: "Yapabeere (Iapapa Berry)", category: "Beeren", desc: "Stellt KP in einer Notsituation wieder her, kann aber Verwirrung verursachen." },
    { name: "Lansatbeere (Lansat Berry)", category: "Beeren", desc: "Erhöht Volltrefferquote bei niedrigen KP." },
    { name: "Leppabeere (Leppa Berry)", category: "Beeren", desc: "Stellt 10 AP einer Attacke wieder her." },
    { name: "Lydzibeere (Liechi Berry)", category: "Beeren", desc: "Erhöht Angriff bei niedrigen KP." },
    { name: "Prunibeere (Lum Berry)", category: "Beeren", desc: "Heilt jede Statusveränderung." },
    { name: "Magobeere (Mago Berry)", category: "Beeren", desc: "Stellt KP in einer Notsituation wieder her, kann aber Verwirrung verursachen." },
    { name: "Orangbeere (Oran Berry)", category: "Beeren", desc: "Stellt 10 KP wieder her." },
    { name: "Pirsifbeere (Pecha Berry)", category: "Beeren", desc: "Heilt Vergiftung." },
    { name: "Persimbeere (Persim Berry)", category: "Beeren", desc: "Heilt Verwirrung." },
    { name: "Petayabeere (Petaya Berry)", category: "Beeren", desc: "Erhöht Spezial-Angriff bei niedrigen KP." },
    { name: "Tsitrubeere (Rawst Berry)", category: "Beeren", desc: "Heilt Verbrennung." },
    { name: "Sananabeere (Razz Berry)", category: "Beeren", desc: "Seltene Kochbeere." },
    { name: "Sinelbeere (Sitrus Berry)", category: "Beeren", desc: "Stellt KP wieder her." },
    { name: "Sternfbeere (Starf Berry)", category: "Beeren", desc: "Erhöht zufällig einen Wert stark bei niedrigen KP." },
    { name: "Wikibeere (Wiki Berry)", category: "Beeren", desc: "Stellt KP in einer Notsituation wieder her, kann aber Verwirrung verursachen." },
    { name: "Schwarzgurt", category: "Getragene Items", desc: "Verstärkt Kampf-Attacken." },
    { name: "Schwarze Brille", category: "Getragene Items", desc: "Verstärkt Unlicht-Attacken." },
    { name: "Blendpuder", category: "Getragene Items", desc: "Senkt die Trefferquote des Gegners." },
    { name: "Holzkohle", category: "Getragene Items", desc: "Verstärkt Feuer-Attacken." },
    { name: "Fokusband", category: "Getragene Items", desc: "Kann ein Pokémon mit 1 KP überleben lassen." },
    { name: "Überreste", category: "Getragene Items", desc: "Stellt jede Runde KP wieder her." },
    { name: "Glücks-Ei", category: "Getragene Items", desc: "Erhöht erhaltene Erfahrungspunkte." },
    { name: "Magnet", category: "Getragene Items", desc: "Verstärkt Elektro-Attacken." },
    { name: "Mentalkraut", category: "Getragene Items", desc: "Heilt Verliebtheit einmalig." },
    { name: "Metallmantel", category: "Getragene Items", desc: "Verstärkt Stahl-Attacken." },
    { name: "Wunderkern", category: "Getragene Items", desc: "Verstärkt Pflanzen-Attacken." },
    { name: "Mystikwasser", category: "Getragene Items", desc: "Verstärkt Wasser-Attacken." },
    { name: "Niemals-Eis", category: "Getragene Items", desc: "Verstärkt Eis-Attacken." },
    { name: "Giftstich", category: "Getragene Items", desc: "Verstärkt Gift-Attacken." },
    { name: "Schnellklaue", category: "Getragene Items", desc: "Ermöglicht gelegentlich den Erstschlag." },
    { name: "Scope-Linse", category: "Getragene Items", desc: "Erhöht die Volltrefferquote." },
    { name: "Seegesang", category: "Getragene Items", desc: "Verstärkt Wasser-Attacken leicht." },
    { name: "Spitzschnabel", category: "Getragene Items", desc: "Verstärkt Flug-Attacken." },
    { name: "Muschelglocke", category: "Getragene Items", desc: "Stellt KP nach verursachtem Schaden wieder her." },
    { name: "Seidenschal", category: "Getragene Items", desc: "Verstärkt Normal-Attacken." },
    { name: "Silberstaub", category: "Getragene Items", desc: "Verstärkt Käfer-Attacken." },
    { name: "Weicher Sand", category: "Getragene Items", desc: "Verstärkt Boden-Attacken." },
    { name: "Sanftglocke", category: "Getragene Items", desc: "Erhöht den Freundschaftsgewinn." },
    { name: "Spuktafel", category: "Getragene Items", desc: "Verstärkt Geist-Attacken." },
    { name: "Zauberlöffel", category: "Getragene Items", desc: "Verstärkt Psycho-Attacken." },
    { name: "Weißkraut", category: "Getragene Items", desc: "Stellt gesenkte Statuswerte einmalig wieder her." }
];