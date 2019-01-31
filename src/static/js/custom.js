let v = {
    dnyPracovniVRoce: 251,
    dovolena: 20,
    dnyRealnePracovni: undefined,
    hodinovka: 300,
    hodinDenne: 5,
    nefakturovano: 80,
    nefakturovanoJednotka: "ročně",

    prijmy: undefined,
    pausal: "0.6",
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
    if (v.nefakturovanoJednotka === "ročně") {
        nefakturovanoJednotkaNum = 1;
    } else if (v.nefakturovanoJednotka === "měsíčně") {
        nefakturovanoJednotkaNum = 12;
    } else if (v.nefakturovanoJednotka === "denně") {
        nefakturovanoJednotkaNum = v.dnyRealnePracovni;
    }



    // Počítá příjem v roce, resp. spíš obrat
    v.prijmy = (v.hodinDenne * v.dnyRealnePracovni - (v.nefakturovano * nefakturovanoJednotkaNum)) * v.hodinovka;

    // Daňově uznatelné náklady počítané podle zadaného paušálu
    v.danNaklady = v.prijmy * (1 - Number(v.pausal))

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


const nefahodiny = document.getElementById("nefakturovano");
const nefajednotka = document.getElementById("nefakturovanoJednotka");

console.log(nefajednotka.value);

nefajednotka.addEventListener("change", function (event) {
  if (nefajednotka.value === "denně") {
    document.getElementById("nefakturovano").max = "8";
  } else {
    document.getElementById("nefakturovano").max = "1000000";

  }
});
