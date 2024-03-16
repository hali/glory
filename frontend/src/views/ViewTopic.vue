<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
    <div>
      <div class="container">
        <div class="row text-white">
          <h1 class="display-3  text-white">
            {{ topic.name }}
          </h1>
        </div>
        <div class="row text-white">
          <p class="col-md-12">
            <strong>{{ $t('authors') }}: </strong> 
            <badge
              v-for="char in episode_characters"
              :key="char.id"
              type="secondary"
            >
              <router-link
                :to="{
                  name: 'viewcharacter', 
                  params: { id:char.id }                              
                }"
              >
                {{ char.name }}
              </router-link>
            </badge>
          </p>
        </div>
        <div
          class="row text-white"
        >
          <p class="col-md-12">
            <strong>{{ $t('storyDescription') }}</strong>
          </p> 
          <div
            class="col-md-11 text-white"
            style="white-space:pre-wrap; text-justify: auto;"
            type="light"
            v-html="topic.description"
          />
          <div
            class="col-md-6"
            align="left"
          >
            <span
              v-if="current_player_id == topic.author_id" 
              class="col-md-3"
              align="left"
              @click="$router.push({ name: 'editepisode', params: { id: topic.id } })"
            ><base-button type="secondary">
              {{ $t('edit') }}
            </base-button></span>
            <span
              v-if="(topic.status == 'Черновик') && (current_player_id == topic.author_id)" 
              class="col-md-3"
              align="left"
              @click="publishDraft()"
            >
              <base-button type="secondary">
                {{ $t('publish') }}
              </base-button></span>
            
            <span
              v-if="(topic.status == 'В процессе') && (episode_players.includes(current_player_id))" 
              class="col-md-3" 
              @click="closeEpisode"
            ><base-button type="secondary">
              {{ $t('closeStory') }}
            </base-button></span>
            <span
              v-if="['Завершен', 'Черновик'].includes(topic.status) && (episode_players.includes(current_player_id))" 
              class="col-md-3" 
              @click="reopenEpisode"
            ><base-button type="secondary">
              {{ $t('openStory') }}
            </base-button></span>
          </div>
          <div
            class="col-md-6"
            align="right"
          >
            <base-button
              type="primary"
              @click.prevent="scrollToBottom()"
            >
              {{ $t('bottom') }}
            </base-button>
          </div>
        </div>
        <div>
          <p />
          <div
            v-for="(item, index) in posts"
            :key="item.id"
          >
            <card
              class="border-0"
              shadow
              body-classes="py-5"
              type="lighter"
            >
              <div class="row">
                <div
                  class="col-md-2"
                  align="left"
                >
                  <span>#{{ index + 1 }}</span>
                </div>
                <div
                  class="col-md-10"
                  align="right"
                >
                  <span>{{ $t('posted') }}: {{ item.added_time }}</span>
                </div>
              </div>
              <div
                :id="'#' + item.id"
                class="row"
              >
                <div class="col-md-2 card-profile-image">
                  <img
                    :src="`${item.img}`"
                    class="rounded-circle img-fluid"
                  >
                </div> 
                <div
                  class="col-md-8"
                  align="left"
                >
                  <p>{{ item.name }}</p><p>{{ $t('currentAge') }}: {{ item.age }}</p><p>{{ item.status }}</p>
                </div>
                <div
                  class="col-md-2"
                  align="right"
                >
                  <span
                    v-if="(topic.status == 'В процессе') && (current_player_id == item.player_id)"
                    @click="$router.push({ name: 'editpost', params: { id: item.id } })"
                  >
                    <base-button 
                      size="sm"
                      type="primary"
                      icon="fa fa-pencil"
                      title="Отредактировать"
                    />
                  </span>
                  <span
                    v-if="(index == posts.length - 1) && (topic.status == 'В процессе') && (current_player_id == item.player_id)"
                    @click="askForConfirmation(item.id)"
                  >
                    <base-button 
                      size="sm"
                      type="primary"
                      icon="fa fa-trash"
                      title="Удалить пост"
                    /></span>
                  <span
                    v-if="current_player_id != item.player_id"
                    @click="addComment(item.id)"
                  >
                    <base-button 
                      size="sm"
                      type="primary"
                      icon="fa fa-comment-o"
                      :title="$t('leaveFeedbackInstruction')"
                    /></span>
                </div>
              </div>
              <div
                style="white-space:pre-wrap; text-justify: auto;" 
              
                v-html="item.body"
              />
            </card>
            <p />   
          </div>                                         
        </div>
        <div class="row">
          <p />
          <div
            class="col-md-6"
            align="left"
          >
            <base-button
              v-if="!subscription_status"
              type="info"
              @click.prevent="subscribe()"
            >
              {{ $t('subscribe') }}
            </base-button>
            <base-button
              v-if="subscription_status"
              type="info"
              @click.prevent="unsubscribe()"
            >
              {{ $t('unsubscribe') }}
            </base-button>
            <p />
          </div>
          <div
            class="col-md-6"
            align="right"
          >
            <base-button
              type="primary"
              @click.prevent="scrollToTop()"
            >
              {{ $t('top') }}
            </base-button>
            <p />
          </div>
        </div>
        <div
          v-if="topic.status == 'В процессе'"
          class="row"
        >  
          <div class="col-md-12">
            <quill-editor
              v-model:content="new_post" 
              content-type="html" 
              :options="options"
              class="form-control rounded-0"
              style="height: 250px"
              ref="myEditor"
            />
          </div>
        </div>
        <p />
        <div class="row">
          <p />
        </div>
        <div
          v-if="topic.status == 'В процессе'"
          class="row"
        >
          <div
            class="col-md-6"
            align="left"
          >
            <multiselect
              v-model="current_character" 
              :options="characters" 
              :searchable="true" 
              :multiple="false"
              :close-on-select="true" 
              label="name"
              track-by="id"
              :show-labels="false"
              :placeholder="$t('selectCharacter')"
            />
          </div>  
          <div
            class="col-md-6"
            align="right"
          >
            <span @click="addPost(current_character.id)">
              <base-button type="success">
                {{ $t('post') }}
              </base-button>
            </span>
          </div>  
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { viewEpisode, getEpisodePosts, closeEpisode, reopenEpisode } from '../services/EpisodeService';
import { sendNotificationNewPost, addSubscription, deleteSubscription } from '../services/EmailService';
import { addPost, deletePost } from '../services/PostService';
import { getPlayer } from '../services/PlayerService';
import BaseButton from '@/components/BaseButton';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
//const UniqueSet = require('@sepiariver/unique-set');
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.css';
import 'dotenv/config';

export default {
    name: "ViewTopic",
    components: { BaseButton, QuillEditor, Multiselect },
    data() {
        return {
          subscription_status: false,
          topic: {
            id: this.$route.params.id,
            name: "Ищу соигрока в постапокалиптическую АУшку с матриархатом",
            description: "test test test",
            status: "Активно",
            author_id: 9
          },
          posts: [],
          branches: [],
          new_post: "",
          current_character: {id: 0, name: "  "},
          characters: [],
          episode_characters: [],
          episode_players: [],
          error: false,
          current_player_id: 0,
          email: '',
          url: '',
          options: {
            debug: 'warn',
            modules: {
              toolbar: [['bold', 'italic', 'underline', 'strike'],[{ 'color': [] }, { 'background': [] }], ['clean']]
            },
            readOnly: false,
            theme: 'snow'
          },
          timer: null
        };
      },
      async created() {
            const idToken = await this.$auth.tokenManager.get('idToken');
            this.claims = await Object.entries(idToken.claims).map(entry => ({ key: entry[0], value: entry[1] }));
            this.claims.forEach((value) => {
              if (value.key == 'email') this.email = value.value;
            });
            this.url = window.location.href;
            getPlayer(this.email).then(response => {
                if (response.length > 0) this.current_player_id = response[0].id;
                viewEpisode(this.topic.id).then(response => {
                    this.topic.name = response[0].name;
                    this.topic.description = response[0].description;
                    this.topic.status = response[0].status;
                    this.topic.author_id = response[0].author_id;
                    document.title = response[0].name;
                });
                /*getTopicPosts(this.topic.id).then(response => {
                    this.posts = response;
                    this.episode_players = [...new UniqueSet(response.map(a => a.player_id))];
                    if (location.hash) this.$nextTick(() => this.scrollToElement());
                });
                const subscription_payload = {
                  episode_id: this.topic.id,
                  player_id: this.current_player_id
                }
                checkSubscription(subscription_payload).then(response => {
                 if (response[0].c == 1) this.subscription_status = true;
                });*/
            });
        },
      methods: {
        scrollToElement() {
            document.getElementById(location.hash).scrollIntoView();
        },
        addPost(character) {
            let processed_text = this.new_post.replaceAll('-- ', '— ').replaceAll('- ', '— ').replaceAll('  ', ' ');
            const payload = {
                  body: processed_text,
                  added_time: (new Date().toISOString().slice(0, 19).replace('T', ' ')),
                  episode_id: this.topic.id,
                  author_id: character,
              };
              addPost(payload).then(status => {
                this.error = status > 299;
                if (!this.error) {
                    this.$refs.myEditor.setHTML('');
                    getEpisodePosts(this.topic.id).then(response => {
                        this.posts = response;
                        const notificationPayload = {
                          thread_name: this.topic.name,
                          episode_id: this.topic.id,
                          character_name: this.current_character.name,
                          thread_url: this.url,
                          post_text: processed_text,
                          player_id: this.current_player_id
                        };
                    
                        sendNotificationNewPost(notificationPayload);
                    });
                }                
              });
          },
        scrollToTop() {
           window.scrollTo(0,0);
          },
        scrollToBottom() {
          window.scrollTo(0, document.body.scrollHeight);
        },
        closeEpisode() {
          closeEpisode(this.topic.id).then(() => {this.$router.go()});
          
        },
        publishDraft() {
          reopenEpisode(this.topic.id).then(() => {this.$router.go()});
        },
        reopenEpisode() {
          reopenEpisode(this.topic.id).then(() => {this.$router.go()});
        },
        askForConfirmation(postId) {
          if (confirm("Правда удалить пост?")) {
            deletePost(postId).then(() => {
            getEpisodePosts(this.topic.id).then(response => {
                    this.posts = response;
                });
          });
          } 
        },
        subscribe() {
          const payload = {
            episode_id: this.topic.id,
            player_id: this.current_player_id
          };
          addSubscription(payload).then(() => this.subscription_status = true);
        },
        unsubscribe() {
          const payload = {
            episode_id: this.topic.id,
            player_id: this.current_player_id
          };
          deleteSubscription(payload).then(() => this.subscription_status = false);
        }
    }
};
</script>
<style>
</style>
