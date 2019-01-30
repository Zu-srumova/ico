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
    danNaklady: undefined, // Nejsou ve formuláři, asi dodat, ideálně aby šly ručně přepsat
    odecitatelne: 0,
    slevaPoplatnik: 24840,
    zakladDane: undefined,
    slevaDalsi: 0,
    danSum: undefined,
    odvodySocialni: undefined,
    odvodyZdravotni: undefined,
    odvodySum: undefined,
    poZdaneni: undefined, // neni ve formulari

    odecistNaklady: 15800,
    penezKPouziti: undefined, // neni ve formulari
    odecistRezerva: 1.5,
    dnySuperpracovni: undefined, // pracovní dny v roce + rezerva vypočtená z rezervy

    cistehoRocne: undefined,
    cistehoMesicne: undefined,
    cistehoMD: undefined,

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
    v.poZdaneni = v.prijmy - v.odvodySum;



    // Kolik musíme odečíst - reálné náklady, teď neřešim rezervu
    v.penezKPouziti = v.poZdaneni - v.odecistNaklady;

    // Pracovní dny, na které peníze rozpočítáváme, tj. čas kolika pracovních dní reálně pokrýváme. Jsou to dny k dispozici + dovolená (= pracovní dny v roce) + pracovní dny odpovídající zvolenému počtu rezervních měsíců
    v.dnySuperpracovni = Math.round(v.dnyPracovniVRoce + (v.dnyPracovniVRoce / 12 * v.odecistRezerva));



    // Kolik je to kurňa mrňa čistého
    v.cistehoMD = Math.round(v.penezKPouziti / v.dnySuperpracovni);
    v.cistehoRocne = Math.round(v.cistehoMD * v.dnyPracovniVRoce); //Dodělat vzorec na odečet dovolený a rezervy
    v.cistehoMesicne = Math.round(v.cistehoRocne / 12);


    console.log(v);

    Object.entries(v).forEach(([key, value]) => {
        document.querySelector(`#${key}`).value = value;
      });




};

vypocitej();

let Miloš = (event) => {
    if (event.target.valueAsNumber === undefined) {
        v[event.target.id] = event.target.value;
    } else {
        v[event.target.id] = event.target.valueAsNumber;
    }    
    vypocitej();

};

document.querySelectorAll("input, select").forEach((item) => {
    item.addEventListener("change", Miloš);
});



