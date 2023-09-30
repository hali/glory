import { createI18n } from 'vue-i18n'



const i18n = createI18n({

  // default locale

  locale: 'en',



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
      gamer: 'My Glory',
      logout: 'Logout',
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
      gamer: 'Игрок',
      logout: 'Выйти',
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
      
    },

  },

})



export default i18n