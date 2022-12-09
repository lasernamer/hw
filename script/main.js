"use strict";

const searchButton = document.querySelector('#search'),
    clearButton = document.querySelector('#clear'),
    formLabel = document.querySelector('#formLabel'),
    buttonWrapper = document.querySelector('.buttonWrapper');


searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    const inputDataValue = document.querySelector('#inputData'),
        inputDataTrimmedValue = inputDataValue.value.trim();
    if (inputDataTrimmedValue) {
        deleteResultElement();
        const result = returnMaxVowels(inputDataTrimmedValue)
        createElement(result);
        displayElement();
    } else {
        alert("Поле вводу порожнє")
        inputDataValue.value = '';
        hideElement();
        deleteResultElement();
    }
});

clearButton.addEventListener('click', (e) => {
    e.preventDefault();
    const inputDataValue = document.querySelector('#inputData');
    inputDataValue.value = '';
    hideElement();
    deleteResultElement();
});

const mapper = (text) => {
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
    const textObject = mapper(text);
    const maxKey = Math.max(...Object.keys(textObject));
    if (maxKey === 0) {
        return textEnum["404"];
    }
    return [...new Set(textObject[maxKey])];
};

const createElement = (result) => {
    const resultElement = document.createElement('div');
    if (typeof result === 'string') {
        resultElement.className = 'resultText flex column center';
        resultElement.innerHTML = `<span class="result">${result}</span>`;
    } else {
        resultElement.className = 'resultText flex column center';
        resultElement.innerHTML = `<span>${textEnum.FoundText}</span>
    <span class="result">${result.join(', \n')}</span>`;
    }
    formLabel.insertAdjacentElement('afterend', resultElement);
};

const hideElement = () => {
    if (clearButton.classList.contains('hidden')) {
        clearButton.classList.remove('hidden');
    }
    clearButton.classList.add('visible');
    buttonWrapper.classList.remove('space-evenly');
    buttonWrapper.classList.add('center');
    clearButton.className = 'hidden';
};

const displayElement = () => {
    if (clearButton.classList.contains('hidden')) {
        clearButton.classList.remove('hidden');
    }
    clearButton.classList.add('visible');
    buttonWrapper.classList.remove('center');
    buttonWrapper.classList.add('space-evenly');
};

const deleteResultElement = () => {
    const result = document.querySelector(".resultText");
    result ? result.remove() : '';
};
