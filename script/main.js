"use strict";
// перший рядок — використання суворого режиму, там свої приколи, якщо схочеш, то розкажу

// Тут відбувається селекція елементів DOM-дерева сайту, дом-дерево — це структура представлення HTML-документу для js(зокрема), де кожен тег — це окремий об'єкт
// можна побачити різницю між відбором, оскільки у вашому посібнику було надано відносно застарілу інфу про селекцію елементів за getElementBy__smthg
// то наголошую на тому, що використав querySelector, що є більш гнучким методом для відбору елементів за різними селекторами
// до прикладу відбір за id відбувався за допомогою додавання "#" перед назвою імені вузла, а відбір за класом через "."
const searchButton = document.querySelector('#search'),
    clearButton = document.querySelector('#clear'),
    formLabel = document.querySelector('#formLabel'),
    buttonWrapper = document.querySelector('.buttonWrapper');

// додаю до кнопки прослуховувач, я хз, як це інакше назвати, подій
// він дозволяє реагувати на різні події, які відбуваються з елементом, зокрема у цьому випадку "клік"
// іде утворення так званої стрілкової функції, аргументом якої я забираю "е", е — event, грубо кажучи, набір подій, які відбуваються з елементом
// це робиться для того, щоб потім при натисканні елементу у нас не перезавантажувалась сторінка
// хоча простір використання івента набагато більший, але це вже мова піде про делегування подій і навряд воно буде розглядатись у курсі

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    // вот про це я і казав, я попереджаю появу стандартної поведінки кнопки з типом "submit"
    const inputDataValue = document.querySelector('#inputData'),
        // отримую тут значення текстового поля та оператором trim() забираю пробіли з початку речення
        inputDataTrimmedValue = inputDataValue.value.trim();
    if (inputDataTrimmedValue) {
        // виклик функції для видалення блоку результату
        deleteResultElement();
        // декларую результат, який повертає функція returnMaxVowels
        const result = returnMaxVowels(inputDataTrimmedValue)
        // створюю елемент результату
        createElement(result);
        // відображаю кнопку
        displayElement();
    } else {
        // з*являється повідомлення про те, що поле вводу порожнє
        alert("Поле вводу порожнє")
        // очищую поле
        inputDataValue.value = '';
        // ховаю кнопку і видаляю блок результату
        hideElement();
        deleteResultElement();
    }
});

clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    // аналогічна логіка і тут
    // взагалі, можна було б це оформити в одну функцію окрему, щоб не повторюватись, бо це один з головних принципів програмування
    // і звучить він так: "DRY — Don't Repeat Yourself"
    const inputDataValue = document.querySelector('#inputData');
    inputDataValue.value = '';
    hideElement();
    deleteResultElement();
});

const mapper = (text) => {
    // мапер було пояснено окремо, проте за потреби продублюю
    const wordsObject = {};
    const words = text.split(" ");
    words.forEach(word => {
        const key = String((word.match(/[аеиіоуяюєїaeiou]/ig) || []).length);
        key in wordsObject ? wordsObject[key].push(word) : wordsObject[key] = new Array(word);
    });
    return wordsObject;
};

const textEnum = {
    FoundText: 'Найбільше голосних в: ',
    404: 'Відсутні голосні'
};

const returnMaxVowels = (text) => {
    //аналогічно
    const textObject = mapper(text);
    const maxKey = Math.max(...Object.keys(textObject));
    // тут додався фрагмент
    // якщо в об*єкті, який повернувся нам у результаті роботи функції маппер максимальний ключ 0, а це означає, що фактично голосних не було знайдено
    // то ми розуміємо, що треба повернути те, що нічого, власне, і не знайшли
    if (maxKey === 0) {
        //перевірка на максимальне значення
        // повертає оце значення: "Відсутні голосні"
        // це було оформлено як об*єкт, що є хорошою практикою для перевикористання текстів і для DRY
        return textEnum["404"];
    }
    // важливий момент: тут нема оператора "інше", а все тому, що функція, яка зайшла у той "іф" і поверне якесь значення
    // банально не дійде до останнього рядку в цій функції
    // щодо new Set
    // це для того, щоб забрати дублікати
    // сет — тип даних, важливою ознакою якого є те, що у ньому не буває однакових значень, тому це найпростіший метод
    // забрати дублікати
    return [...new Set(textObject[maxKey])];
};

const createElement = (result) => {
    // це ще одна саппорт-функція для того, щоб не сильно навантажувати основну функцію та в принципі це робиться для того, щоб
    // пізніше було простіше відстежувати помилки у коді, які виникають
    // я створюю тут елемент з тегом "div" та присвоюю його відповідній змінній
    const resultElement = document.createElement('div');

    // додаю класи, які були описані уже в стилях
    if (typeof result === 'string') {
        // що відбувається тут
        // у нас є 2 варіанти того, що поверне нам returnMaxVowels
        // 1) це рядок, де пише, що нічого не знайдено
        // 2) множину
        // тут я перевіряю тип даних, які нам приходять
        // якщо це рядок (а це означає, що ми нічого не знайшли), то створюється відповідний блок результату
        resultElement.className = 'resultText flex column center';
        resultElement.innerHTML = `<span class="result">${result}</span>`;
    } else {
        // якщо ж повертається множина, то тоді там буде уже фактичний результат того, що ми знайшли
        resultElement.className = 'resultText flex column center';
        resultElement.innerHTML = `<span>${textEnum.FoundText}</span>
    <span class="result">${result.join(', \n')}</span>`;
    }
    // додаю новостворений елемент ПІСЛЯ (afterend) елементу Label
    // щоб він відобразився перед блоку з кнопками
    formLabel.insertAdjacentElement('afterend', resultElement);
};

const hideElement = () => {
    // жонглювання класовими іменами для того, щоб сховати результат та кнопки й вирівняти елементи після зникнення кнопки
    // перевірка, чи на елементі існує вже клас з назвою hidden, якщо так, то ми просто забираємо його і далі жонглюємо
    if (clearButton.classList.contains('hidden')) {
        clearButton.classList.remove('hidden');
    }
    // додаю клас
    clearButton.classList.add('visible');
    // видаляю
    buttonWrapper.classList.remove('space-evenly');
    buttonWrapper.classList.add('center');
    clearButton.className = 'hidden';
};

const displayElement = () => {
    // аналогічне жонглювання
    if (clearButton.classList.contains('hidden')) {
        clearButton.classList.remove('hidden');
    }
    clearButton.classList.add('visible');
    buttonWrapper.classList.remove('center');
    buttonWrapper.classList.add('space-evenly');
};

const deleteResultElement = () => {
    // ще одна рутинна саппорт-функція
    // я шукаю тут у документі елемент з тією назвою
    const result = document.querySelector(".resultText");
    // тут ще одна магія мов програмування та абсолютний антипатерн, хоча і зручний
    // вітаймо тернарний оператор
    // простіше кажучи, це той самий if(result) { result.remove()} else {return ''}
    // просто без мам, пап, банків, смс і реєстрації
    // перше — це кондиція або ж вираз, з якого ми хочемо отримати значення (правда або ж неправда)
    // знак питання — це той if
    // наступний вираз — сценарій у випадку того, якщо кондиція дасть нам "ПРАВДУ"
    // двокрапка — це else
    // відповідно останній вираз — це те, що буде у випадку "НЕПРАВДИ"

    // тож, що вона робить?
    // вона видаляє елемент зі сторінки, якщо знаходить його, інакше — умовно нічого не робить
    result ? result.remove() : '';
}
