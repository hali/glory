import { createI18n } from 'vue-i18n'


function getBrowserLocales() {

  const browserLocales =
    navigator.languages === undefined
      ? [navigator.language]
      : navigator.languages;
  if (!browserLocales) {
    return undefined;
  }
  let foundLanguage = null;
    browserLocales.forEach(function (currentString) {

        if (currentString.includes('ru') && !foundLanguage) {
            foundLanguage = 'ru';
        }

        if (currentString.includes('en') && !foundLanguage) {
            foundLanguage = 'en';
        }
    });
    if (!foundLanguage) foundLanguage = 'en';
    else foundLanguage = foundLanguage.split(/-|_/)[0];
      
    return foundLanguage;  
}

const i18n = createI18n({

  // default locale
    
  locale: getBrowserLocales(),

  // translations

  messages: {

    en: {

      newPosts: 'Latest updates',
      story: 'Story',
      messageAuthor: 'Character',
      messageTime: 'Time',
      createStoryMenu: 'New story',
      faq: 'F.A.Q.',
      stories: 'Stories',
      characters: 'Characters',
      playerHub: 'My Glory',
      player: 'Author',
      logout: 'Logout',
      login: 'Login',
      storyName: 'Story name:',
      tags: 'Tags:',
      warnings: 'Warnings:',
      storyTime: 'The date when story starts:',
      world: 'World description if needed:',
      storyDescription: 'Description of the story:',
      createDraft: 'Save as draft',
      createStoryButton: 'Create',
      stopFilteringBy: 'Stop filtering by ',
      showMyStories: 'Show my stories',
      stopFilteringByMine: 'Stop showing just my stories',
      noStoriesSorry: 'You don\'t have any stories yet. :-( Read stories by other players and join the fun!',
      stats: 'Stats',
      profile: 'Profile',
      feedbackFromMe: 'Feedback I gave',
      feedbackToMe: 'Feedback I got',
      debtsToMe: 'Waiting for a response',
      debtsFromMe: 'My turn',
      personalMessagesCount: 'Overall number of messages written to all the stories from all the characters',
      playerName: 'Player name (not to be confused with character name)',
      aboutMe: 'About/any writing preferences',
      postExample: 'Example of writing',
      save: 'Save',
      addCharacters: 'Add a character!',
      newCharacter: 'New character',
      characterName: 'Character name',
      characterDOB: 'Date of Birth',
      status: 'Motto/Short description',
      characterInfo: 'Information/Character background',
      addCharacter: 'Add a character',
      noFeedbackYet: 'No one left you any feedback yet. :-(',
      text: 'Message',
      from: 'From',
      when: 'When',
      to: 'To',
      forTheMessage: 'For the...',
      leaveFeedback: 'Leave some feedback on a post you like, and it will appear here!',
      noStories: 'This character isn\'t in any stories just yet. :-(',
      noStoriesPlayer: 'This author hasn\'t written any stories yet. :-(',
      authors: 'Authors',
      edit: 'EDIT',
      publish: 'PUBLISH',
      closeStory: 'Complete the story',
      openStory: 'Continue the story',
      bottom: 'DOWN',
      top: 'UP',
      posted: 'Posted',
      currentAge: 'Current age',
      leaveFeedbackInstruction: 'Leave feedback',
      subscribe: 'SUBSCRIBE',
      unsubscribe: 'UNSUBSCRIBE',
      post: 'POST',
      selectCharacter: 'Select a character',
      totalCharacters: 'Characters',
      totalStories: 'Stories',
      totalPosts: 'Posts',
      gloryTitle: 'Sanbantai\'s Glory',
      gloryDescription: 'A platform created by the TRPG author for other TRPG authors. This is not a forum: you don\'t need to nor are you able to socialize here. What you can do is write and co-write stories to your heart\'s content. :-)',
      quickStart: 'QUICK START',
      quickStartDetails: 'Register to get full access to the platform, it\'s fast and easy. No moderation, no need to write a character info or negotiate with moderators: you can just start playing. Registering to read is also fine.',
      navigation: 'INTUITIVE NAVIGATION',
      navigationDetails: 'Stories are grouped by characters, collections and players. You get a timeline within a collection automatically. Super easy to find and re-read something you know and love.',
      selfGovernance: 'SELF-GOVERNANCE',
      selfGovernanceDetails: 'Create, edit and complete your stories yourselves. Provide background info for your characters or don\'t. Write at a comfortable pace. Publish stories solo, or play with co-authors. Or you can just read, no one will say a word.'
    },

    ru: {

      newPosts: 'Свежие посты',
      story: 'Эпизод',
      messageAuthor: 'Автор поста',
      messageTime: 'Время поста',
      createStoryMenu: 'Открыть эпизод',
      faq: 'F.A.Q./Правила',
      stories: 'Эпизоды',
      characters: 'Персонажи',
      playerHub: 'Игрок',
      player: 'Игрок',
      logout: 'Выйти',
      login: 'Войти',
      storyName: 'Название эпизода:',
      tags: 'Коллекции:',
      warnings: 'Предупреждения:',
      storyTime: 'Время действия:',
      world: 'Сеттинг (игровой мир):',
      storyDescription: 'Описание эпизода:',
      createDraft: 'Черновик',
      createStoryButton: 'Открыть',
      stopFilteringBy: 'Сбросить фильтр по коллекции ',
      showMyStories: 'Показать мои эпизоды',
      stopFilteringByMine: 'Сбросить фильтр по моим эпизодам',
      noStoriesSorry: 'У вас пока нет эпизодов. :-( Почитайте чужие и присоединяйтесь к движухе!',
      stats: 'Статистика',
      profile: 'Профиль',
      feedbackFromMe: 'Фидбек мой',
      feedbackToMe: 'Фидбек мне',
      debtsToMe: 'Жду ответа',
      debtsFromMe: 'Мои долги',
      personalMessagesCount: 'Постов на сайте за всех персонажей в сумме выложено',
      playerName: 'Имя (для отображения на странице профиля игрока)',
      aboutMe: 'О себе/предпочтения в игре',
      postExample: 'Пример поста',
      save: 'Сохранить',
      addCharacters: 'Добавьте персонажей!',
      newCharacter: 'Новый персонаж',
      characterName: 'Имя персонажа',
      characterDOB: 'Дата рождения',
      status: 'Статус',
      characterInfo: 'Информация/Анкета',
      addCharacter: 'Добавить персонажа',
      noFeedbackYet: 'У вас пока нет фидбека. :-(',
      text: 'Текст',
      from: 'От кого',
      when: 'Когда',
      to: 'Кому',
      forTheMessage: 'По поводу',
      leaveFeedback: 'Додайте людям фидбека, и он здесь появится!',
      noStories: 'Нет эпизодов с этим персонажем. :-(',
      noStoriesPlayer: 'Нет эпизодов у этого игрока. :-(',
      authors: 'Участники',
      edit: 'РЕДАКТИРОВАТЬ',
      publish: 'ОПУБЛИКОВАТЬ',
      closeStory: 'Закрыть эпизод',
      openStory: 'Открыть эпизод',
      bottom: 'ВНИЗ',
      top: 'ВВЕРХ',
      posted: 'Пост добавлен',
      currentAge: 'Лет сейчас',
      leaveFeedbackInstruction: 'Оставить комментарий',
      subscribe: 'ПОДПИСАТЬСЯ',
      unsubscribe: 'ОТПИСАТЬСЯ',
      post: 'Добавить',
      selectCharacter: 'Выбери персонажа',
      totalCharacters: 'Персонажей',
      totalStories: 'Эпизодов',
      totalPosts: 'Постов',
      gloryTitle: 'Глори санбантая',
      gloryDescription: 'Сайт, созданный ролевиком для ролевиков, с минимумом драмы и максимумом удобства. Ура самоуправлению!',
      quickStart: 'БЫСТРЫЙ СТАРТ',
      quickStartDetails: 'Регистрация занимает пару минут и даёт полный доступ. Никаких анкет, танцев с внешками и административными темами и премодерации - начинайте играть сразу после регистрации. Или не начинайте. Здесь никто никого никуда не гонит.',
      navigation: 'УДОБНАЯ НАВИГАЦИЯ',
      navigationDetails: 'Организация эпизодов по веткам, персонажам и игрокам. Тэги. Автоматическая игровая хронология. Найти нужное или перечитать любимое еще никогда не было так просто.',
      selfGovernance: 'САМОУПРАВЛЕНИЕ',
      selfGovernanceDetails: 'Создавайте, редактируйте и закрывайте свои эпизоды самостоятельно. Пишите анкеты, или не пишите. Играйте с той скоростью, с которой комфортно, выкладывайте сольные эпизоды или не очень сольные. Или читайте молча - так тоже можно, да.'
    },

  },

})



export default i18n