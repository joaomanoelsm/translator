"use strict";
const translator = document.querySelector('#translator__container');
const selects = document.querySelectorAll('.translator__global');
const menus = document.querySelectorAll('.translator__menu');
const translatorTextArea = document.querySelector('.translator__textarea-translate');
const translatedTextArea = document.querySelector('.translator__textarea-translated');
const translatorSwap = document.querySelector('#translator__swap');
const button = document.querySelector('#translator__button');
const countries = {
    "pt-BR": "Portuguese",
    "en-GB": "English",
    "es-ES": "Spanish",
    "ja-JP": "Japanese"
};
const changeMenuAnimation = (menu) => menu.classList.toggle('translator__menu--appearance');
const arrowToggle = (arrow) => arrow.classList.toggle('animation-arrow');
const menuToggle = (e) => {
    if (e.target.classList.contains('translator__viewer')) {
        changeMenuAnimation(e.target.parentNode.children[1]);
        arrowToggle(e.target.children[1]);
    }
};
selects.forEach(select => select.addEventListener('click', menuToggle));
menus.forEach((menu) => {
    menu.addEventListener('click', (e) => {
        if (!e.target.classList.contains('translator__menu')) {
            arrowToggle(e.target.parentNode.parentNode.children[0].children[1]);
            changeMenuAnimation(e.target.parentNode.parentNode.children[1]);
            e.target.parentNode.parentNode.children[0].children[0].innerHTML = e.target.innerHTML;
        }
    });
});
translatorSwap.addEventListener('click', () => {
    const textToTranslate = translator.children[0].children[0].children[0].children[0].innerHTML;
    const translatedText = translator.children[0].children[2].children[0].children[0].innerHTML;
    translator.children[0].children[0].children[0].children[0].innerHTML = translatedText;
    translator.children[0].children[2].children[0].children[0].innerHTML = textToTranslate;
    const textboxToTranslate = translatorTextArea.value;
    const translatedTextBox = translatedTextArea.value;
    translatorTextArea.value = translatedTextBox;
    translatedTextArea.value = textboxToTranslate;
    filterSelectedLanguage();
});
const filterSelectedLanguage = () => {
    let languageTranslator = translator.children[0].children[0].children[0].children[0].innerHTML;
    let languageTranslated = translator.children[0].children[2].children[0].children[0].innerHTML;
    const languageToTranslate = Object.entries(countries).filter((elem) => {
        if (elem[1] === languageTranslator)
            return elem[0];
    });
    const translatedLanguage = Object.entries(countries).filter((elem) => {
        if (elem[1] === languageTranslated)
            return elem[0];
    });
    if (translatorTextArea.value)
        loadTranslation(languageToTranslate[0][0], translatedLanguage[0][0]);
    return [languageToTranslate[0][0], translatedLanguage[0][0]];
};
button.addEventListener('click', filterSelectedLanguage);
translatorTextArea.onkeydown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        filterSelectedLanguage();
    }
};
const loadTranslation = (inputLanguage, outputLanguage) => {
    fetch(`https://api.mymemory.translated.net/get?q=${translatorTextArea.value}&langpair=${inputLanguage}|${outputLanguage}`)
        .then(response => response.json())
        .then(text => translatedTextArea.value = text.responseData.translatedText);
};
