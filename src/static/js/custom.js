// Je to česky, protože to stejně použitelný jenom pro Čechy, plus spoustu těch termínů bych musela dohledávat (a asi mimo český kontext by měly i jiný význam). Sorry jako.

let v = {
    dnyPracovniVRoce: 251,
    dovolena: 20,
    dnyRealnePracovni: undefined,
    hodinovka: 300,
    hodinDenne: 5,
    nefakturovano: 80,
    nefakturovanoJednotka: "y",
    nefakturovanoRocne: undefined,

    prijmy: undefined,
    pausal30: 0.30,
    pausal40: 0.40,
    pausal60: 0.60,
    pausal80: 0.80,
    pausalNum: undefined, //přidávám, abych měla jak kalkulovat paušál
    danNaklady: undefined, //jsou tam dané tak, že nejdou zadat ručně; nebude dělat bordel, kdyby byly měnitelné?
    odecitatelne: 0,
    zakladDane: undefined,
    slevaPoplatnik: 24840,
    slevaDalsi: 0,
    danSum: undefined,
    odvodySocialni: undefined,
    odvodyZdravotni: undefined,
    odvodySum: undefined,
    PrijmyPoZdaneni: undefined,

    odecistNaklady: 0,
    penezKPouziti: undefined,
    odecistRezerva: 1.5,

    cistehoMD: undefined,
    cistehoRocne: undefined,
    cistehoMesicne: undefined,

    mzdaSuperhruba: undefined,
    mzdaHruba: undefined,
    mzdaCista: undefined,

    };

let vypocitej = () => {
    v.dnyRealnePracovni = v.dnyPracovniVRoce - v.dovolena;

    
        // Počet nefakturovaných hodin v roce (podle počtu pracovních dnů/měsíců)
    let nefakturovanoJednotkaNum;
    if (v.nefakturovanoJednotka === "y") {
        nefakturovanoJednotkaNum = 1;
    } else if (v.nefakturovanoJednotka === "m") {
        nefakturovanoJednotkaNum = 12;
    } else if (v.nefakturovanoJednotka === "d") {
        nefakturovanoJednotkaNum = v.dnyRealnePracovni;
    }

    console.log(nefakturovanoJednotkaNum);
    console.log(document.getElementById("pausal60").checked);

    // Počítá příjem v roce, resp. spíš obrat
    v.prijmy = (v.hodinDenne * v.dnyRealnePracovni - (v.nefakturovano * nefakturovanoJednotkaNum)) * v.hodinovka;

    v.nefakturovanoRocne = v.nefakturovano * nefakturovanoJednotkaNum;

    if (document.getElementById("pausal60").checked === true) {
        v.pausalNum = 0.60;
    } else if (document.getElementById("pausal30").checked === true) {
        v.pausalNum = 0.30;
    }  else if (document.getElementById("pausal40").checked === true) {
        v.pausalNum = 0.40;
    }  else if (document.getElementById("pausal80").checked === true) {
        v.pausalNum = 0.80;
    } 

    // Daňově uznatelné náklady počítané podle zadaného paušálu
    v.danNaklady = Math.round(v.prijmy * (1 - Number(v.pausalNum)));

    // Základ daně - příjmy minus odečitatelné položky (dary atp.)
    v.zakladDane = v.danNaklady - v.odecitatelne;

    // Počítá daň – 15 % ze základu daně minus poníženého o slevy a pak se odečte sleva na poplatníka. Když je to menší než nula, počítá se jako výsledek nula.
    v.danSum = Math.max(((v.zakladDane - v.slevaDalsi) * 0.15 - v.slevaPoplatnik), 0);

    // Vubec si nepamatuju, odkud jsou ty hodnoty stropů. Každopádně se to počítá z rozdílu příjmů a nákladů, ne ze základu daně.
    v.odvodySocialni = Math.round(0.292 * Math.max((v.prijmy - v.danNaklady) * 0.5, 98100));
    v.odvodyZdravotni = Math.round(0.135 * Math.max((v.prijmy - v.danNaklady) * 0.5, 196194));

    // Co celkem člověk odvede - daně, zdravotko, socka
    v.odvodySum = v.odvodySocialni + v.odvodyZdravotni + v.danSum;
    v.PrijmyPoZdaneni = v.prijmy - v.odvodySum;



    // Kolik musíme odečíst - reálné náklady, teď neřešim rezervu
    v.penezKPouziti = v.PrijmyPoZdaneni - v.odecistNaklady;

    // Pracovní dny, na které peníze rozpočítáváme, tj. čas kolika pracovních dní reálně pokrýváme. Jsou to dny k dispozici + dovolená (= pracovní dny v roce) + pracovní dny odpovídající zvolenému počtu rezervních měsíců
    let dnySuperpracovni = Math.round(v.dnyPracovniVRoce + (v.dnyPracovniVRoce / 12 * v.odecistRezerva));



    // Kolik je to kurňa mrňa čistého
    v.cistehoMD = Math.round(v.penezKPouziti / dnySuperpracovni);
    v.cistehoRocne = Math.round(v.cistehoMD * v.dnyPracovniVRoce); //Dodělat vzorec na odečet dovolený a rezervy
    v.cistehoMesicne = Math.round(v.cistehoRocne / 12);



    // A konečně porovnání s tou čistou mzdou na HPP
    v.mzdaCista = v.cistehoMesicne;
    v.mzdaHruba = Math.round(1.451 * v.mzdaCista - 2984);
    v.mzdaSuperhruba = Math.round(1.34 * v.mzdaHruba);

    console.log(v);


    // Nahází vypočtené hodnoty z objektu zpátky do formuláře
    Object.entries(v).forEach(([key, value]) => {
        document.querySelector(`#${key}`).value = value;
        // console.log(key, document.querySelector(`#${key}`))
      });
};

vypocitej();


// Miloš zachytí změnu na políčkách ve formuláři a spustí počítání
let Miloš = (event) => {
    if (event.target.valueAsNumber === undefined) {
        v[event.target.id] = event.target.value;
    } else {
        v[event.target.id] = event.target.valueAsNumber;
    }    
    vypocitej();
};


// Inputům a selectům nastaví, aby, když se jejich hodnota změní, spustili Miloše
document.querySelectorAll("input, select").forEach((item) => {
    item.addEventListener("change", Miloš);
});


// Validation

const nefahodiny = document.getElementById("nefakturovano");
const nefajednotka = document.getElementById("nefakturovanoJednotka");
const hDenne = document.getElementById("hodinDenne");



// Validace: Nesmyslný počet nefakturovaných hodin vzhledem k časové jednotce, za kterou jsou vykonávány
nefajednotka.addEventListener("change", function (event) {
  if (v.nefakturovanoJednotka === "d") {
    document.getElementById("nefakturovano").max = 8;
  } else {
    document.getElementById("nefakturovano").max = v.hodinRocne;
  }
  validateNefa();
});

// Když se změněj hodiny, spusť validaci
nefahodiny.addEventListener("change", function (event) {
    validateNefa();
});

let validateNefa = () => {
    if (v.nefakturovano > nefahodiny.max) {  //heeej, tohle funguje.
        document.getElementById("valiNefa1").style.display = "block";
    } else {
        document.getElementById("valiNefa1").style.display = "none";
    }

    // Příliš mnoho nefakturované práce
    let hodinRocne = v.hodinDenne * v.dnyRealnePracovni;
    if (v.nefakturovanoRocne >= hodinRocne) {
        document.getElementById("nefakturovano").max = hodinRocne;
        document.getElementById("valiNefa2").style.display = "block";
    } else {
        document.getElementById("valiNefa2").style.display = "none";
        console.log(`hodin Rocne ${hodinRocne}`);

    }
};



