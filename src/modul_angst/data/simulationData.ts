import { SimScene } from '../types';

export const initialSimState = {
  trust: 50, // 0 - 100
  stress: 85, // 0 - 100
  vitals: {
    hr: 112,
    bpSys: 155,
    bpDia: 95,
    resp: 24,
    sweat: 'Stark klamm / schweißnass' as const,
    pupils: 'Leicht geweitet' as const
  }
};

export const simScenes: Record<string, SimScene> = {
  start: {
    id: 'start',
    title: 'Szene 1: Die Begegnung im Patientenzimmer',
    location: 'Chirurgische Station 3B, Zimmer 14',
    time: '06:45 Uhr (OP-Abruf geplant für 08:15 Uhr)',
    patientQuote: '„Guten Morgen... Ich habe seit Stunden kein Auge zugetan. Mein Herz hämmert und mir ist ganz elend zumute...“',
    situationText: 'Sie betreten das Zimmer von Frau Meinhardt (67 J., geplante Cholezystektomie). Sie sitzt mit gekrümmtem Rücken im Bett, umklammert die Bettdecke und zittert sichtlich. Der Stationsflur draußen ist laut.',
    vitals: {
      hr: 114,
      bpSys: 158,
      bpDia: 96,
      resp: 25,
      sweat: 'Stark klamm / schweißnass',
      pupils: 'Leicht geweitet'
    },
    recommendedKitAction: 'Kommunikation & Sicherheit',
    choices: [
      {
        id: 'c1_bad',
        text: '„Frau Meinhardt, stellen Sie sich nicht so an. Eine Gallenblasen-OP ist heute ein minimal-invasiver Routineeingriff. Da passiert schon nichts.“',
        nextSceneId: 'escalated_bagatell',
        feedback: 'Kardinalfehler: Bagatellisierung! Die Patientin fühlt sich nicht ernst genommen und beschämt. Ihr Sympathikus reagiert mit verstärkter Alarmbereitschaft.',
        type: 'critical',
        trustChange: -25,
        stressChange: +15,
        vitalsEffect: { hr: 126, bpSys: 170, bpDia: 102, resp: 28, sweat: 'Stark klamm / schweißnass' }
      },
      {
        id: 'c1_good',
        text: 'Einen Stuhl heranholen, sich auf Augenhöhe setzen, Zimmertür anlehnen und ruhig sagen: „Frau Meinhardt, ich sehe, wie sehr Sie das mitnimmt. Das ist völlig verständlich vor so einer OP. Ich bin heute für Sie da und begleite Sie Schritt für Schritt.“',
        nextSceneId: 'room_calm',
        feedback: 'Hervorragend! Blickkontakt auf Augenhöhe, Validierung der Gefühle und die Zusicherung einer festen Bezugsperson aktivieren frontale Hemmmechanismen auf die Amygdala.',
        type: 'optimal',
        trustChange: +25,
        stressChange: -25,
        vitalsEffect: { hr: 98, bpSys: 142, bpDia: 88, resp: 20, sweat: 'Leicht feucht' }
      },
      {
        id: 'c1_neutral',
        text: 'Wortkarg die Blutdruckmanschette anlegen, Puls messen und sagen: „Wir müssen jetzt schnell die Vitalwerte vor der Schleuse erfassen, sonst gibt es Ärger mit dem OP.“',
        nextSceneId: 'room_neutral',
        feedback: 'Zu unpersönlich und zeiterzeugend. Der Zeitdruck überträgt sich direkt auf die vegetative Stressreaktion der Patientin.',
        type: 'acceptable',
        trustChange: -5,
        stressChange: +5,
        vitalsEffect: { hr: 118, bpSys: 160, bpDia: 98, resp: 26, sweat: 'Stark klamm / schweißnass' }
      }
    ]
  },

  escalated_bagatell: {
    id: 'escalated_bagatell',
    title: 'Szene 2a: Eskalierte Anspannung & Kältezittern',
    location: 'Chirurgische Station 3B, Zimmer 14',
    time: '07:05 Uhr',
    patientQuote: '„Für Sie mag das Routine sein! Aber ich liege hier auf dem Tisch! Mir ist eiskalt und ich bekomme kaum noch Luft...“',
    situationText: 'Frau Meinhardt zieht die Knie an. Ihre Zähne klappern. Durch die massive sympathische Vasokonstriktion friert sie erbärmlich. Ihre Hände sind eiskalt und schweißfeucht.',
    vitals: {
      hr: 124,
      bpSys: 168,
      bpDia: 100,
      resp: 28,
      sweat: 'Stark klamm / schweißnass',
      pupils: 'Stark geweitet (Mydriasis)'
    },
    recommendedKitAction: 'Körperlich / Thermisch & Deeskalation',
    choices: [
      {
        id: 'c2_kirschkern',
        text: 'Schnell in die Stationsküche laufen, ein altes Kirschkernkissen 3 Minuten in die Mikrowelle legen und ihr auf den Bauch packen.',
        nextSceneId: 'fumble_kirsch',
        feedback: 'Gefährlicher Pflegefehler! Kirschkernkissen sind im Krankenhaus wegen Keimverschleppung unzulässig und bergen akute Verbrennungsgefahr bei ungleicher Hitzeverteilung.',
        type: 'critical',
        trustChange: -30,
        stressChange: +10,
        vitalsEffect: { hr: 130, bpSys: 172, bpDia: 104, resp: 29 }
      },
      {
        id: 'c2_warmdecke',
        text: 'Sich entschuldigen („Es tut mir leid, das war unsensibel von mir“), eine vorgewärmte Decke aus dem Wärmeschrank holen, sie einhüllen und zur gemeinsamen 4-Sekunden-Ein- und 6-Sekunden-Ausatmung anleiten.',
        nextSceneId: 'room_calm',
        feedback: 'Großartige Wende! Professionelle Fehlerkultur (Selbstkorrektur), die Wärme der Spezialdecke und die Vagus-Reizung durch langes Ausatmen fangen die Patientin auf.',
        type: 'optimal',
        trustChange: +35,
        stressChange: -30,
        vitalsEffect: { hr: 96, bpSys: 140, bpDia: 88, resp: 19, sweat: 'Leicht feucht' }
      }
    ]
  },

  fumble_kirsch: {
    id: 'fumble_kirsch',
    title: 'Kritischer Zwischenfall: Verbrennungsgefahr abgewendet',
    location: 'Chirurgische Station 3B',
    time: '07:15 Uhr',
    patientQuote: '„Aua! Das Kissen brennt ja wie Feuer auf meiner Haut!“',
    situationText: 'Die Schichtleitung kommt hinzu, entfernt sofort das unzulässige Kirschkernkissen und erinnert Sie an die Hygiene- und Sicherheitsstandards. Frau Meinhardt ist zutiefst verunsichert.',
    vitals: {
      hr: 128,
      bpSys: 175,
      bpDia: 105,
      resp: 29,
      sweat: 'Stark klamm / schweißnass',
      pupils: 'Stark geweitet (Mydriasis)'
    },
    choices: [
      {
        id: 'c_recover',
        text: 'Sofort Kissen entfernen, Haut kühlen, ruhigen Klinikstandard (vorgewärmte Baumwolldecke) anwenden und sich voll auf die emotionale Stabilisierung konzentrieren.',
        nextSceneId: 'distraction_phase',
        feedback: 'Gerade noch abgefangen. Jetzt muss jede weitere pflegerische Maßnahme sitzen, um die Patientin transportfähig zu machen.',
        type: 'acceptable',
        trustChange: +15,
        stressChange: -15,
        vitalsEffect: { hr: 108, bpSys: 152, bpDia: 94, resp: 23, sweat: 'Leicht feucht' }
      }
    ]
  },

  room_neutral: {
    id: 'room_neutral',
    title: 'Szene 2b: Routine ohne Herz',
    location: 'Station 3B',
    time: '07:10 Uhr',
    patientQuote: '„Muss das alles so schnell gehen? Ich fühle mich wie auf einem Fließband...“',
    situationText: 'Die Messwerte sind protokolliert, aber Frau Meinhardts innere Alarmglocken schrillen weiter. Sie zupft nervös am Bettlaken.',
    vitals: {
      hr: 112,
      bpSys: 152,
      bpDia: 94,
      resp: 24,
      sweat: 'Leicht feucht',
      pupils: 'Leicht geweitet'
    },
    choices: [
      {
        id: 'c_turn_warm',
        text: 'Innehalten: Messgeräte beiseite legen, vorgewärmte Decke bringen und nach ihren konkreten Sorgen fragen („Was macht Ihnen für heute am meisten Bauchschmerzen?“).',
        nextSceneId: 'room_calm',
        feedback: 'Sehr gut nachjustiert! Das Erfragen konkreter Sorgen hilft, diffuse Angst in besprechbare Punkte zu transformieren.',
        type: 'optimal',
        trustChange: +25,
        stressChange: -20,
        vitalsEffect: { hr: 92, bpSys: 138, bpDia: 86, resp: 18 }
      },
      {
        id: 'c_push_forward',
        text: 'Weiter im Plan: Sofort das OP-Hemd hinlegen und anordnen: „Ziehen Sie sich schon mal aus und legen Sie den Schmuck ab.“',
        nextSceneId: 'distraction_phase',
        feedback: 'Sehr forsch. Patientin kooperiert nur mechanisch, der Stresspegel bleibt subklinisch bedrohlich hoch.',
        type: 'acceptable',
        trustChange: 0,
        stressChange: +5,
        vitalsEffect: { hr: 115, bpSys: 155, bpDia: 96, resp: 25 }
      }
    ]
  },

  room_calm: {
    id: 'room_calm',
    title: 'Szene 3: Fokussierte Ablenkung & Ressourcen',
    location: 'Zimmer 14',
    time: '07:20 Uhr',
    patientQuote: '„Danke für die warme Decke, das Zittern lässt etwas nach... Aber diese Warterei macht mich verrückt. Meine Gedanken drehen sich nur noch im Kreis.“',
    situationText: 'Frau Meinhardt entspannt sich sichtlich unter der Wärmedecke. Es bleiben noch 40 Minuten bis zur Prämedikation. Sie braucht eine sinnvolle kognitive Entlastung.',
    vitals: {
      hr: 90,
      bpSys: 136,
      bpDia: 85,
      resp: 18,
      sweat: 'Trocken',
      pupils: 'Normal'
    },
    recommendedKitAction: 'Ablenkung & Angehörige',
    choices: [
      {
        id: 'c3_audio',
        text: 'Ihr Smartphone und Kopfhörer reichen und vorschlagen, einen Lieblings-Podcast oder beruhigende Musik zu hören; alternativ nach Hobbys/Haustieren fragen.',
        nextSceneId: 'premed_phase',
        feedback: 'Perfekt! Auditive Fokussierung über Kopfhörer blendet Stationsgeräusche aus und unterbricht das kognitive Grübeln („Default Mode Network“).',
        type: 'optimal',
        trustChange: +20,
        stressChange: -20,
        vitalsEffect: { hr: 78, bpSys: 126, bpDia: 80, resp: 16 }
      },
      {
        id: 'c3_panic_call',
        text: 'Ihre Tochter anrufen, die schon am Vortag völlig aufgelöst war, und ihr das Telefon ans Ohr halten.',
        nextSceneId: 'premed_phase',
        feedback: 'Falsche Ressourcennutzung! Die aufgelöste Tochter überträgt ihre Panik am Telefon auf die Mutter („Mama, ich hab solche Angst um dich!“). Der Puls steigt wieder.',
        type: 'critical',
        trustChange: -15,
        stressChange: +25,
        vitalsEffect: { hr: 108, bpSys: 154, bpDia: 95, resp: 24, sweat: 'Leicht feucht' }
      },
      {
        id: 'c3_pmr',
        text: 'Kurz die progressive Muskelentspannung (PMR nach Jacobson) für Hände und Schultern anleiten: 5 Sekunden kräftig Faust ballen, dann ganz bewusst loslassen.',
        nextSceneId: 'premed_phase',
        feedback: 'Sehr gut! PMR ist wissenschaftlich fundiert und hilft der Patientin, körperliche Anspannung aktiv zu senken.',
        type: 'optimal',
        trustChange: +18,
        stressChange: -18,
        vitalsEffect: { hr: 80, bpSys: 128, bpDia: 82, resp: 16 }
      }
    ]
  },

  distraction_phase: {
    id: 'distraction_phase',
    title: 'Szene 3b: Wartezeit strukturieren',
    location: 'Zimmer 14',
    time: '07:25 Uhr',
    patientQuote: '„Ich weiß einfach nicht, wie ich die nächste halbe Stunde überstehen soll...“',
    situationText: 'Frau Meinhardt ist zwar versorgt, aber die Zeit bis zum Abruf zerrt an den Nerven.',
    vitals: {
      hr: 104,
      bpSys: 148,
      bpDia: 92,
      resp: 22,
      sweat: 'Leicht feucht',
      pupils: 'Leicht geweitet'
    },
    choices: [
      {
        id: 'c_distract_media',
        text: 'Kopfhörer anbieten, ruhige Radiomusik einschalten und sie bitten, die Augen zu schließen und auf ihren gleichmäßigen Atem zu achten.',
        nextSceneId: 'premed_phase',
        feedback: 'Sehr gut gelöst! Reizreduktion und ruhige Musik stabilisieren den Kreislauf.',
        type: 'optimal',
        trustChange: +15,
        stressChange: -15,
        vitalsEffect: { hr: 84, bpSys: 132, bpDia: 84, resp: 17 }
      },
      {
        id: 'c_walk',
        text: 'Sie zu einem kleinen, 10-minütigen Spaziergang über den ruhigen Stationsbalkon einladen (da sie noch keine Prämedikation erhalten hat).',
        nextSceneId: 'premed_phase',
        feedback: 'Ausgezeichnet! Bewegung baut motorische Unruhe ab. Da noch keine Sedativa gegeben wurden, ist das risikoarm möglich.',
        type: 'optimal',
        trustChange: +15,
        stressChange: -15,
        vitalsEffect: { hr: 86, bpSys: 130, bpDia: 82, resp: 18 }
      }
    ]
  },

  premed_phase: {
    id: 'premed_phase',
    title: 'Szene 4: Die medikamentöse Prämedikation (45 Min vor OP)',
    location: 'Zimmer 14',
    time: '07:30 Uhr (genau 45 Minuten vor OP-Abruf)',
    patientQuote: '„Ist das die Beruhigungstablette, von der der Narkosearzt sprach?“',
    situationText: 'Die ärztliche Anordnung lautet: Midazolam 7,5 mg p.o. zur Anxiolyse ca. 45 Min. vor OP. Jetzt ist das optimale Zeitfenster gekommen.',
    vitals: {
      hr: 82,
      bpSys: 130,
      bpDia: 82,
      resp: 16,
      sweat: 'Trocken',
      pupils: 'Normal'
    },
    recommendedKitAction: 'Prämedikation & Sicherheit',
    choices: [
      {
        id: 'c4_perfect',
        text: 'Frau Meinhardt bitten, vorher nochmals die Toilette aufzusuchen. Dann die Tablette mit einem minimalen Schluck Wasser geben, Bettgitter nach Einverständnis sichern, Klingel in die Hand geben und einschärfen: „Ab jetzt bitte nicht mehr alleine aufstehen!“',
        nextSceneId: 'transfer_gate',
        feedback: 'Vorbildlich nach Fachstandard! Blasenentleerung vorab, Einnahme mit Minimalschluck (Nüchternheit!), Bettgittersicherung und Sturzprophylaxe.',
        type: 'optimal',
        trustChange: +20,
        stressChange: -15,
        vitalsEffect: { hr: 72, bpSys: 122, bpDia: 78, resp: 14 }
      },
      {
        id: 'c4_careless',
        text: 'Tablette mit einem vollen Becher Wasser hinreichen und sagen: „Nehmen Sie die schnell. Wenn Sie noch zur Toilette müssen, können Sie ja gleich noch rübergehen.“',
        nextSceneId: 'transfer_gate',
        feedback: 'Schwerer Sicherheitsmangel! Zu viel Wasser gefährdet die Aspirationskarenz. Nach Benzodiazepineinnahme besteht höchste Sturzgefahr!',
        type: 'critical',
        trustChange: -20,
        stressChange: +10,
        vitalsEffect: { hr: 94, bpSys: 144, bpDia: 90, resp: 20 }
      }
    ]
  },

  transfer_gate: {
    id: 'transfer_gate',
    title: 'Szene 5: Transport & Übergabe an die OP-Schleuse',
    location: 'Übergaberaum vor der OP-Schleuse',
    time: '08:15 Uhr (Abruf durch den OP-Saal)',
    patientQuote: '„Ich bin schläfrig, aber ich habe keine Panik mehr. Danke, dass Sie mitgekommen sind...“',
    situationText: 'Der Transportdienst bringt Frau Meinhardt im Bett zur OP-Schleuse. Die Anästhesiepflegekraft wartet zur Übergabe.',
    vitals: {
      hr: 74,
      bpSys: 124,
      bpDia: 78,
      resp: 15,
      sweat: 'Trocken',
      pupils: 'Normal'
    },
    recommendedKitAction: 'ISBAR & Übergabe',
    choices: [
      {
        id: 'c5_isbar',
        text: 'Strukturierte Übergabe nach ISBAR an die Anästhesiepflege: Identität geprüft, Cholezystektomie, Prämedikation pünktlich um 07:30 Uhr, Ängste durch Decke und Gespräch deeskaliert, Vitalwerte stabil. Verabschiedung mit Händedruck.',
        nextSceneId: 'success_end',
        feedback: 'Herausragende interprofessionelle Übergabe! Frau Meinhardt fühlt sich bis zur letzten Sekunde sicher aufgehoben.',
        type: 'optimal',
        trustChange: +25,
        stressChange: -10,
        vitalsEffect: { hr: 70, bpSys: 120, bpDia: 76, resp: 14 }
      },
      {
        id: 'c5_dump',
        text: 'Das Bett an der Schleuse abstellen, Akte aufs Bett werfen und sagen: „Hier ist die Meinhardt, Galle. Hat viel gejammert heute früh.“ und weggehen.',
        nextSceneId: 'success_end',
        feedback: 'Respektlose Übergabe, die das mühsam aufgebaute Vertrauen im letzten Augenblick beschädigt.',
        type: 'critical',
        trustChange: -35,
        stressChange: +20,
        vitalsEffect: { hr: 98, bpSys: 146, bpDia: 92, resp: 21 }
      }
    ]
  },

  success_end: {
    id: 'success_end',
    title: 'Simulationsende: Evaluation der Pflegeinterventionen',
    location: 'OP-Zentrum / Nachbesprechung',
    time: '08:25 Uhr',
    patientQuote: '„Dank der guten Betreuung bin ich ganz ruhig eingeschlafen.“',
    situationText: 'Frau Meinhardt wurde erfolgreich in die Narkose eingeleitet. Ihre Vitalwerte blieben stabil und die Anästhesie lobte die hervorragende präoperative Vorbereitung.',
    vitals: {
      hr: 70,
      bpSys: 120,
      bpDia: 76,
      resp: 14,
      sweat: 'Trocken',
      pupils: 'Normal'
    },
    choices: []
  }
};
